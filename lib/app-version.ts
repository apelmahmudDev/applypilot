import packageJson from "../package.json";

export function getAppVersion() {
	return packageJson.version || "0.0.0";
}

export function getAppVersionLabel() {
	return `v${getAppVersion()}`;
}
