import {
	Bell,
	CalendarClock,
	CalendarDays,
	CheckCircle2,
	Clock3,
	Plus,
	Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	StatsCardGrid,
	type StatsCardItem,
} from "@/modules/dashboard/components/stats-card-grid";

const reminderStats = [
	{
		label: "All Reminders",
		value: "12",
		description: "Across all tracked jobs",
		icon: Bell,
		accentClassName: "bg-blue-50 text-blue-600",
	},
	{
		label: "Due Today",
		value: "5",
		description: "Need attention today",
		icon: CalendarDays,
		accentClassName: "bg-emerald-50 text-emerald-600",
	},
	{
		label: "Due This Week",
		value: "4",
		description: "Upcoming follow-ups",
		icon: Clock3,
		accentClassName: "bg-amber-50 text-amber-500",
	},
	{
		label: "Overdue",
		value: "3",
		description: "Past scheduled date",
		icon: CalendarClock,
		accentClassName: "bg-violet-50 text-violet-600",
	},
	{
		label: "Completed",
		value: "8",
		description: "Marked done this week",
		icon: CheckCircle2,
		accentClassName: "bg-slate-100 text-slate-600",
	},
] satisfies StatsCardItem[];

export function RemindersView() {
	return (
		<div>
			<section className="mb-5 flex flex-col gap-5 pt-5 pb-2 xl:flex-row xl:items-center xl:justify-between">
				<div className="min-w-0">
					<h1 className="text-3xl font-bold tracking-[-0.05em] text-slate-950">
						Reminders
					</h1>
					<p className="mt-2 text-sm text-slate-500">
						Never miss an important follow-up.
					</p>
				</div>

				<div className="flex flex-col gap-3 sm:flex-row sm:items-center xl:justify-end">
					<div className="relative w-full sm:w-[20rem] xl:w-[22rem]">
						<Search
							className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
							aria-hidden="true"
						/>
						<Input
							placeholder="Search jobs, companies..."
							className="h-11 bg-white pl-11 pr-14 text-sm shadow-none"
						/>
					</div>

					<Button className="h-11 px-4">
						<Plus className="size-4" aria-hidden="true" />
						Add Reminder
					</Button>
				</div>
			</section>

			<StatsCardGrid
				stats={reminderStats}
				className="xl:grid-cols-5"
			/>

			<section className="mt-6 mb-8 space-y-4">{/* reminder content */}</section>
		</div>
	);
}
