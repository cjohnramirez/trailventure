import { apiRequest } from "@/lib/api/client";

/**
 * Typed wrappers for django-allauth's headless "browser" API.
 * Spec: api/.venv/Lib/site-packages/allauth/headless/spec/doc/openapi.yaml
 */

const BASE = "/_allauth/browser/v1";

export type AllauthError = { message: string; code: string; param?: string };

export type Flow = { id: string; is_pending?: boolean; provider?: { id: string; name: string } };

export type AuthResult =
  /** Signed in. */
  | { kind: "authenticated" }
  /** A step is still required, e.g. `verify_email` or `password_reset_by_code`. */
  | { kind: "pending"; flow: string }
  /** Signed out, or the request was accepted without signing in. */
  | { kind: "anonymous" }
  /** Input or rate-limit errors, keyed by field (`form` for non-field errors). */
  | { kind: "error"; fieldErrors: Record<string, string>; formError?: string };

type Envelope = {
  status: number;
  errors?: AllauthError[];
  data?: { flows?: Flow[] };
  meta?: { is_authenticated?: boolean };
};

const GENERIC_ERROR = "Something went wrong on our side. Please try again in a moment.";

async function toResult(response: Response): Promise<AuthResult> {
  let body: Envelope | null = null;
  try {
    body = (await response.json()) as Envelope;
  } catch {
    return { kind: "error", fieldErrors: {}, formError: GENERIC_ERROR };
  }

  if (response.status === 200) {
    return body.meta?.is_authenticated ? { kind: "authenticated" } : { kind: "anonymous" };
  }
  if (response.status === 401) {
    const pending = body.data?.flows?.find((flow) => flow.is_pending);
    return pending ? { kind: "pending", flow: pending.id } : { kind: "anonymous" };
  }
  if (response.status === 400 && body.errors?.length) {
    const fieldErrors: Record<string, string> = {};
    let formError: string | undefined;
    for (const error of body.errors) {
      if (error.param && !fieldErrors[error.param]) fieldErrors[error.param] = error.message;
      else formError ??= error.message;
    }
    return { kind: "error", fieldErrors, formError };
  }
  if (response.status === 429) {
    return {
      kind: "error",
      fieldErrors: {},
      formError: "Too many attempts. Wait a few minutes, then try again.",
    };
  }
  if (response.status === 409) {
    return {
      kind: "error",
      fieldErrors: {},
      formError: "This step has expired. Start again to get a new code.",
    };
  }
  return { kind: "error", fieldErrors: {}, formError: GENERIC_ERROR };
}

async function post(path: string, json?: unknown) {
  return toResult(await apiRequest(`${BASE}${path}`, { method: "POST", json }));
}

export const allauth = {
  login: (email: string, password: string) => post("/auth/login", { email, password }),

  signup: (input: { email: string; password: string; first_name: string; last_name: string }) =>
    post("/auth/signup", input),

  verifyEmail: (key: string) => post("/auth/email/verify", { key }),

  resendEmailVerification: () => post("/auth/email/verify/resend"),

  requestPasswordReset: (email: string) => post("/auth/password/request", { email }),

  resetPassword: (key: string, password: string) => post("/auth/password/reset", { key, password }),

  logout: async () => toResult(await apiRequest(`${BASE}/auth/session`, { method: "DELETE" })),

  /** Social providers configured on the server (e.g. Google). Empty if none or on failure. */
  providers: async (): Promise<{ id: string; name: string }[]> => {
    try {
      const response = await apiRequest(`${BASE}/config`);
      if (!response.ok) return [];
      const body = (await response.json()) as {
        data?: { socialaccount?: { providers?: { id: string; name: string }[] } };
      };
      return body.data?.socialaccount?.providers ?? [];
    } catch {
      return [];
    }
  },
};

export const PROVIDER_REDIRECT_URL = `${BASE}/auth/provider/redirect`;
