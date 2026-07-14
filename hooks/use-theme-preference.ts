import { useEffect, useState } from "react";

import {
	getStoredThemePreference,
	setStoredThemePreference,
	THEME_STORAGE_KEY,
	type ThemePreference,
} from "@/lib/theme/storage";

function getSystemDarkMode() {
	return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(theme: ThemePreference) {
	const isDarkMode = theme === "dark";
	document.documentElement.classList.toggle("dark", isDarkMode);
	document.documentElement.style.colorScheme = isDarkMode ? "dark" : "light";
}

export function useThemePreference() {
	const [theme, setTheme] = useState<ThemePreference>(
		getSystemDarkMode() ? "dark" : "light",
	);

	useEffect(() => {
		let isMounted = true;

		async function loadThemePreference() {
			const storedTheme = await getStoredThemePreference();
			const nextTheme = storedTheme ?? (getSystemDarkMode() ? "dark" : "light");

			if (!isMounted) {
				return;
			}

			setTheme(nextTheme);
			applyTheme(nextTheme);
		}

		void loadThemePreference();

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		function handleSystemThemeChange(event: MediaQueryListEvent) {
			void getStoredThemePreference().then((storedTheme) => {
				if (storedTheme || !isMounted) {
					return;
				}

				const nextTheme = event.matches ? "dark" : "light";
				setTheme(nextTheme);
				applyTheme(nextTheme);
			});
		}

		const handleStorageChange: Parameters<
			typeof browser.storage.onChanged.addListener
		>[0] = (changes, areaName) => {
			if (areaName !== "local" || !changes[THEME_STORAGE_KEY]) {
				return;
			}

			const nextValue = changes[THEME_STORAGE_KEY].newValue;
			const nextTheme =
				nextValue === "light" || nextValue === "dark"
					? nextValue
					: getSystemDarkMode()
						? "dark"
						: "light";

			setTheme(nextTheme);
			applyTheme(nextTheme);
		};

		mediaQuery.addEventListener("change", handleSystemThemeChange);
		browser.storage.onChanged.addListener(handleStorageChange);

		return () => {
			isMounted = false;
			mediaQuery.removeEventListener("change", handleSystemThemeChange);
			browser.storage.onChanged.removeListener(handleStorageChange);
		};
	}, []);

	const updateTheme = async (nextTheme: ThemePreference) => {
		setTheme(nextTheme);
		applyTheme(nextTheme);
		await setStoredThemePreference(nextTheme);
	};

	return {
		theme,
		isDarkMode: theme === "dark",
		setTheme: updateTheme,
	};
}
