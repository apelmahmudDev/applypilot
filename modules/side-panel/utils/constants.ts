import type { ApplicationFilter, ReminderFilter } from "@/modules/side-panel/types";
import type { StoredJob } from "@/lib/jobs/storage";

export const applicationFilters: ApplicationFilter[] = [
	"All",
	"Saved",
	"Applied",
	"Interview",
	"Offer",
];

export const reminderFilters: ReminderFilter[] = [
	"Today",
	"Upcoming",
	"Completed",
];

export const nextStatusByStatus: Record<StoredJob["status"], StoredJob["status"]> = {
	Saved: "Applied",
	Applied: "Interviewing",
	Interviewing: "Offer",
	Offer: "Saved",
};
