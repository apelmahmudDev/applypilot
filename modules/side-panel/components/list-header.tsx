import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type ListHeaderProps = {
	title: string;
	isDarkMode: boolean;
	onViewAll: () => void;
};

export function ListHeader({ title, isDarkMode, onViewAll }: ListHeaderProps) {
	return (
		<div className="flex items-center justify-between px-1 pt-1">
			<h2 className={cn("text-base font-bold tracking-normal", isDarkMode ? "text-white" : "text-slate-950")}>{title}</h2>
			<button
				type="button"
				className={cn(
					"flex h-7 items-center gap-1 rounded-md px-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-500/20",
					isDarkMode
						? "text-blue-300 hover:bg-[#303032] hover:text-blue-200"
						: "text-blue-600 hover:bg-blue-50 hover:text-blue-700",
				)}
				onClick={onViewAll}
			>
				View all
				<ChevronRight className="size-3" aria-hidden="true" />
			</button>
		</div>
	);
}
