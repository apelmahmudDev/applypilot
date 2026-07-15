import { ChevronRight } from "lucide-react";

type ListHeaderProps = {
	title: string;
	isDarkMode: boolean;
	onViewAll: () => void;
};

export function ListHeader({ title, isDarkMode, onViewAll }: ListHeaderProps) {
	return (
		<div className="flex items-center justify-between px-1 pt-1">
			<h2 className="text-sm font-bold text-foreground">{title}</h2>
			<button
				type="button"
				className="flex h-7 items-center gap-1 rounded-sm px-2.5 text-xs font-semibold text-primary transition hover:bg-muted/60 hover:opacity-90 focus-visible:outline-none focus-visible:ring-3"
				onClick={onViewAll}
			>
				View all
				<ChevronRight className="size-3" aria-hidden="true" />
			</button>
		</div>
	);
}
