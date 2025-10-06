/**
 * Reusable Component Styles
 * Based on Landing1 design patterns for consistent UI across the application
 */

import { theme2zpoint } from './2zpointTheme'

const { colors, typography, spacing, borderRadius, shadows, transitions } = theme2zpoint

// Button Styles
export const buttonStyles = {
  // Primary button (blue)
  primary: {
    base: {
      background: colors.primary.main,
      color: colors.neutral.white,
      fontWeight: typography.fontWeight.semibold,
      border: 'none',
      cursor: 'pointer',
      transition: transitions.all,
      position: 'relative',
      overflow: 'hidden'
    },
    hover: {
      background: colors.primary.dark,
      transform: 'translateY(-1px)',
      boxShadow: shadows.primary
    },
    sizes: {
      sm: {
        padding: '8px 16px',
        fontSize: typography.fontSize.sm
      },
      md: {
        padding: '12px 24px',
        fontSize: typography.fontSize.base
      },
      lg: {
        padding: '14px 32px',
        fontSize: typography.fontSize.base
      },
      xl: {
        padding: '16px 40px',
        fontSize: typography.fontSize.lg
      }
    }
  },

  // Secondary button (outline)
  secondary: {
    base: {
      background: colors.neutral.white,
      color: colors.primary.main,
      borderColor: colors.primary.main,
      borderWidth: '2px',
      borderStyle: 'solid',
      fontWeight: typography.fontWeight.semibold,
      cursor: 'pointer',
      transition: transitions.all
    },
    hover: {
      background: colors.primary.main,
      color: colors.neutral.white,
      transform: 'translateY(-1px)',
      boxShadow: shadows.primary
    },
    sizes: {
      sm: {
        padding: '8px 16px',
        fontSize: typography.fontSize.sm
      },
      md: {
        padding: '12px 24px',
        fontSize: typography.fontSize.base
      },
      lg: {
        padding: '14px 32px',
        fontSize: typography.fontSize.base
      },
      xl: {
        padding: '16px 40px',
        fontSize: typography.fontSize.lg
      }
    }
  },

  // Success button (green)
  success: {
    base: {
      background: colors.secondary.main,
      color: colors.neutral.white,
      fontWeight: typography.fontWeight.semibold,
      border: 'none',
      cursor: 'pointer',
      transition: transitions.all
    },
    hover: {
      background: colors.secondary.dark,
      transform: 'translateY(-1px)',
      boxShadow: shadows.success
    },
    sizes: {
      sm: {
        padding: '8px 16px',
        fontSize: typography.fontSize.sm
      },
      md: {
        padding: '12px 24px',
        fontSize: typography.fontSize.base
      },
      lg: {
        padding: '14px 32px',
        fontSize: typography.fontSize.base
      },
      xl: {
        padding: '16px 40px',
        fontSize: typography.fontSize.lg
      }
    }
  }
}

// Card Styles
export const cardStyles = {
  // Default card
  default: {
    background: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing['2xl'],
    boxShadow: shadows.lg,
    transition: transitions.all,
    border: `1px solid ${colors.neutral[200]}`
  },

  // Hover effect card
  interactive: {
    base: {
      background: colors.neutral.white,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      boxShadow: shadows.lg,
      transition: transitions.all,
      border: `1px solid ${colors.neutral[200]}`,
      cursor: 'pointer'
    },
    hover: {
      transform: 'translateY(-5px)',
      boxShadow: shadows.xl,
      borderColor: colors.primary.main
    }
  },

  // Feature card
  feature: {
    base: {
      background: colors.neutral.white,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      border: `1px solid ${colors.neutral[200]}`,
      transition: transitions.all,
      height: '100%',
      cursor: 'pointer'
    },
    hover: {
      transform: 'translateY(-2px)',
      boxShadow: shadows.lg,
      borderColor: colors.primary.main
    }
  },

  // Testimonial card
  testimonial: {
    base: {
      background: colors.neutral.white,
      borderRadius: borderRadius.lg,
      padding: spacing['2xl'],
      boxShadow: shadows.lg,
      height: '100%',
      transition: `${transitions.transform}, ${transitions.shadow}`
    },
    hover: {
      transform: 'translateY(-5px)',
      boxShadow: shadows.xl
    }
  }
}

// Section Styles
export const sectionStyles = {
  // Hero section
  hero: {
    background: colors.gradients.hero,
    position: 'relative',
    overflow: 'hidden',
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center'
  },

  // Default section
  default: {
    paddingTop: spacing['5xl'],
    paddingBottom: spacing['5xl'],
    background: colors.neutral.white
  },

  // Alternate section (gray background)
  alternate: {
    paddingTop: spacing['5xl'],
    paddingBottom: spacing['5xl'],
    background: colors.neutral[50]
  },

  // Problem/danger section
  problem: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: borderRadius.lg,
    padding: spacing['2xl'],
    margin: `${spacing['4xl']} 0`,
    position: 'relative',
    overflow: 'hidden'
  }
}

// Typography Styles
export const textStyles = {
  // Hero title
  heroTitle: {
    fontSize: typography.fontSize.hero,
    fontWeight: typography.fontWeight.black,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
    color: colors.neutral[900]
  },

  // Section title
  sectionTitle: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.extrabold,
    lineHeight: typography.lineHeight.snug,
    color: colors.neutral[900],
    marginBottom: spacing.md
  },

  // Subtitle
  subtitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.relaxed,
    color: colors.neutral[600]
  },

  // Body text
  body: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.relaxed,
    color: colors.neutral[600]
  },

  // Accent text
  accent: {
    primary: {
      color: colors.primary.main,
      fontWeight: typography.fontWeight.semibold
    },
    secondary: {
      color: colors.secondary.main,
      fontWeight: typography.fontWeight.semibold
    },
    danger: {
      color: colors.semantic.danger,
      fontWeight: typography.fontWeight.semibold
    }
  }
}

// Badge Styles
export const badgeStyles = {
  // Trust badge
  trust: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.sm,
    background: colors.neutral.white,
    border: `1px solid ${colors.neutral[200]}`,
    padding: `6px 14px`,
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[600],
    boxShadow: shadows.sm
  },

  // Success badge
  success: {
    background: colors.semantic.successLight,
    color: colors.secondary.dark,
    padding: `4px 12px`,
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold
  },

  // Popular badge
  popular: {
    background: colors.primary.main,
    color: colors.neutral.white,
    padding: `6px 16px`,
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold
  }
}

// List Styles
export const listStyles = {
  // Check list
  checkList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    '& li': {
      display: 'flex',
      alignItems: 'flex-start',
      gap: spacing.md,
      marginBottom: spacing.md,
      color: colors.neutral[600],
      fontSize: typography.fontSize.base,
      lineHeight: typography.lineHeight.relaxed
    }
  },

  // Feature list
  featureList: {
    listStyle: 'none',
    padding: 0,
    display: 'grid',
    gap: spacing.lg,
    '& li': {
      display: 'flex',
      alignItems: 'flex-start',
      gap: spacing.md
    }
  }
}

// Icon Styles
export const iconStyles = {
  // Feature icon
  feature: {
    width: '48px',
    height: '48px',
    background: colors.gradients.blue,
    borderRadius: borderRadius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.fontSize.xl
  },

  // Warning icon
  warning: {
    width: '24px',
    height: '24px',
    background: colors.semantic.danger,
    color: colors.neutral.white,
    borderRadius: borderRadius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: typography.fontWeight.bold
  },

  // Check icon
  check: {
    color: colors.secondary.main,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold
  }
}

// Stat Styles
export const statStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  number: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
    lineHeight: typography.lineHeight.tight,
    marginBottom: spacing.xs
  },
  label: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[500],
    fontWeight: typography.fontWeight.medium
  }
}

// Form Styles
export const formStyles = {
  input: {
    base: {
      width: '100%',
      padding: `${spacing.md} ${spacing.lg}`,
      fontSize: typography.fontSize.base,
      border: `1px solid ${colors.neutral[300]}`,
      borderRadius: borderRadius.base,
      background: colors.neutral.white,
      transition: transitions.colors,
      '&:focus': {
        borderColor: colors.primary.main,
        outline: 'none',
        boxShadow: `0 0 0 3px ${colors.primary[100]}`
      }
    }
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[700],
    marginBottom: spacing.sm
  }
}

// Export all styles as a single object
export const componentStylesKit = {
  buttons: buttonStyles,
  cards: cardStyles,
  sections: sectionStyles,
  text: textStyles,
  badges: badgeStyles,
  lists: listStyles,
  icons: iconStyles,
  stats: statStyles,
  forms: formStyles
}

export default componentStylesKit