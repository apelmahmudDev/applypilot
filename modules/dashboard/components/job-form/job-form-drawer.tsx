import { useEffect, useMemo, useState } from "react";
import { useForm } from "@tanstack/react-form";
import {
	Bell,
	BriefcaseBusiness,
	Link2,
	MapPin,
	Tag,
	X,
} from "lucide-react";

import {
	fieldLabelClassName,
	JobFormDateField as DateField,
	JobFormSelectField as SelectField,
	JobFormTextField as TextField,
} from "@/components/job-form-fields";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ReminderFormDialog } from "@/modules/dashboard/components/reminders/reminder-form-dialog";
import {
	defaultReminderFormValues,
	formatReminderSummary,
	getReminderFormValues,
} from "@/modules/dashboard/components/reminders/reminder-form.utils";
import type { ReminderFormValues } from "@/modules/dashboard/components/reminders/reminder-form.types";
import type { DashboardJob } from "@/modules/dashboard/types";
import type { DashboardDefaultStatus } from "@/lib/settings/storage";

import { dashboardJobFormSchema } from "./job-form.schema";
import {
	buildJobFromFormValues,
	createEmptyJobFormValues,
	createJobFormValues,
	currencyOptions,
	experienceLevelOptions,
	jobStatusLabels,
	jobStatusOptions,
	type DashboardJobFormValues,
	workTypeOptions,
} from "./job-form.utils";

type JobFormDrawerProps = {
	job?: DashboardJob | null;
	mode: "create" | "edit";
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (job: DashboardJob) => void;
	defaultStatus?: DashboardDefaultStatus;
};

export function JobFormDrawer({
	job,
	mode,
	open,
	onOpenChange,
	onSubmit,
	defaultStatus = "saved",
}: JobFormDrawerProps) {
	const [savedDateOpen, setSavedDateOpen] = useState(false);
	const [deadlineOpen, setDeadlineOpen] = useState(false);
	const [isReminderOpen, setIsReminderOpen] = useState(false);
	const [reminderValues, setReminderValues] = useState<ReminderFormValues>(
		getReminderFormValues(job?.reminderDetails ?? null),
	);

	const defaultValues = useMemo(
		() =>
			job ? createJobFormValues(job) : createEmptyJobFormValues(defaultStatus),
		[defaultStatus, job],
	);

	const form = useForm({
		defaultValues,
		validators: {
			onSubmit: dashboardJobFormSchema,
		},
		onSubmit: ({ value }) => {
			const nextJob = buildJobFromFormValues(value, job ?? undefined);
			onSubmit({
				...nextJob,
				reminder: reminderValues.date
					? formatReminderSummary(reminderValues.date)
					: nextJob.reminder,
				reminderDetails: reminderValues.date ? reminderValues : null,
			});
			onOpenChange(false);
		},
	});

	useEffect(() => {
		form.reset(defaultValues);
		setReminderValues(getReminderFormValues(job?.reminderDetails ?? null));
	}, [defaultValues, form, job]);

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				showCloseButton={false}
				overlayClassName="bg-white/6 backdrop-blur-[0.8px] dark:bg-black/28 dark:backdrop-blur-[0.8px]"
				className="w-full gap-0 border-l border-slate-200 bg-white p-0 dark:border-border/60 dark:bg-card sm:max-w-lg"
			>
				<div className="flex h-full flex-col">
					<SheetHeader className="border-b border-slate-100 px-6 py-5 dark:border-border/60">
						<div className="flex items-start justify-between gap-4">
							<div>
								<SheetTitle className="text-lg font-bold tracking-[-0.04em]">
									{mode === "create" ? "Add Job" : "Edit Job"}
								</SheetTitle>
								<SheetDescription className="mt-1 text-sm text-slate-500 dark:text-muted-foreground sr-only">
									Use one focused drawer for fast updates now, with room for
									richer job workflows later.
								</SheetDescription>
							</div>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground"
								onClick={() => onOpenChange(false)}
								aria-label="Close job form"
							>
								<X className="size-5" aria-hidden="true" />
							</Button>
						</div>
					</SheetHeader>

					<form
						className="flex min-h-0 flex-1 flex-col"
						onSubmit={(event) => {
							event.preventDefault();
							form.handleSubmit();
						}}
					>
						<Tabs
							defaultValue="details"
							className="flex min-h-0 flex-1 flex-col"
						>
							<div className="border-b border-slate-100 px-6 pb-0.5 dark:border-border/60">
								<TabsList variant="line" className="h-auto gap-6 p-0">
									<TabsTrigger
										value="details"
										className="rounded-none px-0 py-4 text-sm font-semibold data-[state=active]:text-primary"
									>
										Job Details
									</TabsTrigger>
									<TabsTrigger
										value="attachments"
										disabled
										className="rounded-none px-0 py-4 text-sm font-semibold"
									>
										Attachments
									</TabsTrigger>
								</TabsList>
							</div>

							<TabsContent value="details" className="min-h-0 flex-1">
								<div className="h-full overflow-y-auto px-6 py-6">
									<FieldGroup className="gap-5">
										<form.Field
											name="title"
											children={(field) => (
												<TextField
													label="Job Title"
													name={field.name}
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
										<div className="grid gap-5 md:grid-cols-2">
											<form.Field
												name="company"
												children={(field) => (
													<TextField
														label="Company"
														name={field.name}
														value={field.state.value}
														errors={field.state.meta.errors}
														isInvalid={
															field.state.meta.isTouched &&
															!field.state.meta.isValid
														}
														icon={BriefcaseBusiness}
														onBlur={field.handleBlur}
														onChange={field.handleChange}
													/>
												)}
											/>
											<form.Field
												name="status"
												children={(field) => (
													<SelectField
														label="Status"
														value={field.state.value}
														options={jobStatusOptions}
														optionLabels={jobStatusLabels}
														errors={field.state.meta.errors}
														isInvalid={
															field.state.meta.isTouched &&
															!field.state.meta.isValid
														}
														onValueChange={(value) =>
															field.handleChange(
																value as DashboardJobFormValues["status"],
															)
														}
													/>
												)}
											/>
											<form.Field
												name="sourceName"
												children={(field) => (
													<SelectField
														label="Source"
														value={field.state.value}
														options={[
															"LinkedIn",
															"Company Site",
															"Manual",
															"Indeed",
														]}
														errors={field.state.meta.errors}
														isInvalid={
															field.state.meta.isTouched &&
															!field.state.meta.isValid
														}
														onValueChange={(value) =>
															field.handleChange(
																value as DashboardJobFormValues["sourceName"],
															)
														}
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
															field.state.meta.isTouched &&
															!field.state.meta.isValid
														}
														icon={MapPin}
														onBlur={field.handleBlur}
														onChange={field.handleChange}
													/>
												)}
											/>
											<form.Field
												name="workMode"
												children={(field) => (
													<SelectField
														label="Work Type"
														value={field.state.value}
														options={workTypeOptions}
														errors={field.state.meta.errors}
														isInvalid={
															field.state.meta.isTouched &&
															!field.state.meta.isValid
														}
														onValueChange={field.handleChange}
													/>
												)}
											/>
											<form.Field
												name="jobType"
												children={(field) => (
													<SelectField
														label="Job Type"
														value={field.state.value}
														options={["Full-time", "Part-time", "Contract"]}
														errors={field.state.meta.errors}
														isInvalid={
															field.state.meta.isTouched &&
															!field.state.meta.isValid
														}
														onValueChange={(value) =>
															field.handleChange(
																value as DashboardJobFormValues["jobType"],
															)
														}
													/>
												)}
											/>
											<form.Field
												name="experienceLevel"
												children={(field) => (
													<SelectField
														label="Experience Level"
														value={field.state.value}
														options={experienceLevelOptions}
														errors={field.state.meta.errors}
														isInvalid={
															field.state.meta.isTouched &&
															!field.state.meta.isValid
														}
														onValueChange={field.handleChange}
													/>
												)}
											/>
										</div>

										<form.Field
											name="url"
											children={(field) => (
												<TextField
													label="Job URL"
													name={field.name}
													value={field.state.value}
													errors={field.state.meta.errors}
													isInvalid={
														field.state.meta.isTouched &&
														!field.state.meta.isValid
													}
													icon={Link2}
													onBlur={field.handleBlur}
													onChange={field.handleChange}
												/>
											)}
										/>

										<div className="grid gap-5 md:grid-cols-2">
											<form.Field
												name="savedDate"
												children={(field) => (
													<DateField
														label="Saved Date"
														value={field.state.value}
														errors={field.state.meta.errors}
														isInvalid={
															field.state.meta.isTouched &&
															!field.state.meta.isValid
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
													label="Deadline (Optional)"
														value={field.state.value}
														errors={field.state.meta.errors}
														isInvalid={
															field.state.meta.isTouched &&
															!field.state.meta.isValid
														}
														open={deadlineOpen}
														onOpenChange={setDeadlineOpen}
														onChange={field.handleChange}
													/>
												)}
											/>
											<form.Field
												name="salary"
												children={(field) => (
													<TextField
														label="Salary (Optional)"
														name={field.name}
														value={field.state.value}
														errors={field.state.meta.errors}
														isInvalid={
															field.state.meta.isTouched &&
															!field.state.meta.isValid
														}
														icon={Tag}
														onBlur={field.handleBlur}
														onChange={field.handleChange}
													/>
												)}
											/>
											<form.Field
												name="currency"
												children={(field) => (
													<SelectField
														label="Currency (Optional)"
														value={field.state.value}
														options={currencyOptions}
														errors={field.state.meta.errors}
														isInvalid={
															field.state.meta.isTouched &&
															!field.state.meta.isValid
														}
														placeholder="Select currency"
														onValueChange={field.handleChange}
													/>
												)}
											/>
										</div>

										<Field>
											<FieldLabel className={fieldLabelClassName}>
												Reminder (Optional)
											</FieldLabel>
											<Button
												type="button"
												variant="outline"
												className="h-11! w-full justify-start rounded-md border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 shadow-none dark:border-[#454040] dark:bg-card dark:text-foreground"
												onClick={() => setIsReminderOpen(true)}
											>
												<Bell
													className="size-4 text-slate-400 dark:text-muted-foreground"
													aria-hidden="true"
												/>
												{reminderValues.date
													? `Update reminder • ${formatReminderSummary(reminderValues.date)}`
													: "Set reminder"}
											</Button>
										</Field>

										<form.Field
											name="notes"
											children={(field) => (
												<Field
													data-invalid={
														field.state.meta.isTouched &&
														!field.state.meta.isValid
													}
												>
													<FieldLabel className={fieldLabelClassName}>
														Job Description (Optional)
													</FieldLabel>
													<div className="rounded-md border border-slate-200 bg-white px-4 py-3 dark:border-[#454040] dark:bg-card">
														<Textarea
															value={field.state.value}
															rows={8}
															className="min-h-40 resize-none border-0 dark:bg-card px-0 py-0 text-sm font-medium text-slate-900 shadow-none focus-visible:ring-0 dark:text-foreground"
															onBlur={field.handleBlur}
															onChange={(event) =>
																field.handleChange(event.target.value)
															}
														/>
													</div>
													<FieldError errors={field.state.meta.errors} />
												</Field>
											)}
										/>
									</FieldGroup>
								</div>
							</TabsContent>
						</Tabs>

						<div className="border-t border-slate-100 px-6 py-4 dark:border-border/60">
							<div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
								<Button
									type="button"
									variant="outline"
									className="h-11 rounded-md border-slate-200 bg-white px-5 font-semibold text-slate-700 shadow-none dark:border-[#454040] dark:bg-card dark:text-foreground"
									onClick={() => onOpenChange(false)}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									className="h-11 rounded-md bg-primary px-5 font-semibold text-white shadow-none hover:bg-primary/90"
								>
									{mode === "create" ? "Save New Job" : "Save Changes"}
								</Button>
							</div>
						</div>
					</form>
				</div>
			</SheetContent>

			<ReminderFormDialog
				open={isReminderOpen}
				title={reminderValues.date ? "Update Reminder" : "Create Reminder"}
				submitLabel={reminderValues.date ? "Update Reminder" : "Save Reminder"}
				initialValues={
					reminderValues.date ? reminderValues : defaultReminderFormValues
				}
				onOpenChange={setIsReminderOpen}
				onSubmit={(values) => {
					setReminderValues(values);
				}}
			/>
		</Sheet>
	);
}
