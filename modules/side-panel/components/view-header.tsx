import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ViewHeaderProps = {
	title: string;
	isDarkMode: boolean;
	onBack: () => void;
};

export function ViewHeader({ title, isDarkMode, onBack }: ViewHeaderProps) {
	return (
		<div className="mb-4 flex shrink-0 items-center gap-2">
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				className={cn(
					"-ml-1",
					isDarkMode
						? "text-slate-300 hover:bg-[#303032] hover:text-white"
						: "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
				)}
				aria-label="Back"
				title="Back"
				onClick={onBack}
			>
				<ArrowLeft className="size-4" aria-hidden="true" />
			</Button>
			<h2 className={cn("text-base font-bold", isDarkMode ? "text-white" : "text-slate-950")}>
				{title}
			</h2>
		</div>
	);
}
