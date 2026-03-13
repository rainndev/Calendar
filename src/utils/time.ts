export const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;

  if (diffMs < minute) return "just now";
  if (diffMs < hour)
    return `${Math.floor(diffMs / minute)} min${Math.floor(diffMs / minute) === 1 ? "" : "s"} ago`;
  if (diffMs < day)
    return `${Math.floor(diffMs / hour)} hour${Math.floor(diffMs / hour) === 1 ? "" : "s"} ago`;
  if (diffMs < month)
    return `${Math.floor(diffMs / day)} day${Math.floor(diffMs / day) === 1 ? "" : "s"} ago`;
  return dateString;
};
