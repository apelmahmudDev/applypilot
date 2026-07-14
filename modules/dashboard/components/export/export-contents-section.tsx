import { CircleCheckBig } from "lucide-react";

import { cn } from "@/lib/utils";

import { exportItems, exportPrivacyNote } from "./data";
import { ExportCardShell } from "./export-card-shell";

export function ExportContentsSection() {
	const PrivacyIcon = exportPrivacyNote.icon;

	return (
		<ExportCardShell title="What will be exported">
			<div className="space-y-4">
				{exportItems.map((item) => {
					const Icon = item.icon;

					return (
						<div
							key={item.id}
							className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0 dark:border-border/60"
						>
							<div className="flex min-w-0 items-start gap-4">
								<div
									className={cn(
										"flex size-14 shrink-0 items-center justify-center rounded-lg",
										item.iconClassName,
									)}
								>
									<Icon className="size-6" aria-hidden="true" />
								</div>
								<div className="min-w-0">
									<h3 className="text-base font-medium tracking-[-0.03em] text-slate-950 dark:text-foreground">
										{item.title}
									</h3>
									<p className="mt-1 text-sm leading-7 text-slate-500 dark:text-muted-foreground">
										{item.description}
									</p>
								</div>
							</div>

							<CircleCheckBig
								className="mt-1 size-5 shrink-0 text-emerald-500"
								aria-hidden="true"
							/>
						</div>
					);
				})}

				<div className="flex items-center gap-3 pt-3 text-emerald-600 dark:text-emerald-300">
					<PrivacyIcon className="size-5 shrink-0" aria-hidden="true" />
					<p className="text-base font-semibold">{exportPrivacyNote.text}</p>
				</div>
			</div>
		</ExportCardShell>
	);
}
