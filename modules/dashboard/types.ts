export type DashboardJobStatus =
	| "Applied"
	| "Interview"
	| "Saved"
	| "Rejected"
	| "Offer";

export type DashboardJobType = "Full-time" | "Contract";

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
	reminder: string;
	status: DashboardJobStatus;
	salary?: string;
	notes: string;
	description: string;
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
	| "rejected"
	| "offer";

export type DashboardSourceFilter =
	| "all"
	| "linkedin"
	| "company-site"
	| "indeed"
	| "manual";
