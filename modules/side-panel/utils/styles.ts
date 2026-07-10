import type { JobStatus, RecentJob } from "@/modules/side-panel/types";

export const statusStyles: Record<JobStatus, string> = {
	Applied: "border-[#EEF2FF] bg-[#EEF2FF] text-[#4F46E5]",
	Interview: "border-[#FFF7E6] bg-[#FFF7E6] text-[#C66A00]",
	Saved: "border-[#F1F5F9] bg-[#F1F5F9] text-[#475569]",
	Rejected: "border-[#FEF2F2] bg-[#FEF2F2] text-[#DC2626]",
	Offer: "border-[#ECFDF3] bg-[#ECFDF3] text-[#15803D]",
};

export const lightStatusStyles = statusStyles;

export const brandStyles: Record<RecentJob["brand"], string> = {
	amazon: "bg-[#111827] text-white before:bg-blue-500",
	microsoft: "bg-slate-950 text-white",
	swiggy: "bg-orange-500 text-white",
	google: "bg-white text-slate-950",
	default: "bg-[#F1F0FF] text-[#5B55D6]",
};
