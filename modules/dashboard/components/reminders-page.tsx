import { Bell } from "lucide-react";

import { PlaceholderPage } from "@/modules/dashboard/components/placeholder-page";

export function RemindersPage() {
	return (
		<PlaceholderPage
			icon={Bell}
			title="Reminders"
			description="A focused follow-up workspace for upcoming interviews, recruiter replies, and application check-ins."
			items={[
				"Today and upcoming reminders",
				"Follow-up schedule",
				"Mark done workflow",
				"Reminder editing",
			]}
		/>
	);
}
