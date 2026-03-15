export function normalizePhone(phone: string): string {
  // Xóa khoảng trắng và ký tự đặc biệt
  let normalized = phone.replace(/\s+|-|\./g, "")

  // Chuyển +84 -> 0
  if (normalized.startsWith("+84")) {
    normalized = "0" + normalized.slice(3)
  }

  // Chuyển 84 -> 0
  if (normalized.startsWith("84") && normalized.length === 11) {
    normalized = "0" + normalized.slice(2)
  }

  return normalized
}

export function parsePhoneList(text: string): string[] {
  return text
    .split(/[\n,;]+/)
    .map((p) => normalizePhone(p.trim()))
    .filter((p) => p.length > 0)
}

export function isValidPhone(phone: string): boolean {
  return /^(0[3-9])\d{8}$/.test(phone)
}
