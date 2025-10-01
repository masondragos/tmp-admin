import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  return session.user;
}

export async function requireRole(role: string | string[]) {
  const user = await requireAuth();
  const allowedRoles = Array.isArray(role) ? role : [role];
  
  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized");
  }
  
  return user;
}
