import type { DetectedJob } from "@/lib/job-detection/types";

export async function detectJobFromActiveTab(): Promise<DetectedJob | null> {
	const [tab] = await browser.tabs.query({
		active: true,
		currentWindow: true,
	});

	if (!tab?.id || !tab.url || !isDetectableUrl(tab.url)) {
		return null;
	}

	const [result] = await browser.scripting.executeScript({
		target: { tabId: tab.id },
		func: detectJobInPage,
	});

	return result?.result ?? null;
}

function isDetectableUrl(url: string) {
	return /^https?:\/\//.test(url);
}

function detectJobInPage(): DetectedJob {
	type PartialDetectedJob = Partial<DetectedJob>;

	const url = window.location.href;
	const platform = detectPlatform(url);
	const platformLabel = formatPlatform(platform, url);

	const platformDetected = parsePlatformJob(platform);
	const structuredDetected = parseStructuredJobData();
	const metaDetected = parseMetaJobData();
	const genericDetected = parseGenericJobPage();

	const detected = mergeDetected(
		platformDetected,
		structuredDetected,
		metaDetected,
		genericDetected,
	);

	return {
		title: detected.title ?? "",
		company: detected.company ?? "",
		location: detected.location ?? "",
		url,
		platform: platformLabel,
		description: detected.description ?? "",
		salary: detected.salary ?? "",
		confidence: getConfidence(detected),
	};

	function detectPlatform(pageUrl: string) {
		const hostname = new URL(pageUrl).hostname.toLowerCase();

		if (hostname.includes("linkedin.com")) return "linkedin";
		if (hostname.includes("indeed.com")) return "indeed";
		if (hostname.includes("greenhouse.io")) return "greenhouse";
		if (hostname.includes("lever.co")) return "lever";
		if (hostname.includes("workdayjobs.com")) return "workday";
		if (hostname.includes("ashbyhq.com")) return "ashby";

		return "unknown";
	}

	function formatPlatform(platformName: string, pageUrl: string) {
		const labels: Record<string, string> = {
			linkedin: "LinkedIn",
			indeed: "Indeed",
			greenhouse: "Greenhouse",
			lever: "Lever",
			workday: "Workday",
			ashby: "Ashby",
		};

		if (labels[platformName]) return labels[platformName];

		return getMeta("og:site_name") || new URL(pageUrl).hostname.replace(/^www\./, "");
	}

	function parsePlatformJob(platformName: string): PartialDetectedJob {
		if (platformName === "linkedin") return parseLinkedInJob();
		if (platformName === "indeed") return parseIndeedJob();
		if (platformName === "greenhouse") return parseGreenhouseJob();
		if (platformName === "lever") return parseLeverJob();
		if (platformName === "workday") return parseWorkdayJob();
		if (platformName === "ashby") return parseAshbyJob();

		return {};
	}

	function parseLinkedInJob(): PartialDetectedJob {
		return {
			title:
				text(".top-card-layout__title") ||
				text(".job-details-jobs-unified-top-card__job-title") ||
				text("h1"),
			company:
				text(".topcard__org-name-link") ||
				text(".job-details-jobs-unified-top-card__company-name") ||
				text('[data-test-job-company-name]'),
			location:
				text(".topcard__flavor--bullet") ||
				text(".job-details-jobs-unified-top-card__primary-description-container"),
			description:
				text(".description__text") ||
				text(".jobs-description-content__text") ||
				text("#job-details"),
		};
	}

	function parseIndeedJob(): PartialDetectedJob {
		return {
			title: text('[data-testid="jobsearch-JobInfoHeader-title"]') || text("h1"),
			company:
				text('[data-testid="inlineHeader-companyName"]') ||
				text('[data-company-name="true"]'),
			location: text('[data-testid="job-location"]') || text("#jobLocationText"),
			description: text("#jobDescriptionText"),
		};
	}

	function parseGreenhouseJob(): PartialDetectedJob {
		return {
			title: text(".app-title") || text("h1"),
			company: text(".company-name") || getCompanyFromTitle(document.title),
			location: text(".location") || text('[data-qa="job-location"]'),
			description: text("#content") || text(".job__description"),
		};
	}

	function parseLeverJob(): PartialDetectedJob {
		return {
			title: text(".posting-headline h2") || text("h1"),
			company: text(".main-header-logo img", "alt") || getCompanyFromTitle(document.title),
			location: text(".posting-categories .location") || text(".location"),
			description: text(".section-wrapper.page-full-width") || text(".posting-page"),
		};
	}

	function parseWorkdayJob(): PartialDetectedJob {
		return {
			title:
				text('[data-automation-id="jobPostingHeader"]') ||
				text('[data-automation-id="job-title"]') ||
				text("h1"),
			company: getMeta("og:site_name") || getCompanyFromTitle(document.title),
			location: text('[data-automation-id="locations"]') || text('[data-automation-id="location"]'),
			description: text('[data-automation-id="jobPostingDescription"]'),
		};
	}

	function parseAshbyJob(): PartialDetectedJob {
		return {
			title: text("h1"),
			company: getMeta("og:site_name") || getCompanyFromTitle(document.title),
			location: text('[class*="location"]'),
			description: text('[class*="description"]') || text("main"),
		};
	}

	function parseStructuredJobData(): PartialDetectedJob {
		const scripts = Array.from(
			document.querySelectorAll('script[type="application/ld+json"]'),
		);

		for (const script of scripts) {
			try {
				const parsed = JSON.parse(script.textContent || "");
				const items = Array.isArray(parsed) ? parsed : [parsed];

				for (const item of items) {
					const jobPosting = findJobPosting(item);

					if (jobPosting) {
						return {
							title: cleanText(jobPosting.title),
							company: cleanText(jobPosting.hiringOrganization?.name),
							location: getStructuredLocation(jobPosting.jobLocation),
							description: stripHtml(jobPosting.description),
							salary: extractSalary(jobPosting),
						};
					}
				}
			} catch {
				continue;
			}
		}

		return {};
	}

	function findJobPosting(data: unknown): any {
		if (!data || typeof data !== "object") return null;

		const item = data as Record<string, any>;
		const type = item["@type"];
		const types = Array.isArray(type) ? type : [type];

		if (types.includes("JobPosting")) return item;

		for (const value of Object.values(item)) {
			if (Array.isArray(value)) {
				for (const child of value) {
					const found = findJobPosting(child);
					if (found) return found;
				}
			} else if (value && typeof value === "object") {
				const found = findJobPosting(value);
				if (found) return found;
			}
		}

		return null;
	}

	function parseMetaJobData(): PartialDetectedJob {
		const title = getMeta("og:title") || getMeta("twitter:title");
		const description =
			getMeta("description") || getMeta("og:description") || getMeta("twitter:description");

		return {
			title: removeCompanyFromTitle(title),
			company: getMeta("og:site_name") || getCompanyFromTitle(title || document.title),
			location: findLocationText(),
			description,
		};
	}

	function parseGenericJobPage(): PartialDetectedJob {
		const title = text("h1") || removeCompanyFromTitle(document.title);
		const company =
			text('[class*="company"]') ||
			text('[data-testid*="company"]') ||
			getMeta("og:site_name") ||
			getCompanyFromTitle(document.title);

		return {
			title,
			company,
			location: findLocationText(),
			description:
				text('[class*="description"]') ||
				text('[id*="description"]') ||
				text('[class*="job-detail"]'),
		};
	}

	function mergeDetected(...items: PartialDetectedJob[]) {
		return items.reduce<PartialDetectedJob>((result, item) => {
			for (const key of Object.keys(item) as Array<keyof PartialDetectedJob>) {
				if (!result[key] && item[key]) {
					result[key] = item[key] as never;
				}
			}

			return result;
		}, {});
	}

	function text(selector: string, attr?: string) {
		const element = document.querySelector(selector);
		if (!element) return "";

		if (attr) return cleanText(element.getAttribute(attr));

		return cleanText(element.textContent);
	}

	function getMeta(property: string) {
		return cleanText(
			document
				.querySelector(`meta[property="${property}"], meta[name="${property}"]`)
				?.getAttribute("content"),
		);
	}

	function getStructuredLocation(locationData: any) {
		const locations = Array.isArray(locationData) ? locationData : [locationData];

		return locations
			.map((location) => {
				const address = location?.address;
				return [
					address?.addressLocality,
					address?.addressRegion,
					address?.addressCountry,
				]
					.filter(Boolean)
					.join(", ");
			})
			.filter(Boolean)
			.join(" / ");
	}

	function extractSalary(jobPosting: any) {
		const baseSalary = jobPosting.baseSalary;
		const value = baseSalary?.value;
		const amount = value?.value || value?.minValue || value?.maxValue;
		const currency = baseSalary?.currency || jobPosting.salaryCurrency;

		if (!amount) return "";

		return [currency, amount].filter(Boolean).join(" ");
	}

	function findLocationText() {
		const candidates = Array.from(
			document.querySelectorAll(
				'[class*="location"], [id*="location"], [data-testid*="location"], [data-automation-id*="location"]',
			),
		)
			.map((element) => cleanText(element.textContent))
			.filter(Boolean);

		return candidates.find((candidate) => candidate.length < 120) || "";
	}

	function getCompanyFromTitle(title: string) {
		const parts = title
			.split(/\s+(?:at|@|-|–|\|)\s+/i)
			.map((part) => cleanText(part))
			.filter(Boolean);

		return parts.length > 1 ? parts[parts.length - 1] : "";
	}

	function removeCompanyFromTitle(title: string) {
		return cleanText(title).split(/\s+(?:at|@|-|–|\|)\s+/i)[0] || cleanText(title);
	}

	function stripHtml(value: string) {
		const element = document.createElement("div");
		element.innerHTML = value || "";
		return cleanText(element.textContent);
	}

	function cleanText(value: unknown) {
		return String(value ?? "")
			.replace(/\s+/g, " ")
			.trim();
	}

	function getConfidence(item: PartialDetectedJob): DetectedJob["confidence"] {
		if (item.title && item.company && item.location) return "high";
		if (item.title && item.company) return "medium";
		return "low";
	}
}
