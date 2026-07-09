import { BriefcaseBusiness, CalendarDays } from "lucide-react";

import type { Reminder, SidePanelJobForm } from "@/modules/side-panel/types";

export const reminders: Reminder[] = [
	{
		id: "swiggy-call",
		company: "Swiggy",
		title: "Frontend Developer",
		description: "Follow-up with hiring manager",
		time: "Today, 4:00 PM",
		icon: CalendarDays,
	},
	{
		id: "microsoft-prep",
		company: "Microsoft",
		title: "Software Engineer",
		description: "Prepare for interview",
		time: "Tomorrow, 11:00 AM",
		icon: BriefcaseBusiness,
	},
];

export const emptyJobForm: SidePanelJobForm = {
	title: "",
	company: "",
	location: "",
	url: "",
	platform: "LinkedIn",
	salary: "",
	status: "Saved",
	deadline: "",
	followUpDate: "",
	recruiterName: "",
	recruiterEmail: "",
	tags: [],
	notes: "",
};
