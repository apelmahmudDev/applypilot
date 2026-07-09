export type DashboardJobStatus =
	| "Applied"
	| "Interview"
	| "Saved"
	| "Rejected"
	| "Offer";

export type DashboardJob = {
	id: string;
	title: string;
	company: string;
	location: string;
	deadline: string;
	followUp: string;
	status: DashboardJobStatus;
	brand: "google" | "microsoft" | "swiggy" | "amazon" | "zomato";
};

export type DashboardStatusFilter =
	| "all"
	| "saved"
	| "applied"
	| "interview"
	| "rejected"
	| "offer";
