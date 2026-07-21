import type { DetectedJob } from './types';
import {
  JOB_ID_RE,
  LINKEDIN_HOST_RE,
  canonicalUrl,
  cleanText,
  elementText,
  extractDeadline,
  extractExperience,
  extractLabel,
  extractSalary,
  extractSkills,
  findExactText,
  findSectionByHeading,
  nearestElementBefore,
  oneLine,
  queryAll,
  queryFirst,
  unwrapLinkedInRedirect,
} from './shared';

type LinkedInPageMode = 'search' | 'details';

export function isLinkedInJobDetailsPage(): boolean {
  try {
    return JOB_ID_RE.test(new URL(window.location.href).pathname);
  } catch {
    return false;
  }
}

function getLinkedInJobId(doc: Document): string | undefined {
  const url = new URL(window.location.href);
  const pathId = url.pathname.match(JOB_ID_RE)?.[1];
  if (pathId) return pathId;

  const queryId = url.searchParams.get('currentJobId');
  if (queryId && /^\d+$/.test(queryId)) return queryId;

  const aboutComponent = doc.querySelector<HTMLElement>(
    '[componentkey^="JobDetails_AboutTheJob_"]',
  );
  const componentId = aboutComponent?.getAttribute('componentkey')?.match(/(\d+)$/)?.[1];
  if (componentId) return componentId;

  return undefined;
}

function findLinkedInAboutSection(doc: Document, jobId?: string): Element | null {
  const keyedSection = doc.querySelector<HTMLElement>(
    '[componentkey^="JobDetails_AboutTheJob_"]',
  );

  if (jobId) {
    const exact = doc.querySelector(`[componentkey="JobDetails_AboutTheJob_${jobId}"]`);
    if (exact) return exact;

    // LinkedIn is an SPA. During a job switch, the URL can update before the
    // right-hand details pane. Do not combine the new job ID with stale content.
    const renderedId = keyedSection?.getAttribute('componentkey')?.match(/(\d+)$/)?.[1];
    if (renderedId && renderedId !== jobId) return null;
  }

  return (
    keyedSection ??
    doc.querySelector('[data-sdui-component*="aboutTheJob"]') ??
    findSectionByHeading(doc, /^about the job$/i)
  );
}

function findLinkedInDescriptionElement(aboutSection: Element | null): HTMLElement | null {
  if (!aboutSection) return null;

  return (
    aboutSection.querySelector<HTMLElement>('[data-testid="expandable-text-box"]') ??
    queryFirst<HTMLElement>(aboutSection, [
      '.jobs-description-content__text',
      '.jobs-box__html-content',
      '.jobs-description__content',
      '[class*="jobs-description"]',
    ])
  );
}

function findLinkedInSearchTitleElement(
  doc: Document,
  aboutSection: Element | null,
  jobId?: string,
): HTMLElement | null {
  const classic = queryFirst<HTMLElement>(doc, [
    '.job-details-jobs-unified-top-card__job-title h1',
    '.jobs-unified-top-card__job-title',
    '.jobs-details-top-card__job-title',
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
    const headings = queryAll<HTMLElement>(doc, 'h1, h2').filter(
      (heading) => !/^about the job$/i.test(oneLine(heading.textContent)),
    );
    const nearest = nearestElementBefore(headings, aboutSection);
    if (nearest) return nearest;
  }

  return queryFirst<HTMLElement>(doc, ['main h1', 'h1']);
}

function isRejectedLinkedInDetailsTitle(
  text: string,
  company?: string,
): boolean {
  const value = oneLine(text);
  if (!value || value.length < 2 || value.length > 240) return true;

  const normalized = value.toLowerCase();
  if (company && normalized === oneLine(company).toLowerCase()) return true;

  if (
    /^(?:apply|easy apply|save|show all|more|about the job|overview|hybrid|remote|on-site|onsite|full-time|part-time|contract|temporary|internship|volunteer|other)$/i.test(
      value,
    )
  ) {
    return true;
  }

  if (
    /\b(?:people\s+clicked\s+apply|applicants?|reposted|posted|promoted by hirer|responses managed|retry premium|people you can reach out to|use ai to assess|set alert for similar jobs)\b/i.test(
      value,
    )
  ) {
    return true;
  }

  // Metadata rows on LinkedIn commonly use centered dots.
  if (/[Â·â€¢]/.test(value)) return true;

  return false;
}

function findLinkedInDetailsTopCard(
  doc: Document,
  aboutSection: Element | null,
): Element | null {
  const companyCard =
    doc.querySelector('[aria-label^="Company,"]') ??
    doc.querySelector('a[href*="/company/"]');

  let current = companyCard;
  let fallback: Element | null = companyCard;

  for (let depth = 0; current && depth < 12; depth += 1) {
    if (aboutSection && current.contains(aboutSection)) break;

    const text = elementText(current);
    const hasApply = Boolean(
      current.querySelector(
        'a[aria-label*="Apply"], button[aria-label*="Apply"], .jobs-apply-button',
      ),
    );
    const hasCompany = Boolean(
      current.querySelector('[aria-label^="Company,"]') ||
        current.querySelector('a[href*="/company/"]'),
    );
    const hasMetadata = /\b(?:people\s+clicked\s+apply|applicants?|hours? ago|days? ago|weeks? ago|months? ago|reposted|posted)\b/i.test(
      text,
    );

    if (hasCompany && hasApply && hasMetadata && text.length < 7000) {
      return current;
    }

    if (text.length < 4000) fallback = current;
    current = current.parentElement;
  }

  return fallback;
}

function findLinkedInDetailsTitleElement(
  doc: Document,
  aboutSection: Element | null,
  jobId?: string,
): HTMLElement | null {
  const classic = queryFirst<HTMLElement>(doc, [
    '.job-details-jobs-unified-top-card__job-title h1',
    '.jobs-unified-top-card__job-title',
    '.jobs-details-top-card__job-title',
    'main h1',
  ]);
  if (
    classic &&
    !isRejectedLinkedInDetailsTitle(oneLine(classic.textContent))
  ) {
    return classic;
  }

  // In LinkedIn's newer standalone details page, the title may be a <p>
  // immediately containing the verified-job icon rather than an h1.
  const verifiedJobIcon = doc.querySelector<HTMLElement>(
    '[aria-label="Verified job"], [aria-label*="Verified job"]',
  );
  const verifiedTitle = verifiedJobIcon?.closest<HTMLElement>('h1, h2, h3, p');
  if (
    verifiedTitle &&
    !isRejectedLinkedInDetailsTitle(oneLine(verifiedTitle.textContent))
  ) {
    return verifiedTitle;
  }

  const company = findLinkedInHeaderCompany(null, doc);
  const topCard = findLinkedInDetailsTopCard(doc, aboutSection);

  if (topCard) {
    const candidates = queryAll<HTMLElement>(topCard, 'h1, h2, h3, p')
      .map((element) => {
        const text = oneLine(element.textContent);
        if (isRejectedLinkedInDetailsTitle(text, company)) {
          return { element, score: Number.NEGATIVE_INFINITY };
        }

        let score = 0;
        const tagName = element.tagName.toLowerCase();

        if (tagName === 'h1') score += 10;
        else if (tagName === 'h2') score += 7;
        else if (tagName === 'h3') score += 5;
        else score += 2;

        if (element.querySelector('[aria-label*="Verified job"]')) score += 20;
        if (/job[-_ ]?title/i.test(`${element.id} ${element.className}`)) score += 10;
        if (text.length <= 120) score += 3;
        if (text.split(/\s+/).length <= 18) score += 2;
        if (/[.!?]$/.test(text) && text.length > 80) score -= 4;

        return { element, score };
      })
      .filter((candidate) => Number.isFinite(candidate.score))
      .sort((a, b) => b.score - a.score);

    if (candidates[0]) return candidates[0].element;
  }

  // Older standalone pages sometimes expose a title anchor. Filter out the
  // job-type chips and actions that also point at the same job URL.
  if (jobId && aboutSection) {
    const anchors = queryAll<HTMLAnchorElement>(
      doc,
      `a[href*="/jobs/view/${jobId}"]`,
    ).filter((anchor) => {
      const text = oneLine(anchor.textContent);
      return !isRejectedLinkedInDetailsTitle(text, company);
    });

    const nearest = nearestElementBefore(anchors, aboutSection);
    if (nearest) return nearest;
  }

  return null;
}

function findLinkedInHeaderContainer(titleElement: Element | null): Element | null {
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
    .split(/\s*[Â·â€¢]\s*/)
    .map(oneLine)
    .filter(Boolean);
}

function extractLinkedInPostedAt(
  metadataText: string,
  headerText: string,
): string | undefined {
  const explicit = oneLine(
    headerText.match(/\b(?:reposted|posted)\s+([^Â·\n]+)/i)?.[0],
  );
  if (explicit) return explicit;

  const relativePart = splitLinkedInMetadataParts(metadataText).find((part) =>
    /^(?:(?:reposted|posted)\s+)?(?:\d+\+?\s+(?:minute|hour|day|week|month|year)s?\s+ago|today|yesterday)$/i.test(
      part,
    ),
  );

  return relativePart ? oneLine(relativePart) : undefined;
}

function extractWorkplaceTypeFromText(text: string): string | undefined {
  const match = text.match(/\b(remote|hybrid|on-site|onsite)\b/i)?.[1];
  if (!match) return undefined;

  if (/^onsite$/i.test(match)) return 'On-site';
  return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
}

function findLinkedInMetadataText(header: Element | null): string | undefined {
  if (!header) return undefined;

  const candidates = queryAll<HTMLElement>(header, 'p, span, div')
    .map((element) => elementText(element))
    .filter((text) =>
      /\b(?:reposted|posted|people\s+clicked\s+apply|applicants?)\b/i.test(text),
    )
    .sort((a, b) => a.length - b.length);

  return candidates[0];
}

function cleanLinkedInLocationValue(text?: string, company?: string): string | undefined {
  const normalized = oneLine(text)
    .replace(/\((remote|hybrid|on-site|onsite)\)/gi, '')
    .replace(/\b(remote|hybrid|on-site|onsite)\b/gi, '')
    .replace(/\b(?:reposted|posted)\b.*$/i, '')
    .replace(/\b\d[\d,]*\s+(?:people\s+clicked\s+apply|applicants?)\b.*$/i, '')
    .replace(/[Â·â€¢,\s]+$/g, '')
    .trim();

  if (!normalized) return undefined;
  if (company && normalized.toLowerCase() === oneLine(company).toLowerCase()) return undefined;
  return normalized;
}

function findLinkedInCompanyCard(
  header: Element | null,
  doc: Document,
  reference?: Node | null,
): Element | null {
  const headerCard = header?.querySelector('[aria-label^="Company,"]');
  if (headerCard) return headerCard;

  const pageCards = queryAll<HTMLElement>(doc, '[aria-label^="Company,"]');
  if (reference) return nearestElementBefore(pageCards, reference);

  return pageCards[0] ?? null;
}

function findLinkedInHeaderCompany(
  header: Element | null,
  doc: Document,
  reference?: Node | null,
  titleElement?: Element | null,
): string | undefined {
  const companyCard = findLinkedInCompanyCard(header, doc, reference);
  if (companyCard) {
    const companyLink = companyCard.querySelector<HTMLAnchorElement>('a[href*="/company/"]');
    if (companyLink) {
      const name = oneLine(companyLink.textContent);
      if (name && !/^linkedin$/i.test(name)) return name;
    }

    const cardLink =
      companyCard instanceof HTMLAnchorElement &&
      companyCard.href.includes('/company/')
        ? companyCard
        : null;
    if (cardLink) {
      const name = oneLine(cardLink.textContent);
      if (name && !/^linkedin$/i.test(name)) return name;
    }

    const ariaLabel = companyCard
      .getAttribute('aria-label')
      ?.match(/^Company,\s*(.+?)\.?$/i)?.[1];
    const name = oneLine(ariaLabel);
    if (name && !/^linkedin$/i.test(name)) return name;
  }

  const root = header ?? doc;

  const classic = queryFirst<HTMLElement>(root, [
    '.job-details-jobs-unified-top-card__company-name',
    '.jobs-unified-top-card__company-name',
    '.jobs-details-top-card__company-info a',
  ]);
  if (classic) {
    const name = oneLine(classic.textContent);
    if (name && !/^linkedin$/i.test(name)) return name;
  }

  // Some current LinkedIn headers render the company as plain text rather
  // than a link or accessible company card, for example: <p>Field Nation</p>
  // immediately before the selected job title.
  if (titleElement) {
    const plainCompany = nearestElementBefore(
      queryAll<HTMLElement>(header ?? doc, 'p').filter((element) => {
        const text = oneLine(element.textContent);
        return (
          text.length >= 2 &&
          text.length <= 160 &&
          text.toLowerCase() !== 'linkedin' &&
          !/\b(?:apply|save|about the job|reposted|posted|applicants?|people clicked|remote|hybrid|on-site|full-time|part-time|contract)\b/i.test(
            text,
          ) &&
          !/[Ã‚Â·Ã¢â‚¬Â¢]/.test(text) &&
          !/,\s*[A-Za-z]/.test(text)
        );
      }),
      titleElement,
    );
    const name = oneLine(plainCompany?.textContent);
    if (name && !/^linkedin$/i.test(name)) return name;
  }

  const ariaCompany = root.querySelector<HTMLElement>('[aria-label^="Company,"]');
  const ariaLabel = ariaCompany?.getAttribute('aria-label')?.match(/^Company,\s*(.+?)\.?$/i)?.[1];
  const name = oneLine(ariaLabel);
  return name && !/^linkedin$/i.test(name) ? name : undefined;
}

function findLinkedInLogoUrl(header: Element | null, doc: Document): string | undefined {
  const companyCard = findLinkedInCompanyCard(header, doc);
  const root = companyCard ?? header ?? doc;

  return queryFirst<HTMLImageElement>(root, [
    'img[alt*="Company logo"]',
    'img[src*="company-logo"]',
    '.jobs-unified-top-card__company-logo img',
  ])?.src;
}

function findLinkedInLocation(
  header: Element | null,
): string | undefined {
  if (!header) return undefined;

  // Keep support for LinkedIn's older/classic layouts.
  const classic = queryFirst<HTMLElement>(header, [
    '.job-details-jobs-unified-top-card__primary-description-container',
    '.jobs-unified-top-card__bullet',
    '.jobs-unified-top-card__sub-title',
    '.jobs-details-top-card__bullet',
  ]);

  if (classic) {
    const value = oneLine(classic.textContent)
      .split(/\s*(?:\u00b7|\u2022)\s*/)[0]
      ?.trim();

    if (value) return value;
  }

  const relativeTimePattern =
    /\b\d+\s+(?:minute|hour|day|week|month|year)s?\s+ago\b/i;

  const applicantPattern =
    /\b(?:over\s+)?\d[\d,]*\s+(?:people\s+clicked\s+apply|applicants?)\b/i;

  /*
   * Supports:
   * Bangladesh · 1 year ago · 78 people clicked apply
   * Uttara, Dhaka, Bangladesh · 5 days ago · 39 people clicked apply
   * Dhaka, Bangladesh · Reposted 18 hours ago · 21 people clicked apply
   */
  const metadataRows = queryAll<HTMLElement>(header, 'p').filter((element) => {
    const text = oneLine(element.textContent);

    const hasSeparator = /(?:\u00b7|\u2022)/.test(text);

    const hasPostingTime =
      relativeTimePattern.test(text) ||
      /\b(?:posted|reposted)\b/i.test(text);

    const hasApplicantData = applicantPattern.test(text);

    return hasSeparator && hasPostingTime && hasApplicantData;
  });

  // Prefer the shortest matching row to avoid selecting a large parent.
  const metadataRow = metadataRows.sort(
    (a, b) =>
      oneLine(a.textContent).length -
      oneLine(b.textContent).length,
  )[0];

  if (!metadataRow) return undefined;

  /*
   * Best case: LinkedIn stores the location inside the
   * first meaningful direct <span>.
   */
  for (const child of Array.from(metadataRow.children)) {
    if (!(child instanceof HTMLElement)) continue;

    const value = oneLine(child.textContent);

    if (!value || value === '\u00b7' || value === '\u2022') {
      continue;
    }

    const isTime =
      relativeTimePattern.test(value) ||
      /\b(?:posted|reposted)\b/i.test(value);

    const isApplicantText = applicantPattern.test(value);

    if (isTime || isApplicantText) {
      continue;
    }

    return value
      .replace(/\((?:remote|hybrid|on-site|onsite)\)/gi, '')
      .replace(/[\u00b7\u2022,\s]+$/g, '')
      .trim() || undefined;
  }

  // Fallback: location is everything before the first separator.
  const location = oneLine(metadataRow.textContent)
    .split(/\s*(?:\u00b7|\u2022)\s*/)[0]
    ?.replace(/\((?:remote|hybrid|on-site|onsite)\)/gi, '')
    .replace(/[,\s]+$/g, '')
    .trim();

  return location || undefined;
}

function resolveLinkedInLocation(
  header: Element | null,
  company?: string,
): string | undefined {
  const semantic = cleanLinkedInLocationValue(findLinkedInLocation(header), company);
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

  const fallback = queryAll<HTMLElement>(header, 'p, span, div')
    .map((element) => oneLine(element.textContent))
    .find(
      (text) =>
        /,\s*[A-Za-z]/.test(text) || /\((?:remote|hybrid|on-site|onsite)\)/i.test(text),
    );

  return cleanLinkedInLocationValue(fallback, company);
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
    '.jobs-apply-button',
  ]);

  const easyApply = /easy apply/i.test(
    `${applyControl?.getAttribute('aria-label') ?? ''} ${oneLine(applyControl?.textContent)}`,
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

function detectLinkedInJobByMode(
  doc: Document,
  mode: LinkedInPageMode,
): DetectedJob | null {
  if (!LINKEDIN_HOST_RE.test(window.location.hostname)) return null;

  const jobId = getLinkedInJobId(doc);
  const aboutSection = findLinkedInAboutSection(doc, jobId);
  if (!jobId && !aboutSection) return null;

  const descriptionElement = findLinkedInDescriptionElement(aboutSection);
  const description = elementText(descriptionElement)
    .replace(/(?:â€¦|\.\.\.)\s*more\s*$/i, '')
    .trim();

  const titleElement =
    mode === 'details'
      ? findLinkedInDetailsTitleElement(doc, aboutSection, jobId)
      : findLinkedInSearchTitleElement(doc, aboutSection, jobId);
  const title = oneLine(titleElement?.textContent);
  if (!title) return null;

  const header = findLinkedInHeaderContainer(titleElement);
  const headerText = elementText(header);
  const metadataText = findLinkedInMetadataText(header) ?? headerText;
  const sourceCompany = findLinkedInHeaderCompany(
    header,
    doc,
    aboutSection,
    titleElement,
  );
  const labelledCompany = extractLabel(description, ['Company Name', 'Company']);
  const company = labelledCompany || sourceCompany || '';

  const headerLocation = resolveLinkedInLocation(header, company || sourceCompany);
  const specificLocation = extractLabel(description, ['Location']);
  const employmentType =
    findExactText(header ?? doc, [
      'Full-time',
      'Part-time',
      'Contract',
      'Temporary',
      'Internship',
      'Volunteer',
      'Other',
    ]) ?? extractLabel(description, ['Job Type', 'Employment Type']);
  const workplaceType =
    findExactText(header ?? doc, ['Remote', 'Hybrid', 'On-site']) ??
    extractWorkplaceTypeFromText(
      `${headerLocation ?? ''} ${specificLocation ?? ''} ${metadataText}`,
    ) ??
    extractLabel(description, ['Workplace Type', 'Workplace']);

  const postedAt = extractLinkedInPostedAt(metadataText, headerText);
  const applicantsText = metadataText.match(
    /\b(\d[\d,]*)\s+(?:people\s+clicked\s+apply|applicants?)\b/i,
  )?.[1];

  const canonicalJobUrl = jobId
    ? `https://www.linkedin.com/jobs/view/${jobId}/`
    : canonicalUrl(window.location.href);
  const apply = findLinkedInApply(header, canonicalJobUrl);

  const paySection = findSectionByHeading(doc, /^(?:base )?pay range$|salary|compensation/i);
  const salary = extractSalary(`${description}\n${elementText(paySection)}`);

  const logoUrl = findLinkedInLogoUrl(header, doc);

  let confidence = 0.75;
  if (jobId) confidence += 0.08;
  if (company) confidence += 0.05;
  if (description.length > 120) confidence += 0.08;
  if (aboutSection) confidence += 0.04;
  if (mode === 'details') confidence += 0.02;

  return {
    id: jobId,
    title,
    company,
    sourceCompany: sourceCompany && sourceCompany !== company ? sourceCompany : undefined,
    location: headerLocation || specificLocation,
    specificLocation:
      specificLocation && specificLocation !== headerLocation ? specificLocation : undefined,
    salary,
    description: description || undefined,
    employmentType,
    workplaceType,
    experience: extractExperience(description),
    skills: extractSkills(description),
    postedAt,
    applicationDeadline: extractDeadline(description),
    applicants: applicantsText ? Number(applicantsText.replace(/,/g, '')) : undefined,
    jobUrl: canonicalJobUrl,
    applyUrl: apply.applyUrl,
    logoUrl,
    easyApply: apply.easyApply,
    source: 'linkedin',
    sourceHost: window.location.hostname,
    confidence: Math.min(confidence, 0.99),
    detectedAt: new Date().toISOString(),
  };
}

export function detectLinkedInSearchJob(
  doc: Document = document,
): DetectedJob | null {
  if (!LINKEDIN_HOST_RE.test(window.location.hostname)) return null;
  if (isLinkedInJobDetailsPage()) return null;
  return detectLinkedInJobByMode(doc, 'search');
}

export function detectLinkedInDetailsJob(
  doc: Document = document,
): DetectedJob | null {
  if (!LINKEDIN_HOST_RE.test(window.location.hostname)) return null;
  if (!isLinkedInJobDetailsPage()) return null;
  return detectLinkedInJobByMode(doc, 'details');
}

export function detectLinkedInJob(doc: Document = document): DetectedJob | null {
  return isLinkedInJobDetailsPage()
    ? detectLinkedInDetailsJob(doc)
    : detectLinkedInSearchJob(doc);
}
