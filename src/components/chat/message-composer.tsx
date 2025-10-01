"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface MessageComposerProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  conversationId?: string;
  userName?: string;
  userId?: string;
}

export function MessageComposer({
  onSendMessage,
  disabled = false,
  conversationId,
  userName,
  userId,
}: MessageComposerProps) {
  const [message, setMessage] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  const emitTypingStart = async () => {
    if (!conversationId || !userName || !userId || isTypingRef.current) return;

    const { getSocket } = await import("@/lib/socket");
    const socket = await getSocket();
    socket.emit("typing:start", { conversationId, userName, userId });
    isTypingRef.current = true;
  };

  const emitTypingStop = async () => {
    if (!conversationId || !userName || !userId || !isTypingRef.current) return;

    const { getSocket } = await import("@/lib/socket");
    const socket = await getSocket();
    socket.emit("typing:stop", { conversationId, userName, userId });
    isTypingRef.current = false;
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    if (e.target.value.trim()) {
      emitTypingStart();

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        emitTypingStop();
      }, 2000);
    } else {
      emitTypingStop();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      emitTypingStop();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      emitTypingStop();
    };
  }, [conversationId]);

  return (
    <form onSubmit={handleSubmit} className="border-t bg-white p-4">
      <div className="flex gap-2 items-end">
        <Textarea
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={disabled}
          className="flex-1 min-h-[80px] resize-none"
        />
        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          size="icon"
          className="h-10 w-10"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </form>
  );
}
