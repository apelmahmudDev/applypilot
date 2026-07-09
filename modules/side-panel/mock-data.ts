import { BriefcaseBusiness, CalendarDays, CheckCircle2 } from "lucide-react";

import type { RecentJob, Reminder } from "@/modules/side-panel/types";

export const recentJobs: RecentJob[] = [
	{
		id: "amazon-frontend",
		title: "Frontend Developer",
		company: "Amazon",
		location: "Bengaluru, India",
		date: "15 Jul, 2024",
		followUp: "Follow-up in 3d",
		status: "Applied",
		brand: "amazon",
	},
	{
		id: "microsoft-software",
		title: "Software Engineer",
		company: "Microsoft",
		location: "Noida, India",
		date: "14 Jul, 2024",
		followUp: "Follow-up in 1d",
		status: "Interview",
		brand: "microsoft",
	},
	{
		id: "swiggy-frontend",
		title: "Frontend Developer",
		company: "Swiggy",
		location: "Bengaluru, India",
		date: "10 Jul, 2024",
		followUp: "Today",
		status: "Interview",
		brand: "swiggy",
	},
	{
		id: "google-sde",
		title: "SDE II",
		company: "Google",
		location: "Bengaluru, India",
		date: "09 Jul, 2024",
		followUp: "Follow-up in 5d",
		status: "Saved",
		brand: "google",
	},
];

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

export const stats = [
	{ label: "Saved", value: "42", icon: CalendarDays },
	{ label: "Applied", value: "18", icon: CheckCircle2 },
	{ label: "Interview", value: "4", icon: BriefcaseBusiness },
];
