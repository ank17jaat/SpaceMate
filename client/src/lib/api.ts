import type {
  Booking,
  CreateBookingInput,
  CreatePropertyInput,
  Property,
  SearchPropertiesParams,
} from "@shared/schema";

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || "";
const apiBaseUrl = rawApiBaseUrl.replace(/\/+$/, "");

type TokenProvider = () => Promise<string | null>;

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

function buildUrl(path: string, query?: Record<string, unknown>) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const base = apiBaseUrl || window.location.origin;
  const url = new URL(normalizedPath, base);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        continue;
      }

      url.searchParams.set(
        key,
        Array.isArray(value) ? value.join(",") : String(value),
      );
    }
  }

  return apiBaseUrl ? url.toString() : `${url.pathname}${url.search}`;
}

export function buildApiUrl(path: string) {
  return buildUrl(path);
}

async function parseError(res: Response) {
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const json = await res.json();
    return {
      message: json.message || json.error || "Request failed",
      details: json.details,
    };
  }

  const text = await res.text();
  return { message: text || res.statusText, details: null };
}

async function request<T>(
  path: string,
  init?: RequestInit & {
    query?: Record<string, unknown>;
    tokenProvider?: TokenProvider;
  },
): Promise<T> {
  const { query, tokenProvider, headers, ...requestInit } = init || {};
  const token = tokenProvider ? await tokenProvider() : null;
  const mergedHeaders = new Headers(headers);

  if (!mergedHeaders.has("Content-Type") && requestInit.body) {
    mergedHeaders.set("Content-Type", "application/json");
  }

  if (token) {
    mergedHeaders.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(buildUrl(path, query), {
    ...requestInit,
    headers: mergedHeaders,
    credentials: "include",
  });

  if (!res.ok) {
    const error = await parseError(res);
    throw new ApiError(res.status, error.message, error.details);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export const metaApi = {
  listAmenities: () => request<{ amenities: string[] }>("/api/amenities"),
};

export const propertiesApi = {
  list: (filters?: SearchPropertiesParams) =>
    request<Property[]>("/api/properties", { query: filters }),
  getById: (id: string) => request<Property>(`/api/properties/${id}`),
  listMine: (tokenProvider: TokenProvider) =>
    request<Property[]>("/api/properties/mine", { tokenProvider }),
  create: (payload: CreatePropertyInput, tokenProvider: TokenProvider) =>
    request<Property>("/api/properties", {
      method: "POST",
      body: JSON.stringify(payload),
      tokenProvider,
    }),
  remove: (id: string, tokenProvider: TokenProvider) =>
    request<{ success: true }>(`/api/properties/${id}`, {
      method: "DELETE",
      tokenProvider,
    }),
};

export const bookingsApi = {
  listMine: (tokenProvider: TokenProvider) =>
    request<Booking[]>("/api/bookings/me", { tokenProvider }),
  create: (payload: CreateBookingInput, tokenProvider: TokenProvider) =>
    request<Booking>("/api/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
      tokenProvider,
    }),
  cancel: (id: string, tokenProvider: TokenProvider) =>
    request<{ success: true }>(`/api/bookings/${id}`, {
      method: "DELETE",
      tokenProvider,
    }),
};
