import type { ColumnDef } from "@tanstack/react-table";
import { Bell, Globe } from "lucide-react";

import { cn } from "@/lib/utils";
import type {
	DashboardJob,
	DashboardJobStatus,
} from "@/modules/dashboard/types";
import { DataTableRowActions } from "./data-table-row-actions";

const statusStyles: Record<DashboardJobStatus, string> = {
	Applied: "bg-emerald-50 text-emerald-600",
	Interview: "bg-violet-50 text-violet-600",
	Saved: "bg-blue-50 text-blue-600",
	Rejected: "bg-red-50 text-red-600",
	Offer: "bg-amber-50 text-amber-600",
};

export const dashboardColumns: ColumnDef<DashboardJob>[] = [
	{
		accessorKey: "title",
		header: "Job Title",
		cell: ({ row }) => {
			const job = row.original;
			return (
				<div className="min-w-[220px]">
					<p className="truncate text-sm font-bold text-slate-950">
						{job.title}
					</p>
					<p className="mt-1 truncate text-xs font-medium text-slate-500">
						{job.jobType}
					</p>
				</div>
			);
		},
	},
	{
		accessorKey: "company",
		header: "Company",
		cell: ({ row }) => {
			const job = row.original;
			return (
				<div className="flex min-w-[150px] items-center gap-3">
					<CompanyMark brand={job.brand} />
					<p className="truncate text-sm font-semibold text-slate-900">
						{job.company}
					</p>
				</div>
			);
		},
	},
	{
		accessorKey: "location",
		header: "Location",
		cell: ({ row }) => {
			const job = row.original;
			return (
				<div className="min-w-[150px]">
					<p className="text-sm font-semibold text-slate-900">{job.location}</p>
					<p className="mt-1 text-xs font-medium text-slate-500">
						{job.workMode}
					</p>
				</div>
			);
		},
	},
	{
		accessorKey: "source",
		header: "Source",
		cell: ({ row }) => (
			<div className="flex min-w-12 items-center">
				{row.original.source === "LinkedIn" ? (
					<span className="inline-flex size-4 items-center justify-center rounded-[3px] bg-[#16a34a] text-[9px] font-black text-white">
						in
					</span>
				) : (
					<Globe className="size-4 text-slate-600" />
				)}
			</div>
		),
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => (
			<span
				className={cn(
					"inline-flex min-w-20 justify-center rounded-full px-3 py-1 text-xs font-bold",
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
		accessorKey: "appliedDate",
		header: "Applied Date",
		cell: ({ row }) => (
			<p className="min-w-[110px] text-sm font-medium text-slate-700">
				{row.original.appliedDate}
			</p>
		),
	},
	{
		accessorKey: "reminder",
		header: "Reminder",
		cell: ({ row }) => (
			<div className="min-w-[90px]">
				{row.original.reminder === "-" ? (
					<span className="text-sm font-medium text-slate-400">-</span>
				) : (
					<span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-500">
						<Bell className="size-3.5" />
						{row.original.reminder}
					</span>
				)}
			</div>
		),
	},
	{
		id: "actions",
		header: () => (
			<div className="flex min-w-[76px] justify-end text-right">Actions</div>
		),
		cell: () => <DataTableRowActions />,
	},
];

function CompanyMark({ brand }: { brand: DashboardJob["brand"] }) {
	const content = {
		figma: {
			label: "F",
			className:
				"bg-gradient-to-br from-orange-500 via-pink-500 to-blue-500 text-white",
		},
		vercel: {
			label: "V",
			className: "bg-black text-white",
		},
		airbnb: {
			label: "A",
			className: "bg-rose-500 text-white",
		},
		hubspot: {
			label: "H",
			className: "bg-orange-500 text-white",
		},
		notion: {
			label: "N",
			className: "bg-white text-black shadow-sm ring-1 ring-slate-300",
		},
		spotify: {
			label: "S",
			className: "bg-green-500 text-white",
		},
		linear: {
			label: "L",
			className: "bg-slate-950 text-white",
		},
		calendly: {
			label: "C",
			className: "bg-blue-600 text-white",
		},
		plaid: {
			label: "P",
			className: "bg-black text-white",
		},
		canva: {
			label: "C",
			className: "bg-cyan-500 text-white",
		},
	}[brand];

	return (
		<div
			className={cn(
				"flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-black",
				content.className,
			)}
		>
			{content.label}
		</div>
	);
}
