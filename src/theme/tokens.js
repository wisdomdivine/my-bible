/**
 * Design Tokens extracted from Interface Craft (interfacecraft.dev)
 * Fonts and palette for My Bible
 */

export const fonts = {
  // Editorial serif used for headlines, passage titles, and literary reading
  serif: "'Signifier', Georgia, serif",
  
  // Clean grotesque sans-serifs
  sans: "'Neue Haas Grotesk', 'Founders Grotesk', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
  founders: "'Founders Grotesk', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
  neueHaas: "'Neue Haas Grotesk', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
}

export const colors = {
  // Core palette from Interface Craft cards and identity
  orange: '#E54F10',       // Working Knowledge
  cream: '#F6EBD9',        // Practical Demonstration (Warm Paper)
  blue: '#1D57F6',         // Collaborate with AI
  mint: '#53F399',         // Means & Methods
  black: '#010101',        // Interface Kit
  sky: '#00A1F1',          // Cyan / Sky
  pink: '#FD73ED',         // Pink / Magenta
  yellow: '#FFD102',       // Sunflower Yellow

  // Neutral tones
  light: {
    bg: '#FAFAFA',
    surface: '#FFFFFF',
    creamBg: '#F6EBD9',
    textPrimary: '#1C1917',
    textMuted: '#57534E',
    textFaint: '#78716C',
    subtle: '#F5F5F4',
  },
  dark: {
    bg: '#0C0A09',
    surface: '#1C1917',
    textPrimary: '#F5F5F4',
    textMuted: '#A8A29E',
    textFaint: '#78716C',
    subtle: '#292524',
  }
}

export default { fonts, colors }
