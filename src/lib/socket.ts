"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

async function fetchSocketToken(): Promise<string> {
  const response = await fetch("/api/socket/token");
  if (!response.ok) {
    throw new Error("Failed to fetch socket token");
  }
  const data = await response.json();
  return data.token;
}

export async function getSocket(): Promise<Socket> {
  if (!socket) {
    const token = await fetchSocketToken();
    
    socket = io({
      autoConnect: true,
      auth: {
        token,
      },
      withCredentials: true,
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
