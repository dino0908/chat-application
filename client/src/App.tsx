import { BrowserRouter, Routes, Route } from "react-router";
import Landing from "./pages/Landing";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import ProtectedRoute from "./routing/ProtectedRoute";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";

export default function App() {
  const { checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        {/* ... */}
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
