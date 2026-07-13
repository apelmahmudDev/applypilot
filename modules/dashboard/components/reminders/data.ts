import {
	Bell,
	CalendarClock,
	CalendarDays,
	CheckCircle2,
	Clock3,
} from "lucide-react";

import type {
	ReminderSection,
	ReminderStat,
} from "./types";

export const reminderStats: ReminderStat[] = [
	{
		label: "All Reminders",
		value: "12",
		description: "Across all tracked jobs",
		icon: Bell,
		accentClassName: "bg-blue-50 text-blue-600",
	},
	{
		label: "Due Today",
		value: "5",
		description: "Need attention today",
		icon: CalendarDays,
		accentClassName: "bg-emerald-50 text-emerald-600",
	},
	{
		label: "Due This Week",
		value: "4",
		description: "Upcoming follow-ups",
		icon: Clock3,
		accentClassName: "bg-amber-50 text-amber-500",
	},
	{
		label: "Overdue",
		value: "3",
		description: "Past scheduled date",
		icon: CalendarClock,
		accentClassName: "bg-violet-50 text-violet-600",
	},
	{
		label: "Completed",
		value: "8",
		description: "Marked done this week",
		icon: CheckCircle2,
		accentClassName: "bg-slate-100 text-slate-600",
	},
];

export const reminderSections: ReminderSection[] = [
	{
		id: "today",
		title: "Today",
		eyebrow: "May 20, 2025",
		rows: [
			{
				id: "openai-frontend",
				title: "Frontend Engineer",
				company: "OpenAI",
				companyMark: "O",
				companyMarkClassName: "bg-black text-white",
				kind: "Follow-up",
				note: "Follow up on application status",
				dueLabel: "Today",
				timeLabel: "10:00 AM",
			},
			{
				id: "notion-product",
				title: "Product Designer",
				company: "Notion",
				companyMark: "N",
				companyMarkClassName: "bg-white text-black ring-1 ring-slate-200",
				kind: "Interview",
				note: "Prepare for design interview",
				dueLabel: "Today",
				timeLabel: "02:00 PM",
			},
		],
	},
	{
		id: "this-week",
		title: "This Week",
		rows: [
			{
				id: "spotify-backend",
				title: "Backend Developer",
				company: "Spotify",
				companyMark: "S",
				companyMarkClassName: "bg-green-500 text-white",
				kind: "Task",
				note: "Complete coding assignment",
				dueLabel: "May 22, 2025",
				timeLabel: "11:00 AM",
			},
			{
				id: "linear-fullstack",
				title: "Full Stack Developer",
				company: "Linear",
				companyMark: "L",
				companyMarkClassName: "bg-slate-900 text-white",
				kind: "Follow-up",
				note: "Send thank you email",
				dueLabel: "May 23, 2025",
				timeLabel: "09:30 AM",
			},
		],
	},
	{
		id: "later",
		title: "Later",
		rows: [
			{
				id: "hubspot-data",
				title: "Data Analyst",
				company: "HubSpot",
				companyMark: "H",
				companyMarkClassName: "bg-orange-500 text-white",
				kind: "Interview",
				note: "Technical interview round",
				dueLabel: "May 28, 2025",
				timeLabel: "01:00 PM",
			},
			{
				id: "duolingo-mobile",
				title: "Mobile Developer",
				company: "Duolingo",
				companyMark: "D",
				companyMarkClassName: "bg-lime-500 text-white",
				kind: "Follow-up",
				note: "Check application status",
				dueLabel: "May 31, 2025",
				timeLabel: "10:00 AM",
			},
		],
	},
];

export const reminderSummaryItems = [
	{ label: "Due Today", value: "5", tone: "text-blue-600" },
	{ label: "Due This Week", value: "4", tone: "text-amber-500" },
	{ label: "Overdue", value: "3", tone: "text-rose-500" },
	{ label: "Completed", value: "8", tone: "text-emerald-600" },
];

export const reminderQuickActions = [
	"Add Reminder",
	"View Calendar",
	"Completed Reminders",
	"Reminder Settings",
];
