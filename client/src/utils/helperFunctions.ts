export const avatarColor = (name: string) => {
  const colors = [
    "#2563eb",
    "#7c3aed",
    "#0891b2",
    "#059669",
    "#d97706",
    "#dc2626",
  ];
  return colors[name.charCodeAt(0) % colors.length];
};


export const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");
