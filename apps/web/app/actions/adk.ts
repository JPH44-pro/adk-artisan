"use server";

import { AdkSessionService } from "@/lib/adk/session-service";
import {
  recordUsageEvent,
  USAGE_EVENT_TYPES,
  checkMessageLimits,
  checkSessionLimits,
} from "@/lib/usage-tracking";
import { requireUserId } from "@/lib/auth";

/**
 * Server Action Result types for session creation with message
 */
export type CreateSessionWithMessageResult =
  | {
      success: true;
      sessionId: string;
      isNewSession: boolean;
    }
  | {
      success: false;
      error: string;
      limitType?: "messages" | "sessions";
    };

/**
 * Server Action to create a new ADK session and save the first user message
 * This replaces session creation in the API route for better Next.js architecture
 *
 * @param sessionId - Existing session ID (null for new session)
 * @param userMessage - The user's first message to send
 * @returns Promise<CreateSessionWithMessageResult> - Result with session ID or error
 */
export async function createSessionWithMessage(
  sessionId: string | null,
  userMessage: string
): Promise<CreateSessionWithMessageResult> {
  try {
    console.log("🚀 [ADK_ACTION] createSessionWithMessage called:", {
      hasSessionId: !!sessionId,
      messagePreview: userMessage.substring(0, 50),
    });

    // Get the current authenticated user
    const userId = await requireUserId();
    console.log("✅ [ADK_ACTION] User authenticated:", userId);

    // Validate input
    if (!userMessage.trim()) {
      return {
        success: false,
        error: "Message cannot be empty",
      };
    }

    // Check usage limits before proceeding
    try {
      // Check message limits first
      const messageLimitCheck = await checkMessageLimits(userId);
      if (!messageLimitCheck.canSendMessage) {
        console.log("🚫 [ADK_ACTION] Message limit reached for user:", userId);
        return {
          success: false,
          error:
            messageLimitCheck.reason ||
            "Message limit reached. Upgrade to Pro to send unlimited messages.",
          limitType: "messages",
        };
      }

      // Check session limits if creating a new session
      if (!sessionId) {
        const sessionLimitCheck = await checkSessionLimits(userId);
        if (!sessionLimitCheck.canCreateSession) {
          console.log(
            "🚫 [ADK_ACTION] Session limit reached for user:",
            userId
          );
          return {
            success: false,
            error:
              sessionLimitCheck.reason ||
              "Session limit reached. Upgrade to Pro to create unlimited sessions.",
            limitType: "sessions",
          };
        }
      }
    } catch (limitCheckError) {
      console.error(
        "⚠️ [ADK_ACTION] Error checking usage limits:",
        limitCheckError
      );
      // Continue with session creation if limit checks fail
    }

    let finalSessionId = sessionId;
    let isNewSession = false;

    // Create new session if none provided
    if (!finalSessionId) {
      console.log("🆕 [ADK_ACTION] Creating new ADK session...");

      try {
        const newSession = await AdkSessionService.createSession(userId);
        finalSessionId = newSession.id;
        isNewSession = true;

        console.log("✅ [ADK_ACTION] New session created:", finalSessionId);

        // Record session creation event for usage tracking
        try {
          await recordUsageEvent(USAGE_EVENT_TYPES.SESSION_CREATED);
          console.log("✅ [ADK_ACTION] Session creation usage event recorded");
        } catch (usageError) {
          console.error(
            "⚠️ [ADK_ACTION] Failed to record session creation usage:",
            usageError
          );
        }
      } catch (sessionError) {
        console.error("❌ [ADK_ACTION] Session creation failed:", sessionError);
        return {
          success: false,
          error: "Failed to create chat session",
        };
      }
    }

    // Record message usage event for every successful user message
    try {
      await recordUsageEvent(USAGE_EVENT_TYPES.MESSAGE_SENT);
      console.log("✅ [ADK_ACTION] Message usage event recorded");
    } catch (usageError) {
      console.error(
        "⚠️ [ADK_ACTION] Failed to record message usage:",
        usageError
      );
    }

    // Trigger message processing in the background (fire-and-forget)
    console.log(
      "🚀 [ADK_ACTION] Triggering message processing in background..."
    );
    triggerMessageProcessing(finalSessionId, userMessage, userId).catch(
      (error) => {
        console.error(
          "❌ [ADK_ACTION] Background message processing failed:",
          error
        );
      }
    );

    console.log("✅ [ADK_ACTION] Session with message created successfully:", {
      sessionId: finalSessionId,
      isNewSession,
    });

    return {
      success: true,
      sessionId: finalSessionId,
      isNewSession,
    };
  } catch (error) {
    console.error("❌ [ADK_ACTION] createSessionWithMessage failed:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create session with message",
    };
  }
}

/**
 * Clean unified message processing using abstracted handler
 *
 * This function now delegates to UnifiedRequestHandler which automatically
 * selects the appropriate backend handler (localhost or Agent Engine) based
 * on configuration and handles all endpoint-specific formatting.
 *
 * @param sessionId - The session ID to send message to
 * @param userMessage - The user message to process
 * @param userId - The authenticated user ID
 */
async function triggerMessageProcessing(
  sessionId: string,
  userMessage: string,
  userId: string
): Promise<void> {
  console.log("📡 [ADK_ACTION] Triggering unified agent processing:", {
    sessionId,
    messagePreview: userMessage.substring(0, 50),
    userId,
  });

  const { UnifiedRequestHandler } = await import("@/lib/adk/request-handler");
  const requestHandler = new UnifiedRequestHandler();

  const result = await requestHandler.processAgentRequest(
    sessionId,
    userMessage,
    userId
  );

  if (!result.success) {
    console.error("❌ [ADK_ACTION] Agent processing failed:", result.error);
    throw new Error(result.error || "Failed to trigger message processing");
  }

  console.log("✅ [ADK_ACTION] Agent processing initiated successfully");
}
