import { Bell } from "lucide-react";
import type { AriaAttributes, ComponentType, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type JobDetailsStatus = "Applied" | "Interview" | "Saved" | "Rejected" | "Offer";

const statusStyles: Record<JobDetailsStatus, string> = {
	Applied:
		"bg-emerald-50 text-emerald-600 dark:bg-emerald-500/18 dark:text-emerald-200",
	Interview:
		"bg-violet-50 text-violet-600 dark:bg-violet-500/18 dark:text-violet-200",
	Saved: "bg-blue-50 text-blue-600 dark:bg-blue-500/18 dark:text-blue-200",
	Rejected: "bg-red-50 text-red-600 dark:bg-red-500/18 dark:text-red-200",
	Offer: "bg-amber-50 text-amber-600 dark:bg-amber-500/18 dark:text-amber-200",
};

type JobDetailsContentProps = {
	brandMark: ReactNode;
	title: string;
	company: string;
	status: JobDetailsStatus;
	sections: ReactNode;
	headerMeta?: ReactNode;
	summaryActions?: ReactNode;
	className?: string;
	hideHeaderStatus?: boolean;
};

export function JobDetailsContent({
	brandMark,
	title,
	company,
	status,
	sections,
	headerMeta,
	summaryActions,
	className,
	hideHeaderStatus = false,
}: JobDetailsContentProps) {
	return (
		<div
			className={cn("flex-1 overflow-y-auto px-6 py-6", className)}
		>
			<div className="flex items-start gap-4 border-b border-slate-100 pb-6 dark:border-border/60">
				{brandMark}
				<div className="min-w-0 flex-1">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
						<div className="min-w-0">
							<h2 className="truncate text-lg font-semibold tracking-[-0.03em] text-slate-950 dark:text-foreground">
								{title}
							</h2>
							<p className="mt-1 text-base font-medium text-slate-500 dark:text-muted-foreground">
								{company}
							</p>
							{headerMeta}
						</div>
						{hideHeaderStatus ? null : (
							<span
								className={`inline-flex shrink-0 rounded-sm px-2 py-0.5 text-xs font-bold ${statusStyles[status]}`}
							>
								{status}
							</span>
						)}
					</div>
				</div>
			</div>

			{summaryActions ? <div className="mt-4">{summaryActions}</div> : null}
			<div className="space-y-8 py-6">{sections}</div>
		</div>
	);
}

type JobDetailsSectionProps = {
	title: string;
	children: ReactNode;
};

export function JobDetailsSection({
	title,
	children,
}: JobDetailsSectionProps) {
	return (
		<section className="border-b border-slate-100 pb-6 last:border-b-0 last:pb-0 dark:border-border/60">
			<h3 className="mb-4 text-base font-bold text-slate-950 dark:text-foreground">
				{title}
			</h3>
			<div className="space-y-4">{children}</div>
		</section>
	);
}

type DetailsRowProps = {
	icon: ComponentType<{
		className?: string;
		"aria-hidden"?: AriaAttributes["aria-hidden"];
	}>;
	label: string;
	value: string;
};

export function JobDetailsRow({ icon: Icon, label, value }: DetailsRowProps) {
	return (
		<div className="grid grid-cols-[24px_minmax(120px,160px)_minmax(0,1fr)] items-start gap-3">
			<Icon
				className="mt-0.5 size-4 text-slate-400 dark:text-muted-foreground"
				aria-hidden="true"
			/>
			<span className="text-sm font-medium text-slate-500 dark:text-muted-foreground">
				{label}
			</span>
			<span className="text-sm font-medium text-slate-700 dark:text-foreground/90">
				{value}
			</span>
		</div>
	);
}

export function JobDetailsReminderRow({
	reminder,
	onAddReminder,
	secondaryAction,
}: {
	reminder: string;
	onAddReminder: () => void;
	secondaryAction?: {
		label: string;
		onClick: () => void;
		disabled?: boolean;
	};
}) {
	const hasReminder = reminder !== "-";

	return (
		<div className="grid grid-cols-[24px_minmax(120px,160px)_minmax(0,1fr)] items-start gap-3">
			<Bell
				className="mt-0.5 size-4 text-slate-400 dark:text-muted-foreground"
				aria-hidden="true"
			/>
			<span className="text-sm font-medium text-slate-500 dark:text-muted-foreground">
				Reminder
			</span>
			<div className="flex flex-wrap items-center gap-3">
				<span className="text-sm font-medium text-slate-700 dark:text-foreground/90">
					{reminder}
				</span>
				<Button
					type="button"
					variant="ghost"
					className="h-auto px-0 py-0 text-sm font-semibold text-primary hover:bg-transparent hover:text-primary/80"
					onClick={onAddReminder}
				>
					{hasReminder ? "Update" : "Add reminder"}
				</Button>
				{secondaryAction ? (
					<Button
						type="button"
						variant="ghost"
						className="h-auto px-0 py-0 text-sm font-semibold text-red-600 hover:bg-transparent hover:text-red-500 dark:text-red-300 dark:hover:text-red-200"
						disabled={secondaryAction.disabled}
						onClick={secondaryAction.onClick}
					>
						{secondaryAction.label}
					</Button>
				) : null}
			</div>
		</div>
	);
}
