import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

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
			<div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
				<Icon
					className={isLoading ? "size-5 animate-spin" : "size-5"}
					aria-hidden="true"
				/>
			</div>
			<div className="min-w-0 flex-1">
				<h3 className="text-sm font-semibold text-foreground">{title}</h3>
				<p className="mt-1 text-xs leading-5 text-muted-foreground">
					{description}
				</p>
			</div>
		</div>
	);
}
