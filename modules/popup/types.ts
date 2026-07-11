export const jobStatuses = [
	"Interested",
	"Applied",
	"Interviewing",
	"Rejected",
	"Offer",
	"Saved",
] as const;

export type JobStatus = (typeof jobStatuses)[number];

export type JobForm = {
	title: string;
	company: string;
	location: string;
	url: string;
	platform: string;
	salary: string;
	logoUrl?: string;
	descriptionText?: string;
	descriptionHtml?: string;
	employmentType?: string;
	workplaceType?: string;
	status: JobStatus;
	deadline: string;
	followUpDate: string;
	followUpTime: string;
	reminderNote: string;
	reminderEnabled: boolean;
	reminderDone: boolean;
	notes: string;
};

export type PopupView = "detected" | "edit" | "saved";
