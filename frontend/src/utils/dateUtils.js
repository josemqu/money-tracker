// Utility functions for handling dates in Argentina timezone
const ARGENTINA_TIMEZONE = "America/Argentina/Buenos_Aires";

// Convert a date string to a Date object in Argentina timezone
export const parseDate = (dateString) => {
  if (!dateString) return null;

  // If it's already a Date object, return it
  if (dateString instanceof Date) {
    return dateString;
  }

  // For YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  // For other formats, let the Date constructor handle it
  return new Date(dateString);
};

// Format a date to a string in Argentina timezone
export const formatDate = (date, options = {}) => {
  if (!date) return "";

  const defaultOptions = {
    timeZone: ARGENTINA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  const mergedOptions = { ...defaultOptions, ...options };

  const d = parseDate(date);
  return d.toLocaleDateString("es-AR", mergedOptions);
};

// Get today's date in Argentina timezone
export const getToday = () => {
  const now = new Date();
  const options = { timeZone: ARGENTINA_TIMEZONE };
  const dateStr = now.toLocaleString("en-US", options);
  const [month, day, year] = new Date(dateStr)
    .toLocaleDateString("en-US")
    .split("/");
  return new Date(year, month - 1, day);
};

// Get a date key for comparison (YYYY-MM-DD format in Argentina timezone)
export const getDateKey = (date) => {
  if (!date) return "";

  const d = parseDate(date);
  if (isNaN(d.getTime())) return "";

  return d.toLocaleDateString("en-CA", { timeZone: ARGENTINA_TIMEZONE });
};

// Format date for display with relative day (Hoy, Ayer, etc.)
export const formatDateWithRelativeDay = (dateString) => {
  if (!dateString) return "";

  const date = parseDate(dateString);
  if (isNaN(date.getTime())) return "";

  const today = getToday();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateKey = getDateKey(date);
  const todayKey = getDateKey(today);
  const yesterdayKey = getDateKey(yesterday);

  const formattedDate = formatDate(date, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (dateKey === todayKey) {
    return `Hoy, ${formattedDate}`;
  } else if (dateKey === yesterdayKey) {
    return `Ayer, ${formattedDate}`;
  }

  return formattedDate;
};

// Check if two dates are the same day in Argentina timezone
export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  return getDateKey(date1) === getDateKey(date2);
};
