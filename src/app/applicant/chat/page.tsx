"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { ChatList } from "@/components/chat/chat-list";
import { MessagePane } from "@/components/chat/message-pane";
import { MessageComposer } from "@/components/chat/message-composer";
import { ChatShell } from "@/components/chat/chat-shell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Conversation {
  id: string;
  type: string;
  participants: { user: User }[];
  messages: {
    id: string;
    content: string;
    createdAt: Date;
    sender: {
      id: string;
      name: string;
    };
  }[];
  updatedAt: Date;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  sender: {
    id: string;
    name: string;
  };
  createdAt: Date;
}

export default function ApplicantChatPage() {
  const { data: session } = useSession();
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationHeader, setConversationHeader] = useState<{
    name: string;
    email?: string;
  } | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    fetchConversations();
  }, []);

  const socketRef = useRef<any>(null);
  const messageHandlerRef = useRef<((message: any) => void) | null>(null);
  const typingStartHandlerRef = useRef<((data: any) => void) | null>(null);
  const typingStopHandlerRef = useRef<((data: any) => void) | null>(null);

  useEffect(() => {
    if (selectedConversationId) {
      fetchMessages(selectedConversationId);
      updateConversationHeader(selectedConversationId);
      setTypingUsers([]);

      let isCancelled = false;

      const setupSocket = async () => {
        const { getSocket } = await import("@/lib/socket");
        const socket = await getSocket();

        if (isCancelled) {
          return;
        }

        socketRef.current = socket;

        socket.emit("join:conversation", selectedConversationId);

        const handleNewMessage = (message: any) => {
          if (message.conversationId === selectedConversationId) {
            setMessages((prev) => [
              ...prev,
              { ...message, createdAt: new Date(message.createdAt) },
            ]);
          }
        };

        const handleTypingStart = (data: any) => {
          if (data.conversationId === selectedConversationId && data.userId !== session?.user?.id) {
            setTypingUsers((prev) => 
              prev.includes(data.userName) ? prev : [...prev, data.userName]
            );
          }
        };

        const handleTypingStop = (data: any) => {
          if (data.conversationId === selectedConversationId && data.userId !== session?.user?.id) {
            setTypingUsers((prev) => prev.filter(u => u !== data.userName));
          }
        };

        messageHandlerRef.current = handleNewMessage;
        typingStartHandlerRef.current = handleTypingStart;
        typingStopHandlerRef.current = handleTypingStop;

        socket.on("message:new", handleNewMessage);
        socket.on("typing:start", handleTypingStart);
        socket.on("typing:stop", handleTypingStop);
      };

      setupSocket();

      return () => {
        isCancelled = true;
        if (socketRef.current) {
          if (messageHandlerRef.current) {
            socketRef.current.off("message:new", messageHandlerRef.current);
          }
          if (typingStartHandlerRef.current) {
            socketRef.current.off("typing:start", typingStartHandlerRef.current);
          }
          if (typingStopHandlerRef.current) {
            socketRef.current.off("typing:stop", typingStopHandlerRef.current);
          }
          socketRef.current.emit("leave:conversation", selectedConversationId);
          messageHandlerRef.current = null;
          typingStartHandlerRef.current = null;
          typingStopHandlerRef.current = null;
        }
      };
    } else {
      setMessages([]);
      setConversationHeader(null);
    }
  }, [selectedConversationId]);

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/conversations");
      if (response.ok) {
        const data = await response.json();
        const transformedData = data.map((conv: any) => ({
          ...conv,
          updatedAt: new Date(conv.updatedAt),
          messages: (conv.messages || []).map((msg: any) => ({
            ...msg,
            createdAt: new Date(msg.createdAt),
          })),
        }));
        setConversations(transformedData);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(
        `/api/conversations/${conversationId}/messages`
      );
      if (response.ok) {
        const data = await response.json();
        const transformedMessages = data.map((msg: any) => ({
          ...msg,
          createdAt: new Date(msg.createdAt),
        }));
        setMessages(transformedMessages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const updateConversationHeader = (conversationId: string) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (conversation && session?.user) {
      const otherParticipant = conversation.participants.find(
        (p) => p.user.id !== session.user.id
      );
      if (otherParticipant) {
        setConversationHeader({
          name: otherParticipant.user.name,
          email: otherParticipant.user.email,
        });
      }
    }
  };

  const handleCreateConversation = async () => {
    setIsCreating(true);
    try {
      const adminsResponse = await fetch("/api/conversations/admins");
      if (!adminsResponse.ok) {
        console.error("Failed to fetch admins");
        return;
      }
      
      const admins = await adminsResponse.json();
      if (admins.length === 0) {
        console.error("No admins available");
        return;
      }

      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantIds: [admins[0].id],
        }),
      });

      if (response.ok) {
        const conversation = await response.json();
        setSelectedConversationId(conversation.id);
        setIsNewChatOpen(false);
        fetchConversations();
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId) return;

    try {
      const { getSocket } = await import("@/lib/socket");
      const socket = await getSocket();
      
      socket.emit("message:send", {
        conversationId: selectedConversationId,
        content,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="h-full flex flex-col">
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
              <DialogTrigger asChild>
                <Button>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  New Chat with Admin
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Start New Conversation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p className="text-sm text-gray-600">
                    This will create a new conversation with the admin team.
                  </p>
                  <Button
                    onClick={handleCreateConversation}
                    disabled={isCreating}
                    className="w-full"
                  >
                    {isCreating ? "Creating..." : "Start Chat"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ChatShell
            chatList={
              <ChatList
                conversations={conversations}
                activeConversationId={selectedConversationId || undefined}
                onSelectConversation={setSelectedConversationId}
                currentUserId={session?.user?.id || ""}
              />
            }
            messagePane={
              <MessagePane
                messages={messages}
                currentUserId={session?.user?.id || ""}
                typingUsers={typingUsers}
              />
            }
            messageComposer={
              <MessageComposer 
                onSendMessage={handleSendMessage}
                conversationId={selectedConversationId || undefined}
                userName={session?.user?.name || undefined}
                userId={session?.user?.id || undefined}
              />
            }
            conversationHeader={conversationHeader || undefined}
          />
        </div>
      </div>
    </div>
  );
}
