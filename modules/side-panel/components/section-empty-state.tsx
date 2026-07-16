import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type SectionEmptyStateProps = {
	icon: LucideIcon;
	title: string;
	description: string;
	className?: string;
};

export function SectionEmptyState({
	icon: Icon,
	title,
	description,
	className,
}: SectionEmptyStateProps) {
	return (
		<div className={cn("px-4 py-5", className)}>
			<div
				className={cn(
					"mx-auto flex max-w-[260px] flex-col items-center text-center",
					"text-muted-foreground",
				)}
			>
				<Icon className="mb-2 size-4 text-primary/80" aria-hidden="true" />
				<h3 className="text-sm font-bold text-foreground">{title}</h3>
				<p className="mt-1.5 text-xs leading-5 text-muted-foreground">
					{description}
				</p>
			</div>
		</div>
	);
}
