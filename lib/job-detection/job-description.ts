import DOMPurify from "dompurify";

export interface FormattedDescription {
	html: string;
	text: string;
}

const ALLOWED_TAGS = [
	"p",
	"div",
	"span",
	"br",
	"ul",
	"ol",
	"li",
	"strong",
	"b",
	"em",
	"i",
	"u",
	"a",
	"h1",
	"h2",
	"h3",
	"h4",
	"blockquote",
	"pre",
	"code",
];

const ALLOWED_ATTRIBUTES = ["href", "title"];

function normalizeDescriptionText(value: string): string {
	return value
		.replace(/\r\n/g, "\n")
		.split("\n")
		.map((line) => line.replace(/[ \t]+/g, " ").trim())
		.reduce<string[]>((lines, line) => {
			const previousLine = lines.at(-1);

			if (line === "" && previousLine === "") {
				return lines;
			}

			lines.push(line);
			return lines;
		}, [])
		.join("\n")
		.trim();
}

function prepareDescriptionElement(source: HTMLElement): HTMLElement {
	const clone = source.cloneNode(true) as HTMLElement;

	clone
		.querySelectorAll(
			[
				"script",
				"style",
				"noscript",
				"iframe",
				"svg",
				"canvas",
				"button",
				"form",
				"input",
				"textarea",
				"select",
				"[hidden]",
				'[aria-hidden="true"]',
			].join(","),
		)
		.forEach((element) => element.remove());

	clone.querySelectorAll<HTMLElement>("*").forEach((element) => {
		const tagName = element.tagName.toLowerCase();

		Array.from(element.attributes).forEach((attribute) => {
			const keepHref = tagName === "a" && attribute.name === "href";
			const keepTitle = attribute.name === "title";

			if (!keepHref && !keepTitle) {
				element.removeAttribute(attribute.name);
			}
		});

		if (tagName === "a") {
			const href = element.getAttribute("href");

			if (href) {
				try {
					element.setAttribute("href", new URL(href, window.location.href).href);
				} catch {
					element.removeAttribute("href");
				}
			}
		}
	});

	return clone;
}

function sanitizeHtml(value: string): string {
	return DOMPurify.sanitize(value, {
		ALLOWED_TAGS,
		ALLOWED_ATTR: ALLOWED_ATTRIBUTES,
		ALLOW_DATA_ATTR: false,
	});
}

export function extractFormattedDescription(
	source: HTMLElement | null,
): FormattedDescription {
	if (!source) {
		return { html: "", text: "" };
	}

	const preparedElement = prepareDescriptionElement(source);
	const text = normalizeDescriptionText(
		preparedElement.innerText || preparedElement.textContent || "",
	);
	const html = sanitizeHtml(preparedElement.innerHTML);

	return { html, text };
}

export function extractFormattedDescriptionFromHtml(
	rawHtml: string | null | undefined,
): FormattedDescription {
	if (!rawHtml?.trim()) {
		return { html: "", text: "" };
	}

	const wrapper = document.createElement("div");
	wrapper.innerHTML = sanitizeHtml(rawHtml);

	return extractFormattedDescription(wrapper);
}
