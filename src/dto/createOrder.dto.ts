import { z } from "zod"

export const createOrderSchema = z.object({
  serviceId: z.string().min(1, "Vui lòng chọn dịch vụ"),
  quantity: z.number().int().min(1, "Số lượng phải lớn hơn 0"),
  message: z.string().min(1, "Vui lòng nhập nội dung tin nhắn"),
  ccg: z.boolean(),
})

export type CreateOrderDto = z.infer<typeof createOrderSchema>
