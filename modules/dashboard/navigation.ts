import {
	BarChart3,
	Bell,
	BriefcaseBusiness,
	Download,
	Grid2X2,
	Settings,
} from "lucide-react";

export type DashboardView =
	| "all-jobs"
	| "analytics"
	| "reminders"
	| "export"
	| "settings";

export type DashboardNavItem = {
	label: string;
	value: DashboardView;
	icon: typeof Grid2X2;
};

export type DashboardNavSection = {
	label: string;
	items: DashboardNavItem[];
};

export const dashboardNavSections: DashboardNavSection[] = [
	{
		label: "Tracking",
		items: [
			{ label: "All Jobs", value: "all-jobs", icon: BriefcaseBusiness },
			{ label: "Analytics", value: "analytics", icon: BarChart3 },
		],
	},
	{
		label: "Tools",
		items: [
			{ label: "Reminders", value: "reminders", icon: Bell },
			{ label: "Backup & Restore", value: "export", icon: Download },
		],
	},
	{
		label: "Preferences",
		items: [{ label: "Settings", value: "settings", icon: Settings }],
	},
];

const dashboardViews = new Set<DashboardView>(
	dashboardNavSections
		.flatMap((section) => section.items)
		.map((item) => item.value),
);

export function isDashboardView(value: string): value is DashboardView {
	return dashboardViews.has(value as DashboardView);
}

export function getDashboardViewTitle(view: DashboardView) {
	return (
		dashboardNavSections
			.flatMap((section) => section.items)
			.find((item) => item.value === view)?.label ?? "All Jobs"
	);
}
