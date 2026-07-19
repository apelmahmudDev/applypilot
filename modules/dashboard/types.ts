export type DashboardJobStatus =
	| "Applied"
	| "Interview"
	| "Saved"
	| "Offer";

export type DashboardJobType = "Full-time" | "Part-time" | "Contract";

export type DashboardJobSourceName =
	| "LinkedIn"
	| "Company Site"
	| "Manual"
	| "Indeed";

export type DashboardJobSource = {
	name: DashboardJobSourceName;
	url: string | null;
	faviconUrl: string | null;
};

export type DashboardReminder = {
	type: "Follow up" | "Interview" | "Task";
	date: string;
	time: string;
	isActive: boolean;
	note: string;
};

export type DashboardJob = {
	id: string;
	title: string;
	company: string;
	location: string;
	workMode: string;
	jobType: DashboardJobType;
	source: DashboardJobSource;
	appliedDate: string;
	savedDate: string;
	deadline?: string;
	reminder: string;
	reminderDetails?: DashboardReminder | null;
	status: DashboardJobStatus;
	salary?: string;
	notes: string;
	description: string;
	descriptionHtml?: string;
	experienceLevel?: string;
	currency?: string;
	tags?: string[];
	logoUrl?: string;
	brand:
		| "figma"
		| "vercel"
		| "airbnb"
		| "hubspot"
		| "notion"
		| "spotify"
		| "linear"
		| "calendly"
		| "plaid"
		| "canva";
};

export type DashboardStatusFilter =
	| "all"
	| "saved"
	| "applied"
	| "interview"
	| "offer";

export type DashboardSourceFilter =
	| "all"
	| "linkedin"
	| "company-site"
	| "indeed"
	| "manual";
