import { CheckCircle2, Grid2X2, PanelRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { openSidePanel } from "@/lib/open-side-panel";
import type { JobForm } from "@/modules/popup/types";

type SavedJobViewProps = {
	job: JobForm;
};

export function SavedJobView({ job }: SavedJobViewProps) {
	return (
		<section className="flex flex-1 flex-col px-5 py-5">
			<div className="flex flex-1 flex-col items-center justify-center text-center">
				<div className="flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
					<CheckCircle2 className="size-7" aria-hidden="true" />
				</div>
				<h2 className="mt-4 text-lg font-bold text-slate-950">
					Saved successfully
				</h2>
				<p className="mt-2 max-w-[260px] text-sm font-medium leading-5 text-slate-700">
					{job.title} at {job.company} is ready for advanced editing.
				</p>

				<div className="mt-8 grid w-full grid-cols-2 gap-4">
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
					<Button
						type="button"
						variant="outline"
						className="h-[94px] flex-col gap-3 rounded-lg border-slate-200 bg-white text-sm font-semibold text-slate-950 shadow-[0_8px_18px_rgba(15,23,42,0.05)] hover:bg-slate-50"
					>
						<span className="flex size-8 items-center justify-center rounded-md bg-blue-50 text-blue-600">
							<Grid2X2 className="size-5" aria-hidden="true" />
						</span>
						Open Dashboard
					</Button>
				</div>
			</div>

			<p className="text-center text-xs font-medium text-slate-700">
				All data is stored locally in your browser.
			</p>
		</section>
	);
}
