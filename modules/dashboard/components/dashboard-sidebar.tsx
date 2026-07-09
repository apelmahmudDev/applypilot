import { Moon, Send } from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
	dashboardNavSections,
	type DashboardView,
} from "@/modules/dashboard/navigation";

type DashboardSidebarProps = {
	activeView: DashboardView;
	onViewChange: (view: DashboardView) => void;
};

export function DashboardSidebar({
	activeView,
	onViewChange,
}: DashboardSidebarProps) {
	const collapsedMenuButtonClass =
		"group-data-[collapsible=icon]:h-auto! group-data-[collapsible=icon]:w-full! group-data-[collapsible=icon]:flex-col! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-1 group-data-[collapsible=icon]:px-1! group-data-[collapsible=icon]:py-2.5! group-data-[collapsible=icon]:text-center group-data-[collapsible=icon]:[&>span]:overflow-visible group-data-[collapsible=icon]:[&>span]:text-clip group-data-[collapsible=icon]:[&>span]:whitespace-normal group-data-[collapsible=icon]:[&>span]:text-center group-data-[collapsible=icon]:[&>span]:text-[11px] group-data-[collapsible=icon]:[&>span]:leading-4";

	return (
		<Sidebar collapsible="icon" variant="inset">
			<SidebarHeader className="px-3 pb-2 pt-4">
				<div className="flex items-center gap-3 rounded-lg px-2 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-data-[collapsible=icon]:size-11">
						<Send
							className="size-6 fill-blue-500 stroke-blue-600"
							aria-hidden="true"
						/>
					</div>
					<div className="min-w-0 group-data-[collapsible=icon]:hidden">
						<h1 className="truncate text-lg font-bold tracking-normal">
							ApplyPilot
						</h1>
						<p className="truncate text-xs font-semibold text-slate-500">
							Job application tracker
						</p>
					</div>
				</div>
			</SidebarHeader>

			<SidebarContent className="px-2 group-data-[collapsible=icon]:px-1.5">
				{dashboardNavSections.map((section) => (
					<SidebarGroup key={section.label} className="px-1">
						<SidebarGroupLabel className="px-2 text-[11px] font-bold uppercase tracking-normal">
							{section.label}
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu className="gap-1">
								{section.items.map((item) => {
									const Icon = item.icon;
									const isActive = activeView === item.value;

									return (
										<SidebarMenuItem key={item.value}>
											<SidebarMenuButton
												type="button"
												size="lg"
												tooltip={item.label}
												isActive={isActive}
												className={cn(
													"h-10 rounded-lg font-bold",
													collapsedMenuButtonClass,
													isActive
														? "bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600"
														: "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
												)}
												onClick={() => onViewChange(item.value)}
											>
												<Icon className="size-4 group-data-[collapsible=icon]:size-5" aria-hidden="true" />
												<span>{item.label}</span>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>

			<SidebarFooter className="border-t border-slate-200 p-3">
				<div className="flex items-center justify-between rounded-lg px-2 py-2 text-sm font-bold text-slate-700 group-data-[collapsible=icon]:justify-center">
					<div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
						<Moon className="size-4 text-blue-600" aria-hidden="true" />
						Dark Mode
					</div>
					<Switch size="sm" />
				</div>
				<div className="flex items-center gap-3 rounded-lg bg-slate-100 p-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
						A
					</div>
					<div className="min-w-0 group-data-[collapsible=icon]:hidden">
						<p className="truncate text-sm font-bold text-slate-800">
							Aryan Mehta
						</p>
						<p className="truncate text-xs font-semibold text-slate-500">
							Local workspace
						</p>
					</div>
				</div>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
