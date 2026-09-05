import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { l as useTranslation } from "./rail-bkfOfZ1j.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Gauge, J as Calendar, Q as ArrowRight, U as CircleCheck, a as TrainFront, c as Sparkles, p as Search, z as Clock } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as SiteFooter, f as SiteHeader, n as Button } from "./Sections-SSZ3XXHL.mjs";
import { t as Input } from "./input-BaHNVncY.mjs";
import { t as Toaster$1 } from "./sonner-DoFKumIW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pnr-dhZfd8C8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SAMPLE_PNRS = [
	"8421950247",
	"4920194821",
	"6730192845",
	"9120485721"
];
function PnrStatusPage() {
	const { t } = useTranslation();
	const [pnrInput, setPnrInput] = (0, import_react.useState)("8421950247");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const fetchPnr = async (pnrToFetch) => {
		const cleaned = pnrToFetch.replace(/\D/g, "");
		if (cleaned.length !== 10) {
			toast.error(t("pnr.invalidPnr"));
			return;
		}
		setLoading(true);
		try {
			const data = await (await fetch(`/api/v1/pnr/${cleaned}`)).json();
			if (data.error || !data.data) {
				toast.error(data.message || t("pnr.pnrNotFound"));
				setResult(null);
			} else {
				setResult(data.data);
				toast.success(t("pnr.pnrSuccess", { pnr: cleaned }));
			}
		} catch {
			toast.error(t("pnr.pnrNotFound"));
		} finally {
			setLoading(false);
		}
	};
	const handleSearch = (e) => {
		e.preventDefault();
		fetchPnr(pnrInput);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-4xl px-4 py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-primary",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }),
									" ",
									t("pnr.badge")
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-3 text-3xl font-bold tracking-tight sm:text-4xl",
								children: t("pnr.title")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: t("pnr.subtitle")
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSearch,
						className: "mt-8 mx-auto max-w-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex items-center rounded-2xl border border-border bg-card p-2 shadow-float",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: pnrInput,
								onChange: (e) => setPnrInput(e.target.value),
								maxLength: 10,
								placeholder: t("pnr.placeholder"),
								className: "h-12 border-0 bg-transparent px-4 font-mono text-base tracking-wider shadow-none focus-visible:ring-0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								disabled: loading,
								className: "h-12 rounded-xl px-6 font-semibold gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" }),
									" ",
									loading ? t("pnr.checking") : t("pnr.checkButton")
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("pnr.samplePnrs") }), SAMPLE_PNRS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setPnrInput(p);
									fetchPnr(p);
								},
								className: "rounded-md border border-border bg-secondary/60 px-2 py-1 font-mono hover:bg-secondary hover:text-foreground",
								children: p
							}, p))]
						})]
					}),
					result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 space-y-6 animate-in fade-in duration-300",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "overflow-hidden rounded-3xl border border-border bg-card shadow-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-4 border-b border-border bg-subtle-gradient p-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-xs font-semibold text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainFront, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("pnr.trainDetails") })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
											className: "mt-1 text-2xl font-bold",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: result.trainNumber
												}),
												" ",
												result.trainName
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground mt-0.5",
											children: [
												t("pnr.class"),
												":",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-foreground",
													children: result.bookingClass
												}),
												" ·",
												" ",
												t("pnr.quota"),
												":",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-foreground",
													children: result.quota
												})
											]
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1.5 rounded-full bg-rail-live/15 px-3 py-1 text-xs font-semibold text-rail-live",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }),
												" ",
												result.chartStatus
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-xs text-muted-foreground",
											children: ["PNR: ", result.pnr]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-6 border-b border-border p-6 sm:grid-cols-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-muted-foreground",
											children: t("pnr.from")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-lg font-bold",
											children: [
												result.fromStation.name,
												" (",
												result.fromStation.code,
												")"
											]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col items-center justify-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs font-semibold text-muted-foreground flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3.5" }),
													" ",
													result.journeyDate
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-1 flex w-full items-center gap-2 text-muted-foreground",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 text-primary" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-semibold text-muted-foreground",
												children: t("pnr.destination")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-1 text-lg font-bold",
												children: [
													result.toStation.name,
													" (",
													result.toStation.code,
													")"
												]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-sm font-bold text-foreground",
										children: t("pnr.passengerDetails")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border",
										children: result.passengers.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center justify-between gap-4 bg-card px-5 py-4 hover:bg-secondary/30 transition-colors",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary",
													children: ["#", p.number]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm font-semibold",
													children: t("pnr.passengerNum", { num: p.number })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-muted-foreground",
													children: [
														t("pnr.booking"),
														": ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-mono",
															children: p.bookingStatus
														})
													]
												})] })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center gap-4 text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "inline-block rounded-md bg-rail-live/15 px-2.5 py-0.5 text-xs font-bold text-rail-live",
													children: p.currentStatus
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-1 text-xs text-muted-foreground",
													children: [
														t("pnr.coach"),
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-semibold text-foreground",
															children: p.coach
														}),
														" ·",
														" ",
														t("pnr.berth"),
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-semibold text-foreground",
															children: p.berth
														}),
														" (",
														p.berthType,
														")"
													]
												})] })
											})]
										}, p.number))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-4 border-t border-border bg-secondary/40 px-6 py-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-4 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1.5 text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "size-3.5" }),
												" ",
												t("train.speed"),
												": ",
												result.liveStatus.speed,
												" ",
												"km/h"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1.5 text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5" }),
												" ",
												t("train.nextHalt"),
												":",
												" ",
												result.liveStatus.nextStation,
												" (ETA ",
												result.liveStatus.eta,
												")"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/train/$number",
										params: { number: result.trainNumber },
										className: "inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline",
										children: [
											t("pnr.trackOnMap"),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5" })
										]
									})]
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})
		]
	});
}
//#endregion
export { PnrStatusPage as component };
