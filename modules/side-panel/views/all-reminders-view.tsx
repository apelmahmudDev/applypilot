import { cn } from "@/lib/utils";
import { FullDashboardButton } from "@/modules/side-panel/components/full-dashboard-button";
import { ReminderManagementRow } from "@/modules/side-panel/components/reminder-management-row";
import { ViewHeader } from "@/modules/side-panel/components/view-header";
import type { Reminder, ReminderFilter } from "@/modules/side-panel/types";
import { reminderFilters } from "@/modules/side-panel/utils/constants";

type AllRemindersViewProps = {
	reminders: Reminder[];
	filter: ReminderFilter;
	completedReminderIds: string[];
	isDarkMode: boolean;
	onBack: () => void;
	onFilterChange: (value: ReminderFilter) => void;
	onOpenReminder: (reminder: Reminder) => void;
	onMarkDone: (reminderId: string) => void;
};

export function AllRemindersView({
	reminders,
	filter,
	completedReminderIds,
	isDarkMode,
	onBack,
	onFilterChange,
	onOpenReminder,
	onMarkDone,
}: AllRemindersViewProps) {
	return (
		<div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-4">
			<ViewHeader title="All Reminders" isDarkMode={isDarkMode} onBack={onBack} />
			<div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
				<div className="grid grid-cols-3 gap-2">
					{reminderFilters.map((item) => (
						<button
							key={item}
							type="button"
							className={cn(
								"rounded-md border px-2 py-2 text-xs font-semibold transition",
								filter === item
									? isDarkMode
										? "border-indigo-400/30 bg-indigo-500/20 text-indigo-100"
										: "border-blue-100 bg-blue-50 text-blue-700"
									: isDarkMode
										? "border-slate-700 bg-[#262628] text-slate-400 hover:text-slate-200"
										: "border-slate-200 bg-white text-slate-500 hover:text-slate-900",
							)}
							onClick={() => onFilterChange(item)}
						>
							{item}
						</button>
					))}
				</div>

				<section
					className={cn(
						"overflow-hidden rounded-lg border",
						isDarkMode
							? "border-slate-700/65 bg-[#262628]"
							: "border-slate-200 bg-white",
					)}
				>
					{reminders.map((reminder) => (
						<ReminderManagementRow
							key={reminder.id}
							reminder={reminder}
							isCompleted={completedReminderIds.includes(reminder.id)}
							isDarkMode={isDarkMode}
							onOpen={() => onOpenReminder(reminder)}
							onMarkDone={() => onMarkDone(reminder.id)}
						/>
					))}
					{!reminders.length && (
						<p className={cn("px-3 py-4 text-sm", isDarkMode ? "text-slate-400" : "text-slate-500")}>
							No reminders in this view.
						</p>
					)}
				</section>
			</div>
			<FullDashboardButton isDarkMode={isDarkMode} />
		</div>
	);
}
