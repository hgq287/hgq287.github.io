import {
  AUTHOR_NAME,
  AUTHOR_SAME_AS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_ORIGIN,
} from './site-config';

const personId = `${SITE_ORIGIN}/#person`;
const websiteId = `${SITE_ORIGIN}/#website`;

export function buildPersonAndWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: AUTHOR_NAME,
        url: SITE_ORIGIN,
        sameAs: [...AUTHOR_SAME_AS],
        jobTitle: 'Systems Architect; Principal AI Engineer',
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: SITE_NAME,
        url: SITE_ORIGIN,
        description: SITE_DESCRIPTION,
        inLanguage: 'en-US',
        publisher: { '@id': personId },
      },
    ],
  };
}

export function buildArticleJsonLd(input: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  sectionLabel: 'Blog' | 'Systems';
  sectionPath: '/blog' | '/systems';
}) {
  const personIdRef = `${SITE_ORIGIN}/#person`;
  const websiteIdRef = `${SITE_ORIGIN}/#website`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        headline: input.headline,
        description: input.description,
        datePublished: input.datePublished,
        author: { '@type': 'Person', '@id': personIdRef, name: AUTHOR_NAME },
        url: input.url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': input.url },
        isPartOf: {
          '@type': 'WebSite',
          '@id': websiteIdRef,
          name: SITE_NAME,
          url: SITE_ORIGIN,
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_ORIGIN,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_ORIGIN}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: input.sectionLabel,
            item: `${SITE_ORIGIN}${input.sectionPath}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: input.headline,
            item: input.url,
          },
        ],
      },
    ],
  };
}
