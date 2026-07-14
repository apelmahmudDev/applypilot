import * as z from "zod";

import { reminderTypeOptions } from "./reminder-form.types";

export const reminderFormSchema = z.object({
	type: z.enum(reminderTypeOptions, {
		message: "Reminder type is required.",
	}),
	date: z.string().min(1, "Date is required."),
	time: z.string().min(1, "Time is required."),
	isActive: z.boolean(),
	note: z
		.string()
		.trim()
		.min(1, "Message / note is required.")
		.max(500, "Message / note must be 500 characters or fewer."),
});
