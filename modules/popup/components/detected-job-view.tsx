import { ExternalLink, Grid2X2, PanelRight } from "lucide-react";

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
	return (
		<section className="flex flex-1 flex-col px-5 py-5">
			<div className="mb-4 flex items-center justify-between">
				<p className="text-sm font-semibold text-slate-900">
					{isDetecting ? "Detecting job details..." : "Job detected on this page"}
				</p>
				<span className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
					{job.platform}
				</span>
			</div>

			{(error || confidence === "low") && (
				<div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
					{error || "We detected some information, but please review before saving."}
				</div>
			)}

			{saveError && (
				<div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
					{saveError}
				</div>
			)}

			<article className="rounded-lg border border-slate-200 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
				<h2 className="text-base font-bold leading-6 text-slate-950">
					{job.title || "Unknown job title"}
				</h2>
				<p className="mt-1 text-sm font-medium text-slate-800">
					{job.company || "Unknown company"}
				</p>
				<p className="mt-3 text-sm font-medium text-slate-800">
					{job.location || "Unknown location"}
				</p>
				<a
					href={job.url}
					target="_blank"
					rel="noreferrer"
					className="mt-4 flex items-center gap-1.5 truncate text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
				>
					<span className="truncate">{job.url}</span>
					<ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
				</a>
			</article>

			<div className="mt-5 grid grid-cols-2 gap-4">
				<Button
					type="button"
					variant="outline"
					className="h-10 rounded-md border-slate-200 text-sm font-bold text-slate-900 shadow-[0_2px_5px_rgba(15,23,42,0.04)] hover:bg-slate-50"
					onClick={onEdit}
				>
					Edit Before Saving
				</Button>
				<Button
					type="button"
					className="h-10 rounded-md bg-blue-600 text-sm font-bold text-white shadow-[0_8px_18px_rgba(37,99,235,0.28)] hover:bg-blue-700"
					disabled={isSaving || isDetecting}
					onClick={onSave}
				>
					{isSaving ? "Saving..." : "Save Job"}
				</Button>
			</div>

			<div className="mt-8 grid grid-cols-2 gap-4">
				<Button
					type="button"
					variant="outline"
					className="h-[94px] flex-col gap-3 rounded-lg border-slate-200 bg-white text-sm font-semibold text-slate-950 shadow-[0_8px_18px_rgba(15,23,42,0.05)] hover:bg-slate-50"
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
					className="h-[94px] flex-col gap-3 rounded-lg border-slate-200 bg-white text-sm font-semibold text-slate-950 shadow-[0_8px_18px_rgba(15,23,42,0.05)] hover:bg-slate-50"
					onClick={openSidePanel}
				>
					<span className="flex size-8 items-center justify-center rounded-md bg-slate-50 text-slate-700">
						<PanelRight className="size-5" aria-hidden="true" />
					</span>
					Open Side Panel
				</Button>
			</div>

			<p className="mt-auto pt-7 text-center text-xs font-medium text-slate-700">
				All data is stored locally in your browser.
			</p>
		</section>
	);
}
