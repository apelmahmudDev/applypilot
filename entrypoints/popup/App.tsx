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
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

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

const jobFormSchema = z.object({
	title: z.string().trim().min(1, "Job title is required."),
	company: z.string().trim().min(1, "Company is required."),
	location: z.string().trim().min(1, "Location is required."),
	url: z.string().trim().url("Enter a valid job URL."),
	platform: z.string().trim().min(1, "Platform is required."),
	status: z.enum(["Interested", "Applied", "Interviewing", "Saved"]),
	notes: z.string().max(500, "Notes must be 500 characters or less."),
});

function App() {
	const [view, setView] = useState<PopupView>("detected");
	const [job, setJob] = useState<JobForm>(detectedJob);

	const saveJob = (savedJob: JobForm = job) => {
		setJob(savedJob);
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
	onSave,
}: {
	job: JobForm;
	onCancel: () => void;
	onSave: (job: JobForm) => void;
}) {
	const form = useForm({
		defaultValues: job,
		validators: {
			onSubmit: jobFormSchema,
		},
		onSubmit: ({ value }) => {
			onSave(value);
		},
	});

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
					form.handleSubmit();
				}}
			>
				<div className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
					<FieldGroup className="gap-3">
						<form.Field
							name="title"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field className="gap-1.5" data-invalid={isInvalid}>
										<FieldLabel className="text-xs font-bold text-slate-700" htmlFor={field.name}>
											Job Title
										</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(event) => field.handleChange(event.target.value)}
											aria-invalid={isInvalid}
											autoComplete="off"
											className="border-slate-200 bg-white text-sm font-medium text-slate-950"
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						/>
						<form.Field
							name="company"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field className="gap-1.5" data-invalid={isInvalid}>
										<FieldLabel className="text-xs font-bold text-slate-700" htmlFor={field.name}>
											Company
										</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(event) => field.handleChange(event.target.value)}
											aria-invalid={isInvalid}
											autoComplete="off"
											className="border-slate-200 bg-white text-sm font-medium text-slate-950"
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						/>
						<form.Field
							name="location"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field className="gap-1.5" data-invalid={isInvalid}>
										<FieldLabel className="text-xs font-bold text-slate-700" htmlFor={field.name}>
											Location
										</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(event) => field.handleChange(event.target.value)}
											aria-invalid={isInvalid}
											autoComplete="off"
											className="border-slate-200 bg-white text-sm font-medium text-slate-950"
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						/>
						<form.Field
							name="url"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field className="gap-1.5" data-invalid={isInvalid}>
										<FieldLabel className="text-xs font-bold text-slate-700" htmlFor={field.name}>
											Job URL
										</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											type="url"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(event) => field.handleChange(event.target.value)}
											aria-invalid={isInvalid}
											autoComplete="url"
											className="border-slate-200 bg-white text-sm font-medium text-slate-950"
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						/>
						<div className="grid grid-cols-2 gap-3">
							<form.Field
								name="platform"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field className="gap-1.5" data-invalid={isInvalid}>
											<FieldLabel className="text-xs font-bold text-slate-700" htmlFor={field.name}>
												Platform
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(event) => field.handleChange(event.target.value)}
												aria-invalid={isInvalid}
												autoComplete="off"
												className="border-slate-200 bg-white text-sm font-medium text-slate-950"
											/>
											{isInvalid && <FieldError errors={field.state.meta.errors} />}
										</Field>
									);
								}}
							/>
							<form.Field
								name="status"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field className="gap-1.5" data-invalid={isInvalid}>
											<FieldLabel className="text-xs font-bold text-slate-700" htmlFor={field.name}>
												Status
											</FieldLabel>
											<Select
												value={field.state.value}
												onValueChange={(value) => {
													field.handleChange(value as JobForm["status"]);
												}}
											>
												<SelectTrigger
													id={field.name}
													aria-invalid={isInvalid}
													className="w-full border-slate-200 bg-white text-sm font-medium text-slate-950"
												>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="Interested">Interested</SelectItem>
													<SelectItem value="Applied">Applied</SelectItem>
													<SelectItem value="Interviewing">Interviewing</SelectItem>
													<SelectItem value="Saved">Saved</SelectItem>
												</SelectContent>
											</Select>
											{isInvalid && <FieldError errors={field.state.meta.errors} />}
										</Field>
									);
								}}
							/>
						</div>
						<form.Field
							name="notes"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field className="gap-1.5" data-invalid={isInvalid}>
										<FieldLabel className="text-xs font-bold text-slate-700" htmlFor={field.name}>
											Notes
										</FieldLabel>
										<InputGroup>
											<InputGroupTextarea
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(event) => field.handleChange(event.target.value)}
												aria-invalid={isInvalid}
												rows={3}
												className="min-h-16 resize-none text-sm font-medium text-slate-950"
											/>
											<InputGroupAddon align="block-end">
												<InputGroupText className="text-xs tabular-nums">
													{field.state.value.length}/500
												</InputGroupText>
											</InputGroupAddon>
										</InputGroup>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						/>
					</FieldGroup>
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
