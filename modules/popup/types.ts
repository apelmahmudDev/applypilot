import type { ReminderTypeOption } from "@/modules/dashboard/components/reminders/reminder-form.types";

export const jobStatuses = [
	"Saved",
	"Applied",
	"Interviewing",
	"Rejected",
	"Offer",
] as const;

export type JobStatus = (typeof jobStatuses)[number];

export type JobForm = {
	title: string;
	company: string;
	location: string;
	url: string;
	platform: string;
	salary: string;
	currency: string;
	logoUrl?: string;
	descriptionText?: string;
	descriptionHtml?: string;
	employmentType?: string;
	workplaceType?: string;
	experienceLevel?: string;
	status: JobStatus;
	savedDate: string;
	deadline: string;
	reminderType: ReminderTypeOption;
	followUpDate: string;
	followUpTime: string;
	reminderNote: string;
	reminderEnabled: boolean;
	reminderDone: boolean;
	notes: string;
};

export type PopupView = "detected" | "edit" | "saved";
