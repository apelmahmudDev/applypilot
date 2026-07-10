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
				bordered && (isDarkMode ? "border-l border-slate-700/65" : "border-l border-slate-100"),
			)}
		>
			<div
				className={cn(
					"flex size-8 shrink-0 items-center justify-center rounded-lg",
					isDarkMode ? "bg-blue-500/15 text-blue-200" : "bg-blue-50 text-blue-600",
				)}
			>
				<Icon className="size-4" aria-hidden="true" />
			</div>
			<div className="min-w-0">
				<p className={cn("text-lg font-bold leading-5", isDarkMode ? "text-white" : "text-slate-950")}>{value}</p>
				<p className={cn("truncate text-[11px] font-semibold", isDarkMode ? "text-slate-400" : "text-slate-500")}>{label}</p>
			</div>
		</div>
	);
}
