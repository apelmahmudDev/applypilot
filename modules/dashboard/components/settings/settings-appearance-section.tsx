import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

import { settingsSections } from "./data";
import { SettingsSectionCard } from "./settings-section-card";

export function SettingsAppearanceSection() {
	return (
		<SettingsSectionCard config={settingsSections.appearance}>
			<div className="flex flex-col gap-3 border-t border-slate-100 pt-6 lg:flex-row lg:items-center lg:justify-between">
				<div className="min-w-0">
					<h3 className="text-base font-semibold text-slate-900">Theme</h3>
					<p className="mt-1 text-sm text-slate-500">
						Choose your preferred theme.
					</p>
				</div>

				<div className="inline-flex w-full rounded-2xl border border-slate-200 bg-slate-50 p-1 lg:w-auto">
					<Button
						type="button"
						variant="ghost"
						className="h-9 flex-1 rounded-xl bg-white px-4 font-semibold text-primary shadow-sm hover:bg-white hover:text-primary lg:flex-none"
					>
						<Sun className="size-4" aria-hidden="true" />
						Light
					</Button>
					<Button
						type="button"
						variant="ghost"
						className="h-9 flex-1 rounded-xl px-4 font-semibold text-slate-600 hover:bg-white hover:text-slate-900 lg:flex-none"
					>
						<Moon className="size-4" aria-hidden="true" />
						Dark
					</Button>
				</div>
			</div>
		</SettingsSectionCard>
	);
}
