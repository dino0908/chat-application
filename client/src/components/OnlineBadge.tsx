import { Badge } from "@mui/material";

function OnlineBadge({ online, children }: { online: boolean; children: React.ReactNode }) {
  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      variant="dot"
      sx={{
        "& .MuiBadge-dot": {
          backgroundColor: online ? "#4ade80" : "transparent",
          border: online ? "2px solid #fff" : "none",
          width: 10, height: 10, borderRadius: "50%",
          boxShadow: "none",
        },
      }}
    >
      {children}
    </Badge>
  )
}

export default OnlineBadge