export const colors = {
  background: '#07111d',
  backgroundAlt: '#0d1a2a',
  panel: '#0f1d2f',
  panelStrong: '#16273f',
  card: '#122338',
  cardSoft: '#101f2f',
  primary: '#4da3ff',
  primarySoft: '#7cc5ff',
  cyan: '#5ee7ff',
  purple: '#8b7dff',
  green: '#38d39f',
  red: '#ff5d73',
  amber: '#ffbd59',
  text: '#edf6ff',
  textMuted: '#8aa4bd',
  border: 'rgba(137, 164, 200, 0.18)',
  shadow: 'rgba(12, 22, 36, 0.5)',
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
  round: 999,
};

export const typography = {
  title: {
    fontSize: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.8,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 0.8,
  },
};

export const shadows = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  glow: {
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const sharedStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  shell: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
};
