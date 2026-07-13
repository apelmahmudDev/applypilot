import type { LucideIcon } from "lucide-react";

export type ExportItem = {
	id: string;
	title: string;
	description: string;
	icon: LucideIcon;
	iconClassName: string;
};

export type ExportFormatOption = {
	id: "json" | "csv";
	title: string;
	description: string;
	extension: string;
};

export type ExportInfoItem = {
	id: string;
	title: string;
	description: string;
	icon: LucideIcon;
	iconClassName: string;
};
