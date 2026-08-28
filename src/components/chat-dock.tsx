import { useEffect, useRef, useState } from "react";
import { Loader2, MessageCircle, Send, X } from "lucide-react";
import { askOliver, type ChatTurn } from "@/lib/ask-oliver";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "SLA sự cố P0 xử lý trong bao lâu?",
  "Có được phạt tiền trên lương cứng không?",
  "Phí quản lý vận hành có gồm quỹ bảo trì 2% không?",
  "Nhà thầu phụ thiếu người bị phạt thế nào?",
];

type Msg = ChatTurn;

export function ChatDock() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Xin chào. Tôi chỉ trả lời nội dung trong bộ quy trình vận hành Oliver Process: tiêu chuẩn, SOP, SLA, KPI, thưởng phạt, PCCC, tài chính, nhà thầu phụ.",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, busy]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    if (messages.filter((m) => m.role === "user").length >= 12) {
      setError("Đã hết lượt hỏi trong phiên này. Tải lại trang để hỏi tiếp.");
      return;
    }
    setError(null);
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: q }];
    setMessages(next);
    setBusy(true);
    try {
      const res = await askOliver({ data: { messages: next.filter((m) => m.content) } });
      if (!res.ok) {
        setError(res.error);
        setMessages((m) => [...m, { role: "assistant", content: res.error }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: res.text }]);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Không gửi được câu hỏi.";
      setError(msg);
      setMessages((m) => [...m, { role: "assistant", content: "Không gửi được câu hỏi. Thử lại." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="no-print">
      {open ? (
        <div
          className={cn(
            "fixed z-40 flex flex-col overflow-hidden border border-line bg-surface shadow-doc",
            "inset-x-0 bottom-0 h-[min(78dvh,640px)] rounded-t-2xl",
            "sm:inset-auto sm:right-5 sm:bottom-5 sm:h-[min(72dvh,620px)] sm:w-[380px] sm:rounded-2xl",
          )}
        >
          <div className="flex items-center gap-2 bg-navy px-3 py-2.5 text-white">
            <img src="/oliver-logo.png" alt="" className="h-8 rounded bg-white p-0.5" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Oliver Vietnam</p>
              <p className="truncate text-[11px] uppercase tracking-wide text-gold">Quy trình vận hành</p>
            </div>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-lg"
              aria-label="Đóng chat"
              onClick={() => setOpen(false)}
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-paper px-3 py-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[92%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-navy text-white"
                    : "mr-auto border border-line bg-surface text-ink",
                )}
              >
                {m.content}
              </div>
            ))}
            {busy ? (
              <p className="flex items-center gap-2 text-sm text-muted">
                <Loader2 className="size-4 animate-spin" />
                Đang tra cứu tài liệu…
              </p>
            ) : null}
            {messages.length < 3 && !busy ? (
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-line bg-surface px-3 py-2 text-left text-xs text-navy-2"
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>

          <form
            className="border-t border-line bg-surface p-2"
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            {error ? <p className="px-2 pb-1 text-xs text-danger">{error}</p> : null}
            <div className="flex items-end gap-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={2}
                maxLength={400}
                placeholder="Hỏi về quy trình, SLA, thưởng phạt…"
                className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-line bg-paper px-3 py-2 font-sans text-sm text-ink outline-none focus:ring-2 focus:ring-gold/50"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send(input);
                  }
                }}
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy text-gold disabled:opacity-40"
                aria-label="Gửi"
              >
                <Send className="size-4" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed right-4 bottom-20 z-40 inline-flex items-center gap-2 rounded-full bg-navy px-4 py-3 text-sm font-semibold text-white shadow-doc sm:bottom-6"
          aria-label="Mở trợ lý"
        >
          <MessageCircle className="size-5 text-gold" />
          Hỏi trợ lý
        </button>
      )}
    </div>
  );
}
