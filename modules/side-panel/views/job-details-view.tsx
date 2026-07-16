import { FormattedJobDescription } from "@/components/formatted-job-description";
import {
	JobDetailsContent,
	JobDetailsReminderRow,
	JobDetailsRow,
	JobDetailsSection,
} from "@/components/job-details-content";
import {
	BadgeDollarSign,
	BriefcaseBusiness,
	Link2,
	MapPin,
	PencilLine,
	Tag,
	Trash2,
} from "lucide-react";

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
import {
	formatDate,
	formatDateSlash,
	formatTime,
} from "@/modules/side-panel/utils/format";
import { getBrand, mapJobStatus } from "@/modules/side-panel/utils/job-mappers";

type JobDetailsViewProps = {
	job: StoredJob | null;
	isDarkMode: boolean;
	onAddJob: () => void;
	onBack: () => void;
	onUpdateReminder: (job: StoredJob) => void;
	onEdit: (job: StoredJob) => void;
	onStatusChange: (job: StoredJob) => void;
	onDelete: (job: StoredJob) => void;
	onRemoveReminder: (reminderId: string) => void;
};

export function JobDetailsView({
	job,
	isDarkMode,
	onAddJob,
	onBack,
	onEdit,
	onStatusChange,
	onDelete,
	onUpdateReminder,
	onRemoveReminder,
}: JobDetailsViewProps) {
	if (!job) {
		return (
			<SidePanelLayout
				header={
					<SidePanelTopBar
						leftSlot={
							<SidePanelBackHeader title="Job Details" onBack={onBack} />
						}
						onAddJob={onAddJob}
					/>
				}
				contentClassName="px-0 pb-0 pt-0"
			>
				<p className="px-4 py-4 text-sm text-muted-foreground">
					This job is no longer available.
				</p>
			</SidePanelLayout>
		);
	}

	const status = mapJobStatus(job.status);
	const savedDate = formatDate(job.createdAt) || "Unknown";
	const applicationDate =
		job.status === "Saved"
			? "-"
			: job.savedDate
				? formatDate(job.savedDate)
				: "-";
	const reminderValue =
		job.reminderEnabled && job.followUpDate
			? [
					formatDateSlash(job.followUpDate),
					job.followUpTime ? formatTime(job.followUpTime) : null,
				]
					.filter(Boolean)
					.join(", ")
			: "-";

	return (
		<SidePanelLayout
			header={
				<SidePanelTopBar
					leftSlot={
						<SidePanelBackHeader title="Job Details" onBack={onBack} />
					}
					onAddJob={onAddJob}
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
				title={job.title || "Untitled role"}
				company={job.company || "Unknown company"}
				status={status}
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
										onClick={() => onEdit(job)}
									>
										<PencilLine className="size-4" aria-hidden="true" />
										Edit
									</Button>
								</TooltipTrigger>
								<TooltipContent side="top" sideOffset={8}>
									Click to edit
								</TooltipContent>
							</Tooltip>
						<TooltipProvider delayDuration={120}>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										type="button"
										className="h-9 rounded-md bg-primary text-xs font-semibold text-primary-foreground hover:brightness-95"
										onClick={() => onStatusChange(job)}
									>
										{status}
									</Button>
								</TooltipTrigger>
								<TooltipContent side="top" sideOffset={8}>
									Click to change
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										type="button"
										variant="outline"
										className={cn(
											"h-9 rounded-md text-xs font-semibold",
											"border-[#FEF2F2] bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2]",
										)}
										aria-label="Delete job"
										title="Delete job"
										onClick={() => onDelete(job)}
									>
										<Trash2 className="size-4" aria-hidden="true" />
									</Button>
								</TooltipTrigger>
								<TooltipContent side="top" sideOffset={8}>
									Click to delete
								</TooltipContent>
							</Tooltip>
						</div>
					</TooltipProvider>
				}
				sections={
					<>
						<JobDetailsSection title="Basic Info">
							<JobDetailsRow
								icon={BriefcaseBusiness}
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
							<JobDetailsReminderRow
								reminder={reminderValue}
								onAddReminder={() => onUpdateReminder(job)}
								secondaryAction={{
									label: "Remove",
									onClick: () => onRemoveReminder(job.id),
									disabled: !job.reminderEnabled && !job.followUpDate,
								}}
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
