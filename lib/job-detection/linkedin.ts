import type { DetectedJob } from "@/lib/job-detection/types";
import { extractFormattedDescription } from "@/lib/job-detection/job-description";
import { detectLinkedInJob as detectSharedLinkedInJob } from "@/lib/job-detection/job-detectors";

/**
 * Runs in the LinkedIn tab. Keep this function self-contained because Chrome
 * serializes it when it is passed to browser.scripting.executeScript.
 */
export function detectLinkedInJobInPage(): DetectedJob | null {
	const cleanText = (value: unknown) =>
		String(value ?? "")
			.replace(/Â·/g, " · ")
			.replace(/â€¢/g, " · ")
			.replace(/\s+/g, " ")
			.trim();

	const getText = (selector: string, root: ParentNode = document) =>
		cleanText(root.querySelector(selector)?.textContent);

	const jobId = getSelectedJobId(window.location.href);
	const aboutSection = findAboutSection(jobId);
	if (!jobId && !aboutSection) {
		return null;
	}

	const jobLink = findSelectedJobLink(jobId, aboutSection);
	const jobContainer = findJobContainer(jobLink);
	const title = getTitle(jobLink, jobContainer);
	const jobCardText = getJobCardText(jobLink) || cleanText(jobContainer?.textContent);
	const descriptionElement = getDescriptionElement(aboutSection);
	const description = extractFormattedDescription(descriptionElement);
	const sharedDetected = detectSharedLinkedInJob();
	const companyCard = getCompanyCard(jobContainer);
	const fallbackCompany = getCompany(jobContainer, companyCard, jobCardText, title, description.text);
	const company = sharedDetected?.company || fallbackCompany;
	const fallbackLocation = getLocation(
		jobContainer,
		jobCardText,
		company,
		title,
		description.text,
	);
	const location = sharedDetected?.location || fallbackLocation;
	const logoUrl = getLogoUrl(companyCard, jobContainer);
	const workplaceType =
		sharedDetected?.workplaceType || getPreferenceMatch(jobContainer, "workplace type");
	const employmentType =
		sharedDetected?.employmentType || getPreferenceMatch(jobContainer, "job type");
	const resolvedTitle = sharedDetected?.title || title;
	const resolvedDescriptionText = description.text || sharedDetected?.description || "";
	const resolvedLogoUrl = sharedDetected?.logoUrl || logoUrl;
	const resolvedSalary = sharedDetected?.salary || getSalary(resolvedDescriptionText);
	const resolvedUrl = sharedDetected?.jobUrl || getCanonicalJobUrl(jobId);

	if (!resolvedTitle && !company && !location && !resolvedDescriptionText) {
		return null;
	}

	return {
		title: resolvedTitle,
		company,
		location,
		url: resolvedUrl,
		platform: "LinkedIn",
		descriptionText: resolvedDescriptionText,
		descriptionHtml: description.html || undefined,
		salary: resolvedSalary,
		logoUrl: resolvedLogoUrl,
		employmentType,
		workplaceType,
		confidence:
			resolvedTitle && company && location
				? "high"
				: resolvedTitle && company
					? "medium"
					: "low",
	};

	function getSelectedJobId(url: string) {
		try {
			const parsedUrl = new URL(url);
			const currentJobId = parsedUrl.searchParams.get("currentJobId");
			if (currentJobId) return currentJobId;

			return parsedUrl.pathname.match(/\/jobs\/view\/(\d+)/)?.[1] || "";
		} catch {
			return "";
		}
	}

	function findAboutSection(selectedJobId: string) {
		const keyedSection = document.querySelector<HTMLElement>(
			'[componentkey^="JobDetails_AboutTheJob_"]',
		);
		if (selectedJobId) {
			const exactSection = document.querySelector<HTMLElement>(
				`[componentkey="JobDetails_AboutTheJob_${selectedJobId}"]`,
			);
			if (exactSection) return exactSection;

			const renderedId = keyedSection?.getAttribute("componentkey")?.match(/(\d+)$/)?.[1];
			if (renderedId && renderedId !== selectedJobId) return null;
		}

		return (
			keyedSection ||
			document.querySelector('[data-sdui-component*="aboutTheJob"]') ||
			(Array.from(document.querySelectorAll("h2, h3, h4")).find(
				(element) => cleanText(element.textContent).toLowerCase() === "about the job",
			)?.parentElement ?? null)
		);
	}

	function findSelectedJobLink(selectedJobId: string, section: Element | null) {
		const jobLinks = Array.from(
			document.querySelectorAll<HTMLAnchorElement>('a[href*="/jobs/view/"]'),
		);

		if (selectedJobId) {
			const matchingLinks = jobLinks.filter((link) => link.href.includes(`/jobs/view/${selectedJobId}`));
			const matchedLink = section
				? matchingLinks.filter((link) => isBefore(link, section)).at(-1)
				: matchingLinks[0];
			if (matchedLink) return matchedLink;
		}

		return jobLinks.find((link) => cleanText(link.textContent).length > 2) || null;
	}

	function isBefore(first: Node, second: Node) {
		return Boolean(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING);
	}

	function findJobContainer(link: HTMLAnchorElement | null) {
		const detailsPanel = document.querySelector(
			".jobs-unified__job-details, .job-details-jobs-unified-top-card__container, .jobs-details",
		);
		if (detailsPanel) return detailsPanel;

		let container: Element | null = link;
		for (let depth = 0; container && depth < 6; depth += 1) {
			const text = cleanText(container.textContent);
			if (text.includes("\u2022") || container.querySelector("h1")) return container;
			container = container.parentElement;
		}

		return document.querySelector("main") || document.body;
	}

	function getJobCardText(link: HTMLAnchorElement | null) {
		let container: Element | null = link;
		for (let depth = 0; container && depth < 6; depth += 1) {
			const text = cleanText(container.textContent);
			if (text.includes("\u2022") && text.length <= 500) return text;
			container = container.parentElement;
		}

		return "";
	}

	function getTitle(link: HTMLAnchorElement | null, container: Element | null) {
		return (
			getText(
				".job-details-jobs-unified-top-card__job-title, .top-card-layout__title, [data-test-job-title], h1",
				container || document,
			) || cleanText(link?.textContent)
		);
	}

	function getCompanyCard(container: Element | null) {
		const root = container || document;

		return (
			root.querySelector('a[href*="/company/"] > div[aria-label^="Company,"]') ||
			root.querySelector('[aria-label^="Company,"]') ||
			root.querySelector('a[href*="/company/"]')
		);
	}

	function getCompany(
		container: Element | null,
		companyCard: Element | null,
		jobCardText: string,
		title: string,
		description: string,
	) {
		const labelledCompany =
			getDescriptionLabel(description, "Company Name") || getDescriptionLabel(description, "Company");
		if (labelledCompany) return labelledCompany;

		const companyCardLink = companyCard?.querySelector<HTMLAnchorElement>('a[href*="/company/"]');
		if (companyCardLink) {
			const companyName = normalizeCompanyName(companyCardLink.textContent);
			if (companyName) return companyName;
		}

		const companyAria = normalizeCompanyName(
			companyCard?.getAttribute("aria-label")?.replace(/^Company,\s*/i, "").replace(/\.$/, ""),
		);
		if (companyAria) return companyAria;

		const semanticCompany = getText(
			".job-details-jobs-unified-top-card__company-name, .topcard__org-name-link, [data-test-job-company-name]",
			container || document,
		);
		return normalizeCompanyName(semanticCompany || getCompanyAndLocation(jobCardText, title).company);
	}

	function getLogoUrl(companyCard: Element | null, container: Element | null) {
		const root = companyCard || container || document;
		const image = root.querySelector<HTMLImageElement>(
			'img[alt*="Company logo"], img[src*="company-logo"], .jobs-unified-top-card__company-logo img',
		);
		return image?.src || "";
	}

	function getPreferenceMatch(container: Element | null, kind: "workplace type" | "job type") {
		const root = container || document;
		const preferences = Array.from(
			root.querySelectorAll<HTMLElement>(".job-details-fit-level-preferences button"),
		);

		for (const preference of preferences) {
			const hiddenText = cleanText(
				preference.querySelector(".visually-hidden")?.textContent,
			).toLowerCase();
			if (!hiddenText.includes(kind)) continue;

			const strongText = cleanText(preference.querySelector("strong")?.textContent);
			if (strongText) return strongText;
		}

		return "";
	}

	function getLocation(
		container: Element | null,
		jobCardText: string,
		company: string,
		title: string,
		description: string,
	) {
		const labelledLocation = getDescriptionLabel(description, "Location");
		if (labelledLocation) return labelledLocation;

		const semanticLocation = getSemanticLocation(container || document, company);
		if (semanticLocation) return semanticLocation;

		const legacyLocation = getText(
			".topcard__flavor--bullet, [data-test-job-location]",
			container || document,
		);
		if (legacyLocation) return shortValue(normalizeLocation(legacyLocation, company));

		const metadataLocation = getMetadataLocation(container || document, company);
		if (metadataLocation) return metadataLocation;

		return shortValue(getCompanyAndLocation(jobCardText, title).location);
	}

	function getSemanticLocation(root: ParentNode, company: string) {
		const container = root.querySelector(
			".job-details-jobs-unified-top-card__primary-description-container",
		);
		if (!container) return "";

		const spanTexts = Array.from(container.querySelectorAll("span"))
			.map((span) => cleanText(span.textContent))
			.filter(Boolean);

		const firstLocationLike = spanTexts.find(
			(text) =>
				!/[·]/.test(text) &&
				!/(?:applicants?|clicked apply|weeks? ago|days? ago|hours? ago|minutes? ago|months? ago|promoted by hirer|response insights)/i.test(
					text,
				),
		);
		if (firstLocationLike) return shortValue(normalizeLocation(firstLocationLike, company));

		const rawText = cleanText(container.textContent).split(/\s*·\s*/)[0] || "";
		return shortValue(normalizeLocation(rawText, company));
	}

	function getMetadataLocation(root: ParentNode, company: string) {
		const metadataRows = Array.from(root.querySelectorAll("p, div")).filter((element) => {
			const text = cleanText(element.textContent);
			return (
				text.includes("·") &&
				/(?:clicked apply|applicants?|weeks? ago|days? ago|hours? ago|minutes? ago|months? ago)/i.test(text)
			);
		});

		for (const row of metadataRows) {
			const firstSpanText = Array.from(row.querySelectorAll("span"))
				.map((span) => cleanText(span.textContent))
				.find(
					(text) =>
						Boolean(text) &&
						!/(?:clicked apply|applicants?|weeks? ago|days? ago|hours? ago|minutes? ago|months? ago)/i.test(
							text,
						),
				);

			const rawText = firstSpanText || cleanText(row.textContent).split(/\s*·\s*/)[0] || "";
			const normalized = normalizeLocation(rawText, company);
			if (normalized) {
				return shortValue(normalized);
			}
		}

		return "";
	}

	function getDescriptionLabel(value: string, label: string) {
		const nextLabel =
			"Company Name|Company|Location|Job Type|Employment Type|Workplace Type|Job ID|About The Role|Responsibilities|Requirements";
		const match = value.match(
			new RegExp(`${escapeRegExp(label)}\\s*:\\s*(.+?)(?=\\s+(?:${nextLabel})\\s*:|$)`, "i"),
		);
		return shortValue(match?.[1]);
	}

	function shortValue(value: string | undefined, maximumLength = 160) {
		const normalized = cleanText(value);
		return normalized.length > 0 && normalized.length <= maximumLength ? normalized : "";
	}

	function normalizeCompanyName(value: string | undefined) {
		return shortValue(value?.replace(/\s+logo$/i, ""));
	}

	function firstLocationPart(value: string) {
		const parts = cleanText(value)
			.split(",")
			.map((part) => cleanText(part))
			.filter(Boolean);

		if (parts.length >= 2) {
			return shortValue(`${parts[0]}, ${parts[parts.length - 1]}`);
		}

		return shortValue(parts[0] || "");
	}

	function getCompanyAndLocation(value: string, title: string) {
		const parts = cleanText(value)
			.split(/\s*\u2022\s*/)
			.map(cleanText)
			.filter(Boolean);
		const locationIndex = parts.findIndex(
			(part, index) => index > 0 && /\b(remote|hybrid|on-site)\b|,/.test(part),
		);

		return {
			company: cleanText(parts[0]?.replace(title, "")),
			location: locationIndex >= 0 ? firstLocationPart(parts[locationIndex]) : "",
		};
	}

	function normalizeLocation(value: string, company: string) {
		const normalized = cleanText(value)
			.replace(new RegExp(`^${escapeRegExp(company)}\\s*[\\u2022|,-]?\\s*`, "i"), "")
			.replace(/\s*\u2022\s*(?:reposted|posted|\d+\s+applicants?).*$/i, "");
		return firstLocationPart(normalized);
	}

	function getDescriptionElement(section: Element | null): HTMLElement | null {
		return (
			(section || document).querySelector<HTMLElement>('[data-testid="expandable-text-box"]') ||
			document.querySelector<HTMLElement>(".jobs-description-content__text") ||
			document.querySelector<HTMLElement>(".description__text") ||
			document.querySelector<HTMLElement>("#job-details") ||
			getDescriptionFallbackElement(section)
		);
	}

	function getDescriptionFallbackElement(section: Element | null): HTMLElement | null {
		const heading = Array.from((section || document).querySelectorAll("h2, h3, span, div")).find(
			(element) => cleanText(element.textContent).toLowerCase() === "about the job",
		);
		if (section instanceof HTMLElement) return section;
		const fallback = heading?.parentElement?.parentElement;
		return fallback instanceof HTMLElement ? fallback : null;
	}

	function getSalary(value: string) {
		const match = value.match(
			/(?:\$|\u20ac|\u00a3|\u09f3|USD|EUR|GBP|BDT)\s?[\d,.]+(?:\s*(?:-|to)\s*(?:\$|\u20ac|\u00a3|\u09f3|USD|EUR|GBP|BDT)?\s?[\d,.]+)?/i,
		);
		return cleanText(match?.[0]);
	}

	function escapeRegExp(value: string) {
		return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}

	function getCanonicalJobUrl(selectedJobId: string) {
		return selectedJobId
			? `https://www.linkedin.com/jobs/view/${selectedJobId}/`
			: window.location.href;
	}
}
