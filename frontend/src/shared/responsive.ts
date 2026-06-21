export const VIEWPORTS = {
  mobile: '375px',
  tablet: '768px',
  desktop: '1024px',
} as const;

export type Viewport = keyof typeof VIEWPORTS;

export const useMediaQuery = (query: string) => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(query).matches;
};

export const useViewport = () => {
  const isMobile = useMediaQuery(`(max-width: ${VIEWPORTS.tablet})`);
  const isTablet = useMediaQuery(`(min-width: ${VIEWPORTS.mobile}) and (max-width: ${VIEWPORTS.desktop})`);
  const isDesktop = useMediaQuery(`(min-width: ${VIEWPORTS.desktop})`);

  return { isMobile, isTablet, isDesktop };
};