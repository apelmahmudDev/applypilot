import {
	AlarmClock,
	BadgeDollarSign,
	BriefcaseBusiness,
	ExternalLink,
	FileText,
	Link2,
	MapPin,
	Tag,
	X,
} from "lucide-react";

import { FormattedJobDescription } from "@/components/formatted-job-description";
import {
	JobDetailsContent,
	JobDetailsReminderRow,
	JobDetailsRow,
	JobDetailsSection,
} from "@/components/job-details-content";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { JobBrandMark } from "@/modules/dashboard/components/job-table/job-brand-mark";
import type { DashboardJob } from "@/modules/dashboard/types";
import type { ReminderRow } from "@/modules/dashboard/components/reminders/types";

type JobDetailsDrawerProps = {
	job: DashboardJob | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAddReminder: (job: DashboardJob) => void;
	reminderInfo?: ReminderRow | null;
};

export function JobDetailsDrawer({
	job,
	open,
	onOpenChange,
	onAddReminder,
	reminderInfo = null,
}: JobDetailsDrawerProps) {
	if (!job) {
		return null;
	}

	const applicationDate = job.status === "Saved" ? "-" : job.appliedDate;
	const savedDate = job.savedDate || "-";
	const location = job.location.trim() || "-";
	const workMode = job.workMode.trim() || "-";
	const salary = job.salary?.trim() || "Not specified";
	const canOpenSource = Boolean(job.source.url);

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				showCloseButton={false}
				overlayClassName="bg-white/6 backdrop-blur-[0.8px] dark:bg-black/28 dark:backdrop-blur-[0.8px]"
				className="w-full gap-0 border-l border-slate-200 bg-white p-0 dark:border-border/60 dark:bg-card sm:max-w-lg"
			>
				<SheetHeader className="border-b border-slate-100 px-6 py-5 dark:border-border/60">
					<div className="flex items-start justify-between gap-4">
						<div>
							<SheetTitle className="text-lg font-bold tracking-[-0.04em]">
								Job Details
							</SheetTitle>
							<SheetDescription className="sr-only">
								View job details for {job.title} at {job.company}.
							</SheetDescription>
						</div>

						<div className="flex items-center gap-1">
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="hover:bg-transparent"
								aria-label="Open original job post"
								title="Open original job post"
								disabled={!canOpenSource}
								onClick={() => {
									if (job.source.url) {
										window.open(
											job.source.url,
											"_blank",
											"noopener,noreferrer",
										);
									}
								}}
							>
								<ExternalLink className="size-4.5" aria-hidden="true" />
							</Button>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground"
								onClick={() => onOpenChange(false)}
								aria-label="Close job details"
								title="Close"
							>
								<X className="size-5" aria-hidden="true" />
							</Button>
						</div>
					</div>
				</SheetHeader>

				<JobDetailsContent
					brandMark={
						<JobBrandMark
							brand={job.brand}
							logoUrl={job.logoUrl}
							company={job.company}
							className="size-14 rounded-md text-2xl"
						/>
					}
					title={job.title}
					company={job.company}
					status={job.status}
					sections={
						<>
							{reminderInfo ? (
								<JobDetailsSection title="Reminder Info">
									<JobDetailsRow
										icon={AlarmClock}
										label="Reminder Type"
										value={reminderInfo.kind}
									/>
									<JobDetailsReminderRow
										reminder={reminderInfo.dueLabel}
										onAddReminder={() => onAddReminder(job)}
									/>
									<div className="grid grid-cols-[24px_minmax(120px,160px)_minmax(0,1fr)] items-start gap-3">
										<FileText
											className="mt-0.5 size-4 text-slate-400 dark:text-muted-foreground"
											aria-hidden="true"
										/>
										<span className="text-sm font-medium text-slate-500 dark:text-muted-foreground">
											Note
										</span>
										<p className="whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-foreground/90">
											{reminderInfo.note}
										</p>
									</div>
								</JobDetailsSection>
							) : null}

							<JobDetailsSection title="Basic Info">
								<JobDetailsRow
									icon={BriefcaseBusiness}
									label="Job Type"
									value={job.jobType}
								/>
								<JobDetailsRow
									icon={Tag}
									label="Work Mode"
									value={workMode}
								/>
								<JobDetailsRow
									icon={MapPin}
									label="Location"
									value={location}
								/>
								<JobDetailsRow
									icon={Link2}
									label="Source"
									value={job.source.name}
								/>
								<JobDetailsRow icon={Tag} label="Saved Date" value={savedDate} />
								<JobDetailsRow
									icon={Tag}
									label="Application Date"
									value={applicationDate}
								/>
								{reminderInfo ? null : (
									<JobDetailsReminderRow
										reminder={job.reminder}
										onAddReminder={() => onAddReminder(job)}
									/>
								)}
							</JobDetailsSection>

							<JobDetailsSection title="Compensation">
								<JobDetailsRow
									icon={BadgeDollarSign}
									label="Salary"
									value={salary}
								/>
							</JobDetailsSection>

							<JobDetailsSection title="Job Description">
								<FormattedJobDescription
									descriptionHtml={job.descriptionHtml}
									descriptionText={job.description}
									collapsible
								/>
							</JobDetailsSection>

							<JobDetailsSection title="Links">
								<div className="flex gap-3">
									<Link2
										className="mt-0.5 size-4 shrink-0 text-slate-400 dark:text-muted-foreground"
										aria-hidden="true"
									/>
									{job.source.url ? (
										<a
											href={job.source.url}
											target="_blank"
											rel="noreferrer"
											className="text-sm font-semibold text-primary hover:underline"
										>
											Original Job Post
										</a>
									) : (
										<p className="text-sm text-slate-500 dark:text-muted-foreground">
											No source link available.
										</p>
									)}
								</div>
							</JobDetailsSection>
						</>
					}
				/>
			</SheetContent>
		</Sheet>
	);
}
