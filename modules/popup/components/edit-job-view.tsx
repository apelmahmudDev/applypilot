import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { format } from "date-fns";
import {
	ArrowLeft,
	Bell,
	CalendarDays,
	ChevronDown,
	type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
	currencyOptions,
	experienceLevelOptions,
	workTypeOptions,
} from "@/modules/dashboard/components/job-form/job-form.utils";
import { reminderTypeOptions } from "@/modules/dashboard/components/reminders/reminder-form.types";
import { jobFormSchema } from "@/modules/popup/job-form.schema";
import { jobStatuses, type JobForm } from "@/modules/popup/types";
import { cn } from "@/lib/utils";

type EditJobViewProps = {
	job: JobForm;
	onCancel: () => void;
	onSave: (job: JobForm) => void;
};

const fieldClassName = "gap-1.5";
const fieldLabelClassName =
	"text-xs font-bold text-slate-700 dark:text-muted-foreground";
const inputClassName =
	"h-9 rounded-md border-slate-200 bg-white text-sm font-medium text-slate-900 shadow-none dark:border-[#454040] dark:bg-card dark:text-foreground";
const sourceOptions = [
	"LinkedIn",
	"Company Site",
	"Manual",
	"Indeed",
	"Other",
] as const;
const jobTypeOptions = [
	"Full-time",
	"Part-time",
	"Contract",
	"Internship",
] as const;
const timeOptions = Array.from({ length: 48 }, (_, index) => {
	const hours = Math.floor(index / 2)
		.toString()
		.padStart(2, "0");
	const minutes = index % 2 === 0 ? "00" : "30";

	return `${hours}:${minutes}`;
});

export function EditJobView({ job, onCancel, onSave }: EditJobViewProps) {
	const [savedDateOpen, setSavedDateOpen] = useState(false);
	const [deadlineOpen, setDeadlineOpen] = useState(false);
	const [followUpDateOpen, setFollowUpDateOpen] = useState(false);

	const form = useForm({
		defaultValues: {
			...job,
			platform: job.platform || "LinkedIn",
			workplaceType: job.workplaceType || "Remote",
			employmentType: job.employmentType || "Full-time",
			experienceLevel: job.experienceLevel || "Mid-level",
			currency: job.currency || "",
			savedDate: job.savedDate || format(new Date(), "yyyy-MM-dd"),
			reminderType: job.reminderType || "Follow up",
		},
		validators: {
			onSubmit: jobFormSchema,
		},
		onSubmit: ({ value }) => {
			onSave(value);
		},
	});

	return (
		<section className="flex min-h-0 flex-1 flex-col px-5 py-4 pt-0">
			<form
				className="flex min-h-0 flex-1 flex-col"
				onSubmit={(event) => {
					event.preventDefault();
					form.handleSubmit();
				}}
			>
				<div className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
					<FieldGroup className="gap-4">
						<div />
						<form.Field
							name="title"
							children={(field) => (
								<TextField
									label="Job Title"
									name={field.name}
									value={field.state.value}
									errors={field.state.meta.errors}
									isInvalid={
										field.state.meta.isTouched && !field.state.meta.isValid
									}
									onBlur={field.handleBlur}
									onChange={field.handleChange}
								/>
							)}
						/>
						<div className="grid grid-cols-2 gap-3">
							<form.Field
								name="company"
								children={(field) => (
									<TextField
										label="Company"
										name={field.name}
										value={field.state.value}
										errors={field.state.meta.errors}
										isInvalid={
											field.state.meta.isTouched && !field.state.meta.isValid
										}
										onBlur={field.handleBlur}
										onChange={field.handleChange}
									/>
								)}
							/>
							<form.Field
								name="status"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field className={fieldClassName} data-invalid={isInvalid}>
											<FieldLabel
												className={fieldLabelClassName}
												htmlFor={field.name}
											>
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
													className={`w-full ${inputClassName}`}
												>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{jobStatuses.map((status) => (
														<SelectItem key={status} value={status}>
															{status}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							/>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<form.Field
								name="platform"
								children={(field) => (
									<SelectField
										label="Source"
										value={field.state.value}
										options={sourceOptions}
										errors={field.state.meta.errors}
										isInvalid={
											field.state.meta.isTouched && !field.state.meta.isValid
										}
										onValueChange={field.handleChange}
									/>
								)}
							/>
							<form.Field
								name="location"
								children={(field) => (
									<TextField
										label="Location"
										name={field.name}
										value={field.state.value}
										errors={field.state.meta.errors}
										isInvalid={
											field.state.meta.isTouched && !field.state.meta.isValid
										}
										onBlur={field.handleBlur}
										onChange={field.handleChange}
									/>
								)}
							/>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<form.Field
								name="workplaceType"
								children={(field) => (
									<SelectField
										label="Work Type"
										value={field.state.value}
										options={workTypeOptions}
										errors={field.state.meta.errors}
										isInvalid={
											field.state.meta.isTouched && !field.state.meta.isValid
										}
										onValueChange={field.handleChange}
									/>
								)}
							/>
							<form.Field
								name="employmentType"
								children={(field) => (
									<SelectField
										label="Job Type"
										value={field.state.value}
										options={jobTypeOptions}
										errors={field.state.meta.errors}
										isInvalid={
											field.state.meta.isTouched && !field.state.meta.isValid
										}
										onValueChange={field.handleChange}
									/>
								)}
							/>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<form.Field
								name="experienceLevel"
								children={(field) => (
									<SelectField
										label="Experience Level"
										value={field.state.value ?? ""}
										options={experienceLevelOptions}
										errors={field.state.meta.errors}
										isInvalid={
											field.state.meta.isTouched && !field.state.meta.isValid
										}
										onValueChange={field.handleChange}
									/>
								)}
							/>
							<div />
						</div>
						<form.Field
							name="url"
							children={(field) => (
								<TextField
									label="Job URL"
									name={field.name}
									type="url"
									autoComplete="url"
									value={field.state.value}
									errors={field.state.meta.errors}
									isInvalid={
										field.state.meta.isTouched && !field.state.meta.isValid
									}
									onBlur={field.handleBlur}
									onChange={field.handleChange}
								/>
							)}
						/>
						<div className="grid grid-cols-2 gap-3">
							<form.Field
								name="savedDate"
								children={(field) => (
									<DateField
										label="Saved Date"
										value={field.state.value}
										errors={field.state.meta.errors}
										isInvalid={
											field.state.meta.isTouched && !field.state.meta.isValid
										}
										open={savedDateOpen}
										onOpenChange={setSavedDateOpen}
										onChange={field.handleChange}
									/>
								)}
							/>
							<form.Field
								name="deadline"
								children={(field) => (
									<DateField
										label="Deadline"
										value={field.state.value}
										errors={field.state.meta.errors}
										isInvalid={
											field.state.meta.isTouched && !field.state.meta.isValid
										}
										open={deadlineOpen}
										onOpenChange={setDeadlineOpen}
										onChange={field.handleChange}
									/>
								)}
							/>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<form.Field
								name="salary"
								children={(field) => (
									<TextField
										label="Salary"
										name={field.name}
										value={field.state.value}
										errors={field.state.meta.errors}
										isInvalid={
											field.state.meta.isTouched && !field.state.meta.isValid
										}
										onBlur={field.handleBlur}
										onChange={field.handleChange}
									/>
								)}
							/>
							<form.Field
								name="currency"
								children={(field) => (
									<SelectField
										label="Currency"
										value={field.state.value ?? ""}
										options={currencyOptions}
										errors={field.state.meta.errors}
										isInvalid={
											field.state.meta.isTouched && !field.state.meta.isValid
										}
										placeholder="Select currency"
										onValueChange={field.handleChange}
									/>
								)}
							/>
						</div>
						<form.Field
							name="reminderEnabled"
							children={(reminderEnabledField) => (
								<section className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 dark:border-[#454040] dark:bg-[#221f1f]">
									<div className="flex items-center justify-between gap-3">
										<h3 className="text-sm font-bold text-slate-950 dark:text-foreground">
											Reminder
										</h3>
										<Switch
											checked={reminderEnabledField.state.value}
											onCheckedChange={reminderEnabledField.handleChange}
											aria-label="Reminder active status"
										/>
									</div>
									{reminderEnabledField.state.value ? (
										<div className="mt-4 space-y-3">
											<div>
												<form.Field
													name="reminderType"
													children={(field) => (
														<SelectField
															label="Type"
															value={field.state.value}
															options={reminderTypeOptions}
															errors={field.state.meta.errors}
															isInvalid={
																field.state.meta.isTouched &&
																!field.state.meta.isValid
															}
															icon={Bell}
															onValueChange={field.handleChange}
														/>
													)}
												/>
											</div>
											<div className="grid grid-cols-2 gap-3">
												<form.Field
													name="followUpDate"
													children={(field) => (
														<DateField
															label="Date"
															value={field.state.value}
															errors={field.state.meta.errors}
															isInvalid={
																field.state.meta.isTouched &&
																!field.state.meta.isValid
															}
															open={followUpDateOpen}
															onOpenChange={setFollowUpDateOpen}
															onChange={field.handleChange}
														/>
													)}
												/>
												<form.Field
													name="followUpTime"
													children={(field) => (
														<TextField
															label="Time"
															name={field.name}
															type="time"
															value={field.state.value}
															errors={field.state.meta.errors}
															isInvalid={
																field.state.meta.isTouched &&
																!field.state.meta.isValid
															}
															onBlur={field.handleBlur}
															onChange={field.handleChange}
														/>
													)}
												/>
											</div>
											<form.Field
												name="reminderNote"
												children={(field) => {
													const isInvalid =
														field.state.meta.isTouched &&
														!field.state.meta.isValid;
													return (
														<Field
															className={fieldClassName}
															data-invalid={isInvalid}
														>
															<FieldLabel
																className={fieldLabelClassName}
																htmlFor={field.name}
															>
																Note
															</FieldLabel>
															<div className="relative">
																<Textarea
																	id={field.name}
																	name={field.name}
																	value={field.state.value}
																	onBlur={field.handleBlur}
																	onChange={(event) =>
																		field.handleChange(event.target.value)
																	}
																	aria-invalid={isInvalid}
																	rows={3}
																	maxLength={500}
																	placeholder="Follow up with hiring manager"
																	className="min-h-20 resize-none border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-950 shadow-none focus-visible:ring-0 dark:border-[#454040] dark:bg-card dark:text-slate-100"
																/>
																<div className="pointer-events-none absolute right-3 bottom-3 text-xs font-medium tabular-nums text-slate-400 dark:text-muted-foreground">
																	{field.state.value.length} / 500
																</div>
															</div>
															{isInvalid && (
																<FieldError errors={field.state.meta.errors} />
															)}
														</Field>
													);
												}}
											/>
										</div>
									) : null}
								</section>
							)}
						/>
						<form.Field
							name="notes"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field className={fieldClassName} data-invalid={isInvalid}>
										<FieldLabel
											className={fieldLabelClassName}
											htmlFor={field.name}
										>
											Notes
										</FieldLabel>
										<div className="relative">
											<Textarea
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(event) =>
													field.handleChange(event.target.value)
												}
												aria-invalid={isInvalid}
												rows={4}
												maxLength={500}
												className="min-h-24 resize-none border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-950 shadow-none focus-visible:ring-0 dark:border-[#454040] dark:bg-card dark:text-slate-100"
											/>
											<div className="pointer-events-none absolute right-3 bottom-3 text-xs font-medium tabular-nums text-slate-400 dark:text-muted-foreground">
												{field.state.value.length} characters
											</div>
										</div>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
					</FieldGroup>
				</div>

				<div className="grid shrink-0 grid-cols-2 gap-3 border-t border-slate-100 bg-white pt-4 dark:border-[#3a3333] dark:bg-[#221f1f]">
					<Button
						type="button"
						variant="outline"
						className="h-10 rounded-md border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-[#454040] dark:bg-[#2c2c2c] dark:text-foreground dark:hover:bg-[#323232]"
						onClick={onCancel}
					>
						Cancel
					</Button>
					<Button type="submit" className="h-10 rounded-md">
						Save Job
					</Button>
				</div>
			</form>
		</section>
	);
}

type DateFieldProps = {
	label: string;
	value: string;
	errors: Array<{ message?: string } | undefined>;
	isInvalid: boolean;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onChange: (value: string) => void;
};

function DateField({
	label,
	value,
	errors,
	isInvalid,
	open,
	onOpenChange,
	onChange,
}: DateFieldProps) {
	return (
		<Field className={fieldClassName} data-invalid={isInvalid}>
			<FieldLabel className={fieldLabelClassName}>{label}</FieldLabel>
			<Popover open={open} onOpenChange={onOpenChange}>
				<PopoverTrigger asChild>
					<Button
						type="button"
						variant="outline"
						aria-invalid={isInvalid}
						className={cn(
							`h-10 w-full justify-between ${inputClassName}`,
							isInvalid && "border-destructive",
						)}
					>
						<span className="flex items-center gap-2.5">
							<CalendarDays
								className="size-4 text-slate-400 dark:text-muted-foreground"
								aria-hidden="true"
							/>
							{value
								? format(new Date(`${value}T12:00:00`), "MMM d, yyyy")
								: "Select date"}
						</span>
						<ChevronDown
							className="size-4 text-slate-400 dark:text-muted-foreground"
							aria-hidden="true"
						/>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto rounded-2xl border-slate-200 p-2 dark:border-[#454040] dark:bg-popover">
					<Calendar
						mode="single"
						selected={value ? new Date(`${value}T12:00:00`) : undefined}
						onSelect={(date) => {
							if (!date) {
								onChange("");
								return;
							}

							onChange(format(date, "yyyy-MM-dd"));
							onOpenChange(false);
						}}
					/>
				</PopoverContent>
			</Popover>
			{isInvalid && <FieldError errors={errors} />}
		</Field>
	);
}

type TextFieldProps = {
	label: string;
	name: string;
	value: string;
	errors: Array<{ message?: string } | undefined>;
	isInvalid: boolean;
	type?: string;
	autoComplete?: string;
	onBlur: () => void;
	onChange: (value: string) => void;
};

function TextField({
	label,
	name,
	value,
	errors,
	isInvalid,
	type,
	autoComplete = "off",
	onBlur,
	onChange,
}: TextFieldProps) {
	return (
		<Field className={fieldClassName} data-invalid={isInvalid}>
			<FieldLabel className={fieldLabelClassName} htmlFor={name}>
				{label}
			</FieldLabel>
			<Input
				id={name}
				name={name}
				type={type}
				value={value}
				onBlur={onBlur}
				onChange={(event) => onChange(event.target.value)}
				aria-invalid={isInvalid}
				autoComplete={autoComplete}
				className={inputClassName}
			/>
			{isInvalid && <FieldError errors={errors} />}
		</Field>
	);
}

type SelectFieldProps = {
	label: string;
	value: string;
	options: readonly string[];
	errors: Array<{ message?: string } | undefined>;
	isInvalid: boolean;
	icon?: LucideIcon;
	placeholder?: string;
	onValueChange: (value: string) => void;
};

function SelectField({
	label,
	value,
	options,
	errors,
	isInvalid,
	icon: Icon,
	placeholder,
	onValueChange,
}: SelectFieldProps) {
	return (
		<Field className={fieldClassName} data-invalid={isInvalid}>
			<FieldLabel className={fieldLabelClassName}>{label}</FieldLabel>
			<Select value={value} onValueChange={onValueChange}>
				<SelectTrigger
					aria-invalid={isInvalid}
					className={cn(
						"relative w-full",
						inputClassName,
						Icon ? "pl-9" : undefined,
					)}
				>
					{Icon ? (
						<Icon
							className="pointer-events-none absolute left-3 size-4 text-slate-400 dark:text-muted-foreground"
							aria-hidden="true"
						/>
					) : null}
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option} value={option}>
							{option}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{isInvalid && <FieldError errors={errors} />}
		</Field>
	);
}
