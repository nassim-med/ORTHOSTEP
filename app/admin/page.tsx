import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "../../lib/admin-session";

export default async function AdminRoot() {
  const cookieStore = await cookies();
  const hasSession = cookieStore.get(ADMIN_SESSION_COOKIE)?.value === "1";
  redirect(hasSession ? "/admin/dashboard" : "/admin/login");
}
