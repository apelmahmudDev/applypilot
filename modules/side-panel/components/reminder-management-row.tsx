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
				"flex cursor-pointer items-start gap-3 border-b px-3 py-3 transition last:border-b-0 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-blue-500/20 active:bg-blue-50/40",
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
			<div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", isDarkMode ? "bg-blue-500/15 text-blue-200" : "bg-blue-50 text-blue-600")}>
				<Icon className="size-5" aria-hidden="true" />
			</div>
			<div className="min-w-0 flex-1">
				<h3
					className={cn(
						"truncate text-sm font-semibold",
						isDarkMode ? "text-white" : "text-slate-950",
					)}
				>
					{reminder.company} - {reminder.title}
				</h3>
				<p
					className={cn(
						"truncate text-xs",
						isDarkMode ? "text-slate-400" : "text-slate-500",
					)}
				>
					{reminder.description}
				</p>
				<div className="mt-2 flex flex-wrap items-center gap-2">
					<p
						className={cn(
							"rounded-full px-2.5 py-1 text-[11px] font-bold",
							isDarkMode ? "bg-blue-500/15 text-blue-200" : "bg-blue-50 text-blue-700",
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
							isDarkMode
								? "border-slate-600/70 bg-[#262628] text-slate-200 hover:bg-[#303032] hover:text-white"
								: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
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
						isDarkMode
							? "text-slate-400 hover:bg-[#303032] hover:text-white"
							: "text-slate-500 hover:bg-slate-100 hover:text-slate-950",
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
