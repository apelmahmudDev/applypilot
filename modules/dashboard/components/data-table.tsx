import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type SortingState,
} from "@tanstack/react-table";
import { Search } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		state: {
			sorting,
		},
	});

	return (
		<div className="space-y-5">
			<div className="flex items-center gap-4">
				<div className="relative flex-1">
					<Search
						className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
						aria-hidden="true"
					/>
					<Input
						value={search}
						placeholder="Search jobs by title, company, location..."
						className="h-10 rounded-md border-slate-200 bg-white pl-11 text-sm font-medium shadow-[0_4px_14px_rgba(15,23,42,0.04)]"
						onChange={(event) => setSearch(event.target.value)}
					/>
				</div>
				<Button className="h-10 rounded-md bg-blue-600 px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(37,99,235,0.24)] hover:bg-blue-700">
					+ Add Job
				</Button>
			</div>

			{statsSlot}

			<div className="flex items-center justify-between">
				<Tabs
					value={statusFilter}
					onValueChange={(value) =>
						setStatusFilter(value as DashboardStatusFilter)
					}
				>
					<TabsList className="h-10 bg-transparent p-0">
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

				<div className="flex items-center gap-3 text-xs font-bold text-slate-700">
					Sort by
					<Select defaultValue="latest">
						<SelectTrigger className="h-9 w-24 rounded-md border-slate-200 bg-white text-xs font-bold">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="latest">Latest</SelectItem>
							<SelectItem value="deadline">Deadline</SelectItem>
							<SelectItem value="company">Company</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
				<Table>
					<TableHeader className="sr-only">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
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
		</div>
	);
}
