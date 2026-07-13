import type { DashboardHeaderContent } from "@/modules/dashboard/components/dashboard-header";
import { ExportContentsSection } from "@/modules/dashboard/components/export/export-contents-section";
import { ExportControlsSection } from "@/modules/dashboard/components/export/export-controls-section";
import { ExportInfoSection } from "@/modules/dashboard/components/export/export-info-section";

export function getExportDashboardHeaderContent(): DashboardHeaderContent {
	return {
		title: "Export",
		description:
			"Download a backup of your data. You can import it anytime to restore.",
		searchSlot: <></>,
		actions: <></>,
	};
}

export function ExportView() {
	return (
		<div>
			<section className="mt-6 mb-8 space-y-6">
				<div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
					<ExportContentsSection />
					<ExportControlsSection />
				</div>

				<ExportInfoSection />
			</section>
		</div>
	);
}
