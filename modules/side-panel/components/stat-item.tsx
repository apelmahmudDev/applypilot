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
				"flex min-w-0 flex-col items-center justify-center gap-1 px-2 text-center min-[360px]:flex-row min-[360px]:gap-2 min-[360px]:text-left",
				bordered && "border-l border-[#E5E7EB]",
			)}
		>
			<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
				<Icon className="size-4" aria-hidden="true" />
			</div>
			<div className="min-w-0">
				<p className="text-lg font-bold leading-5 text-foreground">{value}</p>
				<p className="truncate text-[11px] font-semibold text-muted-foreground">{label}</p>
			</div>
		</div>
	);
}
