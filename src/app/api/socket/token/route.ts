import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignJWT } from "jose";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
    const token = await new SignJWT({
      id: session.user.id,
      role: session.user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secret);

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error generating socket token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
