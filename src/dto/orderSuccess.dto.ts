import { z } from "zod"

export const orderSuccessSchema = z.object({
  orderId: z.string().min(1),
  phoneNumber: z.string().min(1),
  sourceTag: z.string().optional(),
  code: z.string().optional(),
  messageResponse: z.string().optional(),
})

export type OrderSuccessDto = z.infer<typeof orderSuccessSchema>
