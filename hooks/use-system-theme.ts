import { useEffect, useState } from "react";

function getSystemDarkMode() {
	return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applySystemTheme(isDarkMode: boolean) {
	document.documentElement.classList.toggle("dark", isDarkMode);
	document.documentElement.style.colorScheme = isDarkMode ? "dark" : "light";
}

export function useSystemTheme() {
	const [isDarkMode, setIsDarkMode] = useState(getSystemDarkMode);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		function handleSystemThemeChange(event: MediaQueryListEvent) {
			setIsDarkMode(event.matches);
			applySystemTheme(event.matches);
		}

		setIsDarkMode(mediaQuery.matches);
		applySystemTheme(mediaQuery.matches);
		mediaQuery.addEventListener("change", handleSystemThemeChange);

		return () => {
			mediaQuery.removeEventListener("change", handleSystemThemeChange);
		};
	}, []);

	return { isDarkMode };
}
