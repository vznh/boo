// utils/back.ts
import { isAxiosError } from "axios";

export function parseError(error: any) {
  let errorMessage: string = "";

  if (isAxiosError(error)) {
    errorMessage += "Error is of type Axios.\n";
  }

  if (error.message) {
    errorMessage += `Error has contained message: ${error.message}\n`;
  }

  if (error.code) {
    errorMessage += `Error has attached code: ${error.code}\n`;
  }

  return errorMessage;
}
