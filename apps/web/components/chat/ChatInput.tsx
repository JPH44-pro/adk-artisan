"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send } from "lucide-react";
import { useChatState } from "@/contexts/ChatStateContext";

export function ChatInput() {
  // Get all state from main context hook
  const {
    session,
    isLoading,
    isWaitingForAgent,
    isInputBlocked,
    isMessageLimitReached,
    isSessionLimitReached,
    usageLoading,
    input,
    setInput,
    handleSubmit,
    handleKeyDown,
  } = useChatState();

  // Generate dynamic placeholder text based on state
  const getPlaceholder = (): string => {
    if (usageLoading || isLoading) return "Loading...";

    if (session) {
      return isMessageLimitReached
        ? "Message limit reached - upgrade to continue"
        : "Type your message here...";
    } else {
      return isSessionLimitReached
        ? "Session limit reached - upgrade to continue"
        : "Type your message here...";
    }
  };

  // Generate helper text based on current state
  const getHelperText = (): string => {
    if (isInputBlocked) {
      return session
        ? "Upgrade to Pro for unlimited messages and chat sessions"
        : "Upgrade to Pro for unlimited sessions and messages";
    }
    return "Press Enter to send, Shift+Enter for new line";
  };

  // Generate upgrade badge text based on state
  const getUpgradeBadgeText = (): { default: string; hover: string } => {
    return {
      default: session ? "Message limit reached" : "Session limit reached",
      hover: "Upgrade to Pro",
    };
  };

  const isSubmitDisabled =
    !input.trim() ||
    usageLoading ||
    isLoading ||
    isWaitingForAgent ||
    isInputBlocked;

  const badgeText = getUpgradeBadgeText();

  return (
    <Card className="p-3 sm:p-4 mb-3 sm:mb-2">
      <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
        {/* Input Row */}
        <div className="flex space-x-2 items-end">
          {/* Text Input */}
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder()}
            className="flex-1 min-h-[50px] sm:min-h-[60px] resize-none text-sm sm:text-base"
            disabled={
              usageLoading || isLoading || isWaitingForAgent || isInputBlocked
            }
          />

          {/* Submit Button */}
          <Button
            type="submit"
            size="icon"
            className="h-[50px] w-[50px] sm:h-[60px] sm:w-[60px]"
            disabled={isSubmitDisabled}
            title="Send message"
          >
            {usageLoading || isLoading || isWaitingForAgent ? (
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
            ) : (
              <Send className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </Button>
        </div>

        {/* Helper Text and Upgrade Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Helper Text */}
          <div className="text-xs text-muted-foreground leading-snug flex-1">
            {getHelperText()}
          </div>

          {/* Upgrade Badge (only shown when input is blocked) */}
          {isInputBlocked && (
            <UpgradeBadge
              defaultText={badgeText.default}
              hoverText={badgeText.hover}
            />
          )}
        </div>
      </form>
    </Card>
  );
}

/**
 * Upgrade badge component with hover state for premium upselling
 */
interface UpgradeBadgeProps {
  defaultText: string;
  hoverText: string;
}

function UpgradeBadge({ defaultText, hoverText }: UpgradeBadgeProps) {
  return (
    <Link
      href="/profile"
      aria-label="Upgrade to Pro"
      className="group shrink-0"
    >
      <Badge className="whitespace-nowrap opacity-50 transition-all duration-800 group-hover:opacity-100">
        <span className="group-hover:hidden">{defaultText}</span>
        <span className="hidden group-hover:inline">{hoverText}</span>
      </Badge>
    </Link>
  );
}
