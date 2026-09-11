import * as yup from "yup";
import { z } from "zod";

/**
 * Single source of truth for the Doju Health password policy.
 *
 * IMPORTANT: everything in this file is a UX affordance, not a security
 * control. Anything here can be bypassed by posting straight to the API, so
 * the same rules MUST be enforced by the backend service (doju-ezvs) on
 * registration, password change, password reset and admin-initiated resets.
 */

export const PASSWORD_MIN_LENGTH = 10;

/**
 * Guards against denial-of-service via expensive server-side hashing of huge
 * inputs. Long passphrases are still very welcome below this ceiling.
 */
export const PASSWORD_MAX_LENGTH = 128;

/**
 * Passwords that are trivially guessed. This is a deliberately small,
 * high-signal list: exhaustive breached-password checking (e.g. Have I Been
 * Pwned) has to happen server-side, where it cannot be skipped.
 */
const COMMON_PASSWORDS = new Set(
  [
    "123456",
    "12345678",
    "123456789",
    "1234567890",
    "password",
    "password1",
    "password123",
    "passw0rd",
    "qwerty",
    "qwerty123",
    "qwertyuiop",
    "111111",
    "123123",
    "abc123",
    "1q2w3e4r",
    "1qaz2wsx",
    "iloveyou",
    "admin",
    "admin123",
    "administrator",
    "welcome",
    "welcome1",
    "welcome123",
    "letmein",
    "monkey",
    "dragon",
    "sunshine",
    "princess",
    "football",
    "baseball",
    "trustno1",
    "changeme",
    "secret",
    "master",
    "login",
    "starwars",
    "whatever",
    "zaq12wsx",
    "asdfghjkl",
    "doju",
    "dojuhealth",
    "doju123",
    "health123",
  ].map((entry) => entry.toLowerCase()),
);

const LEET_BASE: Record<string, string> = {
  "@": "a",
  "4": "a",
  "8": "b",
  "3": "e",
  "0": "o",
  "5": "s",
  $: "s",
  "7": "t",
  "9": "g",
};

/**
 * Several leet characters are ambiguous — "1" reads as both "l" and "i", so
 * "adm1n" has to be decoded both ways to catch "admin". Each variant is tested
 * against the blocklist separately.
 */
const LEET_VARIANTS: Record<string, string>[] = [
  { ...LEET_BASE, "1": "l", "!": "l", "|": "l", "6": "g", "2": "z" },
  { ...LEET_BASE, "1": "i", "!": "i", "|": "i", "6": "b", "2": "z" },
];

const decodeLeet = (value: string, map: Record<string, string>) =>
  [...value].map((char) => map[char] ?? char).join("");

/**
 * Variants of the password to test against the blocklist, so decorating a
 * common word does not defeat it: "Password1!", "P@ssw0rd123" and
 * "p-a-s-s-w-o-r-d" all reduce to "password".
 *
 * Trailing digits are stripped BEFORE leet-decoding — decoding first would
 * turn "…123" into letters and hide the base word.
 */
const blocklistCandidates = (password: string): Set<string> => {
  const lower = password.toLowerCase();
  const withoutTrailing = lower.replace(/[^a-z]+$/, "");
  const core = withoutTrailing.replace(/^[^a-z]+/, "");
  const lettersOnly = lower.replace(/[^a-z]/g, "");

  const candidates = new Set([lower, withoutTrailing, core, lettersOnly]);
  for (const candidate of [...candidates]) {
    for (const map of LEET_VARIANTS) {
      const decoded = decodeLeet(candidate, map);
      candidates.add(decoded);
      candidates.add(decoded.replace(/[^a-z]/g, ""));
    }
  }
  return candidates;
};

/** True when the password is a single character repeated, e.g. "aaaaaaaaaa". */
const isRepeatedCharacter = (password: string) =>
  password.length > 0 && new Set(password).size === 1;

/**
 * True for straight runs off the keyboard or number row in either direction,
 * e.g. "abcdefghij" or "9876543210".
 */
const isSequential = (password: string) => {
  const lower = password.toLowerCase();
  if (lower.length < 4) return false;

  const runs = ["abcdefghijklmnopqrstuvwxyz", "01234567890", "qwertyuiop"];
  return runs.some((run) => {
    const reversed = [...run].reverse().join("");
    return run.includes(lower) || reversed.includes(lower);
  });
};

export type PasswordRule = {
  id: string;
  /** Shown to the user as a checklist item. */
  label: string;
  /** Shown when a form surfaces a single error string instead of the list. */
  error: string;
  test: (password: string) => boolean;
};

/**
 * The rules surfaced to the user as a live checklist. Ordered the way they
 * should be displayed.
 */
export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: "length",
    label: `At least ${PASSWORD_MIN_LENGTH} characters`,
    error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    test: (password) =>
      password.length >= PASSWORD_MIN_LENGTH &&
      password.length <= PASSWORD_MAX_LENGTH,
  },
  {
    id: "lowercase",
    label: "One lowercase letter (a-z)",
    error: "Password must include a lowercase letter (a-z)",
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: "uppercase",
    label: "One uppercase letter (A-Z)",
    error: "Password must include an uppercase letter (A-Z)",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "number",
    label: "One number (0-9)",
    error: "Password must include a number (0-9)",
    test: (password) => /\d/.test(password),
  },
  {
    id: "special",
    label: "One special character (e.g. ! ? @ # $)",
    error: "Password must include a special character (e.g. ! ? @ # $)",
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
  {
    id: "notCommon",
    label: "Not a commonly used or easily guessed password",
    error:
      "This password is too common or easy to guess. Please choose another.",
    test: (password) => {
      if (!password) return false;
      for (const candidate of blocklistCandidates(password)) {
        if (candidate && COMMON_PASSWORDS.has(candidate)) return false;
      }
      if (isRepeatedCharacter(password)) return false;
      if (isSequential(password)) return false;
      return true;
    },
  },
];

/** The rules a password currently fails, in display order. */
export const getFailedPasswordRules = (password: string): PasswordRule[] =>
  PASSWORD_RULES.filter((rule) => !rule.test(password ?? ""));

export const isPasswordValid = (password: string): boolean =>
  getFailedPasswordRules(password).length === 0;

/**
 * A single message naming the first unmet requirement, for forms that show one
 * error string rather than the full checklist.
 */
export const getPasswordError = (password: string): string | undefined => {
  if (!password) return "Password is required";
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Password must be ${PASSWORD_MAX_LENGTH} characters or fewer`;
  }

  const [firstFailure] = getFailedPasswordRules(password);
  return firstFailure?.error;
};

/** Yup schema for Formik forms (`useFormHandler`). */
export const passwordYupSchema = yup
  .string()
  .required("Password is required")
  .test(
    "password-policy",
    // Resolved per-value by the function below.
    "Password does not meet the requirements",
    function (value) {
      const message = getPasswordError(value ?? "");
      if (!message) return true;
      return this.createError({ message });
    },
  );

/** Zod schema for the auth pages, which validate with standalone zod parsers. */
export const passwordZodSchema = z.string().superRefine((value, ctx) => {
  const message = getPasswordError(value);
  if (message) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message });
  }
});

/**
 * Sign-in must never apply the complexity policy: existing accounts predate it,
 * and echoing the rules on a login form only tells an attacker the shape of
 * what they are guessing.
 */
export const loginPasswordZodSchema = z
  .string()
  .min(1, "Password is required");
