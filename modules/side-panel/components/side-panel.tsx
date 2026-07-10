import { useEffect, useMemo, useState } from "react";

import { useSystemTheme } from "@/hooks/use-system-theme";
import {
	createJobInStorage,
	deleteJobFromStorage,
	getStoredJobs,
	saveJobToStorage,
	updateJobInStorage,
	type StoredJob,
} from "@/lib/jobs/storage";
import { cn } from "@/lib/utils";
import { JobFormPanel } from "@/modules/side-panel/components/job-form-panel";
import { useSidePanelDetection } from "@/modules/side-panel/hooks/use-side-panel-detection";
import { emptyJobForm } from "@/modules/side-panel/mock-data";
import type {
	ApplicationFilter,
	DetailsBackView,
	ReminderFilter,
	SidePanelJobForm,
	SidePanelView,
} from "@/modules/side-panel/types";
import { nextStatusByStatus } from "@/modules/side-panel/utils/constants";
import {
	mapJobStatus,
	mapStoredJobToRecentJob,
	toSidePanelJobForm,
	toStoredJobForm,
} from "@/modules/side-panel/utils/job-mappers";
import {
	compareReminders,
	isReminderUpcoming,
	mapStoredJobToReminder,
} from "@/modules/side-panel/utils/reminders";
import { AllApplicationsView } from "@/modules/side-panel/views/all-applications-view";
import { AllRemindersView } from "@/modules/side-panel/views/all-reminders-view";
import { HomeView } from "@/modules/side-panel/views/home-view";
import { JobDetailsView } from "@/modules/side-panel/views/job-details-view";
import { ReminderDetailsView } from "@/modules/side-panel/views/reminder-details-view";
import { SettingsView } from "@/modules/side-panel/views/settings-view";

export function SidePanel() {
	const { isDarkMode } = useSystemTheme();
	const [storedJobs, setStoredJobs] = useState<StoredJob[]>([]);
	const [panelView, setPanelView] = useState<SidePanelView>("home");
	const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
	const [selectedReminderId, setSelectedReminderId] = useState<string | null>(
		null,
	);
	const [detailsBackView, setDetailsBackView] = useState<DetailsBackView>("home");
	const [applicationSearch, setApplicationSearch] = useState("");
	const [applicationFilter, setApplicationFilter] =
		useState<ApplicationFilter>("All");
	const [applicationSort, setApplicationSort] = useState("latest");
	const [reminderFilter, setReminderFilter] = useState<ReminderFilter>("Today");
	const [isSaving, setIsSaving] = useState(false);
	const [saveError, setSaveError] = useState("");
	const [saveMessage, setSaveMessage] = useState("");
	const [activeForm, setActiveForm] = useState<{
		mode: "add" | "edit";
		jobId?: string;
		job: SidePanelJobForm;
	} | null>(null);
	const {
		job: detectedJob,
		isDetecting,
		error: detectionError,
		confidence,
		retryDetection,
	} = useSidePanelDetection();

	useEffect(() => {
		let isMounted = true;

		async function loadJobs() {
			const jobs = await getStoredJobs();

			if (isMounted) {
				setStoredJobs(jobs);
			}
		}

		loadJobs();

		const handleStorageChange: Parameters<
			typeof browser.storage.onChanged.addListener
		>[0] = (changes, areaName) => {
			if (areaName === "local" && changes["applypilot.jobs"]) {
				loadJobs();
			}
		};

		browser.storage.onChanged.addListener(handleStorageChange);

		return () => {
			isMounted = false;
			browser.storage.onChanged.removeListener(handleStorageChange);
		};
	}, []);

	const displayedJobs = useMemo(
		() => storedJobs.slice(0, 5).map(mapStoredJobToRecentJob),
		[storedJobs],
	);
	const selectedJob = useMemo(
		() => storedJobs.find((job) => job.id === selectedJobId) ?? null,
		[selectedJobId, storedJobs],
	);
	const allApplicationJobs = useMemo(() => {
		const search = applicationSearch.trim().toLowerCase();

		return storedJobs
			.filter((job) => {
				const status = mapJobStatus(job.status);
				const matchesFilter =
					applicationFilter === "All" || status === applicationFilter;
				const matchesSearch =
					!search ||
					[job.title, job.company, job.location, job.notes]
						.join(" ")
						.toLowerCase()
						.includes(search);

				return matchesFilter && matchesSearch;
			})
			.sort((firstJob, secondJob) => {
				if (applicationSort === "company") {
					return firstJob.company.localeCompare(secondJob.company);
				}

				if (applicationSort === "status") {
					return mapJobStatus(firstJob.status).localeCompare(
						mapJobStatus(secondJob.status),
					);
				}

				return (
					new Date(secondJob.updatedAt).getTime() -
					new Date(firstJob.updatedAt).getTime()
				);
			});
	}, [applicationFilter, applicationSearch, applicationSort, storedJobs]);
	const reminders = useMemo(
		() =>
			storedJobs
				.map(mapStoredJobToReminder)
				.filter((reminder) => reminder !== null)
				.sort(compareReminders),
		[storedJobs],
	);
	const completedReminders = useMemo(
		() =>
			storedJobs
				.filter((job) => job.reminderEnabled && job.reminderDone && job.followUpDate)
				.map((job) => {
					const baseReminder = mapStoredJobToReminder({
						...job,
						reminderDone: false,
					});

					if (!baseReminder) {
						return null;
					}

					return {
						...baseReminder,
						isCompleted: true,
						statusLabel: "Completed",
						statusTone: "completed" as const,
					};
				})
				.filter((reminder) => reminder !== null)
				.sort(compareReminders),
		[storedJobs],
	);
	const visibleReminders = useMemo(() => {
		if (reminderFilter === "Completed") {
			return completedReminders;
		}

		if (reminderFilter === "Upcoming") {
			return reminders.filter(isReminderUpcoming);
		}

		return reminders.filter((reminder) => !isReminderUpcoming(reminder));
	}, [completedReminders, reminderFilter, reminders]);
	const selectedReminder = useMemo(
		() =>
			[...reminders, ...completedReminders].find(
				(reminder) => reminder.id === selectedReminderId,
			) ?? null,
		[completedReminders, reminders, selectedReminderId],
	);

	const savedCount = storedJobs.length;
	const appliedCount = storedJobs.filter((job) => job.status === "Applied").length;
	const interviewCount = storedJobs.filter(
		(job) => job.status === "Interviewing",
	).length;

	const handleSaveJob = async (job: SidePanelJobForm) => {
		setIsSaving(true);
		setSaveError("");
		setSaveMessage("");

		try {
			const result =
				activeForm?.mode === "add"
					? await createJobInStorage(toStoredJobForm(job))
					: activeForm?.jobId
						? await updateJobInStorage(activeForm.jobId, toStoredJobForm(job))
						: await saveJobToStorage(toStoredJobForm(job));
			setStoredJobs((currentJobs) => {
				const withoutSavedJob = currentJobs.filter(
					(currentJob) => currentJob.id !== result.job.id,
				);

				return [result.job, ...withoutSavedJob];
			});
			setSaveMessage(
				result.action === "updated"
					? "Saved changes to this job."
					: "Saved this job locally.",
			);
			setActiveForm(null);
		} catch {
			setSaveError("Could not save this job. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	const handleCycleJobStatus = async (job: StoredJob) => {
		try {
			const result = await updateJobInStorage(job.id, {
				...job,
				status: nextStatusByStatus[job.status],
			});

			setStoredJobs((currentJobs) =>
				currentJobs.map((currentJob) =>
					currentJob.id === result.job.id ? result.job : currentJob,
				),
			);
		} catch {
			setSaveError("Could not update this job. Please try again.");
		}
	};

	const handleDeleteJob = async (job: StoredJob) => {
		const shouldDelete = window.confirm(
			`Delete "${job.title || "this job"}"? This cannot be undone.`,
		);

		if (!shouldDelete) {
			return;
		}

		try {
			const deleted = await deleteJobFromStorage(job.id);

			if (!deleted) {
				setSaveError("Could not delete this job. Please try again.");
				return;
			}

			setStoredJobs((currentJobs) =>
				currentJobs.filter((currentJob) => currentJob.id !== job.id),
			);
			setSelectedJobId(null);
			setPanelView(detailsBackView);
			setSaveMessage("Deleted this job.");
		} catch {
			setSaveError("Could not delete this job. Please try again.");
		}
	};

	const openJobDetails = (jobId: string, backView: DetailsBackView) => {
		setSelectedJobId(jobId);
		setDetailsBackView(backView);
		setPanelView("jobDetails");
	};

	const openReminderDetails = (
		reminderId: string,
		backView: DetailsBackView,
	) => {
		setSelectedReminderId(reminderId);
		setDetailsBackView(backView);
		setPanelView("reminderDetails");
	};

	const markReminderDone = async (reminderId: string) => {
		const reminderJob = storedJobs.find((job) => job.id === reminderId);

		if (!reminderJob) {
			return;
		}

		try {
			const result = await updateJobInStorage(reminderJob.id, {
				...reminderJob,
				reminderDone: true,
			});

			setStoredJobs((currentJobs) =>
				currentJobs.map((currentJob) =>
					currentJob.id === result.job.id ? result.job : currentJob,
				),
			);
		} catch {
			setSaveError("Could not mark this reminder as done. Please try again.");
		}
	};

	const removeReminder = async (reminderId: string) => {
		const reminderJob = storedJobs.find((job) => job.id === reminderId);

		if (!reminderJob) {
			return;
		}

		try {
			const result = await updateJobInStorage(reminderJob.id, {
				...reminderJob,
				followUpDate: "",
				followUpTime: "",
				reminderNote: "",
				reminderEnabled: false,
				reminderDone: false,
			});

			setStoredJobs((currentJobs) =>
				currentJobs.map((currentJob) =>
					currentJob.id === result.job.id ? result.job : currentJob,
				),
			);
			if (selectedReminderId === reminderId) {
				setPanelView(detailsBackView);
			}
		} catch {
			setSaveError("Could not remove this reminder. Please try again.");
		}
	};

	const openAddJobForm = () => {
		setActiveForm({ mode: "add", job: emptyJobForm });
	};

	return (
		<main
			className="h-screen min-h-[640px] w-full overflow-hidden bg-background p-2 text-foreground transition-colors"
		>
			<div
			className="flex h-full flex-col overflow-hidden rounded-[14px] border border-border bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors"
			>
				{activeForm ? (
					<JobFormPanel
						mode={activeForm.mode}
						initialJob={activeForm.job}
						isDarkMode={isDarkMode}
						onCancel={() => setActiveForm(null)}
						onSave={handleSaveJob}
					/>
				) : panelView === "jobDetails" ? (
					<JobDetailsView
						job={selectedJob}
						isDarkMode={isDarkMode}
						onBack={() => setPanelView(detailsBackView)}
						onEdit={(job) =>
							setActiveForm({
								mode: "edit",
								jobId: job.id,
								job: toSidePanelJobForm(job),
							})
						}
						onStatusChange={handleCycleJobStatus}
						onDelete={handleDeleteJob}
						onUpdateReminder={(job) =>
							setActiveForm({
								mode: "edit",
								jobId: job.id,
								job: toSidePanelJobForm(job),
							})
						}
						onRemoveReminder={removeReminder}
					/>
				) : panelView === "reminderDetails" ? (
					<ReminderDetailsView
						reminder={selectedReminder}
						isDarkMode={isDarkMode}
						onBack={() => setPanelView(detailsBackView)}
						onMarkDone={markReminderDone}
						onRemoveReminder={removeReminder}
					/>
				) : panelView === "applications" ? (
					<AllApplicationsView
						jobs={allApplicationJobs}
						search={applicationSearch}
						filter={applicationFilter}
						sort={applicationSort}
						isDarkMode={isDarkMode}
						onBack={() => setPanelView("home")}
						onSearchChange={setApplicationSearch}
						onFilterChange={setApplicationFilter}
						onSortChange={setApplicationSort}
						onStatusChange={handleCycleJobStatus}
						onOpenJob={(job) => openJobDetails(job.id, "applications")}
					/>
				) : panelView === "reminders" ? (
					<AllRemindersView
						reminders={visibleReminders}
						filter={reminderFilter}
						isDarkMode={isDarkMode}
						onBack={() => setPanelView("home")}
						onFilterChange={setReminderFilter}
						onOpenReminder={(reminder) =>
							openReminderDetails(reminder.id, "reminders")
						}
						onMarkDone={markReminderDone}
					/>
				) : panelView === "settings" ? (
					<SettingsView isDarkMode={isDarkMode} onBack={() => setPanelView("home")} />
				) : (
					<HomeView
						isDarkMode={isDarkMode}
						displayedJobs={displayedJobs}
						reminders={reminders}
						detectedJob={detectedJob}
						isDetecting={isDetecting}
						detectionError={detectionError}
						confidence={confidence}
						saveMessage={saveMessage}
						saveError={saveError}
						isSaving={isSaving}
						savedCount={savedCount}
						appliedCount={appliedCount}
						interviewCount={interviewCount}
						onAddJob={openAddJobForm}
						onEditDetectedJob={() => {
							if (detectedJob) {
								setActiveForm({ mode: "edit", job: detectedJob });
							}
						}}
						onSaveDetectedJob={() => {
							if (detectedJob) {
								void handleSaveJob(detectedJob);
							}
						}}
						onRetryDetection={retryDetection}
						onOpenJob={(jobId) => openJobDetails(jobId, "home")}
						onOpenReminder={(reminderId) =>
							openReminderDetails(reminderId, "home")
						}
						onOpenApplications={() => setPanelView("applications")}
						onOpenReminders={() => setPanelView("reminders")}
						onOpenSettings={() => setPanelView("settings")}
						onMarkReminderDone={markReminderDone}
					/>
				)}
			</div>
		</main>
	);
}
