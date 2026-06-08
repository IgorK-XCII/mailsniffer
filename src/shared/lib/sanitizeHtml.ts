import DOMPurify from 'dompurify';

export const sanitizeHtml = (input: string): string =>
  DOMPurify.sanitize(input, {
    USE_PROFILES: { html: true, svg: true, svgFilters: true },
    FORBID_TAGS: ['script', 'style'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick'],
  });

export const isHtml = (contentType: string, body: string): boolean => {
  if (contentType.toLowerCase().includes('html')) return true;
  return /<\/?[a-z][\s\S]*>/i.test(body);
};
