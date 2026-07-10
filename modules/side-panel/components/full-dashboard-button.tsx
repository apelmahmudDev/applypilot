import { Grid2X2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { openDashboard } from "@/lib/open-dashboard";

export function FullDashboardButton({ isDarkMode }: { isDarkMode: boolean }) {
	return (
		<Button
			type="button"
			variant="outline"
			className="mt-4 h-10 w-full rounded-md border-input bg-card text-sm font-bold text-foreground hover:bg-muted/60"
			onClick={openDashboard}
		>
			<Grid2X2 className="size-4" aria-hidden="true" />
			Open Full Dashboard
		</Button>
	);
}
