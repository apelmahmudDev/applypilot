import { useMemo, useState, type ComponentType } from "react";
import { useForm } from "@tanstack/react-form";
import { format } from "date-fns";
import { Bell, CalendarDays, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
import { cn } from "@/lib/utils";

import { reminderFormSchema } from "./reminder-form.schema";
import {
	reminderTypeOptions,
	type ReminderFormValues,
} from "./reminder-form.types";
import { formatReminderDateField } from "./reminder-form.utils";

type ReminderFormDialogProps = {
	open: boolean;
	title?: string;
	description?: string;
	submitLabel?: string;
	initialValues: ReminderFormValues;
	onOpenChange: (open: boolean) => void;
	onSubmit: (values: ReminderFormValues) => void;
};

const fieldClassName = "gap-1.5";
const fieldLabelClassName = "text-sm font-semibold text-slate-700";
const inputTriggerClassName =
	"h-11! rounded-md border-slate-200 bg-white px-3 text-left text-sm font-medium text-slate-900 shadow-none";

export function ReminderFormDialog({
	open,
	title = "Create Reminder",
	description = "Schedule a follow-up and keep the reminder details in one place.",
	submitLabel = "Save Reminder",
	initialValues,
	onOpenChange,
	onSubmit,
}: ReminderFormDialogProps) {
	const [isDateOpen, setIsDateOpen] = useState(false);

	const form = useForm({
		defaultValues: initialValues,
		validators: {
			onSubmit: reminderFormSchema,
		},
		onSubmit: ({ value }) => {
			onSubmit(value);
			onOpenChange(false);
		},
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="max-w-[760px] border-border/80 bg-white p-0 shadow-[0_24px_60px_rgba(15,23,42,0.14)]"
				overlayClassName="bg-white/6 backdrop-blur-[0.8px]"
				showCloseButton={false}
			>
				<form
					onSubmit={(event) => {
						event.preventDefault();
						form.handleSubmit();
					}}
				>
					<div className="px-6 pt-6 pb-5">
						<DialogHeader className="gap-3 text-left">
							<DialogTitle className="text-lg font-bold tracking-[-0.04em]">
								{title}
							</DialogTitle>
							<DialogDescription className="text-sm text-slate-500 sr-only">
								{description}
							</DialogDescription>
						</DialogHeader>

						<FieldGroup className="mt-6 gap-5">
							<div className="grid gap-5 md:grid-cols-2">
								<form.Field
									name="type"
									children={(field) => (
										<SelectField
											label="Reminder Type"
											value={field.state.value}
											options={reminderTypeOptions}
											icon={Bell}
											errors={field.state.meta.errors}
											isInvalid={
												field.state.meta.isTouched && !field.state.meta.isValid
											}
											onValueChange={(value) =>
												field.handleChange(value as ReminderFormValues["type"])
											}
										/>
									)}
								/>
								<form.Field
									name="date"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;

										return (
											<Field
												className={fieldClassName}
												data-invalid={isInvalid}
											>
												<FieldLabel className={fieldLabelClassName}>
													Date <span className="text-red-500">*</span>
												</FieldLabel>
												<Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
													<PopoverTrigger asChild>
														<Button
															type="button"
															variant="outline"
															className={cn(
																inputTriggerClassName,
																"justify-between font-medium",
																isInvalid && "border-destructive",
															)}
														>
															<span className="flex items-center gap-3">
																<CalendarDays
																	className="size-4 text-slate-500"
																	aria-hidden="true"
																/>
																{formatReminderDateField(field.state.value)}
															</span>
															<ChevronDown
																className="size-4 text-slate-400"
																aria-hidden="true"
															/>
														</Button>
													</PopoverTrigger>
													<PopoverContent className="w-auto rounded-2xl border-slate-200 p-2">
														<Calendar
															mode="single"
															selected={
																field.state.value
																	? new Date(`${field.state.value}T12:00:00`)
																	: undefined
															}
															onSelect={(date) => {
																if (!date) {
																	return;
																}

																field.handleChange(format(date, "yyyy-MM-dd"));
																setIsDateOpen(false);
															}}
														/>
													</PopoverContent>
												</Popover>
												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</Field>
										);
									}}
								/>
								<form.Field
									name="time"
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;

										return (
											<Field
												className={fieldClassName}
												data-invalid={isInvalid}
											>
												<FieldLabel
													className={fieldLabelClassName}
													htmlFor={field.name}
												>
													Time <span className="text-red-500">*</span>
												</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													type="time"
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(event) =>
														field.handleChange(event.target.value)
													}
													aria-invalid={isInvalid}
													className="h-11 rounded-xl border-slate-200 bg-white text-sm font-medium text-slate-900 shadow-none"
												/>
												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</Field>
										);
									}}
								/>
								<form.Field
									name="isActive"
									children={(field) => (
										<Field className={fieldClassName}>
											<FieldLabel className={fieldLabelClassName}>
												Status
											</FieldLabel>
											<div className="flex h-11 items-center gap-3">
												<Switch
													checked={field.state.value}
													onCheckedChange={field.handleChange}
													aria-label="Reminder active status"
												/>
												<span className="text-sm font-semibold">
													{field.state.value ? "Active" : "Paused"}
												</span>
											</div>
										</Field>
									)}
								/>
							</div>

							<form.Field
								name="note"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;

									return (
										<Field className={fieldClassName} data-invalid={isInvalid}>
											<FieldLabel
												className={fieldLabelClassName}
												htmlFor={field.name}
											>
												Note
											</FieldLabel>
											<div className="rounded-md border border-slate-200 bg-white px-4 py-3">
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
													className="min-h-16 resize-none border-0 bg-transparent px-0 py-0 text-sm font-medium text-slate-900 shadow-none focus-visible:ring-0"
												/>
												<form.Subscribe
													selector={(state) => state.values.note.length}
													children={(noteLength) => (
														<div className="mt-2 text-right text-xs font-medium text-slate-400">
															{noteLength} / 500
														</div>
													)}
												/>
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

					<DialogFooter className="border-t border-slate-100 px-6 py-4 sm:justify-end">
						<Button
							type="button"
							variant="outline"
							className="h-11 rounded-xl border-slate-200 bg-white px-5 font-semibold text-slate-700 shadow-none"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="h-11 rounded-xl bg-slate-950 px-5 font-semibold text-white hover:bg-slate-800"
						>
							{submitLabel}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

type SelectFieldProps = {
	label: string;
	value: string;
	options: readonly string[];
	errors: Array<{ message?: string } | undefined>;
	isInvalid: boolean;
	icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
	valueLabel?: (value: string) => string;
	onValueChange: (value: string) => void;
};

function SelectField({
	label,
	value,
	options,
	errors,
	isInvalid,
	icon: Icon,
	valueLabel,
	onValueChange,
}: SelectFieldProps) {
	const selectedLabel = useMemo(
		() => (valueLabel ? valueLabel(value) : value),
		[value, valueLabel],
	);

	return (
		<Field className={fieldClassName} data-invalid={isInvalid}>
			<FieldLabel className={fieldLabelClassName}>
				{label} <span className="text-red-500">*</span>
			</FieldLabel>
			<Select value={value} onValueChange={onValueChange}>
				<SelectTrigger
					aria-invalid={isInvalid}
					className={cn(
						inputTriggerClassName,
						"[&>svg:last-child]:hidden",
						isInvalid && "border-destructive",
					)}
				>
					<div className="flex min-w-0 items-center justify-between gap-3">
						<div className="flex min-w-0 items-center gap-3">
							<Icon className="size-4 shrink-0 text-slate-500" aria-hidden />
							<SelectValue>{selectedLabel}</SelectValue>
						</div>
						<ChevronDown
							className="size-4 shrink-0 text-slate-400"
							aria-hidden
						/>
					</div>
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option} value={option}>
							{valueLabel ? valueLabel(option) : option}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{isInvalid && <FieldError errors={errors} />}
		</Field>
	);
}
