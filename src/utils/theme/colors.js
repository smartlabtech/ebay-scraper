// Color system mapping from Tailwind to Mantine
export const colors = {
  // Brand colors - Updated to match 2zpoint branding
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af", // Main 2zpoint blue
    900: "#1e3a8a",
    950: "#172554"
  },

  // Secondary brand color (green)
  secondary: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#059669", // 2zpoint green
    800: "#047857",
    900: "#064e3b",
    950: "#022c16"
  },

  // Semantic colors
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#0a3a1f"
  },

  danger: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
    950: "#611a1a"
  },

  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    950: "#5a2e0c"
  },

  info: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172e65"
  },

  // Neutral colors
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#030712"
  }
}

// Convert color objects to arrays for Mantine
const colorObjectToArray = (colorObj) => [
  colorObj[50],
  colorObj[100],
  colorObj[200],
  colorObj[300],
  colorObj[400],
  colorObj[500],
  colorObj[600],
  colorObj[700],
  colorObj[800],
  colorObj[900]
]

// Mantine theme color configuration
export const mantineColors = {
  primary: colorObjectToArray(colors.primary),
  blue: colorObjectToArray(colors.primary), // 2zpoint blue
  green: colorObjectToArray(colors.secondary), // 2zpoint green
  success: colorObjectToArray(colors.success),
  red: colorObjectToArray(colors.danger),
  yellow: colorObjectToArray(colors.warning),
  info: colorObjectToArray(colors.info),
  gray: colorObjectToArray(colors.gray),
  dark: [
    colors.gray[50],
    colors.gray[100],
    colors.gray[200],
    colors.gray[300],
    colors.gray[400],
    colors.gray[500],
    colors.gray[600],
    colors.gray[700],
    colors.gray[800],
    colors.gray[900]
  ]
}

// Color utilities
export const getColorShade = (color, shade = 500) => {
  if (colors[color]) {
    return colors[color][shade]
  }
  return color
}

export const getSemanticColor = (type) => {
  const semanticMap = {
    primary: "blue",
    secondary: "green",
    success: "success",
    danger: "red",
    warning: "yellow",
    info: "info"
  }
  return semanticMap[type] || type
}

// Gradient presets
export const gradients = {
  primary: {from: colors.primary[400], to: colors.primary[600], deg: 135},
  success: {from: colors.success[400], to: colors.success[600], deg: 135},
  danger: {from: colors.danger[400], to: colors.danger[600], deg: 135},
  warning: {from: colors.warning[400], to: colors.warning[600], deg: 135},
  info: {from: colors.info[400], to: colors.info[600], deg: 135},
  sunset: {from: "#ff6b6b", to: "#ff8e53", deg: 45},
  ocean: {from: "#667eea", to: "#764ba2", deg: 135},
  forest: {from: "#38a169", to: "#2f855a", deg: 135},
  fire: {from: "#f56565", to: "#e53e3e", deg: 135},
  night: {from: "#1a202c", to: "#2d3748", deg: 135}
}

// Dark mode color mappings
export const darkModeColors = {
  background: {
    light: colors.gray[50],
    dark: colors.gray[900]
  },
  surface: {
    light: "#ffffff",
    dark: colors.gray[800]
  },
  border: {
    light: colors.gray[200],
    dark: colors.gray[700]
  },
  text: {
    primary: {
      light: colors.gray[900],
      dark: colors.gray[50]
    },
    secondary: {
      light: colors.gray[600],
      dark: colors.gray[400]
    },
    muted: {
      light: colors.gray[500],
      dark: colors.gray[500]
    }
  }
}

export default {
  colors,
  mantineColors,
  getColorShade,
  getSemanticColor,
  gradients,
  darkModeColors
}
