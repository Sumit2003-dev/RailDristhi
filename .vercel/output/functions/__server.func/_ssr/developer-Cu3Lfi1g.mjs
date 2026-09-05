import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { I as Code, N as Database, P as Copy, b as Play, c as Sparkles, o as Terminal, q as Check, z as Clock } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as SiteFooter, f as SiteHeader, n as Button } from "./Sections-SSZ3XXHL.mjs";
import { t as Input } from "./input-BaHNVncY.mjs";
import { t as Toaster$1 } from "./sonner-DoFKumIW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/developer-Cu3Lfi1g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ENDPOINTS = [
	{
		id: "trains-search",
		name: "Search Trains & Directory",
		method: "GET",
		path: "/api/v1/trains",
		description: "Search and filter trains by name, number, class (Superfast, Express, Rajdhani), or running state.",
		defaultParams: {
			q: "Rajdhani",
			type: "all",
			limit: "5"
		},
		category: "Tracking"
	},
	{
		id: "train-live",
		name: "Live Train Running Status & ETA",
		method: "GET",
		path: "/api/v1/train/12951/live",
		description: "Real-time GPS coordinates, speed, next scheduled halt, predicted ETA with confidence windows, and delay reason.",
		category: "Tracking"
	},
	{
		id: "train-timetable",
		name: "Train Timetable & Stops",
		method: "GET",
		path: "/api/v1/train/12951/timetable",
		description: "Complete sequence of halts, arrival/departure schedules, day count, distance in km, and coordinates.",
		category: "Timetable"
	},
	{
		id: "station-board",
		name: "Live Station Arrivals/Departures Board",
		method: "GET",
		path: "/api/v1/station/NDLS/board",
		description: "Live station board with incoming and departing services, platform assignments, and delay predictions.",
		defaultParams: { mode: "all" },
		category: "Stations"
	},
	{
		id: "stations-search",
		name: "Search Station Dictionary",
		method: "GET",
		path: "/api/v1/stations",
		description: "Query station names, IR station codes, and geographic coordinates across India.",
		defaultParams: {
			q: "DELHI",
			limit: "5"
		},
		category: "Stations"
	},
	{
		id: "between-stations",
		name: "Trains Between Stations",
		method: "GET",
		path: "/api/v1/between",
		description: "Find all direct services between source and destination stations.",
		defaultParams: {
			from: "NDLS",
			to: "KOTA"
		},
		category: "Timetable"
	},
	{
		id: "control-room",
		name: "Network Operations & Fleet KPIs",
		method: "GET",
		path: "/api/v1/control-room",
		description: "Network-wide fleet health metrics, active delay alerts, and delay classification breakdown.",
		category: "Analytics"
	},
	{
		id: "connecting-impact",
		name: "Connecting Train Transfer Feasibility",
		method: "GET",
		path: "/api/v1/connecting-impact",
		description: "Calculate transfer feasibility at junction stations based on incoming train ETA confidence margins.",
		defaultParams: {
			incoming: "12951",
			connecting: "12001",
			station: "NDLS"
		},
		category: "Analytics"
	},
	{
		id: "pnr-status",
		name: "10-Digit PNR Status & Coach Booking",
		method: "GET",
		path: "/api/v1/pnr/8421950247",
		description: "10-digit Indian Railways PNR validation with coach, berth assignment, and live train status.",
		category: "PNR & Booking"
	}
];
function DeveloperPortal() {
	const [selectedEndpoint, setSelectedEndpoint] = (0, import_react.useState)(ENDPOINTS[1]);
	const [customPath, setCustomPath] = (0, import_react.useState)(ENDPOINTS[1].path);
	const [params, setParams] = (0, import_react.useState)(ENDPOINTS[1].defaultParams || {});
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [responseStatus, setResponseStatus] = (0, import_react.useState)(null);
	const [responseTime, setResponseTime] = (0, import_react.useState)(null);
	const [responseBody, setResponseBody] = (0, import_react.useState)(null);
	const [copiedLang, setCopiedLang] = (0, import_react.useState)(null);
	const [activeCodeTab, setActiveCodeTab] = (0, import_react.useState)("curl");
	const handleSelectEndpoint = (ep) => {
		setSelectedEndpoint(ep);
		setCustomPath(ep.path);
		setParams(ep.defaultParams || {});
		setResponseBody(null);
		setResponseStatus(null);
		setResponseTime(null);
	};
	const constructUrl = () => {
		const query = new URLSearchParams();
		for (const [k, v] of Object.entries(params)) if (v.trim()) query.set(k, v.trim());
		const qStr = query.toString();
		return customPath + (qStr ? `?${qStr}` : "");
	};
	const handleExecute = async () => {
		setLoading(true);
		const start = performance.now();
		try {
			const fullUrl = constructUrl();
			const res = await fetch(fullUrl);
			const data = await res.json();
			const duration = Math.round(performance.now() - start);
			setResponseStatus(res.status);
			setResponseTime(duration);
			setResponseBody(JSON.stringify(data, null, 2));
		} catch (err) {
			setResponseStatus(500);
			setResponseTime(Math.round(performance.now() - start));
			setResponseBody(JSON.stringify({
				error: true,
				message: err instanceof Error ? err.message : "Fetch error"
			}, null, 2));
		} finally {
			setLoading(false);
		}
	};
	const getCodeSnippet = () => {
		const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${constructUrl()}` : `http://localhost:3000${constructUrl()}`;
		if (activeCodeTab === "curl") return `curl -X GET "${fullUrl}" \\
  -H "Accept: application/json"`;
		if (activeCodeTab === "js") return `const response = await fetch("${fullUrl}");
const data = await response.json();
console.log(data);`;
		if (activeCodeTab === "python") return `import requests

response = requests.get("${fullUrl}")
data = response.json()
print(data)`;
		return "";
	};
	const copyCode = (text, lang) => {
		navigator.clipboard.writeText(text);
		setCopiedLang(lang);
		toast.success(`Copied ${lang} snippet to clipboard`);
		setTimeout(() => setCopiedLang(null), 2e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 py-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4 border-b border-border pb-8 lg:flex-row lg:items-center lg:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), " RailDristhi REST API v1"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 text-3xl font-bold tracking-tight sm:text-4xl",
							children: "Developer REST API & Live Sandbox"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-2xl text-sm text-muted-foreground",
							children: "Production-ready endpoints for live train tracking, ETA forecasts with uncertainty intervals, classified delay reasons, station timetable boards, and PNR verification."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "/api/v1/docs",
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold shadow-card transition-colors hover:bg-secondary/70",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Code, { className: "size-4" }), " View OpenAPI Schema"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: handleExecute,
							className: "rounded-xl px-5 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4 fill-current" }), " Run Test Request"]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xs font-semibold tracking-wider text-muted-foreground uppercase",
								children: "API Endpoints"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-1 rounded-2xl border border-border bg-card p-2 shadow-card",
								children: ENDPOINTS.map((ep) => {
									const isSelected = selectedEndpoint.id === ep.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleSelectEndpoint(ep),
										className: `flex w-full flex-col gap-1 rounded-xl p-3 text-left transition-all ${isSelected ? "bg-primary/10 border border-primary/30 text-primary shadow-xs" : "hover:bg-secondary/60 text-foreground"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold",
												children: ep.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-mono font-semibold",
												children: ep.method
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-mono text-muted-foreground truncate",
											children: ep.path
										})]
									}, ep.id);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card p-4 shadow-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xs font-semibold text-muted-foreground uppercase",
									children: "API Specs"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "mt-3 space-y-2 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Protocol"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold",
												children: "HTTPS / JSON"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "CORS Support"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-rail-live",
												children: "Enabled (*)"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Rate Limit"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold",
												children: "1,000 req/min"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Format"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold font-mono",
												children: "application/json"
											})]
										})
									]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card p-6 shadow-card",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-lg font-bold",
											children: selectedEndpoint.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground mt-0.5",
											children: selectedEndpoint.description
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded-md bg-secondary/80 px-2.5 py-1 text-xs font-mono font-bold text-primary",
											children: [
												selectedEndpoint.method,
												" ",
												constructUrl()
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-muted-foreground uppercase",
											children: "Request Path"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1.5 flex gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex h-10 w-16 items-center justify-center rounded-xl bg-secondary font-mono text-xs font-bold text-primary",
													children: "GET"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: customPath,
													onChange: (e) => setCustomPath(e.target.value),
													className: "font-mono text-sm"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													onClick: handleExecute,
													disabled: loading,
													className: "shrink-0 gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5 fill-current" }), loading ? "Sending…" : "Send"]
												})
											]
										})]
									}),
									selectedEndpoint.defaultParams && Object.keys(selectedEndpoint.defaultParams).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-muted-foreground uppercase",
											children: "Query Parameters"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 grid gap-3 sm:grid-cols-2",
											children: Object.entries(params).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "w-20 shrink-0 font-mono text-xs font-semibold text-muted-foreground",
													children: k
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: v,
													onChange: (e) => setParams({
														...params,
														[k]: e.target.value
													}),
													className: "h-9 font-mono text-xs"
												})]
											}, k))
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "overflow-hidden rounded-2xl border border-border bg-card shadow-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border bg-subtle-gradient px-4 py-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-semibold",
											children: "Implementation Code"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [[
											"curl",
											"js",
											"python"
										].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setActiveCodeTab(tab),
											className: `rounded-lg px-2.5 py-1 text-xs font-semibold uppercase transition-colors ${activeCodeTab === tab ? "bg-secondary text-primary font-bold" : "text-muted-foreground hover:text-foreground"}`,
											children: tab
										}, tab)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "sm",
											onClick: () => copyCode(getCodeSnippet(), activeCodeTab),
											className: "ml-2 h-7 px-2 text-xs",
											children: copiedLang === activeCodeTab ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-rail-live" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" })
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "overflow-x-auto p-4 font-mono text-xs leading-relaxed text-foreground bg-secondary/30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: getCodeSnippet() })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "overflow-hidden rounded-2xl border border-border bg-card shadow-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border bg-subtle-gradient px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-sm font-semibold",
											children: "Response Inspector"
										})]
									}), responseStatus !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `font-semibold ${responseStatus >= 200 && responseStatus < 300 ? "text-rail-live" : "text-rail-alert"}`,
											children: [
												"Status: ",
												responseStatus,
												" ",
												responseStatus === 200 ? "OK" : ""
											]
										}), responseTime !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1 text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }),
												" ",
												responseTime,
												" ms"
											]
										})]
									})]
								}), responseBody ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "max-h-96 overflow-auto p-4 font-mono text-xs leading-relaxed text-foreground bg-secondary/20",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: responseBody })
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-10 text-center text-sm text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "mx-auto size-6 opacity-40 mb-2" }),
										"Click ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Run Test Request" }),
										" or ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Send" }),
										" above to execute a real live API call."
									]
								})]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})
		]
	});
}
//#endregion
export { DeveloperPortal as component };
