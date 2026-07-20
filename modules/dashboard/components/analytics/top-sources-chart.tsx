import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { TopSourcePoint } from "@/modules/dashboard/data/dashboard-analytics";
import { AnalyticsSectionCard } from "./analytics-section-card";

const chartConfig = {
	applications: {
		label: "Applications",
		color: "#2563eb",
	},
} satisfies ChartConfig;

type TopSourcesChartProps = {
	data: TopSourcePoint[];
};

export function TopSourcesChart({ data }: TopSourcesChartProps) {
	return (
		<AnalyticsSectionCard
			title="Top Sources"
			action={
				<Select defaultValue="applications">
					<SelectTrigger className="h-9 w-38 bg-white text-sm font-medium shadow-none dark:border-border dark:bg-card">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="applications">By Applications</SelectItem>
					</SelectContent>
				</Select>
			}
		>
			<ChartContainer config={chartConfig} className="h-[250px] w-full">
				<BarChart
					data={data}
					accessibilityLayer={false}
					margin={{ top: 8, right: 0, left: -18, bottom: 0 }}
				>
					<XAxis
						dataKey="source"
						axisLine={false}
						tickLine={false}
						tickMargin={12}
						interval={0}
					/>
					<YAxis axisLine={false} tickLine={false} tickMargin={12} />
					<ChartTooltip
						cursor={false}
						content={<ChartTooltipContent labelKey="applications" />}
					/>
					<Bar dataKey="applications" radius={[8, 8, 0, 0]} barSize={38}>
						{data.map((entry, index) => (
							<Cell
								key={entry.source}
								fill={index === 0 ? "#2563eb" : "#3b82f6"}
								fillOpacity={index === 0 ? 1 : 0.92}
							/>
						))}
					</Bar>
				</BarChart>
			</ChartContainer>
		</AnalyticsSectionCard>
	);
}
