import { useState } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardContent } from "@/modules/dashboard/components/dashboard-content";
import { DashboardHeader } from "@/modules/dashboard/components/dashboard-header";
import { DashboardSidebar } from "@/modules/dashboard/components/dashboard-sidebar";
import type { DashboardView } from "@/modules/dashboard/navigation";

export function DashboardPage() {
	const [activeView, setActiveView] = useState<DashboardView>("dashboard");

	return (
		<SidebarProvider
			className="min-h-screen bg-slate-50 text-slate-950"
			style={
				{
					"--sidebar-width": "18.5rem",
					"--sidebar-width-icon": "5rem",
				} as React.CSSProperties
			}
		>
			<DashboardSidebar activeView={activeView} onViewChange={setActiveView} />
			<SidebarInset className="bg-slate-50">
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
