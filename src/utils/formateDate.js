 function formatDate(date) {
  if(!date) {
    return "---";
  }
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) {
    return "Not Specified";
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

 function formatDateWithWeekday(date) {
  if (!date) return "---";

  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return "---";

  

  const main = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate); // "17 Mar 2026"

  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  }).format(parsedDate); // "Tue"

  return `${main} (${weekday})`; // "17 Mar 2026 (Tue)"
}

export default formatDate;
export { formatDateWithWeekday };
