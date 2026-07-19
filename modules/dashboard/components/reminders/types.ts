import type { LucideIcon } from "lucide-react";

import type { ReminderFormValues } from "./reminder-form.types";

export type ReminderStat = {
	label: string;
	value: string;
	description: string;
	icon: LucideIcon;
	accentClassName: string;
};

export type ReminderRow = {
	id: string;
	jobId: string;
	title: string;
	company: string;
	companyMark: string;
	companyMarkClassName: string;
	kind: "Follow-up" | "Interview" | "Task";
	note: string;
	dueLabel: string;
	timeLabel: string;
	reminderDetails: ReminderFormValues;
};

export type ReminderSection = {
	id: "overdue" | "today" | "this-week" | "later";
	title: string;
	eyebrow?: string;
	rows: ReminderRow[];
};

export type ReminderFilterOption = {
	value: string;
	label: string;
	icon?: LucideIcon;
};
