import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { settingsPreferenceItems, settingsSections } from "./data";
import { SettingsSectionCard } from "./settings-section-card";

export function SettingsPreferencesSection() {
	return (
		<SettingsSectionCard config={settingsSections.preferences}>
			<div className="space-y-6">
				{settingsPreferenceItems.map((item) => (
					<div
						key={item.id}
						className="flex flex-col gap-3 border-t border-slate-100 pt-6 first:border-t-0 first:pt-0 lg:flex-row lg:items-center lg:justify-between"
					>
						<div className="min-w-0">
							<h3 className="text-base font-semibold text-slate-900">
								{item.label}
							</h3>
							<p className="mt-1 text-sm text-slate-500">{item.description}</p>
						</div>

						<Select defaultValue={item.defaultValue}>
							<SelectTrigger className="h-11! w-full rounded-md border-slate-200 bg-white px-4 font-semibold text-slate-700 shadow-none lg:w-50">
								<SelectValue />
							</SelectTrigger>
							<SelectContent align="end">
								{item.options.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				))}
			</div>
		</SettingsSectionCard>
	);
}
