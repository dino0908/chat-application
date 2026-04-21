import { useState } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  InputBase,
  Avatar,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  ListItem,
  Tooltip,
  Chip,
} from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import AddIcon from "@mui/icons-material/Add"
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined"
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined"
import SendOutlinedIcon from "@mui/icons-material/SendOutlined"
import CloseIcon from "@mui/icons-material/Close"
import SearchBox from "../components/SearchBox"
import OnlineBadge from "../components/OnlineBadge"

// ─── Theme ────────────────────────────────────────────────────────────────────
const theme = createTheme({
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
})

// ─── Mock data ────────────────────────────────────────────────────────────────
const mockChats = [
  { id: 1, name: "Alex Morgan",   lastMessage: "sounds good, see you then",    time: "2m",        unread: 2, online: true  },
  { id: 2, name: "Jamie Lee",     lastMessage: "can you send the file?",        time: "14m",       unread: 0, online: true  },
  { id: 3, name: "Sam Rivera",    lastMessage: "haha yeah exactly",             time: "1h",        unread: 0, online: false },
  { id: 4, name: "Casey Kim",     lastMessage: "thanks!",                       time: "3h",        unread: 1, online: false },
  { id: 5, name: "Jordan Blake",  lastMessage: "let me check and get back",     time: "yesterday", unread: 0, online: true  },
  { id: 6, name: "Riley Chen",    lastMessage: "ok cool",                       time: "yesterday", unread: 0, online: false },
]

const mockMessages = [
  { id: 1, text: "hey, you free this afternoon?",                               time: "2:10 PM", self: false },
  { id: 2, text: "yeah what's up?",                                             time: "2:11 PM", self: true  },
  { id: 3, text: "wanted to go over the project timeline, it's getting tight",  time: "2:12 PM", self: false },
  { id: 4, text: "agreed, let's do a call around 3?",                           time: "2:13 PM", self: true  },
  { id: 5, text: "perfect. I'll send a link",                                   time: "2:13 PM", self: false },
  { id: 6, text: "great 👍",                                                     time: "2:14 PM", self: true  },
  { id: 7, text: "sounds good, see you then",                                   time: "2:15 PM", self: false },
]

const suggestedUsers = [
  { id: 1, name: "Taylor Swift",  username: "@tswift"   },
  { id: 2, name: "Morgan Freeman",username: "@mfreeman" },
  { id: 3, name: "Dana White",    username: "@dwhite"   },
  { id: 4, name: "Priya Patel",   username: "@ppatel"   },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
const avatarColor = (name: string) => {
  const colors = ["#2563eb", "#7c3aed", "#0891b2", "#059669", "#d97706", "#dc2626"]
  return colors[name.charCodeAt(0) % colors.length]
}

const initials = (name: string) => name.split(" ").map((n) => n[0]).join("")


// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Chat() {
  const [activeChat, setActiveChat]     = useState(mockChats[0])
  const [searchQuery, setSearchQuery]   = useState("")
  const [newChatOpen, setNewChatOpen]   = useState(false)
  const [newChatSearch, setNewChatSearch] = useState("")
  const [messageInput, setMessageInput] = useState("")

  const closeNewChat = () => { setNewChatOpen(false); setNewChatSearch("") }

  const filteredChats = mockChats.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredUsers = suggestedUsers.filter(
    (u) =>
      newChatSearch.length > 0 &&
      (u.name.toLowerCase().includes(newChatSearch.toLowerCase()) ||
        u.username.toLowerCase().includes(newChatSearch.toLowerCase()))
  )

  return (
    <ThemeProvider theme={theme}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');`}</style>

      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>

        {/* ── Navbar ──────────────────────────────────────────────────────── */}
        <AppBar position="static" elevation={0}>
          <Toolbar sx={{ minHeight: "56px !important", px: 3, justifyContent: "space-between" }}>
            <Typography sx={{ fontWeight: 600, fontSize: "17px", letterSpacing: "-0.3px" }}>
              chatapp
            </Typography>

            <Box sx={{ display: "flex", gap: 0.5 }}>
              {[
                { label: "Settings", icon: <SettingsOutlinedIcon sx={{ fontSize: 18 }} /> },
                { label: "Profile",  icon: <PersonOutlineOutlinedIcon sx={{ fontSize: 18 }} /> },
                { label: "Log out",  icon: <LogoutOutlinedIcon sx={{ fontSize: 18 }} /> },
              ].map(({ label, icon }) => (
                <Box
                  key={label}
                  component="button"
                  sx={{
                    display: "flex", alignItems: "center", gap: "6px",
                    px: 1.5, py: 0.875, borderRadius: "8px",
                    border: "none", background: "none", cursor: "pointer",
                    color: "#6b6b67", fontSize: "13.5px", fontFamily: "inherit",
                    transition: "background 0.15s",
                    "&:hover": { bgcolor: "#ebebea" },
                  }}
                >
                  {icon}
                  <span>{label}</span>
                </Box>
              ))}
            </Box>
          </Toolbar>
        </AppBar>

        {/* ── Body ────────────────────────────────────────────────────────── */}
        <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* ── Left 30% ────────────────────────────────────────────────── */}
          <Box sx={{ width: "30%", borderRight: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", bgcolor: "background.paper" }}>

            {/* Search bar + new chat */}
            <Box sx={{ p: "14px 14px 10px", display: "flex", gap: 1, alignItems: "center" }}>
              <Box sx={{ flex: 1 }}>
                <SearchBox value={searchQuery} onChange={setSearchQuery} placeholder="Search chats…" />
              </Box>
              <Tooltip title="New chat">
                <IconButton
                  onClick={() => setNewChatOpen(true)}
                  size="small"
                  sx={{
                    width: 34, height: 34, borderRadius: "8px",
                    bgcolor: "#1a1a18", color: "#fff",
                    "&:hover": { bgcolor: "#333330" },
                  }}
                >
                  <AddIcon sx={{ fontSize: 17 }} />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Chat list */}
            <List disablePadding sx={{ flex: 1, overflowY: "auto", pb: 1 }}>
              {filteredChats.map((chat) => (
                <ListItemButton
                  key={chat.id}
                  selected={activeChat.id === chat.id}
                  onClick={() => setActiveChat(chat)}
                  sx={{
                    px: 1.75, py: 1.25, gap: 1.5,
                    "&.Mui-selected": { bgcolor: "#ebebea", "&:hover": { bgcolor: "#e4e4e2" } },
                    "&:hover": { bgcolor: "#f0eeeb" },
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: "auto" }}>
                    <OnlineBadge online={chat.online}>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: avatarColor(chat.name), fontSize: "13px", fontWeight: 600 }}>
                        {initials(chat.name)}
                      </Avatar>
                    </OnlineBadge>
                  </ListItemAvatar>

                  <ListItemText
                    disableTypography
                    primary={
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <Typography noWrap sx={{ fontWeight: 500, fontSize: "13.5px", color: "#1a1a18", maxWidth: "130px" }}>
                          {chat.name}
                        </Typography>
                        <Typography sx={{ fontSize: "11px", color: "#a0a09b", flexShrink: 0, ml: 0.75 }}>
                          {chat.time}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 0.25 }}>
                        <Typography noWrap sx={{ fontSize: "12.5px", color: "#8a8a86", maxWidth: "150px" }}>
                          {chat.lastMessage}
                        </Typography>
                        {chat.unread > 0 && (
                          <Chip
                            label={chat.unread}
                            size="small"
                            sx={{
                              height: 18, minWidth: 18,
                              bgcolor: "#1a1a18", color: "#fff",
                              fontSize: "10px", fontWeight: 600,
                              ml: 0.75, flexShrink: 0,
                              "& .MuiChip-label": { px: "5px" },
                            }}
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>

          {/* ── Right 70% ───────────────────────────────────────────────── */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", bgcolor: "background.default" }}>

            {/* Chat header */}
            <Box sx={{ bgcolor: "background.paper", borderBottom: "1px solid", borderColor: "divider", px: 3, py: 1.5, display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
              <OnlineBadge online={activeChat.online}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: avatarColor(activeChat.name), fontSize: "13px", fontWeight: 600 }}>
                  {initials(activeChat.name)}
                </Avatar>
              </OnlineBadge>
              <Box>
                <Typography sx={{ fontWeight: 500, fontSize: "14px", color: "#1a1a18" }}>
                  {activeChat.name}
                </Typography>
                <Typography sx={{ fontSize: "12px", color: activeChat.online ? "#4ade80" : "#a0a09b" }}>
                  {activeChat.online ? "online" : "offline"}
                </Typography>
              </Box>
            </Box>

            {/* Messages */}
            <Box sx={{ flex: 1, overflowY: "auto", p: 3, display: "flex", flexDirection: "column", gap: 1.25 }}>
              {mockMessages.map((msg) => (
                <Box key={msg.id} sx={{ display: "flex", justifyContent: msg.self ? "flex-end" : "flex-start" }}>
                  <Box
                    sx={{
                      maxWidth: "58%", px: 1.75, py: 1.25,
                      borderRadius: msg.self ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      bgcolor: msg.self ? "#1a1a18" : "background.paper",
                      border: msg.self ? "none" : "1px solid #ebebea",
                      boxShadow: msg.self ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
                    }}
                  >
                    <Typography sx={{ fontSize: "13.5px", lineHeight: 1.5, color: msg.self ? "#f8f8f7" : "#1a1a18" }}>
                      {msg.text}
                    </Typography>
                    <Typography sx={{ fontSize: "10.5px", color: msg.self ? "#8a8a86" : "#b0b0ab", mt: 0.5, textAlign: "right" }}>
                      {msg.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Message input */}
            <Box sx={{ p: "14px 20px", borderTop: "1px solid", borderColor: "divider", bgcolor: "background.paper", display: "flex", gap: 1.25, alignItems: "center" }}>
              <Paper
                elevation={0}
                sx={{
                  flex: 1, display: "flex", alignItems: "center",
                  bgcolor: "#f8f8f7", border: "1px solid #ebebea", borderRadius: "10px", px: 2,
                  "&:focus-within": { borderColor: "#c8c7c2" },
                  transition: "border-color 0.15s",
                }}
              >
                <InputBase
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={`Message ${activeChat.name}…`}
                  fullWidth
                  sx={{ fontSize: "13.5px", "& input": { py: "10px" } }}
                />
              </Paper>
              <IconButton
                size="small"
                sx={{
                  width: 38, height: 38, borderRadius: "10px",
                  bgcolor: "#1a1a18", color: "#fff",
                  "&:hover": { bgcolor: "#333330" },
                }}
              >
                <SendOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* ── New Chat Dialog ──────────────────────────────────────────────── */}
        <Dialog
          open={newChatOpen}
          onClose={closeNewChat}
        >
          <DialogTitle
            sx={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              px: 3.5, pt: 3, pb: 2,
              fontWeight: 600, fontSize: "15px", color: "#1a1a18",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            New chat
            <IconButton
              size="small"
              onClick={closeNewChat}
              sx={{ color: "#6b6b67", borderRadius: "6px", "&:hover": { bgcolor: "#ebebea" } }}
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ px: 3.5, pb: 3.5, pt: 0 }}>
            <SearchBox
              value={newChatSearch}
              onChange={setNewChatSearch}
              placeholder="Search by name or username…"
              autoFocus
            />

            <Box sx={{ minHeight: 120, mt: 1.5 }}>
              {newChatSearch.length === 0 ? (
                <Typography sx={{ color: "#a0a09b", fontSize: "13px", textAlign: "center", pt: 3.5 }}>
                  Start typing to find users
                </Typography>
              ) : filteredUsers.length === 0 ? (
                <Typography sx={{ color: "#a0a09b", fontSize: "13px", textAlign: "center", pt: 3.5 }}>
                  No users found
                </Typography>
              ) : (
                <List disablePadding>
                  {filteredUsers.map((user) => (
                    <ListItem key={user.id} disablePadding>
                      <ListItemButton
                        onClick={closeNewChat}
                        sx={{ borderRadius: "8px", px: 1.25, py: 1, gap: 1.25, "&:hover": { bgcolor: "#f4f3f1" } }}
                      >
                        <ListItemAvatar sx={{ minWidth: "auto" }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor(user.name), fontSize: "11px", fontWeight: 600 }}>
                            {initials(user.name)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          disableTypography
                          primary={
                            <Typography sx={{ fontWeight: 500, fontSize: "13.5px", color: "#1a1a18" }}>
                              {user.name}
                            </Typography>
                          }
                          secondary={
                            <Typography sx={{ fontSize: "12px", color: "#a0a09b" }}>
                              {user.username}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  )
}