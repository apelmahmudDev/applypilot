import type { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type {
	DashboardJob,
	DashboardJobStatus,
} from "@/modules/dashboard/types";

const statusStyles: Record<DashboardJobStatus, string> = {
	Applied: "bg-blue-50 text-blue-600",
	Interview: "bg-orange-50 text-orange-600",
	Saved: "bg-slate-100 text-slate-600",
	Rejected: "bg-red-50 text-red-600",
	Offer: "bg-emerald-50 text-emerald-600",
};

export const dashboardColumns: ColumnDef<DashboardJob>[] = [
	{
		accessorKey: "title",
		header: "",
		cell: ({ row }) => {
			const job = row.original;
			return (
				<div className="flex min-w-[260px] items-center gap-4">
					<CompanyMark brand={job.brand} />
					<div className="min-w-0">
						<p className="truncate text-sm font-bold text-slate-950">
							{job.title}
						</p>
						<p className="truncate text-xs font-semibold text-slate-700">
							{job.company} - {job.location}
						</p>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "status",
		header: "",
		cell: ({ row }) => (
			<span
				className={cn(
					"inline-flex min-w-20 justify-center rounded-md px-3 py-1 text-xs font-bold",
					statusStyles[row.original.status],
				)}
			>
				{row.original.status}
			</span>
		),
		filterFn: (row, id, value) => {
			if (value === "all") {
				return true;
			}

			return String(row.getValue(id)).toLowerCase() === value;
		},
	},
	{
		accessorKey: "deadline",
		header: "",
		cell: ({ row }) => (
			<div className="min-w-24">
				<p className="text-xs font-semibold text-slate-500">Deadline</p>
				<p className="mt-1 text-xs font-bold text-slate-950">
					{row.original.deadline}
				</p>
			</div>
		),
	},
	{
		accessorKey: "followUp",
		header: "",
		cell: ({ row }) => (
			<div className="min-w-24">
				<p className="text-xs font-semibold text-slate-500">Follow-up</p>
				<p className="mt-1 text-xs font-bold text-slate-950">
					{row.original.followUp}
				</p>
			</div>
		),
	},
	{
		id: "actions",
		header: "",
		cell: () => (
			<div className="flex items-center justify-end gap-2">
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					className="text-slate-600 hover:bg-slate-100 hover:text-slate-950"
					aria-label="Edit job"
					title="Edit"
				>
					<Pencil className="size-4" aria-hidden="true" />
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
							<MoreVertical className="size-4" aria-hidden="true" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem>Edit</DropdownMenuItem>
						<DropdownMenuItem>Open Job Link</DropdownMenuItem>
						<DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		),
	},
];

function CompanyMark({ brand }: { brand: DashboardJob["brand"] }) {
	if (brand === "microsoft") {
		return (
			<div className="grid size-8 shrink-0 grid-cols-2 gap-0.5 rounded-md bg-white p-1 shadow-sm">
				<span className="bg-red-500" />
				<span className="bg-green-500" />
				<span className="bg-blue-500" />
				<span className="bg-yellow-400" />
			</div>
		);
	}

	const content = {
		google: "G",
		swiggy: "S",
		amazon: "a",
		zomato: "zomato",
	}[brand];

	return (
		<div
			className={cn(
				"flex size-8 shrink-0 items-center justify-center rounded-md text-sm font-black",
				brand === "google" && "bg-white text-blue-600 shadow-sm",
				brand === "swiggy" && "bg-orange-500 text-white",
				brand === "amazon" && "bg-white text-slate-950 shadow-sm",
				brand === "zomato" && "bg-red-500 text-[9px] text-white",
			)}
		>
			{content}
		</div>
	);
}
