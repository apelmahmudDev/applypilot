import type { DetectedJob } from "@/lib/job-detection/types";
import type { JobDetectorMessage } from "@/lib/job-detection/messages";

export async function detectJobFromActiveTab(): Promise<DetectedJob | null> {
	const [tab] = await browser.tabs.query({
		active: true,
		currentWindow: true,
	});

	if (!tab?.id || !tab.url || !isDetectableUrl(tab.url)) {
		return null;
	}

	const isLinkedIn = new URL(tab.url).hostname.toLowerCase().includes("linkedin.com");
	if (isLinkedIn) {
		const response = await browser.tabs.sendMessage(tab.id, {
			type: "APPLYPILOT_GET_JOB",
		} satisfies JobDetectorMessage) as { job?: DetectedJob | null };
		return response?.job ?? null;
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

function detectJobInPage(): DetectedJob | null {
	type ParsedDetectedJob = Partial<
		DetectedJob & {
			description: string;
			employmentType: string;
			workplaceType: string;
		}
	>;

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
	const formattedDescription = getFormattedDescription(platform);

	if (!hasDetectedJobDetails(detected)) {
		return null;
	}

	return {
		title: detected.title ?? "",
		company: detected.company ?? "",
		location: detected.location ?? "",
		url,
		platform: platformLabel,
		descriptionText: formattedDescription.text || (detected.description ?? ""),
		descriptionHtml: formattedDescription.html,
		salary: detected.salary ?? "",
		logoUrl: detected.logoUrl,
		employmentType: detected.employmentType,
		workplaceType: detected.workplaceType,
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
		if (hostname.includes("bdjobs.com")) return "bdjobs";

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
			bdjobs: "Bdjobs",
		};

		if (labels[platformName]) return labels[platformName];

		return getMeta("og:site_name") || new URL(pageUrl).hostname.replace(/^www\./, "");
	}

	function parsePlatformJob(platformName: string): ParsedDetectedJob {
		if (platformName === "indeed") return parseIndeedJob();
		if (platformName === "greenhouse") return parseGreenhouseJob();
		if (platformName === "lever") return parseLeverJob();
		if (platformName === "workday") return parseWorkdayJob();
		if (platformName === "ashby") return parseAshbyJob();
		if (platformName === "bdjobs") return parseBdjobsJob();

		return {};
	}

	function parseIndeedJob(): ParsedDetectedJob {
		const compensation = text("#salaryInfoAndJobType");
		const { salary, employmentType } = parseIndeedCompensation(compensation);

		return {
			title: text('[data-testid="jobsearch-JobInfoHeader-title"]') || text("h1"),
			company:
				text('[data-testid="inlineHeader-companyName"]') ||
				text('[data-company-name="true"]'),
			location:
				text('[data-testid="inlineHeader-companyLocation"]') ||
				text('[data-testid="job-location"]') ||
				text("#jobLocationText"),
			description: text("#jobDescriptionText") || text("#jobDescriptionText > div"),
			salary:
				salary ||
				text('#salaryInfoAndJobType .css-1oc7tea') ||
				text('[aria-label="Pay"] [data-testid="list-item"] span'),
			employmentType:
				employmentType ||
				text('#salaryInfoAndJobType .css-1u1g3ig') ||
				text('[aria-label="Job type"] [data-testid="list-item"] span'),
			logoUrl:
				text('img[data-testid="jobsearch-JobInfoHeader-logo-overlay-lower"]', "src") ||
				text(".jobsearch-JobInfoHeader-logo", "src"),
		};
	}

	function parseGreenhouseJob(): ParsedDetectedJob {
		return {
			title: text(".app-title") || text("h1"),
			company: text(".company-name") || getCompanyFromTitle(document.title),
			location: text(".location") || text('[data-qa="job-location"]'),
			description: text("#content") || text(".job__description"),
		};
	}

	function parseLeverJob(): ParsedDetectedJob {
		return {
			title: text(".posting-headline h2") || text("h1"),
			company: text(".main-header-logo img", "alt") || getCompanyFromTitle(document.title),
			location: text(".posting-categories .location") || text(".location"),
			description: text(".section-wrapper.page-full-width") || text(".posting-page"),
		};
	}

	function parseWorkdayJob(): ParsedDetectedJob {
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

	function parseAshbyJob(): ParsedDetectedJob {
		return {
			title: text("h1"),
			company: getMeta("og:site_name") || getCompanyFromTitle(document.title),
			location: text('[class*="location"]'),
			description: text('[class*="description"]') || text("main"),
		};
	}

	function parseBdjobsJob(): ParsedDetectedJob {
		const title = getBdjobsTitle();
		const company = getBdjobsCompany();
		const location =
			getBdjobsLabeledValue("Job Location") ||
			text('[data-testid="job-location"]') ||
			text('[class*="location"]');
		const employmentType = getBdjobsLabeledValue("Employment Status");
		const workplaceType =
			getBdjobsLabeledValue("Workplace") ||
			getBdjobsLabeledValue("Work Place");
		const salary =
			getBdjobsInlineSalary() ||
			getBdjobsCompensation() ||
			getBdjobsLabeledValue("Salary") ||
			getBdjobsLabeledValue("Compensation & Other Benefits");
		const detailsRoot =
			document.querySelector<HTMLElement>("app-details-main") ||
			document.querySelector<HTMLElement>("main");

		return {
			title,
			company,
			location,
			description: detailsRoot ? cleanText(detailsRoot.innerText) : "",
			salary,
			logoUrl:
				text('img[alt*="logo"]', "src") ||
				text('img[src*="bdjobs/recruiter/logos"]', "src"),
			employmentType,
			workplaceType,
		};
	}

	function parseStructuredJobData(): ParsedDetectedJob {
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

	function parseMetaJobData(): ParsedDetectedJob {
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

	function parseGenericJobPage(): ParsedDetectedJob {
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

	function mergeDetected(...items: ParsedDetectedJob[]) {
		return items.reduce<ParsedDetectedJob>((result, item) => {
			for (const key of Object.keys(item) as Array<keyof ParsedDetectedJob>) {
				if (!result[key] && item[key]) {
					result[key] = item[key] as never;
				}
			}

			return result;
		}, {});
	}

	function getFormattedDescription(platformName: string) {
		if (platformName === "indeed") {
			return formatDescriptionElement(
				document.querySelector<HTMLElement>("#jobDescriptionText"),
			);
		}

		if (platformName === "bdjobs") {
			return formatDescriptionElement(
				document.querySelector<HTMLElement>("app-details-main"),
			);
		}

		return { html: "", text: "" };
	}

	function getBdjobsTitle() {
		const headerTitle =
			text("button h2 + h2") ||
			text("div.flex-col-reverse h2 + h2") ||
			text("app-details-main h2 + h2");

		if (headerTitle) {
			return headerTitle;
		}

		const headingCandidates = Array.from(document.querySelectorAll("h1, h2"))
			.map((element) => cleanText(element.textContent))
			.filter(Boolean);

		return (
			headingCandidates.find(
				(candidate) =>
					candidate.length > 8 &&
					!candidate.toLowerCase().includes("limited") &&
					!candidate.toLowerCase().includes("ltd") &&
					!candidate.toLowerCase().includes("inc") &&
					!candidate.toLowerCase().includes("llc") &&
					!candidate.toLowerCase().includes("application deadline") &&
					!candidate.toLowerCase().includes("job highlights") &&
					!candidate.toLowerCase().includes("skills & expertise") &&
					!candidate.toLowerCase().includes("responsibilities") &&
					!candidate.toLowerCase().includes("compensation & other benefits") &&
					!candidate.toLowerCase().includes("company information") &&
					!candidate.toLowerCase().includes("report this job"),
			) || ""
		);
	}

	function getBdjobsCompany() {
		const companyFromCard =
			text("button h2") ||
			text("div.flex-col-reverse button h2") ||
			text('app-company-info-card h2') ||
			text('img[alt$=" logo"]', "alt").replace(/\s+logo$/i, "");

		if (companyFromCard) {
			return companyFromCard;
		}

		const headingCandidates = Array.from(document.querySelectorAll("button h2, h2"))
			.map((element) => cleanText(element.textContent))
			.filter(Boolean);

		return (
			headingCandidates.find(
				(candidate) =>
					candidate.length > 2 &&
					!candidate.toLowerCase().includes("job highlights") &&
					!candidate.toLowerCase().includes("matching details") &&
					!candidate.toLowerCase().includes("skills & expertise") &&
					!candidate.toLowerCase().includes("responsibilities"),
			) || getCompanyFromTitle(document.title)
		);
	}

	function getBdjobsLabeledValue(label: string) {
		const normalizedLabel = label.trim().toLowerCase();
		const candidates = Array.from(document.querySelectorAll("p, h3, h4"));

		for (const candidate of candidates) {
			const candidateText = cleanText(candidate.textContent).replace(/\s*:\s*$/, "");
			if (candidateText.toLowerCase() !== normalizedLabel) {
				continue;
			}

			const nextText = cleanText(candidate.nextElementSibling?.textContent);
			if (nextText) {
				return nextText;
			}

			const parent = candidate.parentElement;
			if (!parent) {
				continue;
			}

			const siblings = Array.from(parent.children);
			const index = siblings.indexOf(candidate as HTMLElement);
			const siblingText = cleanText(siblings[index + 1]?.textContent);
			if (siblingText) {
				return siblingText;
			}
		}

		return "";
	}

	function getBdjobsCompensation() {
		const heading = Array.from(document.querySelectorAll("p, h3, h4")).find(
			(element) =>
				cleanText(element.textContent).toLowerCase() ===
				"compensation & other benefits",
		);

		const section = heading?.parentElement;
		if (!section) {
			return "";
		}

		return Array.from(section.querySelectorAll("li"))
			.map((item) => cleanText(item.textContent))
			.filter(Boolean)
			.join(" | ");
	}

	function getBdjobsInlineSalary() {
		const salaryLabel = Array.from(document.querySelectorAll("span, p, div")).find(
			(element) => cleanText(element.textContent) === "Salary:",
		);

		if (!salaryLabel) {
			return "";
		}

		const siblingText = cleanText(salaryLabel.nextElementSibling?.textContent);
		if (siblingText) {
			return siblingText;
		}

		const parent = salaryLabel.parentElement;
		if (!parent) {
			return "";
		}

		const values = Array.from(parent.children)
			.map((child) => cleanText(child.textContent))
			.filter(Boolean)
			.filter((value) => value !== "Salary:");

		return values[0] || "";
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

	function parseIndeedCompensation(value: string) {
		const cleaned = cleanText(value);
		if (!cleaned) {
			return { salary: "", employmentType: "" };
		}

		const salary =
			cleaned.match(
				/(?:\$|USD|EUR|GBP|BDT)\s?[\d,.]+(?:\s*(?:-|to)\s*(?:\$|USD|EUR|GBP|BDT)?\s?[\d,.]+)?(?:\s+(?:an?\s+hour|per\s+hour|a\s+year|per\s+year|a\s+month|per\s+month))?/i,
			)?.[0] || "";

		const employmentType =
			cleaned.match(
				/\b(full-time|part-time|contract|temporary|internship|intern|permanent|seasonal|freelance)\b/i,
			)?.[0] || "";

		return {
			salary: cleanText(salary),
			employmentType: cleanText(employmentType),
		};
	}

	function formatDescriptionElement(source: HTMLElement | null) {
		if (!source) {
			return { html: "", text: "" };
		}

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

		const text = (clone.innerText || clone.textContent || "")
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

		return {
			html: clone.innerHTML.trim(),
			text,
		};
	}

	function cleanText(value: unknown) {
		return String(value ?? "")
			.replace(/\s+/g, " ")
			.trim();
	}

	function getConfidence(item: ParsedDetectedJob): DetectedJob["confidence"] {
		if (item.title && item.company && item.location) return "high";
		if (item.title && item.company) return "medium";
		return "low";
	}

	function hasDetectedJobDetails(item: ParsedDetectedJob) {
		return Boolean(item.title || item.company || item.location || item.description);
	}
}
