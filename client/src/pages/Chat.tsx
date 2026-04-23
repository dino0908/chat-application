// a conversation id is shared between 2 user ids, (2 people involved in the chat)
// conversation id is like the room
// this makes it easier to expand to group chats later

// how the messages update when you select on a chat:
// handleChatSelection updates the URL to /chat/<chatId>
// chatId changes, useMessages(chatId) takes in chatId as a dependency
// it refetches the new messages

import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Navbar from "../components/Navbar";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SearchBox from "../components/SearchBox";
import OnlineBadge from "../components/OnlineBadge";
import { useAuthStore } from "../store/useAuthStore";
import { useUsers } from "../hooks/useUsers";
import { useChats } from "../hooks/useChats";
import { formatTime, formatMessageTime } from "../utils/dateFormatter";
import { useMessages } from "../hooks/useMessages";
import { avatarColor, initials } from "../utils/helperFunctions";
import { useSocket } from "../context/SocketContext";
import { startConversation } from "../api/chat";
import type { ChatType } from "../types/ChatTypes";
import type { MessageType } from "../types/MessageTypes";

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null); // used to scroll down the chat automatically on every message sent / received
  const { socket, isConnected } = useSocket(); // (TODO) isConnected can be used to determine online status
  const queryClient = useQueryClient();
  const { data: suggestedUsers } = useUsers();
  const { data: allChats } = useChats(); // allChats is all the chats that the client is in. (not all the chats in the entire DB)
  const { user } = useAuthStore(); // client's own user object
  const { chatId } = useParams<{ chatId: string }>(); // conversation id, aka the "room" id taken from URL
  const { data: messages } = useMessages(chatId); // get chat messages between client and selectedChat
  const navigate = useNavigate();

  // if URL is /chat with no params, selectedChat is null. otherwise, selectedChat is the chat in allChats where the conversation_id matches the id in URL params
  // this is so we know who's chat to display on the right hand side, if there is a selectedChat, display on the RHS. if not RHS shows "click on chat to start messaging"
  // any changes to chatId (by changing the URL /chat/<chatId> either manually or through navigation), will update this selectedChat, which updates the RHS
  const selectedChat = chatId ? allChats?.find((c) => c.conversation_id === parseInt(chatId)) || null : null;

  const [searchQuery, setSearchQuery] = useState("");
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState("");
  const [messageInput, setMessageInput] = useState("");

    useEffect(() => {
    // used to scroll down the chat automatically on every message sent / received
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChatSelection = (conversationId: number) => {
    navigate(`/chat/${conversationId}`); // navigate to the chat

    // When user selects a chat, clear the unread count in the cache ( on client side )
    queryClient.setQueryData(["chats"], (oldChats: ChatType[]) => {  
      return oldChats?.map((chat) =>
        chat.conversation_id === conversationId
          ? { ...chat, unread_count: 0 }
          : chat,
      );
    });
  };

  // ─── Socket Listeners ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    // Listen for incoming messages from other users
    const handleReceiveMessage = (data: MessageType) => { // this data is passed from the sever when it emits "receive_message" event
      // Only refetch if the message is for the current chat
      if (data.conversationId === parseInt(chatId!)) {  // if the incoming message is for the conversation the client is already looking at
        queryClient.invalidateQueries({ queryKey: ["messages", chatId] }); // tells tanstack query to refetch the data so it the receiver sees it without needing to refresh
      }
    };

    // Function triggered when the server sends back a confirmation to the client that their message was sent
    // If the invalidateQuery logic was simply put in the handleSendMessage function, if the server is down and the client sends a message, it would show up on the chat, then disappear after a refresh (server was down and message never made it to DB)
    // By having the server emit a message_sent event back to the sender, it ensures the sender only sees their sent message appear in the chat if it actually got sent
    const handleMessageSent = () => {
      // Refetch messages to show the sent message immediately, snsures the sender sees their message pop up in the chat
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_sent", handleMessageSent);

    // Clean up listeners when component unmounts
    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_sent", handleMessageSent);
    };
  }, [socket, chatId, queryClient]);

  const closeNewChat = () => {
    setNewChatOpen(false);
    setNewChatSearch("");
  };

  const handleStartConversation = async (recipientId: number) => {
    try {
      const { conversation_id } = await startConversation(recipientId); // serverside: creates a new conversation_id in the backend and adds the id of both users to it
      closeNewChat();
      await queryClient.invalidateQueries({ queryKey: ["chats"] }); // Refetch chats to update the list of chats on the LHS to include the newly started chat
      navigate(`/chat/${conversation_id}`); // navigates to this new conversation. changing the URL changes chatId (which is read from URL params) which updates selectedChat and shows the corresponding RHS
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  // search chats function, narrows down allChats to only display the ones where the username is in the searchQuery
  const filteredChats = allChats?.filter((c) =>
    c.username?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // displays the chats where the username matches the searchquery, for finding users to start a new conversation with
  const filteredUsers = (suggestedUsers || []).filter(
    (u) =>
      newChatSearch.length > 0 &&
      u.username.toLowerCase().includes(newChatSearch.toLowerCase()) &&
      u.username !== user?.username, // Excludes client's own username from the results
  );

  // emits send_message event to server and clears input
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat || !socket || !chatId) return;
    socket.emit("send_message", { // doesn't pass sender id (client id) as can be obtained on server side
      conversationId: parseInt(chatId),
      recipientId: selectedChat.id,
      content: messageInput,
    });
    setMessageInput("");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <Navbar />
      {/* ── Body ────────────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* ── Left 30% ────────────────────────────────────────────────── */}
        <Box
          sx={{
            width: "30%",
            borderRight: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.paper",
          }}
        >
          {/* Search bar + new chat */}
          <Box
            sx={{
              p: "14px 14px 10px",
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <SearchBox
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search chats…"
              />
            </Box>
            <Tooltip title="New chat">
              <IconButton
                onClick={() => setNewChatOpen(true)}
                size="small"
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "8px",
                  bgcolor: "#1a1a18",
                  color: "#fff",
                  "&:hover": { bgcolor: "#333330" },
                }}
              >
                <AddIcon sx={{ fontSize: 17 }} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Chat list */}
          <List disablePadding sx={{ flex: 1, overflowY: "auto", pb: 1 }}>
            {filteredChats?.map((chat) => (
              <ListItemButton
                key={chat.conversation_id}
                selected={selectedChat?.id === chat.conversation_id}
                onClick={() => handleChatSelection(chat.conversation_id)}
                sx={{
                  px: 1.75,
                  py: 1.25,
                  gap: 1.5,
                  "&.Mui-selected": {
                    bgcolor: "#ebebea",
                    "&:hover": { bgcolor: "#e4e4e2" },
                  },
                  "&:hover": { bgcolor: "#f0eeeb" },
                }}
              >
                <ListItemAvatar sx={{ minWidth: "auto" }}>
                  <OnlineBadge online={chat.online}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: avatarColor(chat.username),
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      {initials(chat.username)}
                    </Avatar>
                  </OnlineBadge>
                </ListItemAvatar>

                <ListItemText
                  disableTypography
                  primary={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                      }}
                    >
                      <Typography
                        noWrap
                        sx={{
                          fontWeight: 500,
                          fontSize: "13.5px",
                          color: "#1a1a18",
                          maxWidth: "130px",
                        }}
                      >
                        {chat.username}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "11px",
                          color: "#a0a09b",
                          flexShrink: 0,
                          ml: 0.75,
                        }}
                      >
                        {formatTime(chat.time)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 0.25,
                      }}
                    >
                      <Typography
                        noWrap
                        sx={{
                          fontSize: "12.5px",
                          color: "#8a8a86",
                          maxWidth: "250px",
                        }}
                      >
                        {chat.lastMessage}
                      </Typography>
                      {chat.unread > 0 && (
                        <Chip
                          label={chat.unread}
                          size="small"
                          sx={{
                            height: 18,
                            minWidth: 18,
                            bgcolor: "#1a1a18",
                            color: "#fff",
                            fontSize: "10px",
                            fontWeight: 600,
                            ml: 0.75,
                            flexShrink: 0,
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
        {selectedChat ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.default",
            }}
          >
            {/* Chat header */}
            <Box
              sx={{
                bgcolor: "background.paper",
                borderBottom: "1px solid",
                borderColor: "divider",
                px: 3,
                py: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexShrink: 0,
              }}
            >
              <OnlineBadge online={selectedChat.online}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: avatarColor(selectedChat?.username),
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  {initials(selectedChat.username)}
                </Avatar>
              </OnlineBadge>
              <Box>
                <Typography
                  sx={{ fontWeight: 500, fontSize: "14px", color: "#1a1a18" }}
                >
                  {selectedChat.username}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: selectedChat?.online ? "#4ade80" : "#a0a09b",
                  }}
                >
                  {selectedChat.online ? "online" : "offline"}
                </Typography>
              </Box>
            </Box>

            {/* Messages */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 1.25,
              }}
            >
              {messages?.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    display: "flex",
                    justifyContent: msg.self ? "flex-end" : "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "58%",
                      px: 1.75,
                      py: 1.25,
                      borderRadius: msg.self
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                      bgcolor: msg.self ? "#1a1a18" : "background.paper",
                      border: msg.self ? "none" : "1px solid #ebebea",
                      boxShadow: msg.self
                        ? "none"
                        : "0 1px 4px rgba(0,0,0,0.06)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "13.5px",
                        lineHeight: 1.5,
                        color: msg.self ? "#f8f8f7" : "#1a1a18",
                      }}
                    >
                      {msg.text}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "10.5px",
                        color: msg.self ? "#8a8a86" : "#b0b0ab",
                        mt: 0.5,
                        textAlign: "right",
                      }}
                    >
                      {formatMessageTime(msg.time)}
                    </Typography>
                  </Box>
                </Box>
              ))}
              {/* used to scroll down the chat automatically on every message sent / received */}
              <div ref={messagesEndRef} />
            </Box>

            {/* Message input */}
            <Box
              sx={{
                p: "14px 20px",
                borderTop: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                display: "flex",
                gap: 1.25,
                alignItems: "center",
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#f8f8f7",
                  border: "1px solid #ebebea",
                  borderRadius: "10px",
                  px: 2,
                  "&:focus-within": { borderColor: "#c8c7c2" },
                  transition: "border-color 0.15s",
                }}
              >
                <InputBase
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      handleSendMessage();
                    }
                  }}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={`{Message} ${selectedChat.username}…`}
                  fullWidth
                  sx={{ fontSize: "13.5px", "& input": { py: "10px" } }}
                />
              </Paper>
              <IconButton
                onClick={handleSendMessage}
                size="small"
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "10px",
                  bgcolor: "#1a1a18",
                  color: "#fff",
                  "&:hover": { bgcolor: "#333330" },
                }}
              >
                <SendOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              flex: 1, // Takes up all available space
              display: "flex",
              flexDirection: "column",
              alignItems: "center", // Horizontal center
              justifyContent: "center", // Vertical center
              bgcolor: "background.default",
              color: "text.secondary",
              textAlign: "center",
              p: 3,
            }}
          >
            {/* Optional: Add an icon or image here for better UX */}
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
              No Chat Selected
            </Typography>
            <Typography variant="body2">
              Pick a conversation from the list to start messaging.
            </Typography>
          </Box>
        )}
      </Box>

      {/* ── New Chat Dialog ──────────────────────────────────────────────── */}
      <Dialog open={newChatOpen} onClose={closeNewChat} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3.5,
            pt: 3,
            pb: 2,
            fontWeight: 600,
            fontSize: "15px",
            color: "#1a1a18",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          New chat
          <IconButton
            size="small"
            onClick={closeNewChat}
            sx={{
              color: "#6b6b67",
              borderRadius: "6px",
              "&:hover": { bgcolor: "#ebebea" },
            }}
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
              <Typography
                sx={{
                  color: "#a0a09b",
                  fontSize: "13px",
                  textAlign: "center",
                  pt: 3.5,
                }}
              >
                Start typing to find users
              </Typography>
            ) : filteredUsers.length === 0 ? (
              <Typography
                sx={{
                  color: "#a0a09b",
                  fontSize: "13px",
                  textAlign: "center",
                  pt: 3.5,
                }}
              >
                No users found
              </Typography>
            ) : (
              <List disablePadding>
                {filteredUsers.map((user) => (
                  <ListItem key={user.id} disablePadding>
                    <ListItemButton
                      onClick={() => handleStartConversation(user.id)}
                      sx={{
                        borderRadius: "8px",
                        px: 1.25,
                        py: 1,
                        gap: 1.25,
                        "&:hover": { bgcolor: "#f4f3f1" },
                      }}
                    >
                      <ListItemAvatar sx={{ minWidth: "auto" }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: avatarColor(user.username),
                            fontSize: "11px",
                            fontWeight: 600,
                          }}
                        >
                          {initials(user.username)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        disableTypography
                        primary={
                          <Typography
                            sx={{
                              fontWeight: 500,
                              fontSize: "13.5px",
                              color: "#1a1a18",
                            }}
                          >
                            {user.username}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            sx={{ fontSize: "12px", color: "#a0a09b" }}
                          >
                            {user.email}
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
  );
}
