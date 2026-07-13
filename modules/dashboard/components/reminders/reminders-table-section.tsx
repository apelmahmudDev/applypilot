import {
	BellRing,
	CalendarCheck2,
	MoreHorizontal,
	Send,
	Users,
	type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type { ReminderRow, ReminderSection } from "./types";

const reminderKindClasses: Record<ReminderRow["kind"], string> = {
	"Follow-up": "bg-primary/10 text-primary",
	Interview: "bg-violet-50 text-violet-600",
	Task: "bg-amber-50 text-amber-600",
};

const reminderKindIcons: Record<ReminderRow["kind"], LucideIcon> = {
	"Follow-up": Send,
	Interview: Users,
	Task: CalendarCheck2,
};

type RemindersTableSectionProps = {
	section: ReminderSection;
};

export function RemindersTableSection({ section }: RemindersTableSectionProps) {
	return (
		<section className="space-y-3">
			<div className="flex items-center gap-2 px-1">
				<h2 className="text-lg font-medium tracking-[-0.03em] text-slate-950">
					{section.title}
				</h2>
				{section.eyebrow ? (
					<p className="text-sm font-medium text-slate-500">
						{section.eyebrow}
					</p>
				) : null}
			</div>

			<div className="overflow-hidden rounded-md border border-slate-100 bg-white shadow-[0_4px_16px_rgba(15,23,42,0.01)]">
				<Table>
					<TableBody>
						{section.rows.map((row) => (
							<TableRow
								key={row.id}
								className="border-slate-100 hover:bg-slate-50/70"
							>
								<TableCell className="px-6 py-4">
									<div className="flex min-w-[240px] items-center gap-4">
										<div
											className={cn(
												"flex size-11 shrink-0 items-center justify-center rounded-lg text-sm font-black",
												row.companyMarkClassName,
											)}
										>
											{row.companyMark}
										</div>
										<div className="min-w-0">
											<p className="truncate text-sm font-bold text-slate-950">
												{row.title}
											</p>
											<p className="mt-1 truncate text-sm font-medium text-slate-500">
												{row.company}
											</p>
										</div>
									</div>
								</TableCell>
								<TableCell className="px-6 py-4">
									{renderReminderKindBadge(row.kind)}
								</TableCell>
								<TableCell className="px-6 py-4">
									<p className="min-w-[220px] text-sm font-medium text-slate-600">
										{row.note}
									</p>
								</TableCell>
								<TableCell className="px-6 py-4">
									<div className="min-w-[120px]">
										<p className="text-sm font-bold text-primary">
											{row.dueLabel}
										</p>
										<p className="mt-1 text-sm font-semibold text-slate-500">
											{row.timeLabel}
										</p>
									</div>
								</TableCell>
								<TableCell className="px-6 py-4">
									<div className="flex items-center justify-end gap-2">
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="size-9 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900"
											aria-label={`Notification settings for ${row.title}`}
										>
											<BellRing className="size-4" aria-hidden="true" />
										</Button>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="size-9 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900"
													aria-label={`More actions for ${row.title}`}
												>
													<MoreHorizontal
														className="size-4"
														aria-hidden="true"
													/>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem>Edit reminder</DropdownMenuItem>
												<DropdownMenuItem>Mark completed</DropdownMenuItem>
												<DropdownMenuItem>Open job</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</section>
	);
}

function renderReminderKindBadge(kind: ReminderRow["kind"]) {
	const KindIcon = reminderKindIcons[kind];

	return (
		<Badge
			className={cn(
				"rounded-sm px-2 py-1 text-xs font-bold shadow-none [&>svg]:size-3.5",
				reminderKindClasses[kind],
			)}
		>
			<KindIcon aria-hidden="true" />
			{kind}
		</Badge>
	);
}
