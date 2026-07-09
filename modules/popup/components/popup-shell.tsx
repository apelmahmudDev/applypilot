import { Send, Settings, X } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useSystemTheme } from "@/hooks/use-system-theme";

type PopupShellProps = {
	children: ReactNode;
};

export function PopupShell({ children }: PopupShellProps) {
	useSystemTheme();

	return (
		<main className="flex h-[600px] w-[380px] flex-col overflow-hidden border border-slate-200 bg-white text-slate-950 shadow-[0_18px_48px_rgba(15,23,42,0.16)] dark:border-slate-800 dark:bg-[#202020] dark:text-slate-50 dark:shadow-[0_18px_48px_rgba(0,0,0,0.32)]">
			<header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
				<div className="flex items-center gap-3">
					<div className="flex size-8 items-center justify-center rounded-md bg-blue-50 text-blue-600">
						<Send className="size-5 fill-blue-500 stroke-blue-600" aria-hidden="true" />
					</div>
					<h1 className="text-lg font-bold tracking-normal">Applypilot</h1>
				</div>
				<div className="flex items-center gap-1">
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						className="text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#262628]"
						aria-label="Open settings"
						title="Settings"
					>
						<Settings className="size-4" aria-hidden="true" />
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						className="text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#262628]"
						aria-label="Close popup"
						title="Close"
					>
						<X className="size-4" aria-hidden="true" />
					</Button>
				</div>
			</header>

			{children}
		</main>
	);
}
