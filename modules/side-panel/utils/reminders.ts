import { CalendarDays } from "lucide-react";
import {
	differenceInCalendarDays,
	endOfDay,
	format,
	isValid,
	parseISO,
	startOfDay,
} from "date-fns";

import type { StoredJob } from "@/lib/jobs/storage";
import type { Reminder } from "@/modules/side-panel/types";
import { formatDateSlash, formatTime } from "@/modules/side-panel/utils/format";

export function mapStoredJobToReminder(job: StoredJob): Reminder | null {
	if (!job.reminderEnabled || job.reminderDone || !job.followUpDate) {
		return null;
	}

	const dueAt = getReminderDate(job.followUpDate, job.followUpTime);

	if (!dueAt) {
		return null;
	}

	const now = new Date();
	const today = startOfDay(now);
	const dueDay = startOfDay(dueAt);
	const daysUntil = differenceInCalendarDays(dueDay, today);
	const isOverdue = endOfDay(dueAt).getTime() < now.getTime();

	return {
		id: job.id,
		jobId: job.id,
		company: job.company || "Unknown company",
		logoUrl: job.logoUrl || undefined,
		title: job.title || "Untitled role",
		description: job.reminderNote || "Follow up on this application",
		reminderType: job.reminderType,
		timeLabel: getReminderTimeLabel(dueAt, daysUntil),
		statusLabel: getReminderBadgeLabel(daysUntil, isOverdue),
		statusTone: getReminderTone(daysUntil, isOverdue),
		followUpDate: job.followUpDate,
		followUpTime: job.followUpTime,
		isCompleted: false,
		icon: CalendarDays,
	};
}

export function compareReminders(first: Reminder, second: Reminder) {
	const firstDate = getReminderDate(first.followUpDate, first.followUpTime);
	const secondDate = getReminderDate(second.followUpDate, second.followUpTime);

	if (!firstDate || !secondDate) {
		return 0;
	}

	return firstDate.getTime() - secondDate.getTime();
}

export function isReminderDueToday(reminder: Reminder) {
	const dueAt = getReminderDate(reminder.followUpDate, reminder.followUpTime);

	return dueAt
		? differenceInCalendarDays(startOfDay(dueAt), startOfDay(new Date())) === 0
		: false;
}

export function isReminderUpcoming(reminder: Reminder) {
	const dueAt = getReminderDate(reminder.followUpDate, reminder.followUpTime);

	return dueAt
		? differenceInCalendarDays(startOfDay(dueAt), startOfDay(new Date())) > 0
		: false;
}

export function getReminderDate(dateValue: string, timeValue: string) {
	const isoValue = `${dateValue}T${timeValue || "09:00"}:00`;
	const parsedDate = parseISO(isoValue);

	return isValid(parsedDate) ? parsedDate : null;
}

function getReminderTimeLabel(dueAt: Date, daysUntil: number) {
	const time = formatTime(format(dueAt, "HH:mm"));

	if (daysUntil === 0) {
		return time ? `Today, ${time}` : "Today";
	}

	if (daysUntil === 1) {
		return time ? `Tomorrow, ${time}` : "Tomorrow";
	}

	if (daysUntil < 0) {
		const overdueLabel = formatDateSlash(format(dueAt, "yyyy-MM-dd"));
		return time ? `${overdueLabel}, ${time}` : overdueLabel;
	}

	const futureLabel = formatDateSlash(format(dueAt, "yyyy-MM-dd"));
	return time ? `${futureLabel}, ${time}` : futureLabel;
}

function getReminderBadgeLabel(daysUntil: number, isOverdue: boolean) {
	if (isOverdue) return "Overdue";
	if (daysUntil === 0) return "Today";
	if (daysUntil === 1) return "Tomorrow";
	return `In ${daysUntil} days`;
}

function getReminderTone(
	daysUntil: number,
	isOverdue: boolean,
): Reminder["statusTone"] {
	if (isOverdue) return "overdue";
	if (daysUntil === 0) return "today";
	if (daysUntil === 1) return "tomorrow";
	return "upcoming";
}
