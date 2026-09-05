import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Q as ArrowRight, a as TrainFront, c as Sparkles, d as ShieldCheck, f as ShieldAlert, r as TriangleAlert, z as Clock } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as SiteFooter, f as SiteHeader, n as Button } from "./Sections-SSZ3XXHL.mjs";
import { t as Input } from "./input-BaHNVncY.mjs";
import { t as Toaster$1 } from "./sonner-DoFKumIW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/connecting-impact-BTaGWWwm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ConnectingImpactPage() {
	const [incoming, setIncoming] = (0, import_react.useState)("12951");
	const [connecting, setConnecting] = (0, import_react.useState)("12001");
	const [station, setStation] = (0, import_react.useState)("NDLS");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const handleCalculate = async (e) => {
		if (e) e.preventDefault();
		if (!incoming || !connecting || !station) {
			toast.error("Please enter incoming train, connecting train, and transfer station code");
			return;
		}
		setLoading(true);
		try {
			const data = await (await fetch(`/api/v1/connecting-impact?incoming=${encodeURIComponent(incoming)}&connecting=${encodeURIComponent(connecting)}&station=${encodeURIComponent(station)}`)).json();
			if (data.error || !data.data) {
				toast.error(data.message || "Could not calculate transfer impact");
				setResult(null);
			} else {
				setResult(data.data);
				toast.success("Transfer impact calculated");
			}
		} catch {
			toast.error("Failed to connect to transfer risk service");
		} finally {
			setLoading(false);
		}
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
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), " Live Transfer Risk Intelligence"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-3 text-3xl font-bold tracking-tight sm:text-4xl",
								children: "Connecting Train Impact & Transfer Margin"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground max-w-xl mx-auto",
								children: "Evaluate whether an incoming service delay puts your onward connecting train at risk using model-predicted ETA confidence windows."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCalculate,
						className: "mt-8 rounded-3xl border border-border bg-card p-6 shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-muted-foreground uppercase",
									children: "Incoming Train Number"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: incoming,
									onChange: (e) => setIncoming(e.target.value),
									placeholder: "e.g. 12951",
									className: "mt-1.5 font-mono"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-muted-foreground uppercase",
									children: "Transfer Junction Station"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: station,
									onChange: (e) => setStation(e.target.value),
									placeholder: "e.g. NDLS",
									className: "mt-1.5 font-mono"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-muted-foreground uppercase",
									children: "Connecting Train Number"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: connecting,
									onChange: (e) => setConnecting(e.target.value),
									placeholder: "e.g. 12001",
									className: "mt-1.5 font-mono"
								})] })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							disabled: loading,
							className: "mt-5 w-full h-11 rounded-xl font-semibold gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" }),
								" ",
								loading ? "Analyzing transfer..." : "Calculate Transfer Margin"
							]
						})]
					}),
					result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 space-y-6 animate-in fade-in duration-300",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `rounded-3xl border p-6 shadow-card ${result.transferFeasibility === "SAFE" ? "border-rail-live/40 bg-rail-live/10" : result.transferFeasibility === "RISKY" ? "border-rail-late/40 bg-rail-late/10" : "border-rail-alert/40 bg-rail-alert/10"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `flex size-12 items-center justify-center rounded-2xl ${result.transferFeasibility === "SAFE" ? "bg-rail-live text-white" : result.transferFeasibility === "RISKY" ? "bg-rail-late text-white" : "bg-rail-alert text-white"}`,
											children: result.transferFeasibility === "SAFE" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-6" }) : result.transferFeasibility === "RISKY" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-6" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
											children: "Transfer Status"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-2xl font-bold",
											children: result.transferFeasibility === "SAFE" ? "Safe Connection" : result.transferFeasibility === "RISKY" ? "Tight Connection Warning" : "Missed Connection Expected"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Effective Buffer"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-2xl font-mono font-bold",
											children: [result.effectiveBufferMinutes, " min"]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-sm font-medium",
									children: result.recommendation
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-6 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-border bg-card p-5 shadow-card",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-xs font-semibold text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainFront, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "INCOMING SERVICE" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "mt-2 text-lg font-bold",
											children: [
												result.incomingTrain.number,
												" ",
												result.incomingTrain.name
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-4 space-y-2 text-sm",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between border-b border-border pb-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground",
														children: "Scheduled Arrival"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono line-through text-muted-foreground",
														children: result.incomingTrain.scheduledArrival
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between border-b border-border pb-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground",
														children: "Model Predicted Arrival"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono font-bold text-primary",
														children: result.incomingTrain.predictedArrival
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground",
														children: "Confidence Window"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-mono text-xs",
														children: [
															result.incomingTrain.forecastWindow.lower,
															" –",
															" ",
															result.incomingTrain.forecastWindow.upper
														]
													})]
												})
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-border bg-card p-5 shadow-card",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-xs font-semibold text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainFront, { className: "size-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CONNECTING ONWARD SERVICE" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "mt-2 text-lg font-bold",
											children: [
												result.connectingTrain.number,
												" ",
												result.connectingTrain.name
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-4 space-y-2 text-sm",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between border-b border-border pb-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground",
														children: "Scheduled Departure"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono font-bold",
														children: result.connectingTrain.scheduledDeparture
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between border-b border-border pb-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground",
														children: "Departing Platform"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-semibold",
														children: ["Platform ", result.connectingTrain.platform]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground",
														children: "Scheduled Buffer"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-mono",
														children: [result.bufferMinutes, " min"]
													})]
												})
											]
										})
									]
								})]
							}),
							result.alternativeTrains.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card p-5 shadow-card",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "text-sm font-bold",
										children: ["Alternative Departures from ", result.transferStation.name]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: "Subsequent services available in case of transfer delay."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border",
										children: result.alternativeTrains.map((alt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between p-3 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-semibold",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground",
														children: alt.number
													}),
													" ",
													alt.name
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground",
												children: ["Departs at ", alt.departure]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/train/$number",
												params: { number: alt.number },
												className: "inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline",
												children: ["View Train ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3" })]
											})]
										}, alt.number))
									})
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})
		]
	});
}
//#endregion
export { ConnectingImpactPage as component };
