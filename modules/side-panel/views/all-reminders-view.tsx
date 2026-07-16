import { CalendarDays, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { ReminderManagementRow } from "@/modules/side-panel/components/reminder-management-row";
import { SectionEmptyState } from "@/modules/side-panel/components/section-empty-state";
import {
	SidePanelBackHeader,
	SidePanelLayout,
	SidePanelTopBar,
} from "@/modules/side-panel/components/side-panel-layout";
import type { Reminder, ReminderFilter } from "@/modules/side-panel/types";
import { reminderFilters } from "@/modules/side-panel/utils/constants";

type AllRemindersViewProps = {
	reminders: Reminder[];
	search: string;
	filter: ReminderFilter;
	isDarkMode: boolean;
	onBack: () => void;
	onAddJob: () => void;
	onSearchChange: (value: string) => void;
	onFilterChange: (value: ReminderFilter) => void;
	onOpenReminder: (reminder: Reminder) => void;
	onMarkDone: (reminderId: string) => void;
};

export function AllRemindersView({
	reminders,
	search,
	filter,
	isDarkMode: _isDarkMode,
	onBack,
	onAddJob,
	onSearchChange,
	onFilterChange,
	onOpenReminder,
	onMarkDone,
}: AllRemindersViewProps) {
	return (
		<SidePanelLayout
			header={
				<SidePanelTopBar
					leftSlot={
						<SidePanelBackHeader title="All Reminders" onBack={onBack} />
					}
					onAddJob={onAddJob}
				/>
			}
		>
			<div className="space-y-3">
				<div
					className={cn(
						"flex h-10 items-center gap-2 rounded-md border px-3",
						"border-input bg-card text-muted-foreground",
					)}
				>
					<Search className="size-4 shrink-0" aria-hidden="true" />
					<input
						value={search}
						placeholder="Search reminders..."
						className={cn(
							"min-w-0 flex-1 bg-transparent text-sm font-medium outline-none",
							"text-foreground placeholder:text-muted-foreground",
						)}
						onChange={(event) => onSearchChange(event.target.value)}
					/>
				</div>

				<div className="flex gap-2 overflow-x-auto pb-1">
					{reminderFilters.map((item) => (
						<button
							key={item}
							type="button"
							className={cn(
								"shrink-0 rounded-md border px-3 py-1.5 text-xs font-semibold transition",
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
						"overflow-hidden rounded-md border border-border/70 bg-card transition-colors",
					)}
				>
					{reminders.map((reminder) => (
						<ReminderManagementRow
							key={reminder.id}
							reminder={reminder}
							isDarkMode={_isDarkMode}
							onOpen={() => onOpenReminder(reminder)}
							onMarkDone={() => onMarkDone(reminder.id)}
						/>
					))}
					{!reminders.length && (
						<SectionEmptyState
							icon={CalendarDays}
							title="No reminders found"
							description="Reminders you create for saved jobs will appear here."
						/>
					)}
				</section>
			</div>
		</SidePanelLayout>
	);
}
