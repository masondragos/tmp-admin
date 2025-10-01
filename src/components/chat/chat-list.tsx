"use client";

import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  type: string;
  participants: Array<{
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
  messages: Array<{
    id: string;
    content: string;
    createdAt: Date;
    sender: {
      id: string;
      name: string;
    };
  }>;
  updatedAt: Date;
}

interface ChatListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  currentUserId: string;
}

export function ChatList({
  conversations,
  activeConversationId,
  onSelectConversation,
  currentUserId,
}: ChatListProps) {
  const getOtherParticipants = (conversation: Conversation) => {
    return conversation.participants
      .filter((p) => p.user.id !== currentUserId)
      .map((p) => p.user);
  };

  const getConversationTitle = (conversation: Conversation) => {
    const others = getOtherParticipants(conversation);
    if (others.length === 0) return "Unknown";
    if (others.length === 1) return others[0].name;
    if (others.length === 2) return `${others[0].name} and ${others[1].name}`;
    return `${others[0].name} and ${others.length - 1} others`;
  };

  const getConversationInitials = (conversation: Conversation) => {
    const others = getOtherParticipants(conversation);
    if (others.length === 0) return "?";
    if (others.length === 1) {
      return others[0].name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return others.length.toString();
  };

  const getLastMessage = (conversation: Conversation) => {
    const messages = conversation.messages;
    return messages.length > 0 ? messages[messages.length - 1] : null;
  };

  const formatMessagePreview = (
    message: {
      content: string;
      sender: { id: string; name: string };
    } | null
  ) => {
    if (!message) return "";
    const isOwnMessage = message.sender.id === currentUserId;
    
    if (isOwnMessage) {
      return `You: ${message.content}`;
    }
    
    return `${message.sender.name}: ${message.content}`;
  };

  return (
    <div className="flex flex-col h-full bg-white border-r">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No conversations yet
          </div>
        ) : (
          conversations.map((conversation) => {
            const conversationTitle = getConversationTitle(conversation);
            const conversationInitials = getConversationInitials(conversation);
            const lastMessage = getLastMessage(conversation);
            const isActive = conversation.id === activeConversationId;

            return (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={cn(
                  "w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b text-left",
                  isActive && "bg-blue-50 hover:bg-blue-50"
                )}
              >
                <Avatar>
                  <AvatarFallback>{conversationInitials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <p className="font-medium text-sm truncate">
                      {conversationTitle}
                    </p>
                    {lastMessage && (
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDistanceToNow(new Date(lastMessage.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    )}
                  </div>
                  {lastMessage && (
                    <p className="text-sm text-gray-600 truncate">
                      {formatMessagePreview(lastMessage)}
                    </p>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
