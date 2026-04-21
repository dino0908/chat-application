import { InputBase, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"

function SearchBox({ value, onChange, placeholder, autoFocus = false }: {
  value: string; onChange: (v: string) => void; placeholder: string; autoFocus?: boolean
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex", alignItems: "center", gap: 1,
        bgcolor: "#f4f3f1", borderRadius: "8px", px: 1.25,
        border: "1px solid transparent",
        "&:focus-within": { borderColor: "#c8c7c2" },
        transition: "border-color 0.15s",
      }}
    >
      <SearchIcon sx={{ fontSize: 15, color: "#a0a09b", flexShrink: 0 }} />
      <InputBase
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        fullWidth
        sx={{ fontSize: "13.5px", "& input": { py: "8px", px: 0 } }}
      />
    </Paper>
  )
}

export default SearchBox