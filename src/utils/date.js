// src/utils/date.js
// No external dependencies

export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); // e.g., "Apr 26"
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isTodayLocal(iso) {
  if (!iso) return false;
  const d = startOfDay(iso);
  const today = startOfDay(new Date());
  return d.getTime() === today.getTime();
}

export function isDueToday(iso) {
  return isTodayLocal(iso);
}

export function isOverdue(iso) {
  if (!iso) return false;
  const d = startOfDay(iso);
  const today = startOfDay(new Date());
  return d < today; // strictly before today
}

export function isUpcoming(iso) {
  if (!iso) return true; // no due date -> treat as upcoming
  const d = startOfDay(iso);
  const today = startOfDay(new Date());
  return d > today; // strictly after today
}

export function parseISO(iso) {
  return new Date(iso);
}