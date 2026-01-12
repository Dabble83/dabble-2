export const designTokens = {
  // Colors
  colors: {
    // Background colors
    background: {
      base: '#faf8f5',
      paper: '#faf8f5',
      overlay: 'rgba(255, 250, 245, 0.25)',
    },
    // Text colors
    text: {
      primary: '#1f2937', // gray-900
      secondary: '#4b5563', // gray-600
      tertiary: '#6b7280', // gray-500
      brand: '#2d5016',
    },
    // Link colors
    link: {
      default: '#374151', // gray-700
      hover: '#2d5016',
    },
    // Button colors
    button: {
      primary: {
        bg: '#a8d5a3',
        bgHover: '#95c590',
        border: '#2d5016',
        text: '#2d5016',
      },
    },
    // Border colors
    border: {
      default: 'rgb(229, 231, 235)', // gray-200
      hover: 'rgb(209, 213, 219)', // gray-300
    },
    // Card colors
    card: {
      bg: 'rgba(255, 255, 255, 0.75)',
      border: 'rgb(229, 231, 235)',
    },
  },

  // Border radius
  radius: {
    small: '11px', // Buttons, inputs
    medium: '12px', // Cards
    large: '16px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },

  // Spacing scale (in pixels, converted to Tailwind classes where applicable)
  spacing: {
    // Base unit: 4px
    xs: '4px',    // 0.25rem
    sm: '8px',    // 0.5rem
    md: '16px',   // 1rem
    lg: '24px',   // 1.5rem
    xl: '32px',   // 2rem
    '2xl': '40px', // 2.5rem
    '3xl': '48px', // 3rem
    '4xl': '64px', // 4rem
    '5xl': '72px', // 4.5rem
    '6xl': '96px', // 6rem
    
    // Semantic spacing
    nav: {
      paddingTop: '24px',
      paddingSide: '32px',
    },
    hero: {
      minHeight: '640px',
      paddingTop: '100px',
      contentPaddingTop: '40px',
      paddingBottom: '64px',
    },
    section: {
      paddingTop: '72px',
      paddingBottom: '72px',
      paddingTopDesktop: '96px',
      paddingBottomDesktop: '96px',
    },
    content: {
      gapSmall: '14px',   // space-y-3.5
      gapMedium: '20px',  // space-y-5
      gapLarge: '24px',   // space-y-6
    },
    grid: {
      gapMobile: '20px',  // gap-5
      gapDesktop: '24px', // gap-6
    },
  },

  // Typography scale
  typography: {
    // Font families
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
      handDrawn: "'Kalam', cursive",
    },
    // Font sizes
    fontSize: {
      xs: '12px',      // 0.75rem
      sm: '14px',      // 0.875rem
      base: '16px',    // 1rem
      lg: '18px',      // 1.125rem
      xl: '20px',      // 1.25rem
      '2xl': '24px',   // 1.5rem
      '3xl': '30px',   // 1.875rem
      '4xl': '36px',   // 2.25rem
      '5xl': '48px',   // 3rem
      '6xl': '56px',   // 3.5rem
      '7xl': '64px',   // 4rem
    },
    // Line heights
    lineHeight: {
      tight: '1.05',
      snug: '1.1',
      normal: '1.4',
      relaxed: '1.5',
      loose: '1.6',
    },
    // Font weights
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    // Specific typography styles
    styles: {
      nav: {
        fontSize: '14px',
        fontSizeDesktop: '16px',
        fontWeight: '500',
      },
      logo: {
        fontSize: '24px',
        fontSizeDesktop: '30px',
        fontWeight: '700',
      },
      headline: {
        fontSize: '56px',
        fontSizeDesktop: '64px',
        lineHeight: '1.05',
        fontWeight: '700',
      },
      subhead: {
        fontSize: '18px',
        fontSizeDesktop: '20px',
        lineHeight: '1.5',
        fontWeight: '400',
      },
      button: {
        fontSize: '16px',
        fontWeight: '600',
        lineHeight: '54px',
      },
      sectionTitle: {
        fontSize: '24px',
        fontSizeDesktop: '30px',
        fontWeight: '700',
      },
      cardTitle: {
        fontSize: '14px',
        fontSizeDesktop: '16px',
        fontWeight: '600',
      },
      body: {
        fontSize: '14px',
        fontWeight: '400',
      },
    },
  },

  // Layout
  layout: {
    maxWidth: {
      container: '1120px',
      narrow: '672px', // max-w-2xl
      wide: '1280px',
    },
    hero: {
      backgroundHeight: '65vh',
    },
  },

  // Legacy support (keeping for backward compatibility)
  background: {
    base: '#faf8f5',
    watercolor: {
      gradient1: 'linear-gradient(180deg, rgba(232, 245, 233, 0.4) 0%, rgba(240, 248, 255, 0.3) 38%, rgba(255, 250, 240, 0.35) 68%, rgba(249, 251, 231, 0.3) 100%)',
      gradient2: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(200, 230, 201, 0.18) 0%, transparent 60%)',
      gradient2Opacity: 0.4,
    },
    paperTexture: {
      svg: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      opacity: 0.08,
    },
  },
  button: {
    primary: {
      bg: '#a8d5a3',
      bgHover: '#95c590',
      border: '#2d5016',
      borderWidth: '2px',
      text: '#2d5016',
      shadow: 'shadow-sm',
      padding: {
        x: 'px-9',
        y: 'py-3.5',
      },
    },
  },
  text: {
    primary: '#1f2937',
    secondary: '#4b5563',
    tertiary: '#6b7280',
    brand: '#2d5016',
    link: {
      default: '#374151',
      hover: '#2d5016',
    },
  },
  container: {
    maxWidth: {
      default: 'max-w-6xl',
      narrow: 'max-w-2xl',
      wide: 'max-w-7xl',
    },
  },
  card: {
    bg: 'bg-white/75',
    backdrop: 'backdrop-blur-sm',
    border: 'border border-gray-200',
    padding: {
      mobile: 'p-5',
      desktop: 'md:p-6',
    },
    paddingLarge: {
      mobile: 'p-7',
      desktop: 'md:p-10',
    },
  },
  illustration: {
    opacity: 0.55,
  },
} as const
