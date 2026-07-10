import type { SidePanelJobForm } from "@/modules/side-panel/types";

export const emptyJobForm: SidePanelJobForm = {
	title: "",
	company: "",
	location: "",
	url: "",
	platform: "LinkedIn",
	salary: "",
	status: "Saved",
	deadline: "",
	followUpDate: "",
	followUpTime: "",
	reminderNote: "",
	reminderEnabled: false,
	reminderDone: false,
	notes: "",
};
