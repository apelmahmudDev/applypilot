import { useEffect, useMemo, useState } from "react";

import { getStoredJobs } from "@/lib/jobs/storage";

export function useDashboardReminderCount() {
	const [count, setCount] = useState(0);

	useEffect(() => {
		let isMounted = true;

		const loadReminderCount = async () => {
			const jobs = await getStoredJobs();
			const nextCount = jobs.filter(
				(job) =>
					job.reminderEnabled &&
					Boolean(job.followUpDate) &&
					!job.reminderDone,
			).length;

			if (isMounted) {
				setCount(nextCount);
			}
		};

		void loadReminderCount();

		const handleStorageChange: Parameters<
			typeof browser.storage.onChanged.addListener
		>[0] = (changes, areaName) => {
			if (areaName === "local" && changes["applypilot.jobs"]) {
				void loadReminderCount();
			}
		};

		browser.storage.onChanged.addListener(handleStorageChange);

		return () => {
			isMounted = false;
			browser.storage.onChanged.removeListener(handleStorageChange);
		};
	}, []);

	return useMemo(() => (count > 0 ? String(count) : null), [count]);
}
