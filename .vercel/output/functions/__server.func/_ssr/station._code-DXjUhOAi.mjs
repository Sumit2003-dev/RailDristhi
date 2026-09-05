import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { l as useTranslation } from "./rail-bkfOfZ1j.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as ArrowLeft, et as ArrowDownUp, z as Clock } from "../_libs/lucide-react.mjs";
import { d as SiteFooter, f as SiteHeader } from "./Sections-SSZ3XXHL.mjs";
import { t as Toaster$1 } from "./sonner-DoFKumIW.mjs";
import { a as fmtMinutes, f as trainRoutes, t as computeLiveStatus } from "./ssr.mjs";
import { t as useLiveClock } from "./useLiveClock-ZsXIJzCR.mjs";
import { n as EtaConfidenceBadge, t as DelayReasonTag } from "./DelayReasonTag-Dd8gd7rO.mjs";
import { t as Route } from "./station._code-C_L2Uiwe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/station._code-DXjUhOAi.js
var import_jsx_runtime = require_jsx_runtime();
function StationBoard() {
	const { code, name } = Route.useLoaderData();
	const { t } = useTranslation();
	const now = useLiveClock(4e3);
	const rows = trainRoutes.map((tr) => {
		const idx = tr.halts.findIndex((h) => h.code === code);
		if (idx === -1) return null;
		const status = now ? computeLiveStatus(tr, now) : null;
		const halt = tr.halts[idx];
		const isArrival = idx > 0;
		const isFirst = idx === 0;
		const isLast = idx === tr.halts.length - 1;
		return {
			t: tr,
			halt,
			status,
			type: isFirst ? "Departure" : isLast ? "Terminal" : isArrival ? "Arrival" : "Pass",
			scheduled: fmtMinutes(tr.startsAt + halt.arr)
		};
	}).filter((r) => r !== null).sort((a, b) => (a.status?.forecast?.etaMin ?? 0) - (b.status?.forecast?.etaMin ?? 0));
	const arrivals = rows.filter((r) => r.type === "Arrival" || r.type === "Terminal" || r.type === "Pass");
	const departures = rows.filter((r) => r.type === "Departure" || r.type === "Pass");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-5xl px-4 py-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }),
							" ",
							t("station.liveBoard")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-baseline gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-3xl font-bold",
								children: name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md border border-border bg-secondary/60 px-2.5 py-0.5 text-sm font-semibold text-muted-foreground",
								children: code
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: t("station.subtitle")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 grid gap-6 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoardTable, {
							title: t("station.arrivals"),
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownUp, { className: "size-4" }),
							rows: arrivals
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoardTable, {
							title: t("station.departures"),
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownUp, { className: "size-4" }),
							rows: departures
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})
		]
	});
}
function BoardTable({ title, icon, rows }) {
	const { t } = useTranslation();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "overflow-hidden rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 border-b border-border bg-subtle-gradient px-5 py-3",
			children: [
				icon,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "ml-auto size-4 text-muted-foreground" })
			]
		}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "px-5 py-8 text-center text-sm text-muted-foreground",
			children: t("station.noServices")
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-border",
			children: rows.map(({ t: tr, halt, status, type, scheduled }) => {
				const predicted = status?.haltStatus?.find((h) => h.halt.code === halt.code)?.forecast?.eta;
				const forecast = status?.haltStatus?.find((h) => h.halt.code === halt.code)?.forecast;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "px-5 py-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/train/$number",
						params: { number: tr.number },
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block text-sm font-semibold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: tr.number
								}),
								" ",
								tr.name
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full border border-border bg-secondary/50 px-1.5 py-0.5 text-[10px] font-semibold",
									children: type
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("station.platform", { p: halt.platform }) }),
								forecast && forecast.delayMin > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DelayReasonTag, { reason: forecast.reason })
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-sm font-semibold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground line-through",
										children: scheduled
									}),
									" →",
									" ",
									predicted ?? scheduled
								]
							}), forecast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EtaConfidenceBadge, {
								confidence: forecast.confidence,
								className: "mt-1"
							})]
						})]
					})
				}, tr.number);
			})
		})]
	});
}
//#endregion
export { StationBoard as component };
