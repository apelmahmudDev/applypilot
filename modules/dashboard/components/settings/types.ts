import type { LucideIcon } from "lucide-react";

export type SettingsSelectOption = {
	value: string;
	label: string;
};

export type SettingsPreferenceItem = {
	id: string;
	label: string;
	description: string;
	defaultValue: string;
	options: SettingsSelectOption[];
};

export type SettingsSectionConfig = {
	title: string;
	description: string;
	icon: LucideIcon;
	iconClassName: string;
};
