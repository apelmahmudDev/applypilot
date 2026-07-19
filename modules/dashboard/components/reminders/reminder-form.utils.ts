import { format } from "date-fns";

import type {
	DashboardReminder,
	ReminderFormValues,
} from "./reminder-form.types";

export const defaultReminderFormValues: ReminderFormValues = {
	type: "Follow up",
	date: "",
	time: "10:00",
	isActive: true,
	note: "Follow up on the application status and next steps.",
};

export function getReminderFormValues(
	reminder?: DashboardReminder | null,
): ReminderFormValues {
	if (!reminder) {
		return defaultReminderFormValues;
	}

	return {
		type: reminder.type,
		date: reminder.date,
		time: reminder.time,
		isActive: reminder.isActive,
		isDone: reminder.isDone,
		note: reminder.note,
	};
}

export function formatReminderSummary(dateValue: string) {
	if (!dateValue) {
		return "-";
	}

	return format(new Date(`${dateValue}T12:00:00`), "MMM d");
}

export function formatReminderDateField(dateValue: string) {
	if (!dateValue) {
		return "Select date";
	}

	return format(new Date(`${dateValue}T12:00:00`), "MMM d, yyyy");
}

export function formatReminderTimeField(timeValue: string) {
	if (!timeValue) {
		return "Select time";
	}

	return format(new Date(`1970-01-01T${timeValue}:00`), "hh:mm a");
}
