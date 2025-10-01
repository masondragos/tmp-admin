import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import { jwtVerify } from "jose";
import { prisma } from "./src/lib/prisma";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = parseInt(process.env.PORT || "5000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXTAUTH_URL || "http://localhost:5000",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    try {
      const authToken = socket.handshake.auth.token;

      if (!authToken) {
        return next(new Error("Authentication token required"));
      }

      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
      const { payload } = await jwtVerify(authToken, secret);

      if (!payload?.id || typeof payload.id !== "string") {
        return next(new Error("Invalid authentication token"));
      }

      socket.data.userId = payload.id;
      socket.data.userRole = payload.role;
      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.data.userId}`);

    socket.on("join:conversation", async (conversationId: string) => {
      try {
        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            conversationId,
            userId: socket.data.userId,
            isActive: true,
          },
        });

        if (!participant) {
          socket.emit("error", {
            message: "Not a participant of this conversation",
          });
          return;
        }

        socket.join(`conversation:${conversationId}`);
        console.log(
          `User ${socket.data.userId} joined conversation ${conversationId}`
        );
      } catch (error) {
        console.error("Error joining conversation:", error);
        socket.emit("error", { message: "Failed to join conversation" });
      }
    });

    socket.on("leave:conversation", (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(
        `User ${socket.data.userId} left conversation ${conversationId}`
      );
    });

    socket.on(
      "message:send",
      async (data: { conversationId: string; content: string }) => {
        try {
          const { conversationId, content } = data;

          const participant = await prisma.conversationParticipant.findFirst({
            where: {
              conversationId,
              userId: socket.data.userId,
              isActive: true,
            },
          });

          if (!participant) {
            socket.emit("error", {
              message: "Not a participant of this conversation",
            });
            return;
          }

          const message = await prisma.$transaction(async (tx) => {
            const newMessage = await tx.message.create({
              data: {
                conversationId,
                senderId: socket.data.userId,
                content: content.trim(),
              },
              include: {
                sender: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            });

            await tx.conversation.update({
              where: { id: conversationId },
              data: { updatedAt: new Date() },
            });

            await tx.messageRead.create({
              data: {
                messageId: newMessage.id,
                userId: socket.data.userId,
              },
            });

            return newMessage;
          });

          io.to(`conversation:${conversationId}`).emit("message:new", message);
        } catch (error) {
          console.error("Error sending message:", error);
          socket.emit("error", { message: "Failed to send message" });
        }
      }
    );

    socket.on(
      "typing:start",
      async (data: { conversationId: string; userName: string }) => {
        try {
          const participant = await prisma.conversationParticipant.findFirst({
            where: {
              conversationId: data.conversationId,
              userId: socket.data.userId,
              isActive: true,
            },
          });

          if (!participant) {
            socket.emit("error", {
              message: "Not a participant of this conversation",
            });
            return;
          }

          socket.to(`conversation:${data.conversationId}`).emit("typing:start", {
            userId: socket.data.userId,
            userName: data.userName,
            conversationId: data.conversationId,
          });
        } catch (error) {
          console.error("Error in typing:start:", error);
        }
      }
    );

    socket.on("typing:stop", async (data: { conversationId: string }) => {
      try {
        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            conversationId: data.conversationId,
            userId: socket.data.userId,
            isActive: true,
          },
        });

        if (!participant) {
          return;
        }

        socket.to(`conversation:${data.conversationId}`).emit("typing:stop", {
          userId: socket.data.userId,
          conversationId: data.conversationId,
        });
      } catch (error) {
        console.error("Error in typing:stop:", error);
      }
    });

    socket.on(
      "message:read",
      async (data: { conversationId: string; messageIds: string[] }) => {
        try {
          const { conversationId, messageIds } = data;

          const participant = await prisma.conversationParticipant.findFirst({
            where: {
              conversationId,
              userId: socket.data.userId,
              isActive: true,
            },
          });

          if (!participant) {
            socket.emit("error", {
              message: "Not a participant of this conversation",
            });
            return;
          }

          await prisma.messageRead.createMany({
            data: messageIds.map((messageId) => ({
              messageId,
              userId: socket.data.userId,
            })),
            skipDuplicates: true,
          });

          socket.to(`conversation:${conversationId}`).emit("message:read", {
            userId: socket.data.userId,
            messageIds,
          });
        } catch (error) {
          console.error("Error marking messages as read:", error);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.data.userId}`);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(
        `> Server listening at http://${hostname}:${port} as ${
          dev ? "development" : process.env.NODE_ENV
        }`
      );
    });
});
