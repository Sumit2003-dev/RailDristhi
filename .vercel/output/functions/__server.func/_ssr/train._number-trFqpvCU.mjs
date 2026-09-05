import { f as lazyRouteComponent, j as notFound, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as getTrain } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/train._number-trFqpvCU.js
var $$splitComponentImporter = () => import("./train._number-BMbrGhTy.mjs");
var $$splitNotFoundComponentImporter = () => import("./train._number-DvUFS5aX.mjs");
var Route = createFileRoute("/train/$number")({
	loader: ({ params }) => {
		const train = getTrain(params.number);
		if (!train) throw notFound();
		return { train };
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Train not found — RailDristhi" }, {
			name: "robots",
			content: "noindex"
		}] };
		const { train } = loaderData;
		const title = `${train.number} ${train.name} — Live Running Status & Route Track | RailDristhi`;
		const description = `Live track timeline, GPS location, delay prediction, next halt, and full timetable for ${train.number} ${train.name} between ${train.halts[0].name} and ${train.halts[train.halts.length - 1].name}.`;
		return { meta: [
			{ title },
			{
				name: "description",
				content: description
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: description
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
