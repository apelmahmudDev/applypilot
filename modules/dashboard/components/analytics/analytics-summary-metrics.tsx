import {
	AlarmClock,
	ArrowDown,
	ArrowUp,
	CalendarDays,
	Clock3,
	Send,
	TrendingUp,
	type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { analyticsSummaryMetrics } from "./analytics-data";

const metricIcons: LucideIcon[] = [
	Clock3,
	AlarmClock,
	TrendingUp,
	Send,
	CalendarDays,
];

export function AnalyticsSummaryMetrics() {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
			{analyticsSummaryMetrics.map((metric, index) => {
				const Icon = metricIcons[index];
				const TrendIcon =
					metric.trendDirection === "down" ? ArrowDown : ArrowUp;

				return (
					<article
						key={metric.label}
						className="flex items-center gap-4 rounded-md border border-slate-100 bg-white p-4"
					>
						<div
							className={cn(
								"flex size-12 shrink-0 items-center justify-center rounded-xl",
								metric.accentClassName,
							)}
						>
							<Icon className="size-5" aria-hidden="true" />
						</div>

						<div className="min-w-0 flex-1">
							<p className="text-sm font-medium text-slate-500">
								{metric.label}
							</p>
							<div className="mt-1 flex items-end gap-2">
								<p className="text-2xl font-bold leading-none text-slate-900">
									{metric.value}
								</p>
								{metric.trend ? (
									<span
										className={cn(
											"flex items-center gap-1 text-sm font-semibold",
											metric.trendClassName,
										)}
									>
										<TrendIcon className="size-3.5" aria-hidden="true" />
										{metric.trend}
									</span>
								) : null}
							</div>
						</div>
					</article>
				);
			})}
		</div>
	);
}
