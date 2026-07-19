import { useCallback, useEffect, useMemo, useState } from "react";

import type { ReminderFormValues } from "@/modules/dashboard/components/reminders/reminder-form.types";
import { buildAllJobsStats } from "@/modules/dashboard/data/dashboard-job-stats";
import {
	createDashboardJob,
	getDashboardJobs,
	updateDashboardJob,
	updateDashboardJobReminder,
} from "@/modules/dashboard/data/dashboard-job-mappers";
import type { DashboardJob } from "@/modules/dashboard/types";

export function useDashboardJobs() {
	const [jobs, setJobs] = useState<DashboardJob[]>([]);

	useEffect(() => {
		let isActive = true;

		const loadJobs = async () => {
			const nextJobs = await getDashboardJobs();

			if (isActive) {
				setJobs(nextJobs);
			}
		};

		void loadJobs();

		const handleStorageChanged = (
			changes: Record<string, browser.storage.StorageChange>,
			areaName: string,
		) => {
			if (areaName === "local" && changes["applypilot.jobs"]) {
				void loadJobs();
			}
		};

		browser.storage.onChanged.addListener(handleStorageChanged);

		return () => {
			isActive = false;
			browser.storage.onChanged.removeListener(handleStorageChanged);
		};
	}, []);

	const createJob = useCallback(async (job: DashboardJob) => {
		const nextJob = await createDashboardJob(job);
		setJobs((currentJobs) => [nextJob, ...currentJobs]);
	}, []);

	const saveJob = useCallback(async (job: DashboardJob) => {
		const nextJob = await updateDashboardJob(job);
		setJobs((currentJobs) =>
			currentJobs.map((currentJob) =>
				currentJob.id === nextJob.id ? nextJob : currentJob,
			),
		);
	}, []);

	const saveReminder = useCallback(
		async (jobId: string, values: ReminderFormValues) => {
			const nextJob = await updateDashboardJobReminder(jobId, values);

			if (!nextJob) {
				return;
			}

			setJobs((currentJobs) =>
				currentJobs.map((currentJob) =>
					currentJob.id === nextJob.id ? nextJob : currentJob,
				),
			);
		},
		[],
	);

	const stats = useMemo(() => buildAllJobsStats(jobs), [jobs]);

	return {
		jobs,
		stats,
		createJob,
		saveJob,
		saveReminder,
	};
}
