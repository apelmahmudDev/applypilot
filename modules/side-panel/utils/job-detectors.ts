export type JobSource = "linkedin" | "generic";

export interface DetectedJob {
	id?: string;
	title: string;
	company: string;
	sourceCompany?: string;
	location?: string;
	specificLocation?: string;
	salary?: string;
	description?: string;
	employmentType?: string;
	workplaceType?: string;
	experience?: string;
	skills?: string[];
	postedAt?: string;
	applicationDeadline?: string;
	applicants?: number;
	jobUrl: string;
	applyUrl?: string;
	logoUrl?: string;
	easyApply?: boolean;
	source: JobSource;
	sourceHost: string;
	confidence: number;
	detectedAt: string;
}

const LINKEDIN_HOST_RE = /(^|\.)linkedin\.com$/i;
const JOB_ID_RE = /\/jobs\/view\/(\d+)/i;

function cleanText(value?: string | null): string {
	return (value ?? "")
		.replace(/Â·/g, " · ")
		.replace(/â€¢/g, " · ")
		.replace(/â€¦/g, "...")
		.replace(/â€“/g, "–")
		.replace(/â€”/g, "—")
		.replace(/Â£/g, "£")
		.replace(/â‚¬/g, "€")
		.replace(/â‚¹/g, "₹")
		.replace(/\u00a0/g, " ")
		.replace(/[ \t]+/g, " ")
		.replace(/\s*\n\s*/g, "\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

function oneLine(value?: string | null): string {
	return cleanText(value)
		.replace(/\n+/g, " ")
		.replace(/\s{2,}/g, " ")
		.trim();
}

function elementText(element?: Element | null): string {
	if (!element) return "";
	return cleanText(
		element instanceof HTMLElement ? element.innerText : element.textContent,
	);
}

function queryFirst<T extends Element>(
	root: ParentNode,
	selectors: string[],
): T | null {
	for (const selector of selectors) {
		const result = root.querySelector<T>(selector);
		if (result) return result;
	}
	return null;
}

function queryAll<T extends Element>(root: ParentNode, selector: string): T[] {
	return Array.from(root.querySelectorAll<T>(selector));
}

function isBefore(a: Node, b: Node): boolean {
	return Boolean(
		a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING,
	);
}

function nearestElementBefore<T extends Element>(
	elements: T[],
	reference: Node,
): T | null {
	let nearest: T | null = null;

	for (const element of elements) {
		if (!isBefore(element, reference)) continue;
		if (!nearest || isBefore(nearest, element)) nearest = element;
	}

	return nearest;
}

function canonicalUrl(urlString: string): string {
	try {
		const url = new URL(urlString, window.location.href);
		url.hash = "";
		return url.toString();
	} catch {
		return window.location.href;
	}
}

function optionalCanonicalUrl(urlString?: string | null): string | undefined {
	if (!urlString) return undefined;
	try {
		const url = new URL(urlString, window.location.href);
		url.hash = "";
		return url.toString();
	} catch {
		return undefined;
	}
}

function unwrapLinkedInRedirect(urlString?: string | null): string | undefined {
	if (!urlString) return undefined;

	try {
		const url = new URL(urlString, window.location.href);
		if (
			LINKEDIN_HOST_RE.test(url.hostname) &&
			url.pathname.startsWith("/safety/go/")
		) {
			const destination = url.searchParams.get("url");
			return destination ? decodeURIComponent(destination) : url.toString();
		}
		return url.toString();
	} catch {
		return undefined;
	}
}

function extractLabel(text: string, labels: string[]): string | undefined {
	for (const label of labels) {
		const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const match = text.match(
			new RegExp(`(?:^|\\n)\\s*${escaped}\\s*:?\\s*([^\\n]+)`, "i"),
		);
		const value = oneLine(match?.[1]);
		if (value) return value;
	}
	return undefined;
}

function extractExperience(text: string): string | undefined {
	const labelled = extractLabel(text, ["Experience", "Experience required"]);
	if (labelled) return labelled;

	return (
		oneLine(
			text.match(
				/\b(\d+(?:\s*[-–—to]+\s*\d+)?\+?\s*(?:years?|yrs?)(?:\s+of\s+experience)?)\b/i,
			)?.[1],
		) || undefined
	);
}

function extractSalary(text: string): string | undefined {
	const labelled = text.match(
		/(?:^|\n)\s*(?:salary|salary range|pay|pay range|compensation|remuneration|base pay)\s*:?\s*([^\n]{2,120})/i,
	)?.[1];

	if (labelled && /\d/.test(labelled)) return oneLine(labelled);

	const currencyRange = text.match(
		/(?:৳|BDT|USD|EUR|GBP|INR|CAD|AUD|\$|€|£|₹)\s*\d[\d,.]*(?:\s*[kKmM])?(?:\s*(?:-|–|—|to)\s*(?:(?:৳|BDT|USD|EUR|GBP|INR|CAD|AUD|\$|€|£|₹)\s*)?\d[\d,.]*(?:\s*[kKmM])?)?(?:\s*(?:per|\/)?\s*(?:hour|day|week|month|year|annum|hr|mo|yr))?/i,
	)?.[0];

	return currencyRange ? oneLine(currencyRange) : undefined;
}

function extractDeadline(text: string): string | undefined {
	return (
		extractLabel(text, [
			"Last Date of Application",
			"Application deadline",
			"Closing date",
			"Valid through",
		]) ??
		(oneLine(
			text.match(
				/(?:application deadline|closing date|last date(?: of application)?)\s*:?\s*([^\n]+)/i,
			)?.[1],
		) ||
			undefined)
	);
}

function extractSkills(text: string): string[] | undefined {
	const labelled = extractLabel(text, [
		"Skills",
		"Required skills",
		"Key skills",
	]);
	if (!labelled) return undefined;

	const skills = labelled
		.split(/[,;|]/)
		.map(oneLine)
		.filter((skill) => skill.length >= 2 && skill.length <= 80);

	return skills.length ? Array.from(new Set(skills)) : undefined;
}

function findSectionByHeading(
	root: ParentNode,
	headingPattern: RegExp,
): Element | null {
	const headings = queryAll<HTMLElement>(root, "h1, h2, h3, h4");
	const heading = headings.find((item) =>
		headingPattern.test(oneLine(item.textContent)),
	);
	if (!heading) return null;

	let current: Element | null = heading.parentElement;
	for (let depth = 0; current && depth < 7; depth += 1) {
		const text = elementText(current);
		if (text.length >= 80 || current.matches("section, article"))
			return current;
		current = current.parentElement;
	}

	return heading.parentElement;
}

function getLinkedInJobId(doc: Document): string | undefined {
	const url = new URL(window.location.href);
	const pathId = url.pathname.match(JOB_ID_RE)?.[1];
	if (pathId) return pathId;

	const queryId = url.searchParams.get("currentJobId");
	if (queryId && /^\d+$/.test(queryId)) return queryId;

	const aboutComponent = doc.querySelector<HTMLElement>(
		'[componentkey^="JobDetails_AboutTheJob_"]',
	);
	const componentId = aboutComponent
		?.getAttribute("componentkey")
		?.match(/(\d+)$/)?.[1];
	if (componentId) return componentId;

	return undefined;
}

function findLinkedInAboutSection(
	doc: Document,
	jobId?: string,
): Element | null {
	const keyedSection = doc.querySelector<HTMLElement>(
		'[componentkey^="JobDetails_AboutTheJob_"]',
	);

	if (jobId) {
		const exact = doc.querySelector(
			`[componentkey="JobDetails_AboutTheJob_${jobId}"]`,
		);
		if (exact) return exact;

		// LinkedIn is an SPA. During a job switch, the URL can update before the
		// right-hand details pane. Do not combine the new job ID with stale content.
		const renderedId = keyedSection
			?.getAttribute("componentkey")
			?.match(/(\d+)$/)?.[1];
		if (renderedId && renderedId !== jobId) return null;
	}

	return (
		keyedSection ??
		doc.querySelector('[data-sdui-component*="aboutTheJob"]') ??
		findSectionByHeading(doc, /^about the job$/i)
	);
}

function findLinkedInDescriptionElement(
	aboutSection: Element | null,
): HTMLElement | null {
	if (!aboutSection) return null;

	return (
		aboutSection.querySelector<HTMLElement>(
			'[data-testid="expandable-text-box"]',
		) ??
		queryFirst<HTMLElement>(aboutSection, [
			".jobs-description-content__text",
			".jobs-box__html-content",
			".jobs-description__content",
			'[class*="jobs-description"]',
		])
	);
}

function findLinkedInTitleElement(
	doc: Document,
	aboutSection: Element | null,
	jobId?: string,
): HTMLElement | null {
	const classic = queryFirst<HTMLElement>(doc, [
		".job-details-jobs-unified-top-card__job-title h1",
		".jobs-unified-top-card__job-title",
		".jobs-details-top-card__job-title",
	]);
	if (classic && oneLine(classic.textContent)) return classic;

	if (jobId && aboutSection) {
		const anchors = queryAll<HTMLAnchorElement>(
			doc,
			`a[href*="/jobs/view/${jobId}"]`,
		).filter((anchor) => oneLine(anchor.textContent));

		const nearest = nearestElementBefore(anchors, aboutSection);
		if (nearest) return nearest;
	}

	if (aboutSection) {
		const headings = queryAll<HTMLElement>(doc, "h1, h2").filter(
			(heading) => !/^about the job$/i.test(oneLine(heading.textContent)),
		);
		const nearest = nearestElementBefore(headings, aboutSection);
		if (nearest) return nearest;
	}

	return queryFirst<HTMLElement>(doc, ["main h1", "h1"]);
}

function findLinkedInHeaderContainer(
	titleElement: Element | null,
): Element | null {
	let current = titleElement?.parentElement ?? null;
	let fallback = current;

	for (let depth = 0; current && depth < 10; depth += 1) {
		const text = elementText(current);
		const hasCompany = Boolean(
			current.querySelector('a[href*="/company/"]') ||
			current.querySelector('[aria-label^="Company,"]'),
		);
		const hasApply = Boolean(current.querySelector('[aria-label*="Apply"]'));
		const hasPostingMetadata = /\b(?:reposted|posted)\b/i.test(text);

		if (hasCompany && (hasApply || hasPostingMetadata) && text.length < 6000) {
			return current;
		}

		if (text.length < 3000) fallback = current;
		current = current.parentElement;
	}

	return fallback;
}

function splitLinkedInMetadataParts(text: string): string[] {
	return cleanText(text)
		.split(/\s*[·•]\s*/)
		.map(oneLine)
		.filter(Boolean);
}

function extractWorkplaceTypeFromText(text: string): string | undefined {
	const match = text.match(/\b(remote|hybrid|on-site|onsite)\b/i)?.[1];
	if (!match) return undefined;

	if (/^onsite$/i.test(match)) return "On-site";
	return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
}

function findLinkedInMetadataText(header: Element | null): string | undefined {
	if (!header) return undefined;

	const candidates = queryAll<HTMLElement>(header, "p, span, div")
		.map((element) => elementText(element))
		.filter((text) =>
			/\b(?:reposted|posted|people\s+clicked\s+apply|applicants?)\b/i.test(
				text,
			),
		)
		.sort((a, b) => a.length - b.length);

	return candidates[0];
}

function cleanLinkedInLocationValue(
	text: string,
	company?: string,
): string | undefined {
	const normalized = oneLine(text)
		.replace(/\((remote|hybrid|on-site|onsite)\)/gi, "")
		.replace(/\b(remote|hybrid|on-site|onsite)\b/gi, "")
		.replace(/\b(?:reposted|posted)\b.*$/i, "")
		.replace(/\b\d[\d,]*\s+(?:people\s+clicked\s+apply|applicants?)\b.*$/i, "")
		.replace(/[·•,\s]+$/g, "")
		.trim();

	if (!normalized) return undefined;
	if (company && normalized.toLowerCase() === oneLine(company).toLowerCase())
		return undefined;
	return normalized;
}

function findLinkedInCompanyCard(
	header: Element | null,
	doc: Document,
): Element | null {
	const root = header ?? doc;

	return (
		root.querySelector('a[href*="/company/"] > div[aria-label^="Company,"]') ??
		root.querySelector('[aria-label^="Company,"]') ??
		root.querySelector('a[href*="/company/"]')
	);
}

function findLinkedInHeaderCompany(
	header: Element | null,
	doc: Document,
): string | undefined {
	const companyCard = findLinkedInCompanyCard(header, doc);
	if (companyCard) {
		const companyLink = companyCard.querySelector<HTMLAnchorElement>(
			'a[href*="/company/"]',
		);
		if (companyLink) {
			const name = oneLine(companyLink.textContent);
			if (name) return name;
		}

		const cardLink =
			companyCard instanceof HTMLAnchorElement &&
			companyCard.href.includes("/company/")
				? companyCard
				: null;
		if (cardLink) {
			const name = oneLine(cardLink.textContent);
			if (name) return name;
		}

		const ariaLabel = companyCard
			.getAttribute("aria-label")
			?.match(/^Company,\s*(.+?)\.?$/i)?.[1];
		if (ariaLabel) return oneLine(ariaLabel) || undefined;
	}

	const root = header ?? doc;

	const classic = queryFirst<HTMLElement>(root, [
		".job-details-jobs-unified-top-card__company-name",
		".jobs-unified-top-card__company-name",
		".jobs-details-top-card__company-info a",
	]);
	if (classic) return oneLine(classic.textContent) || undefined;

	const companyLink = root.querySelector<HTMLAnchorElement>(
		'a[href*="/company/"]',
	);
	if (companyLink) return oneLine(companyLink.textContent) || undefined;

	const ariaCompany = root.querySelector<HTMLElement>(
		'[aria-label^="Company,"]',
	);
	const ariaLabel = ariaCompany
		?.getAttribute("aria-label")
		?.match(/^Company,\s*(.+?)\.?$/i)?.[1];
	return oneLine(ariaLabel) || undefined;
}

function findLinkedInLogoUrl(
	header: Element | null,
	doc: Document,
): string | undefined {
	const companyCard = findLinkedInCompanyCard(header, doc);
	const root = companyCard ?? header ?? doc;

	return queryFirst<HTMLImageElement>(root, [
		'img[alt*="Company logo"]',
		'img[src*="company-logo"]',
		".jobs-unified-top-card__company-logo img",
	])?.src;
}

function findLinkedInLocation(header: Element | null): string | undefined {
	if (!header) return undefined;

	const classic = queryFirst<HTMLElement>(header, [
		".job-details-jobs-unified-top-card__primary-description-container",
		".jobs-unified-top-card__bullet",
		".jobs-unified-top-card__sub-title",
		".jobs-details-top-card__bullet",
	]);

	if (classic) {
		const value = oneLine(classic.textContent).split(/\s+·\s+/)[0];
		if (value) return value;
	}

	const candidates = queryAll<HTMLElement>(header, "p, span, div")
		.map((element) => oneLine(element.textContent))
		.filter(
			(text) => /\b(?:reposted|posted)\b/i.test(text) && text.includes("·"),
		)
		.sort((a, b) => a.length - b.length);

	const value = candidates[0]?.split(/\s+·\s+/)[0];
	return value ? oneLine(value) : undefined;
}

function resolveLinkedInLocation(
	header: Element | null,
	company?: string,
): string | undefined {
	const semantic = cleanLinkedInLocationValue(
		findLinkedInLocation(header),
		company,
	);
	if (semantic) return semantic;

	const metadata = findLinkedInMetadataText(header);
	if (metadata) {
		const fromMetadata = cleanLinkedInLocationValue(
			splitLinkedInMetadataParts(metadata)[0],
			company,
		);
		if (fromMetadata) return fromMetadata;
	}

	if (!header) return undefined;

	const fallback = queryAll<HTMLElement>(header, "p, span, div")
		.map((element) => oneLine(element.textContent))
		.find(
			(text) =>
				/,\s*[A-Za-z]/.test(text) ||
				/\((?:remote|hybrid|on-site|onsite)\)/i.test(text),
		);

	return cleanLinkedInLocationValue(fallback, company);
}

function findExactText(root: ParentNode, values: string[]): string | undefined {
	const wanted = new Map(values.map((value) => [value.toLowerCase(), value]));
	const elements = queryAll<HTMLElement>(root, "a, button, span, li");

	for (const element of elements) {
		const text = oneLine(element.textContent).toLowerCase();
		const canonical = wanted.get(text);
		if (canonical) return canonical;
	}

	return undefined;
}

function findLinkedInApply(
	header: Element | null,
	canonicalJobUrl: string,
): { applyUrl?: string; easyApply: boolean } {
	const root = header ?? document;
	const applyControl = queryFirst<HTMLElement>(root, [
		'a[aria-label*="Apply"]',
		'button[aria-label*="Easy Apply"]',
		'button[aria-label*="Apply"]',
		".jobs-apply-button",
	]);

	const easyApply = /easy apply/i.test(
		`${applyControl?.getAttribute("aria-label") ?? ""} ${oneLine(applyControl?.textContent)}`,
	);

	if (applyControl instanceof HTMLAnchorElement) {
		return {
			applyUrl: unwrapLinkedInRedirect(applyControl.href),
			easyApply,
		};
	}

	return {
		applyUrl: applyControl ? canonicalJobUrl : undefined,
		easyApply,
	};
}

export function detectLinkedInJob(
	doc: Document = document,
): DetectedJob | null {
	if (!LINKEDIN_HOST_RE.test(window.location.hostname)) return null;

	const jobId = getLinkedInJobId(doc);
	const aboutSection = findLinkedInAboutSection(doc, jobId);
	if (!jobId && !aboutSection) return null;

	const descriptionElement = findLinkedInDescriptionElement(aboutSection);
	const description = elementText(descriptionElement)
		.replace(/(?:…|\.\.\.)\s*more\s*$/i, "")
		.trim();

	const titleElement = findLinkedInTitleElement(doc, aboutSection, jobId);
	const title = oneLine(titleElement?.textContent);
	if (!title) return null;

	const header = findLinkedInHeaderContainer(titleElement);
	const headerText = elementText(header);
	const metadataText = findLinkedInMetadataText(header) ?? headerText;
	const sourceCompany = findLinkedInHeaderCompany(header, doc);
	const labelledCompany = extractLabel(description, [
		"Company Name",
		"Company",
	]);
	const company = labelledCompany || sourceCompany || "";

	const headerLocation = resolveLinkedInLocation(
		header,
		company || sourceCompany,
	);
	const specificLocation = extractLabel(description, ["Location"]);
	const employmentType =
		findExactText(header ?? doc, [
			"Full-time",
			"Part-time",
			"Contract",
			"Temporary",
			"Internship",
			"Volunteer",
			"Other",
		]) ?? extractLabel(description, ["Job Type", "Employment Type"]);
	const workplaceType =
		findExactText(header ?? doc, ["Remote", "Hybrid", "On-site"]) ??
		extractWorkplaceTypeFromText(
			`${headerLocation ?? ""} ${specificLocation ?? ""} ${metadataText}`,
		) ??
		extractLabel(description, ["Workplace Type", "Workplace"]);

	const postedAt =
		oneLine(headerText.match(/\b(?:reposted|posted)\s+([^·\n]+)/i)?.[0]) ||
		undefined;
	const applicantsText = metadataText.match(
		/\b(\d[\d,]*)\s+(?:people\s+clicked\s+apply|applicants?)\b/i,
	)?.[1];

	const canonicalJobUrl = jobId
		? `https://www.linkedin.com/jobs/view/${jobId}/`
		: canonicalUrl(window.location.href);
	const apply = findLinkedInApply(header, canonicalJobUrl);

	const paySection = findSectionByHeading(
		doc,
		/^(?:base )?pay range$|salary|compensation/i,
	);
	const salary = extractSalary(`${description}\n${elementText(paySection)}`);

	const logoUrl = findLinkedInLogoUrl(header, doc);

	let confidence = 0.75;
	if (jobId) confidence += 0.08;
	if (company) confidence += 0.05;
	if (description.length > 120) confidence += 0.08;
	if (aboutSection) confidence += 0.04;

	return {
		id: jobId,
		title,
		company,
		sourceCompany:
			sourceCompany && sourceCompany !== company ? sourceCompany : undefined,
		location: headerLocation || specificLocation,
		specificLocation:
			specificLocation && specificLocation !== headerLocation
				? specificLocation
				: undefined,
		salary,
		description: description || undefined,
		employmentType,
		workplaceType,
		experience: extractExperience(description),
		skills: extractSkills(description),
		postedAt,
		applicationDeadline: extractDeadline(description),
		applicants: applicantsText
			? Number(applicantsText.replace(/,/g, ""))
			: undefined,
		jobUrl: canonicalJobUrl,
		applyUrl: apply.applyUrl,
		logoUrl,
		easyApply: apply.easyApply,
		source: "linkedin",
		sourceHost: window.location.hostname,
		confidence: Math.min(confidence, 0.99),
		detectedAt: new Date().toISOString(),
	};
}

function decodeHtml(html?: string): string {
	if (!html) return "";
	const parsed = new DOMParser().parseFromString(html, "text/html");
	return cleanText(parsed.body.innerText || parsed.body.textContent);
}

function findJobPosting(value: unknown): Record<string, any> | null {
	if (!value) return null;

	if (Array.isArray(value)) {
		for (const item of value) {
			const found = findJobPosting(item);
			if (found) return found;
		}
		return null;
	}

	if (typeof value !== "object") return null;
	const object = value as Record<string, any>;
	const type = object["@type"];
	if (
		type === "JobPosting" ||
		(Array.isArray(type) && type.includes("JobPosting"))
	) {
		return object;
	}

	for (const key of ["@graph", "mainEntity", "itemListElement"]) {
		const found = findJobPosting(object[key]);
		if (found) return found;
	}

	return null;
}

function readJsonLdJob(doc: Document): Record<string, any> | null {
	for (const script of queryAll<HTMLScriptElement>(
		doc,
		'script[type="application/ld+json"]',
	)) {
		try {
			const parsed = JSON.parse(script.textContent ?? "");
			const job = findJobPosting(parsed);
			if (job) return job;
		} catch {
			// Ignore malformed third-party JSON-LD and continue.
		}
	}
	return null;
}

function schemaAddress(location: any): string | undefined {
	const locations = Array.isArray(location)
		? location
		: location
			? [location]
			: [];
	const values = locations
		.map((entry) => entry?.address ?? entry)
		.map((address) => {
			if (typeof address === "string") return oneLine(address);
			return [
				address?.streetAddress,
				address?.addressLocality,
				address?.addressRegion,
				address?.postalCode,
				address?.addressCountry?.name ?? address?.addressCountry,
			]
				.filter(Boolean)
				.map(oneLine)
				.join(", ");
		})
		.filter(Boolean);

	return values.length ? Array.from(new Set(values)).join(" | ") : undefined;
}

function schemaSalary(baseSalary: any): string | undefined {
	if (!baseSalary) return undefined;
	if (typeof baseSalary === "string" || typeof baseSalary === "number") {
		return oneLine(String(baseSalary));
	}

	const currency = baseSalary.currency ?? baseSalary.value?.currency ?? "";
	const value = baseSalary.value ?? baseSalary;
	const min = value.minValue;
	const max = value.maxValue;
	const exact = value.value;
	const unit = value.unitText
		? ` per ${String(value.unitText).toLowerCase()}`
		: "";

	if (min != null || max != null) {
		return oneLine(
			`${currency} ${min ?? ""}${min != null && max != null ? " - " : ""}${max ?? ""}${unit}`,
		);
	}
	if (exact != null) return oneLine(`${currency} ${exact}${unit}`);
	return undefined;
}

function normalizeSkills(value: unknown): string[] | undefined {
	const raw = Array.isArray(value)
		? value
		: typeof value === "string"
			? value.split(/[,;|]/)
			: [];
	const skills = raw.map((item) => oneLine(String(item))).filter(Boolean);
	return skills.length ? Array.from(new Set(skills)) : undefined;
}

function detectFromJsonLd(doc: Document): DetectedJob | null {
	const job = readJsonLdJob(doc);
	if (!job) return null;

	const title = oneLine(job.title ?? job.name);
	const company = oneLine(
		job.hiringOrganization?.name ?? job.organization?.name,
	);
	const description = decodeHtml(job.description);
	if (!title || (!company && !description)) return null;

	const employmentType = Array.isArray(job.employmentType)
		? job.employmentType.map(oneLine).join(", ")
		: oneLine(job.employmentType) || undefined;
	const applicantLocation = schemaAddress(job.applicantLocationRequirements);
	const location = schemaAddress(job.jobLocation) ?? applicantLocation;
	const id =
		oneLine(job.identifier?.value ?? job.identifier ?? job.jobId) || undefined;

	return {
		id,
		title,
		company,
		location,
		salary: schemaSalary(job.baseSalary) ?? extractSalary(description),
		description: description || undefined,
		employmentType,
		workplaceType: /telecommute|remote/i.test(String(job.jobLocationType ?? ""))
			? "Remote"
			: undefined,
		experience:
			oneLine(job.experienceRequirements) || extractExperience(description),
		skills:
			normalizeSkills(job.skills ?? job.qualifications) ??
			extractSkills(description),
		postedAt: oneLine(job.datePosted) || undefined,
		applicationDeadline:
			oneLine(job.validThrough) || extractDeadline(description),
		jobUrl: canonicalUrl(job.url ?? window.location.href),
		applyUrl: canonicalUrl(job.url ?? window.location.href),
		logoUrl: optionalCanonicalUrl(
			job.hiringOrganization?.logo?.url ??
				job.hiringOrganization?.logo ??
				document.querySelector<HTMLMetaElement>('meta[property="og:image"]')
					?.content,
		),
		source: "generic",
		sourceHost: window.location.hostname,
		confidence: 0.96,
		detectedAt: new Date().toISOString(),
	};
}

function firstUsefulText(
	doc: Document,
	selectors: string[],
	minimumLength = 1,
): string | undefined {
	for (const selector of selectors) {
		for (const element of queryAll<HTMLElement>(doc, selector)) {
			const text = elementText(element);
			if (text.length >= minimumLength) return text;
		}
	}
	return undefined;
}

function metaContent(doc: Document, selectors: string[]): string | undefined {
	const element = queryFirst<HTMLMetaElement>(doc, selectors);
	return oneLine(element?.content) || undefined;
}

function findGenericApplyUrl(doc: Document): string {
	const candidates = queryAll<HTMLElement>(
		doc,
		"a[href], button[data-href], button[data-url]",
	);

	for (const element of candidates) {
		const label = oneLine(
			`${element.getAttribute("aria-label") ?? ""} ${element.textContent ?? ""}`,
		);
		if (!/^(?:easy\s+)?apply(?:\s+now)?$|apply for (?:this )?job/i.test(label))
			continue;

		const rawUrl =
			element instanceof HTMLAnchorElement
				? element.href
				: (element.getAttribute("data-href") ??
					element.getAttribute("data-url"));
		const url = optionalCanonicalUrl(rawUrl);
		if (url) return url;
	}

	return canonicalUrl(window.location.href);
}

function detectGenericDomJob(doc: Document): DetectedJob | null {
	const title =
		firstUsefulText(doc, [
			'[data-automation="job-detail-title"]',
			'[data-testid="job-title"]',
			'[data-testid*="job-title"]',
			'[itemprop="title"]',
			'h1[class*="job-title"]',
			".job-title h1",
			".job-title",
			"main h1",
			"h1",
		]) ?? metaContent(doc, ['meta[property="og:title"]']);

	const description = firstUsefulText(
		doc,
		[
			'[data-automation="jobAdDetails"]',
			'[data-testid="job-description"]',
			'[data-testid*="job-description"]',
			"#jobDescriptionText",
			'[itemprop="description"]',
			".job-description",
			'[class*="job-description"]',
			"main article",
			"article",
		],
		80,
	);

	const company =
		firstUsefulText(doc, [
			'[data-automation="advertiser-name"]',
			'[data-testid="company-name"]',
			'[data-testid*="company"]',
			'[itemprop="hiringOrganization"]',
			'[class*="company-name"]',
			".company-name",
			".company",
		]) ?? metaContent(doc, ['meta[property="og:site_name"]']);

	const location = firstUsefulText(doc, [
		'[data-automation="job-detail-location"]',
		'[data-testid="job-location"]',
		'[data-testid*="location"]',
		'[itemprop="jobLocation"]',
		'[class*="job-location"]',
		".job-location",
	]);

	const pageText = description ?? elementText(doc.body);
	const salaryElement = firstUsefulText(doc, [
		'[data-automation="job-detail-salary"]',
		'[data-testid="salary"]',
		'[data-testid*="salary"]',
		'[itemprop="baseSalary"]',
		'[class*="salary"]',
	]);

	let confidence = 0;
	if (title) confidence += 2;
	if (company) confidence += 2;
	if (description && description.length >= 180) confidence += 3;
	if (
		/\b(job|career|vacanc|position|role)\b/i.test(
			`${document.title} ${window.location.pathname}`,
		)
	) {
		confidence += 1;
	}
	if (/\b(responsibilit|qualification|requirements?|apply)\b/i.test(pageText))
		confidence += 1;

	if (!title || confidence < 5) return null;

	return {
		title: oneLine(title),
		company: oneLine(company) || window.location.hostname.replace(/^www\./, ""),
		location: oneLine(location) || undefined,
		salary: extractSalary(`${salaryElement ?? ""}\n${pageText}`),
		description: description || undefined,
		employmentType: extractLabel(pageText, ["Job Type", "Employment Type"]),
		workplaceType:
			oneLine(pageText.match(/\b(remote|hybrid|on-site|onsite)\b/i)?.[1]) ||
			undefined,
		experience: extractExperience(pageText),
		skills: extractSkills(pageText),
		postedAt: extractLabel(pageText, ["Date posted", "Posted"]),
		applicationDeadline: extractDeadline(pageText),
		jobUrl: canonicalUrl(window.location.href),
		applyUrl: findGenericApplyUrl(doc),
		logoUrl: metaContent(doc, ['meta[property="og:image"]']),
		source: "generic",
		sourceHost: window.location.hostname,
		confidence: Math.min(0.55 + confidence * 0.05, 0.9),
		detectedAt: new Date().toISOString(),
	};
}

export function detectGenericJob(doc: Document = document): DetectedJob | null {
	return detectFromJsonLd(doc) ?? detectGenericDomJob(doc);
}

export function detectCurrentJob(doc: Document = document): DetectedJob | null {
	return LINKEDIN_HOST_RE.test(window.location.hostname)
		? detectLinkedInJob(doc)
		: detectGenericJob(doc);
}
