"use client";

import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

interface Message {
  id: string;
  content: string;
  createdAt: Date;
  sender: {
    id: string;
    name: string;
  };
  reads?: { userId: string; readAt: Date }[];
}

interface MessagePaneProps {
  messages: Message[];
  currentUserId: string;
  typingUsers?: string[];
  conversationId?: string;
  onMessagesViewed?: (messageIds: string[]) => void;
}

export function MessagePane({ 
  messages, 
  currentUserId, 
  typingUsers = [],
  conversationId,
  onMessagesViewed
}: MessagePaneProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  useEffect(() => {
    if (!conversationId || !onMessagesViewed) return;

    const unreadMessages = messages
      .filter(msg => 
        msg.sender.id !== currentUserId && 
        !msg.reads?.some(r => r.userId === currentUserId)
      )
      .map(msg => msg.id);

    if (unreadMessages.length > 0) {
      const timer = setTimeout(() => {
        onMessagesViewed(unreadMessages);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [messages, currentUserId, conversationId, onMessagesViewed]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getReadStatus = (message: Message) => {
    if (message.sender.id !== currentUserId) return null;
    
    const otherUsersRead = message.reads?.filter(r => r.userId !== currentUserId) || [];
    const isRead = otherUsersRead.length > 0;
    
    return isRead ? "read" : "delivered";
  };

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && typingUsers.length === 0 && (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>No messages yet. Start the conversation!</p>
        </div>
      )}
      {messages.map((message) => {
        const isOwn = message.sender.id === currentUserId;
        const readStatus = getReadStatus(message);

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
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <span>{format(new Date(message.createdAt), "h:mm a")}</span>
                {readStatus && (
                  <>
                    {readStatus === "read" ? (
                      <CheckCheck className="h-3 w-3 text-blue-500" />
                    ) : (
                      <Check className="h-3 w-3" />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {typingUsers.length > 0 && (
        <div className="flex gap-3">
          <Avatar className="flex-shrink-0">
            <AvatarFallback>...</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
            <span className="text-xs text-gray-500 mt-1">
              {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
            </span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
