import { AllJobsView } from "@/modules/dashboard/view/all-jobs-view";
import { AnalyticsView } from "@/modules/dashboard/view/analytics-view";
import { DashboardOverview } from "@/modules/dashboard/view/dashboard-overview";
import { ExportView } from "@/modules/dashboard/view/export-view";
import { RemindersView } from "@/modules/dashboard/view/reminders-view";
import { SettingsView } from "@/modules/dashboard/view/settings-view";
import type { DashboardView } from "@/modules/dashboard/navigation";

type DashboardContentProps = {
	activeView: DashboardView;
};

export function DashboardContent({ activeView }: DashboardContentProps) {
	if (activeView === "all-jobs") {
		return <AllJobsView />;
	}
	if (activeView === "analytics") return <AnalyticsView />;
	if (activeView === "reminders") return <RemindersView />;
	if (activeView === "export") return <ExportView />;
	if (activeView === "settings") return <SettingsView />;

	return <DashboardOverview />;
}
