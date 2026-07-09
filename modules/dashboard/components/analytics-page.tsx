import { Circle } from "lucide-react";

import { cn } from "@/lib/utils";
import { analyticsMonthlyActivity } from "@/modules/dashboard/mock-data";

const overviewStats = [
	{ label: "Total Jobs", value: "42" },
	{ label: "Applied", value: "18" },
	{ label: "Interview", value: "4" },
	{ label: "Offers", value: "1" },
];

const funnelSteps = [
	{ label: "Saved", value: "42", className: "w-full bg-blue-500" },
	{ label: "Applied", value: "18", className: "w-[82%] bg-orange-400" },
	{ label: "Interview", value: "4", className: "w-[58%] bg-emerald-400" },
	{ label: "Offer", value: "1", className: "w-[36%] bg-emerald-500" },
];

const chartLines = [
	{
		label: "Saved",
		color: "#2563eb",
		points: "0,114 90,70 180,84 270,70 360,84 450,66 540,78 630,48 720,84 810,64",
	},
	{
		label: "Applied",
		color: "#fb923c",
		points: "0,130 90,104 180,120 270,100 360,120 450,104 540,104 630,128 720,124 810,110",
	},
	{
		label: "Interview",
		color: "#34d399",
		points: "0,144 90,128 180,134 270,130 360,140 450,134 540,136 630,144 720,142 810,134",
	},
	{
		label: "Offer",
		color: "#a78bfa",
		points: "0,152 90,150 180,151 270,150 360,152 450,150 540,151 630,150 720,152 810,150",
	},
];

export function AnalyticsPage() {
	return (
		<div className="space-y-5">
			<h2 className="text-sm font-bold text-slate-950">Application Overview</h2>

			<section className="grid grid-cols-4 gap-5">
				{overviewStats.map((stat) => (
					<article
						key={stat.label}
						className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.04)]"
					>
						<p className="text-xs font-bold text-slate-700">{stat.label}</p>
						<p className="mt-4 text-3xl font-bold tracking-normal text-slate-950">
							{stat.value}
						</p>
					</article>
				))}
			</section>

			<section className="grid grid-cols-[1.15fr_1fr] gap-5">
				<article className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
					<h3 className="text-sm font-bold text-slate-950">
						Application Funnel
					</h3>
					<div className="mt-6 grid grid-cols-[minmax(0,1fr)_120px] items-center gap-6">
						<div className="space-y-1">
							{funnelSteps.map((step) => (
								<div
									key={step.label}
									className={cn(
										"mx-auto h-12 shadow-sm",
										step.className,
										"[clip-path:polygon(10%_0,90%_0,78%_100%,22%_100%)]",
									)}
								/>
							))}
						</div>
						<div className="space-y-[26px]">
							{funnelSteps.map((step) => (
								<div
									key={step.label}
									className="flex items-center justify-between gap-5 text-xs"
								>
									<span className="font-bold text-blue-500">{step.label}</span>
									<span className="font-bold text-slate-900">{step.value}</span>
								</div>
							))}
						</div>
					</div>
				</article>

				<article className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
					<h3 className="text-sm font-bold text-slate-950">Success Rates</h3>
					<div className="mt-7 flex items-center justify-center gap-10">
						<div className="relative size-36 rounded-full bg-[conic-gradient(#2563eb_0_25%,#34d399_25%_31%,#e5e7eb_31%_100%)]">
							<div className="absolute inset-5 rounded-full bg-white" />
						</div>
						<div className="space-y-5">
							<RateItem
								color="bg-blue-600"
								label="Interview Rate"
								value="22.22%"
							/>
							<RateItem
								color="bg-emerald-400"
								label="Offer Rate"
								value="5.56%"
							/>
						</div>
					</div>
				</article>
			</section>

			<section className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
				<div className="flex items-center justify-between">
					<h3 className="text-sm font-bold text-slate-950">Monthly Activity</h3>
					<div className="flex items-center gap-5">
						{chartLines.map((line) => (
							<div
								key={line.label}
								className="flex items-center gap-1.5 text-xs font-bold text-slate-600"
							>
								<Circle
									className="size-2.5 fill-current"
									style={{ color: line.color }}
									aria-hidden="true"
								/>
								{line.label}
							</div>
						))}
					</div>
				</div>

				<div className="mt-5 grid grid-cols-[40px_minmax(0,1fr)] gap-3">
					<div className="flex h-48 flex-col justify-between text-right text-xs font-semibold text-slate-500">
						<span>30</span>
						<span>20</span>
						<span>10</span>
						<span>0</span>
					</div>
					<div className="relative h-48">
						<div className="absolute inset-0 flex flex-col justify-between">
							{[0, 1, 2, 3].map((line) => (
								<span key={line} className="h-px bg-slate-100" />
							))}
						</div>
						<svg
							viewBox="0 0 810 160"
							className="absolute inset-0 h-full w-full overflow-visible"
							role="img"
							aria-label="Monthly application activity chart"
						>
							{chartLines.map((line) => (
								<polyline
									key={line.label}
									points={line.points}
									fill="none"
									stroke={line.color}
									strokeWidth="4"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							))}
							{chartLines.flatMap((line) =>
								line.points.split(" ").map((point) => {
									const [cx, cy] = point.split(",");
									return (
										<circle
											key={`${line.label}-${point}`}
											cx={cx}
											cy={cy}
											r="4"
											fill={line.color}
										/>
									);
								}),
							)}
						</svg>
					</div>
				</div>
				<div className="ml-[52px] mt-2 grid grid-cols-6 text-xs font-semibold text-slate-500">
					{analyticsMonthlyActivity.map((month) => (
						<span key={month}>{month}</span>
					))}
				</div>
			</section>
		</div>
	);
}

function RateItem({
	color,
	label,
	value,
}: {
	color: string;
	label: string;
	value: string;
}) {
	return (
		<div className="flex items-start gap-3">
			<span className={cn("mt-1 size-3 rounded-full", color)} />
			<div>
				<p className="text-xs font-bold text-slate-800">{label}</p>
				<p className="mt-1 text-lg font-bold text-slate-950">{value}</p>
			</div>
		</div>
	);
}
