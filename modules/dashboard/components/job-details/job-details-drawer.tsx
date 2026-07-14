import {
	BadgeDollarSign,
	Bell,
	BriefcaseBusiness,
	ExternalLink,
	FileText,
	Link2,
	MapPin,
	Tag,
	X,
} from "lucide-react";
import type { AriaAttributes, ComponentType, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { JobBrandMark } from "@/modules/dashboard/components/job-table/job-brand-mark";
import type { DashboardJob } from "@/modules/dashboard/types";

const statusStyles: Record<DashboardJob["status"], string> = {
	Applied: "bg-emerald-50 text-emerald-600",
	Interview: "bg-violet-50 text-violet-600",
	Saved: "bg-blue-50 text-blue-600",
	Rejected: "bg-red-50 text-red-600",
	Offer: "bg-amber-50 text-amber-600",
};

type JobDetailsDrawerProps = {
	job: DashboardJob | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAddReminder: (job: DashboardJob) => void;
};

export function JobDetailsDrawer({
	job,
	open,
	onOpenChange,
	onAddReminder,
}: JobDetailsDrawerProps) {
	if (!job) {
		return null;
	}

	const applicationDate = job.status === "Saved" ? "-" : job.appliedDate;
	const savedDate = job.status === "Saved" ? job.appliedDate : job.savedDate;
	const canOpenSource = Boolean(job.source.url);

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				showCloseButton={false}
				overlayClassName="bg-white/6 backdrop-blur-[0.8px]"
				className="w-full gap-0 border-l border-slate-200 bg-white p-0 sm:max-w-lg"
			>
				<SheetHeader className="border-b border-slate-100 px-6 py-5">
					<div className="flex items-start justify-between gap-4">
						<div>
							<SheetTitle className="text-lg font-bold tracking-[-0.04em]">
								Job Details
							</SheetTitle>
							<SheetDescription className="sr-only">
								View job details for {job.title} at {job.company}.
							</SheetDescription>
						</div>

						<div className="flex items-center gap-1">
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="hover:bg-transparent"
								aria-label="Open original job post"
								title="Open original job post"
								disabled={!canOpenSource}
								onClick={() => {
									if (job.source.url) {
										window.open(
											job.source.url,
											"_blank",
											"noopener,noreferrer",
										);
									}
								}}
							>
								<ExternalLink className="size-4.5" aria-hidden="true" />
							</Button>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="text-slate-500 hover:bg-slate-100 hover:text-slate-950"
								onClick={() => onOpenChange(false)}
								aria-label="Close job details"
								title="Close"
							>
								<X className="size-5" aria-hidden="true" />
							</Button>
						</div>
					</div>
				</SheetHeader>

				<div className="flex-1 overflow-y-auto px-6 py-6">
					<div className="flex items-start gap-4 border-b border-slate-100 pb-6">
						<JobBrandMark
							brand={job.brand}
							className="size-14 rounded-md text-2xl"
						/>
						<div className="min-w-0 flex-1">
							<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
								<div className="min-w-0">
									<h2 className="truncate text-lg font-semibold tracking-[-0.03em] text-slate-950">
										{job.title}
									</h2>
									<p className="mt-1 text-base font-medium text-slate-500">
										{job.company}
									</p>
								</div>
								<span
									className={cn(
										"inline-flex shrink-0 rounded-sm px-2 py-0.5 text-xs font-bold",
										statusStyles[job.status],
									)}
								>
									{job.status}
								</span>
							</div>
						</div>
					</div>

					<div className="space-y-8 py-6">
						<JobDetailsSection title="Basic Info">
							<DetailsRow
								icon={BriefcaseBusiness}
								label="Job Type"
								value={job.jobType}
							/>
							<DetailsRow icon={Tag} label="Work Mode" value={job.workMode} />
							<DetailsRow icon={MapPin} label="Location" value={job.location} />
							<DetailsRow icon={Link2} label="Source" value={job.source.name} />
							<DetailsRow icon={Tag} label="Saved Date" value={savedDate} />
							<DetailsRow
								icon={Tag}
								label="Application Date"
								value={applicationDate}
							/>
							<ReminderRow
								reminder={job.reminder}
								onAddReminder={() => onAddReminder(job)}
							/>
						</JobDetailsSection>

						<JobDetailsSection title="Compensation">
							<DetailsRow
								icon={BadgeDollarSign}
								label="Salary"
								value={job.salary ?? "Not specified"}
							/>
						</JobDetailsSection>

						<JobDetailsSection title="Job Description">
							<div className="flex gap-3">
								<FileText
									className="mt-0.5 size-4 shrink-0 text-slate-400"
									aria-hidden="true"
								/>
								<p className="text-sm leading-6 text-slate-600">
									{job.description}
								</p>
							</div>
						</JobDetailsSection>

						<JobDetailsSection title="Links">
							<div className="flex gap-3">
								<Link2
									className="mt-0.5 size-4 shrink-0 text-slate-400"
									aria-hidden="true"
								/>
								{job.source.url ? (
									<a
										href={job.source.url}
										target="_blank"
										rel="noreferrer"
										className="text-sm font-semibold text-primary hover:underline"
									>
										Original Job Post
									</a>
								) : (
									<p className="text-sm text-slate-500">
										No source link available.
									</p>
								)}
							</div>
						</JobDetailsSection>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}

type JobDetailsSectionProps = {
	title: string;
	children: ReactNode;
};

function JobDetailsSection({ title, children }: JobDetailsSectionProps) {
	return (
		<section className="border-b border-slate-100 pb-6 last:border-b-0 last:pb-0">
			<h3 className="mb-4 text-base font-bold text-slate-950">{title}</h3>
			<div className="space-y-4">{children}</div>
		</section>
	);
}

type DetailsRowProps = {
	icon: ComponentType<{
		className?: string;
		"aria-hidden"?: AriaAttributes["aria-hidden"];
	}>;
	label: string;
	value: string;
};

function DetailsRow({ icon: Icon, label, value }: DetailsRowProps) {
	return (
		<div className="grid grid-cols-[24px_minmax(120px,160px)_minmax(0,1fr)] items-start gap-3">
			<Icon className="mt-0.5 size-4 text-slate-400" aria-hidden="true" />
			<span className="text-sm font-medium text-slate-500">{label}</span>
			<span className="text-sm font-medium text-slate-700">{value}</span>
		</div>
	);
}

function ReminderRow({
	reminder,
	onAddReminder,
}: {
	reminder: string;
	onAddReminder: () => void;
}) {
	const hasReminder = reminder !== "-";

	return (
		<div className="grid grid-cols-[24px_minmax(120px,160px)_minmax(0,1fr)] items-start gap-3">
			<Bell className="mt-0.5 size-4 text-slate-400" aria-hidden="true" />
			<span className="text-sm font-medium text-slate-500">Reminder</span>
			<div className="flex items-center gap-3">
				<span className="text-sm font-medium text-slate-700">{reminder}</span>
				<Button
					type="button"
					variant="ghost"
					className="h-auto px-0 py-0 text-sm font-semibold text-primary hover:bg-transparent hover:text-primary/80"
					onClick={onAddReminder}
				>
					{hasReminder ? "Update" : "Add reminder"}
				</Button>
			</div>
		</div>
	);
}
