import type { ApplicationFilter, ReminderFilter } from "@/modules/side-panel/types";
import type { StoredJob } from "@/lib/jobs/storage";

export const applicationFilters: ApplicationFilter[] = [
	"All",
	"Saved",
	"Applied",
	"Interview",
	"Rejected",
	"Offer",
];

export const reminderFilters: ReminderFilter[] = [
	"Today",
	"Upcoming",
	"Completed",
];

export const nextStatusByStatus: Record<StoredJob["status"], StoredJob["status"]> = {
	Interested: "Saved",
	Saved: "Applied",
	Applied: "Interviewing",
	Interviewing: "Offer",
	Offer: "Rejected",
	Rejected: "Saved",
};
