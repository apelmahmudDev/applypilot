import { BriefcaseBusiness } from "lucide-react";

import { cn } from "@/lib/utils";
import type { RecentJob } from "@/modules/side-panel/types";
import { brandStyles } from "@/modules/side-panel/utils/styles";

type CompanyMarkProps = {
	brand: RecentJob["brand"];
	logoUrl?: string;
	companyName?: string;
	size?: "sm" | "lg";
	appearance?: "default" | "soft";
};

export function CompanyMark({
	brand,
	logoUrl,
	companyName,
	size = "sm",
	appearance = "default",
}: CompanyMarkProps) {
	const sizeClass =
		size === "lg"
			? "size-[62px] rounded-lg text-4xl"
			: "size-9 rounded-md text-xl";
	const iconClass = size === "lg" ? "size-8" : "size-5";
	const isSoftDefault = appearance === "soft" && brand === "default";

	if (logoUrl) {
		return (
			<div
				className={cn(
					"flex shrink-0 items-center justify-center overflow-hidden bg-white",
					sizeClass,
				)}
			>
				<img
					src={logoUrl}
					alt={companyName ? `${companyName} logo` : "Company logo"}
					className="size-full object-cover"
				/>
			</div>
		);
	}

	if (brand === "microsoft") {
		return (
			<div
				className={cn(
					"grid shrink-0 grid-cols-2 gap-0.5 bg-slate-950",
					sizeClass,
					size === "lg" ? "p-3" : "p-1",
				)}
			>
				<span className="bg-red-500" />
				<span className="bg-green-500" />
				<span className="bg-blue-500" />
				<span className="bg-yellow-400" />
			</div>
		);
	}

	const label =
		brand === "amazon"
			? "a"
			: brand === "swiggy"
				? "S"
				: brand === "google"
					? "G"
					: null;

	return (
		<div
			className={cn(
				"relative flex shrink-0 items-center justify-center font-bold",
				sizeClass,
				isSoftDefault ? "bg-accent text-accent-foreground" : brandStyles[brand],
				brand === "amazon" &&
					"after:absolute after:bottom-1 after:h-0.5 after:w-5 after:rounded-full after:bg-orange-400",
			)}
		>
			{label ? (
				<span>{label}</span>
			) : (
				<BriefcaseBusiness className={iconClass} aria-hidden="true" />
			)}
		</div>
	);
}
