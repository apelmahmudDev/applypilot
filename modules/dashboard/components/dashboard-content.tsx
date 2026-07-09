import { AllJobsPage } from "@/modules/dashboard/components/all-jobs-page";
import { AnalyticsPage } from "@/modules/dashboard/components/analytics-page";
import { DashboardOverview } from "@/modules/dashboard/components/dashboard-overview";
import { ExportPage } from "@/modules/dashboard/components/export-page";
import { RemindersPage } from "@/modules/dashboard/components/reminders-page";
import { SettingsPage } from "@/modules/dashboard/components/settings-page";
import type { DashboardView } from "@/modules/dashboard/navigation";

type DashboardContentProps = {
	activeView: DashboardView;
};

export function DashboardContent({ activeView }: DashboardContentProps) {
	if (activeView === "all-jobs") return <AllJobsPage />;
	if (activeView === "analytics") return <AnalyticsPage />;
	if (activeView === "reminders") return <RemindersPage />;
	if (activeView === "export") return <ExportPage />;
	if (activeView === "settings") return <SettingsPage />;

	return <DashboardOverview />;
}
