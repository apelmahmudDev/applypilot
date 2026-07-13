import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RemindersDatePicker } from "@/modules/dashboard/components/reminders/reminders-date-picker";
import { RemindersStats } from "@/modules/dashboard/components/reminders/reminders-stats";
import { RemindersTableSection } from "@/modules/dashboard/components/reminders/reminders-table-section";
import { reminderSections } from "@/modules/dashboard/components/reminders/data";

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

					<RemindersDatePicker />

					<Button className="h-11 px-4">
						<Plus className="size-4" aria-hidden="true" />
						Add Reminder
					</Button>
				</div>
			</section>

			<RemindersStats />

			<section className="mt-6 mb-8 space-y-6">
				<div className="space-y-5">
					{reminderSections.map((section) => (
						<RemindersTableSection key={section.id} section={section} />
					))}

					<div className="flex flex-col gap-4 text-sm font-medium text-slate-500 sm:flex-row sm:items-center sm:justify-between">
						<p>Showing 1 to 6 of 12 reminders</p>
						<Button
							type="button"
							variant="outline"
							className="h-10 rounded-md border-slate-100 bg-white px-4 font-semibold text-slate-700 shadow-none"
						>
							Load More
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
}
