import dayjs from "dayjs";

export function formatDate(date: Date) {
  return dayjs(date).format("HH:mm:ss DD/MM/YYYY");
}
