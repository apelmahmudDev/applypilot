import { useMemo, useState } from "react";

import {
	buildReminderRows,
	buildReminderSections,
	buildReminderStats,
	filterReminderRows,
} from "@/modules/dashboard/data/dashboard-reminders";
import { useDashboardJobs } from "@/modules/dashboard/hooks/use-dashboard-jobs";
import type { ReminderFormValues } from "@/modules/dashboard/components/reminders/reminder-form.types";

export function useDashboardReminders() {
	const dashboardJobs = useDashboardJobs();
	const [search, setSearch] = useState("");
	const [selectedReminderType, setSelectedReminderType] = useState<
		ReminderFormValues["type"] | "all"
	>("all");
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

	const referenceDate = useMemo(() => new Date(), []);

	const reminderRows = useMemo(
		() => buildReminderRows(dashboardJobs.jobs),
		[dashboardJobs.jobs],
	);

	const filteredRows = useMemo(
		() =>
			filterReminderRows(reminderRows, {
				search,
				type: selectedReminderType,
				date: selectedDate,
			}),
		[reminderRows, search, selectedReminderType, selectedDate],
	);

	const sections = useMemo(
		() => buildReminderSections(filteredRows, referenceDate),
		[filteredRows, referenceDate],
	);

	const stats = useMemo(
		() => buildReminderStats(dashboardJobs.jobs, filteredRows, referenceDate),
		[dashboardJobs.jobs, filteredRows, referenceDate],
	);

	return {
		...dashboardJobs,
		search,
		setSearch,
		selectedReminderType,
		setSelectedReminderType,
		selectedDate,
		setSelectedDate,
		sections,
		stats,
		totalVisibleReminders: filteredRows.length,
		referenceDate,
	};
}
