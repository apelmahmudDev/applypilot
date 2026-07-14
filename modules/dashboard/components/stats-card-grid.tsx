import { MoveUpRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type StatsCardItem = {
	label: string;
	value: string;
	description: string;
	trend?: string;
	icon: LucideIcon;
	accentClassName: string;
	trendClassName?: string;
};

type StatsCardGridProps = {
	stats: StatsCardItem[];
	className?: string;
	layout?: "default" | "value-first";
	showDescription?: boolean;
};

export function StatsCardGrid({
	stats,
	className,
	layout = "default",
	showDescription = true,
}: StatsCardGridProps) {
	return (
		<div
			className={cn(
				"grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4",
				className,
			)}
		>
			{stats.map((stat) => {
				const Icon = stat.icon;
				const isValueFirst = layout === "value-first";

				return (
					<article
						key={stat.label}
						className="flex items-center gap-4 rounded-md border border-slate-100 bg-white p-4 dark:border-none dark:bg-card"
					>
						<div
							className={cn(
								"flex size-12 shrink-0 items-center justify-center rounded-full",
								stat.accentClassName,
							)}
						>
							<Icon className="size-5" aria-hidden="true" />
						</div>

						<div className="min-w-0 flex-1">
							{isValueFirst ? (
								<>
									<p className="text-2xl font-bold leading-tight text-slate-900 dark:text-foreground">
										{stat.value}
									</p>
									<p className="mt-1 text-sm font-medium text-slate-500 dark:text-muted-foreground">
										{stat.label}
									</p>
								</>
							) : (
								<>
									<p className="text-sm font-medium text-slate-500 dark:text-muted-foreground">
										{stat.label}
									</p>
									<p className="text-2xl font-bold leading-tight text-slate-900 dark:text-foreground">
										{stat.value}
									</p>
								</>
							)}
							<div className="mt-1 flex items-center justify-between gap-2">
								{showDescription ? (
									<p className="text-xs text-slate-400 dark:text-muted-foreground/80">
										{stat.description}
									</p>
								) : (
									<span />
								)}
								{stat.trend ? (
									<span
										className={cn(
											"flex items-center gap-0.5 text-xs font-semibold dark:brightness-125",
											stat.trendClassName,
										)}
									>
										<MoveUpRight className="size-3" aria-hidden="true" />
										{stat.trend}
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
