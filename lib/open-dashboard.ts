export async function openDashboard() {
	await browser.tabs.create({
		url: browser.runtime.getURL("/dashboard.html"),
	});
	window.close();
}
