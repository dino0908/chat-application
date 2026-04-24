import { formatDistanceToNowStrict, format, parseISO } from 'date-fns';

export const formatTime = (dateString: string) => {
  if (!dateString) return "";
  
  return formatDistanceToNowStrict(new Date(dateString), {
    addSuffix: false, // Removes "ago"
  })
  .replace(' minutes', 'm')
  .replace(' minute', 'm')
  .replace(' hours', 'h')
  .replace(' hour', 'h')
  .replace(' days', 'd')
  .replace(' day', 'd');
};

// Formatter for Message Bubbles (e.g., 8:12 PM)
export const formatMessageTime = (dateString: string) => {
  if (!dateString) return "";
  try {
    const date = parseISO(dateString);
    return format(date, 'h:mm aa'); // 'aa' gives the AM/PM
  } catch (error) {
    return "";
  }
};

// Date format ---> DD Month YYYY, for "Member since" on profile page
export const formatFullDate = (dateString: string) => {
  if (!dateString) return "";
  try {
    const date = parseISO(dateString);
    return format(date, 'd MMMM yyyy');
  } catch (error) {
    try {
      return format(new Date(dateString), 'd MMMM yyyy');
    } catch {
      return "";
    }
  }
};