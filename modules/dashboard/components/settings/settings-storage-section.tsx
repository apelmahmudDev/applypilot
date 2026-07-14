import { useState } from "react";
import { Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { settingsSections } from "./data";
import { SettingsSectionCard } from "./settings-section-card";

export function SettingsStorageSection() {
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	return (
		<>
			<ConfirmDialog
				open={isConfirmOpen}
				title="Clear all data?"
				description="This will remove your locally stored job applications and settings from this browser. This action cannot be undone."
				confirmLabel="Clear Data"
				onOpenChange={setIsConfirmOpen}
				onConfirm={() => setIsConfirmOpen(false)}
			/>

			<SettingsSectionCard
				config={settingsSections.storage}
				action={
					<Button
						type="button"
						variant="outline"
						className="h-11 rounded-md border-slate-200 bg-white px-4 font-semibold text-primary shadow-none dark:border-border dark:bg-card"
						onClick={() => setIsConfirmOpen(true)}
					>
						<Trash2 className="size-4" aria-hidden="true" />
						Clear All Data
					</Button>
				}
			>
				<div className="space-y-4 border-t border-slate-100 pt-6 dark:border-border/60">
					<div className="flex items-center justify-between gap-4">
						<p className="text-sm font-semibold text-slate-700 dark:text-foreground/90">Storage Used</p>
						<p className="text-sm font-bold text-slate-900 dark:text-foreground">~ 320 KB</p>
					</div>
					<Progress value={22} className="h-2.5 bg-slate-100 dark:bg-[#3a3333]" />
				</div>
			</SettingsSectionCard>
		</>
	);
}
