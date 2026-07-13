import { Pie, PieChart } from "recharts";

import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
import { applicationsByStatusData } from "./analytics-data";
import { AnalyticsSectionCard } from "./analytics-section-card";

const chartConfig = {
	Applied: { label: "Applied", color: "#2563eb" },
	Interview: { label: "Interview", color: "#8b5cf6" },
	Offer: { label: "Offer", color: "#f59e0b" },
	Rejected: { label: "Rejected", color: "#ef4444" },
} satisfies ChartConfig;

const totalApplications = applicationsByStatusData.reduce(
	(sum, item) => sum + item.value,
	0,
);

export function ApplicationsByStatusChart() {
	return (
		<AnalyticsSectionCard
			title="Applications by Status"
			className="lg:col-span-1 xl:col-span-4"
		>
			<div className="grid gap-6 min-[1900px]:grid-cols-[260px_minmax(0,1fr)] min-[1900px]:items-center">
				<div className="relative mx-auto w-full max-w-[260px] min-[1900px]:mx-0 min-[1900px]:max-w-none">
					<ChartContainer
						config={chartConfig}
						className="h-[220px] w-full max-w-[260px] min-[1900px]:max-w-none"
					>
						<PieChart accessibilityLayer={false}>
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent hideLabel nameKey="name" />}
							/>
							<Pie
								data={applicationsByStatusData}
								dataKey="value"
								nameKey="name"
								cx="44%"
								cy="50%"
								innerRadius={56}
								outerRadius={88}
								paddingAngle={2}
								strokeWidth={0}
							/>
						</PieChart>
					</ChartContainer>

					<div className="absolute inset-0 flex items-center justify-center">
						<div className="flex -translate-x-[14px] flex-col items-center">
						<span className="text-4xl font-bold tracking-[-0.04em] text-slate-950">
							{totalApplications}
						</span>
						<span className="text-sm font-medium text-slate-500">Total</span>
						</div>
					</div>
				</div>

				<div className="space-y-4 min-[1900px]:pr-2">
					{applicationsByStatusData.map((item) => (
						<div
							key={item.name}
							className="flex items-center justify-between gap-4 text-sm"
						>
							<div className="flex items-center gap-3">
								<span
									className="size-3 rounded-full"
									style={{ backgroundColor: item.fill }}
								/>
								<span className="font-medium text-slate-700">{item.name}</span>
							</div>
							<span className="text-slate-500">
								{item.value} ({item.percentage})
							</span>
						</div>
					))}
				</div>
			</div>
		</AnalyticsSectionCard>
	);
}
