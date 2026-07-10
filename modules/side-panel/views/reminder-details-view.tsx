import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DetailLine } from "@/modules/side-panel/components/detail-line";
import { FullDashboardButton } from "@/modules/side-panel/components/full-dashboard-button";
import { ViewHeader } from "@/modules/side-panel/components/view-header";
import type { Reminder } from "@/modules/side-panel/types";

type ReminderDetailsViewProps = {
	reminder: Reminder | null;
	isCompleted: boolean;
	isDarkMode: boolean;
	onBack: () => void;
	onMarkDone: (reminderId: string) => void;
};

export function ReminderDetailsView({
	reminder,
	isCompleted,
	isDarkMode,
	onBack,
	onMarkDone,
}: ReminderDetailsViewProps) {
	if (!reminder) {
		return (
			<div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-4">
				<ViewHeader title="Reminder Details" isDarkMode={isDarkMode} onBack={onBack} />
				<p className={cn("rounded-lg border px-3 py-4 text-sm", isDarkMode ? "border-slate-700 bg-[#262628] text-slate-400" : "border-slate-200 bg-white text-slate-500")}>
					This reminder is no longer available.
				</p>
			</div>
		);
	}

	const Icon = reminder.icon;

	return (
		<div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-4">
			<ViewHeader title="Reminder Details" isDarkMode={isDarkMode} onBack={onBack} />
			<div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
				<section
					className={cn(
						"rounded-lg border p-4",
						isDarkMode
							? "border-slate-700/65 bg-[#262628]"
							: "border-slate-200 bg-white",
					)}
				>
					<div className="flex items-start gap-3">
						<div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
							<Icon className="size-5" aria-hidden="true" />
						</div>
						<div className="min-w-0 flex-1">
							<h2
								className={cn(
									"text-base font-bold leading-6",
									isDarkMode ? "text-white" : "text-slate-950",
								)}
							>
								{reminder.company} - {reminder.title}
							</h2>
							<p
								className={cn(
									"mt-1 text-sm font-medium",
									isDarkMode ? "text-slate-300" : "text-slate-700",
								)}
							>
								{reminder.description}
							</p>
						</div>
					</div>

					<Button
						type="button"
						className="mt-4 h-9 w-full rounded-md bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500"
						disabled={isCompleted}
						onClick={() => onMarkDone(reminder.id)}
					>
						{isCompleted ? "Completed" : "Mark Done"}
					</Button>
				</section>

				<section
					className={cn(
						"rounded-lg border p-3",
						isDarkMode
							? "border-slate-700/65 bg-[#262628]"
							: "border-slate-200 bg-white",
					)}
				>
					<DetailLine label="Company" value={reminder.company} isDarkMode={isDarkMode} />
					<DetailLine label="Role" value={reminder.title} isDarkMode={isDarkMode} />
					<DetailLine label="When" value={reminder.time} isDarkMode={isDarkMode} />
					<DetailLine
						label="Status"
						value={isCompleted ? "Completed" : "Open"}
						isDarkMode={isDarkMode}
					/>
				</section>

				<section
					className={cn(
						"rounded-lg border p-3",
						isDarkMode
							? "border-slate-700/65 bg-[#262628]"
							: "border-slate-200 bg-white",
					)}
				>
					<h3 className={cn("text-sm font-semibold", isDarkMode ? "text-white" : "text-slate-950")}>
						Reminder Note
					</h3>
					<p
						className={cn(
							"mt-2 whitespace-pre-wrap text-xs leading-5",
							isDarkMode ? "text-slate-300" : "text-slate-600",
						)}
					>
						{reminder.description}
					</p>
				</section>
			</div>
			<FullDashboardButton isDarkMode={isDarkMode} />
		</div>
	);
}
