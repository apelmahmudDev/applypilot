
type DetailLineProps = {
	label: string;
	value: string;
	isDarkMode: boolean;
};

export function DetailLine({ label, value, isDarkMode }: DetailLineProps) {
	return (
		<div className="flex items-center justify-between gap-3 py-1.5">
			<span className="text-xs font-semibold text-muted-foreground/80">
				{label}
			</span>
			<span className="min-w-0 truncate text-right text-xs font-medium text-muted-foreground">
				{value}
			</span>
		</div>
	);
}
