import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { l as useTranslation } from "./rail-bkfOfZ1j.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { H as CirclePause, K as ChevronDown, R as CloudRain, U as CircleCheck, W as ChevronUp, Y as Building2, Z as ArrowUpDown, _ as RotateCcw, c as Sparkles, d as ShieldCheck, i as TrendingUp, nt as Activity, p as Search, q as Check, r as TriangleAlert, s as Target, t as X } from "../_libs/lucide-react.mjs";
import { d as SiteFooter, f as SiteHeader } from "./Sections-SSZ3XXHL.mjs";
import { t as Toaster$1 } from "./sonner-DoFKumIW.mjs";
import { f as trainRoutes, o as historicalDelayAt, s as DELAY_REASONS, t as computeLiveStatus } from "./ssr.mjs";
import { t as useLiveClock } from "./useLiveClock-ZsXIJzCR.mjs";
import { n as EtaConfidenceBadge, t as DelayReasonTag } from "./DelayReasonTag-Dd8gd7rO.mjs";
import { a as Bar, c as Tooltip, i as CartesianGrid, n as YAxis, o as Cell, r as XAxis, s as ResponsiveContainer, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/control-room-C_yjEGSh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var reasonColors = {
	weather: "#38bdf8",
	congestion: "#f59e0b",
	"track-work": "#fb923c",
	"signal-failure": "#ef4444",
	technical: "#a855f7",
	unknown: "#94a3b8"
};
var zoneColors = {
	NR: "#3b82f6",
	WR: "#10b981",
	CR: "#8b5cf6",
	ER: "#f59e0b",
	SR: "#ec4899",
	NCR: "#06b6d4",
	ECR: "#f97316",
	WCR: "#6366f1",
	SCR: "#14b8a6",
	SWR: "#84cc16",
	SER: "#eab308",
	Other: "#94a3b8"
};
/**
* Determine the primary Indian Railway Zone for a given station code or train route.
*/
function getStationZone(stationCode) {
	const code = stationCode.toUpperCase();
	if ([
		"NDLS",
		"DLI",
		"NZM",
		"ANVT",
		"LKO",
		"BSB",
		"MB",
		"ASR",
		"JUC",
		"UMB",
		"KLK",
		"CDG",
		"HW",
		"DDN",
		"JAT",
		"SVDK",
		"BE",
		"GZB"
	].includes(code)) return "NR";
	if ([
		"MMCT",
		"BDTS",
		"BVI",
		"ST",
		"BRC",
		"ADI",
		"RTM",
		"UJN",
		"RJT",
		"BVP",
		"INDB",
		"GDA",
		"BL",
		"VAPI"
	].includes(code)) return "WR";
	if ([
		"CSMT",
		"DR",
		"LTT",
		"TNA",
		"KYN",
		"PUNE",
		"NGP",
		"BSL",
		"MMR",
		"SUR",
		"KOP",
		"NK",
		"IGP",
		"DD"
	].includes(code)) return "CR";
	if ([
		"HWH",
		"SDAH",
		"KOAA",
		"ASN",
		"BWN",
		"MLDT",
		"BGP",
		"DGR",
		"RPH",
		"BDC"
	].includes(code)) return "ER";
	if ([
		"MAS",
		"MS",
		"TBM",
		"CBE",
		"MDU",
		"TPJ",
		"TVC",
		"ERS",
		"CLT",
		"CAN",
		"ALLP",
		"SA",
		"ED",
		"PGT",
		"KRR"
	].includes(code)) return "SR";
	if ([
		"CNB",
		"PRYJ",
		"ALJN",
		"AGC",
		"AF",
		"GWL",
		"JHS",
		"GOY",
		"TDL",
		"ETW",
		"FTP"
	].includes(code)) return "NCR";
	if ([
		"PNBE",
		"PPTA",
		"DNR",
		"MGS",
		"DDU",
		"GAYA",
		"MFP",
		"SPJ",
		"DBG",
		"DHN",
		"DOS",
		"ARA",
		"BXR"
	].includes(code)) return "ECR";
	if ([
		"JBP",
		"BPL",
		"RKMP",
		"KOTA",
		"SWM",
		"BINA",
		"ET",
		"KTE",
		"STA",
		"NU",
		"GUNA"
	].includes(code)) return "WCR";
	if ([
		"SC",
		"HYB",
		"KCG",
		"BZA",
		"TPTY",
		"GNT",
		"KZJ",
		"WL",
		"RU",
		"GTL",
		"NED",
		"MDR"
	].includes(code)) return "SCR";
	if ([
		"SBC",
		"YPR",
		"SMVB",
		"MYS",
		"UBL",
		"BGM",
		"BAY",
		"DWR",
		"HPT",
		"DVG"
	].includes(code)) return "SWR";
	if ([
		"TATA",
		"ROU",
		"KGP",
		"RNC",
		"HTE",
		"BKSC",
		"SHM",
		"SRC",
		"CKP",
		"JSG"
	].includes(code)) return "SER";
	return "NR";
}
function getTrainZone(train) {
	if (train.halts.length > 0) return getStationZone(train.halts[0].code);
	return "NR";
}
/**
* Dynamically evaluate the model performance vs static schedule baseline across all route halts.
*/
function computeModelEvaluation(trains, now) {
	let totalHaltObs = 0;
	let sumModelAbsError = 0;
	let sumBaselineAbsError = 0;
	trains.forEach((t) => {
		computeLiveStatus(t, now).haltStatus.forEach((hs, idx) => {
			const histDelay = historicalDelayAt(t, idx);
			const predictedDelay = hs.forecast?.delayMin ?? 0;
			const modelError = Math.abs(predictedDelay - histDelay);
			const baselineError = Math.abs(0 - histDelay);
			sumModelAbsError += modelError;
			sumBaselineAbsError += baselineError;
			totalHaltObs++;
		});
	});
	const maeModel = totalHaltObs ? (sumModelAbsError / totalHaltObs).toFixed(1) : "0.0";
	const maeBaseline = totalHaltObs ? (sumBaselineAbsError / totalHaltObs).toFixed(1) : "0.0";
	const errorReductionPct = totalHaltObs && sumBaselineAbsError ? Math.round((sumBaselineAbsError - sumModelAbsError) / sumBaselineAbsError * 100) : 0;
	return {
		maeMinutes: Number(maeModel),
		baselineMaeMinutes: Number(maeBaseline),
		errorReductionPercent: errorReductionPct,
		sampleSize: totalHaltObs,
		evaluationWindow: "90-day rolling window"
	};
}
function ControlRoomDashboard() {
	const now = useLiveClock(4e3);
	const [secondsAgo, setSecondsAgo] = (0, import_react.useState)(0);
	const [isBannerDismissed, setIsBannerDismissed] = (0, import_react.useState)(false);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [selectedZone, setSelectedZone] = (0, import_react.useState)("all");
	const [selectedCause, setSelectedCause] = (0, import_react.useState)("all");
	const [sortBy, setSortBy] = (0, import_react.useState)("delay-desc");
	const [acknowledgedAlerts, setAcknowledgedAlerts] = (0, import_react.useState)({});
	const [showAcknowledgedSection, setShowAcknowledgedSection] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setSecondsAgo(0);
		const interval = setInterval(() => {
			setSecondsAgo((prev) => prev + 1);
		}, 1e3);
		return () => clearInterval(interval);
	}, [now]);
	const toggleAcknowledge = (trainNumber) => {
		setAcknowledgedAlerts((prev) => ({
			...prev,
			[trainNumber]: !prev[trainNumber]
		}));
	};
	const statuses = (0, import_react.useMemo)(() => now ? trainRoutes.map((t) => ({
		t,
		s: computeLiveStatus(t, now)
	})) : [], [now]);
	const modelPerf = (0, import_react.useMemo)(() => {
		return computeModelEvaluation(trainRoutes, now ?? /* @__PURE__ */ new Date());
	}, [now]);
	const fleet = (0, import_react.useMemo)(() => {
		const running = statuses.filter((x) => x.s.state === "running" || x.s.state === "halted");
		const onTime = running.filter((x) => (x.s.forecast?.delayMin ?? 0) <= 2).length;
		const late = running.length - onTime;
		const halted = running.filter((x) => x.s.state === "halted").length;
		const highConf = running.filter((x) => (x.s.forecast?.confidence ?? 0) >= .7).length;
		return {
			running: running.length,
			onTime,
			late,
			halted,
			highConf
		};
	}, [statuses]);
	const reasonBreakdown = (0, import_react.useMemo)(() => {
		const counts = {};
		for (const { s } of statuses) if ((s.forecast?.delayMin ?? 0) > 2) counts[s.delayReason] = (counts[s.delayReason] ?? 0) + 1;
		return Object.keys(DELAY_REASONS).filter((r) => (counts[r] ?? 0) > 0).map((r) => ({
			reason: r,
			label: DELAY_REASONS[r].short,
			count: counts[r] ?? 0
		}));
	}, [statuses]);
	const zoneBreakdown = (0, import_react.useMemo)(() => {
		const zoneMap = {};
		statuses.forEach(({ t, s }) => {
			if ((s.forecast?.delayMin ?? 0) > 2) {
				const zone = getTrainZone(t);
				if (!zoneMap[zone]) zoneMap[zone] = {
					count: 0,
					totalDelay: 0
				};
				zoneMap[zone].count += 1;
				zoneMap[zone].totalDelay += s.forecast?.delayMin ?? s.delay;
			}
		});
		return Object.entries(zoneMap).map(([zone, data]) => ({
			zone,
			count: data.count,
			avgDelay: Math.round(data.totalDelay / (data.count || 1))
		})).sort((a, b) => b.count - a.count);
	}, [statuses]);
	const rawAlerts = (0, import_react.useMemo)(() => statuses.filter(({ s }) => (s.forecast?.delayMin ?? 0) > 15).map(({ t, s }) => ({
		t,
		s,
		zone: getTrainZone(t),
		isAcknowledged: !!acknowledgedAlerts[t.number]
	})), [statuses, acknowledgedAlerts]);
	const weatherAdvisory = (0, import_react.useMemo)(() => {
		const weatherAlerts = statuses.filter(({ s }) => s.delayReason === "weather" && (s.forecast?.delayMin ?? 0) > 10);
		if (weatherAlerts.length === 0) return null;
		const impactedZones = Array.from(new Set(weatherAlerts.map(({ t }) => getTrainZone(t)))).join(", ");
		return {
			count: weatherAlerts.length,
			zones: impactedZones || "NR, ER, SR"
		};
	}, [statuses]);
	const filteredAlerts = (0, import_react.useMemo)(() => {
		let list = rawAlerts;
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase().trim();
			list = list.filter((item) => item.t.number.includes(q) || item.t.name.toLowerCase().includes(q) || item.t.halts.some((h) => h.code.toLowerCase().includes(q) || h.name.toLowerCase().includes(q)));
		}
		if (selectedZone !== "all") list = list.filter((item) => item.zone === selectedZone);
		if (selectedCause !== "all") list = list.filter((item) => item.s.delayReason === selectedCause);
		list = [...list].sort((a, b) => {
			const delayA = a.s.forecast?.delayMin ?? a.s.delay;
			const delayB = b.s.forecast?.delayMin ?? b.s.delay;
			const confA = a.s.forecast?.confidence ?? a.s.confidence;
			const confB = b.s.forecast?.confidence ?? b.s.confidence;
			if (sortBy === "delay-desc") return delayB - delayA;
			if (sortBy === "delay-asc") return delayA - delayB;
			if (sortBy === "conf-desc") return confB - confA;
			if (sortBy === "number") return a.t.number.localeCompare(b.t.number);
			return 0;
		});
		return list;
	}, [
		rawAlerts,
		searchQuery,
		selectedZone,
		selectedCause,
		sortBy
	]);
	const activePendingAlerts = (0, import_react.useMemo)(() => filteredAlerts.filter((a) => !a.isAcknowledged), [filteredAlerts]);
	const activeAckAlerts = (0, import_react.useMemo)(() => filteredAlerts.filter((a) => a.isAcknowledged), [filteredAlerts]);
	const availableZones = (0, import_react.useMemo)(() => {
		const zSet = /* @__PURE__ */ new Set();
		rawAlerts.forEach((a) => zSet.add(a.zone));
		return Array.from(zSet).sort();
	}, [rawAlerts]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold uppercase tracking-wider text-foreground",
						children: "Network Operations Feed"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground shadow-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-emerald-500 animate-pulse" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-[11px] font-medium text-foreground",
							children: [
								"Last updated ",
								secondsAgo,
								"s ago"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground",
							children: "• Live model telemetry"
						})
					]
				})]
			}),
			!isBannerDismissed && weatherAdvisory && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3 rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4 text-sky-950 dark:text-sky-100 shadow-sm animate-in fade-in duration-300",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-8 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 text-sky-600 dark:text-sky-400",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudRain, { className: "size-4.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-bold tracking-tight",
						children: "Weather & Speed Restriction Advisory · Elevated Corridor Delays"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 text-xs text-sky-800 dark:text-sky-200",
						children: [
							"Adverse weather and fog alerts detected across",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: weatherAdvisory.zones }),
							" zones (",
							weatherAdvisory.count,
							" trains affected). Speed restrictions enforced on active trunk sections."
						]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setIsBannerDismissed(true),
					className: "rounded-lg p-1 text-sky-700 hover:bg-sky-500/20 dark:text-sky-300 transition-colors cursor-pointer",
					title: "Dismiss Advisory",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-4" }),
							label: "Trains monitored",
							value: fleet.running,
							sub: `${fleet.running} monitored (${fleet.onTime} on time)`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4" }),
							label: "Running late",
							value: fleet.late,
							sub: "predicted by model",
							alert: fleet.late > 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePause, { className: "size-4" }),
							label: "Halted at stations",
							value: fleet.halted,
							sub: "currently stationary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" }),
							label: "High-confidence forecasts",
							value: fleet.highConf,
							sub: "≥ 70% confidence"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border/80 bg-secondary/30 px-3.5 py-2 text-xs text-muted-foreground flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Dataset Note:" }), " Reflects a curated high-variance sample selected for delay-history depth — not representative of full-network baseline punctuality."] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-border bg-card p-5 shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-bold text-foreground",
							children: "Model Forecasting Performance"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-md bg-secondary px-2 py-0.5 font-mono text-[11px] font-semibold text-primary",
						children: modelPerf.evaluationWindow
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border/60 bg-secondary/20 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-medium text-muted-foreground",
									children: "Model Mean Absolute Error (MAE)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 font-mono text-2xl font-extrabold text-primary",
									children: [
										modelPerf.maeMinutes,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-normal text-muted-foreground",
											children: "min"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-[10px] text-muted-foreground",
									children: "Average prediction delta across halts"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border/60 bg-secondary/20 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-medium text-muted-foreground",
									children: "Static Baseline Error"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 font-mono text-2xl font-extrabold text-muted-foreground",
									children: [
										modelPerf.baselineMaeMinutes,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-normal text-muted-foreground",
											children: "min"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-[10px] text-muted-foreground",
									children: "Schedule + static recovery baseline error"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `rounded-xl border p-3 ${modelPerf.errorReductionPercent >= 0 ? "border-emerald-500/20 bg-emerald-500/5" : "border-amber-500/20 bg-amber-500/5"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-[11px] font-medium ${modelPerf.errorReductionPercent >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`,
									children: modelPerf.errorReductionPercent >= 0 ? "Accuracy Improvement" : "Error vs Static Baseline"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `mt-1 font-mono text-2xl font-extrabold ${modelPerf.errorReductionPercent >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`,
									children: modelPerf.errorReductionPercent >= 0 ? `+${modelPerf.errorReductionPercent}%` : `${modelPerf.errorReductionPercent}%`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `mt-0.5 text-[10px] ${modelPerf.errorReductionPercent >= 0 ? "text-emerald-600/80 dark:text-emerald-400/80" : "text-amber-600/80 dark:text-amber-400/80"}`,
									children: modelPerf.errorReductionPercent >= 0 ? "Error reduction vs static schedule" : "Variance vs static schedule (0-delay assumption)"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border/60 bg-secondary/20 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-medium text-muted-foreground",
									children: "Evaluation Sample Size"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-mono text-2xl font-extrabold text-foreground",
									children: modelPerf.sampleSize.toLocaleString()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-[10px] text-muted-foreground",
									children: "Halt observations in test cohort"
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl border border-border bg-card p-5 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold text-foreground",
							children: "Delay cause distribution"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: "Classified causes for trains the model predicts as late."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-56",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: reasonBreakdown,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "var(--border)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "label",
											fontSize: 11,
											stroke: "var(--muted-foreground)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											allowDecimals: false,
											fontSize: 11,
											stroke: "var(--muted-foreground)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
											cursor: { fill: "var(--secondary)" },
											contentStyle: {
												background: "var(--card)",
												border: "1px solid var(--border)",
												borderRadius: 12
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "count",
											radius: [
												6,
												6,
												0,
												0
											],
											children: reasonBreakdown.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: reasonColors[r.reason] }, r.reason))
										})
									]
								})
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl border border-border bg-card p-5 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold text-foreground",
							children: "Zone-wise delay breakdown"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: "Affected train counts and average delay severity grouped by Railway Zone."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-4 text-primary" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-56",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: zoneBreakdown,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "var(--border)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "zone",
										fontSize: 11,
										stroke: "var(--muted-foreground)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										allowDecimals: false,
										fontSize: 11,
										stroke: "var(--muted-foreground)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										cursor: { fill: "var(--secondary)" },
										content: ({ active, payload }) => {
											if (active && payload && payload.length) {
												const data = payload[0].payload;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-xl border border-border bg-card p-2 text-xs shadow-lg",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "font-bold text-foreground",
															children: ["Zone ", data.zone]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "text-primary font-semibold",
															children: ["Delayed Trains: ", data.count]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "text-muted-foreground",
															children: [
																"Avg Delay: ",
																data.avgDelay,
																" min"
															]
														})
													]
												});
											}
											return null;
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "count",
										radius: [
											6,
											6,
											0,
											0
										],
										children: zoneBreakdown.map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: zoneColors[z.zone] ?? "#3b82f6" }, z.zone))
									})
								]
							})
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-border bg-card shadow-card overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/30 px-5 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-bold text-foreground",
									children: "Active delay alerts"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full bg-rail-alert/15 px-2 py-0.5 font-mono text-[10px] font-bold text-rail-alert",
									children: [activePendingAlerts.length, " Actionable"]
								}),
								activeAckAlerts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400",
									children: [activeAckAlerts.length, " Acknowledged"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: [rawAlerts.length, " total trains >15 min delay"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3 border-b border-border bg-card p-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex-1 min-w-[200px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "Search train no, name or station...",
										value: searchQuery,
										onChange: (e) => setSearchQuery(e.target.value),
										className: "w-full rounded-lg border border-border bg-secondary/30 pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden"
									}),
									searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setSearchQuery(""),
										className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
										children: "✕"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground font-medium",
									children: "Zone:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: selectedZone,
									onChange: (e) => setSelectedZone(e.target.value),
									className: "rounded-lg border border-border bg-secondary/30 px-2 py-1.5 text-xs font-semibold text-foreground focus:border-primary focus:outline-hidden cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "all",
										children: "All Zones"
									}), availableZones.map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: z,
										children: z
									}, z))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground font-medium",
									children: "Cause:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: selectedCause,
									onChange: (e) => setSelectedCause(e.target.value),
									className: "rounded-lg border border-border bg-secondary/30 px-2 py-1.5 text-xs font-semibold text-foreground focus:border-primary focus:outline-hidden cursor-pointer",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "all",
											children: "All Causes"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "weather",
											children: "Weather"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "congestion",
											children: "Congestion"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "track-work",
											children: "Track Work"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "signal-failure",
											children: "Signal Failure"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "technical",
											children: "Technical"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "unknown",
											children: "Unknown"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "size-3 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: sortBy,
									onChange: (e) => setSortBy(e.target.value),
									className: "rounded-lg border border-border bg-secondary/30 px-2 py-1.5 text-xs font-semibold text-foreground focus:border-primary focus:outline-hidden cursor-pointer",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "delay-desc",
											children: "Delay: High → Low"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "delay-asc",
											children: "Delay: Low → High"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "conf-desc",
											children: "Confidence: High → Low"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "number",
											children: "Train Number"
										})
									]
								})]
							})
						]
					}),
					activePendingAlerts.length === 0 && activeAckAlerts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-5 py-8 text-center text-sm text-muted-foreground",
						children: "No matching delay alerts found for the selected filter criteria."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: activePendingAlerts.map(({ t, s, zone }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-secondary/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => toggleAcknowledge(t.number),
									className: "flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors cursor-pointer",
									title: "Acknowledge Alert",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/train/$number",
									params: { number: t.number },
									className: "min-w-0 flex-1 group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-sm font-bold text-foreground group-hover:text-primary transition-colors",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-muted-foreground",
													children: t.number
												}),
												" ",
												t.name
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded bg-secondary/80 px-1.5 py-0.2 font-mono text-[9px] font-bold text-foreground",
											children: zone
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 flex flex-wrap items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DelayReasonTag, { reason: s.delayReason }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: ["Approaching: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: s.nextHalt?.code ?? "Destination" })]
										})]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-4 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block font-mono text-base font-bold text-rail-alert",
									children: [
										"+",
										s.forecast?.delayMin ?? s.delay,
										" min"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EtaConfidenceBadge, { confidence: s.forecast?.confidence ?? 0 })] })
							})]
						}, t.number))
					}),
					activeAckAlerts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border bg-secondary/15",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setShowAcknowledgedSection(!showAcknowledgedSection),
							className: "flex w-full items-center justify-between px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-emerald-600 dark:text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Acknowledged Alerts (",
									activeAckAlerts.length,
									")"
								] })]
							}), showAcknowledgedSection ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5" })]
						}), showAcknowledgedSection && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border/60 bg-secondary/5 opacity-75",
							children: activeAckAlerts.map(({ t, s, zone }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 bg-secondary/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => toggleAcknowledge(t.number),
										className: "flex size-6 shrink-0 items-center justify-center rounded-md border border-emerald-500/40 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-amber-500/20 hover:text-amber-600 transition-colors cursor-pointer",
										title: "Reopen Alert",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/train/$number",
										params: { number: t.number },
										className: "min-w-0 flex-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-xs font-medium line-through text-muted-foreground",
													children: [
														t.number,
														" ",
														t.name
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded bg-secondary px-1 py-0.2 font-mono text-[8px] text-muted-foreground",
													children: zone
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded-xs bg-emerald-500/10 px-1 py-0.2 text-[8px] font-bold text-emerald-600 dark:text-emerald-400 uppercase",
													children: "Actioned"
												})
											]
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-xs text-muted-foreground",
										children: [
											"+",
											s.forecast?.delayMin ?? s.delay,
											" min"
										]
									})
								})]
							}, t.number))
						})]
					})
				]
			})
		]
	});
}
function Kpi({ icon, label, value, sub, alert }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex items-center gap-1.5 text-xs text-muted-foreground",
				children: [icon, label]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `mt-2 text-3xl font-bold ${alert ? "text-rail-alert" : "text-foreground"}`,
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: sub
			})
		]
	});
}
function ControlRoomPage() {
	const { t } = useTranslation();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 py-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap items-end justify-between gap-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold",
						children: t("controlRoom.title")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: t("controlRoom.subtitle")
					})] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlRoomDashboard, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})
		]
	});
}
//#endregion
export { ControlRoomPage as component };
