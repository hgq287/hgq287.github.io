import type { Metadata } from 'next';

export const SITE_ORIGIN = 'https://hgq287.github.io';

export const SITE_NAME = "Hg's Portfolio";

/** Default `<title>` and OG title (aligned with intro: Systems + Principal AI). */
export const SITE_TITLE_DEFAULT =
  'Hung Q. Truong – Systems Architect & Principal AI Engineer';

/** ~155 chars: portfolio + positioning for snippets. */
export const SITE_DESCRIPTION =
  'Systems Architect with 15+ years. Principal AI: strategy, architecture, and shipping from research to production. Swift, C++, core engines, Kotlin Multiplatform, backends.';

export const AUTHOR_NAME = 'Hung Q. Truong';

export const AUTHOR_SAME_AS = [
  'https://www.linkedin.com/in/hgq287',
  'https://github.com/hgq287',
  'https://stackoverflow.com/users/12345813/hgq287',
] as const;

/** Shared OG / Twitter preview (1200×630; PNG generated from og-default.svg via `npm run generate-og`). */
export const OG_IMAGE_PATH = '/og-default.png';

const metadataBase = new URL(SITE_ORIGIN);

const ogImageEntry = {
  url: OG_IMAGE_PATH,
  width: 1200,
  height: 630,
  alt: `${AUTHOR_NAME} – ${SITE_NAME}`,
};

export const rootMetadata = {
  metadataBase,
  title: {
    default: SITE_TITLE_DEFAULT,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: SITE_NAME,
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    images: [ogImageEntry],
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE_PATH],
  },
} satisfies Metadata;

export const homePageMetadata = {
  title: SITE_TITLE_DEFAULT,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    url: '/',
    images: [ogImageEntry],
  },
  twitter: {
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE_PATH],
  },
} satisfies Metadata;

export const blogIndexMetadata = {
  title: 'Blog',
  description:
    'Engineering notes: architecture, patterns, OAuth, Next.js, and tooling. Same voice as the systems blueprints: practical and stack-specific where it helps.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: `Blog | ${SITE_NAME}`,
    description:
      'Engineering notes on architecture, security, Next.js, OAuth, and patterns.',
    url: '/blog',
    images: [ogImageEntry],
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: `Blog | ${SITE_NAME}`,
    description:
      'Engineering notes on architecture, security, Next.js, OAuth, and patterns.',
    images: [OG_IMAGE_PATH],
  },
} satisfies Metadata;

export const systemsIndexMetadata = {
  title: 'Systems',
  description:
    'Systems blueprints and playbooks: deployment, Docker, edge AI pipelines, quantization, and ops. Written for repeatable execution, not slideware.',
  alternates: {
    canonical: '/systems',
  },
  openGraph: {
    title: `Systems | ${SITE_NAME}`,
    description:
      'Blueprints for deployment, Docker, edge AI pipelines, quantization, and operations.',
    url: '/systems',
    images: [ogImageEntry],
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: `Systems | ${SITE_NAME}`,
    description:
      'Blueprints for deployment, Docker, edge AI pipelines, quantization, and operations.',
    images: [OG_IMAGE_PATH],
  },
} satisfies Metadata;
