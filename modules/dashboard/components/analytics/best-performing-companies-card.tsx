import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { bestPerformingCompanies } from "./analytics-data";
import { AnalyticsSectionCard } from "./analytics-section-card";

export function BestPerformingCompaniesCard() {
	return (
		<AnalyticsSectionCard
			title="Best Performing Companies"
			className="lg:col-span-2 xl:col-span-4"
			contentClassName="space-y-4"
		>
			<div className="grid grid-cols-[minmax(0,1fr)_96px_112px] gap-3 border-b border-slate-100 pb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
				<span>Company</span>
				<span className="text-right">Applications</span>
				<span className="text-right">Interview Rate</span>
			</div>

			<div className="space-y-4">
				{bestPerformingCompanies.map((company) => (
					<div
						key={company.company}
						className="grid grid-cols-[minmax(0,1fr)_96px_112px] items-center gap-3 text-sm"
					>
						<div className="flex min-w-0 items-center gap-3">
							<Avatar className="size-8 rounded-lg border border-slate-100">
								<AvatarFallback
									className={cn("rounded-lg text-xs font-bold", company.accentClassName)}
								>
									{company.company.slice(0, 1)}
								</AvatarFallback>
							</Avatar>
							<span className="truncate font-medium text-slate-700">
								{company.company}
							</span>
						</div>
						<span className="text-right font-medium text-slate-600">
							{company.applications}
						</span>
						<span className="text-right font-semibold text-emerald-600">
							{company.interviewRate}
						</span>
					</div>
				))}
			</div>
		</AnalyticsSectionCard>
	);
}
