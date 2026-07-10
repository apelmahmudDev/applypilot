import { CalendarDays, Save, X } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Switch } from "@/components/ui/switch";
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
	"Rejected",
	"Offer",
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

	const updateField = (
		field: keyof SidePanelJobForm,
		value: string | boolean,
	) => {
		setJob((currentJob) => ({ ...currentJob, [field]: value }));
	};

	return (
		<div className="flex min-h-0 flex-1 p-0">
			<section className="flex min-h-0 flex-1 flex-col rounded-none border-0 bg-card shadow-none">
				<header
					className={cn(
						"flex shrink-0 items-center justify-between border-b px-4 py-4",
						"border-[#E5E7EB]",
					)}
				>
					<h2 className={cn("text-xl font-bold", "text-foreground")}>
						{mode === "add" ? "Add New Job" : "Edit Job"}
					</h2>
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						className={cn(
							"text-muted-foreground hover:bg-muted/60 hover:text-foreground",
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
								placeholder="Dhaka, Bangladesh"
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
						<section className="rounded-[14px] border border-border bg-muted/20 p-3">
							<div className="flex items-start justify-between gap-3">
								<div>
									<h3 className="text-sm font-semibold text-foreground">
										Reminder
									</h3>
									<p className="mt-1 text-xs leading-5 text-muted-foreground">
										Set a follow-up reminder while saving or updating this job.
									</p>
								</div>
								<div className="flex items-center gap-2 pt-0.5">
									<Label
										htmlFor="reminder-enabled"
										className="text-xs font-semibold text-foreground"
									>
										Set follow-up reminder
									</Label>
									<Switch
										id="reminder-enabled"
										checked={job.reminderEnabled}
										onCheckedChange={(checked) => {
											updateField("reminderEnabled", checked);
											if (!checked) {
												updateField("reminderDone", false);
											}
										}}
									/>
								</div>
							</div>
							<div className="mt-3 space-y-3">
								<FieldRow label="Date" isDarkMode={isDarkMode}>
									<DateInput
										value={job.followUpDate}
										isDarkMode={isDarkMode}
										onChange={(value) => updateField("followUpDate", value)}
									/>
								</FieldRow>
								<FieldRow label="Time" hint="Optional" isDarkMode={isDarkMode}>
									<TextInput
										type="time"
										value={job.followUpTime}
										isDarkMode={isDarkMode}
										onChange={(value) => updateField("followUpTime", value)}
									/>
								</FieldRow>
								<FieldRow label="Note" hint="Optional" isDarkMode={isDarkMode}>
									<Textarea
										value={job.reminderNote}
										rows={3}
										className={cn(
											"min-h-20 resize-none rounded-md text-sm font-medium",
											"border-input bg-card text-foreground placeholder:text-muted-foreground",
										)}
										placeholder="Follow up with hiring manager"
										onChange={(event) =>
											updateField("reminderNote", event.target.value)
										}
									/>
								</FieldRow>
							</div>
						</section>
						<FieldRow label="Notes" hint="Optional" isDarkMode={isDarkMode}>
							<Textarea
								value={job.notes}
								rows={4}
								className={cn(
									"min-h-24 resize-none rounded-md text-sm font-medium",
									"border-input bg-card text-foreground placeholder:text-muted-foreground",
								)}
								placeholder="Great role for frontend development using modern technologies."
								onChange={(event) => updateField("notes", event.target.value)}
							/>
						</FieldRow>
					</div>

					<div
						className={cn(
							"grid shrink-0 grid-cols-2 gap-3 border-t px-4 py-4",
							"border-[#E5E7EB] bg-white",
						)}
					>
						<Button
							type="button"
							variant="outline"
							className={cn(
								"h-10 rounded-md text-sm font-bold",
								"border-input bg-card text-foreground hover:bg-muted/60",
							)}
							onClick={onCancel}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="h-10 rounded-md bg-primary text-sm font-bold text-primary-foreground hover:brightness-95"
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
					"text-muted-foreground",
				)}
			>
				{label}
				{hint && (
					<span
						className={cn(
							"block text-[10px] font-semibold",
							"text-muted-foreground/80",
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
				"border-input bg-card text-foreground placeholder:text-muted-foreground",
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
					"border-input bg-card text-foreground placeholder:text-muted-foreground",
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
						"border-input bg-card text-foreground placeholder:text-muted-foreground",
					)}
				>
					<span
						className={value ? "text-foreground" : "text-muted-foreground/80"}
					>
						{value ? formatDateLabel(value) : "Select date"}
					</span>
					<CalendarDays
						className="size-4 text-muted-foreground/80"
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
