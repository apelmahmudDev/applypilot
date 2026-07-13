import {
	StatsCardGrid,
	type StatsCardItem,
} from "@/modules/dashboard/components/stats-card-grid";

import { reminderStats } from "./data";

export function RemindersStats() {
	return (
		<StatsCardGrid
			stats={reminderStats as StatsCardItem[]}
			className="xl:grid-cols-5"
			layout="value-first"
			showDescription={false}
		/>
	);
}
