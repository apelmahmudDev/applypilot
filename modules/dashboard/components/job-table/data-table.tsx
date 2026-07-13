import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type SortingState,
} from "@tanstack/react-table";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type {
	DashboardJob,
	DashboardStatusFilter,
} from "@/modules/dashboard/types";
import { DataTablePagination } from "./data-table-pagination";

type DataTableProps = {
	columns: ColumnDef<DashboardJob>[];
	data: DashboardJob[];
	statsSlot?: ReactNode;
};

const filters: Array<{ value: DashboardStatusFilter; label: string }> = [
	{ value: "all", label: "All (42)" },
	{ value: "saved", label: "Saved (12)" },
	{ value: "applied", label: "Applied (18)" },
	{ value: "interview", label: "Interview (4)" },
	{ value: "rejected", label: "Rejected (10)" },
	{ value: "offer", label: "Offer (1)" },
];

export function DataTable({ columns, data, statsSlot }: DataTableProps) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] =
		useState<DashboardStatusFilter>("all");

	const filteredData = useMemo(() => {
		const query = search.trim().toLowerCase();

		return data.filter((job) => {
			const matchesQuery =
				!query ||
				[job.title, job.company, job.location].some((value) =>
					value.toLowerCase().includes(query),
				);
			const matchesStatus =
				statusFilter === "all" || job.status.toLowerCase() === statusFilter;

			return matchesQuery && matchesStatus;
		});
	}, [data, search, statusFilter]);

	const table = useReactTable({
		data: filteredData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		initialState: {
			pagination: {
				pageSize: 10,
			},
		},
		state: {
			sorting,
		},
	});

	return (
		<div className="min-w-0 space-y-5 pb-8">
			{statsSlot}

			<div className="flex min-w-0 items-center justify-between gap-4">
				<Tabs
					value={statusFilter}
					onValueChange={(value) =>
						setStatusFilter(value as DashboardStatusFilter)
					}
					className="min-w-0"
				>
					<TabsList className="h-10 max-w-full bg-transparent p-0">
						{filters.map((filter) => (
							<TabsTrigger
								key={filter.value}
								value={filter.value}
								className="h-8 rounded-md px-4 text-xs font-bold text-slate-600 data-[state=active]:bg-cyan-100 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
							>
								{filter.label}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>

				<div className="flex shrink-0 items-center gap-3 text-xs font-bold text-slate-700">
					Sort by
					<Select defaultValue="latest">
						<SelectTrigger className="h-9 w-24 rounded-md border-slate-200 bg-white text-xs font-bold">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="latest">Latest</SelectItem>
							<SelectItem value="applied">Applied</SelectItem>
							<SelectItem value="company">Company</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className="border-slate-200 bg-slate-50/60"
							>
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										className="h-12 px-5 text-xs font-bold text-slate-500"
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									className="h-[72px] border-slate-100 hover:bg-slate-50/80"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="px-5 py-3">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-28 text-center text-sm font-semibold text-slate-500"
								>
									No jobs found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</div>
	);
}
