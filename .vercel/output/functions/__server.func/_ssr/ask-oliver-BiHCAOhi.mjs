import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { n as foldVi, r as manual_default } from "./manual-B0DIVLk4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ask-oliver-BiHCAOhi.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var STOP = new Set(`la khong duoc trong cua va cho voi mot cac nay the nao bao lau co hay hoac toi ban ve hoi muc theo dung khi neu da se bi tai tren duoi tu den nhu hom homnay nay la gi sao ai minh chung ta ho
   cong thuc nau pho mon an thoi tiet
   lam viec ngay nguoi dung het rat ratla`.split(/\s+/).filter(Boolean));
var DOMAIN = new Set(`sla kpi p0 p1 p2 p3 pccc qr sop bqt cdt bqltn newton airy
   phi qlvh baohiem baotri luong thuong phat ticket checklist
   an ninh vesinh thangmay hoboi camera baixe
   nhathau thau phu letan kysu truongban
   khieunai suco khancap dientap
   hoadon congno khoanuoc kyquy noiquy
   cudan canho hoinghi
   cnch thoatnan baoduong
   dinhbien qa suco`.split(/\s+/).filter(Boolean));
function stripTags(s) {
	return s.replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|tr|li|h\d|section|td|th)>/gi, "\n").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/* @__PURE__ */ new RegExp("&amp;", "gi"), "&").replace(/* @__PURE__ */ new RegExp("&lt;", "gi"), "<").replace(/* @__PURE__ */ new RegExp("&gt;", "gi"), ">").replace(/* @__PURE__ */ new RegExp("&quot;", "gi"), "\"").replace(/&#39;/g, "'").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
}
function words(s) {
	return foldVi(s).split(/[^a-z0-9]+/).filter((t) => t.length > 0);
}
function keepTerm(t) {
	if (STOP.has(t)) return false;
	if (DOMAIN.has(t)) return true;
	if (/^p[0-3]$/.test(t)) return true;
	if (t.length >= 4) return true;
	if (/\d/.test(t) && t.length >= 2) return true;
	return false;
}
function termsOf(query) {
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
function buildChunks() {
	const chunks = [];
	const re = /<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi;
	const matches = [];
	let m;
	while (m = re.exec(manual_default)) {
		const idMatch = (m[2] || "").match(/id=["']([^"']+)["']/);
		const title = stripTags(m[3] || "");
		const id = idMatch?.[1] || title.slice(0, 40);
		matches.push({
			index: m.index,
			id,
			title
		});
	}
	for (let i = 0; i < matches.length; i++) {
		const start = matches[i].index;
		const end = i + 1 < matches.length ? matches[i + 1].index : manual_default.length;
		const text = stripTags(manual_default.slice(start, end));
		if (text.length < 40) continue;
		chunks.push({
			id: matches[i].id,
			title: matches[i].title,
			text: text.slice(0, 5e3)
		});
	}
	return chunks;
}
var CHUNKS = buildChunks();
function retrieveChunks(query, limit = 4) {
	const qWords = termsOf(query);
	const qFold = foldVi(query);
	const hasDomain = qWords.some((w) => DOMAIN.has(w) || /^p[0-3]$/.test(w) || w.includes("pccc"));
	const hasLong = qWords.some((w) => w.length >= 5);
	if (!qWords.length || !hasDomain && !hasLong) return [];
	const ranked = CHUNKS.map((c) => {
		const titleW = new Set(words(c.title));
		const bodyW = new Set(words(c.text));
		const hay = foldVi(`${c.title} ${c.text}`);
		let score = 0;
		let hit = 0;
		for (const t of qWords) if (titleW.has(t)) {
			score += 8;
			hit += 1;
		} else if (bodyW.has(t)) {
			score += DOMAIN.has(t) || /^p[0-3]$/.test(t) ? 6 : 3;
			hit += 1;
		}
		if (qFold.length > 8 && hay.includes(qFold)) score += 20;
		if (hit === 0) score = 0;
		return {
			c,
			score,
			hit
		};
	}).filter((x) => x.score >= 6 && x.hit >= 1).sort((a, b) => b.score - a.score);
	return (hasDomain ? ranked : ranked.filter((x) => qWords.some((w) => w.length >= 6 && words(x.c.title).includes(w)))).slice(0, limit);
}
function splitSentences(text) {
	return text.split(/\n+|(?<=[\.\!\?…;:])\s+/).map((s) => s.replace(/\s+/g, " ").trim()).filter((s) => s.length >= 20 && s.length <= 480);
}
function answerFromManual(query) {
	const hits = retrieveChunks(query, 4);
	if (!hits.length) return null;
	const qWords = termsOf(query);
	const parts = [];
	for (const { c } of hits) {
		const sents = splitSentences(c.text).map((s) => {
			const set = new Set(words(s));
			return {
				s,
				n: qWords.reduce((acc, t) => acc + (set.has(t) ? 1 : 0), 0)
			};
		}).filter((x) => x.n > 0).sort((a, b) => b.n - a.n).slice(0, 3).map((x) => x.s);
		const body = sents.length ? sents.join(" ") : c.text.slice(0, 380);
		parts.push(`${c.title}\n${body}`);
		if (parts.join("").length > 1300) break;
	}
	return parts.join("\n\n");
}
var REFUSAL = "Tôi chỉ trả lời nội dung trong bộ quy trình vận hành Oliver Process (tiêu chuẩn, SOP, SLA/KPI, thưởng phạt, PCCC, tài chính, nhà thầu phụ). Câu hỏi này không có trong tài liệu.";
var askOliver_createServerFn_handler = createServerRpc({
	id: "e1fb2f96d202716648e1a91e623c75552f0ee672ea63cb5bcdc249942db5d712",
	name: "askOliver",
	filename: "src/lib/ask-oliver.ts"
}, (opts) => askOliver.__executeServer(opts));
var askOliver = createServerFn({ method: "POST" }).validator((input) => {
	const clean = (Array.isArray(input?.messages) ? input.messages : []).filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string").slice(-8).map((m) => ({
		role: m.role,
		content: m.content.trim().slice(0, m.role === "user" ? 400 : 2e3)
	})).filter((m) => m.content.length > 0);
	if (!clean.length) throw new Error("empty");
	return { messages: clean };
}).handler(askOliver_createServerFn_handler, async ({ data }) => {
	const lastUser = [...data.messages].reverse().find((m) => m.role === "user");
	if (!lastUser) return {
		ok: false,
		error: "Thiếu câu hỏi."
	};
	const text = answerFromManual(lastUser.content);
	if (!text) return {
		ok: true,
		text: REFUSAL
	};
	return {
		ok: true,
		text
	};
});
//#endregion
export { askOliver_createServerFn_handler };
