import {
	AlertCircle,
	Bookmark,
	CalendarDays,
	CheckCircle2,
	ChevronRight,
	ExternalLink,
	Grid2X2,
	Brain,
	Link,
	LoaderCircle,
	MapPin,
	PencilLine,
	PlusCircle,
	RefreshCw,
	Sparkles,
} from "lucide-react";

import {
	UserIdentityBadge,
	useUserIdentity,
} from "@/components/user-identity-badge";
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

type HomeViewProps = {
	isDarkMode: boolean;
	displayedJobs: RecentJob[];
	reminders: Reminder[];
	detectedJob: SidePanelJobForm | null;
	isDetecting: boolean;
	detectionError: string;
	confidence: "high" | "medium" | "low" | null;
	isAnalyzing: boolean;
	isAnalysisAvailable: boolean;
	isSaving: boolean;
	savedCount: number;
	appliedCount: number;
	interviewCount: number;
	onAddJob: () => void;
	onEditDetectedJob: () => void;
	onAnalyzeDetectedJob: () => void;
	onSaveDetectedJob: () => void;
	onRetryDetection: () => void;
	onOpenJob: (jobId: string) => void;
	onOpenReminder: (reminderId: string) => void;
	onOpenApplications: () => void;
	onOpenReminders: () => void;
	onMarkReminderDone: (reminderId: string) => void;
};

export function HomeView({
	isDarkMode,
	displayedJobs,
	reminders,
	detectedJob,
	isDetecting,
	detectionError,
	confidence,
	isAnalyzing,
	isAnalysisAvailable,
	isSaving,
	savedCount,
	appliedCount,
	interviewCount,
	onAddJob,
	onEditDetectedJob,
	onAnalyzeDetectedJob,
	onSaveDetectedJob,
	onRetryDetection,
	onOpenJob,
	onOpenReminder,
	onOpenApplications,
	onOpenReminders,
	onMarkReminderDone,
}: HomeViewProps) {
	const userIdentity = useUserIdentity();
	const detectedJobMeta = [
		detectedJob?.workplaceType,
		detectedJob?.employmentType,
	]
		.filter(Boolean)
		.join(" · ");

	return (
		<>
			<div className="relative flex min-h-0 flex-1 flex-col">
				<div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 pb-10 pt-0 sm:px-4">
					<div
						className={cn(
							"sticky top-0 z-10 -mx-3 flex items-center justify-between gap-3 border-b border-slate-100 px-3 py-3 backdrop-blur sm:-mx-4 sm:px-4",
							"bg-white dark:bg-background",
						)}
					>
						<div className="flex min-w-0 items-center gap-3">
							<UserIdentityBadge
								identity={userIdentity}
								className="size-9 text-[11px]"
							/>
							<div className="min-w-0">
								<p className="truncate text-sm font-semibold text-foreground">
									{userIdentity.name}
								</p>
								<p className="truncate text-xs text-muted-foreground">
									{userIdentity.role}
								</p>
							</div>
						</div>
						<Button
							type="button"
							className={cn(
								"flex h-10 shrink-0 items-center gap-1.5 rounded-md px-4 text-xs font-semibold",
							)}
							aria-label="Add job"
							title="Add job"
							onClick={onAddJob}
						>
							<PlusCircle className="size-4" aria-hidden="true" />
							<span className="hidden min-[340px]:inline">Add Job</span>
						</Button>
					</div>

					<section className="space-y-2.5">
						<div className="flex items-center gap-3 px-1">
							<Sparkles className="size-4 text-primary" aria-hidden="true" />
							<h2 className="text-sm font-bold text-foreground">
								Detected on this page
							</h2>
						</div>
						<div className="rounded-[14px] border border-border bg-card p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors">
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
												"border-[#FFF7E6] bg-[#FFF7E6] text-[#C66A00]",
											)}
										>
											Review the detected details before saving.
										</p>
									)}
									<div className="flex gap-3">
										<CompanyMark
											brand={getBrand(
												detectedJob.company,
												detectedJob.platform,
											)}
											logoUrl={detectedJob.logoUrl}
											companyName={detectedJob.company}
											size="lg"
											appearance="soft"
										/>
										<div className="min-w-0 flex-1">
											<h3 className="truncate text-[15px] font-bold leading-5 text-foreground">
												{detectedJob.title || "Untitled role"}
											</h3>
											<p className="mt-1 truncate text-sm font-medium text-muted-foreground">
												{detectedJob.company || "Unknown company"}
											</p>
											<p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
												<MapPin
													className="size-3.5 shrink-0"
													aria-hidden="true"
												/>
												<span className="truncate">
													{detectedJob.location || "Location not found"}
												</span>
											</p>
											{detectedJobMeta && (
												<p className="mt-1 truncate text-xs font-medium text-muted-foreground">
													{detectedJobMeta}
												</p>
											)}
											{detectedJob.url && (
												<a
													href={detectedJob.url}
													target="_blank"
													rel="noreferrer"
													className={cn(
														"mt-2 flex min-w-0 items-center gap-2 text-xs font-medium",
														"text-primary hover:opacity-90",
													)}
												>
													<Link
														className="size-3.5 shrink-0"
														aria-hidden="true"
													/>
													<span className="truncate">
														{formatDisplayUrl(detectedJob.url)}
													</span>
													<ExternalLink
														className="size-3.5 shrink-0"
														aria-hidden="true"
													/>
												</a>
											)}
										</div>
									</div>

									<div className="mt-5 space-y-3">
										{isAnalysisAvailable && (
											<Button
												type="button"
												variant="outline"
												className={cn(
													"h-10 w-full rounded-[14px] text-sm font-semibold",
													"border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200 dark:hover:bg-blue-500/15",
												)}
												disabled={isAnalyzing}
												onClick={onAnalyzeDetectedJob}
											>
												{isAnalyzing ? (
													<LoaderCircle
														className="size-4 animate-spin"
														aria-hidden="true"
													/>
												) : (
													<Brain className="size-4" aria-hidden="true" />
												)}
												{isAnalyzing
													? "Analyzing Job Page..."
													: "Analyze Job Page"}
											</Button>
										)}
										<div className="grid grid-cols-2 gap-3">
											<Button
												type="button"
												variant="outline"
												className={cn(
													"h-10 rounded-[14px] text-sm font-semibold",
													"border-input bg-card text-foreground hover:bg-muted/60",
												)}
												onClick={onEditDetectedJob}
											>
												<PencilLine className="size-4" aria-hidden="true" />
												Edit Details
											</Button>
											<Button
												type="button"
												className={cn(
													"h-10 rounded-[14px] text-sm font-semibold disabled:opacity-60",
													"bg-primary text-primary-foreground hover:brightness-95",
												)}
												disabled={isSaving}
												onClick={onSaveDetectedJob}
											>
												<PlusCircle className="size-4" aria-hidden="true" />
												{isSaving ? "Saving..." : "Save Job"}
											</Button>
										</div>
									</div>
								</>
							) : (
								<>
									<DetectionMessage
										icon={detectionError ? AlertCircle : Sparkles}
										title={
											detectionError ? "Detection failed" : "No job detected"
										}
										description={
											detectionError ||
											"Open a job page or add the application details manually."
										}
										isDarkMode={isDarkMode}
									/>
									<div className="mt-5 space-y-3">
										{isAnalysisAvailable && (
											<Button
												type="button"
												variant="outline"
												className={cn(
													"h-10 w-full rounded-[14px] text-sm font-semibold",
													"border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200 dark:hover:bg-blue-500/15",
												)}
												disabled={isAnalyzing}
												onClick={onAnalyzeDetectedJob}
											>
												{isAnalyzing ? (
													<LoaderCircle
														className="size-4 animate-spin"
														aria-hidden="true"
													/>
												) : (
													<Brain className="size-4" aria-hidden="true" />
												)}
												{isAnalyzing
													? "Analyzing Job Page..."
													: "Analyze This Page"}
											</Button>
										)}
										<div className="grid grid-cols-2 gap-3">
											<Button
												type="button"
												variant="outline"
												className={cn(
													"h-10 rounded-[14px] text-sm font-semibold",
													"border-input bg-card text-foreground hover:bg-muted/60",
												)}
												onClick={onRetryDetection}
											>
												<RefreshCw className="size-4" aria-hidden="true" />
												Retry
											</Button>
											<Button
												type="button"
												className="h-10 rounded-[14px] bg-primary text-sm font-semibold text-primary-foreground hover:brightness-95"
												onClick={onAddJob}
											>
												<PlusCircle className="size-4" aria-hidden="true" />
												Add Manually
											</Button>
										</div>
									</div>
								</>
							)}
						</div>
					</section>

					<section className="grid grid-cols-3 rounded-[14px] border border-border bg-card py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors">
						<StatItem
							icon={Bookmark}
							value={String(savedCount)}
							label="Saved"
							isDarkMode={isDarkMode}
						/>
						<StatItem
							icon={CheckCircle2}
							value={String(appliedCount)}
							label="Applied"
							bordered
							isDarkMode={isDarkMode}
						/>
						<StatItem
							icon={CalendarDays}
							value={String(interviewCount)}
							label="Interview"
							bordered
							isDarkMode={isDarkMode}
						/>
					</section>

					<ListHeader
						title="Recent Jobs"
						isDarkMode={isDarkMode}
						onViewAll={onOpenApplications}
					/>
					<section className="overflow-hidden rounded-[14px] border border-border bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors">
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
										"text-muted-foreground",
									)}
								>
									<div
										className={cn(
											"mb-3 flex size-11 items-center justify-center rounded-lg",
											"bg-accent text-accent-foreground",
										)}
									>
										<Bookmark className="size-5" aria-hidden="true" />
									</div>
									<h3 className={cn("text-sm font-bold", "text-foreground")}>
										No recent jobs yet
									</h3>
									<p
										className={cn(
											"mt-1 text-xs leading-5",
											"text-muted-foreground",
										)}
									>
										Jobs you save will apppear here for quick access
									</p>
								</div>
							</div>
						)}
					</section>

					<ListHeader
						title="Upcoming Reminders"
						isDarkMode={isDarkMode}
						onViewAll={onOpenReminders}
					/>
					<section className="overflow-hidden rounded-[14px] border border-border bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors">
						{reminders.map((reminder) => (
							<ReminderManagementRow
								key={reminder.id}
								reminder={reminder}
								isDarkMode={isDarkMode}
								showActions
								onOpen={() => onOpenReminder(reminder.id)}
								onMarkDone={() => onMarkReminderDone(reminder.id)}
							/>
						))}
						{!reminders.length && (
							<p className="px-4 py-5 text-sm text-muted-foreground">
								No upcoming reminders yet. Add one from a job form or edit
								screen.
							</p>
						)}
					</section>

					<button
						type="button"
						className="flex w-full items-center gap-3 rounded-[14px] border border-border bg-card p-3 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/20 active:translate-y-px"
						onClick={openDashboard}
					>
						<div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
							<Grid2X2 className="size-5" aria-hidden="true" />
						</div>
						<div className="min-w-0 flex-1">
							<h2 className="truncate text-sm font-semibold text-foreground">
								Open Full Dashboard
							</h2>
							<p className="truncate text-xs text-muted-foreground">
								View analytics, export data, and more
							</p>
						</div>
						<ChevronRight
							className="size-4 text-muted-foreground"
							aria-hidden="true"
						/>
					</button>
				</div>

				<footer
					className={cn(
						"shrink-0 bg-white dark:bg-background px-4 py-1 text-center backdrop-blur",
						"border-border",
					)}
				>
					<p className="text-[10px] text-muted-foreground/80">
						All your job data is stored locally in your browser.
					</p>
				</footer>
			</div>
		</>
	);
}
