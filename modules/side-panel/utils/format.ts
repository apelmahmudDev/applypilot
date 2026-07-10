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

export function formatDateSlash(value: string) {
	const date = new Date(`${value}T00:00:00`);

	if (Number.isNaN(date.getTime())) {
		return value;
	}

	return new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(date);
}

export function formatTime(value: string) {
	if (!value) {
		return "";
	}

	const date = new Date(`1970-01-01T${value}:00`);

	if (Number.isNaN(date.getTime())) {
		return value;
	}

	return new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		minute: "2-digit",
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
