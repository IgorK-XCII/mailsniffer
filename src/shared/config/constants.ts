export const API_BASE_URL = '';

export const POLLING_INTERVAL_MS = 5000;

export const QUERY_KEYS = {
  emails: ['emails'] as const,
};

/**
 * Below this viewport width the mailbox uses a single-pane (collapsible)
 * layout; at or above it the list and the detail pane sit side by side
 * permanently. Chosen to target 27" desktop monitors (typically 2560+ wide)
 * and above. A 14" laptop or a 24" FHD secondary monitor stays under the
 * threshold and gets the compact UX.
 */
export const WIDE_LAYOUT_MIN_WIDTH_PX = 1920;
export const WIDE_LAYOUT_MEDIA_QUERY = `(min-width:${WIDE_LAYOUT_MIN_WIDTH_PX}px)`;
