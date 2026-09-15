import type { Location } from "react-router-dom";

/**
 * Carried in router state when opening a detail page, so the detail page can
 * send the admin back to the list they actually came from.
 */
export interface AdminBackState {
  /** Path, including query string, the user navigated from. */
  from?: string;
}

export interface AdminBackTarget {
  to: string;
  label: string;
}

const FALLBACK: AdminBackTarget = {
  to: "/admin/users",
  label: "Back to users",
};

const LIST_LABELS: { prefix: string; label: string }[] = [
  { prefix: "/admin/sellers", label: "Back to sellers" },
  { prefix: "/admin/buyers", label: "Back to buyers" },
  { prefix: "/admin/users", label: "Back to users" },
];

/**
 * Builds the router state to attach when navigating into a detail page, so the
 * origin — including pagination and filters — survives the round trip.
 */
export const buildAdminBackState = (
  location: Pick<Location, "pathname" | "search">,
): AdminBackState => ({
  from: `${location.pathname}${location.search}`,
});

/**
 * Resolves where a detail page's back link should point.
 *
 * Falls back to the users list whenever the origin is missing (a deep link, a
 * refresh, or a page opened in a new tab). Only in-app admin paths are
 * accepted, so a crafted history entry cannot turn this into an open redirect.
 */
export const getAdminBackTarget = (state: unknown): AdminBackTarget => {
  const from = (state as AdminBackState | null | undefined)?.from;

  if (typeof from !== "string" || !from.startsWith("/admin/")) {
    return FALLBACK;
  }

  const match = LIST_LABELS.find(({ prefix }) => from.startsWith(prefix));
  if (!match) return FALLBACK;

  return { to: from, label: match.label };
};
