import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversationId = params.id;

    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId: session.user.id,
        isActive: true,
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Not a participant of this conversation" },
        { status: 403 }
      );
    }

    const unreadMessages = await prisma.message.findMany({
      where: {
        conversationId,
        senderId: {
          not: session.user.id,
        },
        reads: {
          none: {
            userId: session.user.id,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (unreadMessages.length > 0) {
      await prisma.messageRead.createMany({
        data: unreadMessages.map((msg) => ({
          messageId: msg.id,
          userId: session.user.id,
        })),
        skipDuplicates: true,
      });
    }

    return NextResponse.json({ 
      success: true, 
      markedAsRead: unreadMessages.length 
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json(
      { error: "Failed to mark messages as read" },
      { status: 500 }
    );
  }
}
