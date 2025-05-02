import { createTheme } from "@mui/material/styles";
// color design tokens export

export const tokensDark = {
  grey: {
    0: "#ffffff", // manually adjusted
    10: "#f6f6f6", // manually adjusted
    50: "#f0f0f0", // manually adjusted
    100: "#e0e0e0",
    200: "#c2c2c2",
    300: "#a3a3a3",
    400: "#858585",
    500: "#666666",
    600: "#2a2732", //manually
    700: "#25222c", //manually
    800: "#19171e", //manually
    900: "#141414",
    1000: "#000000", // manually adjusted
  },
  primary: {
    // grey
    0: "#ffffff", // manually adjusted
    10: "#f6f6f6", // manually adjusted
    50: "#f0f0f0", // manually adjusted
    100: "#e0e0e0",
    200: "#c2c2c2",
    300: "#a3a3a3",
    400: "#858585",
    500: "#666666",
    600: "#525252",
    700: "#3d3d3d",
    800: "#292929",
    900: "#141414",
    1000: "#000000",
  },
  secondary: {
    // yellow
    50: "#f0f0f0", // manually adjusted
    100: "#fff6e0",
    200: "#ffedc2",
    300: "#ffe3a3",
    400: "#ffda85",
    500: "#ffd166",
    600: "#cca752",
    700: "#997d3d",
    800: "#665429",
    900: "#332a14",
  },
  text: {
    100: "#f1f3f5",
    200: "#e3e7ea",
    300: "#d6dae0",
    400: "#c8ced5",
    500: "#bac2cb",
    600: "#d9d9d9",
    700: "#70747a",
    800: "#4a4e51",
    900: "#252729",
  },
  red: {
    100: "#ffdada",
    200: "#ffb6b6",
    300: "#ff9191",
    400: "#ff6d6d",
    500: "#f77c60", //manually adjusted "leetify color"
    600: "#cc3a3a",
    700: "#992b2b",
    800: "#661d1d",
    900: "#330e0e",
  },
  green: { 100: "#4dc19d" },
};

// function that reverses the color palette
function reverseTokens(tokensDark) {
  const reversedTokens = {};
  Object.entries(tokensDark).forEach(([key, val]) => {
    const keys = Object.keys(val);
    const values = Object.values(val);
    const length = keys.length;
    const reversedObj = {};
    for (let i = 0; i < length; i++) {
      reversedObj[keys[i]] = values[length - i - 1];
    }
    reversedTokens[key] = reversedObj;
  });
  return reversedTokens;
}
export const tokensLight = reverseTokens(tokensDark);

// mui theme settings
export const themeSettings = (mode) => {
  const theme = createTheme();
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[400],
              light: tokensDark.primary[400],
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[300],
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.grey[800],
              alt: tokensDark.grey[700],
            },
            red: {
              ...tokensDark.red,
              default: tokensDark.red[500],
            },
            green: {
              ...tokensDark.green,
              default: tokensDark.green[100],
            },
            grey: {
              ...tokensDark.grey,
              default: tokensDark.grey[700],
            },
            text: {
              ...tokensDark.text,
              default: tokensDark.text[500],
            },
          }
        : {
            // palette values for light mode
            primary: {
              ...tokensLight.primary,
              main: tokensDark.grey[50],
              light: tokensDark.grey[100],
            },
            secondary: {
              ...tokensLight.secondary,
              main: tokensDark.secondary[600],
              light: tokensDark.secondary[700],
            },
            neutral: {
              ...tokensLight.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.grey[0],
              alt: tokensDark.grey[50],
            },
            red: {
              ...tokensLight.red,
              default: tokensDark.red[500],
            },
            green: {
              ...tokensLight.green,
              default: tokensLight.green[100],
            },
            grey: {
              ...tokensLight.grey,
              default: tokensLight.grey[700],
            },
            text: {
              ...tokensLight.text,
              default: tokensLight.text[500],
            },
          }),
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 40,
        [theme.breakpoints.down("md")]: {
          fontSize: "1.25rem",
        },
        [theme.breakpoints.down("sm")]: {
          fontSize: "1rem",
        },
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: "1.5rem",
        [theme.breakpoints.down("md")]: {
          fontSize: "1rem",
        },
        [theme.breakpoints.up("lg")]: {
          fontSize: "1.75rem",
        },
        [theme.breakpoints.up("xl")]: { fontSize: "2rem" },
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: "1.25rem",
        [theme.breakpoints.down("sm")]: { fontSize: "0.75rem" },
        [theme.breakpoints.down("md")]: {
          fontSize: "1rem",
        },
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: "1rem",
        [theme.breakpoints.down("sm")]: {
          fontSize: "0.5rem",
        },
        [theme.breakpoints.up("lg")]: {
          fontSize: "1.25rem",
        },
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 16,
        [theme.breakpoints.down("md")]: {
          fontSize: "0.6rem",
        },
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
        [theme.breakpoints.down("md")]: {
          fontSize: "0.5rem",
        },
        [theme.breakpoints.up("lg")]: {
          fontSize: "1rem",
        },
      },
    },
  };
};
