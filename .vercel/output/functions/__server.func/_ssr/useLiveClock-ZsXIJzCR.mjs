import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useLiveClock-ZsXIJzCR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/** Returns a Date that ticks every `ms`, or null before hydration (SSR-safe). */
function useLiveClock(ms = 5e3) {
	const [now, setNow] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setNow(/* @__PURE__ */ new Date());
		const id = setInterval(() => setNow(/* @__PURE__ */ new Date()), ms);
		return () => clearInterval(id);
	}, [ms]);
	return now;
}
//#endregion
export { useLiveClock as t };
