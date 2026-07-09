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
	status: JobStatus;
	notes: string;
};

export type PopupView = "detected" | "edit" | "saved";
