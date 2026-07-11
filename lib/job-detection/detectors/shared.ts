export const LINKEDIN_HOST_RE = /(^|\.)linkedin\.com$/i;
export const JOB_ID_RE = /\/jobs\/view\/(\d+)/i;

export function cleanText(value?: string | null): string {
  return (value ?? '')
    .replace(/Ã‚Â·/g, ' Â· ')
    .replace(/Ã¢â‚¬Â¢/g, ' Â· ')
    .replace(/Ã¢â‚¬Â¦/g, '...')
    .replace(/Ã¢â‚¬â€œ/g, 'â€“')
    .replace(/Ã¢â‚¬â€/g, 'â€”')
    .replace(/Ã‚Â£/g, 'Â£')
    .replace(/Ã¢â€šÂ¬/g, 'â‚¬')
    .replace(/Ã¢â€šÂ¹/g, 'â‚¹')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function oneLine(value?: string | null): string {
  return cleanText(value).replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

export function elementText(element?: Element | null): string {
  if (!element) return '';
  return cleanText(
    element instanceof HTMLElement ? element.innerText : element.textContent,
  );
}

export function queryFirst<T extends Element>(
  root: ParentNode,
  selectors: string[],
): T | null {
  for (const selector of selectors) {
    const result = root.querySelector<T>(selector);
    if (result) return result;
  }
  return null;
}

export function queryAll<T extends Element>(root: ParentNode, selector: string): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

export function isBefore(a: Node, b: Node): boolean {
  return Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
}

export function nearestElementBefore<T extends Element>(
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

export function canonicalUrl(urlString: string): string {
  try {
    const url = new URL(urlString, window.location.href);
    url.hash = '';
    return url.toString();
  } catch {
    return window.location.href;
  }
}

export function optionalCanonicalUrl(urlString?: string | null): string | undefined {
  if (!urlString) return undefined;
  try {
    const url = new URL(urlString, window.location.href);
    url.hash = '';
    return url.toString();
  } catch {
    return undefined;
  }
}

export function unwrapLinkedInRedirect(urlString?: string | null): string | undefined {
  if (!urlString) return undefined;

  try {
    const url = new URL(urlString, window.location.href);
    if (LINKEDIN_HOST_RE.test(url.hostname) && url.pathname.startsWith('/safety/go/')) {
      const destination = url.searchParams.get('url');
      return destination ? decodeURIComponent(destination) : url.toString();
    }
    return url.toString();
  } catch {
    return undefined;
  }
}

export function extractLabel(text: string, labels: string[]): string | undefined {
  for (const label of labels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = text.match(
      new RegExp(`(?:^|\\n)\\s*${escaped}\\s*:?\\s*([^\\n]+)`, 'i'),
    );
    const value = oneLine(match?.[1]);
    if (value) return value;
  }
  return undefined;
}

export function extractExperience(text: string): string | undefined {
  const labelled = extractLabel(text, ['Experience', 'Experience required']);
  if (labelled) return labelled;

  return oneLine(
    text.match(/\b(\d+(?:\s*[-â€“â€”to]+\s*\d+)?\+?\s*(?:years?|yrs?)(?:\s+of\s+experience)?)\b/i)?.[1],
  ) || undefined;
}

export function extractSalary(text: string): string | undefined {
  const labelled = text.match(
    /(?:^|\n)\s*(?:salary|salary range|pay|pay range|compensation|remuneration|base pay)\s*:?\s*([^\n]{2,120})/i,
  )?.[1];

  if (labelled && /\d/.test(labelled)) return oneLine(labelled);

  const currencyRange = text.match(
    /(?:à§³|BDT|USD|EUR|GBP|INR|CAD|AUD|\$|â‚¬|Â£|â‚¹)\s*\d[\d,.]*(?:\s*[kKmM])?(?:\s*(?:-|â€“|â€”|to)\s*(?:(?:à§³|BDT|USD|EUR|GBP|INR|CAD|AUD|\$|â‚¬|Â£|â‚¹)\s*)?\d[\d,.]*(?:\s*[kKmM])?)?(?:\s*(?:per|\/)?\s*(?:hour|day|week|month|year|annum|hr|mo|yr))?/i,
  )?.[0];

  return currencyRange ? oneLine(currencyRange) : undefined;
}

export function extractDeadline(text: string): string | undefined {
  return (
    extractLabel(text, [
      'Last Date of Application',
      'Application deadline',
      'Closing date',
      'Valid through',
    ]) ??
    (oneLine(
      text.match(
        /(?:application deadline|closing date|last date(?: of application)?)\s*:?\s*([^\n]+)/i,
      )?.[1],
    ) || undefined)
  );
}

export function extractSkills(text: string): string[] | undefined {
  const labelled = extractLabel(text, ['Skills', 'Required skills', 'Key skills']);
  if (!labelled) return undefined;

  const skills = labelled
    .split(/[,;|]/)
    .map(oneLine)
    .filter((skill) => skill.length >= 2 && skill.length <= 80);

  return skills.length ? Array.from(new Set(skills)) : undefined;
}

export function findSectionByHeading(
  root: ParentNode,
  headingPattern: RegExp,
): Element | null {
  const headings = queryAll<HTMLElement>(root, 'h1, h2, h3, h4');
  const heading = headings.find((item) => headingPattern.test(oneLine(item.textContent)));
  if (!heading) return null;

  let current: Element | null = heading.parentElement;
  for (let depth = 0; current && depth < 7; depth += 1) {
    const text = elementText(current);
    if (text.length >= 80 || current.matches('section, article')) return current;
    current = current.parentElement;
  }

  return heading.parentElement;
}

export function findExactText(root: ParentNode, values: string[]): string | undefined {
  const wanted = new Map(values.map((value) => [value.toLowerCase(), value]));
  const elements = queryAll<HTMLElement>(root, 'a, button, span, li');

  for (const element of elements) {
    const text = oneLine(element.textContent).toLowerCase();
    const canonical = wanted.get(text);
    if (canonical) return canonical;
  }

  return undefined;
}

export function decodeHtml(html?: string): string {
  if (!html) return '';
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  return cleanText(parsed.body.innerText || parsed.body.textContent);
}

export function firstUsefulText(
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

export function metaContent(doc: Document, selectors: string[]): string | undefined {
  const element = queryFirst<HTMLMetaElement>(doc, selectors);
  return oneLine(element?.content) || undefined;
}
