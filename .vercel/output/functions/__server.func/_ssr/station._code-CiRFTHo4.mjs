import { f as stations } from "./rail-BA0H0A_E.mjs";
import { f as lazyRouteComponent, j as notFound, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as stationFor, p as trainRoutes } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/station._code-CiRFTHo4.js
var $$splitComponentImporter = () => import("./station._code-CkxpS4ni.mjs");
var $$splitNotFoundComponentImporter = () => import("./station._code-D9X3o-sf.mjs");
var Route = createFileRoute("/station/$code")({
	loader: ({ params }) => {
		const code = params.code.toUpperCase();
		const stationInfo = stationFor(code);
		const hardcodedStation = stations.find(([, c]) => c === code);
		let name = stationInfo?.name || hardcodedStation?.[0];
		if (!name) for (const t of trainRoutes) {
			const foundHalt = t.halts.find((h) => h.code.toUpperCase() === code);
			if (foundHalt) {
				name = foundHalt.name;
				break;
			}
		}
		if (!name && !stationInfo) throw notFound();
		return {
			code,
			name: name ?? code
		};
	},
	head: ({ loaderData }) => {
		const code = loaderData?.code;
		const name = loaderData?.name;
		return { meta: [
			{ title: `${name ? `${name} (${code})` : "Station"} — Station Board | RailDristhi` },
			{
				name: "description",
				content: `Live arrivals and departures with predicted times and platforms at ${name ?? ""} (${code ?? ""}), from the RailDristhi ETA forecasting model.`
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		] };
	},
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
