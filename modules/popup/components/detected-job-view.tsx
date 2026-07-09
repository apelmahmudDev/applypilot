import {
	AlertCircle,
	ExternalLink,
	FilePlus2,
	Grid2X2,
	PanelRight,
	Radar,
	SearchX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { DetectionConfidence } from "@/lib/job-detection/types";
import { openDashboard } from "@/lib/open-dashboard";
import { openSidePanel } from "@/lib/open-side-panel";
import type { JobForm } from "@/modules/popup/types";

type DetectedJobViewProps = {
	job: JobForm;
	confidence: DetectionConfidence | null;
	error: string;
	isDetecting: boolean;
	isSaving: boolean;
	saveError: string;
	onEdit: () => void;
	onSave: () => void;
};

export function DetectedJobView({
	job,
	confidence,
	error,
	isDetecting,
	isSaving,
	saveError,
	onEdit,
	onSave,
}: DetectedJobViewProps) {
	const hasDetectedJob = Boolean(job.title || job.company || job.location || job.url);

	return (
		<section className="flex flex-1 flex-col px-5 py-5">
			<div className="mb-4 flex items-center justify-between">
				<p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
					{isDetecting
						? "Detecting job details..."
						: hasDetectedJob
							? "Job detected on this page"
							: "No job detected"}
				</p>
				{hasDetectedJob && (
					<span className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
						{job.platform || "Other"}
					</span>
				)}
			</div>

			{hasDetectedJob && confidence === "low" && (
				<div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
					We detected some information, but please review before saving.
				</div>
			)}

			{hasDetectedJob && saveError && (
				<div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
					{saveError}
				</div>
			)}

			{isDetecting ? (
				<DetectionStateCard
					icon={Radar}
					title="Scanning the active tab"
					description="Applypilot is checking visible headings, page metadata, and common job-page fields."
					tone="neutral"
					isLoading
				/>
			) : hasDetectedJob ? (
				<article className="rounded-lg border border-slate-200 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-[#262628] dark:shadow-none">
					<h2 className="text-base font-bold leading-6 text-slate-950 dark:text-white">
						{job.title || "Untitled role"}
					</h2>
					<p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-300">
						{job.company || "Unknown company"}
					</p>
					<p className="mt-3 text-sm font-medium text-slate-800 dark:text-slate-300">
						{job.location || "Location not found"}
					</p>
					{job.url && (
						<a
							href={job.url}
							target="_blank"
							rel="noreferrer"
							className="mt-4 flex items-center gap-1.5 truncate text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
						>
							<span className="truncate">{formatDisplayUrl(job.url)}</span>
							<ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
						</a>
					)}
				</article>
			) : error ? (
				<DetectionStateCard
					icon={AlertCircle}
					title="Detection is unavailable"
					description={error}
					tone="error"
				/>
			) : (
				<DetectionStateCard
					icon={SearchX}
					title="No job details found"
					description="Open a job posting page, or add the application manually if this site blocks automatic detection."
					tone="empty"
				/>
			)}

			<div className="mt-5 grid grid-cols-2 gap-4">
				<Button
					type="button"
					variant="outline"
					className="h-10 rounded-md border-slate-200 text-sm font-bold text-slate-900 shadow-[0_2px_5px_rgba(15,23,42,0.04)] hover:bg-slate-50 dark:border-slate-700 dark:bg-[#262628] dark:text-slate-100 dark:hover:bg-[#303032]"
					onClick={onEdit}
				>
					<FilePlus2 className="size-4" aria-hidden="true" />
					{hasDetectedJob ? "Edit Before Saving" : "Add Manually"}
				</Button>
				<Button
					type="button"
					className="h-10 rounded-md bg-blue-600 text-sm font-bold text-white shadow-[0_8px_18px_rgba(37,99,235,0.28)] hover:bg-blue-700"
					disabled={isSaving || isDetecting || !hasDetectedJob}
					onClick={onSave}
				>
					{isSaving ? "Saving..." : "Save Job"}
				</Button>
			</div>

			<div className="mt-8 grid grid-cols-2 gap-4">
				<Button
					type="button"
					variant="outline"
					className="h-[94px] flex-col gap-3 rounded-lg border-slate-200 bg-white text-sm font-semibold text-slate-950 shadow-[0_8px_18px_rgba(15,23,42,0.05)] hover:bg-slate-50 dark:border-slate-800 dark:bg-[#262628] dark:text-slate-100 dark:shadow-none dark:hover:bg-[#303032]"
					onClick={openDashboard}
				>
					<span className="flex size-8 items-center justify-center rounded-md bg-blue-50 text-blue-600">
						<Grid2X2 className="size-5" aria-hidden="true" />
					</span>
					Open Dashboard
				</Button>
				<Button
					type="button"
					variant="outline"
					className="h-[94px] flex-col gap-3 rounded-lg border-slate-200 bg-white text-sm font-semibold text-slate-950 shadow-[0_8px_18px_rgba(15,23,42,0.05)] hover:bg-slate-50 dark:border-slate-800 dark:bg-[#262628] dark:text-slate-100 dark:shadow-none dark:hover:bg-[#303032]"
					onClick={openSidePanel}
				>
					<span className="flex size-8 items-center justify-center rounded-md bg-slate-50 text-slate-700 dark:bg-[#202020] dark:text-slate-200">
						<PanelRight className="size-5" aria-hidden="true" />
					</span>
					Open Side Panel
				</Button>
			</div>

			<p className="mt-auto pt-7 text-center text-xs font-medium text-slate-700 dark:text-slate-400">
				All data is stored locally in your browser.
			</p>
		</section>
	);
}

type DetectionStateCardProps = {
	icon: typeof Radar;
	title: string;
	description: string;
	tone: "neutral" | "empty" | "error";
	isLoading?: boolean;
};

function DetectionStateCard({
	icon: Icon,
	title,
	description,
	tone,
	isLoading = false,
}: DetectionStateCardProps) {
	const toneStyles = {
		neutral:
			"border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200",
		empty:
			"border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-[#262628] dark:text-slate-200",
		error:
			"border-red-100 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200",
	};

	return (
		<div
			className={`rounded-lg border p-4 shadow-[0_8px_22px_rgba(15,23,42,0.06)] dark:shadow-none ${toneStyles[tone]}`}
		>
			<div className="flex items-start gap-3">
				<div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-white text-blue-600 shadow-sm dark:bg-[#202020] dark:text-blue-300">
					<Icon
						className={`size-5 ${isLoading ? "animate-spin" : ""}`}
						aria-hidden="true"
					/>
				</div>
				<div className="min-w-0">
					<h2 className="text-sm font-bold leading-5">{title}</h2>
					<p className="mt-1 text-xs font-medium leading-5 opacity-85">
						{description}
					</p>
				</div>
			</div>
		</div>
	);
}

function formatDisplayUrl(url: string) {
	try {
		const parsedUrl = new URL(url);
		return `${parsedUrl.hostname.replace(/^www\./, "")}${parsedUrl.pathname}`;
	} catch {
		return url;
	}
}
