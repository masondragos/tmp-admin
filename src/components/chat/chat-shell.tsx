"use client";

import { ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatShellProps {
  chatList: ReactNode;
  messagePane: ReactNode;
  messageComposer: ReactNode;
  conversationHeader?: {
    name: string;
    email?: string;
    status?: string;
  };
}

export function ChatShell({
  chatList,
  messagePane,
  messageComposer,
  conversationHeader,
}: ChatShellProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex h-full bg-gray-50">
      <div className="w-80 flex-shrink-0">{chatList}</div>

      <div className="flex-1 flex flex-col">
        {conversationHeader ? (
          <>
            <div className="bg-white border-b p-4 flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  {getInitials(conversationHeader.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{conversationHeader.name}</p>
                {conversationHeader.email && (
                  <p className="text-sm text-gray-500">
                    {conversationHeader.email}
                  </p>
                )}
              </div>
              {conversationHeader.status && (
                <div className="ml-auto">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {conversationHeader.status}
                  </span>
                </div>
              )}
            </div>
            {messagePane}
            {messageComposer}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
