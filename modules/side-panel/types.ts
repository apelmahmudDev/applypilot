import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

export type JobStatus = "Applied" | "Interview" | "Saved";

export type RecentJob = {
	id: string;
	title: string;
	company: string;
	location: string;
	date: string;
	followUp: string;
	status: JobStatus;
	brand: "amazon" | "microsoft" | "swiggy" | "google";
};

export type Reminder = {
	id: string;
	company: string;
	title: string;
	description: string;
	time: string;
	icon: ComponentType<LucideProps>;
};
