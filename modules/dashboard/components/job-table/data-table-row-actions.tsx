"use client";

import {
	Archive,
	Bell,
	Eye,
	FilePenLine,
	Link2,
	MoreHorizontal,
	Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DashboardJob } from "@/modules/dashboard/types";

type DataTableRowActionsProps = {
	job: DashboardJob;
	onViewDetails?: (job: DashboardJob) => void;
	onSetReminder?: (job: DashboardJob) => void;
	onEditJob?: (job: DashboardJob) => void;
	onDeleteJob?: (job: DashboardJob) => void;
};

export function DataTableRowActions({
	job,
	onViewDetails,
	onSetReminder,
	onEditJob,
	onDeleteJob,
}: DataTableRowActionsProps) {
	const canOpenOriginal = Boolean(job.source.url);

	const handleOpenOriginal = () => {
		if (!job.source.url) {
			return;
		}

		const extensionChrome = globalThis as typeof globalThis & {
			chrome?: {
				tabs?: {
					create: (options: { url: string }) => void;
				};
			};
		};

		if (extensionChrome.chrome?.tabs?.create) {
			extensionChrome.chrome.tabs.create({ url: job.source.url });
			return;
		}

		window.open(job.source.url, "_blank", "noopener,noreferrer");
	};

	return (
		<div className="flex min-w-[76px] items-center justify-end gap-1">
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				className="text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground"
				aria-label="View job details"
				title="View details"
				onClick={() => onViewDetails?.(job)}
			>
				<Eye className="size-4" aria-hidden="true" />
			</Button>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						className="text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground"
						aria-label="More job actions"
						title="More actions"
					>
						<MoreHorizontal className="size-4" aria-hidden="true" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5">
					<DropdownMenuItem
						className="gap-2.5 rounded-lg py-2 font-medium"
						onClick={() => onEditJob?.(job)}
					>
						<FilePenLine className="size-4" aria-hidden="true" />
						Edit job
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2.5 rounded-lg py-2 font-medium"
						disabled={!canOpenOriginal}
						onClick={handleOpenOriginal}
					>
						<Link2 className="size-4" aria-hidden="true" />
						Open original
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2.5 rounded-lg py-2 font-medium"
						onClick={() => onSetReminder?.(job)}
					>
						<Bell className="size-4" aria-hidden="true" />
						Set reminder
					</DropdownMenuItem>
					<DropdownMenuItem className="gap-2.5 rounded-lg py-2 font-medium">
						<Archive className="size-4" aria-hidden="true" />
						Archive
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						variant="destructive"
						className="gap-2.5 rounded-lg py-2 font-medium"
						onClick={() => onDeleteJob?.(job)}
					>
						<Trash2 className="size-4" aria-hidden="true" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
