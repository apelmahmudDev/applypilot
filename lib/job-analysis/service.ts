const AI_API_BASE_URL = import.meta.env.WXT_AI_API_BASE_URL?.trim() ?? "";
const ANALYZE_JOB_URL_PATH = "/analyze-job-url";
const ANALYZE_JOB_URL_ENDPOINT = buildAnalyzeJobUrlEndpoint(AI_API_BASE_URL);

export type AnalyzedJobDetails = {
	title: string;
	company: string;
	location: string;
	url: string;
	salary: string;
	employmentType: string;
	workplaceType: string;
	descriptionText: string;
};

type AnalyzeJobUrlResponse = {
	success?: boolean;
	data?: {
		title?: string;
		company?: string;
		location?: string;
		workplaceType?: string;
		employmentType?: string;
		experienceLevel?: string;
		salary?: string;
		summary?: string;
		skills?: string[];
		responsibilities?: string[];
		requirements?: string[];
		benefits?: string[];
		jobTitle?: string;
		companyName?: string;
		experience?: string;
		email?: string;
		jobUrl?: string;
		fullDescription?: string;
	};
};

export function isJobAnalysisAvailable() {
	return Boolean(ANALYZE_JOB_URL_ENDPOINT);
}

export async function analyzeJobUrl(url: string): Promise<AnalyzedJobDetails> {
	if (!isJobAnalysisAvailable()) {
		throw new Error("AI analysis is not available.");
	}

	const targetUrl = url.trim();

	if (!targetUrl) {
		throw new Error("No job URL found for this page.");
	}

	const response = await fetch(ANALYZE_JOB_URL_ENDPOINT, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ url: targetUrl }),
	});

	if (!response.ok) {
		throw new Error("The job analysis request failed.");
	}

	const result = (await response.json()) as AnalyzeJobUrlResponse;

	if (!result.success || !result.data) {
		throw new Error("The analysis service did not return job details.");
	}

	const analyzed = result.data;

	return {
		title: toText(analyzed.title) || toText(analyzed.jobTitle),
		company: toText(analyzed.company) || toText(analyzed.companyName),
		location: toText(analyzed.location),
		url: toText(analyzed.jobUrl) || targetUrl,
		salary: toText(analyzed.salary),
		employmentType: toText(analyzed.employmentType),
		workplaceType: toText(analyzed.workplaceType),
		descriptionText: buildDescriptionText(analyzed),
	};
}

function buildDescriptionText(data: NonNullable<AnalyzeJobUrlResponse["data"]>) {
	const sections = [
		toText(data.summary),
		toListSection("Skills", data.skills),
		toListSection("Responsibilities", data.responsibilities),
		toListSection("Requirements", data.requirements),
		toListSection("Benefits", data.benefits),
		toDetailSection("Experience", toText(data.experienceLevel) || toText(data.experience)),
		toDetailSection("Contact Email", toText(data.email)),
		toText(data.fullDescription),
	].filter(Boolean);

	return sections.join("\n\n").trim();
}

function toListSection(title: string, values?: string[]) {
	if (!Array.isArray(values) || values.length === 0) {
		return "";
	}

	const items = values.map((value) => toText(value)).filter(Boolean);
	if (items.length === 0) {
		return "";
	}

	return `${title}:\n${items.map((item) => `- ${item}`).join("\n")}`;
}

function toDetailSection(label: string, value: string) {
	return value ? `${label}: ${value}` : "";
}

function toText(value: unknown) {
	return typeof value === "string" ? value.trim() : "";
}

function buildAnalyzeJobUrlEndpoint(baseUrl: string) {
	if (!baseUrl) {
		return "";
	}

	try {
		return new URL(ANALYZE_JOB_URL_PATH, ensureTrailingSlash(baseUrl)).toString();
	} catch {
		return "";
	}
}

function ensureTrailingSlash(value: string) {
	return value.endsWith("/") ? value : `${value}/`;
}
