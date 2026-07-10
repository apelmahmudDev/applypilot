import { cn } from "@/lib/utils";

type DetailLineProps = {
	label: string;
	value: string;
	isDarkMode: boolean;
};

export function DetailLine({ label, value, isDarkMode }: DetailLineProps) {
	return (
		<div className="flex items-center justify-between gap-3 py-1.5">
			<span className={cn("text-xs font-semibold", isDarkMode ? "text-slate-500" : "text-slate-400")}>
				{label}
			</span>
			<span className={cn("min-w-0 truncate text-right text-xs font-medium", isDarkMode ? "text-slate-200" : "text-slate-700")}>
				{value}
			</span>
		</div>
	);
}
