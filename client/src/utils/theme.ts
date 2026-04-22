import { createTheme } from "@mui/material/styles";
// ─── Theme ────────────────────────────────────────────────────────────────────
export const theme = createTheme({
  palette: {
    background: { default: "#f8f8f7", paper: "#ffffff" },
    text: { primary: "#1a1a18", secondary: "#8a8a86" },
    divider: "#ebebea",
    primary: { main: "#1a1a18", contrastText: "#f8f8f7" },
  },
  typography: { fontFamily: "'DM Sans', sans-serif" },
  shape: { borderRadius: 10 },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#1a1a18",
          boxShadow: "none",
          borderBottom: "1px solid #ebebea",
        },
      },
    },
  },
});
