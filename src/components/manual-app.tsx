import { useEffect, useMemo, useRef, useState } from "react";
import { Link2, Menu, Printer, Search, X } from "lucide-react";
import { ChatDock } from "@/components/chat-dock";
import { NAV } from "@/lib/nav";
import { cn, foldVi } from "@/lib/utils";
import manualHtml from "@/content/manual.html?raw";

export function ManualApp() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("#bia");
  const [openNav, setOpenNav] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hits, setHits] = useState<string | null>(null);
  const articleRef = useRef<HTMLElement>(null);

  const html = useMemo(() => wrapTables(manualHtml), []);

  useEffect(() => {
    const root = articleRef.current;
    if (!root) return;
    const headings = [...root.querySelectorAll("h2[id], section[id], [id]")].filter((el) =>
      NAV.flatMap((g) => g.items).some((i) => i.href === `#${el.id}`),
    );
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting);
        if (!vis.length) return;
        setActive(`#${vis[0].target.id}`);
      },
      { rootMargin: "-18% 0px -70% 0px", threshold: 0.05 },
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "auto", block: "start" });
        setActive(hash);
      });
    }
  }, []);

  useEffect(() => {
    const root = articleRef.current;
    if (!root) return;
    root.querySelectorAll("mark.hit").forEach((m) => {
      const t = document.createTextNode(m.textContent || "");
      m.replaceWith(t);
    });
    const blocks = [...root.querySelectorAll("section, .card, table, h2, h3")];
    const raw = query.trim();
    if (!raw) {
      blocks.forEach((b) => b.classList.remove("hidden-by-search"));
      setHits(null);
      return;
    }
    const key = foldVi(raw);
    let n = 0;
    blocks.forEach((b) => {
      const t = foldVi(`${b.textContent || ""} ${b.getAttribute("data-search") || ""}`);
      const ok = t.includes(key);
      b.classList.toggle("hidden-by-search", !ok);
      if (ok) n += 1;
    });
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const texts: Text[] = [];
    while (walker.nextNode()) texts.push(walker.currentNode as Text);
    texts.forEach((node) => {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "MARK"].includes(parent.tagName)) return;
      if (parent.closest(".hidden-by-search")) return;
      const src = node.nodeValue || "";
      const i = foldVi(src).indexOf(key);
      if (i < 0) return;
      const before = src.slice(0, i);
      const mid = src.slice(i, i + raw.length);
      const after = src.slice(i + raw.length);
      const wrap = document.createElement("span");
      wrap.innerHTML = `${escapeHtml(before)}<mark class="hit">${escapeHtml(mid)}</mark>${escapeHtml(after)}`;
      parent.replaceChild(wrap, node);
    });
    setHits(n ? `Tìm thấy ${n} khối nội dung` : "Không có kết quả");
  }, [query]);

  async function share() {
    const url = `${window.location.origin}${window.location.pathname}${active}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Sao chép liên kết", url);
    }
  }

  function go(href: string) {
    setOpenNav(false);
    setActive(href);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", href);
  }

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="app-topbar sticky top-0 z-40 flex items-center gap-3 border-b border-navy/10 bg-navy px-3 py-2 text-white lg:hidden">
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-lg bg-white/8"
          aria-label="Mở mục lục"
          onClick={() => setOpenNav(true)}
        >
          <Menu className="size-5" />
        </button>
        <img src="/oliver-logo.png" alt="" className="h-8 rounded bg-white p-0.5" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">Oliver Vietnam</p>
          <p className="truncate text-[11px] uppercase tracking-wide text-gold">Quy trình vận hành</p>
        </div>
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-lg bg-white/8"
          onClick={share}
          aria-label="Chia sẻ"
        >
          <Link2 className="size-5" />
        </button>
      </header>

      <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside
          className={cn(
            "fixed inset-0 z-50 bg-navy text-white lg:sticky lg:top-0 lg:z-20 lg:flex lg:h-dvh lg:flex-col lg:overflow-y-auto",
            openNav ? "flex flex-col" : "hidden lg:flex",
          )}
        >
          <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-4">
            <img src="/oliver-logo.png" alt="Oliver" className="h-10 rounded-md bg-white p-1" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">Oliver Vietnam</p>
              <p className="text-[11px] uppercase tracking-wide text-gold">Quy trình vận hành</p>
            </div>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-lg lg:hidden"
              aria-label="Đóng mục lục"
              onClick={() => setOpenNav(false)}
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="px-3 pt-3">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gold" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm điều, quy trình, SLA…"
                className="w-full rounded-lg border-0 bg-search py-2.5 pl-9 pr-3 font-sans text-sm text-white outline-none ring-1 ring-gold/35 placeholder:text-white/45"
                autoComplete="off"
                suppressHydrationWarning
              />
            </label>
            <p className="mt-2 min-h-4 px-1 text-xs text-white/65">{hits}</p>
          </div>

          <nav className="flex-1 overflow-y-auto px-2 pb-8">
            {NAV.map((g) => (
              <div key={g.title}>
                <p className="mb-1 mt-3.5 px-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-gold">
                  {g.title}
                </p>
                {g.items.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => go(item.href)}
                    className={cn(
                      "mb-0.5 block w-full rounded-lg px-2.5 py-2 text-left text-[13px] text-[#d7e2ee]",
                      active === item.href && "bg-gold/16 font-medium text-white",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          <div className="no-print hidden gap-2 border-t border-white/10 p-3 lg:flex">
            <button
              type="button"
              onClick={share}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gold/15 px-3 py-2.5 text-sm font-medium text-gold"
            >
              <Link2 className="size-4" />
              {copied ? "Đã sao chép" : "Chia sẻ mục"}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex size-11 items-center justify-center rounded-lg bg-white/8"
              aria-label="In"
            >
              <Printer className="size-4" />
            </button>
          </div>
        </aside>

        <main className="min-w-0 px-4 py-5 sm:px-8 sm:py-7 lg:px-10 lg:py-8">
          <article
            ref={articleRef}
            id="content"
            className="doc-prose mx-auto max-w-[1100px]"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </main>
      </div>
      <ChatDock />
    </div>
  );
}

function wrapTables(html: string) {
  return html.replace(/<table[\s\S]*?<\/table>/g, (t) => `<div class="doc-table-wrap">${t}</div>`);
}

function escapeHtml(s: string) {
  const map: Record<string, string> = {
    "&": "&" + "amp;",
    "<": "&" + "lt;",
    ">": "&" + "gt;",
    '"': "&" + "quot;",
    "'": "&#39;",
  };
  return s.replace(/[&<>"']/g, (c) => map[c] ?? c);
}
