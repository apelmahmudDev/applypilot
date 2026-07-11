import type { DetectedJob } from './types';
import {
  canonicalUrl,
  decodeHtml,
  elementText,
  extractDeadline,
  extractExperience,
  extractLabel,
  extractSalary,
  extractSkills,
  firstUsefulText,
  metaContent,
  oneLine,
  optionalCanonicalUrl,
  queryAll,
} from './shared';

function findJobPosting(value: unknown): Record<string, any> | null {
  if (!value) return null;

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findJobPosting(item);
      if (found) return found;
    }
    return null;
  }

  if (typeof value !== 'object') return null;
  const object = value as Record<string, any>;
  const type = object['@type'];
  if (type === 'JobPosting' || (Array.isArray(type) && type.includes('JobPosting'))) {
    return object;
  }

  for (const key of ['@graph', 'mainEntity', 'itemListElement']) {
    const found = findJobPosting(object[key]);
    if (found) return found;
  }

  return null;
}

function readJsonLdJob(doc: Document): Record<string, any> | null {
  for (const script of queryAll<HTMLScriptElement>(doc, 'script[type="application/ld+json"]')) {
    try {
      const parsed = JSON.parse(script.textContent ?? '');
      const job = findJobPosting(parsed);
      if (job) return job;
    } catch {
      // Ignore malformed third-party JSON-LD and continue.
    }
  }
  return null;
}

function schemaAddress(location: any): string | undefined {
  const locations = Array.isArray(location) ? location : location ? [location] : [];
  const values = locations
    .map((entry) => entry?.address ?? entry)
    .map((address) => {
      if (typeof address === 'string') return oneLine(address);
      return [
        address?.streetAddress,
        address?.addressLocality,
        address?.addressRegion,
        address?.postalCode,
        address?.addressCountry?.name ?? address?.addressCountry,
      ]
        .filter(Boolean)
        .map(oneLine)
        .join(', ');
    })
    .filter(Boolean);

  return values.length ? Array.from(new Set(values)).join(' | ') : undefined;
}

function schemaSalary(baseSalary: any): string | undefined {
  if (!baseSalary) return undefined;
  if (typeof baseSalary === 'string' || typeof baseSalary === 'number') {
    return oneLine(String(baseSalary));
  }

  const currency = baseSalary.currency ?? baseSalary.value?.currency ?? '';
  const value = baseSalary.value ?? baseSalary;
  const min = value.minValue;
  const max = value.maxValue;
  const exact = value.value;
  const unit = value.unitText ? ` per ${String(value.unitText).toLowerCase()}` : '';

  if (min != null || max != null) {
    return oneLine(`${currency} ${min ?? ''}${min != null && max != null ? ' - ' : ''}${max ?? ''}${unit}`);
  }
  if (exact != null) return oneLine(`${currency} ${exact}${unit}`);
  return undefined;
}

function normalizeSkills(value: unknown): string[] | undefined {
  const raw = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(/[,;|]/)
      : [];
  const skills = raw.map((item) => oneLine(String(item))).filter(Boolean);
  return skills.length ? Array.from(new Set(skills)) : undefined;
}

function detectFromJsonLd(doc: Document): DetectedJob | null {
  const job = readJsonLdJob(doc);
  if (!job) return null;

  const title = oneLine(job.title ?? job.name);
  const company = oneLine(job.hiringOrganization?.name ?? job.organization?.name);
  const description = decodeHtml(job.description);
  if (!title || (!company && !description)) return null;

  const employmentType = Array.isArray(job.employmentType)
    ? job.employmentType.map(oneLine).join(', ')
    : oneLine(job.employmentType) || undefined;
  const applicantLocation = schemaAddress(job.applicantLocationRequirements);
  const location = schemaAddress(job.jobLocation) ?? applicantLocation;
  const id = oneLine(job.identifier?.value ?? job.identifier ?? job.jobId) || undefined;

  return {
    id,
    title,
    company,
    location,
    salary: schemaSalary(job.baseSalary) ?? extractSalary(description),
    description: description || undefined,
    employmentType,
    workplaceType:
      /telecommute|remote/i.test(String(job.jobLocationType ?? '')) ? 'Remote' : undefined,
    experience: oneLine(job.experienceRequirements) || extractExperience(description),
    skills: normalizeSkills(job.skills ?? job.qualifications) ?? extractSkills(description),
    postedAt: oneLine(job.datePosted) || undefined,
    applicationDeadline: oneLine(job.validThrough) || extractDeadline(description),
    jobUrl: canonicalUrl(job.url ?? window.location.href),
    applyUrl: canonicalUrl(job.url ?? window.location.href),
    logoUrl: optionalCanonicalUrl(
      job.hiringOrganization?.logo?.url ??
        job.hiringOrganization?.logo ??
        document.querySelector<HTMLMetaElement>('meta[property="og:image"]')?.content,
    ),
    source: 'generic',
    sourceHost: window.location.hostname,
    confidence: 0.96,
    detectedAt: new Date().toISOString(),
  };
}

function findGenericApplyUrl(doc: Document): string {
  const candidates = queryAll<HTMLElement>(
    doc,
    'a[href], button[data-href], button[data-url]',
  );

  for (const element of candidates) {
    const label = oneLine(
      `${element.getAttribute('aria-label') ?? ''} ${element.textContent ?? ''}`,
    );
    if (!/^(?:easy\s+)?apply(?:\s+now)?$|apply for (?:this )?job/i.test(label)) continue;

    const rawUrl =
      element instanceof HTMLAnchorElement
        ? element.href
        : element.getAttribute('data-href') ?? element.getAttribute('data-url');
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
      '.job-title h1',
      '.job-title',
      'main h1',
      'h1',
    ]) ?? metaContent(doc, ['meta[property="og:title"]']);

  const description = firstUsefulText(
    doc,
    [
      '[data-automation="jobAdDetails"]',
      '[data-testid="job-description"]',
      '[data-testid*="job-description"]',
      '#jobDescriptionText',
      '[itemprop="description"]',
      '.job-description',
      '[class*="job-description"]',
      'main article',
      'article',
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
      '.company-name',
      '.company',
    ]) ?? metaContent(doc, ['meta[property="og:site_name"]']);

  const location = firstUsefulText(doc, [
    '[data-automation="job-detail-location"]',
    '[data-testid="job-location"]',
    '[data-testid*="location"]',
    '[itemprop="jobLocation"]',
    '[class*="job-location"]',
    '.job-location',
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
  if (/\b(job|career|vacanc|position|role)\b/i.test(`${document.title} ${window.location.pathname}`)) {
    confidence += 1;
  }
  if (/\b(responsibilit|qualification|requirements?|apply)\b/i.test(pageText)) confidence += 1;

  if (!title || confidence < 5) return null;

  return {
    title: oneLine(title),
    company: oneLine(company) || window.location.hostname.replace(/^www\./, ''),
    location: oneLine(location) || undefined,
    salary: extractSalary(`${salaryElement ?? ''}\n${pageText}`),
    description: description || undefined,
    employmentType: extractLabel(pageText, ['Job Type', 'Employment Type']),
    workplaceType:
      oneLine(pageText.match(/\b(remote|hybrid|on-site|onsite)\b/i)?.[1]) || undefined,
    experience: extractExperience(pageText),
    skills: extractSkills(pageText),
    postedAt: extractLabel(pageText, ['Date posted', 'Posted']),
    applicationDeadline: extractDeadline(pageText),
    jobUrl: canonicalUrl(window.location.href),
    applyUrl: findGenericApplyUrl(doc),
    logoUrl: metaContent(doc, ['meta[property="og:image"]']),
    source: 'generic',
    sourceHost: window.location.hostname,
    confidence: Math.min(0.55 + confidence * 0.05, 0.9),
    detectedAt: new Date().toISOString(),
  };
}

export function detectGenericJob(doc: Document = document): DetectedJob | null {
  return detectFromJsonLd(doc) ?? detectGenericDomJob(doc);
}
