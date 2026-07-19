import { useMemo } from "react";
import { Calendar1 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

type RemindersDatePickerProps = {
	selectedDate?: Date;
	onSelectDate: (date: Date | undefined) => void;
};

export function RemindersDatePicker({
	selectedDate,
	onSelectDate,
}: RemindersDatePickerProps) {

	const formattedDate = useMemo(() => {
		if (!selectedDate) {
			return "Select date";
		}

		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		}).format(selectedDate);
	}, [selectedDate]);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="outline"
					className="h-11 rounded-md border-slate-200 bg-white px-4 font-semibold text-slate-700 shadow-none dark:border-border dark:bg-card dark:text-foreground"
				>
					<Calendar1 className="size-4 text-slate-500 dark:text-muted-foreground" aria-hidden="true" />
					{formattedDate}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="end"
				className="w-auto rounded-md border-slate-200 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-border dark:bg-popover"
			>
				<Calendar
					mode="single"
					selected={selectedDate}
					onSelect={onSelectDate}
				/>
			</PopoverContent>
		</Popover>
	);
}
