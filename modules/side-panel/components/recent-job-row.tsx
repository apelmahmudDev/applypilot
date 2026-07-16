import { AlarmClock, Bookmark } from "lucide-react";

import { cn } from "@/lib/utils";
import { CompanyMark } from "@/modules/side-panel/components/company-mark";
import type { RecentJob } from "@/modules/side-panel/types";
import {
	lightStatusStyles,
	statusStyles,
} from "@/modules/side-panel/utils/styles";

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
				"group grid cursor-pointer grid-cols-[40px_minmax(0,1fr)_78px] items-center gap-3 border-b border-dashed border-border/60 px-3 py-3 transition last:border-b-0 hover:bg-primary/6 active:bg-primary/8 dark:hover:bg-primary/10 dark:active:bg-primary/14 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-primary/20 max-[390px]:grid-cols-[40px_minmax(0,1fr)]",
			)}
			onClick={onOpen}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					onOpen();
				}
			}}
		>
			<CompanyMark
				brand={job.brand}
				logoUrl={job.logoUrl}
				companyName={job.company}
				appearance="soft"
			/>
			<div className="min-w-0">
				<h3 className="truncate text-[13px] font-semibold leading-5 text-foreground transition-colors group-hover:text-primary">
					{job.title}
				</h3>
				<div className="flex items-center gap-1.5 truncate text-xs font-medium text-muted-foreground">
					<span>{job.company}</span>
					<span
						className="inline-block px-1.5 align-middle text-[11px] font-semibold text-slate-400 dark:text-muted-foreground"
						aria-hidden="true"
					>
						•
					</span>
					<span>{job.location}</span>
					{job.hasReminder ? (
						<>
							<span
								className="inline-block align-middle text-[11px] font-semibold text-slate-400 dark:text-muted-foreground"
								aria-hidden="true"
							>
								•
							</span>
							<span
								className="inline-flex items-center text-muted-foreground"
								title="Reminder set"
								aria-label="Reminder set"
							>
								<AlarmClock className="size-3.5" aria-hidden="true" />
							</span>
						</>
					) : null}
				</div>
			</div>
			<div className="flex min-w-0 flex-col items-end gap-1.5 max-[390px]:hidden">
				<p className="w-full truncate text-right text-[11px] font-medium leading-4 text-muted-foreground">
					{job.date}
				</p>
				<span
					className={cn(
						"inline-flex h-6 min-w-[54px] items-center justify-center gap-1 rounded-md border px-2 text-[10px] font-semibold",
						isDarkMode
							? statusStyles[job.status]
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
