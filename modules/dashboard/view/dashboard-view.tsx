import { useCallback, useEffect, useState } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useThemePreference } from "@/hooks/use-theme-preference";
import { DashboardContent } from "@/modules/dashboard/components/dashboard-content";
import { DashboardHeader } from "@/modules/dashboard/components/dashboard-header";
import { DashboardSidebar } from "@/modules/dashboard/components/dashboard-sidebar";
import {
	isDashboardView,
	type DashboardView,
} from "@/modules/dashboard/navigation";

function getViewFromHash(): DashboardView {
	const hashView = window.location.hash.replace(/^#/, "");
	return isDashboardView(hashView) ? hashView : "all-jobs";
}

function usesCustomHeader(view: DashboardView) {
	return (
		view === "all-jobs" ||
		view === "analytics" ||
		view === "reminders" ||
		view === "settings" ||
		view === "export"
	);
}

export function DashboardView() {
	useThemePreference();
	const [activeView, setActiveView] = useState<DashboardView>(getViewFromHash);

	useEffect(() => {
		function handleHashChange() {
			setActiveView(getViewFromHash());
		}

		window.addEventListener("hashchange", handleHashChange);
		return () => window.removeEventListener("hashchange", handleHashChange);
	}, []);

	const handleViewChange = useCallback(
		(view: DashboardView) => {
			if (view === activeView) return;
			window.location.hash = view;
			setActiveView(view);
		},
		[activeView],
	);

	return (
		<SidebarProvider
			className="h-svh bg-slate-50 text-slate-950 dark:bg-[#202020] dark:text-slate-50"
			style={
				{
					"--sidebar-width": "18.5rem",
					"--sidebar-width-icon": "5rem",
				} as React.CSSProperties
			}
		>
			<DashboardSidebar
				activeView={activeView}
				onViewChange={handleViewChange}
			/>
			<SidebarInset className="h-svh min-h-0 min-w-0 overflow-hidden bg-slate-50 dark:bg-[#202020]">
				<main className="@container/main flex h-svh min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
					{usesCustomHeader(activeView) ? null : (
						<DashboardHeader activeView={activeView} />
					)}
					<div
						data-dashboard-content
						className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto px-4 pb-20 md:px-8 md:pb-24"
					>
						<section className="flex min-h-0 min-w-0 w-full flex-col">
							<DashboardContent activeView={activeView} />
						</section>
					</div>
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
