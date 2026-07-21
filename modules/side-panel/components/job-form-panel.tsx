import { Bell, BriefcaseBusiness, Link2, MapPin, Tag, X } from "lucide-react";
import { useMemo, useState } from "react";

import {
	fieldLabelClassName,
	JobFormDateField,
	JobFormSelectField,
	JobFormTextField,
} from "@/components/job-form-fields";
import { JobDescriptionEditor } from "@/components/job-description-editor";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { experienceLevelOptions } from "@/modules/dashboard/components/job-form/job-form.utils";
import { ReminderFormDialog } from "@/modules/dashboard/components/reminders/reminder-form-dialog";
import {
	defaultReminderFormValues,
	formatReminderSummary,
} from "@/modules/dashboard/components/reminders/reminder-form.utils";
import type { ReminderFormValues } from "@/modules/dashboard/components/reminders/reminder-form.types";
import {
	SidePanelBackHeader,
	SidePanelLayout,
	SidePanelTopBar,
} from "@/modules/side-panel/components/side-panel-layout";
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

const platforms = ["LinkedIn", "Company Site", "Manual", "Indeed"] as const;
const statuses = ["Saved", "Applied", "Interview", "Offer"] as const;
const workTypeOptions = ["Remote", "Hybrid", "On-site", "Worldwide"] as const;
const jobTypeOptions = ["Full-time", "Part-time", "Contract"] as const;

export function JobFormPanel({
	mode,
	initialJob,
	isDarkMode: _isDarkMode,
	onCancel,
	onSave,
}: JobFormPanelProps) {
	const [job, setJob] = useState(initialJob);
	const [deadlineOpen, setDeadlineOpen] = useState(false);
	const [isReminderOpen, setIsReminderOpen] = useState(false);

	const reminderValues = useMemo<ReminderFormValues>(
		() =>
			job.followUpDate
				? {
						type: job.reminderType ?? "Follow up",
						date: job.followUpDate,
						time: job.followUpTime || defaultReminderFormValues.time,
						isActive: job.reminderEnabled,
						note: job.reminderNote || defaultReminderFormValues.note,
					}
				: defaultReminderFormValues,
		[
			job.followUpDate,
			job.followUpTime,
			job.reminderEnabled,
			job.reminderNote,
			job.reminderType,
		],
	);

	const updateField = <K extends keyof SidePanelJobForm>(
		field: K,
		value: SidePanelJobForm[K],
	) => {
		setJob((currentJob) => ({ ...currentJob, [field]: value }));
	};

	const updateDescription = ({ html, text }: { html: string; text: string }) => {
		setJob((currentJob) => ({
			...currentJob,
			descriptionHtml: html,
			descriptionText: text,
			notes: text,
		}));
	};

	return (
		<>
			<SidePanelLayout
				contentClassName="px-0 pb-0 pt-0"
				header={
					<SidePanelTopBar
						leftSlot={
							<SidePanelBackHeader
								title={mode === "add" ? "Add Job" : "Edit Job"}
								onBack={onCancel}
							/>
						}
						rightSlot={
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								className="text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground"
								onClick={onCancel}
								aria-label="Close job form"
							>
								<X className="size-4.5" aria-hidden="true" />
							</Button>
						}
					/>
				}
				footer={
					<div className="space-y-2">
						<div className="grid grid-cols-2 gap-3 px-1 pt-0.5 pb-1">
							<Button
								type="button"
								variant="outline"
								className="h-10 rounded-md border-slate-200 bg-white px-5 font-semibold text-slate-700 shadow-none dark:border-[#454040] dark:bg-card dark:text-foreground"
								onClick={onCancel}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								form="side-panel-job-form"
								className="h-10 rounded-md bg-primary px-5 font-semibold text-white shadow-none hover:bg-primary/90"
							>
								{mode === "add" ? "Save Job" : "Update Job"}
							</Button>
						</div>
						<p className="text-[10px] text-muted-foreground/80">
							All your job data is stored locally in your browser.
						</p>
					</div>
				}
			>
				<form
					id="side-panel-job-form"
					className="flex min-h-full flex-col"
					onSubmit={(event) => {
						event.preventDefault();
						onSave(job);
					}}
				>
					<Tabs defaultValue="details" className="flex min-h-full flex-col">
						<div className="border-b border-slate-100 px-3 pb-0.5 dark:border-border/60 sm:px-4">
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

						<TabsContent value="details" className="mt-0 flex-1">
							<div className="px-3 py-4 sm:px-4">
								<FieldGroup className="gap-5">
									<JobFormTextField
										label="Job Title"
										name="title"
										value={job.title}
										onChange={(value) => updateField("title", value)}
									/>

									<div className="grid grid-cols-2 gap-5">
										<JobFormTextField
											label="Company"
											name="company"
											value={job.company}
											icon={BriefcaseBusiness}
											onChange={(value) => updateField("company", value)}
										/>
										<JobFormSelectField
											label="Status"
											value={normalizeStatus(job.status)}
											options={statuses}
											onValueChange={(value) =>
												updateField("status", value as SidePanelJobStatus)
											}
										/>
										<JobFormSelectField
											label="Source"
											value={normalizePlatform(job.platform)}
											options={platforms}
											onValueChange={(value) => updateField("platform", value)}
										/>
										<JobFormTextField
											label="Location"
											name="location"
											value={job.location}
											icon={MapPin}
											onChange={(value) => updateField("location", value)}
										/>
										<JobFormSelectField
											label="Work Type"
											value={job.workplaceType || "Remote"}
											options={workTypeOptions}
											onValueChange={(value) => updateField("workplaceType", value)}
										/>
										<JobFormSelectField
											label="Job Type"
											value={job.employmentType || "Full-time"}
											options={jobTypeOptions}
											onValueChange={(value) => updateField("employmentType", value)}
										/>
										<JobFormSelectField
											label="Experience Level"
											value={job.experienceLevel || "Mid-level"}
											options={experienceLevelOptions}
											onValueChange={(value) => updateField("experienceLevel", value)}
										/>
									</div>

									<JobFormTextField
										label="Job URL"
										name="url"
										value={job.url}
										type="url"
										icon={Link2}
										onChange={(value) => updateField("url", value)}
									/>

									<div className="grid grid-cols-2 gap-5">
										<JobFormDateField
											label="Deadline (Optional)"
											value={job.deadline}
											open={deadlineOpen}
											onOpenChange={setDeadlineOpen}
											onChange={(value) => updateField("deadline", value)}
										/>
										<JobFormTextField
											label="Salary (Optional)"
											name="salary"
											value={job.salary}
											icon={Tag}
											onChange={(value) => updateField("salary", value)}
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
											{job.followUpDate
												? `Update reminder • ${formatReminderSummary(job.followUpDate)}`
												: "Set reminder"}
										</Button>
									</Field>

									<Field>
										<FieldLabel className={fieldLabelClassName}>
											Description (Optional)
										</FieldLabel>
										<JobDescriptionEditor
											value={job.descriptionHtml || job.descriptionText || job.notes}
											onChange={updateDescription}
										/>
									</Field>
								</FieldGroup>
							</div>
						</TabsContent>
					</Tabs>
				</form>
			</SidePanelLayout>

			<ReminderFormDialog
				open={isReminderOpen}
				title={job.followUpDate ? "Update Reminder" : "Create Reminder"}
				submitLabel={job.followUpDate ? "Update Reminder" : "Save Reminder"}
				contentClassName="w-[calc(100%-1.5rem)] max-w-none rounded-xl"
				fieldGridClassName="grid-cols-2 md:grid-cols-2"
				footerClassName="grid grid-cols-2 gap-3 sm:grid-cols-2"
				initialValues={reminderValues}
				onOpenChange={setIsReminderOpen}
				onSubmit={(values) => {
					updateField("reminderType", values.type);
					updateField("followUpDate", values.date);
					updateField("followUpTime", values.time);
					updateField("reminderEnabled", values.isActive && Boolean(values.date));
					updateField("reminderDone", false);
					updateField("reminderNote", values.note);
				}}
			/>
		</>
	);
}

function normalizePlatform(value: string) {
	return (platforms as readonly string[]).includes(value) ? value : "Manual";
}

function normalizeStatus(value: SidePanelJobStatus) {
	return value === "Rejected" ? "Saved" : value;
}
