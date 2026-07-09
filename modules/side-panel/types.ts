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
};

export type Reminder = {
	id: string;
	company: string;
	title: string;
	description: string;
	time: string;
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
	status: SidePanelJobStatus;
	deadline: string;
	followUpDate: string;
	recruiterName: string;
	recruiterEmail: string;
	tags: string[];
	notes: string;
};
