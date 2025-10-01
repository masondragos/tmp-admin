import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  const role = session.user.role;

  switch (role) {
    case "ADMIN":
      redirect("/admin");
    case "APPLICANT":
      redirect("/applicant");
    case "LENDER":
      redirect("/lender");
    default:
      redirect("/");
  }
}
