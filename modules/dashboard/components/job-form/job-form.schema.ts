import * as z from "zod";

export const dashboardJobFormSchema = z.object({
	title: z.string().trim().min(1, "Job title is required."),
	company: z.string().trim().min(1, "Company is required."),
	status: z.enum(["Saved", "Applied", "Interview", "Offer", "Rejected"], {
		message: "Status is required.",
	}),
	location: z.string().trim().min(1, "Location is required."),
	workMode: z.string().trim().min(1, "Work type is required."),
	jobType: z.enum(["Full-time", "Part-time", "Contract"], {
		message: "Job type is required.",
	}),
	experienceLevel: z.string().trim().min(1, "Experience level is required."),
	sourceName: z.enum(["LinkedIn", "Company Site", "Manual", "Indeed"], {
		message: "Source is required.",
	}),
	url: z.string().trim(),
	savedDate: z.string().min(1, "Saved date is required."),
	appliedDate: z.string(),
	salary: z.string().trim(),
	currency: z.string().trim(),
	notes: z.string().trim().max(500, "Notes must be 500 characters or fewer."),
});
