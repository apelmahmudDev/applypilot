import {
	AlarmClock,
	Building2,
	CalendarDays,
	Check,
	FileText,
	Trash2,
} from "lucide-react";

import {
	JobDetailsContent,
	JobDetailsRow,
	JobDetailsSection,
} from "@/components/job-details-content";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CompanyMark } from "@/modules/side-panel/components/company-mark";
import {
	SidePanelBackHeader,
	SidePanelLayout,
	SidePanelTopBar,
} from "@/modules/side-panel/components/side-panel-layout";
import type { Reminder } from "@/modules/side-panel/types";
import { getBrand } from "@/modules/side-panel/utils/job-mappers";

type ReminderDetailsViewProps = {
	reminder: Reminder | null;
	isDarkMode: boolean;
	onBack: () => void;
	onMarkDone: (reminderId: string) => void;
	onRemoveReminder: (reminderId: string) => void;
};

export function ReminderDetailsView({
	reminder,
	isDarkMode: _isDarkMode,
	onBack,
	onMarkDone,
	onRemoveReminder,
}: ReminderDetailsViewProps) {
	if (!reminder) {
		return (
			<SidePanelLayout
				header={
					<SidePanelTopBar
						leftSlot={
							<SidePanelBackHeader
								title="Reminder Details"
								onBack={onBack}
							/>
						}
					/>
				}
				contentClassName="px-0 pb-0 pt-0"
			>
				<p className="px-4 py-4 text-sm text-muted-foreground">
					This reminder is no longer available.
				</p>
			</SidePanelLayout>
		);
	}

	return (
		<SidePanelLayout
			header={
				<SidePanelTopBar
					leftSlot={
						<SidePanelBackHeader title="Reminder Details" onBack={onBack} />
					}
				/>
			}
			contentClassName="px-0 pb-0 pt-0"
		>
			<JobDetailsContent
				className="px-3 py-4 sm:px-4"
				brandMark={
					<CompanyMark
						brand={getBrand(reminder.company, "")}
						logoUrl={reminder.logoUrl}
						companyName={reminder.company}
						size="lg"
						appearance="soft"
					/>
				}
				title={reminder.title}
				company={reminder.company}
				status={reminder.isCompleted ? "Offer" : "Saved"}
				hideHeaderStatus
				summaryActions={
					<TooltipProvider delayDuration={120}>
						<div className="grid grid-cols-2 gap-2">
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										type="button"
										className={cn(
											"h-9 rounded-md text-xs font-semibold",
											"bg-primary text-primary-foreground hover:brightness-95",
										)}
										disabled={reminder.isCompleted}
										onClick={() => onMarkDone(reminder.id)}
									>
										<Check className="size-4" aria-hidden="true" />
										{reminder.isCompleted ? "Completed" : "Mark Done"}
									</Button>
								</TooltipTrigger>
								<TooltipContent side="top" sideOffset={8}>
									{reminder.isCompleted ? "Already completed" : "Mark as done"}
								</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										type="button"
										variant="outline"
										className={cn(
											"h-9 rounded-md text-xs font-semibold",
											"border-[#FEF2F2] bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2]",
										)}
										onClick={() => onRemoveReminder(reminder.id)}
									>
										<Trash2 className="size-4" aria-hidden="true" />
										Remove
									</Button>
								</TooltipTrigger>
								<TooltipContent side="top" sideOffset={8}>
									Remove reminder
								</TooltipContent>
							</Tooltip>
						</div>
					</TooltipProvider>
				}
				sections={
					<>
						<JobDetailsSection title="Basic Info">
							<JobDetailsRow
								icon={Building2}
								label="Company"
								value={reminder.company}
							/>
							<JobDetailsRow
								icon={AlarmClock}
								label="Reminder Type"
								value={reminder.reminderType}
							/>
							<JobDetailsRow
								icon={CalendarDays}
								label="When"
								value={reminder.timeLabel}
							/>
							<JobDetailsRow
								icon={Check}
								label="Status"
								value={reminder.isCompleted ? "Completed" : "Open"}
							/>
						</JobDetailsSection>

						<JobDetailsSection title="Reminder Note">
							<div className="flex gap-3">
								<FileText
									className="mt-0.5 size-4 shrink-0 text-slate-400 dark:text-muted-foreground"
									aria-hidden="true"
								/>
								<p className="whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-muted-foreground">
									{reminder.description}
								</p>
							</div>
						</JobDetailsSection>
					</>
				}
			/>
		</SidePanelLayout>
	);
}
