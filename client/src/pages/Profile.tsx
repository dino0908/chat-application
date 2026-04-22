import Navbar from "../components/Navbar";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../utils/theme";

function Profile() {
  return (
    <ThemeProvider theme={theme}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');`}</style>
      <Navbar />
      <h1>profile page</h1>
    </ThemeProvider>
  );
}

export default Profile;
