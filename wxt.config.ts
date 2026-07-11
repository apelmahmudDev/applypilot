import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ["@wxt-dev/module-react"],
	manifest: {
		name: "Applypilot",
		short_name: "Applypilot",
		permissions: ["activeTab", "scripting", "sidePanel", "storage"],
		host_permissions: ["*://*.linkedin.com/*"],
	},
	vite: () => ({
		plugins: [tailwindcss()],
	}),
});
