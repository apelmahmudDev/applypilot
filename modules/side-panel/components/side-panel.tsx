import { useEffect, useMemo, useState } from "react";

import { useSystemTheme } from "@/hooks/use-system-theme";
import {
	createJobInStorage,
	getStoredJobs,
	saveJobToStorage,
	type StoredJob,
} from "@/lib/jobs/storage";
import { cn } from "@/lib/utils";
import { JobFormPanel } from "@/modules/side-panel/components/job-form-panel";
import { useSidePanelDetection } from "@/modules/side-panel/hooks/use-side-panel-detection";
import { emptyJobForm, reminders } from "@/modules/side-panel/mock-data";
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
	const [completedReminderIds, setCompletedReminderIds] = useState<string[]>([]);
	const [isSaving, setIsSaving] = useState(false);
	const [saveError, setSaveError] = useState("");
	const [saveMessage, setSaveMessage] = useState("");
	const [activeForm, setActiveForm] = useState<{
		mode: "add" | "edit";
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
	const selectedReminder = useMemo(
		() => reminders.find((reminder) => reminder.id === selectedReminderId) ?? null,
		[selectedReminderId],
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
	const visibleReminders = useMemo(() => {
		return reminders.filter((reminder) => {
			const isCompleted = completedReminderIds.includes(reminder.id);

			if (reminderFilter === "Completed") return isCompleted;
			if (reminderFilter === "Upcoming") {
				return !isCompleted && !reminder.time.toLowerCase().startsWith("today");
			}

			return !isCompleted && reminder.time.toLowerCase().startsWith("today");
		});
	}, [completedReminderIds, reminderFilter]);

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
			const result = await saveJobToStorage({
				title: job.title,
				company: job.company,
				location: job.location,
				url: job.url,
				platform: job.platform,
				status: nextStatusByStatus[job.status],
				notes: job.notes,
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

	const markReminderDone = (reminderId: string) => {
		setCompletedReminderIds((currentIds) =>
			currentIds.includes(reminderId)
				? currentIds
				: [...currentIds, reminderId],
		);
	};

	const openAddJobForm = () => {
		setActiveForm({ mode: "add", job: emptyJobForm });
	};

	return (
		<main
			className={cn(
				"h-screen min-h-[640px] w-full overflow-hidden p-2 transition-colors",
				isDarkMode ? "bg-[#202020] text-slate-100" : "bg-slate-50 text-slate-950",
			)}
		>
			<div
				className={cn(
					"flex h-full flex-col overflow-hidden rounded-xl border transition-colors",
					isDarkMode
						? "border-slate-700/55 bg-[#262628] shadow-[0_18px_60px_rgba(0,0,0,0.18)]"
						: "border-slate-200/80 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.07)]",
				)}
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
							setActiveForm({ mode: "edit", job: toSidePanelJobForm(job) })
						}
						onStatusChange={handleCycleJobStatus}
					/>
				) : panelView === "reminderDetails" ? (
					<ReminderDetailsView
						reminder={selectedReminder}
						isCompleted={
							selectedReminder
								? completedReminderIds.includes(selectedReminder.id)
								: false
						}
						isDarkMode={isDarkMode}
						onBack={() => setPanelView(detailsBackView)}
						onMarkDone={markReminderDone}
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
						completedReminderIds={completedReminderIds}
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
						completedReminderIds={completedReminderIds}
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
