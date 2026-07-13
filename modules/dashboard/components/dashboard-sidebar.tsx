import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
	dashboardNavSections,
	type DashboardView,
} from "@/modules/dashboard/navigation";

type DashboardSidebarProps = {
	activeView: DashboardView;
	onViewChange: (view: DashboardView) => void;
};

const DASHBOARD_IDENTITY_STORAGE_KEY = "applypilot.dashboardIdentity";

const dashboardIdentities = [
	"Orion Nova",
	"Luna Astra",
	"Vega Starborn",
	"Sirius Ray",
	"Nova Celeste",
	"Atlas Moon",
	"Lyra Comet",
	"Cosmo Vale",
	"Sol Orion",
	"Nebula Kai",
	"Titan Skye",
	"Elara Star",
	"Apollo Zenith",
	"Mira Galaxy",
	"Astra Solis",
] as const;

const avatarThemes = [
	"from-violet-500 via-primary to-indigo-700",
	"from-sky-500 via-cyan-500 to-blue-700",
	"from-fuchsia-500 via-violet-500 to-indigo-700",
	"from-amber-400 via-orange-500 to-rose-500",
	"from-emerald-400 via-teal-500 to-cyan-600",
] as const;

type DashboardIdentity = {
	name: (typeof dashboardIdentities)[number];
	role: string;
	avatarLabel: string;
	avatarThemeClassName: string;
	version: string;
};

function buildDashboardIdentity(name: (typeof dashboardIdentities)[number]): DashboardIdentity {
	const avatarLabel = name
		.split(" ")
		.slice(0, 2)
		.map((part) => part[0] ?? "")
		.join("")
		.toUpperCase();
	const avatarThemeClassName =
		avatarThemes[
			dashboardIdentities.findIndex((identity) => identity === name) %
				avatarThemes.length
		];

	return {
		name,
		role: "Local workspace",
		avatarLabel,
		avatarThemeClassName,
		version: "v1.0.0",
	};
}

function getRandomDashboardIdentityName() {
	return dashboardIdentities[
		Math.floor(Math.random() * dashboardIdentities.length)
	];
}

export function DashboardSidebar({
	activeView,
	onViewChange,
}: DashboardSidebarProps) {
	const { isMobile, setOpenMobile } = useSidebar();
	const logoSrc = browser.runtime.getURL("/logo.png");
	const [userProfile, setUserProfile] = useState<DashboardIdentity>(() =>
		buildDashboardIdentity(dashboardIdentities[0]),
	);
	const collapsedMenuButtonClass =
		"group-data-[collapsible=icon]:h-auto! group-data-[collapsible=icon]:w-full! group-data-[collapsible=icon]:flex-col! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-1 group-data-[collapsible=icon]:px-1! group-data-[collapsible=icon]:py-2.5! group-data-[collapsible=icon]:text-center group-data-[collapsible=icon]:[&>span]:overflow-visible group-data-[collapsible=icon]:[&>span]:text-clip group-data-[collapsible=icon]:[&>span]:whitespace-normal group-data-[collapsible=icon]:[&>span]:text-center group-data-[collapsible=icon]:[&>span]:text-[11px] group-data-[collapsible=icon]:[&>span]:leading-4";

	useEffect(() => {
		let isMounted = true;

		async function loadDashboardIdentity() {
			const stored = await browser.storage.local.get(
				DASHBOARD_IDENTITY_STORAGE_KEY,
			);
			const storedName = stored[DASHBOARD_IDENTITY_STORAGE_KEY];
			const validStoredName = dashboardIdentities.find(
				(identity) => identity === storedName,
			);
			const identityName = validStoredName ?? getRandomDashboardIdentityName();

			if (!validStoredName) {
				await browser.storage.local.set({
					[DASHBOARD_IDENTITY_STORAGE_KEY]: identityName,
				});
			}

			if (isMounted) {
				setUserProfile(buildDashboardIdentity(identityName));
			}
		}

		void loadDashboardIdentity();

		return () => {
			isMounted = false;
		};
	}, []);

	function handleViewChange(view: DashboardView) {
		onViewChange(view);
		if (isMobile) {
			setOpenMobile(false);
		}
	}

	return (
		<Sidebar collapsible="icon" variant="sidebar">
			<SidebarHeader className="px-3 pb-2 pt-4">
				<div className="flex items-center gap-3 rounded-lg px-1.5 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
					<img
						src={logoSrc}
						alt=""
						className="h-10 w-auto shrink-0 rounded-xs group-data-[collapsible=icon]:h-11"
						aria-hidden="true"
					/>
					<div className="min-w-0 group-data-[collapsible=icon]:hidden">
						<h1 className="truncate text-lg font-bold tracking-normal">
							Applypilot
						</h1>
						<p className="truncate text-xs font-semibold text-slate-500">
							Job application tracker
						</p>
					</div>
				</div>
			</SidebarHeader>

			<SidebarContent className="px-2 group-data-[collapsible=icon]:px-1.5">
				{dashboardNavSections.map((section) => (
					<SidebarGroup key={section.label} className="px-1">
						<SidebarGroupLabel className="px-2 text-[11px] font-bold uppercase tracking-normal">
							{section.label}
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu className="gap-1">
								{section.items.map((item) => {
									const Icon = item.icon;
									const isActive = activeView === item.value;
									const reminderCount = item.value === "reminders" ? "3" : null;

									return (
										<SidebarMenuItem key={item.value}>
											<SidebarMenuButton
												type="button"
												size="lg"
												isActive={isActive}
												className={cn(
													"h-10 rounded-md font-bold",
													reminderCount && "pr-3",
													"group-data-[collapsible=icon]:px-1!",
													collapsedMenuButtonClass,
													isActive
														? "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
														: "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
												)}
												onClick={() => handleViewChange(item.value)}
											>
												<Icon
													className="size-4 group-data-[collapsible=icon]:size-5"
													aria-hidden="true"
												/>
												<span className="flex-1">{item.label}</span>
												{reminderCount ? (
													<div
														className={cn(
															"ml-auto flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[11px] font-bold tabular-nums ring-1 ring-inset transition-colors group-data-[collapsible=icon]:hidden",
															isActive
																? "bg-primary text-primary-foreground ring-primary/20"
																: "bg-primary text-primary-foreground ring-primary/15 shadow-[0_1px_2px_color-mix(in_srgb,var(--primary)_22%,transparent)]",
														)}
													>
														{reminderCount}
													</div>
												) : null}
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>

			<SidebarFooter className="px-3 pb-4 pt-4">
				<div className="rounded-lg bg-slate-50 px-3 py-3 group-data-[collapsible=icon]:hidden">
					<div className="flex items-start gap-2">
						<ShieldCheck
							className="mt-0.5 size-4 shrink-0 text-slate-500"
							aria-hidden="true"
						/>
						<div className="min-w-0">
							<p className="text-sm font-bold text-slate-800">
								All your data is stored locally in your browser.
							</p>
							<p className="mt-1 text-xs leading-5 text-slate-500">
								No account. No tracking. 100% private.
							</p>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-3 rounded-lg bg-slate-100 p-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2">
					<div
						className={cn(
							"flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-xs font-black text-white shadow-[0_10px_24px_color-mix(in_srgb,var(--primary)_28%,transparent)]",
							userProfile.avatarThemeClassName,
						)}
					>
						{userProfile.avatarLabel}
					</div>
					<div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
						<p className="truncate text-sm font-bold text-slate-800">
							{userProfile.name}
						</p>
						<p className="truncate text-xs font-semibold text-slate-500">
							{userProfile.role}
						</p>
					</div>
					<p className="shrink-0 text-xs font-semibold text-slate-400 group-data-[collapsible=icon]:hidden">
						{userProfile.version}
					</p>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
