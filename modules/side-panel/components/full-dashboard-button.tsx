import { Grid2X2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { openDashboard } from "@/lib/open-dashboard";
import { cn } from "@/lib/utils";

export function FullDashboardButton({ isDarkMode }: { isDarkMode: boolean }) {
	return (
		<Button
			type="button"
			variant="outline"
			className={cn(
				"mt-4 h-10 w-full rounded-md text-sm font-bold",
				isDarkMode
					? "border-slate-700 bg-[#262628] text-slate-100 hover:bg-[#303032]"
					: "border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
			)}
			onClick={openDashboard}
		>
			<Grid2X2 className="size-4" aria-hidden="true" />
			Open Full Dashboard
		</Button>
	);
}
