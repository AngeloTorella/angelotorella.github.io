import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getCollection, getEntry, getEntries, type CollectionEntry } from 'astro:content';
import { defaultLang, type Lang } from '@/i18n/ui';

type Localized = { es: string; en: string };

/** Resolves a plain or {es,en} value to the requested language. */
export function pick(value: string | Localized, lang: Lang): string;
export function pick(value: string | Localized | undefined, lang: Lang): string | undefined;
export function pick(value: string | Localized | undefined, lang: Lang) {
  return typeof value === 'object' ? value[lang] : value;
}

export async function getProfile(lang: Lang = defaultLang) {
  const entry = await getEntry('profile', 'main');
  if (!entry) throw new Error('Missing profile entry "main" in src/content/profile.json');
  const { title, cvTitle, cvSummary, tagline, headline, bio, education, certifications, ...shared } = entry.data;
  return {
    ...shared,
    title: title[lang],
    cvTitle: cvTitle?.[lang] ?? title[lang],
    cvSummary: cvSummary?.[lang],
    tagline: tagline[lang],
    headline: headline?.[lang],
    bio: bio?.[lang],
    education: education.map((item) => item[lang]),
    certifications: certifications.map((c) => ({ ...c, name: c.name[lang] })),
  };
}

/** A service entry plus its language-independent slug (the file name without the language folder). */
export type Service = CollectionEntry<'services'> & { slug: string };

export async function getServices(lang: Lang = defaultLang): Promise<Service[]> {
  const services = await getCollection('services', ({ id, data }) => id.startsWith(`${lang}/`) && data.isActive);
  return services
    .map((service) => ({ ...service, slug: service.id.slice(lang.length + 1) }))
    .sort((a, b) => a.data.order - b.data.order);
}

export async function getServiceTech(service: CollectionEntry<'services'>) {
  return getEntries(service.data.techStack);
}

export async function getCaseStudies(lang: Lang = defaultLang, serviceSlug?: string) {
  const studies = await getCollection(
    'caseStudies',
    ({ data }) =>
      data.isPublic && data.lang === lang && (!serviceSlug || data.service.id.endsWith(`/${serviceSlug}`)),
  );
  return studies.sort((a, b) => a.data.order - b.data.order);
}

export async function getExperienceForCv(lang: Lang = defaultLang) {
  const items = await getCollection('experience', ({ data }) => data.isVisibleInCv);
  return items
    .sort((a, b) => a.data.order - b.data.order)
    .map(({ data: d }) => ({
      ...d,
      role: d.role[lang],
      company: d.company?.[lang],
      location: d.location?.[lang],
      duration: d.duration?.[lang],
      description: d.description?.[lang],
      highlights: d.highlights.map((h) => h[lang]),
      stack: d.stack.map((s) => pick(s, lang)),
    }));
}

export async function getTechStackByCategory(lang: Lang = defaultLang) {
  const items = (await getCollection('techStack')).sort((a, b) => a.data.order - b.data.order);
  const groups = new Map<string, string[]>();
  for (const { data } of items) {
    const category = data.category[lang];
    groups.set(category, [...(groups.get(category) ?? []), pick(data.name, lang)]);
  }
  return [...groups].map(([category, skills]) => ({ category, skills }));
}

/** True if `publicPath` (e.g. "/cv/file.pdf") exists in /public at build time. */
export function publicFileExists(publicPath: string) {
  return existsSync(join(process.cwd(), 'public', publicPath));
}

/** Formats "YYYY-MM" as a short date in the given language; any other value is returned unchanged. */
export function formatMonth(value: string, lang: Lang = defaultLang) {
  if (!/^\d{4}-\d{2}$/.test(value)) return value;
  const locale = lang === 'es' ? 'es-ES' : 'en-US';
  return new Date(`${value}-01T00:00:00`).toLocaleDateString(locale, { month: 'short', year: 'numeric' });
}
