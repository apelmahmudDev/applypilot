import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { SettingsSectionConfig } from "./types";

type SettingsSectionCardProps = {
	config: SettingsSectionConfig;
	children: ReactNode;
	action?: ReactNode;
};

export function SettingsSectionCard({
	config,
	children,
	action,
}: SettingsSectionCardProps) {
	const Icon = config.icon;

	return (
		<Card className="gap-0 rounded-md border-slate-100 bg-white py-0 shadow-none">
			<CardContent className="px-6 py-6">
				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
						<div className="min-w-0">
							<div className="flex items-center gap-4">
								<div
									className={cn(
										"flex size-9 shrink-0 items-center justify-center rounded-xl pt-1",
										config.iconClassName,
									)}
								>
									<Icon className="size-5 shrink-0" aria-hidden="true" />
								</div>
								<h2 className="text-xl leading-tight font-bold tracking-[-0.03em] text-slate-950">
									{config.title}
								</h2>
							</div>
							<p className="mt-2 max-w-3xl pl-13 text-sm leading-6 text-slate-500">
								{config.description}
							</p>
						</div>

						{action ? (
							<div className="shrink-0 pl-13 lg:pl-0">{action}</div>
						) : null}
					</div>

					<div className="pl-13">{children}</div>
				</div>
			</CardContent>
		</Card>
	);
}
