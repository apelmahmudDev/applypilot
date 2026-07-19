import { format, isAfter, isBefore, isSameDay, parseISO, startOfDay } from "date-fns";
import {
	Bell,
	CalendarClock,
	CalendarDays,
	CheckCircle2,
	Clock3,
} from "lucide-react";

import type { StatsCardItem } from "@/modules/dashboard/components/stats-card-grid";
import type {
	ReminderRow,
	ReminderSection,
	ReminderStat,
} from "@/modules/dashboard/components/reminders/types";
import type { DashboardJob } from "@/modules/dashboard/types";

type ReminderBucket = "overdue" | "today" | "this-week" | "later";

export function buildReminderRows(jobs: DashboardJob[]): ReminderRow[] {
	return jobs
		.filter(
			(job) =>
				Boolean(job.reminderDetails?.date) &&
				Boolean(job.reminderDetails?.isActive) &&
				!job.reminderDetails?.isDone,
		)
		.map((job) => {
			const reminder = job.reminderDetails!;

			return {
				id: `reminder-${job.id}`,
				jobId: job.id,
				title: job.title,
				company: job.company,
				companyMark: getCompanyMark(job.company),
				companyMarkClassName: getCompanyMarkClassName(job),
				kind: mapReminderKind(reminder.type),
				note: reminder.note || "No note added.",
				dueLabel: formatReminderDueLabel(reminder.date),
				timeLabel: formatReminderTimeLabel(reminder.time),
				reminderDetails: reminder,
			};
		})
		.sort((firstReminder, secondReminder) => {
			const firstDate = parseISO(
				`${firstReminder.reminderDetails.date}T${firstReminder.reminderDetails.time || "00:00"}:00`,
			);
			const secondDate = parseISO(
				`${secondReminder.reminderDetails.date}T${secondReminder.reminderDetails.time || "00:00"}:00`,
			);

			return firstDate.getTime() - secondDate.getTime();
		});
}

export function filterReminderRows(
	rows: ReminderRow[],
	options: {
		search: string;
		type: ReminderRow["reminderDetails"]["type"] | "all";
		date: Date | undefined;
	},
) {
	const query = options.search.trim().toLowerCase();
	const selectedDate = options.date ? startOfDay(options.date) : null;

	return rows.filter((row) => {
		const matchesSearch =
			!query ||
			[row.title, row.company].some((value) =>
				value.toLowerCase().includes(query),
			);
		const matchesType =
			options.type === "all" || row.reminderDetails.type === options.type;
		const matchesDate = selectedDate
			? isSameDay(parseISO(`${row.reminderDetails.date}T12:00:00`), selectedDate)
			: true;

		return matchesSearch && matchesType && matchesDate;
	});
}

export function buildReminderSections(
	rows: ReminderRow[],
	referenceDate: Date,
): ReminderSection[] {
	const groupedRows = rows.reduce<Record<ReminderBucket, ReminderRow[]>>(
		(groups, row) => {
			groups[getReminderBucket(row, referenceDate)].push(row);
			return groups;
		},
		{
			overdue: [],
			today: [],
			"this-week": [],
			later: [],
		},
	);

	const sections: ReminderSection[] = [];

	if (groupedRows.overdue.length) {
		sections.push({
			id: "overdue",
			title: "Overdue",
			rows: groupedRows.overdue,
		});
	}

	if (groupedRows.today.length) {
		sections.push({
			id: "today",
			title: "Today",
			eyebrow: format(referenceDate, "MMM d, yyyy"),
			rows: groupedRows.today,
		});
	}

	if (groupedRows["this-week"].length) {
		sections.push({
			id: "this-week",
			title: "This Week",
			rows: groupedRows["this-week"],
		});
	}

	if (groupedRows.later.length) {
		sections.push({
			id: "later",
			title: "Later",
			rows: groupedRows.later,
		});
	}

	return sections;
}

export function buildReminderStats(
	jobs: DashboardJob[],
	rows: ReminderRow[],
	referenceDate: Date,
): ReminderStat[] {
	const completed = jobs.filter((job) => job.reminderDetails?.isDone).length;
	const counts = rows.reduce(
		(result, row) => {
			const bucket = getReminderBucket(row, referenceDate);
			result.total += 1;

			if (bucket === "today") result.today += 1;
			if (bucket === "this-week") result.thisWeek += 1;
			if (bucket === "overdue") result.overdue += 1;
			return result;
		},
		{
			total: 0,
			today: 0,
			thisWeek: 0,
			overdue: 0,
		},
	);

	return [
		{
			label: "All Reminders",
			value: String(counts.total),
			description: "Across all tracked jobs",
			icon: Bell,
			accentClassName:
				"bg-blue-50 text-blue-600 dark:bg-blue-500/18 dark:text-blue-200",
		},
		{
			label: "Due Today",
			value: String(counts.today),
			description: "Need attention today",
			icon: CalendarDays,
			accentClassName:
				"bg-emerald-50 text-emerald-600 dark:bg-emerald-500/18 dark:text-emerald-200",
		},
		{
			label: "Due This Week",
			value: String(counts.thisWeek),
			description: "Upcoming follow-ups",
			icon: Clock3,
			accentClassName:
				"bg-amber-50 text-amber-500 dark:bg-amber-500/18 dark:text-amber-200",
		},
		{
			label: "Overdue",
			value: String(counts.overdue),
			description: "Past scheduled date",
			icon: CalendarClock,
			accentClassName:
				"bg-violet-50 text-violet-600 dark:bg-violet-500/18 dark:text-violet-200",
		},
		{
			label: "Completed",
			value: String(completed),
			description: "Marked done",
			icon: CheckCircle2,
			accentClassName:
				"bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-100",
		},
	];
}

export function toReminderStatsCards(stats: ReminderStat[]): StatsCardItem[] {
	return stats;
}

function getReminderBucket(row: ReminderRow, referenceDate: Date): ReminderBucket {
	const today = startOfDay(referenceDate);
	const reminderDate = startOfDay(
		parseISO(`${row.reminderDetails.date}T12:00:00`),
	);

	if (isBefore(reminderDate, today)) {
		return "overdue";
	}

	if (isSameDay(reminderDate, today)) {
		return "today";
	}

	const daysDiff = Math.floor(
		(reminderDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
	);

	if (daysDiff <= 7 && isAfter(reminderDate, today)) {
		return "this-week";
	}

	return "later";
}

function mapReminderKind(
	type: ReminderRow["reminderDetails"]["type"],
): ReminderRow["kind"] {
	if (type === "Interview") return "Interview";
	if (type === "Task") return "Task";
	return "Follow-up";
}

function formatReminderDueLabel(dateValue: string) {
	return format(parseISO(`${dateValue}T12:00:00`), "MMM d, yyyy");
}

function formatReminderTimeLabel(timeValue: string) {
	if (!timeValue) {
		return "-";
	}

	return format(parseISO(`1970-01-01T${timeValue}:00`), "hh:mm a");
}

function getCompanyMark(company: string) {
	return company.trim().charAt(0).toUpperCase() || "?";
}

function getCompanyMarkClassName(job: DashboardJob) {
	if (job.logoUrl) {
		return "bg-white text-slate-700 ring-1 ring-slate-200 dark:bg-slate-100 dark:text-slate-900 dark:ring-slate-700";
	}

	switch (job.brand) {
		case "vercel":
		case "plaid":
		case "linear":
			return "bg-slate-950 text-white dark:bg-slate-700 dark:text-slate-100";
		case "hubspot":
			return "bg-orange-500 text-white";
		case "spotify":
			return "bg-green-500 text-white";
		case "notion":
			return "bg-white text-black ring-1 ring-slate-200 dark:bg-slate-100 dark:text-black dark:ring-slate-600";
		case "calendly":
			return "bg-blue-600 text-white";
		case "canva":
			return "bg-cyan-500 text-white";
		case "airbnb":
			return "bg-rose-500 text-white";
		case "figma":
			return "bg-gradient-to-br from-orange-500 via-pink-500 to-blue-500 text-white";
		default:
			return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100";
	}
}
