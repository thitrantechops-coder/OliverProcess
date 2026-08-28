import { foldVi } from "@/lib/utils";
import html from "@/content/manual.html?raw";

export type Chunk = { id: string; title: string; text: string };

const STOP = new Set(
  `la khong duoc trong cua va cho voi mot cac nay the nao bao lau co hay hoac toi ban ve hoi muc theo dung khi neu da se bi tai tren duoi tu den nhu hom homnay nay la gi sao ai minh chung ta ho
   cong thuc nau pho mon an thoi tiet
   lam viec ngay nguoi dung het rat ratla`.split(/\s+/).filter(Boolean),
);

const DOMAIN = new Set(
  `sla kpi p0 p1 p2 p3 pccc qr sop bqt cdt bqltn newton airy
   phi qlvh baohiem baotri luong thuong phat ticket checklist
   an ninh vesinh thangmay hoboi camera baixe
   nhathau thau phu letan kysu truongban
   khieunai suco khancap dientap
   hoadon congno khoanuoc kyquy noiquy
   cudan canho hoinghi
   cnch thoatnan baoduong
   dinhbien qa suco`.split(/\s+/).filter(Boolean),
);

function stripTags(s: string) {
  return s
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|tr|li|h\d|section|td|th)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(new RegExp("&" + "amp;", "gi"), "&")
    .replace(new RegExp("&" + "lt;", "gi"), "<")
    .replace(new RegExp("&" + "gt;", "gi"), ">")
    .replace(new RegExp("&" + "quot;", "gi"), '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function words(s: string) {
  return foldVi(s)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 0);
}

function keepTerm(t: string) {
  if (STOP.has(t)) return false;
  if (DOMAIN.has(t)) return true;
  if (/^p[0-3]$/.test(t)) return true;
  if (t.length >= 4) return true;
  if (/\d/.test(t) && t.length >= 2) return true;
  return false;
}

function termsOf(query: string) {
  const w = words(query);
  const t = w.filter(keepTerm);
  for (let i = 0; i < w.length - 1; i++) {
    const b = w[i] + w[i + 1];
    if (DOMAIN.has(b) || b.length >= 8) t.push(b);
  }
  const nums = query.match(/\d+%?/g) || [];
  for (const n of nums) {
    const x = foldVi(n);
    if (x.length >= 1) t.push(x);
  }
  return [...new Set(t)];
}

function buildChunks(): Chunk[] {
  const chunks: Chunk[] = [];
  const re = /<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi;
  const matches: { index: number; id: string; title: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const attrs = m[2] || "";
    const idMatch = attrs.match(/id=["']([^"']+)["']/);
    const title = stripTags(m[3] || "");
    const id = idMatch?.[1] || title.slice(0, 40);
    matches.push({ index: m.index, id, title });
  }
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : html.length;
    const text = stripTags(html.slice(start, end));
    if (text.length < 40) continue;
    chunks.push({ id: matches[i].id, title: matches[i].title, text: text.slice(0, 5000) });
  }
  return chunks;
}

const CHUNKS = buildChunks();

export function retrieveChunks(query: string, limit = 4) {
  const qWords = termsOf(query);
  const qFold = foldVi(query);
  const hasDomain = qWords.some((w) => DOMAIN.has(w) || /^p[0-3]$/.test(w) || w.includes("pccc"));
  const hasLong = qWords.some((w) => w.length >= 5);
  if (!qWords.length || (!hasDomain && !hasLong)) return [];

  const ranked = CHUNKS.map((c) => {
    const titleW = new Set(words(c.title));
    const bodyW = new Set(words(c.text));
    const hay = foldVi(`${c.title} ${c.text}`);
    let score = 0;
    let hit = 0;
    for (const t of qWords) {
      if (titleW.has(t)) {
        score += 8;
        hit += 1;
      } else if (bodyW.has(t)) {
        score += DOMAIN.has(t) || /^p[0-3]$/.test(t) ? 6 : 3;
        hit += 1;
      }
    }
    if (qFold.length > 8 && hay.includes(qFold)) score += 20;
    if (hit === 0) score = 0;
    return { c, score, hit };
  })
    .filter((x) => x.score >= 6 && x.hit >= 1)
    .sort((a, b) => b.score - a.score);

  const filtered = hasDomain
    ? ranked
    : ranked.filter((x) => qWords.some((w) => w.length >= 6 && words(x.c.title).includes(w)));

  return filtered.slice(0, limit);
}

function splitSentences(text: string) {
  return text
    .split(/\n+|(?<=[\.\!\?…;:])\s+/)
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter((s) => s.length >= 20 && s.length <= 480);
}

export function answerFromManual(query: string): string | null {
  const hits = retrieveChunks(query, 4);
  if (!hits.length) return null;
  const qWords = termsOf(query);
  const parts: string[] = [];
  for (const { c } of hits) {
    const sents = splitSentences(c.text)
      .map((s) => {
        const set = new Set(words(s));
        const n = qWords.reduce((acc, t) => acc + (set.has(t) ? 1 : 0), 0);
        return { s, n };
      })
      .filter((x) => x.n > 0)
      .sort((a, b) => b.n - a.n)
      .slice(0, 3)
      .map((x) => x.s);
    const body = sents.length ? sents.join(" ") : c.text.slice(0, 380);
    parts.push(`${c.title}\n${body}`);
    if (parts.join("").length > 1300) break;
  }
  return parts.join("\n\n");
}

export const REFUSAL =
  "Tôi chỉ trả lời nội dung trong bộ quy trình vận hành Oliver Process (tiêu chuẩn, SOP, SLA/KPI, thưởng phạt, PCCC, tài chính, nhà thầu phụ). Câu hỏi này không có trong tài liệu.";
