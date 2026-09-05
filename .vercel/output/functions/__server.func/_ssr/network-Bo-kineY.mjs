import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { l as useTranslation } from "./rail-bkfOfZ1j.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Layers, F as Compass, O as Key, Q as ArrowRight, a as TrainFront, q as Check } from "../_libs/lucide-react.mjs";
import { d as SiteFooter, f as SiteHeader } from "./Sections-SSZ3XXHL.mjs";
import { t as Toaster$1 } from "./sonner-DoFKumIW.mjs";
import { f as trainRoutes, t as computeLiveStatus } from "./ssr.mjs";
import { t as useLiveClock } from "./useLiveClock-ZsXIJzCR.mjs";
import { a as useMap, i as Map$1, n as AdvancedMarker, o as useMapsLibrary, r as InfoWindow, t as APIProvider } from "../_libs/vis.gl__react-google-maps.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/network-Bo-kineY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_MAPS_KEY = typeof import.meta !== "undefined" && {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/"
}["VITE_GOOGLE_MAPS_API_KEY"] || typeof process !== "undefined" && process.env?.["GOOGLE_MAPS_API_KEY"] || "";
var BOX = {
	minLat: 7.5,
	maxLat: 35.5,
	minLng: 67.5,
	maxLng: 90.5
};
var W = 820;
var H = 720;
function project(lat, lng) {
	return {
		x: (lng - BOX.minLng) / (BOX.maxLng - BOX.minLng) * W,
		y: (BOX.maxLat - lat) / (BOX.maxLat - BOX.minLat) * H
	};
}
function NetworkRoutesLayer({ routes }) {
	const map = useMap();
	const mapsLib = useMapsLibrary("maps");
	(0, import_react.useEffect)(() => {
		if (!map || !mapsLib || routes.length === 0) return;
		const polylines = [];
		routes.forEach((train, idx) => {
			const path = train.halts.map((h) => ({
				lat: h.lat,
				lng: h.lng
			}));
			if (path.length < 2) return;
			const colors = [
				"#2563eb",
				"#059669",
				"#7c3aed",
				"#d97706",
				"#0891b2",
				"#dc2626"
			];
			const strokeColor = colors[idx % colors.length];
			const baseLine = new mapsLib.Polyline({
				path,
				strokeColor: "#1e293b",
				strokeOpacity: .6,
				strokeWeight: 5,
				map
			});
			const railLine = new mapsLib.Polyline({
				path,
				strokeColor,
				strokeOpacity: .85,
				strokeWeight: 2.5,
				map
			});
			polylines.push(baseLine, railLine);
		});
		return () => {
			polylines.forEach((p) => p.setMap(null));
		};
	}, [
		map,
		mapsLib,
		routes
	]);
	return null;
}
function NetworkCameraHandler({ routes }) {
	const map = useMap();
	const coreLib = useMapsLibrary("core");
	const fitNetworkBounds = (0, import_react.useCallback)(() => {
		if (!map || !coreLib || routes.length === 0) return;
		const bounds = new coreLib.LatLngBounds();
		routes.forEach((train) => {
			train.halts.forEach((h) => bounds.extend({
				lat: h.lat,
				lng: h.lng
			}));
		});
		map.fitBounds(bounds, {
			top: 40,
			right: 40,
			bottom: 40,
			left: 40
		});
	}, [
		map,
		coreLib,
		routes
	]);
	(0, import_react.useEffect)(() => {
		fitNetworkBounds();
	}, [fitNetworkBounds]);
	return null;
}
function NetworkMap({ className = "" }) {
	const [apiKey, setApiKey] = (0, import_react.useState)(DEFAULT_MAPS_KEY);
	const [showKeyDialog, setShowKeyDialog] = (0, import_react.useState)(false);
	const [inputKey, setInputKey] = (0, import_react.useState)("");
	const [mapType, setMapType] = (0, import_react.useState)("roadmap");
	const [viewMode, setViewMode] = (0, import_react.useState)("google");
	const [filterMode, setFilterMode] = (0, import_react.useState)("all");
	const [selectedTrain, setSelectedTrain] = (0, import_react.useState)(null);
	const now = useLiveClock(4e3);
	(0, import_react.useEffect)(() => {
		const saved = localStorage.getItem("GMP_API_KEY");
		if (saved && !apiKey) setApiKey(saved);
	}, [apiKey]);
	const handleSaveKey = (keyToSave) => {
		const trimmed = keyToSave.trim();
		setApiKey(trimmed);
		localStorage.setItem("GMP_API_KEY", trimmed);
		setShowKeyDialog(false);
	};
	const liveTrains = (0, import_react.useMemo)(() => {
		return trainRoutes.map((train) => {
			const status = computeLiveStatus(train, now ?? /* @__PURE__ */ new Date());
			return {
				train,
				status,
				isLate: (status.forecast?.delayMin ?? 0) > 2
			};
		});
	}, [now]);
	const filteredTrains = (0, import_react.useMemo)(() => {
		if (filterMode === "delayed") return liveTrains.filter((t) => t.isLate);
		if (filterMode === "on-time") return liveTrains.filter((t) => !t.isLate);
		return liveTrains;
	}, [liveTrains, filterMode]);
	const defaultCenter = {
		lat: 22.5937,
		lng: 78.9629
	};
	const routesPts = (0, import_react.useMemo)(() => trainRoutes.map((t) => t.halts.map((h) => project(h.lat, h.lng))), []);
	const xs = routesPts.flat().map((p) => p.x);
	const ys = routesPts.flat().map((p) => p.y);
	const pad = 60;
	const minX = Math.min(...xs) - pad;
	const minY = Math.min(...ys) - pad;
	const maxX = Math.max(...xs) + pad;
	const maxY = Math.max(...ys) + pad;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2 border-b border-border bg-secondary/40 px-3 py-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setViewMode(viewMode === "google" ? "schematic" : "google"),
							className: `inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-semibold transition-all cursor-pointer ${viewMode === "google" ? "border-primary bg-primary text-primary-foreground shadow-xs" : "border-border bg-card text-foreground hover:bg-secondary"}`,
							title: "Toggle between Google Maps and Schematic View",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: viewMode === "google" ? "Google Maps" : "Schematic Track" })]
						}),
						viewMode === "google" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center rounded-lg border border-border bg-card p-0.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setMapType("roadmap"),
									className: `rounded px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${mapType === "roadmap" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`,
									children: "Roadmap"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setMapType("satellite"),
									className: `rounded px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${mapType === "satellite" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`,
									children: "Satellite"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setMapType("terrain"),
									className: `rounded px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${mapType === "terrain" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`,
									children: "Terrain"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center rounded-lg border border-border bg-card p-0.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setFilterMode("all"),
									className: `rounded px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${filterMode === "all" ? "bg-secondary font-bold text-foreground" : "text-muted-foreground hover:text-foreground"}`,
									children: [
										"All (",
										liveTrains.length,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setFilterMode("on-time"),
									className: `rounded px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${filterMode === "on-time" ? "bg-emerald-600 font-bold text-white" : "text-muted-foreground hover:text-foreground"}`,
									children: "On Time"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setFilterMode("delayed"),
									className: `rounded px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${filterMode === "delayed" ? "bg-amber-600 font-bold text-white" : "text-muted-foreground hover:text-foreground"}`,
									children: "Delayed"
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setShowKeyDialog(!showKeyDialog),
						className: `flex size-7 items-center justify-center rounded-lg border transition-colors cursor-pointer ${apiKey ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse"}`,
						title: "Configure Google Maps API Key",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "size-3.5" })
					})
				})]
			}),
			showKeyDialog && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-primary/20 bg-primary/5 p-3 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-bold text-foreground flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "size-3.5 text-primary" }), "Google Maps API Configuration"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-muted-foreground",
							children: [
								"Enter your Google Maps JavaScript API key, or use a free",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_git_agentskills_v1",
									target: "_blank",
									rel: "noopener noreferrer",
									className: "text-primary underline font-medium",
									children: "Maps Demo Key"
								}),
								" ",
								"(no credit card required)."
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setShowKeyDialog(false),
						className: "text-muted-foreground hover:text-foreground text-sm font-bold",
						children: "✕"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2.5 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						placeholder: "AIzaSy... (Paste API Key)",
						value: inputKey,
						onChange: (e) => setInputKey(e.target.value),
						className: "flex-1 rounded-lg border border-border bg-card px-2.5 py-1.5 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => handleSaveKey(inputKey),
						className: "inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 font-bold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }), "Save"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative flex-1 min-h-[500px] w-full bg-slate-900/10",
				children: viewMode === "google" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(APIProvider, {
					apiKey,
					libraries: [
						"maps",
						"marker",
						"core"
					],
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Map$1, {
						mapId: "DEMO_MAP_ID",
						defaultCenter,
						defaultZoom: 5,
						mapTypeId: mapType,
						gestureHandling: "greedy",
						disableDefaultUI: false,
						zoomControl: true,
						mapTypeControl: false,
						streetViewControl: false,
						fullscreenControl: true,
						internalUsageAttributionIds: ["gmp_git_agentskills_v1"],
						className: "h-full w-full min-h-[500px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NetworkRoutesLayer, { routes: trainRoutes }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NetworkCameraHandler, { routes: trainRoutes }),
							filteredTrains.map(({ train, status, isLate }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdvancedMarker, {
								position: {
									lat: status.lat,
									lng: status.lng
								},
								title: `${train.number} ${train.name} (${status.speed} km/h)`,
								onClick: () => setSelectedTrain({
									train,
									status
								}),
								zIndex: isLate ? 60 : 50,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "group relative flex flex-col items-center cursor-pointer transition-transform hover:scale-125",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute -inset-1 rounded-full ${isLate ? "bg-amber-500/40" : "bg-primary/40"} animate-rail-pulse pointer-events-none` }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `relative z-10 flex size-7 items-center justify-center rounded-full text-white shadow-float ring-2 ring-white ${isLate ? "bg-amber-600" : "bg-primary"}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainFront, { className: "size-3.5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute -bottom-4 whitespace-nowrap rounded-xs bg-slate-950/85 px-1 py-0.2 text-[8px] font-mono font-bold text-white shadow-xs pointer-events-none",
											children: train.number
										})
									]
								})
							}, train.number)),
							selectedTrain && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoWindow, {
								position: {
									lat: selectedTrain.status.lat,
									lng: selectedTrain.status.lng
								},
								onCloseClick: () => setSelectedTrain(null),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-1.5 text-slate-900 min-w-[210px]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2 border-b border-slate-200 pb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-xs font-bold text-blue-700",
												children: selectedTrain.train.number
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `rounded px-1.5 py-0.2 text-[9px] font-bold uppercase ${(selectedTrain.status.forecast?.delayMin ?? 0) > 2 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`,
												children: (selectedTrain.status.forecast?.delayMin ?? 0) > 2 ? `${selectedTrain.status.forecast?.delayMin}m Late` : "On Time"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "mt-1 text-xs font-bold text-slate-900",
											children: selectedTrain.train.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1 flex items-center gap-1 text-[10px] text-slate-600",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selectedTrain.train.halts[0].code }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-2.5" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selectedTrain.train.halts[selectedTrain.train.halts.length - 1].code })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-[10px] text-slate-600",
											children: [
												"Near: ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selectedTrain.status.lastHalt.name }),
												" (",
												selectedTrain.status.speed,
												" km/h)"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 pt-1 border-t border-slate-200",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/train/$number",
												params: { number: selectedTrain.train.number },
												className: "inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Live GPS Tracking" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3" })]
											})
										})
									]
								})
							})
						]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: `${minX} ${minY} ${maxX - minX} ${maxY - minY}`,
					className: "h-full w-full min-h-[500px]",
					role: "img",
					"aria-label": "Live Indian Railways schematic network map",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
							id: "net-rail-grid",
							width: "24",
							height: "24",
							patternUnits: "userSpaceOnUse",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M24 0H0V24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "0.5",
								className: "text-border"
							})
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: minX,
							y: minY,
							width: maxX - minX,
							height: maxY - minY,
							fill: "url(#net-rail-grid)"
						}),
						trainRoutes.map((t) => {
							const line = t.halts.map((h) => project(h.lat, h.lng)).map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
								points: line,
								fill: "none",
								stroke: "var(--primary)",
								strokeWidth: "2",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								opacity: "0.45"
							}, t.number);
						}),
						filteredTrains.map(({ train, status, isLate }) => {
							const p = project(status.lat, status.lng);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/train/$number",
								params: { number: train.number },
								className: "group",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: p.x,
										cy: p.y,
										r: 10,
										className: isLate ? "fill-rail-alert/30 animate-rail-pulse" : "fill-primary/30 animate-rail-pulse"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: p.x,
										cy: p.y,
										r: 5,
										className: isLate ? "fill-rail-alert" : "fill-primary"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
										x: p.x + 8,
										y: p.y + 4,
										className: "fill-foreground font-mono text-[9px] font-bold",
										children: train.number
									})
								] })
							}, train.number);
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-t border-border bg-card/90 px-3 py-2 text-[10px] text-muted-foreground backdrop-blur-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-primary" }), " On-Time Fleet"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-amber-600" }), " Delayed Fleet"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-emerald-600" }), " Active GPS"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 text-primary font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Real-Geography Indian Railways Network" })]
				})]
			})
		]
	});
}
function NetworkPage() {
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
						children: t("network.title")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: t("network.subtitle")
					})] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 rounded-2xl border border-border bg-card p-3 shadow-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NetworkMap, { className: "h-[520px] w-full lg:h-[640px]" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})
		]
	});
}
//#endregion
export { NetworkPage as component };
