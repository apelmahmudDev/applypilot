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
		followUp: "Saved locally",
		status: mapJobStatus(job.status),
		brand: getBrand(job.company, job.platform),
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

export function toStoredJobForm(
	job: SidePanelJobForm,
): JobForm {
	return {
		title: job.title,
		company: job.company,
		location: job.location,
		url: job.url,
		platform: job.platform,
		status: mapSidePanelStatus(job.status),
		notes: job.notes,
	};
}

export function toSidePanelJobForm(job: StoredJob): SidePanelJobForm {
	return {
		title: job.title,
		company: job.company,
		location: job.location,
		url: job.url,
		platform: job.platform,
		salary: "",
		status: mapStoredStatusToSidePanelStatus(job.status),
		deadline: "",
		followUpDate: "",
		recruiterName: "",
		recruiterEmail: "",
		tags: [],
		notes: job.notes,
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
