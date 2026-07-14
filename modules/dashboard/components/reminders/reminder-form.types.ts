export const reminderTypeOptions = [
	"Follow up",
	"Interview prep",
	"Application update",
	"Networking",
] as const;

export type ReminderTypeOption = (typeof reminderTypeOptions)[number];

export type ReminderFormValues = {
	type: ReminderTypeOption;
	date: string;
	time: string;
	isActive: boolean;
	note: string;
};

export type DashboardReminder = ReminderFormValues;
