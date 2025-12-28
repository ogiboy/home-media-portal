import { z } from "zod";

export const boardMessageSchema = z.object({
  author: z.string().trim().min(1).max(30),
  body: z.string().trim().min(1).max(280),
});

export type BoardMessageInput = z.infer<typeof boardMessageSchema>;
