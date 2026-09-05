import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { l as useTranslation, t as LanguageProvider } from "./rail-bkfOfZ1j.mjs";
import { _ as useRouter, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route$7 } from "./station._code-C_L2Uiwe.mjs";
import { t as Route$8 } from "./train._number-trFqpvCU.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DMoePzF-.js
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-WyV-U29q.css";
function NotFoundComponent() {
	const { t } = useTranslation();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: t("common.pageNotFound")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: t("common.pageNotFoundMsg")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: t("common.goHome")
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	const { t } = useTranslation();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: t("common.errorTitle")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: t("common.errorMsg")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: t("common.tryAgain")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: t("common.goHome")
					})]
				})
			]
		})
	});
}
var Route$6 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "RailDristhi" },
			{
				name: "author",
				content: "RailDristhi"
			},
			{
				property: "og:title",
				content: "RailDristhi"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			},
			{
				rel: "alternate icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "apple-touch-icon",
				href: "/favicon.svg"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageProvider, { children }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$6.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var $$splitComponentImporter$5 = () => import("./routes-Bz_RsE0A.mjs");
var Route$5 = createFileRoute("/")({
	component: lazyRouteComponent($$splitComponentImporter$5, "component"),
	head: () => ({ meta: [
		{ title: "RailDristhi — Live ETA Forecast & Train Running Status" },
		{
			name: "description",
			content: "Track Indian Railways trains live on a GPS map, see model-predicted arrival times with confidence, delay causes and a control-room dashboard."
		},
		{
			property: "og:title",
			content: "RailDristhi — Live ETA Forecast & Train Running Status"
		},
		{
			property: "og:description",
			content: "Live GPS train tracking with predicted ETA, delay cause detection and a control-room view for Indian Railways."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] })
});
var $$splitComponentImporter$4 = () => import("./connecting-impact-BTaGWWwm.mjs");
var Route$4 = createFileRoute("/connecting-impact")({
	component: lazyRouteComponent($$splitComponentImporter$4, "component"),
	head: () => ({ meta: [{ title: "Connecting Trains Impact & Transfer Risk Calculator | RailDristhi" }, {
		name: "description",
		content: "Calculate connection feasibility and platform transfer margins when switching trains at Indian Railways junction stations based on live ETA delay forecasts."
	}] })
});
var $$splitComponentImporter$3 = () => import("./control-room-C_yjEGSh.mjs");
var Route$3 = createFileRoute("/control-room")({
	component: lazyRouteComponent($$splitComponentImporter$3, "component"),
	head: () => ({ meta: [
		{ title: "Control room — RailDristhi" },
		{
			name: "description",
			content: "Control-room dashboard: predicted ETA, delay causes and network-wide alerts from the RailDristhi forecasting model."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] })
});
var $$splitComponentImporter$2 = () => import("./developer-Cu3Lfi1g.mjs");
var Route$2 = createFileRoute("/developer")({
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
	head: () => ({ meta: [{ title: "Developer REST API & Interactive Sandbox | RailDristhi" }, {
		name: "description",
		content: "Integrate real-time train tracking, ETA forecasts, delay classification, station boards, and PNR status into your applications with our high-speed REST API."
	}] })
});
var $$splitComponentImporter$1 = () => import("./network-Bo-kineY.mjs");
var Route$1 = createFileRoute("/network")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	head: () => ({ meta: [
		{ title: "Live network map — RailDristhi" },
		{
			name: "description",
			content: "See every tracked train across the Indian Railways network on one live GPS map."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] })
});
var $$splitComponentImporter = () => import("./pnr-dhZfd8C8.mjs");
var Route = createFileRoute("/pnr")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [{ title: "Live PNR Status & Coach Position | RailDristhi" }, {
		name: "description",
		content: "Check real-time Indian Railways PNR status, coach and berth allocations, chart preparation state, and live train location."
	}] })
});
var rootRouteChildren = {
	IndexRoute: Route$5.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$6
	}),
	ConnectingImpactRoute: Route$4.update({
		id: "/connecting-impact",
		path: "/connecting-impact",
		getParentRoute: () => Route$6
	}),
	ControlRoomRoute: Route$3.update({
		id: "/control-room",
		path: "/control-room",
		getParentRoute: () => Route$6
	}),
	DeveloperRoute: Route$2.update({
		id: "/developer",
		path: "/developer",
		getParentRoute: () => Route$6
	}),
	NetworkRoute: Route$1.update({
		id: "/network",
		path: "/network",
		getParentRoute: () => Route$6
	}),
	PnrRoute: Route.update({
		id: "/pnr",
		path: "/pnr",
		getParentRoute: () => Route$6
	}),
	StationCodeRoute: Route$7.update({
		id: "/station/$code",
		path: "/station/$code",
		getParentRoute: () => Route$6
	}),
	TrainNumberRoute: Route$8.update({
		id: "/train/$number",
		path: "/train/$number",
		getParentRoute: () => Route$6
	})
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
