import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from "recharts";

import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
import type { ApplicationFunnelPoint } from "@/modules/dashboard/data/dashboard-analytics";
import { AnalyticsSectionCard } from "./analytics-section-card";

const chartConfig = {
	value: {
		label: "Applications",
		color: "#c7d7ff",
	},
} satisfies ChartConfig;

type ApplicationFunnelChartProps = {
	data: ApplicationFunnelPoint[];
};

export function ApplicationFunnelChart({ data }: ApplicationFunnelChartProps) {
	const maxValue = Math.max(...data.map((item) => item.value), 0);

	return (
		<AnalyticsSectionCard
			title="Application Funnel"
			className="lg:col-span-1 xl:col-span-5"
		>
			<ChartContainer config={chartConfig} className="h-[250px] w-full">
				<BarChart
					data={data}
					accessibilityLayer={false}
					layout="vertical"
					margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
					barCategoryGap={12}
				>
					<XAxis type="number" hide domain={[0, Math.max(maxValue, 1)]} />
					<YAxis
						dataKey="stage"
						type="category"
						axisLine={false}
						tickLine={false}
						tickMargin={18}
						width={64}
					/>
					<ChartTooltip
						cursor={false}
						content={<ChartTooltipContent hideLabel />}
					/>
					<Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={30}>
						<LabelList
							dataKey="value"
							position="right"
							content={({ x = 0, y = 0, width = 0, height = 0, value, index }) => {
								const percentage =
									typeof index === "number"
										? data[index]?.percentage
										: undefined;

								return (
									<text
										x={Number(x) + Number(width) + 12}
										y={Number(y) + Number(height) / 2}
										dominantBaseline="middle"
										className="fill-slate-600 text-xs font-medium dark:fill-muted-foreground"
									>
										{`${value} (${percentage ?? 0}%)`}
									</text>
								);
							}}
						/>
						{data.map((entry) => (
							<Cell key={entry.stage} fill={entry.fill} />
						))}
					</Bar>
				</BarChart>
			</ChartContainer>
		</AnalyticsSectionCard>
	);
}
