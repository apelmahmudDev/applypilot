import type { ReactNode } from "react";
import { ArrowLeft, LayoutDashboard, PlusCircle } from "lucide-react";

import {
	UserIdentityBadge,
	useUserIdentity,
} from "@/components/user-identity-badge";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { openDashboard } from "@/lib/open-dashboard";
import { cn } from "@/lib/utils";

type SidePanelLayoutProps = {
	children: ReactNode;
	contentClassName?: string;
	header?: ReactNode;
	footer?: ReactNode;
};

type SidePanelTopBarProps = {
	leftSlot?: ReactNode;
	title?: string;
	onBack?: () => void;
	onAddJob?: () => void;
	rightSlot?: ReactNode;
};

export function SidePanelLayout({
	children,
	contentClassName,
	header,
	footer,
}: SidePanelLayoutProps) {
	return (
		<div className="relative flex min-h-0 flex-1 flex-col">
			{header}
			<div
				className={cn(
					"min-h-0 flex-1 overflow-y-auto px-3 pb-10 pt-0 sm:px-4",
					contentClassName,
				)}
			>
				{children}
			</div>
			<footer className="shrink-0 border-t border-border/70 bg-white px-4 py-1 text-center backdrop-blur dark:bg-background">
				{footer ?? (
					<p className="text-[10px] text-muted-foreground/80">
						All your job data is stored locally in your browser.
					</p>
				)}
			</footer>
		</div>
	);
}

export function SidePanelTopBar({
	leftSlot,
	title,
	onBack,
	onAddJob,
	rightSlot,
}: SidePanelTopBarProps) {
	const userIdentity = useUserIdentity();
	const resolvedLeftSlot = leftSlot ?? (
		<div className="flex min-w-0 items-center gap-3">
			<UserIdentityBadge
				identity={userIdentity}
				className="size-8 text-[11px]"
			/>
			<div className="min-w-0">
				<p className="truncate text-sm font-semibold text-foreground">
					{userIdentity.name}
				</p>
				<p className="sr-only truncate text-xs text-muted-foreground">
					{userIdentity.role}
				</p>
			</div>
		</div>
	);

	return (
		<TooltipProvider delayDuration={120}>
			<div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border/70 bg-white px-3 py-3 backdrop-blur-xl dark:bg-background sm:px-4">
				{resolvedLeftSlot}

				<div className="flex shrink-0 items-center gap-2">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								type="button"
								variant="outline"
								size="icon-sm"
								className="rounded-full border-border/70 bg-background text-muted-foreground shadow-none hover:bg-background hover:text-foreground"
								aria-label="Open dashboard"
								onClick={() => void openDashboard()}
							>
								<LayoutDashboard className="size-3.5" aria-hidden="true" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="bottom" sideOffset={8}>
							Open dashboard
						</TooltipContent>
					</Tooltip>

					{rightSlot}

					{onAddJob ? (
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									type="button"
									size="icon-sm"
									className="rounded-full shadow-none"
									aria-label="Add job"
									onClick={onAddJob}
								>
									<PlusCircle className="size-4" aria-hidden="true" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom" sideOffset={8}>
								Add job
							</TooltipContent>
						</Tooltip>
					) : null}
				</div>
			</div>
		</TooltipProvider>
	);
}

type SidePanelBackHeaderProps = {
	title: string;
	onBack: () => void;
};

export function SidePanelBackHeader({
	title,
	onBack,
}: SidePanelBackHeaderProps) {
	return (
		<div className="flex min-w-0 items-center gap-2">
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				className="-ml-1 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
				aria-label="Back"
				title="Back"
				onClick={onBack}
			>
				<ArrowLeft className="size-4" aria-hidden="true" />
			</Button>
			{title ? (
				<h2 className="truncate text-base font-bold text-foreground">
					{title}
				</h2>
			) : null}
		</div>
	);
}
