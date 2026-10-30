import { defaultLang, langs, ui, type Lang, type UiKey } from './ui';

export { defaultLang, langs, type Lang, type UiKey };

/** Detects the language from the first path segment ("/en/..." is English, anything else is Spanish). */
export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return (langs as string[]).includes(first) ? (first as Lang) : defaultLang;
}

export function useTranslations(lang: Lang) {
  return (key: UiKey): string => ui[lang][key] ?? ui[defaultLang][key];
}

/** Pages that exist in every language, with a localized path for each. */
export type Route = { name: 'home' } | { name: 'contact' } | { name: 'service'; slug: string };

const routePaths = {
  home: { es: '/', en: '/en/' },
  contact: { es: '/contacto/', en: '/en/contact/' },
  servicesPrefix: { es: '/services/', en: '/en/services/' },
} as const;

export function routePath(route: Route, lang: Lang): string {
  if (route.name === 'home') return routePaths.home[lang];
  if (route.name === 'contact') return routePaths.contact[lang];
  return `${routePaths.servicesPrefix[lang]}${route.slug}/`;
}

/** Path of a home-page section, e.g. localizedAnchor('servicios', 'en') -> "/en/#servicios". */
export function sectionPath(anchor: string, lang: Lang): string {
  return `${routePaths.home[lang]}#${anchor}`;
}

/** Contact page path, optionally pre-selecting a service. */
export function contactPath(lang: Lang, service?: string): string {
  const base = routePath({ name: 'contact' }, lang);
  return service ? `${base}?service=${encodeURIComponent(service)}` : base;
}
