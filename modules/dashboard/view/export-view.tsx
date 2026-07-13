import type { DashboardHeaderContent } from "@/modules/dashboard/components/dashboard-header";
import { ExportContentsSection } from "@/modules/dashboard/components/export/export-contents-section";
import { ExportControlsSection } from "@/modules/dashboard/components/export/export-controls-section";
import { ExportInfoSection } from "@/modules/dashboard/components/export/export-info-section";

export function getExportDashboardHeaderContent(): DashboardHeaderContent {
	return {
		markup: (
			<section className="flex w-full flex-col justify-center">
				<div className="min-w-0">
					<h1 className="text-3xl font-bold tracking-[-0.05em] text-slate-950">
						Export
					</h1>
					<p className="mt-2 text-sm text-slate-500">
						Download a backup of your data. You can import it anytime to
						restore.
					</p>
				</div>
			</section>
		),
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
