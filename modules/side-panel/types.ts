import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

export type JobStatus =
	| "Applied"
	| "Interview"
	| "Saved"
	| "Rejected"
	| "Offer";

export type RecentJob = {
	id: string;
	title: string;
	company: string;
	location: string;
	date: string;
	followUp: string;
	status: JobStatus;
	brand: "amazon" | "microsoft" | "swiggy" | "google" | "default";
	logoUrl?: string;
};

export type Reminder = {
	id: string;
	jobId: string;
	company: string;
	title: string;
	description: string;
	timeLabel: string;
	statusLabel: string;
	statusTone: "overdue" | "today" | "tomorrow" | "upcoming" | "completed";
	followUpDate: string;
	followUpTime: string;
	isCompleted: boolean;
	icon: ComponentType<LucideProps>;
};

export type SidePanelJobStatus =
	| "Saved"
	| "Applied"
	| "Interview"
	| "Interested"
	| "Rejected"
	| "Offer";

export type SidePanelJobForm = {
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
	status: SidePanelJobStatus;
	deadline: string;
	followUpDate: string;
	followUpTime: string;
	reminderNote: string;
	reminderEnabled: boolean;
	reminderDone: boolean;
	notes: string;
};

export type SidePanelView =
	| "home"
	| "applications"
	| "reminders"
	| "jobDetails"
	| "reminderDetails";

export type DetailsBackView = Exclude<
	SidePanelView,
	"jobDetails" | "reminderDetails"
>;

export type ApplicationFilter = "All" | JobStatus;

export type ReminderFilter = "Today" | "Upcoming" | "Completed";
