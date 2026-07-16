import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

import { cn } from "@/lib/utils";

type StatItemProps = {
	icon: ComponentType<LucideProps>;
	value: string;
	label: string;
	bordered?: boolean;
	isDarkMode: boolean;
};

export function StatItem({
	icon: Icon,
	value,
	label,
	bordered = false,
	isDarkMode,
}: StatItemProps) {
	return (
		<div
			className={cn(
				"flex min-w-0 items-center justify-center gap-3 px-2.5 py-1.5 text-left",
				bordered && "border-l border-border/60",
			)}
		>
			<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F5F3FF] text-[#5B55D6] dark:bg-primary/15 dark:text-primary">
				<Icon className="size-4" aria-hidden="true" />
			</div>
			<div className="min-w-0 space-y-1">
				<p className="text-lg font-semibold leading-none tracking-[-0.02em] text-foreground">
					{value}
				</p>
				<p className="truncate text-xs font-medium text-muted-foreground">
					{label}
				</p>
			</div>
		</div>
	);
}
