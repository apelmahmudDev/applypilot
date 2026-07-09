import {
	AlertCircle,
	Bookmark,
	CalendarDays,
	CheckCircle2,
	ChevronRight,
	CircleUserRound,
	ExternalLink,
	Grid2X2,
	Link,
	MapPin,
	Moon,
	MoreVertical,
	PencilLine,
	PlusCircle,
	RefreshCw,
	Search,
	Send,
	Settings,
	Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { useSystemTheme } from "@/hooks/use-system-theme";
import {
	createJobInStorage,
	getStoredJobs,
	saveJobToStorage,
	type StoredJob,
} from "@/lib/jobs/storage";
import { openDashboard } from "@/lib/open-dashboard";
import { cn } from "@/lib/utils";
import { JobFormPanel } from "@/modules/side-panel/components/job-form-panel";
import { useSidePanelDetection } from "@/modules/side-panel/hooks/use-side-panel-detection";
import { emptyJobForm, reminders } from "@/modules/side-panel/mock-data";
import type {
	JobStatus,
	RecentJob,
	SidePanelJobForm,
	SidePanelJobStatus,
} from "@/modules/side-panel/types";

const statusStyles: Record<JobStatus, string> = {
	Applied: "border-blue-400/20 bg-blue-500/15 text-blue-300",
	Interview: "border-amber-400/20 bg-amber-500/15 text-amber-300",
	Saved: "border-slate-400/15 bg-slate-500/15 text-slate-300",
};

const lightStatusStyles: Record<JobStatus, string> = {
	Applied: "border-blue-100 bg-blue-50 text-blue-600",
	Interview: "border-amber-100 bg-amber-50 text-amber-600",
	Saved: "border-slate-100 bg-slate-50 text-slate-500",
};

const brandStyles: Record<RecentJob["brand"], string> = {
	amazon: "bg-[#111827] text-white before:bg-blue-500",
	microsoft: "bg-slate-950 text-white",
	swiggy: "bg-orange-500 text-white",
	google: "bg-white text-slate-950",
	default: "bg-blue-600 text-white",
};

export function SidePanel() {
	const { isDarkMode } = useSystemTheme();
	const [storedJobs, setStoredJobs] = useState<StoredJob[]>([]);
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

	return (
		<main
			className={cn(
				"h-screen min-h-[720px] w-full overflow-hidden p-2 transition-colors",
				isDarkMode ? "bg-[#202020] text-slate-100" : "bg-[#f8fafc] text-slate-950",
			)}
		>
			<div
				className={cn(
					"flex h-full flex-col overflow-hidden rounded-lg border transition-colors",
					isDarkMode
						? "border-slate-700/55 bg-[#262628] shadow-[0_18px_60px_rgba(0,0,0,0.18)]"
						: "border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]",
				)}
			>
				<header className="flex shrink-0 items-center justify-between px-5 pb-4 pt-5">
					<div className="flex items-center gap-3">
						<Send
							className="size-7 fill-indigo-500 stroke-indigo-300"
							aria-hidden="true"
						/>
						<h1
							className={cn(
								"text-xl font-bold tracking-normal",
								isDarkMode ? "text-white" : "text-slate-950",
							)}
						>
							ApplyPilot
						</h1>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						className={cn(
							isDarkMode
								? "text-slate-300 hover:bg-[#303032] hover:text-white"
								: "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
						)}
						aria-label="Open settings"
						title="Settings"
					>
						<Settings className="size-5" aria-hidden="true" />
					</Button>
				</header>

				{activeForm ? (
					<JobFormPanel
						mode={activeForm.mode}
						initialJob={activeForm.job}
						isDarkMode={isDarkMode}
						onCancel={() => setActiveForm(null)}
						onSave={handleSaveJob}
					/>
				) : (
					<>
				<div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4">
					<div
						className={cn(
							"flex h-10 items-center gap-3 rounded-lg border px-3 transition-colors",
							isDarkMode
								? "border-slate-700/70 bg-[#262628] text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
								: "border-slate-200 bg-white text-slate-500 shadow-[0_8px_22px_rgba(15,23,42,0.06)]",
						)}
					>
						<Search className="size-4 shrink-0" aria-hidden="true" />
						<span className="min-w-0 flex-1 truncate text-sm">
							Search jobs, companies, notes...
						</span>
						<kbd
							className={cn(
								"rounded-md border px-2 py-0.5 text-[11px] font-medium",
								isDarkMode
									? "border-slate-700 bg-[#262628] text-slate-500"
									: "border-slate-200 bg-white text-slate-500",
							)}
						>
							Ctrl K
						</kbd>
						<span className={cn("h-5 w-px", isDarkMode ? "bg-slate-700" : "bg-slate-200")} />
						<button
							type="button"
							className={cn(
								"flex shrink-0 items-center gap-1.5 text-xs font-medium",
								isDarkMode
									? "text-indigo-300 hover:text-indigo-200"
									: "text-blue-600 hover:text-blue-700",
							)}
							onClick={() => setActiveForm({ mode: "add", job: emptyJobForm })}
						>
							<PlusCircle className="size-3.5" aria-hidden="true" />
							Add Job
						</button>
					</div>

					<section className="space-y-3">
						<div className="flex items-center gap-3 px-1">
							<Sparkles className="size-4 text-cyan-300" aria-hidden="true" />
							<h2 className={cn("text-sm font-semibold", isDarkMode ? "text-white" : "text-slate-950")}>
								Detected on this page
							</h2>
						</div>
						<div
							className={cn(
								"rounded-lg border p-4 transition-colors",
								isDarkMode
									? "border-slate-700/75 bg-[#262628] shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
									: "border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.07)]",
							)}
						>
							{isDetecting ? (
								<DetectionMessage
									icon={RefreshCw}
									title="Detecting job details"
									description="Reading visible job information from the active tab."
									isDarkMode={isDarkMode}
									isLoading
								/>
							) : detectedJob ? (
								<>
									{confidence === "low" && (
										<p
											className={cn(
												"mb-3 rounded-md border px-3 py-2 text-xs font-medium",
												isDarkMode
													? "border-amber-400/20 bg-amber-500/10 text-amber-200"
													: "border-amber-100 bg-amber-50 text-amber-700",
											)}
										>
											Review the detected details before saving.
										</p>
									)}
									{saveMessage && (
										<p
											className={cn(
												"mb-3 rounded-md border px-3 py-2 text-xs font-medium",
												isDarkMode
													? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
													: "border-emerald-100 bg-emerald-50 text-emerald-700",
											)}
										>
											{saveMessage}
										</p>
									)}
									{saveError && (
										<p
											className={cn(
												"mb-3 rounded-md border px-3 py-2 text-xs font-medium",
												isDarkMode
													? "border-red-400/20 bg-red-500/10 text-red-200"
													: "border-red-100 bg-red-50 text-red-700",
											)}
										>
											{saveError}
										</p>
									)}
									<div className="flex gap-4">
										<CompanyMark brand={getBrand(detectedJob.company, detectedJob.platform)} size="lg" />
										<div className="min-w-0 flex-1">
											<h3 className={cn("truncate text-base font-bold", isDarkMode ? "text-white" : "text-slate-950")}>
												{detectedJob.title || "Untitled role"}
											</h3>
											<p className={cn("mt-1 truncate text-sm font-medium", isDarkMode ? "text-slate-300" : "text-slate-700")}>
												{detectedJob.company || "Unknown company"}
											</p>
											<p className={cn("mt-2 flex items-center gap-1.5 text-xs", isDarkMode ? "text-slate-400" : "text-slate-500")}>
												<MapPin className="size-3.5 shrink-0" aria-hidden="true" />
												<span className="truncate">
													{detectedJob.location || "Location not found"}
												</span>
											</p>
											{detectedJob.url && (
												<a
													href={detectedJob.url}
													target="_blank"
													rel="noreferrer"
													className={cn(
														"mt-2 flex min-w-0 items-center gap-2 text-xs font-medium",
														isDarkMode
															? "text-blue-300 hover:text-blue-200"
															: "text-blue-600 hover:text-blue-700",
													)}
												>
													<Link className="size-3.5 shrink-0" aria-hidden="true" />
													<span className="truncate">{formatDisplayUrl(detectedJob.url)}</span>
													<ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
												</a>
											)}
										</div>
									</div>

									<div className="mt-5 grid grid-cols-2 gap-3">
										<Button
											type="button"
											variant="outline"
											className={cn(
												"h-10 rounded-md text-sm font-semibold",
												isDarkMode
													? "border-slate-600/70 bg-[#262628] text-slate-100 hover:bg-[#303032] hover:text-white"
													: "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
											)}
											onClick={() =>
												setActiveForm({ mode: "edit", job: detectedJob })
											}
										>
											<PencilLine className="size-4" aria-hidden="true" />
											Edit Details
										</Button>
										<Button
											type="button"
											className="h-10 rounded-md bg-blue-600 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(37,99,235,0.26)] hover:bg-blue-500"
											disabled={isSaving}
											onClick={() => handleSaveJob(detectedJob)}
										>
											<PlusCircle className="size-4" aria-hidden="true" />
											{isSaving ? "Saving..." : "Save Job"}
										</Button>
									</div>
								</>
							) : (
								<>
									<DetectionMessage
										icon={detectionError ? AlertCircle : Sparkles}
										title={detectionError ? "Detection failed" : "No job detected"}
										description={
											detectionError ||
											"Open a job page or add the application details manually."
										}
										isDarkMode={isDarkMode}
									/>
									<div className="mt-5 grid grid-cols-2 gap-3">
										<Button
											type="button"
											variant="outline"
											className={cn(
												"h-10 rounded-md text-sm font-semibold",
												isDarkMode
													? "border-slate-600/70 bg-[#262628] text-slate-100 hover:bg-[#303032] hover:text-white"
													: "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
											)}
											onClick={retryDetection}
										>
											<RefreshCw className="size-4" aria-hidden="true" />
											Retry
										</Button>
										<Button
											type="button"
											className="h-10 rounded-md bg-blue-600 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(37,99,235,0.26)] hover:bg-blue-500"
											onClick={() => setActiveForm({ mode: "add", job: emptyJobForm })}
										>
											<PlusCircle className="size-4" aria-hidden="true" />
											Add Manually
										</Button>
									</div>
								</>
							)}
						</div>
					</section>

					<section
						className={cn(
							"grid grid-cols-3 rounded-lg border py-3 transition-colors",
							isDarkMode
								? "border-slate-700/65 bg-[#262628]"
								: "border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
						)}
					>
						<StatItem icon={Bookmark} value={String(savedCount)} label="Saved" isDarkMode={isDarkMode} />
						<StatItem icon={CheckCircle2} value={String(appliedCount)} label="Applied" bordered isDarkMode={isDarkMode} />
						<StatItem icon={CalendarDays} value={String(interviewCount)} label="Interview" bordered isDarkMode={isDarkMode} />
					</section>

					<ListHeader title="Recent Jobs" isDarkMode={isDarkMode} />
					<section
						className={cn(
							"overflow-hidden rounded-lg border transition-colors",
							isDarkMode
								? "border-slate-700/65 bg-[#262628]"
								: "border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
							)}
					>
						{displayedJobs.map((job) => (
							<RecentJobRow key={job.id} job={job} isDarkMode={isDarkMode} />
						))}
						{!displayedJobs.length && (
							<p className={cn("px-3 py-4 text-sm", isDarkMode ? "text-slate-400" : "text-slate-500")}>
								No saved jobs yet.
							</p>
						)}
					</section>

					<ListHeader title="Today's Reminders" isDarkMode={isDarkMode} />
					<section
						className={cn(
							"overflow-hidden rounded-lg border transition-colors",
							isDarkMode
								? "border-slate-700/65 bg-[#262628]"
								: "border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
						)}
					>
						{reminders.map((reminder) => {
							const Icon = reminder.icon;

							return (
								<div
									key={reminder.id}
									className={cn(
										"flex items-center gap-3 border-b px-3 py-3 last:border-b-0",
										isDarkMode ? "border-slate-800/85" : "border-slate-100",
									)}
								>
									<div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
										<Icon className="size-5" aria-hidden="true" />
									</div>
									<div className="min-w-0 flex-1">
										<h3 className={cn("truncate text-sm font-semibold", isDarkMode ? "text-white" : "text-slate-950")}>
											{reminder.company} - {reminder.title}
										</h3>
										<p className={cn("truncate text-xs", isDarkMode ? "text-slate-400" : "text-slate-500")}>
											{reminder.description}
										</p>
										<p
											className={cn(
												"mt-1 text-xs font-medium",
												isDarkMode ? "text-blue-300" : "text-blue-600",
											)}
										>
											{reminder.time}
										</p>
									</div>
									<Button
										type="button"
										variant="outline"
										size="sm"
										className={cn(
											"h-8 rounded-md px-3 text-xs",
											isDarkMode
												? "border-slate-600/70 bg-[#262628] text-slate-200 hover:bg-[#303032] hover:text-white"
												: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
										)}
									>
										Mark Done
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										className={cn(
											isDarkMode
												? "text-slate-400 hover:bg-[#303032] hover:text-white"
												: "text-slate-500 hover:bg-slate-100 hover:text-slate-950",
										)}
										aria-label="Reminder actions"
										title="Actions"
									>
										<MoreVertical className="size-4" aria-hidden="true" />
									</Button>
								</div>
							);
						})}
					</section>

					<button
						type="button"
						className={cn(
							"flex w-full items-center gap-3 rounded-lg border p-3 text-left transition",
							isDarkMode
								? "border-slate-700/65 bg-[#262628] hover:bg-[#303032]"
								: "border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:bg-slate-50",
						)}
						onClick={openDashboard}
					>
						<div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
							<Grid2X2 className="size-5" aria-hidden="true" />
						</div>
						<div className="min-w-0 flex-1">
							<h2 className={cn("truncate text-sm font-semibold", isDarkMode ? "text-white" : "text-slate-950")}>
								Open Full Dashboard
							</h2>
							<p className={cn("truncate text-xs", isDarkMode ? "text-slate-400" : "text-slate-500")}>
								View analytics, export data, and more
							</p>
						</div>
						<ChevronRight className={cn("size-4", isDarkMode ? "text-slate-400" : "text-slate-500")} aria-hidden="true" />
					</button>
				</div>

				<footer
					className={cn(
						"flex shrink-0 items-center justify-between border-t px-5 py-3",
						isDarkMode ? "border-slate-800/80" : "border-slate-200",
					)}
				>
					<div className="flex min-w-0 items-center gap-3">
						<CircleUserRound className="size-8 shrink-0 text-indigo-300" aria-hidden="true" />
						<span className={cn("truncate text-sm font-medium", isDarkMode ? "text-slate-200" : "text-slate-700")}>
							Apel Mahmud
						</span>
					</div>
					<button
						type="button"
						className={cn(
							"flex items-center gap-2 rounded-md text-sm font-medium transition",
							isDarkMode ? "text-slate-300" : "text-slate-700",
						)}
						aria-pressed={isDarkMode}
						title="Uses your system theme"
					>
						<Moon
							className={cn(
								"size-4",
								isDarkMode ? "text-indigo-300" : "text-blue-600",
							)}
							aria-hidden="true"
						/>
						System Mode
						<span
							className={cn(
								"relative h-6 w-11 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] transition-colors",
								isDarkMode ? "bg-indigo-600" : "bg-slate-200",
							)}
						>
							<span
								className={cn(
									"absolute top-1 size-4 rounded-full bg-white transition-all",
									isDarkMode ? "right-1" : "left-1",
								)}
							/>
						</span>
					</button>
				</footer>
					</>
				)}
			</div>
		</main>
	);
}

function ListHeader({ title, isDarkMode }: { title: string; isDarkMode: boolean }) {
	return (
		<div className="flex items-center justify-between px-1 pt-1">
			<h2 className={cn("text-sm font-semibold", isDarkMode ? "text-white" : "text-slate-950")}>{title}</h2>
			<button
				type="button"
				className={cn(
					"flex items-center gap-1 text-xs font-medium",
					isDarkMode
						? "text-slate-400 hover:text-slate-200"
						: "text-slate-500 hover:text-slate-900",
				)}
			>
				View all
				<ChevronRight className="size-3" aria-hidden="true" />
			</button>
		</div>
	);
}

function DetectionMessage({
	icon: Icon,
	title,
	description,
	isDarkMode,
	isLoading = false,
}: {
	icon: typeof Sparkles;
	title: string;
	description: string;
	isDarkMode: boolean;
	isLoading?: boolean;
}) {
	return (
		<div className="flex items-start gap-3">
			<div
				className={cn(
					"flex size-11 shrink-0 items-center justify-center rounded-lg",
					isDarkMode
						? "bg-indigo-500/15 text-indigo-200"
						: "bg-blue-50 text-blue-600",
				)}
			>
				<Icon
					className={cn("size-5", isLoading && "animate-spin")}
					aria-hidden="true"
				/>
			</div>
			<div className="min-w-0 flex-1">
				<h3
					className={cn(
						"text-sm font-semibold",
						isDarkMode ? "text-white" : "text-slate-950",
					)}
				>
					{title}
				</h3>
				<p
					className={cn(
						"mt-1 text-xs leading-5",
						isDarkMode ? "text-slate-400" : "text-slate-500",
					)}
				>
					{description}
				</p>
			</div>
		</div>
	);
}

function StatItem({
	icon: Icon,
	value,
	label,
	bordered = false,
	isDarkMode,
}: {
	icon: typeof Bookmark;
	value: string;
	label: string;
	bordered?: boolean;
	isDarkMode: boolean;
}) {
	return (
		<div
			className={cn(
				"flex items-center justify-center gap-3 px-2",
				bordered && (isDarkMode ? "border-l border-slate-700/65" : "border-l border-slate-200"),
			)}
		>
			<Icon className="size-5 text-indigo-300" aria-hidden="true" />
			<div>
				<p className={cn("text-lg font-bold leading-5", isDarkMode ? "text-white" : "text-slate-950")}>{value}</p>
				<p className={cn("text-[11px] font-medium", isDarkMode ? "text-slate-400" : "text-slate-500")}>{label}</p>
			</div>
		</div>
	);
}

function RecentJobRow({ job, isDarkMode }: { job: RecentJob; isDarkMode: boolean }) {
	return (
		<div
			className={cn(
				"grid grid-cols-[48px_minmax(0,1fr)_74px_84px] items-center gap-2 border-b px-3 py-2.5 last:border-b-0",
				isDarkMode ? "border-slate-800/85" : "border-slate-100",
			)}
		>
			<CompanyMark brand={job.brand} />
			<div className="min-w-0">
				<h3 className={cn("truncate text-sm font-semibold", isDarkMode ? "text-white" : "text-slate-950")}>{job.title}</h3>
				<p className={cn("truncate text-xs", isDarkMode ? "text-slate-400" : "text-slate-500")}>
					{job.company} - {job.location}
				</p>
			</div>
			<span
				className={cn(
					"justify-self-start rounded-md border px-2 py-1 text-[11px] font-semibold",
					isDarkMode ? statusStyles[job.status] : lightStatusStyles[job.status],
				)}
			>
				{job.status}
			</span>
			<div className="min-w-0 text-right">
				<p className={cn("truncate text-xs", isDarkMode ? "text-slate-400" : "text-slate-500")}>{job.date}</p>
				<p
					className={cn(
						"mt-1 truncate text-xs font-medium",
						isDarkMode
							? job.followUp === "Today"
								? "text-emerald-300"
								: "text-blue-300"
							: job.followUp === "Today"
								? "text-emerald-600"
								: "text-blue-600",
						job.followUp.includes("1d") &&
							(isDarkMode ? "text-amber-300" : "text-amber-600"),
					)}
				>
					{job.followUp}
				</p>
			</div>
		</div>
	);
}

function CompanyMark({
	brand,
	size = "sm",
}: {
	brand: RecentJob["brand"];
	size?: "sm" | "lg";
}) {
	const sizeClass = size === "lg" ? "size-[72px] rounded-lg text-4xl" : "size-9 rounded-md text-xl";

	if (brand === "microsoft") {
		return (
			<div
				className={cn(
					"grid shrink-0 grid-cols-2 gap-0.5 bg-slate-950",
					sizeClass,
					size === "lg" ? "p-3" : "p-1",
				)}
			>
				<span className="bg-red-500" />
				<span className="bg-green-500" />
				<span className="bg-blue-500" />
				<span className="bg-yellow-400" />
			</div>
		);
	}

	const label =
		brand === "amazon"
			? "a"
			: brand === "swiggy"
				? "S"
				: brand === "google"
					? "G"
					: "A";

	return (
		<div
			className={cn(
				"relative flex shrink-0 items-center justify-center font-bold",
				sizeClass,
				brandStyles[brand],
				brand === "amazon" &&
					"after:absolute after:bottom-1 after:h-0.5 after:w-5 after:rounded-full after:bg-orange-400",
			)}
		>
			{label}
		</div>
	);
}

function mapStoredJobToRecentJob(job: StoredJob): RecentJob {
	return {
		id: job.id,
		title: job.title || "Untitled role",
		company: job.company || "Unknown company",
		location: job.location || "Unknown location",
		date: formatDate(job.updatedAt),
		followUp: "Saved locally",
		status: mapJobStatus(job.status),
		brand: getBrand(job.company, job.platform),
	};
}

function mapJobStatus(status: StoredJob["status"]): JobStatus {
	if (status === "Applied") return "Applied";
	if (status === "Interviewing") return "Interview";
	return "Saved";
}

function getBrand(company: string, platform: string): RecentJob["brand"] {
	const value = `${company} ${platform}`.toLowerCase();

	if (value.includes("google")) return "google";
	if (value.includes("microsoft")) return "microsoft";
	if (value.includes("amazon")) return "amazon";
	if (value.includes("swiggy")) return "swiggy";

	return "default";
}

function formatDate(value: string) {
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return "";
	}

	return new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	}).format(date);
}

function toStoredJobForm(job: SidePanelJobForm): Parameters<typeof saveJobToStorage>[0] {
	return {
		title: job.title,
		company: job.company,
		location: job.location,
		url: job.url,
		platform: job.platform,
		status: mapSidePanelStatus(job.status),
		notes: job.notes,
	};
}

function mapSidePanelStatus(status: SidePanelJobStatus) {
	if (status === "Interview") return "Interviewing";
	if (status === "Saved") return "Saved";
	if (status === "Applied") return "Applied";
	return "Interested";
}

function formatDisplayUrl(url: string) {
	try {
		const parsedUrl = new URL(url);
		return `${parsedUrl.hostname.replace(/^www\./, "")}${parsedUrl.pathname}`;
	} catch {
		return url;
	}
}
