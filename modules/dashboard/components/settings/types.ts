import type { LucideIcon } from "lucide-react";
import type { DashboardSettings } from "@/lib/settings/storage";

export type SettingsSelectOption = {
	value: string;
	label: string;
};

export type SettingsPreferenceId = keyof DashboardSettings;

export type SettingsPreferenceItem = {
	id: SettingsPreferenceId;
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
