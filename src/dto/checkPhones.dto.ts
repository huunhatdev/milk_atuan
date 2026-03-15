import { z } from "zod"

export const checkPhonesSchema = z.object({
  serviceCode: z.string().min(1, "Vui lòng chọn mã dịch vụ").transform(val => val.toUpperCase()),
  phones: z.array(z.string()).min(1, "Danh sách số điện thoại không được rỗng"),
})

export type CheckPhonesDto = z.infer<typeof checkPhonesSchema>
