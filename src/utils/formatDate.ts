import dayjs from "dayjs"

export function formatDate(date: string | Date, format = "DD/MM/YYYY HH:mm"): string {
  return dayjs(date).format(format)
}

export function formatDateOnly(date: string | Date): string {
  return dayjs(date).format("DD/MM/YYYY")
}
