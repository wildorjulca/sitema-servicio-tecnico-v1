import { AxiosError } from "axios";

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.error ||
      error.response?.data?.mensaje ||
      "Error desconocido"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Error desconocido";
}
