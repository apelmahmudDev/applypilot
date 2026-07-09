import {
	Bookmark,
	CalendarDays,
	CheckCircle2,
	ChevronRight,
	CircleUserRound,
	ExternalLink,
	Grid2X2,
	Link,
	MapPin,
	Moon,
	MoreVertical,
	PencilLine,
	PlusCircle,
	Search,
	Send,
	Settings,
	Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { recentJobs, reminders } from "@/modules/side-panel/mock-data";
import type { JobStatus, RecentJob } from "@/modules/side-panel/types";

const statusStyles: Record<JobStatus, string> = {
	Applied: "border-blue-400/20 bg-blue-500/15 text-blue-300",
	Interview: "border-amber-400/20 bg-amber-500/15 text-amber-300",
	Saved: "border-slate-400/15 bg-slate-500/15 text-slate-300",
};

const brandStyles: Record<RecentJob["brand"], string> = {
	amazon: "bg-[#111827] text-white before:bg-blue-500",
	microsoft: "bg-slate-950 text-white",
	swiggy: "bg-orange-500 text-white",
	google: "bg-white text-slate-950",
};

export function SidePanel() {
	return (
		<main className="h-screen min-h-[720px] w-full overflow-hidden bg-[#060b14] p-2 text-slate-100">
			<div className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-700/55 bg-[linear-gradient(145deg,#0d1422_0%,#070b12_46%,#0a111d_100%)] shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
				<header className="flex shrink-0 items-center justify-between px-5 pb-4 pt-5">
					<div className="flex items-center gap-3">
						<Send
							className="size-7 fill-indigo-500 stroke-indigo-300"
							aria-hidden="true"
						/>
						<h1 className="text-xl font-bold tracking-normal text-white">
							ApplyPilot
						</h1>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						className="text-slate-300 hover:bg-slate-800/80 hover:text-white"
						aria-label="Open settings"
						title="Settings"
					>
						<Settings className="size-5" aria-hidden="true" />
					</Button>
				</header>

				<div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4">
					<div className="flex h-10 items-center gap-3 rounded-lg border border-slate-700/70 bg-slate-950/35 px-3 text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
						<Search className="size-4 shrink-0" aria-hidden="true" />
						<span className="min-w-0 flex-1 truncate text-sm">
							Search jobs, companies, notes...
						</span>
						<kbd className="rounded-md border border-slate-700 bg-slate-900 px-2 py-0.5 text-[11px] font-medium text-slate-500">
							Ctrl K
						</kbd>
						<span className="h-5 w-px bg-slate-700" />
						<button
							type="button"
							className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-indigo-300 hover:text-indigo-200"
						>
							<PlusCircle className="size-3.5" aria-hidden="true" />
							Add Job
						</button>
					</div>

					<section className="space-y-3">
						<div className="flex items-center gap-3 px-1">
							<Sparkles className="size-4 text-cyan-300" aria-hidden="true" />
							<h2 className="text-sm font-semibold text-white">
								Detected on this page
							</h2>
						</div>
						<div className="rounded-lg border border-slate-700/75 bg-slate-900/45 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.24)]">
							<div className="flex gap-4">
								<div className="flex size-[72px] shrink-0 items-center justify-center rounded-lg border border-slate-700/55 bg-slate-800/45 text-4xl font-bold">
									<span className="bg-[conic-gradient(from_0deg,#4285f4,#34a853,#fbbc05,#ea4335,#4285f4)] bg-clip-text text-transparent">
										G
									</span>
								</div>
								<div className="min-w-0 flex-1">
									<h3 className="truncate text-base font-bold text-white">
										Frontend Developer
									</h3>
									<p className="mt-1 text-sm font-medium text-slate-300">Google</p>
									<p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
										<MapPin className="size-3.5" aria-hidden="true" />
										Bengaluru, Karnataka, India
									</p>
									<a
										href="https://careers.google.com/jobs/results/1234567890"
										target="_blank"
										rel="noreferrer"
										className="mt-2 flex min-w-0 items-center gap-2 text-xs font-medium text-blue-300 hover:text-blue-200"
									>
										<Link className="size-3.5 shrink-0" aria-hidden="true" />
										<span className="truncate">
											careers.google.com/jobs/results/1234567890
										</span>
										<ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
									</a>
								</div>
							</div>

							<div className="mt-5 grid grid-cols-2 gap-3">
								<Button
									type="button"
									variant="outline"
									className="h-10 rounded-md border-slate-600/70 bg-slate-950/25 text-sm font-semibold text-slate-100 hover:bg-slate-800/80 hover:text-white"
								>
									<PencilLine className="size-4" aria-hidden="true" />
									Edit Details
								</Button>
								<Button
									type="button"
									className="h-10 rounded-md bg-indigo-600 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(79,70,229,0.34)] hover:bg-indigo-500"
								>
									<PlusCircle className="size-4" aria-hidden="true" />
									Save Job
								</Button>
							</div>
						</div>
					</section>

					<section className="grid grid-cols-3 rounded-lg border border-slate-700/65 bg-slate-900/45 py-3">
						<StatItem icon={Bookmark} value="42" label="Saved" />
						<StatItem icon={CheckCircle2} value="18" label="Applied" bordered />
						<StatItem icon={CalendarDays} value="4" label="Interview" bordered />
					</section>

					<ListHeader title="Recent Jobs" />
					<section className="overflow-hidden rounded-lg border border-slate-700/65 bg-slate-900/35">
						{recentJobs.map((job) => (
							<RecentJobRow key={job.id} job={job} />
						))}
					</section>

					<ListHeader title="Today's Reminders" />
					<section className="overflow-hidden rounded-lg border border-slate-700/65 bg-slate-900/35">
						{reminders.map((reminder) => {
							const Icon = reminder.icon;

							return (
								<div
									key={reminder.id}
									className="flex items-center gap-3 border-b border-slate-800/85 px-3 py-3 last:border-b-0"
								>
									<div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
										<Icon className="size-5" aria-hidden="true" />
									</div>
									<div className="min-w-0 flex-1">
										<h3 className="truncate text-sm font-semibold text-white">
											{reminder.company} - {reminder.title}
										</h3>
										<p className="truncate text-xs text-slate-400">
											{reminder.description}
										</p>
										<p className="mt-1 text-xs font-medium text-blue-300">
											{reminder.time}
										</p>
									</div>
									<Button
										type="button"
										variant="outline"
										size="sm"
										className="h-8 rounded-md border-slate-600/70 bg-slate-950/20 px-3 text-xs text-slate-200 hover:bg-slate-800/80 hover:text-white"
									>
										Mark Done
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										className="text-slate-400 hover:bg-slate-800/80 hover:text-white"
										aria-label="Reminder actions"
										title="Actions"
									>
										<MoreVertical className="size-4" aria-hidden="true" />
									</Button>
								</div>
							);
						})}
					</section>

					<button
						type="button"
						className="flex w-full items-center gap-3 rounded-lg border border-slate-700/65 bg-slate-900/45 p-3 text-left transition hover:bg-slate-800/70"
					>
						<div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
							<Grid2X2 className="size-5" aria-hidden="true" />
						</div>
						<div className="min-w-0 flex-1">
							<h2 className="truncate text-sm font-semibold text-white">
								Open Full Dashboard
							</h2>
							<p className="truncate text-xs text-slate-400">
								View analytics, export data, and more
							</p>
						</div>
						<ChevronRight className="size-4 text-slate-400" aria-hidden="true" />
					</button>
				</div>

				<footer className="flex shrink-0 items-center justify-between border-t border-slate-800/80 px-5 py-3">
					<div className="flex min-w-0 items-center gap-3">
						<CircleUserRound className="size-8 shrink-0 text-indigo-300" aria-hidden="true" />
						<span className="truncate text-sm font-medium text-slate-200">
							Apel Mahmud
						</span>
					</div>
					<div className="flex items-center gap-2 text-sm font-medium text-slate-300">
						<Moon className="size-4 text-indigo-300" aria-hidden="true" />
						Dark Mode
						<span className="relative h-6 w-11 rounded-full bg-indigo-600 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]">
							<span className="absolute right-1 top-1 size-4 rounded-full bg-white" />
						</span>
					</div>
				</footer>
			</div>
		</main>
	);
}

function ListHeader({ title }: { title: string }) {
	return (
		<div className="flex items-center justify-between px-1 pt-1">
			<h2 className="text-sm font-semibold text-white">{title}</h2>
			<button
				type="button"
				className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-200"
			>
				View all
				<ChevronRight className="size-3" aria-hidden="true" />
			</button>
		</div>
	);
}

function StatItem({
	icon: Icon,
	value,
	label,
	bordered = false,
}: {
	icon: typeof Bookmark;
	value: string;
	label: string;
	bordered?: boolean;
}) {
	return (
		<div
			className={cn(
				"flex items-center justify-center gap-3 px-2",
				bordered && "border-l border-slate-700/65",
			)}
		>
			<Icon className="size-5 text-indigo-300" aria-hidden="true" />
			<div>
				<p className="text-lg font-bold leading-5 text-white">{value}</p>
				<p className="text-[11px] font-medium text-slate-400">{label}</p>
			</div>
		</div>
	);
}

function RecentJobRow({ job }: { job: RecentJob }) {
	return (
		<div className="grid grid-cols-[48px_minmax(0,1fr)_74px_84px] items-center gap-2 border-b border-slate-800/85 px-3 py-2.5 last:border-b-0">
			<CompanyMark brand={job.brand} />
			<div className="min-w-0">
				<h3 className="truncate text-sm font-semibold text-white">{job.title}</h3>
				<p className="truncate text-xs text-slate-400">
					{job.company} - {job.location}
				</p>
			</div>
			<span
				className={cn(
					"justify-self-start rounded-md border px-2 py-1 text-[11px] font-semibold",
					statusStyles[job.status],
				)}
			>
				{job.status}
			</span>
			<div className="min-w-0 text-right">
				<p className="truncate text-xs text-slate-400">{job.date}</p>
				<p
					className={cn(
						"mt-1 truncate text-xs font-medium",
						job.followUp === "Today" ? "text-emerald-300" : "text-blue-300",
						job.followUp.includes("1d") && "text-amber-300",
					)}
				>
					{job.followUp}
				</p>
			</div>
		</div>
	);
}

function CompanyMark({ brand }: { brand: RecentJob["brand"] }) {
	if (brand === "microsoft") {
		return (
			<div className="grid size-9 grid-cols-2 gap-0.5 rounded-md bg-slate-950 p-1">
				<span className="bg-red-500" />
				<span className="bg-green-500" />
				<span className="bg-blue-500" />
				<span className="bg-yellow-400" />
			</div>
		);
	}

	const label = brand === "amazon" ? "a" : brand === "swiggy" ? "S" : "G";

	return (
		<div
			className={cn(
				"relative flex size-9 items-center justify-center rounded-md text-xl font-bold",
				brandStyles[brand],
				brand === "amazon" &&
					"after:absolute after:bottom-1 after:h-0.5 after:w-5 after:rounded-full after:bg-orange-400",
			)}
		>
			{label}
		</div>
	);
}
