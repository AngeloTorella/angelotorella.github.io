import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Empty string means "not set": the UI hides links whose value is ''.
const optionalUrl = z.union([z.literal(''), z.url()]).default('');

const profile = defineCollection({
  loader: file('src/content/profile.json'),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    tagline: z.string(),
    bio: z.string().optional(),
    email: z.email(),
    location: z.string().optional(),
    // Path relative to /public (e.g. "/images/avatar.jpg"). Only rendered if the file exists.
    avatarUrl: z.string().optional(),
    linkedin: optionalUrl,
    github: optionalUrl,
    twitter: optionalUrl,
    calendarUrl: optionalUrl,
    education: z.array(z.string()).default([]),
    languages: z.array(z.object({ name: z.string(), level: z.string() })).default([]),
  }),
});

const techStack = defineCollection({
  loader: file('src/content/tech-stack.json'),
  schema: z.object({
    name: z.string(),
    category: z.string(),
    color: z.string().optional(),
    order: z.number().default(0),
  }),
});

// Markdown files: frontmatter holds the fields, the body is the description.
const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    icon: z.string().optional(),
    order: z.number().default(0),
    isActive: z.boolean().default(true),
    priceLabel: z.string().optional(),
    ctaText: z.string().default('Agendar llamada'),
    ctaHref: z.string().default('/contacto'),
    techStack: z.array(reference('techStack')).default([]),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    service: reference('services'),
    client: z.string().optional(),
    challenge: z.string().optional(),
    solution: z.string().optional(),
    results: z.string().optional(),
    stack: z.array(z.string()).default([]),
    artifacts: z.array(z.object({ url: z.string(), caption: z.string() })).default([]),
    isPublic: z.boolean().default(true),
    order: z.number().default(0),
  }),
});

const experience = defineCollection({
  loader: file('src/content/experience.json'),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    // "YYYY-MM" is formatted as a date; any other string is shown as-is.
    startDate: z.string(),
    endDate: z.string().optional(),
    location: z.string().optional(),
    type: z.enum(['full-time', 'contract', 'freelance', 'side-project']).default('full-time'),
    description: z.string().optional(),
    highlights: z.array(z.string()).default([]),
    stack: z.array(z.string()).default([]),
    isVisibleInCv: z.boolean().default(true),
    order: z.number().default(0),
  }),
});

export const collections = { profile, services, caseStudies, experience, techStack };
