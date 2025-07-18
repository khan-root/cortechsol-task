const VITE_API_URL = import.meta.env.VITE_API_URL;

export const fetcher = async <T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> => {
  const token = localStorage.getItem("token");
  const isFormData = init?.body instanceof FormData;

  // Start with a plain object for headers
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init?.headers as Record<string, string>),
  };

  // Set Content-Type only if not uploading FormData
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${VITE_API_URL}${input}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "API Error");
  }

  return res.json();
};
