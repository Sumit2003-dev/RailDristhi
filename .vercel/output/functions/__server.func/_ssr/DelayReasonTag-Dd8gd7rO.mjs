import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { R as CloudRain, V as CircleQuestionMark, a as TrainFront, n as Wrench, r as TriangleAlert, u as Signal } from "../_libs/lucide-react.mjs";
import { m as cn } from "./Sections-SSZ3XXHL.mjs";
import { n as confidenceTier } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DelayReasonTag-Dd8gd7rO.js
var import_jsx_runtime = require_jsx_runtime();
function EtaConfidenceBadge({ confidence, className }) {
	const tier = confidenceTier(confidence);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-1.5 py-0.5 text-[10px] font-semibold", tier.tone, className),
		title: `Prediction confidence: ${Math.round(confidence * 100)}%`,
		children: [
			tier.label,
			" · ",
			Math.round(confidence * 100),
			"%"
		]
	});
}
var reasonIcon = {
	weather: CloudRain,
	congestion: TrainFront,
	"track-work": Wrench,
	"signal-failure": Signal,
	technical: TriangleAlert,
	unknown: CircleQuestionMark
};
var reasonTone = {
	weather: "text-sky-600",
	congestion: "text-amber-600",
	"track-work": "text-orange-600",
	"signal-failure": "text-red-600",
	technical: "text-purple-600",
	unknown: "text-muted-foreground"
};
var reasonLabel = {
	weather: "Weather",
	congestion: "Congestion",
	"track-work": "Track work",
	"signal-failure": "Signal",
	technical: "Technical",
	unknown: "Unknown"
};
function DelayReasonTag({ reason, className }) {
	const Icon = reasonIcon[reason] ?? CircleQuestionMark;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-1.5 py-0.5 text-[10px] font-semibold", reasonTone[reason], className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3" }), reasonLabel[reason]]
	});
}
//#endregion
export { EtaConfidenceBadge as n, DelayReasonTag as t };
