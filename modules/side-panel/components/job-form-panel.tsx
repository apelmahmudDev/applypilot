import { CalendarDays, Save, X } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type {
	SidePanelJobForm,
	SidePanelJobStatus,
} from "@/modules/side-panel/types";

type JobFormMode = "add" | "edit";

type JobFormPanelProps = {
	mode: JobFormMode;
	initialJob: SidePanelJobForm;
	isDarkMode: boolean;
	onCancel: () => void;
	onSave: (job: SidePanelJobForm) => void;
};

const platforms = ["LinkedIn", "Google Careers", "Indeed", "Naukri", "Other"];
const statuses: SidePanelJobStatus[] = [
	"Saved",
	"Applied",
	"Interview",
	"Interested",
];

const inputBase =
	"h-9 rounded-md text-sm font-medium shadow-[0_1px_2px_rgba(15,23,42,0.04)]";

export function JobFormPanel({
	mode,
	initialJob,
	isDarkMode,
	onCancel,
	onSave,
}: JobFormPanelProps) {
	const [job, setJob] = useState(initialJob);
	const [tagInput, setTagInput] = useState("");

	const updateField = (field: keyof SidePanelJobForm, value: string) => {
		setJob((currentJob) => ({ ...currentJob, [field]: value }));
	};

	const addTag = () => {
		const tag = tagInput.trim();

		if (!tag || job.tags.includes(tag)) {
			setTagInput("");
			return;
		}

		setJob((currentJob) => ({
			...currentJob,
			tags: [...currentJob.tags, tag],
		}));
		setTagInput("");
	};

	const removeTag = (tag: string) => {
		setJob((currentJob) => ({
			...currentJob,
			tags: currentJob.tags.filter((currentTag) => currentTag !== tag),
		}));
	};

	return (
		<div className="flex min-h-0 flex-1 px-4 pb-4">
			<section
				className={cn(
					"flex min-h-0 flex-1 flex-col rounded-lg border shadow-[0_16px_40px_rgba(15,23,42,0.12)]",
					isDarkMode
						? "border-slate-700/70 bg-[#262628]"
						: "border-slate-200 bg-white",
				)}
			>
				<header
					className={cn(
						"flex shrink-0 items-center justify-between border-b px-4 py-4",
						isDarkMode ? "border-slate-800" : "border-slate-100",
					)}
				>
					<h2
						className={cn(
							"text-xl font-bold",
							isDarkMode ? "text-white" : "text-slate-950",
						)}
					>
						{mode === "add" ? "Add New Job" : "Edit Job"}
					</h2>
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						className={cn(
							isDarkMode
								? "text-slate-300 hover:bg-[#303032] hover:text-white"
								: "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
						)}
						aria-label="Close job form"
						title="Close"
						onClick={onCancel}
					>
						<X className="size-5" aria-hidden="true" />
					</Button>
				</header>

				<form
					className="flex min-h-0 flex-1 flex-col"
					onSubmit={(event) => {
						event.preventDefault();
						onSave(job);
					}}
				>
					<div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
						<FieldRow label="Job Title" isDarkMode={isDarkMode}>
							<TextInput
								value={job.title}
								isDarkMode={isDarkMode}
								placeholder="Frontend Developer"
								required
								onChange={(value) => updateField("title", value)}
							/>
						</FieldRow>
						<FieldRow label="Company" isDarkMode={isDarkMode}>
							<TextInput
								value={job.company}
								isDarkMode={isDarkMode}
								placeholder="Google"
								required
								onChange={(value) => updateField("company", value)}
							/>
						</FieldRow>
						<FieldRow label="Location" isDarkMode={isDarkMode}>
							<TextInput
								value={job.location}
								isDarkMode={isDarkMode}
								placeholder="Bengaluru, Karnataka, India"
								onChange={(value) => updateField("location", value)}
							/>
						</FieldRow>
						<FieldRow label="Job URL" isDarkMode={isDarkMode}>
							<TextInput
								type="url"
								value={job.url}
								isDarkMode={isDarkMode}
								placeholder="https://www.linkedin.com/jobs/view/1234567890"
								required
								onChange={(value) => updateField("url", value)}
							/>
						</FieldRow>
						<FieldRow label="Platform" isDarkMode={isDarkMode}>
							<SelectInput
								value={job.platform}
								options={platforms}
								isDarkMode={isDarkMode}
								onChange={(value) => updateField("platform", value)}
							/>
						</FieldRow>
						<FieldRow label="Salary" hint="Optional" isDarkMode={isDarkMode}>
							<TextInput
								value={job.salary}
								isDarkMode={isDarkMode}
								placeholder="INR 12 - 18 LPA"
								onChange={(value) => updateField("salary", value)}
							/>
						</FieldRow>
						<FieldRow label="Status" isDarkMode={isDarkMode}>
							<SelectInput
								value={job.status}
								options={statuses}
								isDarkMode={isDarkMode}
								onChange={(value) =>
									updateField("status", value as SidePanelJobStatus)
								}
							/>
						</FieldRow>
						<FieldRow label="Deadline" hint="Optional" isDarkMode={isDarkMode}>
							<DateInput
								value={job.deadline}
								isDarkMode={isDarkMode}
								onChange={(value) => updateField("deadline", value)}
							/>
						</FieldRow>
						<FieldRow
							label="Follow-up Date"
							hint="Optional"
							isDarkMode={isDarkMode}
						>
							<DateInput
								value={job.followUpDate}
								isDarkMode={isDarkMode}
								onChange={(value) => updateField("followUpDate", value)}
							/>
						</FieldRow>
						<FieldRow
							label="Recruiter Name"
							hint="Optional"
							isDarkMode={isDarkMode}
						>
							<TextInput
								value={job.recruiterName}
								isDarkMode={isDarkMode}
								placeholder="John Doe"
								onChange={(value) => updateField("recruiterName", value)}
							/>
						</FieldRow>
						<FieldRow
							label="Recruiter Email"
							hint="Optional"
							isDarkMode={isDarkMode}
						>
							<TextInput
								type="email"
								value={job.recruiterEmail}
								isDarkMode={isDarkMode}
								placeholder="john.doe@google.com"
								onChange={(value) => updateField("recruiterEmail", value)}
							/>
						</FieldRow>
						<FieldRow label="Tags" hint="Optional" isDarkMode={isDarkMode}>
							<div
								className={cn(
									"flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border px-2 py-1.5",
									isDarkMode
										? "border-slate-700 bg-[#262628]"
										: "border-slate-200 bg-white",
								)}
							>
								{job.tags.map((tag) => (
									<button
										key={tag}
										type="button"
										className={cn(
											"rounded-md px-2 py-1 text-xs font-semibold",
											isDarkMode
												? "bg-indigo-500/15 text-indigo-200"
												: "bg-blue-50 text-blue-700",
										)}
										onClick={() => removeTag(tag)}
									>
										{tag} x
									</button>
								))}
								<Input
									value={tagInput}
									placeholder={job.tags.length ? "" : "React, Next.js"}
									className={cn(
										"h-7 min-w-20 flex-1 border-0 bg-transparent px-1 py-0 text-sm font-medium shadow-none outline-none focus-visible:ring-0",
										isDarkMode
											? "text-slate-100 placeholder:text-slate-500"
											: "text-slate-950 placeholder:text-slate-400",
									)}
									onChange={(event) => setTagInput(event.target.value)}
									onBlur={addTag}
									onKeyDown={(event) => {
										if (event.key === "Enter" || event.key === ",") {
											event.preventDefault();
											addTag();
										}
									}}
								/>
							</div>
						</FieldRow>
						<FieldRow label="Notes" hint="Optional" isDarkMode={isDarkMode}>
							<Textarea
								value={job.notes}
								rows={4}
								className={cn(
									"min-h-24 resize-none rounded-md text-sm font-medium",
									isDarkMode
										? "border-slate-700 bg-[#262628] text-slate-100 placeholder:text-slate-500"
										: "border-slate-200 bg-white text-slate-950 placeholder:text-slate-400",
								)}
								placeholder="Great role for frontend development using modern technologies."
								onChange={(event) => updateField("notes", event.target.value)}
							/>
						</FieldRow>
					</div>

					<div
						className={cn(
							"grid shrink-0 grid-cols-2 gap-3 border-t px-4 py-4",
							isDarkMode
								? "border-slate-800 bg-[#202020]"
								: "border-slate-100 bg-white",
						)}
					>
						<Button
							type="button"
							variant="outline"
							className={cn(
								"h-10 rounded-md text-sm font-bold",
								isDarkMode
									? "border-slate-700 bg-[#262628] text-slate-100 hover:bg-[#303032]"
									: "border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
							)}
							onClick={onCancel}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="h-10 rounded-md bg-blue-600 text-sm font-bold text-white shadow-[0_10px_24px_rgba(37,99,235,0.28)] hover:bg-blue-500"
						>
							<Save className="size-4" aria-hidden="true" />
							{mode === "add" ? "Save Job" : "Update Job"}
						</Button>
					</div>
				</form>
			</section>
		</div>
	);
}

function FieldRow({
	label,
	hint,
	isDarkMode,
	children,
}: {
	label: string;
	hint?: string;
	isDarkMode: boolean;
	children: ReactNode;
}) {
	return (
		<Field
			orientation="horizontal"
			className="grid grid-cols-[76px_minmax(0,1fr)] items-start gap-3"
		>
			<FieldLabel
				className={cn(
					"block pt-2 text-xs font-bold leading-4",
					isDarkMode ? "text-slate-300" : "text-slate-700",
				)}
			>
				{label}
				{hint && (
					<span
						className={cn(
							"block text-[10px] font-semibold",
							isDarkMode ? "text-slate-500" : "text-slate-400",
						)}
					>
						({hint})
					</span>
				)}
			</FieldLabel>
			{children}
		</Field>
	);
}

function TextInput({
	value,
	isDarkMode,
	onChange,
	...props
}: Omit<React.ComponentProps<typeof Input>, "onChange"> & {
	isDarkMode: boolean;
	onChange: (value: string) => void;
}) {
	return (
		<Input
			value={value}
			className={cn(
				inputBase,
				isDarkMode
					? "border-slate-700 bg-[#262628] text-slate-100 placeholder:text-slate-500"
					: "border-slate-200 bg-white text-slate-950 placeholder:text-slate-400",
			)}
			onChange={(event) => onChange(event.target.value)}
			{...props}
		/>
	);
}

function SelectInput({
	value,
	options,
	isDarkMode,
	onChange,
}: {
	value: string;
	options: string[];
	isDarkMode: boolean;
	onChange: (value: string) => void;
}) {
	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger
				className={cn(
					inputBase,
					"w-full",
					isDarkMode
						? "border-slate-700 bg-[#262628] text-slate-100"
						: "border-slate-200 bg-white text-slate-950",
				)}
			>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{options.map((option) => (
					<SelectItem key={option} value={option}>
						{option}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

function DateInput({
	value,
	isDarkMode,
	onChange,
}: {
	value: string;
	isDarkMode: boolean;
	onChange: (value: string) => void;
}) {
	const selectedDate = value ? new Date(`${value}T00:00:00`) : undefined;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="outline"
					className={cn(
						inputBase,
						"w-full justify-between px-3 font-medium",
						isDarkMode
							? "border-slate-700 bg-[#262628] text-slate-100"
							: "border-slate-200 bg-white text-slate-950",
					)}
				>
					<span className={cn(!value && "text-slate-400")}>
						{value ? formatDateLabel(value) : "Select date"}
					</span>
					<CalendarDays
						className={cn(
							"size-4",
							isDarkMode ? "text-slate-500" : "text-slate-400",
						)}
						aria-hidden="true"
					/>
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-auto p-0">
				<Calendar
					mode="single"
					selected={selectedDate}
					onSelect={(date) => {
						if (!date) {
							onChange("");
							return;
						}

						onChange(toDateInputValue(date));
					}}
				/>
			</PopoverContent>
		</Popover>
	);
}

function toDateInputValue(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

function formatDateLabel(value: string) {
	const [year, month, day] = value.split("-");

	if (!year || !month || !day) {
		return value;
	}

	return `${day}/${month}/${year}`;
}
