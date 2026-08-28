import { createServerFn } from "@tanstack/react-start";
import { answerFromManual, REFUSAL } from "@/lib/manual-retrieve";

export type ChatTurn = { role: "user" | "assistant"; content: string };

export const askOliver = createServerFn({ method: "POST" })
  .validator((input: { messages: ChatTurn[] }) => {
    const messages = Array.isArray(input?.messages) ? input.messages : [];
    const clean = messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-8)
      .map((m) => ({
        role: m.role,
        content: m.content.trim().slice(0, m.role === "user" ? 400 : 2000),
      }))
      .filter((m) => m.content.length > 0);
    if (!clean.length) throw new Error("empty");
    return { messages: clean };
  })
  .handler(async ({ data }) => {
    const lastUser = [...data.messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return { ok: false as const, error: "Thiếu câu hỏi." };

    const text = answerFromManual(lastUser.content);
    if (!text) return { ok: true as const, text: REFUSAL };
    return { ok: true as const, text };
  });
