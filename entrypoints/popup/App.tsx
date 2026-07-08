import {
	ArrowLeft,
	CheckCircle2,
	ExternalLink,
	Grid2X2,
	PanelRight,
	Send,
	Settings,
	X,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const detectedJob = {
	title: "Frontend Developer",
	company: "Google",
	location: "Bengaluru, Karnataka, India",
	url: "https://www.linkedin.com/jobs/view/1234567890",
	platform: "LinkedIn",
	status: "Interested",
	notes: "",
};

type PopupView = "detected" | "edit" | "saved";
type JobForm = typeof detectedJob;

const inputClassName =
	"h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-950 outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100";

function App() {
	const [view, setView] = useState<PopupView>("detected");
	const [job, setJob] = useState<JobForm>(detectedJob);

	const updateJobField = (field: keyof JobForm, value: string) => {
		setJob((currentJob) => ({ ...currentJob, [field]: value }));
	};

	const saveJob = () => {
		setView("saved");
	};

	return (
		<main className="flex h-[600px] w-[380px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white text-slate-950 shadow-[0_18px_48px_rgba(15,23,42,0.16)]">
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

			{view === "detected" && (
				<DetectedJobView
					job={job}
					onEdit={() => setView("edit")}
					onSave={saveJob}
				/>
			)}
			{view === "edit" && (
				<EditJobView
					job={job}
					onCancel={() => setView("detected")}
					onChange={updateJobField}
					onSave={saveJob}
				/>
			)}
			{view === "saved" && <SavedJobView job={job} />}
		</main>
	);
}

function DetectedJobView({
	job,
	onEdit,
	onSave,
}: {
	job: JobForm;
	onEdit: () => void;
	onSave: () => void;
}) {
	return (
		<section className="flex flex-1 flex-col px-5 py-5">
				<div className="mb-4 flex items-center justify-between">
					<p className="text-sm font-semibold text-slate-900">
						Job detected on this page
					</p>
					<span className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
						{job.platform}
					</span>
				</div>

				<article className="rounded-lg border border-slate-200 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
					<h2 className="text-base font-bold leading-6 text-slate-950">
						{job.title}
					</h2>
					<p className="mt-1 text-sm font-medium text-slate-800">
						{job.company}
					</p>
					<p className="mt-3 text-sm font-medium text-slate-800">
						{job.location}
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
						onClick={onSave}
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
	);
}

function EditJobView({
	job,
	onCancel,
	onChange,
	onSave,
}: {
	job: JobForm;
	onCancel: () => void;
	onChange: (field: keyof JobForm, value: string) => void;
	onSave: () => void;
}) {
	return (
		<section className="flex min-h-0 flex-1 flex-col px-5 py-4">
			<div className="mb-3 flex items-center gap-2">
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					className="-ml-1 text-slate-700 hover:bg-slate-100"
					aria-label="Back to detected job"
					title="Back"
					onClick={onCancel}
				>
					<ArrowLeft className="size-4" aria-hidden="true" />
				</Button>
				<h2 className="text-base font-bold text-slate-950">Edit Before Saving</h2>
			</div>

			<form
				className="flex min-h-0 flex-1 flex-col"
				onSubmit={(event) => {
					event.preventDefault();
					onSave();
				}}
			>
				<div className="-mx-1 min-h-0 flex-1 space-y-2.5 overflow-y-auto px-1 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
					<Field label="Job Title">
						<input
							className={inputClassName}
							value={job.title}
							onChange={(event) => onChange("title", event.target.value)}
						/>
					</Field>
					<Field label="Company">
						<input
							className={inputClassName}
							value={job.company}
							onChange={(event) => onChange("company", event.target.value)}
						/>
					</Field>
					<Field label="Location">
						<input
							className={inputClassName}
							value={job.location}
							onChange={(event) => onChange("location", event.target.value)}
						/>
					</Field>
					<Field label="Job URL">
						<input
							className={inputClassName}
							type="url"
							value={job.url}
							onChange={(event) => onChange("url", event.target.value)}
						/>
					</Field>
					<div className="grid grid-cols-2 gap-3">
						<Field label="Platform">
							<input
								className={inputClassName}
								value={job.platform}
								onChange={(event) => onChange("platform", event.target.value)}
							/>
						</Field>
						<Field label="Status">
							<select
								className={inputClassName}
								value={job.status}
								onChange={(event) => onChange("status", event.target.value)}
							>
								<option>Interested</option>
								<option>Applied</option>
								<option>Interviewing</option>
								<option>Saved</option>
							</select>
						</Field>
					</div>
					<Field label="Notes">
						<textarea
							className="min-h-16 w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-950 outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
							value={job.notes}
							onChange={(event) => onChange("notes", event.target.value)}
						/>
					</Field>
				</div>

				<div className="grid shrink-0 grid-cols-2 gap-3 border-t border-slate-100 bg-white pt-4">
					<Button
						type="button"
						variant="outline"
						className="h-10 rounded-md border-slate-200 text-sm font-bold text-slate-900 hover:bg-slate-50"
						onClick={onCancel}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						className="h-10 rounded-md bg-blue-600 text-sm font-bold text-white shadow-[0_8px_18px_rgba(37,99,235,0.28)] hover:bg-blue-700"
					>
						Save Job
					</Button>
				</div>
			</form>
		</section>
	);
}

function Field({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<label className="block">
			<span className="mb-1 block text-xs font-bold text-slate-700">{label}</span>
			{children}
		</label>
	);
}

function SavedJobView({ job }: { job: JobForm }) {
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

export default App;
