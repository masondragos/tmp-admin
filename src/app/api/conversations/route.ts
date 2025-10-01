import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id,
            isActive: true,
          },
        },
      },
      include: {
        participants: {
          where: {
            isActive: true,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || !session?.user?.role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { participantIds, type = "ADMIN_APPLICANT" } = await req.json();

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return NextResponse.json(
        { error: "Participant IDs are required" },
        { status: 400 }
      );
    }

    const uniqueParticipantIds = [...new Set(participantIds)];

    const participants = await prisma.user.findMany({
      where: {
        id: {
          in: uniqueParticipantIds,
        },
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (participants.length !== uniqueParticipantIds.length) {
      return NextResponse.json(
        { error: "One or more participant IDs are invalid" },
        { status: 400 }
      );
    }

    const currentUserRole = session.user.role;
    const participantRoles = participants.map((p) => p.role);

    if (currentUserRole === "ADMIN") {
      const hasOnlyAllowedRoles = participantRoles.every(
        (role) => role === "APPLICANT" || role === "LENDER"
      );
      if (!hasOnlyAllowedRoles) {
        return NextResponse.json(
          { error: "Admins can only add applicants or lenders to conversations" },
          { status: 403 }
        );
      }
    } else if (currentUserRole === "APPLICANT") {
      const hasOnlyAdmins = participantRoles.every((role) => role === "ADMIN");
      if (!hasOnlyAdmins) {
        return NextResponse.json(
          { error: "Applicants can only create conversations with admins" },
          { status: 403 }
        );
      }
    } else if (currentUserRole === "LENDER") {
      return NextResponse.json(
        { error: "Lenders cannot create new conversations" },
        { status: 403 }
      );
    }

    const allParticipantIds = [...new Set([session.user.id, ...uniqueParticipantIds])];

    const conversation = await prisma.conversation.create({
      data: {
        type,
        createdById: session.user.id,
        participants: {
          create: allParticipantIds.map((userId) => ({
            userId,
          })),
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
