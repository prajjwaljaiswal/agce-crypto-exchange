import { ApiError } from "../../../lib/http.js";

/**
 * Pull the best user-facing string out of an error, preferring the server's
 * own message + HTTP status/code so toasts surface the real reason a call
 * failed instead of a generic "Request failed".
 */
export function toErrorMessage(err: unknown, fallback: string): string {
    if (err instanceof ApiError) {
        const parts = [err.message || fallback];
        if (err.code) parts.push(`[${err.code}]`);
        else if (err.status) parts.push(`(${err.status})`);
        return parts.join(' ');
    }
    if (err instanceof Error && err.message) return err.message;
    return fallback;
}
