export async function apiFetch(url: string, options?: RequestInit): Promise<Response> {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  })

  if (res.status === 401) {
    // Try refreshing the token
    const refreshRes = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    })

    if (refreshRes.ok) {
      // Retry original request
      return fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(options?.headers || {}),
        },
      })
    }

    // Refresh failed, redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
  }

  return res
}

export async function apiGet<T>(url: string): Promise<T> {
  const res = await apiFetch(url)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error?.error?.message || "Request failed")
  }
  return res.json()
}

export async function apiPost<T>(url: string, body: unknown): Promise<T> {
  const res = await apiFetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error?.error?.message || "Request failed")
  }
  return res.json()
}

export async function apiPatch<T>(url: string, body: unknown): Promise<T> {
  const res = await apiFetch(url, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error?.error?.message || "Request failed")
  }
  return res.json()
}

export async function apiDelete<T>(url: string): Promise<T> {
  const res = await apiFetch(url, {
    method: "DELETE",
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error?.error?.message || "Request failed")
  }
  return res.json()
}
