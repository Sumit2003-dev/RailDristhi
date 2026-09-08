import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as PRESET_AUTHORITIES, h as useTranslation, i as LanguageProvider, n as Badge, p as useAuth, r as Button, s as cn, t as AuthProvider } from "./rail-BA0H0A_E.mjs";
import { t as Input } from "./input-_99zOX8c.mjs";
import { _ as useRouter, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { M as KeyRound, N as Info, O as Lock, Y as CircleCheck, h as ShieldAlert, i as UserCheck, n as X, nt as Building2, ot as ArrowRight } from "../_libs/lucide-react.mjs";
import { a as TabsTrigger, i as TabsList, n as Tabs, r as TabsContent, t as Label } from "./tabs-DUZ_ARBI.mjs";
import { t as Route } from "./station._code-CiRFTHo4.mjs";
import { t as Route$8 } from "./train._number-DVdfJT-Z.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-D_9u5imp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
function AuthModal() {
	const { isAuthModalOpen, closeAuthModal, login, loginAsPreset } = useAuth();
	const [badgeId, setBadgeId] = (0, import_react.useState)("");
	const [pin, setPin] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setIsSubmitting(true);
		try {
			const res = await login(badgeId, pin);
			if (!res.success && res.error) setError(res.error);
			else {
				setBadgeId("");
				setPin("");
			}
		} catch {
			setError("Authentication error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};
	const handleSelectPreset = (preset) => {
		loginAsPreset(preset);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: isAuthModalOpen,
		onOpenChange: (open) => !open && closeAuthModal(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-[480px] p-0 overflow-hidden border-border bg-card shadow-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-gradient-to-r from-slate-900 via-primary/90 to-slate-900 p-6 text-white text-center relative overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-6 text-amber-400" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-xl font-bold tracking-tight text-white flex items-center justify-center gap-2",
						children: "Indian Railways Authority Portal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs text-white/80 mt-1 max-w-sm mx-auto",
						children: "Restricted Access Control — Ministry of Railways / Section Operations & Dispatch Console"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex items-center justify-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "bg-white/10 text-white border-white/20 text-[10px] uppercase tracking-wider py-0.5 px-2",
							children: "SIH 2026 Authorized Access"
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					defaultValue: "presets",
					className: "w-full",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "grid w-full grid-cols-2 mb-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "presets",
								className: "text-xs font-medium",
								children: "⚡ Quick Demo Profiles"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "manual",
								className: "text-xs font-medium",
								children: "🔑 Badge ID & PIN"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "presets",
							className: "space-y-3 mt-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg bg-secondary/50 p-2.5 text-xs text-muted-foreground flex items-start gap-2 border border-border/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-4 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Select any pre-verified Indian Railways authority profile below to instantly authenticate into the Control Room." })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2.5 pt-1",
								children: PRESET_AUTHORITIES.map((auth) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleSelectPreset(auth),
									className: "w-full text-left rounded-xl border border-border bg-background p-3.5 transition-all duration-200 hover:border-primary/50 hover:bg-secondary/40 hover:shadow-md group flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-sm text-foreground group-hover:text-primary transition-colors",
													children: auth.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "secondary",
													className: "text-[10px] font-mono py-0 h-4",
													children: auth.badgeId
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-primary font-medium",
												children: auth.roleTitle
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-3" }),
													" ",
													auth.zone,
													" • ",
													auth.division
												]
											})
										] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 ml-2" })]
								}, auth.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "manual",
							className: "space-y-4 mt-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSubmit,
								className: "space-y-4",
								children: [
									error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												htmlFor: "badgeId",
												className: "text-xs font-medium flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-3.5 text-muted-foreground" }), " Official Railway Staff / Badge ID"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "badgeId",
												placeholder: "e.g. IR-CTRL-782",
												value: badgeId,
												onChange: (e) => setBadgeId(e.target.value),
												className: "font-mono uppercase text-sm",
												autoFocus: true
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[11px] text-muted-foreground",
												children: [
													"Try ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
														className: "bg-muted px-1 rounded text-primary font-semibold",
														children: "IR-CTRL-782"
													}),
													" or ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
														className: "bg-muted px-1 rounded text-primary font-semibold",
														children: "IR-DISP-409"
													})
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												htmlFor: "pin",
												className: "text-xs font-medium flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "size-3.5 text-muted-foreground" }), " 4-Digit Security PIN / Password"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "pin",
												type: "password",
												placeholder: "Enter security PIN",
												value: pin,
												onChange: (e) => setPin(e.target.value),
												className: "text-sm"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[11px] text-muted-foreground",
												children: ["Demo PIN: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
													className: "bg-muted px-1 rounded text-primary font-semibold",
													children: "rail2026"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "pt-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											disabled: isSubmitting,
											className: "w-full rounded-xl font-semibold gap-2",
											children: isSubmitting ? "Verifying Security Clearance..." : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" }), " Authenticate & Access Console"] })
										})
									})
								]
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 pt-4 border-t border-border/60 text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-emerald-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Encrypted Session with 256-bit Ministry of Railways TLS token." })]
				})]
			})]
		})
	});
}
var styles_default = "/assets/styles-DHHEHSxq.css";
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
var Route$7 = createRootRouteWithContext()({
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
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthModal, {})] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$7.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var $$splitComponentImporter$5 = () => import("./routes-DvakxzoK.mjs");
var Route$6 = createFileRoute("/")({
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
var $$splitComponentImporter$4 = () => import("./connecting-impact-D1UO71zX.mjs");
var Route$5 = createFileRoute("/connecting-impact")({
	component: lazyRouteComponent($$splitComponentImporter$4, "component"),
	head: () => ({ meta: [{ title: "Connecting Trains Impact & Transfer Risk Calculator | RailDristhi" }, {
		name: "description",
		content: "Calculate connection feasibility and platform transfer margins when switching trains at Indian Railways junction stations based on live ETA delay forecasts."
	}] })
});
var $$splitComponentImporter$3 = () => import("./control-room-y7RBsLJU.mjs");
var Route$4 = createFileRoute("/control-room")({
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
var $$splitComponentImporter$2 = () => import("./developer-DOw649mf.mjs");
var Route$3 = createFileRoute("/developer")({
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
	head: () => ({ meta: [{ title: "Developer REST API & Interactive Sandbox | RailDristhi" }, {
		name: "description",
		content: "Integrate real-time train tracking, ETA forecasts, delay classification, station boards, and PNR status into your applications with our high-speed REST API."
	}] })
});
var $$splitComponentImporter$1 = () => import("./network-B62NiX5N.mjs");
var Route$2 = createFileRoute("/network")({
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
var $$splitComponentImporter = () => import("./pnr-DMEn9tHd.mjs");
var Route$1 = createFileRoute("/pnr")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [{ title: "Live PNR Status & Coach Position | RailDristhi" }, {
		name: "description",
		content: "Check real-time Indian Railways PNR status, coach and berth allocations, chart preparation state, and live train location."
	}] })
});
var rootRouteChildren = {
	IndexRoute: Route$6.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$7
	}),
	ConnectingImpactRoute: Route$5.update({
		id: "/connecting-impact",
		path: "/connecting-impact",
		getParentRoute: () => Route$7
	}),
	ControlRoomRoute: Route$4.update({
		id: "/control-room",
		path: "/control-room",
		getParentRoute: () => Route$7
	}),
	DeveloperRoute: Route$3.update({
		id: "/developer",
		path: "/developer",
		getParentRoute: () => Route$7
	}),
	NetworkRoute: Route$2.update({
		id: "/network",
		path: "/network",
		getParentRoute: () => Route$7
	}),
	PnrRoute: Route$1.update({
		id: "/pnr",
		path: "/pnr",
		getParentRoute: () => Route$7
	}),
	StationCodeRoute: Route.update({
		id: "/station/$code",
		path: "/station/$code",
		getParentRoute: () => Route$7
	}),
	TrainNumberRoute: Route$8.update({
		id: "/train/$number",
		path: "/train/$number",
		getParentRoute: () => Route$7
	})
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
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
