export interface AuthApiError {
  response?: { data?: { message?: string; statusCode?: number } };
  message?: string;
  error?: string;
  statusCode?: number;
}

/**
 * The axios interceptor rejects with the response body itself, so the backend
 * message can sit either at the top level or under `response.data`.
 */
export const getAuthErrorMessage = (error: AuthApiError) =>
  error?.response?.data?.message || error?.message || error?.error || "";

/**
 * Login fails with a 401 when the account exists but the email was never
 * verified: "An account already exists with this email, but your email has not
 * been verified yet". The status code is not matched on so the check still
 * holds if the backend switches it to a 403.
 */
export const isUnverifiedEmailError = (error: AuthApiError) =>
  /not\s+(?:been\s+)?verified/i.test(getAuthErrorMessage(error));
