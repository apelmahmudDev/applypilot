import { useForm } from "@tanstack/react-form";
import { ArrowLeft } from "lucide-react";

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
import { jobFormSchema } from "@/modules/popup/job-form.schema";
import { jobStatuses, type JobForm } from "@/modules/popup/types";

type EditJobViewProps = {
	job: JobForm;
	onCancel: () => void;
	onSave: (job: JobForm) => void;
};

const fieldClassName = "gap-1.5";
const fieldLabelClassName = "text-xs font-bold text-slate-700";
const inputClassName =
	"border-slate-200 bg-white text-sm font-medium text-slate-950";

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
					className="-ml-1 text-slate-700 hover:bg-slate-100"
					aria-label="Back to detected job"
					title="Back"
					onClick={onCancel}
				>
					<ArrowLeft className="size-4" aria-hidden="true" />
				</Button>
				<h2 className="text-base font-bold text-slate-950">
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
												className="min-h-16 resize-none text-sm font-medium text-slate-950"
											/>
											<InputGroupAddon align="block-end">
												<InputGroupText className="text-xs tabular-nums">
													{field.state.value.length}/500
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
