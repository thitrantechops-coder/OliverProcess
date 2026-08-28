import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as foldVi, r as manual_default, t as cn } from "./manual-B0DIVLk4.mjs";
import { a as Printer, c as LoaderCircle, i as Search, l as Link2, o as MessageCircle, r as Send, s as Menu, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-kdIRC0x9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var askOliver = createServerFn({ method: "POST" }).validator((input) => {
	const clean = (Array.isArray(input?.messages) ? input.messages : []).filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string").slice(-8).map((m) => ({
		role: m.role,
		content: m.content.trim().slice(0, m.role === "user" ? 400 : 2e3)
	})).filter((m) => m.content.length > 0);
	if (!clean.length) throw new Error("empty");
	return { messages: clean };
}).handler(createSsrRpc("e1fb2f96d202716648e1a91e623c75552f0ee672ea63cb5bcdc249942db5d712"));
var SUGGESTIONS = [
	"SLA sự cố P0 xử lý trong bao lâu?",
	"Có được phạt tiền trên lương cứng không?",
	"Phí quản lý vận hành có gồm quỹ bảo trì 2% không?",
	"Nhà thầu phụ thiếu người bị phạt thế nào?"
];
function ChatDock() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [input, setInput] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [messages, setMessages] = (0, import_react.useState)([{
		role: "assistant",
		content: "Xin chào. Tôi chỉ trả lời nội dung trong bộ quy trình vận hành Oliver Process: tiêu chuẩn, SOP, SLA, KPI, thưởng phạt, PCCC, tài chính, nhà thầu phụ."
	}]);
	const bottomRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [
		messages,
		open,
		busy
	]);
	async function send(text) {
		const q = text.trim();
		if (!q || busy) return;
		if (messages.filter((m) => m.role === "user").length >= 12) {
			setError("Đã hết lượt hỏi trong phiên này. Tải lại trang để hỏi tiếp.");
			return;
		}
		setError(null);
		setInput("");
		const next = [...messages, {
			role: "user",
			content: q
		}];
		setMessages(next);
		setBusy(true);
		try {
			const res = await askOliver({ data: { messages: next.filter((m) => m.content) } });
			if (!res.ok) {
				setError(res.error);
				setMessages((m) => [...m, {
					role: "assistant",
					content: res.error
				}]);
			} else setMessages((m) => [...m, {
				role: "assistant",
				content: res.text
			}]);
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Không gửi được câu hỏi.";
			setError(msg);
			setMessages((m) => [...m, {
				role: "assistant",
				content: "Không gửi được câu hỏi. Thử lại."
			}]);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "no-print",
		children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("fixed z-40 flex flex-col overflow-hidden border border-line bg-surface shadow-doc", "inset-x-0 bottom-0 h-[min(78dvh,640px)] rounded-t-2xl", "sm:inset-auto sm:right-5 sm:bottom-5 sm:h-[min(72dvh,620px)] sm:w-[380px] sm:rounded-2xl"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 bg-navy px-3 py-2.5 text-white",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/oliver-logo.png",
							alt: "",
							className: "h-8 rounded bg-white p-0.5"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-semibold",
								children: "Oliver Vietnam"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-[11px] uppercase tracking-wide text-gold",
								children: "Quy trình vận hành"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "inline-flex size-11 items-center justify-center rounded-lg",
							"aria-label": "Đóng chat",
							onClick: () => setOpen(false),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-h-0 flex-1 space-y-3 overflow-y-auto bg-paper px-3 py-3",
					children: [
						messages.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("max-w-[92%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed", m.role === "user" ? "ml-auto bg-navy text-white" : "mr-auto border border-line bg-surface text-ink"),
							children: m.content
						}, i)),
						busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2 text-sm text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Đang tra cứu tài liệu…"]
						}) : null,
						messages.length < 3 && !busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: SUGGESTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => send(s),
								className: "rounded-full border border-line bg-surface px-3 py-2 text-left text-xs text-navy-2",
								children: s
							}, s))
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: bottomRef })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "border-t border-line bg-surface p-2",
					onSubmit: (e) => {
						e.preventDefault();
						send(input);
					},
					children: [error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-2 pb-1 text-xs text-danger",
						children: error
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: input,
							onChange: (e) => setInput(e.target.value),
							rows: 2,
							maxLength: 400,
							placeholder: "Hỏi về quy trình, SLA, thưởng phạt…",
							className: "max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-line bg-paper px-3 py-2 font-sans text-sm text-ink outline-none focus:ring-2 focus:ring-gold/50",
							onKeyDown: (e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									send(input);
								}
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: busy || !input.trim(),
							className: "inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy text-gold disabled:opacity-40",
							"aria-label": "Gửi",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
						})]
					})]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen(true),
			className: "fixed right-4 bottom-20 z-40 inline-flex items-center gap-2 rounded-full bg-navy px-4 py-3 text-sm font-semibold text-white shadow-doc sm:bottom-6",
			"aria-label": "Mở trợ lý",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-5 text-gold" }), "Hỏi trợ lý"]
		})
	});
}
var NAV = [
	{
		title: "Mở đầu",
		items: [
			{
				href: "#bia",
				label: "Trang bìa & hiệu lực"
			},
			{
				href: "#phap-ly",
				label: "Căn cứ pháp lý"
			},
			{
				href: "#nguyen-tac",
				label: "Nguyên tắc & phạm vi"
			}
		]
	},
	{
		title: "Tiêu chuẩn",
		items: [
			{
				href: "#tieu-chuan",
				label: "Hệ thống tiêu chuẩn Oliver"
			},
			{
				href: "#to-chuc",
				label: "Tổ chức & năng lực"
			},
			{
				href: "#cong-nghe",
				label: "Ứng dụng công nghệ"
			}
		]
	},
	{
		title: "Quy trình",
		items: [
			{
				href: "#ban-do",
				label: "Bản đồ quy trình"
			},
			{
				href: "#qt-hanh-chinh",
				label: "Pháp lý – hành chính"
			},
			{
				href: "#qt-nhansu",
				label: "Nhân sự"
			},
			{
				href: "#qt-cskh",
				label: "CSKH – lễ tân – cộng đồng"
			},
			{
				href: "#qt-anninh",
				label: "An ninh – ra vào – bãi xe"
			},
			{
				href: "#qt-kythuat",
				label: "Kỹ thuật – bảo trì – PCCC"
			},
			{
				href: "#qt-vesinh",
				label: "Vệ sinh – cảnh quan – tiện ích"
			},
			{
				href: "#qt-taichinh",
				label: "Tài chính – thu phí – báo cáo"
			},
			{
				href: "#qt-nhathau",
				label: "Nhà thầu phụ & thi công"
			}
		]
	},
	{
		title: "KPI & kỷ luật",
		items: [
			{
				href: "#sla",
				label: "SLA – KPI"
			},
			{
				href: "#thuong-phat-nv",
				label: "Thưởng phạt nhân sự"
			},
			{
				href: "#thuong-phat-thau",
				label: "Thưởng phạt nhà thầu phụ"
			},
			{
				href: "#phu-luc",
				label: "Phụ lục pháp lý"
			}
		]
	}
];
function ManualApp() {
	const [query, setQuery] = (0, import_react.useState)("");
	const [active, setActive] = (0, import_react.useState)("#bia");
	const [openNav, setOpenNav] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [hits, setHits] = (0, import_react.useState)(null);
	const articleRef = (0, import_react.useRef)(null);
	const html = (0, import_react.useMemo)(() => wrapTables(manual_default), []);
	(0, import_react.useEffect)(() => {
		const root = articleRef.current;
		if (!root) return;
		const headings = [...root.querySelectorAll("h2[id], section[id], [id]")].filter((el) => NAV.flatMap((g) => g.items).some((i) => i.href === `#${el.id}`));
		const io = new IntersectionObserver((entries) => {
			const vis = entries.filter((e) => e.isIntersecting);
			if (!vis.length) return;
			setActive(`#${vis[0].target.id}`);
		}, {
			rootMargin: "-18% 0px -70% 0px",
			threshold: .05
		});
		headings.forEach((h) => io.observe(h));
		return () => io.disconnect();
	}, []);
	(0, import_react.useEffect)(() => {
		const hash = window.location.hash;
		if (hash) requestAnimationFrame(() => {
			document.querySelector(hash)?.scrollIntoView({
				behavior: "auto",
				block: "start"
			});
			setActive(hash);
		});
	}, []);
	(0, import_react.useEffect)(() => {
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
			const ok = foldVi(`${b.textContent || ""} ${b.getAttribute("data-search") || ""}`).includes(key);
			b.classList.toggle("hidden-by-search", !ok);
			if (ok) n += 1;
		});
		const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
		const texts = [];
		while (walker.nextNode()) texts.push(walker.currentNode);
		texts.forEach((node) => {
			const parent = node.parentElement;
			if (!parent || [
				"SCRIPT",
				"STYLE",
				"MARK"
			].includes(parent.tagName)) return;
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
	function go(href) {
		setOpenNav(false);
		setActive(href);
		document.querySelector(href)?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
		history.replaceState(null, "", href);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "app-topbar sticky top-0 z-40 flex items-center gap-3 border-b border-navy/10 bg-navy px-3 py-2 text-white lg:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "inline-flex size-11 items-center justify-center rounded-lg bg-white/8",
						"aria-label": "Mở mục lục",
						onClick: () => setOpenNav(true),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/oliver-logo.png",
						alt: "",
						className: "h-8 rounded bg-white p-0.5"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-semibold",
							children: "Oliver Vietnam"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-[11px] uppercase tracking-wide text-gold",
							children: "Quy trình vận hành"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "inline-flex size-11 items-center justify-center rounded-lg bg-white/8",
						onClick: share,
						"aria-label": "Chia sẻ",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:grid lg:grid-cols-[280px_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: cn("fixed inset-0 z-50 bg-navy text-white lg:sticky lg:top-0 lg:z-20 lg:flex lg:h-dvh lg:flex-col lg:overflow-y-auto", openNav ? "flex flex-col" : "hidden lg:flex"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 border-b border-white/10 px-4 py-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/oliver-logo.png",
									alt: "Oliver",
									className: "h-10 rounded-md bg-white p-1"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-bold",
										children: "Oliver Vietnam"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] uppercase tracking-wide text-gold",
										children: "Quy trình vận hành"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "inline-flex size-11 items-center justify-center rounded-lg lg:hidden",
									"aria-label": "Đóng mục lục",
									onClick: () => setOpenNav(false),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-3 pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "relative block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: query,
									onChange: (e) => setQuery(e.target.value),
									placeholder: "Tìm điều, quy trình, SLA…",
									className: "w-full rounded-lg border-0 bg-search py-2.5 pl-9 pr-3 font-sans text-sm text-white outline-none ring-1 ring-gold/35 placeholder:text-white/45",
									autoComplete: "off",
									suppressHydrationWarning: true
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 min-h-4 px-1 text-xs text-white/65",
								children: hits
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "flex-1 overflow-y-auto px-2 pb-8",
							children: NAV.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-1 mt-3.5 px-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-gold",
								children: g.title
							}), g.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => go(item.href),
								className: cn("mb-0.5 block w-full rounded-lg px-2.5 py-2 text-left text-[13px] text-[#d7e2ee]", active === item.href && "bg-gold/16 font-medium text-white"),
								children: item.label
							}, item.href))] }, g.title))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "no-print hidden gap-2 border-t border-white/10 p-3 lg:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: share,
								className: "flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gold/15 px-3 py-2.5 text-sm font-medium text-gold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-4" }), copied ? "Đã sao chép" : "Chia sẻ mục"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => window.print(),
								className: "inline-flex size-11 items-center justify-center rounded-lg bg-white/8",
								"aria-label": "In",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" })
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "min-w-0 px-4 py-5 sm:px-8 sm:py-7 lg:px-10 lg:py-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
						ref: articleRef,
						id: "content",
						className: "doc-prose mx-auto max-w-[1100px]",
						dangerouslySetInnerHTML: { __html: html }
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatDock, {})
		]
	});
}
function wrapTables(html) {
	return html.replace(/<table[\s\S]*?<\/table>/g, (t) => `<div class="doc-table-wrap">${t}</div>`);
}
function escapeHtml(s) {
	const map = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	};
	return s.replace(/[&<>"']/g, (c) => map[c] ?? c);
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManualApp, {});
}
//#endregion
export { Home as component };
