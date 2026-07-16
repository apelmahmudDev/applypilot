import {
	AlarmClock,
	BadgeDollarSign,
	CalendarDays,
	Check,
	FileText,
	Link2,
	MapPin,
	Tag,
	Trash2,
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
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { StoredJob } from "@/lib/jobs/storage";
import { cn } from "@/lib/utils";
import { CompanyMark } from "@/modules/side-panel/components/company-mark";
import {
	SidePanelBackHeader,
	SidePanelLayout,
	SidePanelTopBar,
} from "@/modules/side-panel/components/side-panel-layout";
import type { Reminder } from "@/modules/side-panel/types";
import {
	formatDate,
	formatDateSlash,
	formatTime,
} from "@/modules/side-panel/utils/format";
import { getBrand } from "@/modules/side-panel/utils/job-mappers";

type ReminderDetailsViewProps = {
	reminder: Reminder | null;
	job: StoredJob | null;
	isDarkMode: boolean;
	onBack: () => void;
	onUpdateReminder: (job: StoredJob) => void;
	onMarkDone: (reminderId: string) => void;
	onRemoveReminder: (reminderId: string) => void;
};

export function ReminderDetailsView({
	reminder,
	job,
	isDarkMode: _isDarkMode,
	onBack,
	onUpdateReminder,
	onMarkDone,
	onRemoveReminder,
}: ReminderDetailsViewProps) {
	if (!reminder || !job) {
		return (
			<SidePanelLayout
				header={
					<SidePanelTopBar
						leftSlot={
							<SidePanelBackHeader
								title="Reminder Details"
								onBack={onBack}
							/>
						}
					/>
				}
				contentClassName="px-0 pb-0 pt-0"
			>
				<p className="px-4 py-4 text-sm text-muted-foreground">
					This reminder is no longer available.
				</p>
			</SidePanelLayout>
		);
	}

	const savedDate = formatDate(job.createdAt) || "Unknown";
	const applicationDate =
		job.status === "Saved"
			? "-"
			: job.savedDate
				? formatDate(job.savedDate)
				: "-";
	const reminderValue = [
		formatDateSlash(reminder.followUpDate),
		reminder.followUpTime ? formatTime(reminder.followUpTime) : null,
	]
		.filter(Boolean)
		.join(", ");

	return (
		<SidePanelLayout
			header={
				<SidePanelTopBar
					leftSlot={
						<SidePanelBackHeader title="Reminder Details" onBack={onBack} />
					}
				/>
			}
			contentClassName="px-0 pb-0 pt-0"
		>
			<JobDetailsContent
				className="px-3 py-4 sm:px-4"
				brandMark={
					<CompanyMark
						brand={getBrand(job.company, job.platform)}
						logoUrl={job.logoUrl}
						companyName={job.company}
						size="lg"
						appearance="soft"
					/>
				}
				title={job.title || reminder.title}
				company={job.company || reminder.company}
				status={reminder.isCompleted ? "Offer" : "Saved"}
				hideHeaderStatus
				summaryActions={
					<TooltipProvider delayDuration={120}>
						<div className="grid grid-cols-3 gap-2">
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										type="button"
										variant="outline"
										className={cn(
											"h-9 rounded-md text-xs font-semibold",
											"border-input bg-card text-foreground hover:bg-muted/60",
										)}
										onClick={() => onUpdateReminder(job)}
									>
										<AlarmClock className="size-4" aria-hidden="true" />
										Update
									</Button>
								</TooltipTrigger>
								<TooltipContent side="top" sideOffset={8}>
									Update reminder
								</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										type="button"
										className={cn(
											"h-9 rounded-md text-xs font-semibold",
											"bg-primary text-primary-foreground hover:brightness-95",
										)}
										disabled={reminder.isCompleted}
										onClick={() => onMarkDone(reminder.id)}
									>
										<Check className="size-4" aria-hidden="true" />
										{reminder.isCompleted ? "Completed" : "Mark Done"}
									</Button>
								</TooltipTrigger>
								<TooltipContent side="top" sideOffset={8}>
									{reminder.isCompleted ? "Already completed" : "Mark as done"}
								</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										type="button"
										variant="outline"
										className={cn(
											"h-9 rounded-md text-xs font-semibold",
											"border-[#FEF2F2] bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2]",
										)}
										onClick={() => onRemoveReminder(reminder.id)}
									>
										<Trash2 className="size-4" aria-hidden="true" />
										Remove
									</Button>
								</TooltipTrigger>
								<TooltipContent side="top" sideOffset={8}>
									Remove reminder
								</TooltipContent>
							</Tooltip>
						</div>
					</TooltipProvider>
				}
				sections={
					<>
						<JobDetailsSection title="Reminder Info">
							<JobDetailsRow
								icon={AlarmClock}
								label="Reminder Type"
								value={reminder.reminderType}
							/>
							<JobDetailsRow
								icon={CalendarDays}
								label="Reminder"
								value={reminderValue}
							/>
							<JobDetailsRow
								icon={Check}
								label="Status"
								value={reminder.isCompleted ? "Completed" : "Open"}
							/>
							<div className="grid grid-cols-[24px_minmax(120px,160px)_minmax(0,1fr)] items-start gap-3">
								<FileText
									className="mt-0.5 size-4 text-slate-400 dark:text-muted-foreground"
									aria-hidden="true"
								/>
								<span className="text-sm font-medium text-slate-500 dark:text-muted-foreground">
									Note
								</span>
								<p className="whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-muted-foreground">
									{reminder.description}
								</p>
							</div>
						</JobDetailsSection>

						<JobDetailsSection title="Basic Info">
							<JobDetailsRow
								icon={Tag}
								label="Job Type"
								value={job.employmentType || "Not specified"}
							/>
							<JobDetailsRow
								icon={Tag}
								label="Work Mode"
								value={job.workplaceType || "Not specified"}
							/>
							<JobDetailsRow
								icon={MapPin}
								label="Location"
								value={job.location || "Location not found"}
							/>
							<JobDetailsRow
								icon={Link2}
								label="Source"
								value={job.platform || "Other"}
							/>
							<JobDetailsRow
								icon={Tag}
								label="Saved Date"
								value={savedDate}
							/>
							<JobDetailsRow
								icon={Tag}
								label="Application Date"
								value={applicationDate}
							/>
						</JobDetailsSection>

						<JobDetailsSection title="Compensation">
							<JobDetailsRow
								icon={BadgeDollarSign}
								label="Salary"
								value={job.salary || "Not specified"}
							/>
						</JobDetailsSection>

						<JobDetailsSection title="Job Description">
							<div className="text-sm leading-6 text-slate-600 dark:text-muted-foreground">
								<FormattedJobDescription
									descriptionHtml={job.descriptionHtml}
									descriptionText={job.descriptionText || job.notes}
									collapsible
								/>
							</div>
						</JobDetailsSection>

						<JobDetailsSection title="Links">
							<div className="flex gap-3">
								<Link2
									className="mt-0.5 size-4 shrink-0 text-slate-400 dark:text-muted-foreground"
									aria-hidden="true"
								/>
								{job.url ? (
									<a
										href={job.url}
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
		</SidePanelLayout>
	);
}
