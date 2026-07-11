import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

const aiApiBaseUrl = process.env.WXT_AI_API_BASE_URL?.trim() ?? "";
const analyzeJobHostPermission = getHostPermission(aiApiBaseUrl);

// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ["@wxt-dev/module-react"],
	manifest: {
		name: "Applypilot",
		short_name: "Applypilot",
		permissions: ["activeTab", "scripting", "sidePanel", "storage"],
		host_permissions: [
			"http://*/*",
			"https://*/*",
			"*://*.linkedin.com/*",
			...(analyzeJobHostPermission ? [analyzeJobHostPermission] : []),
		],
	},
	vite: () => ({
		plugins: [tailwindcss()],
	}),
});

function getHostPermission(endpoint: string) {
	if (!endpoint) {
		return "";
	}

	try {
		const url = new URL(endpoint);
		return `${url.protocol}//${url.host}/*`;
	} catch {
		return "";
	}
}
