import { cn } from "@/lib/utils";
import type { RecentJob } from "@/modules/side-panel/types";
import { brandStyles } from "@/modules/side-panel/utils/styles";

type CompanyMarkProps = {
	brand: RecentJob["brand"];
	size?: "sm" | "lg";
};

export function CompanyMark({ brand, size = "sm" }: CompanyMarkProps) {
	const sizeClass = size === "lg" ? "size-[72px] rounded-lg text-4xl" : "size-9 rounded-md text-xl";

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
					: "A";

	return (
		<div
			className={cn(
				"relative flex shrink-0 items-center justify-center font-bold",
				sizeClass,
				brandStyles[brand],
				brand === "amazon" &&
					"after:absolute after:bottom-1 after:h-0.5 after:w-5 after:rounded-full after:bg-orange-400",
			)}
		>
			{label}
		</div>
	);
}
