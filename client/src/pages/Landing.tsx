import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, registerSchema, type AuthFormType } from "../schema/authSchema";

import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Container,
  AppBar,
  Toolbar,
} from "@mui/material";

function Landing() {
  const [activeTab, setActiveTab] = useState<0 | 1>(1);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormType>({
    resolver: zodResolver(activeTab === 0 ? loginSchema : registerSchema),
    defaultValues: { email: "", password: "", username: "" },
    mode: "onSubmit"
  });

  const onSubmit = async (data: AuthFormType) => {
    if (activeTab === 0) {
      console.log("Logging in with:", {
        email: data.email,
        password: data.password,
      });
    } else {
      console.log("Registering with:", data);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#F5F5F7",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "rgba(251, 251, 253, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid #d2d2d7",
        }}
      >
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography
            variant="h6"
            sx={{ color: "#1d1d1f", fontWeight: 600, letterSpacing: -0.5 }}
          >
            ChatApp
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container
        maxWidth="sm"
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
        }}
      >
        <Box
          sx={{
            width: "100%",
            bgcolor: "white",
            p: 4,
            borderRadius: "18px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
            border: "1px solid #d2d2d7",
          }}
        >
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, color: "#1d1d1f", mb: 1 }}
            >
              {activeTab === 0 ? "Sign in to Chat." : "Create your account."}
            </Typography>
            <Typography variant="body1" sx={{ color: "#86868b" }}>
              Enjoy real-time messaging with registered users.
            </Typography>
          </Box>

          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            centered
            sx={{
              mb: 4,
              "& .MuiTabs-indicator": { bgcolor: "#0071e3", height: 1.5 },
              "& .MuiTab-root": {
                color: "#86868b",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "1rem",
              },
              "& .Mui-selected": { color: "#0071e3 !important" },
            }}
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {/* Form Fields */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {activeTab === 1 && (
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Username"
                    error={!!errors.username}
                    helperText={errors.username?.message}
                  />
                )}
              />
            )}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email address"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="password"
                  label="Password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />

            <Button
              fullWidth
              variant="contained"
              disableElevation
              type="submit"
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: "12px",
                bgcolor: "#0071e3",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
                "&:hover": { bgcolor: "#0077ed" },
              }}
            >
              {activeTab === 0 ? "Sign In" : "Continue"}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Landing;
