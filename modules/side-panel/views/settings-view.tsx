import { cn } from "@/lib/utils";
import { FullDashboardButton } from "@/modules/side-panel/components/full-dashboard-button";
import { ViewHeader } from "@/modules/side-panel/components/view-header";

type SettingsViewProps = {
	isDarkMode: boolean;
	onBack: () => void;
};

export function SettingsView({ isDarkMode, onBack }: SettingsViewProps) {
	return (
		<div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-4">
			<ViewHeader title="Settings" isDarkMode={isDarkMode} onBack={onBack} />
			<section
				className={cn(
					"rounded-lg border p-4",
					isDarkMode
						? "border-slate-700/65 bg-[#262628] text-slate-300"
						: "border-slate-200 bg-white text-slate-600",
				)}
			>
				<p className="text-sm font-semibold">System theme</p>
				<p className="mt-1 text-xs leading-5">
					Applypilot follows your browser and operating system appearance.
				</p>
			</section>
			<div className="mt-auto">
				<FullDashboardButton isDarkMode={isDarkMode} />
			</div>
		</div>
	);
}
