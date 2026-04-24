import { Box, Typography, Switch } from "@mui/material";
import Navbar from "../components/Navbar";
import { useState } from "react";

function Settings() {
  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(true);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: "calc(100vh - 60px)",
          bgcolor: "background.default",
          p: 4,
        }}
      >
        {/* Container */}
        <Box
          sx={{
            maxWidth: 600,
            mx: "auto",
            bgcolor: "background.paper",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Header */}
          <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#1a1a18",
              }}
            >
              Settings
            </Typography>
          </Box>

          {/* Settings List */}
          <Box>
            {/* Notifications Setting */}
            <Box
              sx={{
                p: 3,
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#1a1a18",
                  }}
                >
                  Enable Notifications
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "#a0a09b",
                    mt: 0.5,
                  }}
                >
                  Get notified about new messages
                </Typography>
              </Box>
              <Switch
                checked={notifications}
                disabled
                onChange={(e) => setNotifications(e.target.checked)}
              />
            </Box>

            {/* Read Receipts Setting */}
            <Box
              sx={{
                p: 3,
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#1a1a18",
                  }}
                >
                  Dark Mode
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "#a0a09b",
                    mt: 0.5,
                  }}
                >
                  Toggle between light and dark mode
                </Typography>
              </Box>
              <Switch
                checked={darkMode}
                disabled
                onChange={(e) => setDarkMode(e.target.checked)}
              />
            </Box>

            {/* Online Status Setting */}
            <Box
              sx={{
                p: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#1a1a18",
                  }}
                >
                  Online Status
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "#a0a09b",
                    mt: 0.5,
                  }}
                >
                  Show when you're online
                </Typography>
              </Box>
              <Switch
                checked={onlineStatus}
                disabled
                onChange={(e) => setOnlineStatus(e.target.checked)}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Settings;
