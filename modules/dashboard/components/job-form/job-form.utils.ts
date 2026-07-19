import { format } from "date-fns";

import type { DashboardJob } from "@/modules/dashboard/types";

export const workTypeOptions = [
	"Remote",
	"Hybrid",
	"On-site",
	"Worldwide",
] as const;

export const experienceLevelOptions = [
	"Entry-level",
	"Mid-level",
	"Senior",
	"Lead",
] as const;

export const currencyOptions = ["USD", "EUR", "GBP", "BDT"] as const;

export const jobStatusOptions = [
	"Saved",
	"Applied",
	"Interview",
	"Offer",
] as const satisfies ReadonlyArray<DashboardJob["status"]>;

export const jobStatusLabels: Record<DashboardJob["status"], string> = {
	Saved: "Saved",
	Applied: "Applied",
	Interview: "Interviewing",
	Offer: "Offers",
};

export type DashboardJobFormValues = {
	title: string;
	company: string;
	status: DashboardJob["status"];
	location: string;
	workMode: string;
	jobType: DashboardJob["jobType"];
	experienceLevel: string;
	sourceName: DashboardJob["source"]["name"];
	url: string;
	savedDate: string;
	deadline: string;
	salary: string;
	currency: string;
	notes: string;
};

export function createEmptyJobFormValues(): DashboardJobFormValues {
	const today = format(new Date(), "yyyy-MM-dd");

	return {
		title: "",
		company: "",
		status: "Saved",
		location: "",
		workMode: "Remote",
		jobType: "Full-time",
		experienceLevel: "Mid-level",
		sourceName: "LinkedIn",
		url: "",
		savedDate: today,
		deadline: "",
		salary: "",
		currency: "",
		notes: "",
	};
}

export function createJobFormValues(job: DashboardJob): DashboardJobFormValues {
	return {
		title: job.title,
		company: job.company,
		status: job.status,
		location: job.location,
		workMode: normalizeWorkModeOption(job.workMode),
		jobType: job.jobType,
		experienceLevel: job.experienceLevel ?? "Mid-level",
		sourceName: job.source.name,
		url: job.source.url ?? "",
		savedDate: toInputDate(job.savedDate),
		deadline: job.deadline ? toInputDate(job.deadline) : "",
		salary: normalizeSalary(job.salary),
		currency: job.currency ?? "",
		notes: job.description ?? "",
	};
}

export function buildJobFromFormValues(
	values: DashboardJobFormValues,
	existingJob?: DashboardJob,
): DashboardJob {
	const companySlug = values.company.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
	const titleSlug = values.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

	return {
		id: existingJob?.id ?? `${companySlug || "job"}-${titleSlug || Date.now()}`,
		title: values.title.trim(),
		company: values.company.trim(),
		status: values.status,
		location: values.location.trim(),
		workMode: values.workMode.trim(),
		jobType: values.jobType,
		source: {
			name: values.sourceName,
			url: values.url.trim() || null,
			faviconUrl: existingJob?.source.faviconUrl ?? null,
		},
		savedDate: formatDisplayDate(values.savedDate),
		appliedDate: existingJob?.appliedDate ?? "-",
		deadline: values.deadline ? formatDisplayDate(values.deadline) : "",
		reminder: existingJob?.reminder ?? "-",
		reminderDetails: existingJob?.reminderDetails ?? null,
		salary: values.salary.trim() || "Not specified",
		notes: values.notes.trim(),
		description:
			values.notes.trim() ||
			existingJob?.description ||
			`${values.company.trim()} opportunity for ${values.title.trim()}.`,
		descriptionHtml: existingJob?.descriptionHtml,
		logoUrl: existingJob?.logoUrl,
		brand: existingJob?.brand ?? "hubspot",
		experienceLevel: values.experienceLevel.trim(),
		currency: values.currency.trim() || undefined,
		tags: existingJob?.tags,
	};
}

function toInputDate(value: string) {
	const parsed = new Date(value);

	if (Number.isNaN(parsed.getTime())) {
		return format(new Date(), "yyyy-MM-dd");
	}

	return format(parsed, "yyyy-MM-dd");
}

function formatDisplayDate(value: string) {
	return format(new Date(`${value}T12:00:00`), "MMM d, yyyy");
}

function normalizeSalary(value?: string) {
	return value === "Not specified" ? "" : value ?? "";
}

function normalizeWorkModeOption(value: string) {
	const normalizedValue = value.trim().toLowerCase();

	if (normalizedValue === "on-site" || normalizedValue === "onsite") {
		return "On-site";
	}

	if (normalizedValue === "remote") {
		return "Remote";
	}

	if (normalizedValue === "hybrid") {
		return "Hybrid";
	}

	if (normalizedValue === "worldwide") {
		return "Worldwide";
	}

	return value.trim() || "Remote";
}
