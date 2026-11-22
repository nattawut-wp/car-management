import axios from "axios";

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiError {
  status: number | null;
  message: string;
  fieldErrors: ApiFieldError[];
}

interface ApiErrorBody {
  error?: { message?: string; details?: ApiFieldError[] };
}

export function toApiError(err: unknown): ApiError {
  if (!axios.isAxiosError<ApiErrorBody>(err)) {
    return { status: null, message: "Something went wrong", fieldErrors: [] };
  }
  if (!err.response) {
    return { status: null, message: "Cannot reach the server. Is the API running?", fieldErrors: [] };
  }

  const body = err.response.data?.error;
  return {
    status: err.response.status,
    message: body?.message ?? "Something went wrong",
    fieldErrors: body?.details ?? [],
  };
}
