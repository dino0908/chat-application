import { Box, Typography, Avatar, Divider } from "@mui/material";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/useAuthStore";
import { avatarColor, initials } from "../utils/helperFunctions";
import { formatFullDate } from "../utils/dateFormatter";

function Profile() {
  const { user } = useAuthStore();

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
            p: 4,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: avatarColor(user?.username || ""),
                fontSize: "40px",
                fontWeight: 600,
                mx: "auto",
                mb: 2,
              }}
            >
              {initials(user?.username || "")}
            </Avatar>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 600,
                color: "#1a1a18",
              }}
            >
              {user?.username}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Info Section */}
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                color: "#a0a09b",
                letterSpacing: "0.5px",
                mb: 1.5,
              }}
            >
              Account Information
            </Typography>

            {/* Email */}
            <Box sx={{ mb: 2 }}>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#a0a09b",
                  mb: 0.5,
                }}
              >
                Email
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#1a1a18",
                  fontWeight: 500,
                }}
              >
                {user?.email}
              </Typography>
            </Box>

            {/* Username */}
            <Box sx={{ mb: 2 }}>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#a0a09b",
                  mb: 0.5,
                }}
              >
                Username
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#1a1a18",
                  fontWeight: 500,
                }}
              >
                {user?.username}
              </Typography>
            </Box>

            {/* Joined Date */}
            <Box>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#a0a09b",
                  mb: 0.5,
                }}
              >
                Member Since
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#1a1a18",
                  fontWeight: 500,
                }}
              >
                {user?.created_at
                  ? formatFullDate(user.created_at)
                  : "Unknown"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Profile;
