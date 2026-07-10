import { ExternalLink, Link, MapPin, PencilLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { StoredJob } from "@/lib/jobs/storage";
import { cn } from "@/lib/utils";
import { CompanyMark } from "@/modules/side-panel/components/company-mark";
import { DetailLine } from "@/modules/side-panel/components/detail-line";
import { ViewHeader } from "@/modules/side-panel/components/view-header";
import { formatDate, formatDisplayUrl } from "@/modules/side-panel/utils/format";
import { getBrand, mapJobStatus } from "@/modules/side-panel/utils/job-mappers";

type JobDetailsViewProps = {
	job: StoredJob | null;
	isDarkMode: boolean;
	onBack: () => void;
	onEdit: (job: StoredJob) => void;
	onStatusChange: (job: StoredJob) => void;
};

export function JobDetailsView({
	job,
	isDarkMode,
	onBack,
	onEdit,
	onStatusChange,
}: JobDetailsViewProps) {
	if (!job) {
		return (
			<div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-4">
				<ViewHeader title="Job Details" isDarkMode={isDarkMode} onBack={onBack} />
				<p className={cn("rounded-lg border px-3 py-4 text-sm", isDarkMode ? "border-slate-700 bg-[#262628] text-slate-400" : "border-slate-200 bg-white text-slate-500")}>
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
				<section
					className={cn(
						"rounded-lg border p-4",
						isDarkMode
							? "border-slate-700/65 bg-[#262628]"
							: "border-slate-200 bg-white",
					)}
				>
					<div className="flex items-start gap-3">
						<CompanyMark brand={getBrand(job.company, job.platform)} size="lg" />
						<div className="min-w-0 flex-1">
							<h2
								className={cn(
									"text-base font-bold leading-6",
									isDarkMode ? "text-white" : "text-slate-950",
								)}
							>
								{job.title || "Untitled role"}
							</h2>
							<p
								className={cn(
									"mt-1 text-sm font-semibold",
									isDarkMode ? "text-slate-300" : "text-slate-700",
								)}
							>
								{job.company || "Unknown company"}
							</p>
							<p
								className={cn(
									"mt-2 flex items-center gap-1.5 text-xs",
									isDarkMode ? "text-slate-400" : "text-slate-500",
								)}
							>
								<MapPin className="size-3.5 shrink-0" aria-hidden="true" />
								<span>{job.location || "Location not found"}</span>
							</p>
						</div>
					</div>

					<div className="mt-4 grid grid-cols-2 gap-2">
						<Button
							type="button"
							variant="outline"
							className={cn(
								"h-9 rounded-md text-xs font-semibold",
								isDarkMode
									? "border-slate-600/70 bg-[#262628] text-slate-100 hover:bg-[#303032]"
									: "border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
							)}
							onClick={() => onEdit(job)}
						>
							<PencilLine className="size-4" aria-hidden="true" />
							Edit
						</Button>
						<Button
							type="button"
							className="h-9 rounded-md bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500"
							onClick={() => onStatusChange(job)}
						>
							Status: {status}
						</Button>
					</div>
				</section>

				<section
					className={cn(
						"rounded-lg border p-3",
						isDarkMode
							? "border-slate-700/65 bg-[#262628]"
							: "border-slate-200 bg-white",
					)}
				>
					<DetailLine label="Platform" value={job.platform || "Other"} isDarkMode={isDarkMode} />
					<DetailLine label="Saved" value={formatDate(job.createdAt) || "Unknown"} isDarkMode={isDarkMode} />
					<DetailLine label="Updated" value={formatDate(job.updatedAt) || "Unknown"} isDarkMode={isDarkMode} />
					{job.url && (
						<a
							href={job.url}
							target="_blank"
							rel="noreferrer"
							className={cn(
								"mt-3 flex min-w-0 items-center gap-2 text-xs font-semibold",
								isDarkMode
									? "text-blue-300 hover:text-blue-200"
									: "text-blue-600 hover:text-blue-700",
							)}
						>
							<Link className="size-3.5 shrink-0" aria-hidden="true" />
							<span className="truncate">{formatDisplayUrl(job.url)}</span>
							<ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
						</a>
					)}
				</section>

				<section
					className={cn(
						"rounded-lg border p-3",
						isDarkMode
							? "border-slate-700/65 bg-[#262628]"
							: "border-slate-200 bg-white",
					)}
				>
					<h3 className={cn("text-sm font-semibold", isDarkMode ? "text-white" : "text-slate-950")}>
						Job Description / Notes
					</h3>
					<p
						className={cn(
							"mt-2 whitespace-pre-wrap text-xs leading-5",
							isDarkMode ? "text-slate-300" : "text-slate-600",
						)}
					>
						{job.notes || "No description or notes saved yet."}
					</p>
				</section>
			</div>
		</div>
	);
}
