import { format } from "date-fns";

import {
	createJobInStorage,
	getStoredJobs,
	updateJobInStorage,
	type StoredJob,
} from "@/lib/jobs/storage";
import type { ReminderFormValues } from "@/modules/dashboard/components/reminders/reminder-form.types";
import type { DashboardJob, DashboardJobSourceName } from "@/modules/dashboard/types";
import type { JobForm } from "@/modules/popup/types";

const fallbackBrands: DashboardJob["brand"][] = [
	"figma",
	"vercel",
	"airbnb",
	"hubspot",
	"notion",
	"spotify",
	"linear",
	"calendly",
	"plaid",
	"canva",
];

export async function getDashboardJobs(): Promise<DashboardJob[]> {
	const jobs = await getStoredJobs();

	return jobs.map(mapStoredJobToDashboardJob);
}

export async function createDashboardJob(job: DashboardJob): Promise<DashboardJob> {
	const result = await createJobInStorage(toStoredJobForm(job));
	return mapStoredJobToDashboardJob(result.job);
}

export async function updateDashboardJob(job: DashboardJob): Promise<DashboardJob> {
	const result = await updateJobInStorage(job.id, toStoredJobForm(job));
	return mapStoredJobToDashboardJob(result.job);
}

export async function updateDashboardJobReminder(
	jobId: string,
	values: ReminderFormValues,
): Promise<DashboardJob | null> {
	const jobs = await getStoredJobs();
	const existingJob = jobs.find((job) => job.id === jobId);

	if (!existingJob) {
		return null;
	}

	const updatedForm: JobForm = {
		...existingJob,
		followUpDate: values.date,
		followUpTime: values.time,
		reminderType: values.type,
		reminderNote: values.note,
		reminderEnabled: values.isActive && Boolean(values.date),
		reminderDone: false,
	};

	const result = await updateJobInStorage(jobId, updatedForm);
	return mapStoredJobToDashboardJob(result.job);
}

export function mapStoredJobToDashboardJob(job: StoredJob): DashboardJob {
	const sourceName = inferSourceName(job.platform, job.url);

	return {
		id: job.id,
		title: job.title || "Untitled role",
		company: job.company || "Unknown company",
		location: job.location || "Unknown location",
		workMode: job.workplaceType || "Remote",
		jobType: inferJobType(job.employmentType),
		source: {
			name: sourceName,
			url: job.url || null,
			faviconUrl: job.url ? buildFaviconUrl(job.url) : null,
		},
		appliedDate: getDisplayTimelineDate(job),
		savedDate: formatDisplayDate(job.savedDate || job.createdAt),
		reminder:
			job.reminderEnabled && job.followUpDate
				? format(new Date(`${job.followUpDate}T12:00:00`), "MMM d")
				: "-",
		reminderDetails:
			job.reminderEnabled && job.followUpDate
				? {
						type: job.reminderType,
						date: job.followUpDate,
						time: job.followUpTime || "10:00",
						isActive: job.reminderEnabled,
						note: job.reminderNote,
					}
				: null,
		status: mapStoredStatus(job.status),
		salary: formatSalary(job.salary, job.currency),
		notes: job.notes,
		description: job.descriptionText || job.notes || "No description available.",
		experienceLevel: job.experienceLevel || undefined,
		currency: job.currency || undefined,
		brand: inferBrand(job.company, job.platform),
	};
}

function toStoredJobForm(job: DashboardJob): JobForm {
	return {
		title: job.title,
		company: job.company,
		location: job.location,
		url: job.source.url ?? "",
		platform: job.source.name,
		salary: normalizeStoredSalary(job.salary),
		currency: job.currency ?? "",
		logoUrl: "",
		descriptionText: job.description,
		descriptionHtml: "",
		employmentType: job.jobType,
		workplaceType: job.workMode,
		experienceLevel: job.experienceLevel ?? "",
		status: mapDashboardStatus(job.status),
		savedDate: toStorageDate(job.savedDate),
		deadline: "",
		reminderType: job.reminderDetails?.type ?? "Follow up",
		followUpDate: job.reminderDetails?.date ?? "",
		followUpTime: job.reminderDetails?.time ?? "",
		reminderNote: job.reminderDetails?.note ?? "",
		reminderEnabled: Boolean(
			job.reminderDetails?.isActive && job.reminderDetails.date,
		),
		reminderDone: false,
		notes: job.notes,
	};
}

function inferSourceName(
	platform: string,
	url: string,
): DashboardJobSourceName {
	const sourceValue = `${platform} ${url}`.toLowerCase();

	if (sourceValue.includes("linkedin")) return "LinkedIn";
	if (sourceValue.includes("indeed")) return "Indeed";
	if (!platform.trim() && !url.trim()) return "Manual";
	if (platform.trim().toLowerCase() === "manual") return "Manual";

	return "Company Site";
}

function inferJobType(employmentType: string): DashboardJob["jobType"] {
	if (employmentType === "Part-time") return "Part-time";
	if (employmentType === "Contract") return "Contract";
	return "Full-time";
}

function mapStoredStatus(status: StoredJob["status"]): DashboardJob["status"] {
	if (status === "Interviewing") return "Interview";
	if (status === "Applied") return "Applied";
	if (status === "Rejected") return "Rejected";
	if (status === "Offer") return "Offer";
	return "Saved";
}

function mapDashboardStatus(status: DashboardJob["status"]): JobForm["status"] {
	if (status === "Interview") return "Interviewing";
	return status;
}

function inferBrand(company: string, platform: string): DashboardJob["brand"] {
	const value = `${company} ${platform}`.toLowerCase();

	if (value.includes("figma")) return "figma";
	if (value.includes("vercel")) return "vercel";
	if (value.includes("airbnb")) return "airbnb";
	if (value.includes("hubspot")) return "hubspot";
	if (value.includes("notion")) return "notion";
	if (value.includes("spotify")) return "spotify";
	if (value.includes("linear")) return "linear";
	if (value.includes("calendly")) return "calendly";
	if (value.includes("plaid")) return "plaid";
	if (value.includes("canva")) return "canva";

	const hashSeed = company.trim().toLowerCase() || platform.trim().toLowerCase();
	const hash = Array.from(hashSeed).reduce(
		(total, character) => total + character.charCodeAt(0),
		0,
	);

	return fallbackBrands[hash % fallbackBrands.length];
}

function buildFaviconUrl(url: string) {
	try {
		const parsedUrl = new URL(url);
		return `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`;
	} catch {
		return null;
	}
}

function formatDisplayDate(value: string) {
	const date = parseStoredDate(value);

	if (Number.isNaN(date.getTime())) {
		return value;
	}

	return format(date, "MMM d, yyyy");
}

function getDisplayTimelineDate(job: StoredJob) {
	const preferredDate =
		job.status === "Saved"
			? job.savedDate || job.createdAt
			: job.updatedAt || job.savedDate || job.createdAt;

	return formatDisplayDate(preferredDate);
}

function formatSalary(salary: string, currency: string) {
	if (!salary.trim()) {
		return "Not specified";
	}

	if (!currency.trim() || salary.includes(currency)) {
		return salary;
	}

	return `${salary} ${currency}`.trim();
}

function normalizeStoredSalary(salary?: string) {
	return salary === "Not specified" ? "" : salary ?? "";
}

function toStorageDate(value: string) {
	const date = parseStoredDate(value);

	if (Number.isNaN(date.getTime())) {
		return value;
	}

	return format(date, "yyyy-MM-dd");
}

function parseStoredDate(value: string) {
	if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		return new Date(`${value}T12:00:00`);
	}

	return new Date(value);
}
