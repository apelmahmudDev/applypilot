import { Bell, Plus, Search, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
	getDashboardViewTitle,
	type DashboardView,
} from "@/modules/dashboard/navigation";

type DashboardHeaderProps = {
	activeView: DashboardView;
};

export function DashboardHeader({ activeView }: DashboardHeaderProps) {
	const title = getDashboardViewTitle(activeView);

	return (
		<header className="sticky top-0 z-10 w-full bg-slate-50/85 backdrop-blur-md">
			<nav className="mx-auto flex h-[var(--dashboard-header-offset)] max-w-[1280px] items-center justify-between gap-4 px-4 md:px-8">
				<div className="flex min-w-0 items-center gap-3">
					<SidebarTrigger className="size-10 rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50" />
					<div className="min-w-0">
						<p className="text-xs font-bold uppercase text-slate-500">
							ApplyPilot
						</p>
						<h2 className="truncate text-xl font-bold tracking-normal text-slate-950">
							{title}
						</h2>
					</div>
				</div>

				<div className="flex flex-1 items-center justify-end gap-3">
					<div className="relative hidden w-full max-w-md md:block">
						<Search
							className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
							aria-hidden="true"
						/>
						<Input
							placeholder="Search jobs, companies, notes..."
							className="h-10 rounded-lg border-slate-200 bg-white pl-10 text-sm font-medium shadow-sm"
						/>
					</div>
					<Button
						type="button"
						variant="outline"
						size="icon-lg"
						className="rounded-lg border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50"
						aria-label="Notifications"
						title="Notifications"
					>
						<Bell className="size-4" aria-hidden="true" />
					</Button>
					<Button className="h-10 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white shadow-[0_8px_20px_rgba(37,99,235,0.22)] hover:bg-blue-700">
						<Plus className="size-4" aria-hidden="true" />
						Add Job
					</Button>
					<Button
						type="button"
						variant="outline"
						size="icon-lg"
						className="rounded-lg border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50"
						aria-label="Settings"
						title="Settings"
					>
						<Settings className="size-4" aria-hidden="true" />
					</Button>
				</div>
			</nav>
		</header>
	);
}
