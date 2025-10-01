"use client";

import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  createdAt: Date;
  sender: {
    id: string;
    name: string;
  };
}

interface MessagePaneProps {
  messages: Message[];
  currentUserId: string;
}

export function MessagePane({ messages, currentUserId }: MessagePaneProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const isOwn = message.sender.id === currentUserId;

        return (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              isOwn ? "flex-row-reverse" : "flex-row"
            )}
          >
            <Avatar className="flex-shrink-0">
              <AvatarFallback>
                {getInitials(message.sender.name)}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "flex flex-col",
                isOwn ? "items-end" : "items-start"
              )}
            >
              <div
                className={cn(
                  "max-w-md rounded-lg px-4 py-2",
                  isOwn
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                )}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {format(new Date(message.createdAt), "h:mm a")}
              </span>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
