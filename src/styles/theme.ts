export const theme = {
  colors: {
    primary: "#0F3D3E",
    light: "#335C67",
    accent: "#F4A261",
    // Buttons specifically (not text/borders/labels) match the logo's black, not the dark-teal
    // `primary` — kept as its own color rather than repointing `primary`, since `primary` is
    // also used for headings/links/borders across the site and those aren't changing.
    buttonBg: "#000000",
  },
};

export type AppTheme = typeof theme;
