import type { ReactNode } from "react";

import { Plus, Search, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarArrowTrigger, SidebarTrigger } from "@/components/ui/sidebar";
import {
	getDashboardViewTitle,
	type DashboardView,
} from "@/modules/dashboard/navigation";

type DashboardHeaderProps = {
	activeView: DashboardView;
};

export type DashboardHeaderContent = {
	title: string;
	description: string;
	actions?: ReactNode;
	searchSlot?: ReactNode;
};

type UtilityButtonProps = {
	icon: ReactNode;
	label: string;
	badge?: string;
};

export function DashboardHeader({ activeView }: DashboardHeaderProps) {
	const content = getDefaultDashboardHeaderContent(activeView);

	return (
		<header className="sticky top-0 z-30 w-full shrink-0 border-b border-slate-200/70 bg-slate-50/90 backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#202020]/90">
			<SidebarArrowTrigger />
			<nav className="flex min-h-[var(--dashboard-header-offset)] w-full flex-col gap-5 px-4 py-5 md:px-8 lg:flex-row lg:items-start lg:justify-between">
				<div className="flex min-w-0 items-start gap-3">
					<SidebarTrigger className="mt-1 size-10 rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 md:hidden" />
					<div className="min-w-0">
						<h2 className="truncate text-[2rem] font-bold tracking-[-0.04em] text-slate-950 dark:text-slate-50">
							{content.title}
						</h2>
						<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
							{content.description}
						</p>
					</div>
				</div>

				<div className="flex w-full flex-col gap-3 lg:max-w-[48rem] lg:items-end">
					<div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
						{content.searchSlot ?? <DefaultSearchSlot />}
						{content.actions ?? <DefaultActions />}
					</div>
				</div>
			</nav>
		</header>
	);
}

export function getDefaultDashboardHeaderContent(
	activeView: DashboardView,
): DashboardHeaderContent {
	return {
		title: getDashboardViewTitle(activeView),
		description: "Track your job applications and stay on top of your progress.",
	};
}

function DefaultSearchSlot() {
	return (
		<div className="relative w-full sm:max-w-[30rem]">
			<Search
				className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
				aria-hidden="true"
			/>
			<Input
				placeholder="Search jobs, companies, notes..."
				className="h-12 rounded-2xl border-slate-200 bg-white pl-11 pr-16 text-sm font-medium shadow-[0_10px_30px_rgba(15,23,42,0.06)] placeholder:text-slate-400 dark:border-slate-700 dark:bg-[#262626]"
			/>
			<div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:bg-[#2f2f2f] dark:text-slate-400">
				Ctrl K
			</div>
		</div>
	);
}

function DefaultActions() {
	return (
		<div className="flex items-center justify-end gap-3">
			<UtilityButton
				icon={<Settings className="size-4" aria-hidden="true" />}
				label="Settings"
			/>
			<Button className="h-12 rounded-2xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-[0_14px_30px_color-mix(in_srgb,var(--primary)_28%,transparent)] hover:brightness-95">
				<Plus className="size-4" aria-hidden="true" />
				Add Job
			</Button>
		</div>
	);
}

function UtilityButton({ icon, label, badge }: UtilityButtonProps) {
	return (
		<Button
			type="button"
			variant="outline"
			size="icon-lg"
			className="relative size-12 rounded-2xl border-slate-200 bg-white text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.05)] hover:bg-slate-50 dark:border-slate-700 dark:bg-[#262626] dark:text-slate-300 dark:hover:bg-[#2d2d2d]"
			aria-label={label}
			title={label}
		>
			{icon}
			{badge ? (
				<span className="absolute right-2 top-2 flex min-w-4 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-4 text-white">
					{badge}
				</span>
			) : null}
		</Button>
	);
}
