import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ExportCardShellProps = {
	title: string;
	children: ReactNode;
};

export function ExportCardShell({ title, children }: ExportCardShellProps) {
	return (
		<Card className="gap-0 rounded-md border-slate-100 bg-white py-0 shadow-none dark:border-none dark:bg-card">
			<CardHeader className="px-6 pt-6 pb-4">
				<CardTitle className="text-xl leading-tight font-semibold tracking-[-0.03em] text-slate-950 dark:text-foreground">
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent className="px-6 pb-6">{children}</CardContent>
		</Card>
	);
}
