import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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
import type { ApplicationsOverTimePoint } from "@/modules/dashboard/data/dashboard-analytics";
import { AnalyticsSectionCard } from "./analytics-section-card";

const chartConfig = {
	applications: {
		label: "Applications",
		color: "#2563eb",
	},
} satisfies ChartConfig;

type ApplicationsOverTimeChartProps = {
	data: ApplicationsOverTimePoint[];
};

export function ApplicationsOverTimeChart({
	data,
}: ApplicationsOverTimeChartProps) {
	return (
		<AnalyticsSectionCard
			title="Applications Over Time"
			className="lg:col-span-1 xl:col-span-7"
			action={
				<Select defaultValue="weekly">
					<SelectTrigger className="h-9 w-28 bg-white text-sm font-medium shadow-none dark:border-border dark:bg-card">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="weekly">Weekly</SelectItem>
					</SelectContent>
				</Select>
			}
		>
			<ChartContainer config={chartConfig} className="h-[250px] w-full">
				<LineChart
					data={data}
					accessibilityLayer={false}
					margin={{ top: 10, right: 12, left: -18, bottom: 0 }}
				>
					<CartesianGrid vertical={false} strokeDasharray="3 3" />
					<XAxis
						dataKey="label"
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
					<Line
						type="monotone"
						dataKey="applications"
						stroke="var(--color-applications)"
						strokeWidth={3}
						dot={{
							r: 4,
							fill: "#2563eb",
							stroke: "#2563eb",
						}}
						activeDot={{
							r: 5,
							fill: "#2563eb",
							stroke: "#ffffff",
							strokeWidth: 2,
						}}
					/>
				</LineChart>
			</ChartContainer>
		</AnalyticsSectionCard>
	);
}
