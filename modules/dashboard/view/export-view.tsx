import { Download } from "lucide-react";

import { PlaceholderPage } from "@/modules/dashboard/components/placeholder-page";

export function ExportView() {
	return (
		<PlaceholderPage
			icon={Download}
			title="Export"
			description="A local-first export/import area for backing up job application data without adding any backend dependency."
			items={[
				"Export CSV",
				"Export JSON backup",
				"Import backup file",
				"Validate invalid files",
			]}
		/>
	);
}
