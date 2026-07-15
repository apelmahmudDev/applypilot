import type { StoredJob } from "@/lib/jobs/storage";
import { cn } from "@/lib/utils";
import { CompanyMark } from "@/modules/side-panel/components/company-mark";
import { formatDate } from "@/modules/side-panel/utils/format";
import { getBrand, mapJobStatus } from "@/modules/side-panel/utils/job-mappers";
import {
	lightStatusStyles,
	statusStyles,
} from "@/modules/side-panel/utils/styles";

type ApplicationJobRowProps = {
	job: StoredJob;
	isDarkMode: boolean;
	onStatusChange: () => void;
	onOpen: () => void;
};

export function ApplicationJobRow({
	job,
	isDarkMode,
	onStatusChange,
	onOpen,
}: ApplicationJobRowProps) {
	const status = mapJobStatus(job.status);

	return (
		<div
			role="button"
			tabIndex={0}
			className={cn(
				"cursor-pointer border-b border-dashed border-slate-200 px-3 py-3 transition last:border-b-0 hover:bg-muted/60 active:bg-muted/60 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-primary/20",
			)}
			onClick={onOpen}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					onOpen();
				}
			}}
		>
			<div className="flex items-start gap-3">
				<CompanyMark
					brand={getBrand(job.company, job.platform)}
					logoUrl={job.logoUrl}
					companyName={job.company}
					appearance="soft"
				/>
				<div className="min-w-0 flex-1">
					<h3
						className={cn(
							"truncate text-sm font-semibold",
							"text-foreground",
						)}
					>
						{job.title || "Untitled role"}
					</h3>
					<p
						className={cn(
							"mt-1 truncate text-xs",
							"text-muted-foreground",
						)}
					>
						{job.company || "Unknown company"} - {job.location || "Unknown location"}
					</p>
					<div className="mt-2 flex flex-wrap items-center justify-between gap-2">
						<button
							type="button"
							className={cn(
								"rounded-full border px-2.5 py-1 text-[11px] font-bold transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#4F46E5]/20",
								isDarkMode ? statusStyles[status] : lightStatusStyles[status],
							)}
							onClick={(event) => {
								event.stopPropagation();
								onStatusChange();
							}}
						>
							Status: {status}
						</button>
						<span
							className={cn(
								"min-w-0 truncate text-xs font-semibold",
								"text-muted-foreground",
							)}
						>
							Follow-up: {formatDate(job.updatedAt) || "Not set"}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
