import { FormattedJobDescription } from "@/components/formatted-job-description";
import { ExternalLink, Link, MapPin, PencilLine, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { StoredJob } from "@/lib/jobs/storage";
import { cn } from "@/lib/utils";
import { CompanyMark } from "@/modules/side-panel/components/company-mark";
import { DetailLine } from "@/modules/side-panel/components/detail-line";
import { ViewHeader } from "@/modules/side-panel/components/view-header";
import {
	formatDate,
	formatDateSlash,
	formatDisplayUrl,
	formatTime,
} from "@/modules/side-panel/utils/format";
import { getBrand, mapJobStatus } from "@/modules/side-panel/utils/job-mappers";

type JobDetailsViewProps = {
	job: StoredJob | null;
	isDarkMode: boolean;
	onBack: () => void;
	onEdit: (job: StoredJob) => void;
	onStatusChange: (job: StoredJob) => void;
	onDelete: (job: StoredJob) => void;
	onUpdateReminder: (job: StoredJob) => void;
	onRemoveReminder: (reminderId: string) => void;
};

export function JobDetailsView({
	job,
	isDarkMode,
	onBack,
	onEdit,
	onStatusChange,
	onDelete,
	onUpdateReminder,
	onRemoveReminder,
}: JobDetailsViewProps) {
	if (!job) {
		return (
			<div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-4">
				<ViewHeader title="Job Details" isDarkMode={isDarkMode} onBack={onBack} />
				<p className="rounded-[14px] border border-border bg-card px-3 py-4 text-sm text-muted-foreground">
					This job is no longer available.
				</p>
			</div>
		);
	}

	const status = mapJobStatus(job.status);

	return (
		<div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-4">
			<ViewHeader title="Job Details" isDarkMode={isDarkMode} onBack={onBack} />
			<div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
				<section className="rounded-[14px] border border-border bg-card p-4">
					<div className="flex items-start gap-3">
						<CompanyMark
							brand={getBrand(job.company, job.platform)}
							logoUrl={job.logoUrl}
							companyName={job.company}
							size="lg"
							appearance="soft"
						/>
						<div className="min-w-0 flex-1">
							<h2 className="text-base font-bold leading-6 text-foreground">
								{job.title || "Untitled role"}
							</h2>
							<p className="mt-1 text-sm font-semibold text-muted-foreground">
								{job.company || "Unknown company"}
							</p>
							<p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
								<MapPin className="size-3.5 shrink-0" aria-hidden="true" />
								<span>{job.location || "Location not found"}</span>
							</p>
						</div>
					</div>

					<div className="mt-4 grid grid-cols-3 gap-2">
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
						<Button
							type="button"
						className="h-9 rounded-md bg-primary text-xs font-semibold text-primary-foreground hover:brightness-95"
							onClick={() => onStatusChange(job)}
						>
							Status: {status}
						</Button>
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
					</div>
				</section>

				<section className="rounded-[14px] border border-border bg-card p-3">
					<DetailLine label="Platform" value={job.platform || "Other"} isDarkMode={isDarkMode} />
					<DetailLine label="Salary" value={job.salary || "Not specified"} isDarkMode={isDarkMode} />
					<DetailLine
						label="Deadline"
						value={job.deadline ? formatDate(job.deadline) : "Not specified"}
						isDarkMode={isDarkMode}
					/>
					<DetailLine label="Saved" value={formatDate(job.createdAt) || "Unknown"} isDarkMode={isDarkMode} />
					<DetailLine label="Updated" value={formatDate(job.updatedAt) || "Unknown"} isDarkMode={isDarkMode} />
					{job.url && (
						<a
							href={job.url}
							target="_blank"
							rel="noreferrer"
							className={cn(
								"mt-3 flex min-w-0 items-center gap-2 text-xs font-semibold",
								"text-primary hover:opacity-90",
							)}
						>
							<Link className="size-3.5 shrink-0" aria-hidden="true" />
							<span className="truncate">{formatDisplayUrl(job.url)}</span>
							<ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
						</a>
					)}
				</section>

				<section className="rounded-[14px] border border-border bg-card p-3">
					<h3 className="text-sm font-semibold text-foreground">Reminder</h3>
					<DetailLine
						label="Status"
						value={
							job.reminderEnabled && job.followUpDate
								? job.reminderDone
									? "Completed"
									: "Active"
								: "Not set"
						}
						isDarkMode={isDarkMode}
					/>
					<DetailLine
						label="Date"
						value={
							job.followUpDate ? formatDateSlash(job.followUpDate) : "Not set"
						}
						isDarkMode={isDarkMode}
					/>
					<DetailLine
						label="Time"
						value={job.followUpTime ? formatTime(job.followUpTime) : "Not set"}
						isDarkMode={isDarkMode}
					/>
					<DetailLine
						label="Note"
						value={job.reminderNote || "No reminder note"}
						isDarkMode={isDarkMode}
					/>
					<div className="mt-3 grid grid-cols-2 gap-2">
						<Button
							type="button"
							variant="outline"
							className={cn(
								"h-9 rounded-md text-xs font-semibold",
								"border-input bg-card text-foreground hover:bg-muted/60",
							)}
							onClick={() => onUpdateReminder(job)}
						>
							Update Reminder
						</Button>
						<Button
							type="button"
							variant="outline"
							className={cn(
								"h-9 rounded-md text-xs font-semibold",
								"border-[#FEF2F2] bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2]",
							)}
							disabled={!job.reminderEnabled && !job.followUpDate}
							onClick={() => onRemoveReminder(job.id)}
						>
							Remove Reminder
						</Button>
					</div>
				</section>

				<section className="rounded-[14px] border border-border bg-card p-3">
					<h3 className="text-sm font-semibold text-foreground">
						Job Description / Notes
					</h3>
					<div className="mt-2">
						<FormattedJobDescription
							descriptionHtml={job.descriptionHtml}
							descriptionText={job.descriptionText || job.notes}
						/>
					</div>
				</section>
			</div>
		</div>
	);
}
