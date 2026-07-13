import { TrendingUp } from "lucide-react";

import { dashboardJobs, dashboardStats } from "@/modules/dashboard/mock-data";
import { dashboardColumns } from "../components/job-table/columns";
import { DataTable } from "../components/job-table/data-table";

export function AllJobsView() {
	return (
		<DataTable
			columns={dashboardColumns}
			data={dashboardJobs}
			statsSlot={
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
					{dashboardStats.map((stat) => (
						<article
							key={stat.label}
							className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]"
						>
							<p className="text-xs font-bold text-slate-700">{stat.label}</p>
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
	);
}
