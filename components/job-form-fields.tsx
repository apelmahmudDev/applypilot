import { format } from "date-fns";
import { CalendarDays, ChevronDown, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const fieldLabelClassName =
	"text-sm font-semibold text-slate-700 dark:text-foreground";
export const inputClassName =
	"h-11! rounded-md border-slate-200 bg-white text-sm font-medium text-slate-900 shadow-none dark:border-[#454040] dark:bg-card dark:text-foreground";

type ErrorItem = { message?: string } | undefined;

type TextFieldProps = {
	label: string;
	name: string;
	value: string;
	errors?: ErrorItem[];
	isInvalid?: boolean;
	type?: string;
	icon?: LucideIcon;
	onBlur?: () => void;
	onChange: (value: string) => void;
};

export function JobFormTextField({
	label,
	name,
	value,
	errors = [],
	isInvalid = false,
	type = "text",
	icon: Icon,
	onBlur,
	onChange,
}: TextFieldProps) {
	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel className={fieldLabelClassName} htmlFor={name}>
				{label}
				{label.includes("Optional") ? null : (
					<span className="text-red-500">*</span>
				)}
			</FieldLabel>
			<div className="relative">
				{Icon ? (
					<Icon
						className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400 dark:text-muted-foreground"
						aria-hidden="true"
					/>
				) : null}
				<Input
					id={name}
					name={name}
					type={type}
					value={value}
					onBlur={onBlur}
					onChange={(event) => onChange(event.target.value)}
					aria-invalid={isInvalid}
					className={cn(inputClassName, Icon ? "pl-10" : undefined)}
				/>
			</div>
			<FieldError errors={errors} />
		</Field>
	);
}

type SelectFieldProps = {
	label: string;
	value: string;
	options: readonly string[];
	optionLabels?: Record<string, string>;
	errors?: ErrorItem[];
	isInvalid?: boolean;
	placeholder?: string;
	onValueChange: (value: string) => void;
};

export function JobFormSelectField({
	label,
	value,
	options,
	optionLabels,
	errors = [],
	isInvalid = false,
	placeholder,
	onValueChange,
}: SelectFieldProps) {
	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel className={fieldLabelClassName}>
				{label}
				{label.includes("Optional") ? null : (
					<span className="text-red-500">*</span>
				)}
			</FieldLabel>
			<Select value={value} onValueChange={onValueChange}>
				<SelectTrigger
					aria-invalid={isInvalid}
					className={cn(inputClassName, "justify-between")}
				>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option} value={option}>
							{optionLabels?.[option] ?? option}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<FieldError errors={errors} />
		</Field>
	);
}

type DateFieldProps = {
	label: string;
	value: string;
	errors?: ErrorItem[];
	isInvalid?: boolean;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onChange: (value: string) => void;
};

export function JobFormDateField({
	label,
	value,
	errors = [],
	isInvalid = false,
	open,
	onOpenChange,
	onChange,
}: DateFieldProps) {
	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel className={fieldLabelClassName}>
				{label}
				{label.includes("Optional") ? null : (
					<span className="text-red-500">*</span>
				)}
			</FieldLabel>
			<Popover open={open} onOpenChange={onOpenChange}>
				<PopoverTrigger asChild>
					<Button
						type="button"
						variant="outline"
						className={cn(
							inputClassName,
							"justify-between px-3 font-medium",
							isInvalid && "border-destructive",
						)}
					>
						<span className="flex items-center gap-3">
							<CalendarDays
								className="size-4 text-slate-400 dark:text-muted-foreground"
								aria-hidden="true"
							/>
							{value
								? format(new Date(`${value}T12:00:00`), "MMM d, yyyy")
								: "Select date"}
						</span>
						<ChevronDown
							className="size-4 text-slate-400 dark:text-muted-foreground"
							aria-hidden="true"
						/>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto rounded-2xl border-slate-200 p-2 dark:border-[#454040] dark:bg-popover">
					<Calendar
						mode="single"
						selected={value ? new Date(`${value}T12:00:00`) : undefined}
						onSelect={(date) => {
							if (!date) {
								onChange("");
								return;
							}

							onChange(format(date, "yyyy-MM-dd"));
							onOpenChange(false);
						}}
					/>
				</PopoverContent>
			</Popover>
			<FieldError errors={errors} />
		</Field>
	);
}
