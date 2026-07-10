import { Bookmark } from "lucide-react";

import { cn } from "@/lib/utils";
import { CompanyMark } from "@/modules/side-panel/components/company-mark";
import type { RecentJob } from "@/modules/side-panel/types";
import { lightStatusStyles, statusStyles } from "@/modules/side-panel/utils/styles";

type RecentJobRowProps = {
	job: RecentJob;
	isDarkMode: boolean;
	onOpen: () => void;
};

export function RecentJobRow({ job, isDarkMode, onOpen }: RecentJobRowProps) {
	return (
		<div
			role="button"
			tabIndex={0}
			className={cn(
				"grid cursor-pointer grid-cols-[40px_minmax(0,1fr)_78px] items-center gap-3 border-b px-3 py-3.5 transition last:border-b-0 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-blue-500/20 active:bg-blue-50/40 max-[390px]:grid-cols-[40px_minmax(0,1fr)]",
				isDarkMode
					? "border-slate-800/85 hover:bg-[#303032] active:bg-[#303032]"
					: "border-slate-100 hover:bg-slate-50",
			)}
			onClick={onOpen}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					onOpen();
				}
			}}
		>
			<CompanyMark brand={job.brand} />
			<div className="min-w-0">
				<h3 className={cn("truncate text-[13px] font-bold leading-5", isDarkMode ? "text-white" : "text-slate-950")}>{job.title}</h3>
				<p className={cn("truncate text-xs font-medium", isDarkMode ? "text-slate-400" : "text-slate-600")}>
					{job.company}
					<span className={cn("px-1.5", isDarkMode ? "text-slate-600" : "text-slate-400")} aria-hidden="true">
						&middot;
					</span>
					{job.location}
				</p>
			</div>
			<div className="flex min-w-0 flex-col items-end gap-1.5 max-[390px]:hidden">
				<p className={cn("w-full truncate text-right text-[11px] font-medium leading-4", isDarkMode ? "text-slate-400" : "text-slate-600")}>{job.date}</p>
				<span
					className={cn(
						"inline-flex h-6 min-w-[54px] items-center justify-center gap-1 rounded-md border px-2 text-[10px] font-semibold",
						isDarkMode
							? statusStyles[job.status]
							: job.status === "Saved"
								? "border-slate-200 bg-slate-50 text-slate-700"
								: lightStatusStyles[job.status],
					)}
				>
					<Bookmark className="size-2.5 fill-current" aria-hidden="true" />
					{job.status}
				</span>
			</div>
		</div>
	);
}
