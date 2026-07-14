import type { DashboardView } from "@/modules/dashboard/navigation";

export async function openDashboard(view?: DashboardView) {
	await browser.tabs.create({
		url: browser.runtime.getURL(
			view ? `/dashboard.html#${view}` : "/dashboard.html",
		),
	});
	window.close();
}
