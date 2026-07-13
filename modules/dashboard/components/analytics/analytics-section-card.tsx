import type { ReactNode } from "react";

import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AnalyticsSectionCardProps = {
	title: string;
	action?: ReactNode;
	children: ReactNode;
	className?: string;
	contentClassName?: string;
};

export function AnalyticsSectionCard({
	title,
	action,
	children,
	className,
	contentClassName,
}: AnalyticsSectionCardProps) {
	return (
		<Card
			className={cn(
				"gap-0 rounded-md border-slate-100 bg-white py-0 shadow-none",
				className,
			)}
		>
			<CardHeader className="px-5 pt-5 pb-4">
				<CardTitle className="text-lg font-semibold text-slate-900">
					{title}
				</CardTitle>
				{action ? <CardAction>{action}</CardAction> : null}
			</CardHeader>
			<CardContent className={cn("px-5 pb-5", contentClassName)}>
				{children}
			</CardContent>
		</Card>
	);
}
