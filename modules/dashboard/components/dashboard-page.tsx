import { useCallback, useEffect, useState } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSystemTheme } from "@/hooks/use-system-theme";
import { DashboardContent } from "@/modules/dashboard/components/dashboard-content";
import { DashboardHeader } from "@/modules/dashboard/components/dashboard-header";
import { DashboardSidebar } from "@/modules/dashboard/components/dashboard-sidebar";
import {
	isDashboardView,
	type DashboardView,
} from "@/modules/dashboard/navigation";

function getViewFromHash(): DashboardView {
	const hashView = window.location.hash.replace(/^#/, "");
	return isDashboardView(hashView) ? hashView : "dashboard";
}

export function DashboardPage() {
	useSystemTheme();
	const [activeView, setActiveView] = useState<DashboardView>(getViewFromHash);

	useEffect(() => {
		function handleHashChange() {
			setActiveView(getViewFromHash());
		}

		window.addEventListener("hashchange", handleHashChange);
		return () => window.removeEventListener("hashchange", handleHashChange);
	}, []);

	const handleViewChange = useCallback((view: DashboardView) => {
		if (view === activeView) return;
		window.location.hash = view;
		setActiveView(view);
	}, [activeView]);

	return (
		<SidebarProvider
			className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50"
			style={
				{
					"--sidebar-width": "18.5rem",
					"--sidebar-width-icon": "5rem",
				} as React.CSSProperties
			}
		>
			<DashboardSidebar activeView={activeView} onViewChange={handleViewChange} />
			<SidebarInset className="bg-slate-50 dark:bg-slate-950">
				<main
					className="@container/main flex min-h-screen flex-1 flex-col"
					style={{ ["--dashboard-header-offset" as string]: "4.5rem" }}
				>
					<DashboardHeader activeView={activeView} />
					<div
						data-dashboard-content
						className="flex flex-1 flex-col px-4 pb-6 md:px-8"
					>
						<section className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col">
							<DashboardContent activeView={activeView} />
						</section>
					</div>
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
