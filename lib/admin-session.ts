export const ADMIN_SESSION_COOKIE = "orthostep-admin-session";

export function setAdminSessionCookie() {
  if (typeof document === "undefined") return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${ADMIN_SESSION_COOKIE}=1; Path=/; Max-Age=604800; SameSite=Lax${secure}`;
}

export function clearAdminSessionCookie() {
  if (typeof document === "undefined") return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${ADMIN_SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}
