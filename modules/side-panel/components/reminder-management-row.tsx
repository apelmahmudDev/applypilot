import { MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Reminder } from "@/modules/side-panel/types";

type ReminderManagementRowProps = {
	reminder: Reminder;
	isCompleted: boolean;
	isDarkMode: boolean;
	showActions?: boolean;
	onOpen: () => void;
	onMarkDone: () => void;
};

export function ReminderManagementRow({
	reminder,
	isCompleted,
	isDarkMode,
	showActions = false,
	onOpen,
	onMarkDone,
}: ReminderManagementRowProps) {
	const Icon = reminder.icon;

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
							"bg-accent text-accent-foreground",
						)}
					>
						{reminder.time}
					</p>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className={cn(
							"h-7 rounded-full px-3 text-[11px] font-bold",
							"border-input bg-card text-foreground hover:bg-muted/60",
						)}
						disabled={isCompleted}
						onClick={(event) => {
							event.stopPropagation();
							onMarkDone();
						}}
					>
						{isCompleted ? "Done" : "Mark Done"}
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
