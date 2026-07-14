import { useForm } from "@tanstack/react-form";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { jobFormSchema } from "@/modules/popup/job-form.schema";
import { jobStatuses, type JobForm } from "@/modules/popup/types";

type EditJobViewProps = {
	job: JobForm;
	onCancel: () => void;
	onSave: (job: JobForm) => void;
};

const fieldClassName = "gap-1.5";
const fieldLabelClassName = "text-xs font-bold text-slate-700 dark:text-muted-foreground";
const inputClassName =
	"border-slate-200 bg-white text-sm font-medium text-slate-950 dark:border-[#454040] dark:bg-[#2c2c2c] dark:text-foreground";

export function EditJobView({ job, onCancel, onSave }: EditJobViewProps) {
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
					className="-ml-1 text-slate-700 hover:bg-slate-100 dark:text-muted-foreground dark:hover:bg-[#323232]"
					aria-label="Back to detected job"
					title="Back"
					onClick={onCancel}
				>
					<ArrowLeft className="size-4" aria-hidden="true" />
				</Button>
				<h2 className="text-base font-bold text-slate-950 dark:text-foreground">
					Edit Before Saving
				</h2>
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
								name="platform"
								children={(field) => (
									<TextField
										label="Platform"
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
						<section className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 dark:border-[#454040] dark:bg-[#221f1f]">
							<div className="mb-3 flex items-start justify-between gap-3">
								<div>
									<h3 className="text-sm font-bold text-slate-950 dark:text-foreground">
										Reminder
									</h3>
									<p className="mt-1 text-xs font-medium leading-5 text-slate-700 dark:text-muted-foreground">
										Set a follow-up reminder while saving this job.
									</p>
								</div>
								<form.Field
									name="reminderEnabled"
									children={(field) => (
										<label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-muted-foreground">
											<Checkbox
												checked={field.state.value}
												onCheckedChange={(checked) =>
													field.handleChange(Boolean(checked))
												}
											/>
											Set follow-up reminder
										</label>
									)}
								/>
							</div>
							<div className="space-y-3">
								<form.Field
									name="followUpDate"
									children={(field) => (
										<TextField
											label="Follow-up Date"
											name={field.name}
											type="date"
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
									name="followUpTime"
									children={(field) => (
										<TextField
											label="Follow-up Time"
											name={field.name}
											type="time"
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
									name="reminderNote"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field className={fieldClassName} data-invalid={isInvalid}>
												<FieldLabel
													className={fieldLabelClassName}
													htmlFor={field.name}
												>
													Reminder Note
												</FieldLabel>
												<InputGroup>
													<InputGroupTextarea
														id={field.name}
														name={field.name}
														value={field.state.value}
														onBlur={field.handleBlur}
														onChange={(event) =>
															field.handleChange(event.target.value)
														}
														aria-invalid={isInvalid}
														rows={3}
														placeholder="Follow up with hiring manager"
														className="min-h-16 resize-none text-sm font-medium text-slate-950 dark:text-slate-100"
													/>
												</InputGroup>
												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</Field>
										);
									}}
								/>
							</div>
						</section>
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
										<InputGroup>
											<InputGroupTextarea
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(event) =>
													field.handleChange(event.target.value)
												}
												aria-invalid={isInvalid}
												rows={3}
												className="min-h-16 resize-none text-sm font-medium text-slate-950 dark:text-slate-100"
											/>
											<InputGroupAddon align="block-end">
												<InputGroupText className="text-xs tabular-nums">
													{field.state.value.length} characters
												</InputGroupText>
											</InputGroupAddon>
										</InputGroup>
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
						className="h-10 rounded-md border-slate-200 bg-white text-sm font-bold text-slate-900 hover:bg-slate-50 dark:border-[#454040] dark:bg-[#2c2c2c] dark:text-foreground dark:hover:bg-[#323232]"
						onClick={onCancel}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						className="h-10 rounded-md bg-primary text-sm font-bold text-primary-foreground shadow-[0_8px_18px_rgba(37,99,235,0.28)] hover:bg-primary/90"
					>
						Save Job
					</Button>
				</div>
			</form>
		</section>
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
