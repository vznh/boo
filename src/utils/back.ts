// [START utils/back.ts]
import { isAxiosError } from "axios";

/**
 * Function for parsing errors from any error variable, most preferably in try-catch loops.
 * @param {any} error - The error component to be parsed.
 * @returns {string} errorMessage - A string detailing all of the errors separated by a line break.
 */
export function parseError(error: any) {
  let errorMessage: string = "";

  if (isAxiosError(error)) {
    errorMessage += "Error is of type Axios.\n";
  }

  if (error.data) {
    errorMessage += `Error has contained data which could help: ${error.response.data}\n`
  }
  if (error.message) {
    errorMessage += `Error has contained message: ${error.message}\n`;
  }

  if (error.code) {
    errorMessage += `Error has attached code: ${error.code}\n`;
  }

  return errorMessage;
}

/**
 * Returns current date and time when called.
 * @returns {string} date - Date and time in DDMMYY.
 */
export function getCurrentStatus() {
  return new Date().toISOString();
}

// [END utils/back.ts]
