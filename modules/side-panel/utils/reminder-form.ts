import type { StoredJob } from "@/lib/jobs/storage";
import { defaultReminderFormValues } from "@/modules/dashboard/components/reminders/reminder-form.utils";
import type {
	DashboardReminder,
	ReminderFormValues,
} from "@/modules/dashboard/components/reminders/reminder-form.types";

export function getStoredJobReminderFormValues(
	job: StoredJob | null | undefined,
): ReminderFormValues {
	if (!job?.followUpDate) {
		return defaultReminderFormValues;
	}

	const reminder: DashboardReminder = {
		type: job.reminderType,
		date: job.followUpDate,
		time: job.followUpTime || defaultReminderFormValues.time,
		isActive: job.reminderEnabled,
		note: job.reminderNote || defaultReminderFormValues.note,
	};

	return reminder;
}

export function applyReminderFormValuesToStoredJob(
	job: StoredJob,
	values: ReminderFormValues,
): StoredJob {
	return {
		...job,
		reminderType: values.type,
		followUpDate: values.date,
		followUpTime: values.time,
		reminderNote: values.note,
		reminderEnabled: values.isActive && Boolean(values.date),
		reminderDone: false,
	};
}
