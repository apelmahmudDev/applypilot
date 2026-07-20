import { getAppVersion } from "@/lib/app-version";
import {
	DASHBOARD_SETTINGS_STORAGE_KEY,
	type DashboardSettings,
} from "@/lib/settings/storage";
import { THEME_STORAGE_KEY, type ThemePreference } from "@/lib/theme/storage";

import {
	getStoredJobs,
	type StoredJob,
} from "../jobs/storage";

export type ExportFormat = "json" | "csv";
export type ExportRange = "all-time" | "last-30-days" | "this-year";

const JOBS_STORAGE_KEY = "applypilot.jobs";
const BACKUP_SCHEMA_VERSION = 1;

type ApplyPilotBackup = {
	app: "Applypilot";
	schemaVersion: number;
	exportedAt: string;
	extensionVersion: string;
	data: {
		jobs: StoredJob[];
		settings: {
			dashboard: DashboardSettings | null;
			theme: ThemePreference | null;
		};
		storage: Record<string, unknown>;
	};
};

export async function exportApplyPilotData(
	format: ExportFormat,
	range: ExportRange,
) {
	const jobs = filterJobsByRange(await getStoredJobs(), range);

	if (format === "csv") {
		const csv = createJobsCsv(jobs);
		downloadFile(
			new Blob([csv], { type: "text/csv;charset=utf-8" }),
			createFilename("csv"),
		);
		return;
	}

	const snapshot = await browser.storage.local.get(null);
	const backup: ApplyPilotBackup = {
		app: "Applypilot",
		schemaVersion: BACKUP_SCHEMA_VERSION,
		exportedAt: new Date().toISOString(),
		extensionVersion: getAppVersion(),
		data: {
			jobs,
			settings: {
				dashboard: isRecord(snapshot[DASHBOARD_SETTINGS_STORAGE_KEY])
					? (snapshot[DASHBOARD_SETTINGS_STORAGE_KEY] as DashboardSettings)
					: null,
				theme: normalizeThemePreference(snapshot[THEME_STORAGE_KEY]),
			},
			storage: {
				...snapshot,
				[JOBS_STORAGE_KEY]: jobs,
			},
		},
	};

	downloadFile(
		new Blob([JSON.stringify(backup, null, 2)], {
			type: "application/json",
		}),
		createFilename("json"),
	);
}

export function getExportRangeDescription(range: ExportRange) {
	if (range === "last-30-days") {
		return "Export jobs created or updated in the last 30 days.";
	}

	if (range === "this-year") {
		return `Export jobs created or updated since January 1, ${new Date().getFullYear()}.`;
	}

	return "Export all data from the beginning.";
}

function filterJobsByRange(jobs: StoredJob[], range: ExportRange) {
	if (range === "all-time") {
		return jobs;
	}

	const now = Date.now();
	const cutoff =
		range === "last-30-days"
			? now - 30 * 24 * 60 * 60 * 1000
			: new Date(new Date().getFullYear(), 0, 1).getTime();

	return jobs.filter((job) => {
		const createdAt = Date.parse(job.createdAt);
		const updatedAt = Date.parse(job.updatedAt);
		return createdAt >= cutoff || updatedAt >= cutoff;
	});
}

function createJobsCsv(jobs: StoredJob[]) {
	const headers = [
		"id",
		"title",
		"company",
		"location",
		"url",
		"platform",
		"status",
		"savedDate",
		"deadline",
		"salary",
		"currency",
		"employmentType",
		"workplaceType",
		"experienceLevel",
		"followUpDate",
		"followUpTime",
		"reminderType",
		"reminderEnabled",
		"reminderDone",
		"notes",
		"createdAt",
		"updatedAt",
	];

	const rows = jobs.map((job) =>
		headers.map((header) => escapeCsvValue(String(job[header as keyof StoredJob] ?? ""))),
	);

	return [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");
}

function escapeCsvValue(value: string) {
	const normalized = value.replace(/\r?\n/g, "\n");
	return /[",\n]/.test(normalized)
		? `"${normalized.replace(/"/g, '""')}"`
		: normalized;
}

function createFilename(extension: "json" | "csv") {
	const date = new Date().toISOString().slice(0, 10);
	return `applypilot-backup-${date}.${extension}`;
}

function downloadFile(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.append(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(url);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return Boolean(value) && typeof value === "object";
}

function normalizeThemePreference(value: unknown): ThemePreference | null {
	return value === "light" || value === "dark" ? value : null;
}
