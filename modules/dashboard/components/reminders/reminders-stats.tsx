import {
	StatsCardGrid,
	type StatsCardItem,
} from "@/modules/dashboard/components/stats-card-grid";
import type { ReminderStat } from "./types";

type RemindersStatsProps = {
	stats: ReminderStat[];
};

export function RemindersStats({ stats }: RemindersStatsProps) {
	return (
		<StatsCardGrid
			stats={stats as StatsCardItem[]}
			className="xl:grid-cols-5"
			layout="value-first"
			showDescription={false}
		/>
	);
}
