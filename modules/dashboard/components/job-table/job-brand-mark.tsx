import { cn } from "@/lib/utils";
import type { DashboardJob } from "@/modules/dashboard/types";

const brandContent: Record<
	DashboardJob["brand"],
	{ label: string; className: string }
> = {
	figma: {
		label: "F",
		className:
			"bg-gradient-to-br from-orange-500 via-pink-500 to-blue-500 text-white",
	},
	vercel: {
		label: "V",
		className: "bg-black text-white",
	},
	airbnb: {
		label: "A",
		className: "bg-rose-500 text-white",
	},
	hubspot: {
		label: "H",
		className: "bg-orange-500 text-white",
	},
	notion: {
		label: "N",
		className: "bg-white text-black shadow-sm ring-1 ring-slate-300",
	},
	spotify: {
		label: "S",
		className: "bg-green-500 text-white",
	},
	linear: {
		label: "L",
		className: "bg-slate-950 text-white",
	},
	calendly: {
		label: "C",
		className: "bg-blue-600 text-white",
	},
	plaid: {
		label: "P",
		className: "bg-black text-white",
	},
	canva: {
		label: "C",
		className: "bg-cyan-500 text-white",
	},
};

type JobBrandMarkProps = {
	brand: DashboardJob["brand"];
	className?: string;
};

export function JobBrandMark({ brand, className }: JobBrandMarkProps) {
	const content = brandContent[brand];

	return (
		<div
			className={cn(
				"flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-black",
				content.className,
				className,
			)}
		>
			{content.label}
		</div>
	);
}
