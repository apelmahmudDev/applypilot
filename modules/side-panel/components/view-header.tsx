import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

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
				className="-ml-1 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
				aria-label="Back"
				title="Back"
				onClick={onBack}
			>
				<ArrowLeft className="size-4" aria-hidden="true" />
			</Button>
			<h2 className="text-base font-bold text-foreground">
				{title}
			</h2>
		</div>
	);
}
