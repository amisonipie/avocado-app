import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      // light: "#9fbf3b",
      main: "#9fbf3b",
      // dark: "#40663c",
      contrastText: "#fff",
    },
    secondary: {
      main: "#40663c",
      contrastText: "#fff",
    },
    neutral: {
      main: "#c4c4c4",
      contrastText: "#fff",
    },
    error: {
      main: "#d32f2f",
    },
    green: {
      100: "#f1f5e4",
      300: "#dce7ba",
      500: "#9fbf3b",
      700: "#40663c",
      900: "#2a672a",
    },
    gray: "#c4c4c4",
  },
  typography: {
    fontFamily: "Encode Sans",
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    button: {
      textTransform: "none",
    },
    // fontSize: 12,
  },
  zIndex: {
    appBar: 1300,
  },
  shape: {
    borderRadius: 5,
  },
});
