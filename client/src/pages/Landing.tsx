import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  registerSchema,
  type AuthFormType,
} from "../schema/authSchema";
import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser } from "../api/auth";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

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
  Snackbar,
  Alert,
} from "@mui/material";

function Landing() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const [activeTab, setActiveTab] = useState<0 | 1>(1);
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseSnackbar = (
    _?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthFormType>({
    resolver: zodResolver(activeTab === 0 ? loginSchema : registerSchema),
    defaultValues: { email: "", password: "", username: "" },
    mode: "onSubmit",
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("Success!", data);
      setAuth(data.user);
      navigate("/chat");
    },
    onError: (error: Error) => {
      console.error("Login Error:", error.message);
      // logic to display snackbar
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log("Registration Success", data);
      setActiveTab(0); // switch to login tab
    },
    onError: (error: Error) => {
      console.error("Registration:", error.message);
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    }, // add logic to display error snackbar
  });

  const onSubmit = (data: AuthFormType) => {
    if (activeTab === 0) {
      loginMutation.mutate(data);
    } else {
      registerMutation.mutate(data);
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
            onChange={(_, newValue) => {
              setActiveTab(newValue);
              reset();
              loginMutation.reset();
              registerMutation.reset();
              setOpenSnackbar(false);
            }}
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
              disabled={loginMutation.isPending || registerMutation.isPending}
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
              {activeTab === 0
                ? loginMutation.isPending
                  ? "Signing in..."
                  : "Sign In"
                : registerMutation.isPending
                  ? "Creating account..."
                  : "Continue"}
            </Button>
          </Box>
        </Box>
      </Container>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          variant="filled"
          sx={{ width: "100%", borderRadius: "12px" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Landing;
