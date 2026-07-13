import { SidebarArrowTrigger, SidebarTrigger } from "@/components/ui/sidebar";
import { type DashboardView } from "@/modules/dashboard/navigation";
import { getExportDashboardHeaderContent } from "@/modules/dashboard/view/export-view";

type DashboardHeaderProps = {
	activeView: DashboardView;
};

export type DashboardHeaderContent = {
	markup: React.ReactNode;
};

export function DashboardHeader({ activeView }: DashboardHeaderProps) {
	const content = getDefaultDashboardHeaderContent(activeView);

	return (
		<header className="sticky top-0 z-30 w-full shrink-0 backdrop-blur-xl">
			<SidebarArrowTrigger />
			<nav className="flex w-full px-4 py-5 md:px-8">
				<div className="flex w-full min-w-0 items-start gap-3">
					<SidebarTrigger className="mt-1 size-10 rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 md:hidden" />
					<div className="min-w-0 flex-1">{content.markup}</div>
				</div>
			</nav>
		</header>
	);
}

export function getDefaultDashboardHeaderContent(
	activeView: DashboardView,
): DashboardHeaderContent {
	if (activeView === "export") {
		return getExportDashboardHeaderContent();
	}

	return {
		markup: (
			<div className="py-1">
				<p className="text-sm font-medium text-slate-500">
					This view does not provide a dashboard header.
				</p>
			</div>
		),
	};
}
