import { useMemo, useState } from "react";
import { Calendar1 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export function RemindersDatePicker() {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		new Date(),
	);

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
					className="h-11 rounded-md border-slate-200 bg-white px-4 font-semibold text-slate-700 shadow-none"
				>
					<Calendar1 className="size-4 text-slate-500" aria-hidden="true" />
					{formattedDate}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="end"
				className="w-auto rounded-md border-slate-200 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
			>
				<Calendar
					mode="single"
					selected={selectedDate}
					onSelect={setSelectedDate}
				/>
			</PopoverContent>
		</Popover>
	);
}
