import { useState } from "react";
import { Check, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import {
	exportFooterNote,
	exportFormatIcons,
	exportFormatOptions,
	exportRangeOptions,
} from "./data";
import { ExportCardShell } from "./export-card-shell";

export function ExportControlsSection() {
	const [selectedFormat, setSelectedFormat] = useState<"json" | "csv">("json");
	const FooterIcon = exportFooterNote.icon;

	return (
		<ExportCardShell title="Export Format">
			<div className="space-y-8">
				<div className="space-y-4">
					{exportFormatOptions.map((option) => {
						const Icon = exportFormatIcons[option.id];
						const isSelected = selectedFormat === option.id;

						return (
							<button
								key={option.id}
								type="button"
								onClick={() => setSelectedFormat(option.id)}
								className={cn(
									"flex w-full items-start gap-4 rounded-lg border px-4 py-4 text-left transition-colors",
									isSelected
										? "border-primary bg-primary/3 shadow-[0_0_0_1px_color-mix(in_srgb,var(--primary)_12%,transparent)]"
										: "border-slate-200 bg-white hover:border-slate-300",
								)}
							>
								<div
									className={cn(
										"mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors",
										isSelected
											? "border-primary bg-primary text-white shadow-[0_8px_16px_color-mix(in_srgb,var(--primary)_20%,transparent)]"
											: "border-slate-300 bg-white text-transparent",
									)}
								>
									<Check className="size-3.5" aria-hidden="true" />
								</div>
								<div className="min-w-0 flex-1">
									<div className="flex items-start justify-between gap-3">
										<div className="flex min-w-0 items-center gap-2">
											<h3 className="text-base font-semibold tracking-[-0.03em] text-slate-950">
												{option.title}
											</h3>
										</div>
										<span className="rounded-sm bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">
											{option.extension}
										</span>
									</div>
									<p className="mt-2 max-w-md text-sm leading-7 text-slate-500">
										{option.description}
									</p>
								</div>
							</button>
						);
					})}
				</div>

				<div className="space-y-3">
					<div className="flex items-center gap-2">
						<h3 className="text-xl leading-tight font-semibold tracking-[-0.03em] text-slate-950">
							Date Range
						</h3>
						<span className="text-xl leading-tight tracking-[-0.03em] text-slate-400">
							(Optional)
						</span>
					</div>

					<Select defaultValue="all-time">
						<SelectTrigger className="h-12! w-full rounded-md border-slate-200 bg-white px-4 text-base font-semibold text-slate-700 shadow-none">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{exportRangeOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<p className="text-base leading-7 text-slate-500">
						Export all data from the beginning.
					</p>
				</div>

				<div className="space-y-4">
					<Button className="h-12 w-full rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-[0_16px_30px_color-mix(in_srgb,var(--primary)_28%,transparent)] hover:brightness-95">
						<Download className="size-5" aria-hidden="true" />
						Export Data
					</Button>

					<div className="flex items-center justify-center gap-2 text-slate-500">
						<FooterIcon className="size-4 shrink-0" aria-hidden="true" />
						<p className="text-sm font-semibold">{exportFooterNote.text}</p>
					</div>
				</div>
			</div>
		</ExportCardShell>
	);
}
