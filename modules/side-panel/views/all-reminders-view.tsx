import { cn } from "@/lib/utils";
import { FullDashboardButton } from "@/modules/side-panel/components/full-dashboard-button";
import { ReminderManagementRow } from "@/modules/side-panel/components/reminder-management-row";
import { ViewHeader } from "@/modules/side-panel/components/view-header";
import type { Reminder, ReminderFilter } from "@/modules/side-panel/types";
import { reminderFilters } from "@/modules/side-panel/utils/constants";

type AllRemindersViewProps = {
	reminders: Reminder[];
	filter: ReminderFilter;
	isDarkMode: boolean;
	onBack: () => void;
	onFilterChange: (value: ReminderFilter) => void;
	onOpenReminder: (reminder: Reminder) => void;
	onMarkDone: (reminderId: string) => void;
};

export function AllRemindersView({
	reminders,
	filter,
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
									? "border-accent bg-accent text-accent-foreground"
									: "border-input bg-card text-muted-foreground hover:text-foreground",
							)}
							onClick={() => onFilterChange(item)}
						>
							{item}
						</button>
					))}
				</div>

				<section
					className={cn(
						"overflow-hidden rounded-[14px] border border-border bg-card",
					)}
				>
					{reminders.map((reminder) => (
						<ReminderManagementRow
							key={reminder.id}
							reminder={reminder}
							isDarkMode={isDarkMode}
							onOpen={() => onOpenReminder(reminder)}
							onMarkDone={() => onMarkDone(reminder.id)}
						/>
					))}
					{!reminders.length && (
						<p className="px-3 py-4 text-sm text-muted-foreground">
							No reminders in this view.
						</p>
					)}
				</section>
			</div>
			<FullDashboardButton isDarkMode={isDarkMode} />
		</div>
	);
}
