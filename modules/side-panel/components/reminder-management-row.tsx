import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CompanyMark } from "@/modules/side-panel/components/company-mark";
import type { Reminder } from "@/modules/side-panel/types";
import { getBrand } from "@/modules/side-panel/utils/job-mappers";

type ReminderManagementRowProps = {
	reminder: Reminder;
	isDarkMode: boolean;
	onOpen: () => void;
	onMarkDone: () => void;
};

export function ReminderManagementRow({
	reminder,
	isDarkMode,
	onOpen,
	onMarkDone,
}: ReminderManagementRowProps) {
	const reminderTypeBadgeClassName =
		reminder.reminderType === "Follow up"
			? "bg-primary/10 text-primary dark:bg-primary/18 dark:text-slate-100"
			: reminder.reminderType === "Interview"
				? "bg-violet-50 text-violet-600 dark:bg-violet-500/18 dark:text-violet-200"
				: "bg-amber-50 text-amber-600 dark:bg-amber-500/18 dark:text-amber-200";
	const badgeClassName =
		reminder.statusTone === "overdue"
			? "bg-red-50 text-red-700"
			: reminder.statusTone === "today"
				? "bg-amber-50 text-amber-700"
				: reminder.statusTone === "tomorrow"
					? "bg-blue-50 text-blue-700"
					: reminder.statusTone === "completed"
						? "bg-emerald-50 text-emerald-700"
						: "bg-accent text-accent-foreground";
	const shouldShowStatusBadge =
		reminder.statusLabel !== reminder.timeLabel &&
		!reminder.timeLabel.startsWith(`${reminder.statusLabel},`);

	return (
		<div
			role="button"
			tabIndex={0}
			className={cn(
				"group flex cursor-pointer items-start gap-3 border-b border-dashed border-border/60 px-3 py-3 transition last:border-b-0 hover:bg-primary/6 active:bg-primary/8 dark:hover:bg-primary/10 dark:active:bg-primary/14 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-primary/20",
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
				brand={getBrand(reminder.company, "")}
				logoUrl={reminder.logoUrl}
				companyName={reminder.company}
				appearance="soft"
			/>
			<div className="min-w-0 flex-1">
				<h3
					className={cn(
						"truncate text-[13px] font-semibold leading-5 transition-colors group-hover:text-primary",
						"text-foreground",
					)}
				>
					{reminder.title}
				</h3>
				<p
					className={cn(
						"truncate text-xs font-medium",
						"text-muted-foreground",
					)}
				>
					<span>{reminder.company}</span>
					<span
						className="inline-block px-1.5 align-middle text-[11px] font-semibold text-slate-400 dark:text-muted-foreground"
						aria-hidden="true"
					>
						•
					</span>
					<span>{reminder.description}</span>
				</p>
				<div className="mt-2 flex flex-wrap items-center gap-2">
					<p
						className={cn(
							"rounded-sm px-2 py-1 text-[11px] font-medium",
							reminderTypeBadgeClassName,
						)}
					>
						{reminder.reminderType}
					</p>
					{shouldShowStatusBadge && (
						<p
							className={cn(
								"rounded-sm px-2 py-1 text-[11px] font-medium",
								badgeClassName,
							)}
						>
							{reminder.statusLabel}
						</p>
					)}
					<p
						className={cn(
							"rounded-sm px-2 py-1 text-[11px] font-medium",
							shouldShowStatusBadge
								? "bg-accent text-accent-foreground"
								: badgeClassName,
						)}
					>
						{reminder.timeLabel}
					</p>
				</div>
			</div>
			<TooltipProvider delayDuration={120}>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className={cn(
								"mt-1.5 shrink-0 h-6 rounded-full px-2.5 text-[11px] font-medium",
								"border-border/70 bg-card text-foreground hover:bg-muted/60",
							)}
							disabled={reminder.isCompleted}
							onClick={(event) => {
								event.stopPropagation();
								onMarkDone();
							}}
						>
							<Check className="size-3.5" aria-hidden="true" />
							{reminder.isCompleted ? "Done" : "Mark"}
						</Button>
					</TooltipTrigger>
					<TooltipContent side="top" sideOffset={8}>
						{reminder.isCompleted ? "Already completed" : "Mark as done"}
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
}
