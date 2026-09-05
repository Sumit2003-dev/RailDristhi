import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { l as useTranslation } from "./rail-bkfOfZ1j.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as ArrowLeft, A as Gauge, E as Layers, F as Compass, J as Calendar, K as ChevronDown, O as Key, S as Navigation, W as ChevronUp, a as TrainFront, f as ShieldAlert, g as RotateCw, h as Route, l as SlidersHorizontal, m as Satellite, q as Check, v as Radio, w as MapPin, x as Pen, z as Clock } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as SheetHeader, d as SiteFooter, f as SiteHeader, l as SheetTitle, o as Sheet, s as SheetContent, u as SheetTrigger } from "./Sections-SSZ3XXHL.mjs";
import { t as Toaster$1 } from "./sonner-DoFKumIW.mjs";
import { a as fmtMinutes, i as delayTone, r as delayLabel, t as computeLiveStatus } from "./ssr.mjs";
import { t as useLiveClock } from "./useLiveClock-ZsXIJzCR.mjs";
import { n as EtaConfidenceBadge, t as DelayReasonTag } from "./DelayReasonTag-Dd8gd7rO.mjs";
import { a as useMap, i as Map$1, n as AdvancedMarker, o as useMapsLibrary, r as InfoWindow, t as APIProvider } from "../_libs/vis.gl__react-google-maps.mjs";
import { t as Route$1 } from "./train._number-trFqpvCU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/train._number-BMbrGhTy.js
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
var W = 640;
var H = 720;
function project(lat, lng) {
	return {
		x: (lng - BOX.minLng) / (BOX.maxLng - BOX.minLng) * W,
		y: (BOX.maxLat - lat) / (BOX.maxLat - BOX.minLat) * H
	};
}
function totalLen(pts) {
	let acc = 0;
	for (let i = 1; i < pts.length; i++) acc += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
	return acc;
}
function snapToPath(pts, p) {
	let best = {
		x: p.x,
		y: p.y,
		d: 0,
		angle: 0
	};
	let bestDist = Infinity;
	let acc = 0;
	for (let i = 0; i < pts.length - 1; i++) {
		const a = pts[i];
		const b = pts[i + 1];
		const dx = b.x - a.x;
		const dy = b.y - a.y;
		const len = Math.hypot(dx, dy) || 1;
		let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (len * len);
		t = Math.max(0, Math.min(1, t));
		const cx = a.x + dx * t;
		const cy = a.y + dy * t;
		const d = Math.hypot(p.x - cx, p.y - cy);
		if (d < bestDist) {
			bestDist = d;
			best = {
				x: cx,
				y: cy,
				d: acc + len * t,
				angle: Math.atan2(dy, dx)
			};
		}
		acc += len;
	}
	return best;
}
function buildTies(pts, spacing) {
	const ties = [];
	const total = totalLen(pts);
	for (let d = 0; d <= total; d += spacing) {
		let s = 0;
		let rem = d;
		for (let i = 0; i < pts.length - 1; i++) {
			const l = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y) || 1;
			if (rem <= l) {
				s = i;
				break;
			}
			rem -= l;
		}
		const a = pts[s];
		const b = pts[s + 1];
		const l = Math.hypot(b.x - a.x, b.y - a.y) || 1;
		const t = l ? rem / l : 0;
		ties.push({
			x: a.x + (b.x - a.x) * t,
			y: a.y + (b.y - a.y) * t,
			angle: Math.atan2(b.y - a.y, b.x - a.x),
			d
		});
	}
	return ties;
}
function GoogleMapsTrackPolyline({ path }) {
	const map = useMap();
	const mapsLib = useMapsLibrary("maps");
	(0, import_react.useEffect)(() => {
		if (!map || !mapsLib || path.length < 2) return;
		const ballastPolyline = new mapsLib.Polyline({
			path,
			strokeColor: "#1e293b",
			strokeOpacity: .85,
			strokeWeight: 6,
			map
		});
		const railPolyline = new mapsLib.Polyline({
			path,
			strokeColor: "#2563eb",
			strokeOpacity: .95,
			strokeWeight: 3.5,
			map
		});
		const tiePolyline = new mapsLib.Polyline({
			path,
			strokeColor: "#ffffff",
			strokeOpacity: .9,
			strokeWeight: 2,
			icons: [{
				icon: {
					path: "M 0,-1.5 0,1.5",
					strokeOpacity: 1,
					strokeWeight: 2,
					scale: 2
				},
				offset: "0",
				repeat: "10px"
			}],
			map
		});
		return () => {
			ballastPolyline.setMap(null);
			railPolyline.setMap(null);
			tiePolyline.setMap(null);
		};
	}, [
		map,
		mapsLib,
		path
	]);
	return null;
}
function GoogleMapsCameraHandler({ halts, position, focusTrain, onResetFocus }) {
	const map = useMap();
	const coreLib = useMapsLibrary("core");
	const fitRouteBounds = (0, import_react.useCallback)(() => {
		if (!map || !coreLib || halts.length === 0) return;
		const bounds = new coreLib.LatLngBounds();
		halts.forEach((h) => bounds.extend({
			lat: h.lat,
			lng: h.lng
		}));
		if (position) bounds.extend(position);
		map.fitBounds(bounds, {
			top: 50,
			right: 50,
			bottom: 50,
			left: 50
		});
	}, [
		map,
		coreLib,
		halts,
		position
	]);
	(0, import_react.useEffect)(() => {
		if (!map || !coreLib) return;
		if (focusTrain && position) {
			map.panTo(position);
			map.setZoom(12);
			onResetFocus();
		} else fitRouteBounds();
	}, [
		map,
		coreLib,
		focusTrain,
		position,
		fitRouteBounds,
		onResetFocus
	]);
	return null;
}
function RouteMap({ halts, position, className = "", isMoving = false }) {
	const [apiKey, setApiKey] = (0, import_react.useState)(DEFAULT_MAPS_KEY);
	const [showKeyDialog, setShowKeyDialog] = (0, import_react.useState)(false);
	const [inputKey, setInputKey] = (0, import_react.useState)("");
	const [mapType, setMapType] = (0, import_react.useState)("roadmap");
	const [focusTrainTrigger, setFocusTrainTrigger] = (0, import_react.useState)(false);
	const [selectedHalt, setSelectedHalt] = (0, import_react.useState)(null);
	const [viewMode, setViewMode] = (0, import_react.useState)("google");
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
	const defaultCenter = (0, import_react.useMemo)(() => {
		if (position) return position;
		if (halts.length > 0) {
			const mid = Math.floor(halts.length / 2);
			return {
				lat: halts[mid].lat,
				lng: halts[mid].lng
			};
		}
		return {
			lat: 20.5937,
			lng: 78.9629
		};
	}, [halts, position]);
	const pathCoords = (0, import_react.useMemo)(() => {
		return halts.map((h) => ({
			lat: h.lat,
			lng: h.lng
		}));
	}, [halts]);
	const pts = (0, import_react.useMemo)(() => halts.map((h) => project(h.lat, h.lng)), [halts]);
	const line = (0, import_react.useMemo)(() => pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" "), [pts]);
	const ties = (0, import_react.useMemo)(() => buildTies(pts, 9), [pts]);
	let minX = Infinity;
	let maxX = -Infinity;
	let minY = Infinity;
	let maxY = -Infinity;
	pts.forEach((p) => {
		if (p.x < minX) minX = p.x;
		if (p.x > maxX) maxX = p.x;
		if (p.y < minY) minY = p.y;
		if (p.y > maxY) maxY = p.y;
	});
	const pad = 42;
	minX = Math.max(0, minX - pad);
	minY = Math.max(0, minY - pad);
	maxX = Math.min(W, maxX + pad);
	maxY = Math.min(H, maxY + pad);
	const vw = Math.max(120, maxX - minX);
	const vh = Math.max(120, maxY - minY);
	const marker = position ? snapToPath(pts, project(position.lat, position.lng)) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2 border-b border-border bg-secondary/40 px-3 py-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setViewMode(viewMode === "google" ? "schematic" : "google"),
						className: `inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-semibold transition-all cursor-pointer ${viewMode === "google" ? "border-primary bg-primary text-primary-foreground shadow-xs" : "border-border bg-card text-foreground hover:bg-secondary"}`,
						title: "Toggle between Google Maps and Schematic View",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: viewMode === "google" ? "Google Maps" : "Schematic Track" })]
					}), viewMode === "google" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [position && viewMode === "google" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setFocusTrainTrigger(true),
						className: "inline-flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary hover:bg-primary/20 transition-colors cursor-pointer",
						title: "Recenter Camera on Live Train Engine",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "size-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Track Train" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setShowKeyDialog(!showKeyDialog),
						className: `flex size-7 items-center justify-center rounded-lg border transition-colors cursor-pointer ${apiKey ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse"}`,
						title: "Configure Google Maps API Key",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "size-3.5" })
					})]
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
								"Enter your Google Cloud Maps JavaScript API key, or generate a free",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_git_agentskills_v1",
									target: "_blank",
									rel: "noopener noreferrer",
									className: "text-primary underline font-medium",
									children: "Maps Demo Key"
								}),
								" ",
								"(no billing required)."
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
				className: "relative flex-1 min-h-[460px] w-full bg-slate-900/10",
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
						defaultZoom: 7,
						mapTypeId: mapType,
						gestureHandling: "greedy",
						disableDefaultUI: false,
						zoomControl: true,
						mapTypeControl: false,
						streetViewControl: false,
						fullscreenControl: true,
						internalUsageAttributionIds: ["gmp_git_agentskills_v1"],
						className: "h-full w-full min-h-[460px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleMapsTrackPolyline, { path: pathCoords }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleMapsCameraHandler, {
								halts,
								position,
								focusTrain: focusTrainTrigger,
								onResetFocus: () => setFocusTrainTrigger(false)
							}),
							halts.map((halt, idx) => {
								const isOrigin = idx === 0;
								const isDest = idx === halts.length - 1;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdvancedMarker, {
									position: {
										lat: halt.lat,
										lng: halt.lng
									},
									title: `${halt.name} (${halt.code})`,
									onClick: () => setSelectedHalt(halt),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "group relative flex flex-col items-center cursor-pointer transition-transform hover:scale-110",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `flex size-6 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold shadow-md transition-colors ${isOrigin ? "bg-emerald-600 text-white" : isDest ? "bg-red-600 text-white" : "bg-blue-600 text-white"}`,
											children: isOrigin ? "O" : isDest ? "D" : idx + 1
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute -bottom-4 whitespace-nowrap rounded-xs bg-slate-950/80 px-1 py-0.2 text-[8px] font-mono font-bold text-white shadow-xs pointer-events-none opacity-80 group-hover:opacity-100",
											children: halt.code
										})]
									})
								}, halt.code);
							}),
							position && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdvancedMarker, {
								position,
								title: `Live Train Location — Lat: ${position.lat.toFixed(4)}, Lng: ${position.lng.toFixed(4)}`,
								zIndex: 100,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex items-center justify-center",
									children: [
										isMoving && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute size-14 rounded-full border border-primary/50 bg-primary/20 animate-ping pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute size-10 rounded-full bg-primary/30 animate-rail-pulse pointer-events-none" })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "relative z-20 flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-float ring-3 ring-white",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainFront, { className: "size-4.5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "absolute -top-7 z-30 whitespace-nowrap rounded-full bg-primary px-2 py-0.5 text-[9px] font-extrabold text-primary-foreground shadow-md ring-1 ring-white/40 flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flex size-1.5 rounded-full bg-emerald-400 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isMoving ? "RUNNING" : "HALTED" })]
										})
									]
								})
							}),
							selectedHalt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoWindow, {
								position: {
									lat: selectedHalt.lat,
									lng: selectedHalt.lng
								},
								onCloseClick: () => setSelectedHalt(null),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-1 text-slate-900",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs font-bold",
											children: selectedHalt.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-mono text-[10px] text-slate-600",
											children: ["Station Code: ", selectedHalt.code]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] text-slate-600 mt-0.5",
											children: [
												"Distance: ",
												selectedHalt.km,
												" km",
												selectedHalt.platform && ` • Platform ${selectedHalt.platform}`
											]
										})
									]
								})
							})
						]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: `${minX} ${minY} ${vw} ${vh}`,
					className: "h-full w-full min-h-[460px]",
					role: "img",
					"aria-label": "Train schematic route map",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
							id: "rail-grid",
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
							width: vw,
							height: vh,
							fill: "url(#rail-grid)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
							points: line,
							fill: "none",
							stroke: "var(--primary)",
							strokeOpacity: "0.15",
							strokeWidth: "8",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						}),
						ties.map((t, i) => {
							const perp = t.angle + Math.PI / 2;
							const dx = Math.cos(perp) * 4.5;
							const dy = Math.sin(perp) * 4.5;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1: t.x - dx,
								y1: t.y - dy,
								x2: t.x + dx,
								y2: t.y + dy,
								stroke: "var(--primary)",
								strokeWidth: "1.6",
								strokeLinecap: "round",
								strokeOpacity: .4
							}, `tie-${i}`);
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
							points: line,
							fill: "none",
							stroke: "var(--primary)",
							strokeOpacity: "0.7",
							strokeWidth: "1.5",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						}),
						pts.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: p.x,
							cy: p.y,
							r: 3.5,
							className: "fill-card stroke-primary",
							strokeWidth: "1.5"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: p.x + 8,
							y: p.y + 4,
							className: "fill-muted-foreground font-mono",
							fontSize: "9",
							children: halts[i].code
						})] }, halts[i].code)),
						marker && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
							transform: `translate(${marker.x.toFixed(1)}, ${marker.y.toFixed(1)})`,
							children: [isMoving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								r: 18,
								className: "fill-none stroke-primary/50 animate-ping",
								strokeWidth: 1
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								r: 8,
								className: "fill-primary text-primary-foreground"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2 border-t border-border bg-card/90 px-3 py-2 text-[10px] text-muted-foreground backdrop-blur-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-emerald-600" }), " Origin"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-blue-600" }), " Halts"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-red-600" }), " Destination"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 text-primary font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Real-Geography GPS Path" })]
				})]
			})
		]
	});
}
function format12Hour(totalMinutes) {
	const normalized = (totalMinutes % 1440 + 1440) % 1440;
	const hours = Math.floor(normalized / 60);
	const minutes = normalized % 60;
	const period = hours >= 12 ? "PM" : "AM";
	return `${hours % 12 === 0 ? 12 : hours % 12}:${minutes < 10 ? `0${minutes}` : `${minutes}`}${period}`;
}
function isMajorStation(halt, index, total, status) {
	if (index === 0 || index === total - 1) return true;
	if (status?.lastHalt.code === halt.code || status?.nextHalt?.code === halt.code) return true;
	const n = halt.name.toUpperCase();
	if (n.includes("JN") || n.includes("JUNCTION") || n.includes("CENT") || n.includes("CANTT") || n.includes("TERMINUS") || n.includes("MUMBAI") || n.includes("DELHI") || n.includes("HOWRAH") || n.includes("PATNA") || n.includes("PUNE") || n.includes("CHENNAI") || n.includes("AHMEDABAD") || n.includes("SURAT") || n.includes("VADODARA") || n.includes("KOTA") || n.includes("BHOPAL") || n.includes("DHANBAD") || n.includes("KANPUR") || n.includes("VARANASI")) return true;
	if (halt.dep - halt.arr >= 4) return true;
	return false;
}
function getCoachComposition(type) {
	const t = type.toLowerCase();
	if (t.includes("rajdhani") || t.includes("duronto")) return [
		{
			code: "LOCO",
			name: "Electric WAP-7 Engine",
			color: "bg-red-600 text-white"
		},
		{
			code: "EOG",
			name: "Generator Car",
			color: "bg-zinc-700 text-white"
		},
		{
			code: "H1",
			name: "First AC (1A)",
			color: "bg-amber-600 text-white"
		},
		{
			code: "A1",
			name: "AC 2-Tier (2A)",
			color: "bg-blue-600 text-white"
		},
		{
			code: "A2",
			name: "AC 2-Tier (2A)",
			color: "bg-blue-600 text-white"
		},
		{
			code: "PC",
			name: "Pantry Car",
			color: "bg-emerald-700 text-white"
		},
		{
			code: "B1",
			name: "AC 3-Tier (3A)",
			color: "bg-sky-600 text-white"
		},
		{
			code: "B2",
			name: "AC 3-Tier (3A)",
			color: "bg-sky-600 text-white"
		},
		{
			code: "B3",
			name: "AC 3-Tier (3A)",
			color: "bg-sky-600 text-white"
		},
		{
			code: "B4",
			name: "AC 3-Tier (3A)",
			color: "bg-sky-600 text-white"
		},
		{
			code: "B5",
			name: "AC 3-Tier (3A)",
			color: "bg-sky-600 text-white"
		},
		{
			code: "B6",
			name: "AC 3-Tier (3A)",
			color: "bg-sky-600 text-white"
		},
		{
			code: "EOG",
			name: "Generator Car",
			color: "bg-zinc-700 text-white"
		}
	];
	if (t.includes("shatabdi") || t.includes("vande")) return [
		{
			code: "LOCO",
			name: "Loco / Driving Cab",
			color: "bg-red-600 text-white"
		},
		{
			code: "E1",
			name: "Executive Chair (EC)",
			color: "bg-purple-600 text-white"
		},
		{
			code: "C1",
			name: "AC Chair Car (CC)",
			color: "bg-blue-600 text-white"
		},
		{
			code: "C2",
			name: "AC Chair Car (CC)",
			color: "bg-blue-600 text-white"
		},
		{
			code: "C3",
			name: "AC Chair Car (CC)",
			color: "bg-blue-600 text-white"
		},
		{
			code: "C4",
			name: "AC Chair Car (CC)",
			color: "bg-blue-600 text-white"
		},
		{
			code: "C5",
			name: "AC Chair Car (CC)",
			color: "bg-blue-600 text-white"
		},
		{
			code: "EOG",
			name: "Generator Car",
			color: "bg-zinc-700 text-white"
		}
	];
	return [
		{
			code: "LOCO",
			name: "Locomotive WAP-4",
			color: "bg-red-600 text-white"
		},
		{
			code: "SLR",
			name: "Seating Cum Luggage",
			color: "bg-zinc-700 text-white"
		},
		{
			code: "GS",
			name: "General Unreserved",
			color: "bg-amber-700 text-white"
		},
		{
			code: "S1",
			name: "Sleeper Class (SL)",
			color: "bg-emerald-600 text-white"
		},
		{
			code: "S2",
			name: "Sleeper Class (SL)",
			color: "bg-emerald-600 text-white"
		},
		{
			code: "S3",
			name: "Sleeper Class (SL)",
			color: "bg-emerald-600 text-white"
		},
		{
			code: "S4",
			name: "Sleeper Class (SL)",
			color: "bg-emerald-600 text-white"
		},
		{
			code: "B1",
			name: "AC 3-Tier (3A)",
			color: "bg-sky-600 text-white"
		},
		{
			code: "B2",
			name: "AC 3-Tier (3A)",
			color: "bg-sky-600 text-white"
		},
		{
			code: "A1",
			name: "AC 2-Tier (2A)",
			color: "bg-blue-600 text-white"
		},
		{
			code: "GS",
			name: "General Unreserved",
			color: "bg-amber-700 text-white"
		},
		{
			code: "SLR",
			name: "Luggage / Guard",
			color: "bg-zinc-700 text-white"
		}
	];
}
function getHaltRows(train, status) {
	return status?.haltStatus ?? train.halts.map((halt) => ({
		halt,
		scheduled: fmtMinutes(train.startsAt + halt.arr),
		expected: "—",
		forecast: null,
		done: false,
		isNext: false
	}));
}
function TrainTrackTimeline({ train, status, className = "", isGpsActive = false, isOnBoard = false, onToggleGps }) {
	const [refreshing, setRefreshing] = (0, import_react.useState)(false);
	const [showAllStations, setShowAllStations] = (0, import_react.useState)(false);
	const [expandedGroups, setExpandedGroups] = (0, import_react.useState)({});
	const coaches = getCoachComposition(train.type);
	const rows = getHaltRows(train, status);
	const isRunning = status ? status.speed > 0 && status.state === "running" : false;
	const isHalted = status ? status.state === "halted" : false;
	const handleRefresh = () => {
		setRefreshing(true);
		setTimeout(() => {
			setRefreshing(false);
		}, 400);
	};
	const todayStr = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short"
	});
	const toggleGroup = (groupId) => {
		setExpandedGroups((prev) => ({
			...prev,
			[groupId]: !prev[groupId]
		}));
	};
	const timelineItems = (0, import_react.useMemo)(() => {
		if (train.halts.length <= 7 || showAllStations) return rows.map((row, idx) => ({
			type: "station",
			row,
			originalIdx: idx
		}));
		const items = [];
		let currentIntermediate = [];
		rows.forEach((row, idx) => {
			if (isMajorStation(row.halt, idx, rows.length, status)) {
				if (currentIntermediate.length > 0) {
					const groupId = `group-${currentIntermediate[0].originalIdx}-${idx}`;
					const isPassed = currentIntermediate.every((item) => item.row.done);
					const containsLiveTrain = currentIntermediate.some((item) => status?.lastHalt.code === item.row.halt.code || status?.nextHalt?.code === item.row.halt.code);
					items.push({
						type: "intermediate-group",
						groupId,
						items: currentIntermediate,
						isPassed,
						containsLiveTrain
					});
					currentIntermediate = [];
				}
				items.push({
					type: "station",
					row,
					originalIdx: idx
				});
			} else currentIntermediate.push({
				row,
				originalIdx: idx
			});
		});
		if (currentIntermediate.length > 0) {
			const groupId = `group-${currentIntermediate[0].originalIdx}-end`;
			const isPassed = currentIntermediate.every((item) => item.row.done);
			const containsLiveTrain = currentIntermediate.some((item) => status?.lastHalt.code === item.row.halt.code || status?.nextHalt?.code === item.row.halt.code);
			items.push({
				type: "intermediate-group",
				groupId,
				items: currentIntermediate,
				isPassed,
				containsLiveTrain
			});
		}
		return items;
	}, [
		train.halts.length,
		showAllStations,
		rows,
		status
	]);
	const renderStationRow = (row, idx, isIntermediate = false) => {
		const isOrigin = idx === 0;
		const isDestination = idx === rows.length - 1;
		const isLastHalt = status?.lastHalt.code === row.halt.code;
		const isNextHalt = status?.nextHalt?.code === row.halt.code;
		const isTrainHaltedHere = isHalted && isLastHalt;
		const showEnRouteAfterThis = isRunning && isLastHalt && status.nextHalt;
		const isRowPassed = row.done || isLastHalt && isRunning;
		const isTopTraversed = row.done || isLastHalt;
		const isBottomTraversed = isRowPassed;
		const prevDay = idx > 0 ? rows[idx - 1].halt.day : 1;
		const currentDay = row.halt.day;
		const showDayDivider = currentDay > prevDay;
		const schedArrMin = train.startsAt + row.halt.arr;
		const schedDepMin = train.startsAt + row.halt.dep;
		const schedArrTime = format12Hour(schedArrMin);
		const schedDepTime = format12Hour(schedDepMin);
		const delayMin = row.forecast?.delayMin ?? (isRowPassed ? 0 : status?.delay ?? 0);
		const predArrTime = format12Hour(schedArrMin + delayMin);
		const predDepTime = format12Hour(schedDepMin + delayMin);
		const isDelayed = delayMin > 2;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [
				showDayDivider && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex items-center justify-center py-2.5 bg-secondary/60 border-y border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute left-[72px] sm:left-[92px] inset-y-0 w-[24px] pointer-events-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute left-[4px] inset-y-0 w-[2.5px] ${isTopTraversed ? "bg-primary shadow-xs" : "bg-border"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute right-[4px] inset-y-0 w-[2.5px] ${isTopTraversed ? "bg-primary shadow-xs" : "bg-border"}` })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "relative z-10 inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-0.5 text-[10px] font-bold text-primary shadow-xs",
						children: [
							"DAY ",
							currentDay,
							" • TOMORROW"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `grid grid-cols-[65px_minmax(0,1fr)_65px] sm:grid-cols-[85px_minmax(0,1fr)_85px] items-stretch ${isIntermediate ? "min-h-[48px] bg-secondary/10 hover:bg-secondary/25" : "min-h-[58px] hover:bg-secondary/20"} px-3 transition-colors ${isTrainHaltedHere ? "bg-secondary/60" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col justify-center text-left pl-1 py-2",
							children: isOrigin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted-foreground font-mono",
								children: "—"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `block font-mono ${isIntermediate ? "text-[10px] text-muted-foreground/80 font-medium" : "text-[11px] font-semibold"} ${isDelayed ? "text-muted-foreground line-through" : isIntermediate ? "text-muted-foreground" : "text-foreground"}`,
								children: schedArrTime
							}), isDelayed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-mono text-[10px] font-bold text-rail-alert",
								children: predArrTime
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `block font-mono ${isIntermediate ? "text-[8.5px] text-muted-foreground/60" : "text-[9px] font-semibold text-rail-live"}`,
								children: isIntermediate ? "Pass" : isRowPassed ? "Arr" : "On time"
							})] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex items-stretch gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex w-6 sm:w-7 shrink-0 items-center justify-center self-stretch",
								children: [
									!isOrigin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute left-[4px] top-0 bottom-1/2 w-[2.5px] ${isTopTraversed ? "bg-primary shadow-xs" : "bg-border"}` }),
									!isDestination && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute left-[4px] top-1/2 bottom-0 w-[2.5px] ${isBottomTraversed ? "bg-primary shadow-xs" : "bg-border"}` }),
									!isOrigin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute right-[4px] top-0 bottom-1/2 w-[2.5px] ${isTopTraversed ? "bg-primary shadow-xs" : "bg-border"}` }),
									!isDestination && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute right-[4px] top-1/2 bottom-0 w-[2.5px] ${isBottomTraversed ? "bg-primary shadow-xs" : "bg-border"}` }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-y-0 left-0 right-0 flex flex-col justify-between py-1.5 pointer-events-none",
										children: [...Array(5)].map((_, sIdx) => {
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `mx-auto ${isIntermediate ? "h-[1.5px] w-[14px] opacity-40" : "h-[2px] w-[18px]"} rounded-xs ${(sIdx <= 2 ? isTopTraversed : isBottomTraversed) ? "bg-primary/50" : "bg-border"}` }, sIdx);
										})
									}),
									isTrainHaltedHere && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "relative z-20 flex size-6 sm:size-6.5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs ring-2 ring-primary/40",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainFront, { className: "size-3.5" })
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col justify-center min-w-0 flex-1 py-1.5 border-b border-border/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 truncate",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/station/$code",
										params: { code: row.halt.code },
										className: `block transition-colors hover:underline truncate ${isTrainHaltedHere ? "text-primary text-sm font-extrabold" : isNextHalt ? "text-foreground text-sm font-bold" : isIntermediate ? "text-muted-foreground hover:text-foreground text-[11px] font-medium" : "text-foreground text-xs hover:text-primary font-bold"}`,
										children: row.halt.name
									}), isIntermediate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex items-center rounded-xs bg-secondary/80 border border-border/40 px-1 py-0.2 text-[7.5px] font-semibold text-muted-foreground uppercase tracking-wider",
										children: "Pass"
									}) : (isOrigin || isDestination) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex items-center rounded-xs bg-primary/10 border border-primary/20 px-1 py-0.2 text-[8px] font-bold text-primary uppercase",
										children: isOrigin ? "Origin" : "Dest"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-0.5 flex flex-wrap items-center gap-1.5 text-[9.5px] text-muted-foreground/80",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `font-mono ${isIntermediate ? "text-muted-foreground/70" : "font-semibold text-foreground/80"}`,
											children: row.halt.code
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [row.halt.km, " km"] }),
										row.halt.platform && row.halt.platform !== "-" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-0.5 rounded-md border border-border bg-secondary px-1 py-0.2 text-[8.5px] font-semibold text-secondary-foreground",
											children: [
												"PF ",
												row.halt.platform,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "size-2 opacity-50" })
											]
										})] }),
										isTrainHaltedHere && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "inline-flex items-center gap-1 rounded-md bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 text-[9px] font-bold text-amber-600 dark:text-amber-400",
											children: "Halted at Platform"
										}),
										!isRowPassed && row.forecast && row.forecast.delayMin > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DelayReasonTag, { reason: row.forecast.reason })
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col justify-center text-right pr-1 py-2",
							children: isDestination ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted-foreground font-mono",
								children: "—"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `block font-mono ${isIntermediate ? "text-[10px] text-muted-foreground/80 font-medium" : "text-[11px] font-semibold"} ${isDelayed ? "text-muted-foreground line-through" : isIntermediate ? "text-muted-foreground" : "text-foreground"}`,
								children: schedDepTime
							}), isDelayed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-mono text-[10px] font-bold text-rail-alert",
								children: predDepTime
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `block font-mono ${isIntermediate ? "text-[8.5px] text-muted-foreground/60" : "text-[9px] font-semibold text-rail-live"}`,
								children: isIntermediate ? "Pass" : isRowPassed ? "Dep" : "On time"
							})] })
						})
					]
				}),
				showEnRouteAfterThis && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[65px_minmax(0,1fr)_65px] sm:grid-cols-[85px_minmax(0,1fr)_85px] items-stretch min-h-[56px] px-3 bg-primary/5 border-y border-primary/15",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-center text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[10px] text-primary/80 font-bold",
								children: [status.speed, " km/h"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex items-stretch gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex w-6 sm:w-7 shrink-0 items-center justify-center self-stretch",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-[4px] top-0 bottom-1/2 w-[2.5px] bg-primary shadow-xs" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-[4px] top-1/2 bottom-0 w-[2.5px] bg-border" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-[4px] top-0 bottom-1/2 w-[2.5px] bg-primary shadow-xs" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-[4px] top-1/2 bottom-0 w-[2.5px] bg-border" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-y-0 left-0 right-0 flex flex-col justify-between py-1.5 pointer-events-none",
										children: [...Array(5)].map((_, sIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `mx-auto h-[2px] w-[18px] rounded-xs ${sIdx <= 2 ? "bg-primary/50" : "bg-border"}` }, sIdx))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative z-20 flex size-6 sm:size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-float ring-3 ring-primary/30",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -inset-1 rounded-full bg-primary/35 animate-rail-pulse pointer-events-none" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -inset-2.5 rounded-full border border-primary/40 animate-ping opacity-75 pointer-events-none" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainFront, { className: "relative z-10 size-3.5" })
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center min-w-0 flex-1 py-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-1.5 rounded-xl border border-primary/25 bg-card/90 px-3 py-1.5 shadow-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flex size-2 rounded-full bg-primary animate-rail-pulse" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-primary text-xs",
											children: [
												"En Route · ",
												status.speed,
												" km/h"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-muted-foreground",
											children: [
												"(",
												Math.max(1, status.km - status.lastHalt.km),
												" km past ",
												status.lastHalt.code,
												" →",
												" ",
												Math.max(1, (status.nextHalt?.km ?? status.km) - status.km),
												" km to",
												" ",
												status.nextHalt?.code,
												")"
											]
										})
									]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-center text-right pr-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[10px] text-primary/80 font-bold",
								children: ["ETA ", status.etaNext]
							})
						})
					]
				})
			]
		}, row.halt.code);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-card ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2 border-b border-border bg-subtle-gradient px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainFront, { className: "size-4 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-bold text-foreground tracking-tight",
							children: "Journey · Station Sequence"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-xs text-muted-foreground",
							children: [
								"(",
								train.number,
								" ",
								train.name,
								")"
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						train.halts.length > 7 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setShowAllStations(!showAllStations),
							className: `inline-flex items-center gap-1 rounded-xl border px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${showAllStations ? "border-primary bg-primary text-primary-foreground shadow-xs" : "border-border bg-secondary/80 text-secondary-foreground hover:bg-secondary"}`,
							title: "Toggle between Major Stopping Stations and All Stations",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: showAllStations ? "All Stations" : "Stops Only" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "inline-flex items-center gap-1 rounded-xl border border-border bg-secondary/80 px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground transition-colors hover:bg-secondary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Today ▾" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "inline-flex items-center gap-1 rounded-xl border border-border bg-secondary/80 px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground transition-colors hover:bg-secondary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-3 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Coach" })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
							side: "bottom",
							className: "max-h-[85vh] rounded-t-3xl border-t border-border bg-card text-card-foreground p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
								className: "text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetTitle, {
									className: "text-lg font-bold flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainFront, { className: "size-5 text-primary" }),
										"Coach Position & Rake Layout — ",
										train.number,
										" ",
										train.name
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Typical rake composition from engine to rear brake van. Platform coach displays may vary by station."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 overflow-x-auto pb-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex min-w-max items-center gap-2 py-2",
									children: coaches.map((c, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `flex h-18 w-22 flex-col items-center justify-center rounded-xl p-2 text-center shadow-md ${c.color}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-sm font-extrabold",
											children: c.code
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] opacity-90 truncate max-w-full",
											children: c.name
										})]
									}, idx))
								})
							})]
						})] })
					]
				})]
			}),
			isGpsActive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 border-b border-primary/20 bg-primary/10 px-4 py-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flex size-2 rounded-full bg-primary animate-rail-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-primary",
						children: isOnBoard ? "On-Board Live GPS Tracking Active" : "GPS Sensor Active (Proximity Synced)"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[11px] text-muted-foreground",
					children: "Live satellite sync"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[65px_minmax(0,1fr)_65px] sm:grid-cols-[85px_minmax(0,1fr)_85px] items-center border-b border-border bg-secondary/30 px-3 py-2 text-center text-[10px] font-bold tracking-wider text-muted-foreground uppercase",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-left pl-1",
						children: "ARRIVAL"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-0.5 text-[9px] font-semibold text-foreground shadow-xs",
							children: ["DAY 1 • ", todayStr.toUpperCase()]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-right pr-1",
						children: "DEPARTURE"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-0",
				children: timelineItems.map((item) => {
					if (item.type === "station") return renderStationRow(item.row, item.originalIdx, false);
					const isExpanded = expandedGroups[item.groupId] ?? item.containsLiveTrain;
					const count = item.items.length;
					const startKm = item.items[0].row.halt.km;
					const distanceDiff = item.items[count - 1].row.halt.km - startKm;
					if (isExpanded) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [item.items.map((subItem) => renderStationRow(subItem.row, subItem.originalIdx, true)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[65px_minmax(0,1fr)_65px] sm:grid-cols-[85px_minmax(0,1fr)_85px] items-stretch min-h-[34px] px-3 bg-secondary/15 border-b border-border/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex items-stretch gap-3 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative flex w-6 sm:w-7 shrink-0 items-center justify-center self-stretch",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute left-[4px] inset-y-0 w-[2.5px] ${item.isPassed ? "bg-primary shadow-xs" : "bg-border"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute right-[4px] inset-y-0 w-[2.5px] ${item.isPassed ? "bg-primary shadow-xs" : "bg-border"}` })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center min-w-0 flex-1 py-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => toggleGroup(item.groupId),
											className: "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold text-primary hover:bg-secondary/60 transition-colors cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"Hide ",
												count,
												" in-between stations"
											] })]
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {})
							]
						})]
					}, item.groupId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[65px_minmax(0,1fr)_65px] sm:grid-cols-[85px_minmax(0,1fr)_85px] items-stretch min-h-[46px] px-3 bg-secondary/30 transition-colors hover:bg-secondary/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center justify-center text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-mono text-muted-foreground/75",
										children: distanceDiff > 0 ? `+${distanceDiff} km` : ""
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex items-stretch gap-3 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative flex w-6 sm:w-7 shrink-0 items-center justify-center self-stretch",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute left-[4px] inset-y-0 w-[2.5px] ${item.isPassed ? "bg-primary shadow-xs" : "bg-border"}` }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute right-[4px] inset-y-0 w-[2.5px] ${item.isPassed ? "bg-primary shadow-xs" : "bg-border"}` }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "absolute inset-y-0 left-0 right-0 flex flex-col justify-between py-1 pointer-events-none",
												children: [...Array(4)].map((_, sIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `mx-auto h-[1.5px] w-[15px] opacity-50 rounded-xs ${item.isPassed ? "bg-primary/50" : "bg-border"}` }, sIdx))
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center min-w-0 flex-1 py-1.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => toggleGroup(item.groupId),
											className: "flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-xs hover:border-primary/40 hover:bg-secondary/40 transition-all cursor-pointer w-full text-left truncate",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3 text-primary shrink-0" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-primary font-bold",
													children: [
														"▾ ",
														count,
														" in-between stations (Click to view)"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] text-muted-foreground truncate hidden sm:inline",
													children: [
														"(",
														item.items.map((i) => i.row.halt.code).join(", "),
														")"
													]
												})
											]
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center justify-center text-right pr-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] text-muted-foreground/75 font-mono",
										children: [count, " stops"]
									})
								})
							]
						})
					}, item.groupId);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-t border-border bg-subtle-gradient px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-bold text-foreground",
					children: status?.state === "halted" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["At ", status.lastHalt.name] }) : status?.nextHalt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"En Route: ",
						status.lastHalt.name,
						" → ",
						status.nextHalt.name
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["At ", train.halts[0].name] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-0.5 flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex items-center rounded-md bg-secondary border border-border px-1.5 py-0.2 text-[9px] font-bold text-primary uppercase tracking-wide",
						children: isGpsActive ? `GPS LIVE (${status ? status.speed : 0} KM/H)` : status ? status.speed > 0 ? `RUNNING (${status.speed} KM/H)` : "HALTED" : "SCHEDULED"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-muted-foreground",
						children: isGpsActive ? "Live GPS sensor" : "Updated few seconds ago"
					})]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: onToggleGps,
						className: `inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition-all cursor-pointer ${isGpsActive ? "border-primary bg-primary text-primary-foreground shadow-float ring-2 ring-primary/20" : "border-border bg-secondary text-secondary-foreground hover:bg-secondary/80"}`,
						children: [isGpsActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Satellite, { className: "size-3.5 animate-pulse" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isGpsActive ? "In Train (GPS Active)" : "In Train?" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleRefresh,
						className: "flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs hover:opacity-90 transition-opacity",
						title: "Refresh Live Status",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: `size-3.5 ${refreshing ? "animate-spin" : ""}` })
					})]
				})]
			})
		]
	});
}
function haversineKm(lat1, lon1, lat2, lon2) {
	const R = 6371;
	const dLat = (lat2 - lat1) * Math.PI / 180;
	const dLon = (lon2 - lon1) * Math.PI / 180;
	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function createForecast(arrMin) {
	return {
		predictedDelayShiftMin: 0,
		delayMin: 0,
		confidence: .98,
		lowerEta: fmtMinutes(arrMin - 2),
		upperEta: fmtMinutes(arrMin + 2),
		intervalMin: 4,
		reason: "unknown",
		etaMin: arrMin,
		eta: fmtMinutes(arrMin)
	};
}
/**
* Snap user GPS coordinates to closest halt / progress along the train route.
*/
function computeGpsStatus(train, gps) {
	const halts = train.halts;
	const totalKm = halts[halts.length - 1].km || 1;
	let closestHaltIdx = 0;
	let minDistance = Infinity;
	halts.forEach((h, idx) => {
		const dist = haversineKm(gps.lat, gps.lng, h.lat, h.lng);
		if (dist < minDistance) {
			minDistance = dist;
			closestHaltIdx = idx;
		}
	});
	const closestHalt = halts[closestHaltIdx];
	const isLast = closestHaltIdx === halts.length - 1;
	const currentKm = closestHalt.km;
	const progress = Math.min(100, Math.max(0, currentKm / totalKm * 100));
	const speed = gps.speedKmH > 0 ? Math.round(gps.speedKmH) : 48;
	const state = speed < 5 ? "halted" : "running";
	const nextHalt = isLast ? null : halts[closestHaltIdx + 1];
	const nextArrMin = train.startsAt + (nextHalt?.arr ?? closestHalt.arr);
	const haltStatus = halts.map((h, idx) => {
		const isDone = idx < closestHaltIdx;
		const isNext = idx === closestHaltIdx || idx === closestHaltIdx + 1;
		const haltArrMin = train.startsAt + h.arr;
		return {
			halt: h,
			scheduled: fmtMinutes(haltArrMin),
			expected: fmtMinutes(haltArrMin),
			forecast: createForecast(haltArrMin),
			done: isDone,
			isNext
		};
	});
	return {
		state,
		speed,
		lat: gps.lat,
		lng: gps.lng,
		km: currentKm,
		progress,
		delay: 0,
		delayReason: "unknown",
		confidence: .98,
		lastHalt: closestHalt,
		nextHalt,
		etaNext: nextHalt ? fmtMinutes(train.startsAt + nextHalt.arr) : "Arrived",
		haltStatus,
		updatedAt: gps.timestamp,
		forecast: createForecast(nextArrMin)
	};
}
function useOnBoardGps(train) {
	const [isActive, setIsActive] = (0, import_react.useState)(false);
	const [location, setLocation] = (0, import_react.useState)(null);
	const [isOnBoard, setIsOnBoard] = (0, import_react.useState)(false);
	const [distanceToRouteKm, setDistanceToRouteKm] = (0, import_react.useState)(null);
	const [gpsStatus, setGpsStatus] = (0, import_react.useState)(null);
	const watchIdRef = (0, import_react.useRef)(null);
	const stopWatching = (0, import_react.useCallback)(() => {
		if (watchIdRef.current !== null && typeof navigator !== "undefined" && navigator.geolocation) {
			navigator.geolocation.clearWatch(watchIdRef.current);
			watchIdRef.current = null;
		}
	}, []);
	const handlePosition = (0, import_react.useCallback)((pos) => {
		const { latitude: lat, longitude: lng, speed: rawSpeed, accuracy } = pos.coords;
		const gps = {
			lat,
			lng,
			speedKmH: rawSpeed && rawSpeed > 0 ? rawSpeed * 3.6 : 0,
			accuracy,
			timestamp: pos.timestamp
		};
		setLocation(gps);
		let minHaltDist = Infinity;
		train.halts.forEach((h) => {
			const d = haversineKm(lat, lng, h.lat, h.lng);
			if (d < minHaltDist) minHaltDist = d;
		});
		const distRounded = Math.round(minHaltDist);
		setDistanceToRouteKm(distRounded);
		if (minHaltDist <= 25) {
			setIsOnBoard(true);
			const live = computeGpsStatus(train, gps);
			setGpsStatus(live);
			toast.success(`Connected to On-Board GPS! Train location synced to your device.`);
		} else {
			setIsOnBoard(false);
			const live = computeGpsStatus(train, gps);
			setGpsStatus(live);
			toast.info(`GPS active (${distRounded} km from route). Location synced using your GPS sensor.`);
		}
	}, [train]);
	const toggleGps = (0, import_react.useCallback)(() => {
		if (isActive) {
			stopWatching();
			setIsActive(false);
			setLocation(null);
			setGpsStatus(null);
			setIsOnBoard(false);
			toast.info("On-board GPS mode turned off. Showing network timetable estimation.");
			return;
		}
		if (typeof navigator === "undefined" || !navigator.geolocation) {
			toast.error("Geolocation is not supported by your browser.");
			return;
		}
		setIsActive(true);
		toast.loading("Acquiring GPS satellite fix...");
		navigator.geolocation.getCurrentPosition((pos) => {
			handlePosition(pos);
			watchIdRef.current = navigator.geolocation.watchPosition(handlePosition, (err) => {
				console.warn("GPS watch error:", err.message);
			}, {
				enableHighAccuracy: true,
				maximumAge: 3e3,
				timeout: 1e4
			});
		}, (err) => {
			setIsActive(false);
			if (err.code === 1) toast.error("Location permission denied. Please allow location access in your browser.");
			else toast.error(`GPS Fix failed: ${err.message}`);
		}, {
			enableHighAccuracy: true,
			timeout: 1e4
		});
	}, [
		isActive,
		stopWatching,
		handlePosition
	]);
	(0, import_react.useEffect)(() => {
		return () => {
			stopWatching();
		};
	}, [stopWatching]);
	return {
		isActive,
		location,
		isOnBoard,
		distanceToRouteKm,
		gpsStatus,
		toggleGps
	};
}
function TrainStatus() {
	const { train } = Route$1.useLoaderData();
	const { t } = useTranslation();
	const now = useLiveClock(4e3);
	const gps = useOnBoardGps(train);
	const status = gps.isActive && gps.gpsStatus ? gps.gpsStatus : now ? computeLiveStatus(train, now) : null;
	const dest = train.halts[train.halts.length - 1];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 py-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }),
							" ",
							t("train.liveBoard")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap items-end justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-semibold tracking-widest text-muted-foreground uppercase",
								children: [
									train.type,
									" ·",
									" ",
									train.runsOn.length === 7 ? t("train.runsDaily") : t("train.runsOn", { days: train.runsOn.join(", ") })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-1 text-3xl font-bold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: train.number
									}),
									" ",
									train.name
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/station/$code",
										params: { code: train.halts[0].code },
										className: "hover:text-foreground hover:underline",
										children: [
											train.halts[0].name,
											" (",
											train.halts[0].code,
											")"
										]
									}),
									" → ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/station/$code",
										params: { code: dest.code },
										className: "hover:text-foreground hover:underline",
										children: [
											dest.name,
											" (",
											dest.code,
											")"
										]
									}),
									" · ",
									dest.km,
									" km · departs ",
									fmtMinutes(train.startsAt)
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-end gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `text-lg font-semibold ${gps.isActive ? "text-primary flex items-center gap-1.5 font-bold" : status ? delayTone(status) : "text-muted-foreground"}`,
								children: gps.isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Satellite, { className: "size-4 animate-pulse text-primary" }),
									" ",
									t("train.onBoardGps")
								] }) : status ? delayLabel(status) : "Fetching live feed…"
							}), status?.forecast && status.forecast.delayMin > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DelayReasonTag, { reason: status.delayReason })]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card p-5 shadow-card",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-4 sm:grid-cols-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "size-4 text-primary" }),
												label: t("train.speed"),
												value: status ? status.speed === 0 ? t("trainList.haltedState") : `${status.speed} km/h` : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4 text-accent" }),
												label: t("train.nextHalt"),
												value: status?.nextHalt ? status.nextHalt.code : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4 text-primary" }),
												label: t("train.predictedEta"),
												value: status ? status.etaNext : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, { className: "size-4 text-accent" }),
												label: t("train.covered"),
												value: status ? `${status.km} km` : "—"
											})
										]
									}),
									status?.forecast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EtaConfidenceBadge, { confidence: status.forecast.confidence }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: gps.isActive ? t("train.realTimeLocation") : t("train.forecastWindow", {
												lower: status.forecast.lowerEta,
												upper: status.forecast.upperEta,
												station: status.nextHalt?.name ?? "destination"
											}) + ` ${status.forecast.delayMin > 0 ? `(+${status.forecast.delayMin} min)` : "(on time)"}`
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative mt-5 h-1.5 overflow-hidden rounded-full bg-secondary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute inset-y-0 left-0 rounded-full bg-hero-gradient transition-all duration-1000",
											style: { width: `${status?.progress ?? 0}%` }
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-3 ring-primary/20 transition-all duration-1000",
											style: { left: `${status?.progress ?? 0}%` }
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs text-muted-foreground",
										children: gps.isActive ? `On-board GPS active · synced via passenger device` : status ? t("train.lastReported", {
											station: status.lastHalt.name,
											time: new Date(status.updatedAt).toLocaleTimeString()
										}) : "Waiting for the first position report…"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainTrackTimeline, {
								train,
								status,
								isGpsActive: gps.isActive,
								isOnBoard: gps.isOnBoard,
								onToggleGps: gps.toggleGps
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sticky top-20 rounded-2xl border border-border bg-card p-4 shadow-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-3 flex items-center justify-between border-b border-border pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-sm font-bold text-foreground",
										children: t("train.gpsRoutePath")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: gps.isActive ? "Live passenger GPS tracking" : "Real-geography alignment & live position"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-md bg-secondary px-2 py-0.5 font-mono text-[11px] font-semibold text-primary",
										children: t("train.stationsCount", { count: train.halts.length })
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouteMap, {
									halts: train.halts,
									position: status ? {
										lat: status.lat,
										lng: status.lng
									} : null,
									isMoving: status ? status.speed > 0 && status.state === "running" : false,
									className: "h-[520px] w-full rounded-xl"
								})]
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})
		]
	});
}
function Stat({ icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "flex items-center gap-1.5 text-xs text-muted-foreground",
		children: [icon, label]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-1 text-lg font-semibold",
		children: value
	})] });
}
//#endregion
export { TrainStatus as component };
