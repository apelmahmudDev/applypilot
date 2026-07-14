import * as z from "zod";

import { reminderTypeOptions } from "@/modules/dashboard/components/reminders/reminder-form.types";
import { jobStatuses } from "@/modules/popup/types";

export const jobFormSchema = z.object({
	title: z.string().trim().min(1, "Job title is required."),
	company: z.string().trim().min(1, "Company is required."),
	location: z.string().trim().min(1, "Location is required."),
	url: z.string().trim().url("Enter a valid job URL."),
	platform: z.string().trim().min(1, "Platform is required."),
	salary: z.string(),
	currency: z.string(),
	experienceLevel: z.string(),
	status: z.enum(jobStatuses),
	savedDate: z.string().trim().min(1, "Saved date is required."),
	deadline: z.string(),
	reminderType: z.enum(reminderTypeOptions),
	followUpDate: z.string(),
	followUpTime: z.string(),
	reminderNote: z.string(),
	reminderEnabled: z.boolean(),
	reminderDone: z.boolean(),
	notes: z.string(),
}).superRefine((value, context) => {
	if (!value.reminderEnabled) {
		return;
	}

	if (!value.followUpDate.trim()) {
		context.addIssue({
			code: z.ZodIssueCode.custom,
			path: ["followUpDate"],
			message: "Follow-up date is required when reminder is enabled.",
		});
	}
});
