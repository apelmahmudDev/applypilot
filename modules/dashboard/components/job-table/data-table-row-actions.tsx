"use client";

import { Eye, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
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
				<DropdownMenuContent align="end">
					<DropdownMenuItem>Edit</DropdownMenuItem>
					<DropdownMenuItem>Open Job Link</DropdownMenuItem>
					<DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
