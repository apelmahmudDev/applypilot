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
	PencilLine,
	PlusCircle,
	RefreshCw,
	Search,
	Settings,
	Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { openDashboard } from "@/lib/open-dashboard";
import { cn } from "@/lib/utils";
import { CompanyMark } from "@/modules/side-panel/components/company-mark";
import { DetectionMessage } from "@/modules/side-panel/components/detection-message";
import { ListHeader } from "@/modules/side-panel/components/list-header";
import { RecentJobRow } from "@/modules/side-panel/components/recent-job-row";
import { ReminderManagementRow } from "@/modules/side-panel/components/reminder-management-row";
import { StatItem } from "@/modules/side-panel/components/stat-item";
import type {
	RecentJob,
	Reminder,
	SidePanelJobForm,
} from "@/modules/side-panel/types";
import { formatDisplayUrl } from "@/modules/side-panel/utils/format";
import { getBrand } from "@/modules/side-panel/utils/job-mappers";
import { lightCardShadow } from "@/modules/side-panel/utils/styles";

type HomeViewProps = {
	isDarkMode: boolean;
	displayedJobs: RecentJob[];
	reminders: Reminder[];
	completedReminderIds: string[];
	detectedJob: SidePanelJobForm | null;
	isDetecting: boolean;
	detectionError: string;
	confidence: "high" | "medium" | "low" | null;
	saveMessage: string;
	saveError: string;
	isSaving: boolean;
	savedCount: number;
	appliedCount: number;
	interviewCount: number;
	onAddJob: () => void;
	onEditDetectedJob: () => void;
	onSaveDetectedJob: () => void;
	onRetryDetection: () => void;
	onOpenJob: (jobId: string) => void;
	onOpenReminder: (reminderId: string) => void;
	onOpenApplications: () => void;
	onOpenReminders: () => void;
	onOpenSettings: () => void;
	onMarkReminderDone: (reminderId: string) => void;
};

export function HomeView({
	isDarkMode,
	displayedJobs,
	reminders,
	completedReminderIds,
	detectedJob,
	isDetecting,
	detectionError,
	confidence,
	saveMessage,
	saveError,
	isSaving,
	savedCount,
	appliedCount,
	interviewCount,
	onAddJob,
	onEditDetectedJob,
	onSaveDetectedJob,
	onRetryDetection,
	onOpenJob,
	onOpenReminder,
	onOpenApplications,
	onOpenReminders,
	onOpenSettings,
	onMarkReminderDone,
}: HomeViewProps) {
	return (
		<>
			<div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 pb-4 pt-0 sm:px-4">
				<div
					className={cn(
						"sticky top-0 z-10 -mx-3 flex items-center gap-2 border-b px-3 py-3 backdrop-blur sm:-mx-4 sm:px-4",
						isDarkMode
							? "border-slate-800/80 bg-[#262628]/95"
							: "border-slate-200/80 bg-white/95",
					)}
				>
					<div
						className={cn(
							"flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border px-3 transition-colors focus-within:ring-3 focus-within:ring-blue-500/20",
							isDarkMode
								? "border-slate-700/70 bg-[#202020] text-slate-400"
								: "border-slate-200 bg-slate-50 text-slate-500",
						)}
					>
						<Search className="size-4 shrink-0" aria-hidden="true" />
						<span className="min-w-0 flex-1 truncate text-sm font-medium">
							Search jobs, companies, notes...
						</span>
						<kbd
							className={cn(
								"hidden rounded-md border px-1.5 py-0.5 text-[10px] font-semibold min-[380px]:inline",
								isDarkMode
									? "border-slate-700 bg-[#262628] text-slate-500"
									: "border-slate-200 bg-white text-slate-500",
							)}
						>
							Ctrl K
						</kbd>
					</div>
					<button
						type="button"
						className={cn(
							"flex h-10 shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-500/25 active:translate-y-px",
							isDarkMode
								? "bg-blue-500 text-white hover:bg-blue-400"
								: "bg-blue-600 text-white shadow-[0_6px_14px_rgba(37,99,235,0.22)] hover:bg-blue-700",
						)}
						aria-label="Add job"
						title="Add job"
						onClick={onAddJob}
					>
						<PlusCircle className="size-4" aria-hidden="true" />
						<span className="hidden min-[340px]:inline">Add Job</span>
					</button>
				</div>

				<section className="space-y-2.5">
					<div className="flex items-center gap-3 px-1">
						<Sparkles className={cn("size-4", isDarkMode ? "text-cyan-300" : "text-blue-600")} aria-hidden="true" />
						<h2 className={cn("text-sm font-bold", isDarkMode ? "text-white" : "text-slate-950")}>
							Detected on this page
						</h2>
					</div>
					<div
						className={cn(
							"rounded-xl border p-4 transition-colors",
							isDarkMode
								? "border-slate-700/75 bg-[#262628] shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
								: "border-slate-200/80 bg-white",
							!isDarkMode && lightCardShadow,
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
								<div className="flex gap-3">
									<CompanyMark brand={getBrand(detectedJob.company, detectedJob.platform)} size="lg" />
									<div className="min-w-0 flex-1">
										<h3 className={cn("truncate text-[15px] font-bold leading-5", isDarkMode ? "text-white" : "text-slate-950")}>
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
											"h-10 rounded-lg text-sm font-semibold",
											isDarkMode
												? "border-slate-600/70 bg-[#262628] text-slate-100 hover:bg-[#303032] hover:text-white"
												: "border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
										)}
										onClick={onEditDetectedJob}
									>
										<PencilLine className="size-4" aria-hidden="true" />
										Edit Details
									</Button>
									<Button
										type="button"
										className="h-10 rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(37,99,235,0.24)] hover:bg-blue-700 disabled:shadow-none"
										disabled={isSaving}
										onClick={onSaveDetectedJob}
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
											"h-10 rounded-lg text-sm font-semibold",
											isDarkMode
												? "border-slate-600/70 bg-[#262628] text-slate-100 hover:bg-[#303032] hover:text-white"
												: "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
										)}
										onClick={onRetryDetection}
									>
										<RefreshCw className="size-4" aria-hidden="true" />
										Retry
									</Button>
									<Button
										type="button"
										className="h-10 rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(37,99,235,0.24)] hover:bg-blue-700"
										onClick={onAddJob}
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
						"grid grid-cols-3 rounded-xl border py-3 transition-colors",
						isDarkMode
							? "border-slate-700/65 bg-[#262628]"
							: "border-slate-200/80 bg-white",
						!isDarkMode && lightCardShadow,
					)}
				>
					<StatItem icon={Bookmark} value={String(savedCount)} label="Saved" isDarkMode={isDarkMode} />
					<StatItem icon={CheckCircle2} value={String(appliedCount)} label="Applied" bordered isDarkMode={isDarkMode} />
					<StatItem icon={CalendarDays} value={String(interviewCount)} label="Interview" bordered isDarkMode={isDarkMode} />
				</section>

				<ListHeader
					title="Recent Jobs"
					isDarkMode={isDarkMode}
					onViewAll={onOpenApplications}
				/>
				<section
					className={cn(
						"overflow-hidden rounded-xl border transition-colors",
						isDarkMode
							? "border-slate-700/65 bg-[#262628]"
							: "border-slate-200/80 bg-white",
						!isDarkMode && lightCardShadow,
					)}
				>
					{displayedJobs.map((job) => (
						<RecentJobRow
							key={job.id}
							job={job}
							isDarkMode={isDarkMode}
							onOpen={() => onOpenJob(job.id)}
						/>
					))}
					{!displayedJobs.length && (
						<div className="px-4 py-5">
							<div
								className={cn(
									"mx-auto flex max-w-[280px] flex-col items-center text-center",
									isDarkMode ? "text-slate-300" : "text-slate-600",
								)}
							>
								<div
									className={cn(
										"mb-3 flex size-11 items-center justify-center rounded-lg",
										isDarkMode
											? "bg-blue-500/15 text-blue-200"
											: "bg-blue-50 text-blue-600",
									)}
								>
									<Bookmark className="size-5" aria-hidden="true" />
								</div>
								<h3
									className={cn(
										"text-sm font-bold",
										isDarkMode ? "text-white" : "text-slate-950",
									)}
								>
									No recent jobs yet
								</h3>
								<p
									className={cn(
										"mt-1 text-xs leading-5",
										isDarkMode ? "text-slate-400" : "text-slate-500",
									)}
								>
									Jobs you save will apppear here for quick access
								</p>
							</div>
						</div>
					)}
				</section>

				<ListHeader
					title="Today's Reminders"
					isDarkMode={isDarkMode}
					onViewAll={onOpenReminders}
				/>
				<section
					className={cn(
						"overflow-hidden rounded-xl border transition-colors",
						isDarkMode
							? "border-slate-700/65 bg-[#262628]"
							: "border-slate-200/80 bg-white",
						!isDarkMode && lightCardShadow,
					)}
				>
					{reminders.map((reminder) => (
						<ReminderManagementRow
							key={reminder.id}
							reminder={reminder}
							isCompleted={completedReminderIds.includes(reminder.id)}
							isDarkMode={isDarkMode}
							showActions
							onOpen={() => onOpenReminder(reminder.id)}
							onMarkDone={() => onMarkReminderDone(reminder.id)}
						/>
					))}
				</section>

				<button
					type="button"
					className={cn(
						"flex w-full items-center gap-3 rounded-xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-500/20 active:translate-y-px",
						isDarkMode
							? "border-slate-700/65 bg-[#262628] hover:bg-[#303032]"
							: "border-slate-200/80 bg-white hover:bg-slate-50",
						!isDarkMode && lightCardShadow,
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
					"sticky bottom-0 z-10 flex shrink-0 items-center justify-between border-t px-4 py-3 backdrop-blur",
					isDarkMode ? "border-slate-800/80 bg-[#262628]/95" : "border-slate-200/80 bg-white/95",
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
						"flex size-10 items-center justify-center rounded-lg border transition",
						isDarkMode
							? "border-slate-700 bg-[#262628] text-slate-300 hover:bg-[#303032] hover:text-white"
							: "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950",
					)}
					aria-label="Open settings"
					title="Settings"
					onClick={onOpenSettings}
				>
					<Settings className="size-5" aria-hidden="true" />
				</button>
			</footer>
		</>
	);
}
