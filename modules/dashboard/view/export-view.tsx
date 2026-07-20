import type { DashboardHeaderContent } from "@/modules/dashboard/components/dashboard-header";
import { ExportContentsSection } from "@/modules/dashboard/components/export/export-contents-section";
import { ExportControlsSection } from "@/modules/dashboard/components/export/export-controls-section";
import { ExportInfoSection } from "@/modules/dashboard/components/export/export-info-section";

// only visible based on permission (currently is not showing)
export function getExportDashboardHeaderContent(): DashboardHeaderContent {
	return {
		markup: (
			<section className="flex w-full flex-col justify-center">
				<div className="min-w-0">
					<h1 className="text-3xl font-bold tracking-[-0.05em] text-slate-950 dark:text-foreground">
						Backup &amp; Restore
					</h1>
					<p className="mt-2 text-sm text-slate-500 dark:text-muted-foreground">
						Download a backup of your data and restore it anytime.
					</p>
				</div>
			</section>
		),
	};
}

export function ExportView() {
	return (
		<div>
			<section className="mb-5 flex flex-col gap-5 pt-5 pb-2 xl:flex-row xl:items-center xl:justify-between">
				<div className="min-w-0">
					<h1 className="text-3xl font-bold tracking-[-0.05em] text-slate-950 dark:text-foreground">
						Backup &amp; Restore
					</h1>
					<p className="mt-2 text-sm text-slate-500 dark:text-muted-foreground">
						Download a backup of your data and restore it anytime.
					</p>
				</div>
			</section>

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
