import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { h as useTranslation } from "./rail-BA0H0A_E.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as SiteHeader, u as SiteFooter } from "./Sections-DOjZPygy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/station._code-D9X3o-sf.js
var import_jsx_runtime = require_jsx_runtime();
function StationNotFound() {
	const { t } = useTranslation();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-2xl px-4 py-24 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold",
						children: t("station.notFoundTitle")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted-foreground",
						children: t("station.notFoundMsg")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "mt-6 inline-block text-primary underline",
						children: t("station.backToBoard")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { StationNotFound as notFoundComponent };
