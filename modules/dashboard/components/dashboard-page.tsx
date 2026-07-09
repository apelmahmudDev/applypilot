import {
	BarChart3,
	Bell,
	BriefcaseBusiness,
	Download,
	Grid2X2,
	List,
	Moon,
	Send,
	Settings,
	TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { dashboardColumns } from "@/modules/dashboard/components/columns";
import { DataTable } from "@/modules/dashboard/components/data-table";
import { dashboardJobs, dashboardStats } from "@/modules/dashboard/mock-data";

const navItems = [
	{ label: "Dashboard", icon: Grid2X2, active: true },
	{ label: "All Jobs", icon: BriefcaseBusiness },
	{ label: "Analytics", icon: BarChart3 },
	{ label: "Reminders", icon: Bell },
	{ label: "Export", icon: Download },
	{ label: "Settings", icon: Settings },
];

export function DashboardPage() {
	return (
		<main className="h-screen min-h-[720px] overflow-hidden bg-slate-50 p-6 text-slate-950">
			<div className="mx-auto flex h-full max-w-[1440px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.10)]">
				<aside className="flex w-[250px] shrink-0 flex-col border-r border-slate-200 bg-white px-5 py-6">
					<div className="flex items-center gap-3 px-1">
						<div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
							<Send
								className="size-6 fill-blue-500 stroke-blue-600"
								aria-hidden="true"
							/>
						</div>
						<h1 className="text-xl font-bold tracking-normal">ApplyPilot</h1>
					</div>

					<nav className="mt-10 space-y-2">
						{navItems.map((item) => {
							const Icon = item.icon;
							return (
								<Button
									key={item.label}
									type="button"
									variant="ghost"
									className={cn(
										"h-11 w-full justify-start gap-3 rounded-md px-3 text-sm font-bold",
										item.active
											? "bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600"
											: "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
									)}
								>
									<Icon className="size-4" aria-hidden="true" />
									{item.label}
								</Button>
							);
						})}
					</nav>

					<div className="mt-auto space-y-5">
						<div className="flex items-center justify-between px-2 text-sm font-bold text-slate-700">
							<div className="flex items-center gap-2">
								<Moon className="size-4 text-blue-600" aria-hidden="true" />
								Dark Mode
							</div>
							<Switch size="sm" />
						</div>
						<div className="flex items-center gap-3 rounded-md bg-slate-50 p-3">
							<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
								A
							</div>
							<span className="truncate text-sm font-bold text-slate-800">
								Aryan Mehta
							</span>
						</div>
					</div>
				</aside>

				<section className="min-w-0 flex-1 overflow-y-auto px-7 py-6">
					<DataTable
						columns={dashboardColumns}
						data={dashboardJobs}
						statsSlot={
							<div className="grid grid-cols-5 gap-5">
								{dashboardStats.map((stat) => (
									<article
										key={stat.label}
										className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]"
									>
										<p className="text-xs font-bold text-slate-700">
											{stat.label}
										</p>
										<p className="mt-3 text-3xl font-bold tracking-normal text-slate-950">
											{stat.value}
										</p>
										<p className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-600">
											<TrendingUp className="size-3.5" aria-hidden="true" />
											{stat.trend}
										</p>
									</article>
								))}
							</div>
						}
					/>
				</section>
			</div>
		</main>
	);
}
