import { formatDistanceToNowStrict } from 'date-fns';

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