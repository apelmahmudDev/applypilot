import { settingsSections } from "./data";
import { SettingsSectionCard } from "./settings-section-card";

export function SettingsAboutSection() {
	return (
		<SettingsSectionCard config={settingsSections.about}>
			<div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-end sm:justify-between">
				<div className="min-w-0">
					<h3 className="text-base font-semibold text-slate-900">
						Local-first by design
					</h3>
					<p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
						Applypilot keeps job application data inside your browser so you can
						track progress privately without extra accounts or syncing services.
					</p>
				</div>

				<p className="shrink-0 text-sm font-semibold text-slate-500">
					Version 1.0.0
				</p>
			</div>
		</SettingsSectionCard>
	);
}
