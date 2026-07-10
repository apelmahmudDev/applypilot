import type { JobStatus, RecentJob } from "@/modules/side-panel/types";

export const statusStyles: Record<JobStatus, string> = {
	Applied: "border-blue-400/20 bg-blue-500/15 text-blue-300",
	Interview: "border-amber-400/20 bg-amber-500/15 text-amber-300",
	Saved: "border-slate-400/15 bg-slate-500/15 text-slate-300",
	Rejected: "border-red-400/20 bg-red-500/15 text-red-300",
	Offer: "border-emerald-400/20 bg-emerald-500/15 text-emerald-300",
};

export const lightStatusStyles: Record<JobStatus, string> = {
	Applied: "border-blue-200 bg-blue-50 text-blue-700",
	Interview: "border-amber-200 bg-amber-50 text-amber-700",
	Saved: "border-slate-200 bg-slate-50 text-slate-700",
	Rejected: "border-red-200 bg-red-50 text-red-700",
	Offer: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export const lightCardShadow = "shadow-[0_1px_2px_rgba(15,23,42,0.04)]";

export const brandStyles: Record<RecentJob["brand"], string> = {
	amazon: "bg-[#111827] text-white before:bg-blue-500",
	microsoft: "bg-slate-950 text-white",
	swiggy: "bg-orange-500 text-white",
	google: "bg-white text-slate-950",
	default: "bg-blue-600 text-white",
};
