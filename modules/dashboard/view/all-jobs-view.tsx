import { BriefcaseBusiness } from "lucide-react";

import { PlaceholderPage } from "@/modules/dashboard/components/placeholder-page";

export function AllJobsView() {
	return (
		<PlaceholderPage
			icon={BriefcaseBusiness}
			title="All Jobs"
			description="A full management view for every saved application. This page can later host the complete data table, bulk actions, and advanced filtering."
			items={[
				"Saved jobs table",
				"Bulk status updates",
				"Advanced filters",
				"Edit and delete actions",
			]}
		/>
	);
}
