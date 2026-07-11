import type { StoredJob } from "@/lib/jobs/storage";
import type { JobForm } from "@/modules/popup/types";
import type {
	JobStatus,
	RecentJob,
	SidePanelJobForm,
	SidePanelJobStatus,
} from "@/modules/side-panel/types";
import { formatDate } from "@/modules/side-panel/utils/format";

export function mapStoredJobToRecentJob(job: StoredJob): RecentJob {
	return {
		id: job.id,
		title: job.title || "Untitled role",
		company: job.company || "Unknown company",
		location: job.location || "Unknown location",
		date: formatDate(job.updatedAt),
		followUp: job.followUpDate ? formatDate(job.followUpDate) : "No reminder",
		status: mapJobStatus(job.status),
		brand: getBrand(job.company, job.platform),
		logoUrl: job.logoUrl,
	};
}

export function mapJobStatus(status: StoredJob["status"]): JobStatus {
	if (status === "Applied") return "Applied";
	if (status === "Interviewing") return "Interview";
	if (status === "Rejected") return "Rejected";
	if (status === "Offer") return "Offer";
	return "Saved";
}

export function getBrand(company: string, platform: string): RecentJob["brand"] {
	const value = `${company} ${platform}`.toLowerCase();

	if (value.includes("google")) return "google";
	if (value.includes("microsoft")) return "microsoft";
	if (value.includes("amazon")) return "amazon";
	if (value.includes("swiggy")) return "swiggy";

	return "default";
}

export function toStoredJobForm(job: SidePanelJobForm): JobForm {
	const descriptionText = job.notes;
	const descriptionHtml =
		job.descriptionHtml && job.descriptionText === job.notes
			? job.descriptionHtml
			: undefined;

	return {
		title: job.title,
		company: job.company,
		location: job.location,
		url: job.url,
		platform: job.platform,
		salary: job.salary,
		logoUrl: job.logoUrl,
		descriptionText,
		descriptionHtml,
		employmentType: job.employmentType,
		workplaceType: job.workplaceType,
		status: mapSidePanelStatus(job.status),
		deadline: job.deadline,
		followUpDate: job.followUpDate,
		followUpTime: job.followUpTime,
		reminderNote: job.reminderNote,
		reminderEnabled: job.reminderEnabled,
		reminderDone: job.reminderDone,
		notes: job.notes,
	};
}

export function toSidePanelJobForm(job: StoredJob): SidePanelJobForm {
	const descriptionText = job.descriptionText || job.notes;

	return {
		title: job.title,
		company: job.company,
		location: job.location,
		url: job.url,
		platform: job.platform,
		salary: "",
		logoUrl: job.logoUrl,
		descriptionText,
		descriptionHtml: job.descriptionHtml,
		employmentType: job.employmentType,
		workplaceType: job.workplaceType,
		status: mapStoredStatusToSidePanelStatus(job.status),
		deadline: "",
		followUpDate: job.followUpDate,
		followUpTime: job.followUpTime,
		reminderNote: job.reminderNote,
		reminderEnabled: job.reminderEnabled,
		reminderDone: job.reminderDone,
		notes: descriptionText,
	};
}

function mapSidePanelStatus(status: SidePanelJobStatus): StoredJob["status"] {
	if (status === "Interview") return "Interviewing";
	if (status === "Saved") return "Saved";
	if (status === "Applied") return "Applied";
	if (status === "Rejected") return "Rejected";
	if (status === "Offer") return "Offer";
	return "Interested";
}

function mapStoredStatusToSidePanelStatus(
	status: StoredJob["status"],
): SidePanelJobStatus {
	if (status === "Interviewing") return "Interview";
	if (status === "Saved") return "Saved";
	if (status === "Applied") return "Applied";
	if (status === "Rejected") return "Rejected";
	if (status === "Offer") return "Offer";
	return "Interested";
}
