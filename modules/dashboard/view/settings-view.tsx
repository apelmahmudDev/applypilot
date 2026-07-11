import { Settings } from "lucide-react";

import { PlaceholderPage } from "@/modules/dashboard/components/placeholder-page";

export function SettingsView() {
	return (
		<PlaceholderPage
			icon={Settings}
			title="Settings"
			description="Configuration for local storage, display preferences, default status, and dashboard behavior."
			items={[
				"Default job status",
				"Theme preference",
				"Storage management",
				"Privacy controls",
			]}
		/>
	);
}
