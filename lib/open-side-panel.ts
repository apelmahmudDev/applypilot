type ChromeSidePanel = {
	open: (options: { windowId: number }) => Promise<void> | void;
};

type GlobalWithChromeSidePanel = typeof globalThis & {
	chrome?: {
		sidePanel?: ChromeSidePanel;
	};
};

export async function openSidePanel() {
	const sidePanel = (globalThis as GlobalWithChromeSidePanel).chrome?.sidePanel;

	if (!sidePanel?.open) {
		return;
	}

	const currentWindow = await browser.windows.getCurrent();

	if (typeof currentWindow.id !== "number") {
		return;
	}

	await sidePanel.open({ windowId: currentWindow.id });
	window.close();
}
