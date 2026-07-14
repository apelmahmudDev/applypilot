import { cn } from "@/lib/utils";

import { exportInfoItems } from "./data";
import { ExportCardShell } from "./export-card-shell";

export function ExportInfoSection() {
	return (
		<ExportCardShell title="Important to know">
			<div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
				{exportInfoItems.map((item) => {
					const Icon = item.icon;

					return (
						<div key={item.id} className="flex items-start gap-4">
							<div
								className={cn(
									"flex size-14 shrink-0 items-center justify-center rounded-full",
									item.iconClassName,
								)}
							>
								<Icon className="size-5" aria-hidden="true" />
							</div>
							<div className="min-w-0">
								<h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-foreground">
									{item.title}
								</h3>
								<p className="mt-2 text-base leading-6 text-slate-500 dark:text-muted-foreground">
									{item.description}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</ExportCardShell>
	);
}
