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

export function DataTableRowActions() {
	return (
		<div className="flex min-w-[76px] items-center justify-end gap-1">
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				className="text-slate-500 hover:bg-slate-100 hover:text-slate-950"
				aria-label="View job details"
				title="View details"
			>
				<Eye className="size-4" aria-hidden="true" />
			</Button>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						className="text-slate-500 hover:bg-slate-100 hover:text-slate-950"
						aria-label="More job actions"
						title="More actions"
					>
						<MoreHorizontal className="size-4" aria-hidden="true" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5">
					<DropdownMenuItem className="gap-2.5 rounded-lg py-2 font-medium">
						<FilePenLine className="size-4" aria-hidden="true" />
						Edit job
					</DropdownMenuItem>
					<DropdownMenuItem className="gap-2.5 rounded-lg py-2 font-medium">
						<Link2 className="size-4" aria-hidden="true" />
						Open original
					</DropdownMenuItem>
					<DropdownMenuItem className="gap-2.5 rounded-lg py-2 font-medium">
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
					>
						<Trash2 className="size-4" aria-hidden="true" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
