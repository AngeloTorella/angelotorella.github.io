import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getCollection, getEntry, getEntries, type CollectionEntry } from 'astro:content';

export async function getProfile() {
  const entry = await getEntry('profile', 'main');
  if (!entry) throw new Error('Missing profile entry "main" in src/content/profile.json');
  return entry.data;
}

export async function getServices() {
  const services = await getCollection('services', ({ data }) => data.isActive);
  return services.sort((a, b) => a.data.order - b.data.order);
}

export async function getServiceTech(service: CollectionEntry<'services'>) {
  return getEntries(service.data.techStack);
}

export async function getCaseStudies(serviceId?: string) {
  const studies = await getCollection(
    'caseStudies',
    ({ data }) => data.isPublic && (!serviceId || data.service.id === serviceId),
  );
  return studies.sort((a, b) => a.data.order - b.data.order);
}

export async function getExperienceForCv() {
  const items = await getCollection('experience', ({ data }) => data.isVisibleInCv);
  return items.sort((a, b) => a.data.order - b.data.order);
}

export async function getTechStackByCategory() {
  const items = (await getCollection('techStack')).sort((a, b) => a.data.order - b.data.order);
  const groups = new Map<string, string[]>();
  for (const { data } of items) {
    groups.set(data.category, [...(groups.get(data.category) ?? []), data.name]);
  }
  return [...groups].map(([category, skills]) => ({ category, skills }));
}

/** True if `publicPath` (e.g. "/cv/file.pdf") exists in /public at build time. */
export function publicFileExists(publicPath: string) {
  return existsSync(join(process.cwd(), 'public', publicPath));
}

/** Formats "YYYY-MM" as a short Spanish date; any other value is returned unchanged. */
export function formatMonth(value: string) {
  if (!/^\d{4}-\d{2}$/.test(value)) return value;
  return new Date(`${value}-01T00:00:00`).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
}
