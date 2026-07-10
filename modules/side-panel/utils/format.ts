export function formatDate(value: string) {
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return "";
	}

	return new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	}).format(date);
}

export function formatDisplayUrl(url: string) {
	try {
		const parsedUrl = new URL(url);
		return `${parsedUrl.hostname.replace(/^www\./, "")}${parsedUrl.pathname}`;
	} catch {
		return url;
	}
}
