export const CONTENT_SECTIONS = ['blog', 'systems', 'ops'] as const;

export type ContentSection = (typeof CONTENT_SECTIONS)[number];

export type ContentSectionPath = `/${ContentSection}`;

export const CONTENT_SECTION_LABEL: Record<ContentSection, string> = {
  blog: 'Blog',
  systems: 'Systems',
  ops: 'Ops',
};
