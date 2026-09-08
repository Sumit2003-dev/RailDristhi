import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { h as useTranslation, r as Button } from "./rail-BA0H0A_E.mjs";
import { t as Input } from "./input-_99zOX8c.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as MapPin, F as Gauge, G as Clock, I as Funnel, L as FileText, S as Radar, U as CodeXml, Z as ChevronRight, at as ArrowUpDown, g as Search, k as LayoutList, lt as Armchair, ot as ArrowRight, s as TrainFront } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as SiteHeader, f as Stations, i as Networks, n as Faq, r as Features, t as ApiBanner, u as SiteFooter } from "./Sections-DOjZPygy.mjs";
import { t as Toaster$1 } from "./sonner-DoFKumIW.mjs";
import { a as fmtMinutes, d as findTrains, i as delayTone, o as getHaltPlatform, p as trainRoutes, r as delayLabel, t as computeLiveStatus, u as stationMap } from "./ssr.mjs";
import { t as useLiveClock } from "./useLiveClock-ZsXIJzCR.mjs";
import { n as EtaConfidenceBadge, t as DelayReasonTag } from "./DelayReasonTag-BotOkrrT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Drx1lhoB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SearchPanel() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const now = useLiveClock(5e3);
	const [from, setFrom] = (0, import_react.useState)("");
	const [to, setTo] = (0, import_react.useState)("");
	const [train, setTrain] = (0, import_react.useState)("");
	const [focusedInput, setFocusedInput] = (0, import_react.useState)(null);
	const trainSuggestions = (0, import_react.useMemo)(() => train.trim() ? findTrains(train).slice(0, 5) : [], [train]);
	const fromSuggestions = (0, import_react.useMemo)(() => {
		const q = from.trim().toUpperCase();
		if (!q || q.length < 1) return [];
		return Object.entries(stationMap).filter(([code, info]) => code.includes(q) || info.name.toUpperCase().includes(q)).slice(0, 4);
	}, [from]);
	const toSuggestions = (0, import_react.useMemo)(() => {
		const q = to.trim().toUpperCase();
		if (!q || q.length < 1) return [];
		return Object.entries(stationMap).filter(([code, info]) => code.includes(q) || info.name.toUpperCase().includes(q)).slice(0, 4);
	}, [to]);
	const between = (0, import_react.useMemo)(() => {
		const f = from.trim().toLowerCase();
		const t = to.trim().toLowerCase();
		if (!f || !t) return [];
		return trainRoutes.map((r) => {
			const fi = r.halts.findIndex((s) => s.code.toLowerCase() === f || s.name.toLowerCase().includes(f));
			const ti = r.halts.findIndex((s) => s.code.toLowerCase() === t || s.name.toLowerCase().includes(t));
			if (fi === -1 || ti === -1 || fi >= ti) return null;
			const fromHalt = r.halts[fi];
			const toHalt = r.halts[ti];
			const depMinutes = r.startsAt + fromHalt.dep;
			const arrMinutes = r.startsAt + toHalt.arr;
			const durationMin = Math.max(1, toHalt.arr - fromHalt.dep);
			const hours = Math.floor(durationMin / 60);
			const mins = durationMin % 60;
			const durationStr = `${hours}h ${mins > 0 ? `${mins}m` : ""}`.trim();
			const distanceKm = Math.max(0, toHalt.km - fromHalt.km);
			const platform = getHaltPlatform(r.number, fromHalt.code, fromHalt.platform);
			const live = now ? computeLiveStatus(r, now) : null;
			const delay = live?.forecast?.delayMin ?? live?.delay ?? 0;
			return {
				route: r,
				fromHalt,
				toHalt,
				depTime: fmtMinutes(depMinutes),
				arrTime: fmtMinutes(arrMinutes),
				durationStr,
				distanceKm,
				platform,
				live,
				delay
			};
		}).filter((item) => item !== null);
	}, [
		from,
		to,
		now
	]);
	const [showBetween, setShowBetween] = (0, import_react.useState)(false);
	const swap = () => {
		setFrom(to);
		setTo(from);
	};
	const handleSearchBetween = () => {
		if (!from.trim() || !to.trim()) {
			toast.error(t("search.enterBothStations"));
			return;
		}
		setShowBetween(true);
	};
	const track = () => {
		const match = findTrains(train)[0];
		if (!match) {
			toast.error(t("search.noTrainMatch"));
			return;
		}
		navigate({
			to: "/train/$number",
			params: { number: match.number }
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-2xl border border-border bg-card shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 border-b border-border bg-subtle-gradient px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: t("search.liveTrainStatus")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "flex items-center gap-2",
						onSubmit: (e) => {
							e.preventDefault();
							track();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: train,
							onChange: (e) => setTrain(e.target.value),
							placeholder: t("search.trainPlaceholder"),
							className: "h-11"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "icon",
							className: "size-11 shrink-0 rounded-xl",
							"aria-label": t("search.trackTrain"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" })
						})]
					}), trainSuggestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 space-y-1",
						children: trainSuggestions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/train/$number",
							params: { number: s.number },
							className: "flex items-center justify-between rounded-lg px-2 py-2 text-sm transition-colors hover:bg-secondary/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground font-mono",
									children: s.number
								}),
								" ",
								s.name
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-muted-foreground" })]
						}) }, s.number))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: "between",
				className: "overflow-hidden rounded-2xl border border-border bg-card shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 border-b border-border bg-subtle-gradient px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: t("search.trainsBetween")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "relative space-y-2 p-4",
					onSubmit: (e) => {
						e.preventDefault();
						handleSearchBetween();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-8 top-11 h-8 w-px bg-border" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full ring-3 ring-accent/30 bg-accent shrink-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: from,
										onChange: (e) => {
											setFrom(e.target.value);
											setShowBetween(false);
										},
										onFocus: () => setFocusedInput("from"),
										onBlur: () => setTimeout(() => setFocusedInput(null), 200),
										placeholder: t("search.fromStation"),
										className: "h-11 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "outline",
										size: "icon",
										"aria-label": t("search.swapStations"),
										className: "rounded-full shrink-0",
										onClick: swap,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "size-4" })
									})
								]
							}), focusedInput === "from" && fromSuggestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "absolute top-full left-6 right-0 z-20 mt-1 rounded-xl border border-border bg-card p-1 shadow-float",
								children: fromSuggestions.map(([code, info]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onMouseDown: () => {
										setFrom(code);
										setFocusedInput(null);
									},
									className: "flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-xs hover:bg-secondary cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: info.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-muted-foreground",
										children: [
											"(",
											code,
											")"
										]
									})]
								}) }, code))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full ring-3 ring-primary/25 bg-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: to,
									onChange: (e) => {
										setTo(e.target.value);
										setShowBetween(false);
									},
									onFocus: () => setFocusedInput("to"),
									onBlur: () => setTimeout(() => setFocusedInput(null), 200),
									placeholder: t("search.toStation"),
									className: "h-11 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
								})]
							}), focusedInput === "to" && toSuggestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "absolute top-full left-6 right-0 z-20 mt-1 rounded-xl border border-border bg-card p-1 shadow-float",
								children: toSuggestions.map(([code, info]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onMouseDown: () => {
										setTo(code);
										setFocusedInput(null);
									},
									className: "flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-xs hover:bg-secondary cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: info.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-muted-foreground",
										children: [
											"(",
											code,
											")"
										]
									})]
								}) }, code))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							className: "mt-2 h-12 w-full rounded-xl text-base font-semibold cursor-pointer",
							children: [
								t("search.viewTrains"),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })
							]
						}),
						showBetween && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 space-y-2 border-t border-border pt-3",
							children: [between.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "px-2 py-3 text-center text-xs text-muted-foreground",
								children: t("search.noDirectService")
							}), between.map(({ route: r, fromHalt, toHalt, depTime, arrTime, durationStr, distanceKm, platform, live, delay }) => {
								const isRunning = live?.state === "running" || live?.state === "halted";
								const isDelayed = delay > 5;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/train/$number",
									params: { number: r.number },
									className: "group flex flex-col gap-2 rounded-xl border border-border bg-card p-3 text-sm shadow-xs transition-all hover:border-primary/50 hover:bg-secondary/40 hover:shadow-card cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2 border-b border-border/60 pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainFront, { className: "size-3.5" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "truncate",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-bold text-foreground group-hover:text-primary transition-colors",
														children: r.name
													}),
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-mono text-xs text-muted-foreground",
														children: [
															"(",
															r.number,
															")"
														]
													})
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 shrink-0",
											children: [isRunning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${isDelayed ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-1.5 rounded-full ${isDelayed ? "bg-amber-500" : "bg-emerald-500"} animate-pulse` }), isDelayed ? `+${Math.round(delay)}m` : "On Time"]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground",
												children: r.type.toUpperCase()
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs pt-0.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-0.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-bold font-mono text-foreground text-sm",
														children: depTime
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "rounded-sm bg-primary/10 px-1 py-0.2 text-[9px] font-bold text-primary font-mono",
														children: ["PF ", platform]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold text-[11px] text-muted-foreground",
													children: fromHalt.code
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-col items-center px-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[10px] font-semibold text-muted-foreground flex items-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-2.5" }), durationStr]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "relative flex items-center justify-center w-20 sm:w-28 my-0.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px w-full bg-border" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "absolute right-0 size-3 text-muted-foreground" })]
													}),
													distanceKm > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[9px] text-muted-foreground font-mono",
														children: [distanceKm, " km"]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-0.5 text-right",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold font-mono text-foreground text-sm",
													children: arrTime
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold text-[11px] text-muted-foreground",
													children: toHalt.code
												})]
											})
										]
									})]
								}) }, r.number);
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/network",
				className: "flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-card transition-colors hover:bg-secondary/40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-10 items-center justify-center rounded-xl bg-hero-gradient text-primary-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: t("search.liveNetworkMap")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: t("search.liveNetworkMapSub")
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 text-sm font-medium text-primary",
					children: [
						t("search.open"),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-2xl border border-border bg-card shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "border-b border-border bg-subtle-gradient px-4 py-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase",
					children: t("search.quickServices")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "divide-y divide-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/pnr",
							className: "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary/60 cursor-pointer",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex size-9 items-center justify-center rounded-lg bg-secondary text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-sm font-semibold",
										children: t("search.pnrTitle")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs text-muted-foreground",
										children: t("search.pnrSub")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-muted-foreground" })
							]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/connecting-impact",
							className: "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary/60 cursor-pointer",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex size-9 items-center justify-center rounded-lg bg-secondary text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Armchair, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-sm font-semibold",
										children: t("search.connectingTitle")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs text-muted-foreground",
										children: t("search.connectingSub")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-muted-foreground" })
							]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/station/$code",
							params: { code: "NDLS" },
							className: "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary/60 cursor-pointer",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex size-9 items-center justify-center rounded-lg bg-secondary text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutList, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-sm font-semibold",
										children: t("search.stationBoardTitle")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs text-muted-foreground",
										children: t("search.stationBoardSub")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-muted-foreground" })
							]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/developer",
							className: "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary/60 cursor-pointer",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex size-9 items-center justify-center rounded-lg bg-secondary text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeXml, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-sm font-semibold",
										children: t("search.developerApiTitle")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs text-muted-foreground",
										children: t("search.developerApiSub")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-muted-foreground" })
							]
						}) })
					]
				})]
			})
		]
	});
}
function LiveTrainList() {
	const { t } = useTranslation();
	const now = useLiveClock(5e3);
	const [activeTab, setActiveTab] = (0, import_react.useState)("all");
	const trainsWithStatus = trainRoutes.map((tr) => {
		const status = now ? computeLiveStatus(tr, now) : null;
		const dest = tr.halts[tr.halts.length - 1];
		const delay = status?.forecast?.delayMin ?? status?.delay ?? 0;
		return {
			t: tr,
			status,
			dest,
			delay,
			isHalted: status?.state === "halted",
			isOnTime: delay <= 2,
			isDelayed: delay > 2
		};
	});
	const filteredTrains = trainsWithStatus.filter(({ isHalted, isOnTime, isDelayed }) => {
		if (activeTab === "ontime") return isOnTime;
		if (activeTab === "delayed") return isDelayed;
		if (activeTab === "halted") return isHalted;
		return true;
	});
	const onTimeCount = trainsWithStatus.filter((x) => x.isOnTime).length;
	const delayedCount = trainsWithStatus.filter((x) => x.isDelayed).length;
	const haltedCount = trainsWithStatus.filter((x) => x.isHalted).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-2xl border border-border bg-card shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-b border-border bg-subtle-gradient px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-rail-live animate-rail-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: t("trainList.runningNow")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: now ? t("trainList.liveGpsUpdated", { time: now.toLocaleTimeString() }) : t("trainList.connecting")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-1.5 border-b border-border bg-secondary/30 px-5 py-2.5 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground mr-1 flex items-center gap-1 font-semibold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "size-3" }),
							" ",
							t("trainList.filter")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("all"),
						className: `rounded-lg px-2.5 py-1 font-semibold transition-colors ${activeTab === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`,
						children: [
							t("trainList.all"),
							" (",
							trainRoutes.length,
							")"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("ontime"),
						className: `rounded-lg px-2.5 py-1 font-semibold transition-colors ${activeTab === "ontime" ? "bg-rail-live text-white" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`,
						children: [
							t("trainList.onTime"),
							" (",
							onTimeCount,
							")"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("delayed"),
						className: `rounded-lg px-2.5 py-1 font-semibold transition-colors ${activeTab === "delayed" ? "bg-rail-alert text-white" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`,
						children: [
							t("trainList.delayed"),
							" (",
							delayedCount,
							")"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("halted"),
						className: `rounded-lg px-2.5 py-1 font-semibold transition-colors ${activeTab === "halted" ? "bg-amber-600 text-white" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`,
						children: [
							t("trainList.halted"),
							" (",
							haltedCount,
							")"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border",
				children: filteredTrains.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "p-8 text-center text-sm text-muted-foreground",
					children: t("trainList.noMatch")
				}) : filteredTrains.map(({ t: tr, status, dest }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/train/$number",
					params: { number: tr.number },
					className: "block px-5 py-4 transition-colors hover:bg-secondary/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-semibold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground font-mono",
										children: tr.number
									}),
									" ",
									tr.name
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `text-sm font-semibold ${status ? delayTone(status) : "text-muted-foreground"}`,
								children: status ? delayLabel(status) : "…"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-0.5 flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									tr.halts[0].code,
									" → ",
									dest.code,
									" · ",
									tr.type
								]
							}), status && status.forecast && status.forecast.delayMin > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DelayReasonTag, { reason: status.delayReason })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mt-3 h-1.5 overflow-hidden rounded-full bg-secondary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-y-0 left-0 rounded-full bg-hero-gradient transition-all duration-1000",
								style: { width: `${status?.progress ?? 0}%` }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-3 ring-primary/20 transition-all duration-1000",
								style: { left: `${status?.progress ?? 0}%` }
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "size-3.5" }), status ? status.speed === 0 ? t("trainList.haltedState") : `${status.speed} km/h` : "—"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5 text-accent" }),
										t("trainList.next"),
										":",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-foreground",
											children: status?.nextHalt?.name ?? "—"
										}),
										status?.expectedPlatform && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded bg-primary/10 border border-primary/20 px-1.5 py-0.2 font-mono text-[10px] font-bold text-primary",
											children: ["PF ", status.expectedPlatform]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5" }),
										t("trainList.predictedEta"),
										" ",
										status?.etaNext ?? "—"
									]
								}),
								status && status.forecast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EtaConfidenceBadge, { confidence: status.forecast.confidence })
							]
						})
					]
				}) }, tr.number))
			})
		]
	});
}
function Index() {
	const { t } = useTranslation();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mx-auto max-w-6xl px-4 pt-10 pb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "order-2 lg:order-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground shadow-card",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-rail-live animate-rail-pulse" }), t("home.liveTrainsBadge", { count: "12,480" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-5 text-4xl font-bold leading-[1.05] sm:text-5xl",
									children: t("home.heroTitle")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 max-w-xl text-muted-foreground",
									children: t("home.heroDescription")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-8",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveTrainList, {})
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "order-1 lg:order-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchPanel, {})
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Features, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiBanner, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Networks, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stations, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Faq, {})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})
		]
	});
}
//#endregion
export { Index as component };
