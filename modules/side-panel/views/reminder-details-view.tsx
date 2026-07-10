import { Button } from "@/components/ui/button";
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
				<p className="rounded-[14px] border border-border bg-card px-3 py-4 text-sm text-muted-foreground">
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
				<section className="rounded-[14px] border border-border bg-card p-4">
					<div className="flex items-start gap-3">
						<div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
							<Icon className="size-5" aria-hidden="true" />
						</div>
						<div className="min-w-0 flex-1">
							<h2 className="text-base font-bold leading-6 text-foreground">
								{reminder.company} - {reminder.title}
							</h2>
							<p className="mt-1 text-sm font-medium text-muted-foreground">
								{reminder.description}
							</p>
						</div>
					</div>

					<Button
						type="button"
						className="mt-4 h-9 w-full rounded-md bg-primary text-xs font-semibold text-primary-foreground hover:brightness-95"
						disabled={isCompleted}
						onClick={() => onMarkDone(reminder.id)}
					>
						{isCompleted ? "Completed" : "Mark Done"}
					</Button>
				</section>

				<section className="rounded-[14px] border border-border bg-card p-3">
					<DetailLine label="Company" value={reminder.company} isDarkMode={isDarkMode} />
					<DetailLine label="Role" value={reminder.title} isDarkMode={isDarkMode} />
					<DetailLine label="When" value={reminder.time} isDarkMode={isDarkMode} />
					<DetailLine
						label="Status"
						value={isCompleted ? "Completed" : "Open"}
						isDarkMode={isDarkMode}
					/>
				</section>

				<section className="rounded-[14px] border border-border bg-card p-3">
					<h3 className="text-sm font-semibold text-foreground">
						Reminder Note
					</h3>
					<p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-muted-foreground">
						{reminder.description}
					</p>
				</section>
			</div>
			<FullDashboardButton isDarkMode={isDarkMode} />
		</div>
	);
}
