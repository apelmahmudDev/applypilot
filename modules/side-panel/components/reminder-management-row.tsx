import { MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Reminder } from "@/modules/side-panel/types";

type ReminderManagementRowProps = {
	reminder: Reminder;
	isDarkMode: boolean;
	showActions?: boolean;
	onOpen: () => void;
	onMarkDone: () => void;
};

export function ReminderManagementRow({
	reminder,
	isDarkMode,
	showActions = false,
	onOpen,
	onMarkDone,
}: ReminderManagementRowProps) {
	const Icon = reminder.icon;
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

	return (
		<div
			role="button"
			tabIndex={0}
			className={cn(
				"flex cursor-pointer items-start gap-3 border-b border-border px-3 py-3 transition last:border-b-0 hover:bg-muted/60 active:bg-muted/60 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-primary/20",
			)}
			onClick={onOpen}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					onOpen();
				}
			}}
		>
			<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
				<Icon className="size-5" aria-hidden="true" />
			</div>
			<div className="min-w-0 flex-1">
				<h3
					className={cn(
						"truncate text-sm font-semibold",
						"text-foreground",
					)}
				>
					{reminder.company} - {reminder.title}
				</h3>
				<p
					className={cn(
						"truncate text-xs",
						"text-muted-foreground",
					)}
				>
					{reminder.description}
				</p>
				<div className="mt-2 flex flex-wrap items-center gap-2">
					<p
						className={cn(
							"rounded-full px-2.5 py-1 text-[11px] font-bold",
							badgeClassName,
						)}
					>
						{reminder.statusLabel}
					</p>
					<p
						className={cn(
							"rounded-full px-2.5 py-1 text-[11px] font-bold",
							"bg-accent text-accent-foreground",
						)}
					>
						{reminder.timeLabel}
					</p>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className={cn(
							"h-7 rounded-full px-3 text-[11px] font-bold",
							"border-input bg-card text-foreground hover:bg-muted/60",
						)}
						disabled={reminder.isCompleted}
						onClick={(event) => {
							event.stopPropagation();
							onMarkDone();
						}}
					>
						{reminder.isCompleted ? "Done" : "Mark Done"}
					</Button>
				</div>
			</div>
			{showActions && (
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					className={cn(
						"mt-1 shrink-0",
						"text-muted-foreground hover:bg-muted/60 hover:text-foreground",
					)}
					aria-label="Reminder actions"
					title="Actions"
					onClick={(event) => event.stopPropagation()}
				>
					<MoreVertical className="size-4" aria-hidden="true" />
				</Button>
			)}
		</div>
	);
}
