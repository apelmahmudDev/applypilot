import {
	ExternalLink,
	Grid2X2,
	PanelRight,
	Send,
	Settings,
	X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const detectedJob = {
	title: "Frontend Developer",
	company: "Google",
	location: "Bengaluru, Karnataka, India",
	url: "https://www.linkedin.com/jobs/view/1234567890",
	source: "LinkedIn",
};

function App() {
	return (
		<main className="flex h-[548px] w-[380px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white text-slate-950 shadow-[0_18px_48px_rgba(15,23,42,0.16)]">
			<header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-5">
				<div className="flex items-center gap-3">
					<div className="flex size-8 items-center justify-center rounded-md bg-blue-50 text-blue-600">
						<Send className="size-5 fill-blue-500 stroke-blue-600" aria-hidden="true" />
					</div>
					<h1 className="text-lg font-bold tracking-normal">ApplyPilot</h1>
				</div>
				<div className="flex items-center gap-1">
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						className="text-slate-600 hover:bg-slate-100"
						aria-label="Open settings"
						title="Settings"
					>
						<Settings className="size-4" aria-hidden="true" />
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						className="text-slate-600 hover:bg-slate-100"
						aria-label="Close popup"
						title="Close"
					>
						<X className="size-4" aria-hidden="true" />
					</Button>
				</div>
			</header>

			<section className="flex flex-1 flex-col px-5 py-5">
				<div className="mb-4 flex items-center justify-between">
					<p className="text-sm font-semibold text-slate-900">
						Job detected on this page
					</p>
					<span className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
						{detectedJob.source}
					</span>
				</div>

				<article className="rounded-lg border border-slate-200 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
					<h2 className="text-base font-bold leading-6 text-slate-950">
						{detectedJob.title}
					</h2>
					<p className="mt-1 text-sm font-medium text-slate-800">
						{detectedJob.company}
					</p>
					<p className="mt-3 text-sm font-medium text-slate-800">
						{detectedJob.location}
					</p>
					<a
						href={detectedJob.url}
						target="_blank"
						rel="noreferrer"
						className="mt-4 flex items-center gap-1.5 truncate text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
					>
						<span className="truncate">{detectedJob.url}</span>
						<ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
					</a>
				</article>

				<div className="mt-5 grid grid-cols-2 gap-4">
					<Button
						type="button"
						variant="outline"
						className="h-10 rounded-md border-slate-200 text-sm font-bold text-slate-900 shadow-[0_2px_5px_rgba(15,23,42,0.04)] hover:bg-slate-50"
					>
						Edit Before Saving
					</Button>
					<Button
						type="button"
						className="h-10 rounded-md bg-blue-600 text-sm font-bold text-white shadow-[0_8px_18px_rgba(37,99,235,0.28)] hover:bg-blue-700"
					>
						Save Job
					</Button>
				</div>

				<div className="mt-8 grid grid-cols-2 gap-4">
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
					<Button
						type="button"
						variant="outline"
						className="h-[94px] flex-col gap-3 rounded-lg border-slate-200 bg-white text-sm font-semibold text-slate-950 shadow-[0_8px_18px_rgba(15,23,42,0.05)] hover:bg-slate-50"
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
		</main>
	);
}

export default App;
