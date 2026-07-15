import { useEffect, useState } from "react";

import {
	AlertCircle,
	Bookmark,
	CalendarDays,
	CheckCircle2,
	ChevronRight,
	CircleDollarSign,
	Info,
	ExternalLink,
	Grid2X2,
	Brain,
	LayoutDashboard,
	LoaderCircle,
	MapPin,
	Building2,
	PencilLine,
	PlusCircle,
	BriefcaseBusiness,
	Sparkles,
	Loader,
	X,
} from "lucide-react";

import {
	UserIdentityBadge,
	useUserIdentity,
} from "@/components/user-identity-badge";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
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
	const [isDetectionBannerDismissed, setIsDetectionBannerDismissed] =
		useState(false);
	const detectedJobMeta = [
		detectedJob?.workplaceType,
		detectedJob?.employmentType,
	]
		.filter(Boolean)
		.join(" · ");

	const detectedJobMetaItems = detectedJobMeta
		? detectedJobMeta.split(" Â· ").filter(Boolean)
		: [];

	const detectedMetaChips = detectedJobMeta
		? detectedJobMeta
				.split(/[·Â]+/)
				.map((item) => item.trim())
				.filter(Boolean)
		: [];

	const detectedDetailChips = [
		{
			icon: MapPin,
			label: detectedJob?.location || "Location not found",
		},
		{
			icon: CircleDollarSign,
			label: detectedJob?.salary || "Salary not found",
		},
		{
			icon: Building2,
			label: detectedJob?.workplaceType || "Workplace not found",
		},
		{
			icon: BriefcaseBusiness,
			label: detectedJob?.employmentType || "Job type not found",
		},
	];

	useEffect(() => {
		setIsDetectionBannerDismissed(false);
	}, [
		detectedJob?.title,
		detectedJob?.company,
		detectedJob?.location,
		detectedJob?.url,
		detectedJob?.salary,
		detectedJob?.workplaceType,
		detectedJob?.employmentType,
	]);

	return (
		<>
			<div className="relative flex min-h-0 flex-1 flex-col">
				<div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 pb-10 pt-0 sm:px-4">
					<TooltipProvider delayDuration={120}>
						<div
							className={cn(
								"sticky top-0 z-10 -mx-3 flex items-center justify-between gap-3 border-b border-slate-100 px-3 py-3 backdrop-blur-xl sm:-mx-4 sm:px-4",
								"bg-white dark:bg-background",
							)}
						>
							<div className="flex min-w-0 items-center gap-3">
								<UserIdentityBadge
									identity={userIdentity}
									className="size-8 text-[11px]"
								/>
								<div className="min-w-0">
									<p className="truncate text-sm font-semibold text-foreground">
										{userIdentity.name}
									</p>
									<p className="truncate text-xs text-muted-foreground sr-only">
										{userIdentity.role}
									</p>
								</div>
							</div>

							<div className="flex shrink-0 items-center gap-2">
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											type="button"
											variant="outline"
											size="icon-sm"
											className="rounded-full border-border/70 bg-background text-muted-foreground shadow-none hover:bg-background hover:text-foreground"
											aria-label="Open dashboard"
											onClick={() => void openDashboard()}
										>
											<LayoutDashboard
												className="size-3.5"
												aria-hidden="true"
											/>
										</Button>
									</TooltipTrigger>
									<TooltipContent side="bottom" sideOffset={8}>
										Open dashboard
									</TooltipContent>
								</Tooltip>

								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											type="button"
											size="icon-sm"
											className="rounded-full shadow-none"
											aria-label="Add job"
											onClick={onAddJob}
										>
											<PlusCircle className="size-4" aria-hidden="true" />
										</Button>
									</TooltipTrigger>
									<TooltipContent side="bottom" sideOffset={8}>
										Add job
									</TooltipContent>
								</Tooltip>
							</div>
						</div>
					</TooltipProvider>

					<section className="space-y-2.5">
						<div className="flex items-center gap-3 px-1">
							<Sparkles className="size-4 text-primary" aria-hidden="true" />
							<h2 className="text-sm font-bold text-foreground">
								Detected on this page
							</h2>
						</div>
						{!isDetecting && detectedJob && !isDetectionBannerDismissed && (
							<div className="rounded-md bg-[linear-gradient(135deg,#F4F3FF_0%,#F8F7FF_100%)] px-2.5 py-2 text-primary dark:bg-primary/10 dark:text-primary-foreground">
								<div className="flex items-center justify-between gap-3">
									<div className="flex min-w-0 items-center gap-2.5">
										<span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white/80 text-primary shadow-sm dark:bg-background/70">
											<Info className="size-3.5" aria-hidden="true" />
										</span>
										<p className="truncate text-xs font-medium">
											We detected some information, but please review before
											saving.
										</p>
									</div>
									<button
										type="button"
										className="flex size-5 shrink-0 items-center justify-center text-primary/80 transition-opacity hover:opacity-70 dark:text-muted-foreground"
										aria-label="Dismiss review message"
										onClick={() => setIsDetectionBannerDismissed(true)}
									>
										<X className="size-3.5" aria-hidden="true" />
									</button>
								</div>
							</div>
						)}
						<div
							className={cn(
								"transition-colors",
								detectedJob && !isDetecting
									? "p-0"
									: "rounded-md border border-slate-200 bg-white p-3 dark:border-none dark:bg-card",
							)}
						>
							{isDetecting ? (
								<DetectionMessage
									icon={Loader}
									title="Detecting job details"
									description="Reading visible job information from the active tab."
									isDarkMode={isDarkMode}
									isLoading
								/>
							) : detectedJob ? (
								<>
									<div className="rounded-md border border-slate-200 bg-white p-3.5 dark:border-none dark:bg-card shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
										<div className="flex gap-4">
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
											<div className="min-w-0 flex-1 pt-1">
												<h3 className="line-clamp-2 text-base font-semibold leading-6 text-[#171C35] dark:text-foreground">
													{detectedJob.title || "Untitled role"}
												</h3>
												<div className="mt-2 flex min-w-0 items-center gap-2 text-sm font-medium text-[#5B55D6] dark:text-primary">
													<Building2
														className="size-3.5 shrink-0 text-[#5B55D6] dark:text-primary"
														aria-hidden="true"
													/>
													<span className="truncate">
														{detectedJob.company || "Unknown company"}
													</span>
												</div>
											</div>
										</div>

										<div className="mt-4 flex flex-wrap gap-2.5">
											{detectedDetailChips.map((item) => (
												<DetectedInfoChip
													key={`${item.icon.name}-${item.label}`}
													icon={item.icon}
													label={item.label}
												/>
											))}
										</div>

										{detectedJob.url && (
											<a
												href={detectedJob.url}
												target="_blank"
												rel="noreferrer"
												className="mt-4 flex min-w-0 items-center justify-between gap-3 border-t border-[#EEEAFD] pt-3 text-xs text-[#5F6480] transition-opacity hover:opacity-90 dark:border-white/10 dark:text-muted-foreground"
											>
												<div className="flex min-w-0 items-center gap-2.5">
													<p className="min-w-0 truncate">
														<span className="font-medium text-[#4B516C] dark:text-foreground/90">
															Source:
														</span>{" "}
														{detectedJob.platform || "Job page"} ·{" "}
														<span className="text-[#5B55D6] dark:text-primary">
															{formatDisplayUrl(detectedJob.url)}
														</span>
													</p>
												</div>
												<ExternalLink
													className="size-4 shrink-0 text-[#5B55D6] dark:text-primary"
													aria-hidden="true"
												/>
											</a>
										)}

										<div className="mt-4 space-y-3">
											{isAnalysisAvailable && (
												<Button
													type="button"
													variant="outline"
													className={cn(
														"w-full h-10",
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
														"h-10",
														"border-[#C9C4FF] bg-white text-[#5B55D6] hover:bg-[#F7F6FF] dark:border-primary/30 dark:bg-transparent dark:text-primary dark:hover:bg-primary/10",
													)}
													onClick={onEditDetectedJob}
												>
													<PencilLine className="size-4" aria-hidden="true" />
													Edit Details
												</Button>
												<Button
													type="button"
													className="h-10"
													disabled={isSaving}
													onClick={onSaveDetectedJob}
												>
													<PlusCircle className="size-4" aria-hidden="true" />
													{isSaving ? "Saving..." : "Save Job"}
												</Button>
											</div>
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
													"h-10 w-full rounded-md text-sm font-semibold",
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
													"h-10 rounded-md text-sm font-semibold",
													"border-input bg-card text-foreground hover:bg-muted/60",
												)}
												onClick={onRetryDetection}
											>
												<Loader className="size-4" aria-hidden="true" />
												Retry
											</Button>
											<Button
												type="button"
												className="h-10 rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:brightness-95"
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

					<section className="grid grid-cols-3 rounded-md border border-slate-200 bg-card py-2.5 transition-colors dark:border-none shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
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

					<div className="space-y-2">
						<ListHeader
							title="Recent Jobs"
							isDarkMode={isDarkMode}
							onViewAll={onOpenApplications}
						/>
						<section className="overflow-hidden rounded-md border border-slate-200 bg-card shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition-colors">
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
					</div>

					<div className="space-y-2">
						<ListHeader
							title="Upcoming Reminders"
							isDarkMode={isDarkMode}
							onViewAll={onOpenReminders}
						/>
						<section className="overflow-hidden rounded-md border border-slate-200 bg-card shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition-colors">
							{reminders.map((reminder) => (
								<ReminderManagementRow
									key={reminder.id}
									reminder={reminder}
									isDarkMode={isDarkMode}
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
					</div>
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

type DetectedInfoChipProps = {
	icon: typeof MapPin;
	label: string;
};

function DetectedInfoChip({ icon: Icon, label }: DetectedInfoChipProps) {
	return (
		<div className="inline-flex max-w-full items-center gap-1.5 rounded-sm bg-[#F6F5FF] px-2 py-1.5 text-[11px] font-medium text-[#3B4160] dark:bg-primary/10 dark:text-foreground/85">
			<span className="flex size-4 shrink-0 items-center justify-center text-[#5B55D6] dark:text-primary">
				<Icon className="size-3" aria-hidden="true" />
			</span>
			<span className="truncate">{label}</span>
		</div>
	);
}
