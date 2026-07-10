import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

import { cn } from "@/lib/utils";

type DetectionMessageProps = {
	icon: ComponentType<LucideProps>;
	title: string;
	description: string;
	isDarkMode: boolean;
	isLoading?: boolean;
};

export function DetectionMessage({
	icon: Icon,
	title,
	description,
	isDarkMode,
	isLoading = false,
}: DetectionMessageProps) {
	return (
		<div className="flex items-start gap-3">
			<div
				className={cn(
					"flex size-11 shrink-0 items-center justify-center rounded-lg",
					isDarkMode
						? "bg-indigo-500/15 text-indigo-200"
						: "bg-blue-50 text-blue-600",
				)}
			>
				<Icon
					className={cn("size-5", isLoading && "animate-spin")}
					aria-hidden="true"
				/>
			</div>
			<div className="min-w-0 flex-1">
				<h3
					className={cn(
						"text-sm font-semibold",
						isDarkMode ? "text-white" : "text-slate-950",
					)}
				>
					{title}
				</h3>
				<p
					className={cn(
						"mt-1 text-xs leading-5",
						isDarkMode ? "text-slate-400" : "text-slate-500",
					)}
				>
					{description}
				</p>
			</div>
		</div>
	);
}
