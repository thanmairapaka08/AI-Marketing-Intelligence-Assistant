import axios from "axios";

export type ApiErrorKind =
  | "network"
  | "timeout"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "unavailable"
  | "validation"
  | "server"
  | "unknown";

export class ApiError extends Error {
  kind: ApiErrorKind;
  status: number | null;
  fieldErrors: Record<string, string>;

  constructor(
    message: string,
    kind: ApiErrorKind,
    status: number | null = null,
    fieldErrors: Record<string, string> = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

type FastApiValidationItem = { loc?: (string | number)[]; msg?: string };

function readDetail(data: unknown): { message?: string | undefined; fieldErrors: Record<string, string> } {
  const fieldErrors: Record<string, string> = {};
  if (!data || typeof data !== "object") return { fieldErrors };
  const record = data as Record<string, unknown>;
  const detail = record["detail"] ?? record["message"] ?? record["error"];

  if (typeof detail === "string") return { message: detail, fieldErrors };

  if (Array.isArray(detail)) {
    const items = detail as FastApiValidationItem[];
    for (const item of items) {
      const field = item.loc?.filter((part) => part !== "body").join(".");
      if (field && item.msg && !fieldErrors[field]) fieldErrors[field] = item.msg;
    }
    const first = items.find((item) => item.msg)?.msg;
    return { message: first, fieldErrors };
  }

  return { fieldErrors };
}

/**
 * FastAPI answers unknown routes with exactly {"detail": "Not Found"}; a missing
 * resource normally carries a custom message. 405/501 also mean "not built yet".
 */
export function isEndpointMissing(status: number | null, data: unknown): boolean {
  if (status === 405 || status === 501) return true;
  if (status !== 404) return false;
  const { message } = readDetail(data);
  return message === "Not Found";
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return new ApiError("The server took too long to respond.", "timeout");
    }
    if (!error.response) {
      return new ApiError("Can't reach the backend. Check that the API server is running.", "network");
    }

    const status = error.response.status;
    const data = error.response.data;
    const { message, fieldErrors } = readDetail(data);

    if (isEndpointMissing(status, data)) {
      return new ApiError("This feature isn't available on the backend yet.", "unavailable", status);
    }
    if (status === 401) return new ApiError(message || "Your session has expired.", "unauthorized", status);
    if (status === 403) return new ApiError(message || "You don't have access to this.", "forbidden", status);
    if (status === 404) return new ApiError(message || "Not found.", "not_found", status);
    if (status === 409 || status === 400 || status === 422) {
      return new ApiError(message || "Please check the details and try again.", "validation", status, fieldErrors);
    }
    if (status >= 500) return new ApiError(message || "The server ran into a problem.", "server", status);
    return new ApiError(message || `Request failed (${status}).`, "unknown", status);
  }

  if (error instanceof Error) return new ApiError(error.message, "unknown");
  return new ApiError("Something went wrong.", "unknown");
}

export function getErrorMessage(error: unknown): string {
  return toApiError(error).message;
}
