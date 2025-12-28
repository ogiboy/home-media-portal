import { z } from "zod";

import {
  BOARD_AUTHOR_MAX,
  BOARD_AUTHOR_MIN,
  BOARD_BODY_MAX,
  BOARD_BODY_MIN,
} from "@/lib/constants/board";

// Validation schema for message board payloads.
export const boardMessageSchema = z.object({
  author: z.string().trim().min(BOARD_AUTHOR_MIN).max(BOARD_AUTHOR_MAX),
  body: z.string().trim().min(BOARD_BODY_MIN).max(BOARD_BODY_MAX),
});

// Inferred input type for board submissions.
export type BoardMessageInput = z.infer<typeof boardMessageSchema>;
