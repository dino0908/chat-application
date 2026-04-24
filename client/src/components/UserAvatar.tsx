import { Avatar } from "@mui/material";
import OnlineBadge from "../components/OnlineBadge";
import { avatarColor, initials } from "../utils/helperFunctions";

interface UserAvatarProps {
  chat: {
    id: number;
    username: string;
  };
  onlineUsers: number[];
}

export default function UserAvatar({ chat, onlineUsers }: UserAvatarProps) {
  const isOnline = onlineUsers.includes(chat.id);

  return (
    <OnlineBadge online={isOnline}>
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
  );
}