import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
} from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

function Navbar() {
    const { logout } = useAuthStore()
    const navigate = useNavigate()

    const handleRedirect = (label: any) => {
        if (label == "Settings") {
            navigate('/settings')
        } else if (label == "Profile") {
            navigate("/profile")
        } else if (label == "Log out") {
            logout()
            navigate('/')
        }
    }

    return (
        <AppBar position="static" elevation={0}>
          <Toolbar
            sx={{
              minHeight: "56px !important",
              px: 3,
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "17px",
                letterSpacing: "-0.3px",
              }}
            >
              chatapp
            </Typography>

            <Box sx={{ display: "flex", gap: 0.5 }}>
              {[
                {
                  label: "Settings",
                  icon: <SettingsOutlinedIcon sx={{ fontSize: 18 }} />,
                },
                {
                  label: "Profile",
                  icon: <PersonOutlineOutlinedIcon sx={{ fontSize: 18 }} />,
                },
                {
                  label: "Log out",
                  icon: <LogoutOutlinedIcon sx={{ fontSize: 18 }} />,
                },
              ].map(({ label, icon }) => (
                <Button onClick={() => handleRedirect(label)}>
                <Box
                  key={label}
                  component="button"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    px: 1.5,
                    py: 0.875,
                    borderRadius: "8px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    color: "#6b6b67",
                    fontSize: "13.5px",
                    fontFamily: "inherit",
                    transition: "background 0.15s",
                    "&:hover": { bgcolor: "#ebebea" },
                  }}
                >
                  {icon}
                  <span>{label}</span>
                </Box>
                </Button>
              ))}
            </Box>
          </Toolbar>
        </AppBar>
    )
}

export default Navbar