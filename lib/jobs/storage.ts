import type { JobForm } from "@/modules/popup/types";

const JOBS_STORAGE_KEY = "applypilot.jobs";

export type StoredJob = JobForm & {
	id: string;
	createdAt: string;
	updatedAt: string;
};

export type SaveJobResult = {
	job: StoredJob;
	action: "created" | "updated";
};

export async function saveJobToStorage(job: JobForm): Promise<SaveJobResult> {
	const jobs = await getStoredJobs();
	const now = new Date().toISOString();
	const duplicateIndex = jobs.findIndex((storedJob) =>
		isDuplicateJob(storedJob, job),
	);

	if (duplicateIndex >= 0) {
		const existingJob = jobs[duplicateIndex];
		const updatedJob: StoredJob = {
			...existingJob,
			...normalizeJob(job),
			id: existingJob.id,
			createdAt: existingJob.createdAt,
			updatedAt: now,
		};

		const nextJobs = [...jobs];
		nextJobs[duplicateIndex] = updatedJob;
		await setStoredJobs(nextJobs);

		return {
			job: updatedJob,
			action: "updated",
		};
	}

	const storedJob: StoredJob = {
		...normalizeJob(job),
		id: createJobId(),
		createdAt: now,
		updatedAt: now,
	};

	await setStoredJobs([storedJob, ...jobs]);

	return {
		job: storedJob,
		action: "created",
	};
}

export async function getStoredJobs(): Promise<StoredJob[]> {
	const stored = await browser.storage.local.get(JOBS_STORAGE_KEY);
	const jobs = stored[JOBS_STORAGE_KEY];

	if (!Array.isArray(jobs)) {
		return [];
	}

	return jobs.filter(isStoredJob);
}

async function setStoredJobs(jobs: StoredJob[]) {
	await browser.storage.local.set({
		[JOBS_STORAGE_KEY]: jobs,
	});
}

function isDuplicateJob(storedJob: StoredJob, job: JobForm) {
	const storedUrl = normalizeUrl(storedJob.url);
	const jobUrl = normalizeUrl(job.url);

	if (storedUrl && jobUrl && storedUrl === jobUrl) {
		return true;
	}

	return (
		normalizeComparable(storedJob.company) === normalizeComparable(job.company) &&
		normalizeComparable(storedJob.title) === normalizeComparable(job.title)
	);
}

function normalizeJob(job: JobForm): JobForm {
	return {
		title: job.title.trim(),
		company: job.company.trim(),
		location: job.location.trim(),
		url: job.url.trim(),
		platform: job.platform.trim(),
		status: job.status,
		notes: job.notes.trim(),
	};
}

function normalizeUrl(url: string) {
	try {
		const parsedUrl = new URL(url);
		parsedUrl.hash = "";
		parsedUrl.searchParams.sort();
		return parsedUrl.toString().replace(/\/$/, "");
	} catch {
		return url.trim().replace(/\/$/, "");
	}
}

function normalizeComparable(value: string) {
	return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function createJobId() {
	if (globalThis.crypto?.randomUUID) {
		return globalThis.crypto.randomUUID();
	}

	return `job-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isStoredJob(value: unknown): value is StoredJob {
	if (!value || typeof value !== "object") {
		return false;
	}

	const job = value as Partial<StoredJob>;

	return (
		typeof job.id === "string" &&
		typeof job.title === "string" &&
		typeof job.company === "string" &&
		typeof job.location === "string" &&
		typeof job.url === "string" &&
		typeof job.platform === "string" &&
		typeof job.status === "string" &&
		typeof job.notes === "string" &&
		typeof job.createdAt === "string" &&
		typeof job.updatedAt === "string"
	);
}
