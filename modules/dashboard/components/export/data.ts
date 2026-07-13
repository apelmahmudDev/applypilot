import {
	AlarmClock,
	Bookmark,
	BriefcaseBusiness,
	ChartColumnBig,
	Download,
	FileJson2,
	FileSpreadsheet,
	Lock,
	MessageSquareMore,
	RefreshCw,
	ShieldCheck,
	TriangleAlert,
} from "lucide-react";

import type { ExportFormatOption, ExportInfoItem, ExportItem } from "./types";

export const exportItems: ExportItem[] = [
	{
		id: "jobs",
		title: "Jobs & Applications",
		description: "All your job entries, status, dates, notes and details.",
		icon: BriefcaseBusiness,
		iconClassName: "bg-violet-50 text-violet-600",
	},
	{
		id: "saved",
		title: "Saved Jobs",
		description: "All jobs you have saved for later.",
		icon: Bookmark,
		iconClassName: "bg-emerald-50 text-emerald-600",
	},
	{
		id: "reminders",
		title: "Reminders",
		description: "All your reminders and scheduled notifications.",
		icon: AlarmClock,
		iconClassName: "bg-amber-50 text-amber-600",
	},
	// {
	// 	id: "notes",
	// 	title: "Notes",
	// 	description: "All notes you have added.",
	// 	icon: MessageSquareMore,
	// 	iconClassName: "bg-sky-50 text-sky-600",
	// },
	{
		id: "analytics",
		title: "Analytics Data",
		description: "Your statistics and performance data.",
		icon: ChartColumnBig,
		iconClassName: "bg-rose-50 text-rose-500",
	},
];

export const exportFormatOptions: ExportFormatOption[] = [
	{
		id: "json",
		title: "JSON (Recommended)",
		description:
			"Complete backup in JSON format. Best for restoring all your data.",
		extension: ".json",
	},
	{
		id: "csv",
		title: "CSV",
		description:
			"Export your jobs in CSV format. Good for viewing in spreadsheets.",
		extension: ".csv",
	},
];

export const exportRangeOptions = [
	{ value: "all-time", label: "All Time" },
	{ value: "last-30-days", label: "Last 30 Days" },
	{ value: "this-year", label: "This Year" },
];

export const exportInfoItems: ExportInfoItem[] = [
	{
		id: "local",
		title: "Local & Private",
		description:
			"Your data is exported directly from your browser. No data is sent anywhere.",
		icon: Download,
		iconClassName: "bg-violet-50 text-violet-600",
	},
	{
		id: "restore",
		title: "Easy to Restore",
		description: "You can import this file anytime to restore your data.",
		icon: RefreshCw,
		iconClassName: "bg-emerald-50 text-emerald-600",
	},
	{
		id: "safe",
		title: "Keep it Safe",
		description:
			"Store your export file in a safe place. Losing it means losing your data.",
		icon: TriangleAlert,
		iconClassName: "bg-amber-50 text-amber-600",
	},
];

export const exportPrivacyNote = {
	icon: ShieldCheck,
	text: "Only your data is exported. No personal information is collected.",
};

export const exportFooterNote = {
	icon: Lock,
	text: "Your data never leaves your browser",
};

export const exportFormatIcons = {
	json: FileJson2,
	csv: FileSpreadsheet,
};
