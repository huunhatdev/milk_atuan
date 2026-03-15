export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Chờ xử lý",
  [OrderStatus.PROCESSING]: "Đang xử lý",
  [OrderStatus.COMPLETED]: "Hoàn thành",
  [OrderStatus.CANCELLED]: "Đã hủy",
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "orange",
  [OrderStatus.PROCESSING]: "blue",
  [OrderStatus.COMPLETED]: "green",
  [OrderStatus.CANCELLED]: "red",
}
