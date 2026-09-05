import { i as __toESM } from "../_runtime.mjs";
import { l as require_react_dom, u as require_react } from "./@floating-ui/react-dom+[...].mjs";
//#region node_modules/@vis.gl/react-google-maps/dist/index.modern.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
var VERSION = "1.9.0";
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function __rest(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
}
function __awaiter(thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P ? value : new P(function(resolve) {
			resolve(value);
		});
	}
	return new (P || (P = Promise))(function(resolve, reject) {
		function fulfilled(value) {
			try {
				step(generator.next(value));
			} catch (e) {
				reject(e);
			}
		}
		function rejected(value) {
			try {
				step(generator["throw"](value));
			} catch (e) {
				reject(e);
			}
		}
		function step(result) {
			result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
		}
		step((generator = generator.apply(thisArg, _arguments || [])).next());
	});
}
var MSG_REPEATED_SET_OPTIONS = (options) => `The setOptions() function should only be called once. The options passed to the additional call (${JSON.stringify(options)}) will be ignored.`;
var MSG_IMPORT_LIBRARY_EXISTS = (options) => `The google.maps.importLibrary() function is already defined, and @googlemaps/js-api-loader will use the existing function instead of overwriting it. The options passed to setOptions (${JSON.stringify(options)}) will be ignored.`;
var MSG_TRUSTED_TYPES_POLICY_FAILED = (policyName, error) => `Failed to create Trusted Types policy "${policyName}": ${error instanceof Error ? error.message : String(error)}.\n\nIf your Content Security Policy uses "require-trusted-types-for 'script'", allow this policy with "trusted-types ${policyName} google-maps-api-loader google-maps-api#html lit-html". The "google-maps-api-loader", "lit-html", and "google-maps-api#html" policies are required for full Maps JavaScript API execution. Falling back to a string script URL.`;
var TRUSTED_TYPES_POLICY_NAME = "@googlemaps/js-api-loader";
var fallbackPolicy = { createScriptURL: (url) => url };
var policy;
function getPolicy() {
	if (policy) return policy;
	const trustedTypes = globalThis.trustedTypes;
	if (!trustedTypes) {
		policy = fallbackPolicy;
		return policy;
	}
	try {
		policy = trustedTypes.createPolicy(TRUSTED_TYPES_POLICY_NAME, { createScriptURL: (url) => url });
	} catch (e) {
		MSG_TRUSTED_TYPES_POLICY_FAILED(TRUSTED_TYPES_POLICY_NAME, e);
		policy = fallbackPolicy;
	}
	return policy;
}
function setScriptSrc(script, src) {
	script.src = getPolicy().createScriptURL(src);
}
var bootstrap = (bootstrapParams) => {
	var bootstrapPromise;
	var script;
	var bootstrapParamsKey;
	var PRODUCT_NAME = "The Google Maps JavaScript API";
	var GOOGLE = "google";
	var IMPORT_API_NAME = "importLibrary";
	var PENDING_BOOTSTRAP_KEY = "__ib__";
	var doc = document;
	var global_ = window;
	var google_ = global_[GOOGLE] || (global_[GOOGLE] = {});
	var namespace = google_.maps || (google_.maps = {});
	var libraries = /* @__PURE__ */ new Set();
	var searchParams = new URLSearchParams();
	var triggerBootstrap = () => bootstrapPromise || (bootstrapPromise = new Promise(async (resolve, reject) => {
		await (script = doc.createElement("script"));
		searchParams.set("libraries", [...libraries] + "");
		for (bootstrapParamsKey in bootstrapParams) searchParams.set(bootstrapParamsKey.replace(/[A-Z]/g, (g) => "_" + g[0].toLowerCase()), bootstrapParams[bootstrapParamsKey]);
		searchParams.set("callback", GOOGLE + ".maps.__ib__");
		setScriptSrc(script, "https://maps.googleapis.com/maps/api/js?" + searchParams);
		namespace[PENDING_BOOTSTRAP_KEY] = resolve;
		script.onerror = () => bootstrapPromise = reject(Error(PRODUCT_NAME + " could not load."));
		script.nonce = doc.querySelector("script[nonce]")?.nonce || "";
		doc.head.append(script);
	}));
	namespace[IMPORT_API_NAME] ? console.warn(PRODUCT_NAME + " only loads once. Ignoring:", bootstrapParams) : namespace[IMPORT_API_NAME] = (libraryName, ...args) => libraries.add(libraryName) && triggerBootstrap().then(() => namespace[IMPORT_API_NAME](libraryName, ...args));
};
var setOptionsWasCalled_ = false;
/**
* Sets the options for the Maps JavaScript API.
*
* Has to be called before any library is loaded.
*
* See https://developers.google.com/maps/documentation/javascript/load-maps-js-api#required_parameters
* for the full documentation of available options.
*
* @param options The options to set.
*/
function setOptions(options) {
	if (setOptionsWasCalled_) {
		MSG_REPEATED_SET_OPTIONS(options);
		return;
	}
	if (options.apiKey) {
		if (!options.key) options.key = options.apiKey;
	}
	installImportLibrary_(options);
	setOptionsWasCalled_ = true;
}
async function importLibrary(libraryName) {
	if (!setOptionsWasCalled_);
	if (!window?.google?.maps?.importLibrary) throw new Error("google.maps.importLibrary is not installed.");
	return await google.maps.importLibrary(libraryName);
}
/**
* The installImportLibrary_ function makes sure that a usable version of the
* `google.maps.importLibrary` function exists.
*/
function installImportLibrary_(options) {
	const importLibraryExists = Boolean(window.google?.maps?.importLibrary);
	if (importLibraryExists) MSG_IMPORT_LIBRARY_EXISTS(options);
	if (!importLibraryExists) bootstrap(options);
}
var APILoadingStatus = {
	NOT_LOADED: "NOT_LOADED",
	LOADING: "LOADING",
	LOADED: "LOADED",
	FAILED: "FAILED",
	AUTH_FAILURE: "AUTH_FAILURE"
};
var DEFAULT_SOLUTION_CHANNEL = "GMP_visgl_rgmlibrary_v1_default";
var DEFAULT_INTERNAL_USAGE_ATTRIBUTION_IDS = [`gmp_visgl_reactgooglemaps_v${VERSION}`];
var APIProviderContext = import_react.createContext(null);
var loadingStatus = APILoadingStatus.NOT_LOADED;
var serializedApiParams;
var listeners = /* @__PURE__ */ new Set();
/**
* Called to update the local status and notify the listeners for any mounted
* components.
* @internal
*/
function updateLoadingStatus(status) {
	if (status === loadingStatus) return;
	loadingStatus = status;
	listeners.forEach((listener) => listener(loadingStatus));
}
/**
* Local hook to set up the map-instance management context.
* @internal
*/
function useMapInstances() {
	const [mapInstances, setMapInstances] = (0, import_react.useState)({});
	const addMapInstance = (mapInstance, id = "default") => {
		setMapInstances((instances) => Object.assign(Object.assign({}, instances), { [id]: mapInstance }));
	};
	const removeMapInstance = (id = "default") => {
		setMapInstances((_a) => {
			var _b = id;
			_a[_b];
			return __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
		});
	};
	const clearMapInstances = () => {
		setMapInstances({});
	};
	return {
		mapInstances,
		addMapInstance,
		removeMapInstance,
		clearMapInstances
	};
}
/**
* local hook to set up the 3D map-instance management context.
*/
function useMap3DInstances() {
	const [map3dInstances, setMap3DInstances] = (0, import_react.useState)({});
	const addMap3DInstance = (map3dInstance, id = "default") => {
		setMap3DInstances((instances) => Object.assign(Object.assign({}, instances), { [id]: map3dInstance }));
	};
	const removeMap3DInstance = (id = "default") => {
		setMap3DInstances((_a) => {
			var _b = id;
			_a[_b];
			return __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
		});
	};
	const clearMap3DInstances = () => {
		setMap3DInstances({});
	};
	return {
		map3dInstances,
		addMap3DInstance,
		removeMap3DInstance,
		clearMap3DInstances
	};
}
/**
* Local hook to handle the loading of the maps API.
* @internal
*/
function useGoogleMapsApiLoader(props) {
	const { onLoad, onError, apiKey, version, libraries = [], region, language, authReferrerPolicy, channel, solutionChannel, fetchAppCheckToken } = props;
	const [status, setStatus] = (0, import_react.useState)(loadingStatus);
	const [loadedLibraries, addLoadedLibrary] = (0, import_react.useReducer)((loadedLibraries, action) => {
		return loadedLibraries[action.name] ? loadedLibraries : Object.assign(Object.assign({}, loadedLibraries), { [action.name]: action.value });
	}, {});
	const currentSerializedParams = (0, import_react.useMemo)(() => {
		const params = {
			apiKey,
			version,
			libraries: libraries.join(","),
			region,
			language,
			authReferrerPolicy,
			channel,
			solutionChannel
		};
		return JSON.stringify(params);
	}, [
		apiKey,
		version,
		libraries,
		region,
		language,
		authReferrerPolicy,
		channel,
		solutionChannel
	]);
	const importLibraryCallback = (0, import_react.useCallback)((name) => __awaiter(this, void 0, void 0, function* () {
		if (loadedLibraries[name]) return loadedLibraries[name];
		const res = yield importLibrary(name);
		addLoadedLibrary({
			name,
			value: res
		});
		return res;
	}), [loadedLibraries]);
	(0, import_react.useEffect)(() => {
		listeners.add(setStatus);
		setStatus(loadingStatus);
		return () => {
			listeners.delete(setStatus);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		(() => __awaiter(this, void 0, void 0, function* () {
			var _a, _b;
			try {
				if (serializedApiParams && serializedApiParams !== currentSerializedParams) console.warn("The Google Maps JavaScript API has already been loaded with different parameters. The new parameters will be ignored. If you need to use different parameters, please refresh the page.");
				const librariesToLoad = [
					"core",
					"maps",
					...libraries
				];
				const options = Object.fromEntries(Object.entries({
					key: apiKey,
					v: version,
					libraries,
					region,
					language,
					authReferrerPolicy
				}).filter(([, value]) => value !== void 0));
				if (channel !== void 0 && channel >= 0 && channel <= 999) options.channel = String(channel);
				if (solutionChannel === void 0) options.solutionChannel = DEFAULT_SOLUTION_CHANNEL;
				else if (solutionChannel !== "") options.solutionChannel = solutionChannel;
				if ((_b = (_a = window.google) === null || _a === void 0 ? void 0 : _a.maps) === null || _b === void 0 ? void 0 : _b.importLibrary) {
					const shouldUpdateLoadingStatus = !serializedApiParams;
					if (shouldUpdateLoadingStatus) {
						serializedApiParams = currentSerializedParams;
						setOptions(options);
					}
					yield Promise.all(librariesToLoad.map((name) => importLibraryCallback(name)));
					if (shouldUpdateLoadingStatus) updateLoadingStatus(APILoadingStatus.LOADED);
					if (onLoad) onLoad();
					return;
				}
				if (loadingStatus === APILoadingStatus.LOADING || loadingStatus === APILoadingStatus.LOADED) {
					if (loadingStatus === APILoadingStatus.LOADED && onLoad) onLoad();
					return;
				}
				serializedApiParams = currentSerializedParams;
				updateLoadingStatus(APILoadingStatus.LOADING);
				setOptions(options);
				yield Promise.all(librariesToLoad.map((name) => importLibraryCallback(name)));
				updateLoadingStatus(APILoadingStatus.LOADED);
				if (onLoad) onLoad();
			} catch (error) {
				updateLoadingStatus(APILoadingStatus.FAILED);
				if (onError) onError(error);
				else console.error("The Google Maps JavaScript API failed to load.", error);
			}
		}))();
	}, [
		currentSerializedParams,
		onLoad,
		onError,
		importLibraryCallback,
		libraries
	]);
	(0, import_react.useEffect)(() => {
		if (status !== APILoadingStatus.LOADED) return;
		const settings = google.maps.Settings.getInstance();
		if (fetchAppCheckToken) settings.fetchAppCheckToken = fetchAppCheckToken;
	}, [status, fetchAppCheckToken]);
	return {
		status,
		loadedLibraries,
		importLibrary: importLibraryCallback
	};
}
function useInternalUsageAttributionIds(props) {
	return (0, import_react.useMemo)(() => props.disableUsageAttribution ? null : DEFAULT_INTERNAL_USAGE_ATTRIBUTION_IDS, [props.disableUsageAttribution]);
}
/**
* Component to wrap the components from this library and load the Google Maps JavaScript API
*/
var APIProvider = (props) => {
	const { children } = props, loaderProps = __rest(props, ["children"]);
	const { mapInstances, addMapInstance, removeMapInstance, clearMapInstances } = useMapInstances();
	const { map3dInstances, addMap3DInstance, removeMap3DInstance, clearMap3DInstances } = useMap3DInstances();
	const { status, loadedLibraries, importLibrary } = useGoogleMapsApiLoader(loaderProps);
	const internalUsageAttributionIds = useInternalUsageAttributionIds(loaderProps);
	const contextValue = (0, import_react.useMemo)(() => ({
		mapInstances,
		addMapInstance,
		removeMapInstance,
		clearMapInstances,
		map3dInstances,
		addMap3DInstance,
		removeMap3DInstance,
		clearMap3DInstances,
		status,
		loadedLibraries,
		importLibrary,
		internalUsageAttributionIds
	}), [
		mapInstances,
		addMapInstance,
		removeMapInstance,
		clearMapInstances,
		map3dInstances,
		addMap3DInstance,
		removeMap3DInstance,
		clearMap3DInstances,
		status,
		loadedLibraries,
		importLibrary,
		internalUsageAttributionIds
	]);
	return import_react.createElement(APIProviderContext.Provider, { value: contextValue }, children);
};
/**
* Sets up effects to bind event-handlers for all event-props in MapEventProps.
* @internal
*/
function useMapEvents(map, props) {
	for (const propName of eventPropNames) {
		const handler = props[propName];
		const eventType = propNameToEventType[propName];
		(0, import_react.useEffect)(() => {
			if (!map) return;
			if (!handler) return;
			const listener = google.maps.event.addListener(map, eventType, (ev) => {
				handler(createMapEvent(eventType, map, ev));
			});
			return () => listener.remove();
		}, [
			map,
			eventType,
			handler
		]);
	}
}
/**
* Create the wrapped map-events used for the event-props.
* @param type the event type as it is specified to the maps api
* @param map the map instance the event originates from
* @param srcEvent the source-event if there is one.
*/
function createMapEvent(type, map, srcEvent) {
	var _a;
	const ev = {
		type,
		map,
		detail: {},
		stoppable: false,
		stop: () => {}
	};
	if (cameraEventTypes.includes(type)) {
		const camEvent = ev;
		const center = map.getCenter();
		const zoom = map.getZoom();
		const heading = map.getHeading() || 0;
		const tilt = map.getTilt() || 0;
		const bounds = map.getBounds();
		if (!center || !bounds || !Number.isFinite(zoom)) console.warn("[createEvent] at least one of the values from the map returned undefined. This is not expected to happen. Please report an issue at https://github.com/visgl/react-google-maps/issues/new");
		camEvent.detail = {
			center: (center === null || center === void 0 ? void 0 : center.toJSON()) || {
				lat: 0,
				lng: 0
			},
			zoom: zoom || 0,
			heading,
			tilt,
			bounds: (bounds === null || bounds === void 0 ? void 0 : bounds.toJSON()) || {
				north: 90,
				east: 180,
				south: -90,
				west: -180
			}
		};
		return camEvent;
	} else if (mouseEventTypes.includes(type)) {
		if (!srcEvent) throw new Error("[createEvent] mouse events must provide a srcEvent");
		const mouseEvent = ev;
		mouseEvent.domEvent = srcEvent.domEvent;
		mouseEvent.stoppable = true;
		mouseEvent.stop = () => srcEvent.stop();
		mouseEvent.detail = {
			latLng: ((_a = srcEvent.latLng) === null || _a === void 0 ? void 0 : _a.toJSON()) || null,
			placeId: srcEvent.placeId
		};
		return mouseEvent;
	}
	return ev;
}
/**
* maps the camelCased names of event-props to the corresponding event-types
* used in the maps API.
*/
var propNameToEventType = {
	onBoundsChanged: "bounds_changed",
	onCenterChanged: "center_changed",
	onClick: "click",
	onContextmenu: "contextmenu",
	onDblclick: "dblclick",
	onDrag: "drag",
	onDragend: "dragend",
	onDragstart: "dragstart",
	onHeadingChanged: "heading_changed",
	onIdle: "idle",
	onIsFractionalZoomEnabledChanged: "isfractionalzoomenabled_changed",
	onMapCapabilitiesChanged: "mapcapabilities_changed",
	onMapTypeIdChanged: "maptypeid_changed",
	onMousemove: "mousemove",
	onMouseout: "mouseout",
	onMouseover: "mouseover",
	onProjectionChanged: "projection_changed",
	onRenderingTypeChanged: "renderingtype_changed",
	onTilesLoaded: "tilesloaded",
	onTiltChanged: "tilt_changed",
	onZoomChanged: "zoom_changed",
	onCameraChanged: "bounds_changed"
};
var cameraEventTypes = [
	"bounds_changed",
	"center_changed",
	"heading_changed",
	"tilt_changed",
	"zoom_changed"
];
var mouseEventTypes = [
	"click",
	"contextmenu",
	"dblclick",
	"mousemove",
	"mouseout",
	"mouseover"
];
var eventPropNames = Object.keys(propNameToEventType);
function useMemoized(value, isEqual) {
	const ref = (0, import_react.useRef)(value);
	if (!isEqual(value, ref.current)) ref.current = value;
	return ref.current;
}
function useCustomCompareEffect(effect, dependencies, isEqual) {
	(0, import_react.useEffect)(effect, [useMemoized(dependencies, isEqual)]);
}
var { getOwnPropertyNames, getOwnPropertySymbols } = Object;
var { hasOwnProperty } = Object.prototype;
/**
* Combine two comparators into a single comparators.
*/
function combineComparators(comparatorA, comparatorB) {
	return function isEqual(a, b, state) {
		return comparatorA(a, b, state) && comparatorB(a, b, state);
	};
}
/**
* Wrap the provided `areItemsEqual` method to manage the circular state, allowing
* for circular references to be safely included in the comparison without creating
* stack overflows.
*/
function createIsCircular(areItemsEqual) {
	return function isCircular(a, b, state) {
		if (!a || !b || typeof a !== "object" || typeof b !== "object") return areItemsEqual(a, b, state);
		const { cache } = state;
		const cachedA = cache.get(a);
		const cachedB = cache.get(b);
		if (cachedA && cachedB) return cachedA === b && cachedB === a;
		cache.set(a, b);
		cache.set(b, a);
		const result = areItemsEqual(a, b, state);
		cache.delete(a);
		cache.delete(b);
		return result;
	};
}
/**
* Get the properties to strictly examine, which include both own properties that are
* not enumerable and symbol properties.
*/
function getStrictProperties(object) {
	return getOwnPropertyNames(object).concat(getOwnPropertySymbols(object));
}
/**
* Whether the object contains the property passed as an own property.
*/
var hasOwn = Object.hasOwn || ((object, property) => hasOwnProperty.call(object, property));
var PREACT_VNODE = "__v";
var PREACT_OWNER = "__o";
var REACT_OWNER = "_owner";
var { getOwnPropertyDescriptor, keys } = Object;
/**
* Whether the values passed are equal based on a [SameValue](https://262.ecma-international.org/7.0/#sec-samevalue) basis.
* Simplified, this maps to if the two values are referentially equal to one another (`a === b`) or both are `NaN`.
*
* @note
* When available in the environment, this is just a re-export of the global
* [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) method.
*/
var sameValueEqual = Object.is || function sameValueEqual(a, b) {
	return a === b ? a !== 0 || 1 / a === 1 / b : a !== a && b !== b;
};
/**
* Whether the values passed are equal based on a
* [Strict Equality Comparison](https://262.ecma-international.org/7.0/#sec-strict-equality-comparison) basis.
* Simplified, this maps to if the two values are referentially equal to one another (`a === b`).
*
* @note
* This is mainly available as a convenience function, such as being a default when a function to determine equality between
* two objects is used.
*/
function strictEqual(a, b) {
	return a === b;
}
/**
* Whether the array buffers are equal in value.
*/
function areArrayBuffersEqual(a, b) {
	return a.byteLength === b.byteLength && areTypedArraysEqual(new Uint8Array(a), new Uint8Array(b));
}
/**
* Whether the arrays are equal in value.
*/
function areArraysEqual(a, b, state) {
	let index = a.length;
	if (b.length !== index) return false;
	while (index-- > 0) if (!state.equals(a[index], b[index], index, index, a, b, state)) return false;
	return true;
}
/**
* Whether the dataviews are equal in value.
*/
function areDataViewsEqual(a, b) {
	return a.byteLength === b.byteLength && areTypedArraysEqual(new Uint8Array(a.buffer, a.byteOffset, a.byteLength), new Uint8Array(b.buffer, b.byteOffset, b.byteLength));
}
/**
* Whether the dates passed are equal in value.
*/
function areDatesEqual(a, b) {
	return sameValueEqual(a.getTime(), b.getTime());
}
/**
* Whether the errors passed are equal in value.
*/
function areErrorsEqual(a, b) {
	return a.name === b.name && a.message === b.message && a.cause === b.cause && a.stack === b.stack;
}
/**
* Whether the `Map`s are equal in value.
*/
function areMapsEqual(a, b, state) {
	const size = a.size;
	if (size !== b.size) return false;
	if (!size) return true;
	const matchedIndices = new Array(size);
	const aIterable = a.entries();
	let aResult;
	let bResult;
	let index = 0;
	while (aResult = aIterable.next()) {
		if (aResult.done) break;
		const bIterable = b.entries();
		let hasMatch = false;
		let matchIndex = 0;
		while (bResult = bIterable.next()) {
			if (bResult.done) break;
			if (matchedIndices[matchIndex]) {
				matchIndex++;
				continue;
			}
			const aEntry = aResult.value;
			const bEntry = bResult.value;
			if (state.equals(aEntry[0], bEntry[0], index, matchIndex, a, b, state) && state.equals(aEntry[1], bEntry[1], aEntry[0], bEntry[0], a, b, state)) {
				hasMatch = matchedIndices[matchIndex] = true;
				break;
			}
			matchIndex++;
		}
		if (!hasMatch) return false;
		index++;
	}
	return true;
}
/**
* Whether the objects are equal in value.
*/
function areObjectsEqual(a, b, state) {
	const properties = keys(a);
	let index = properties.length;
	if (keys(b).length !== index) return false;
	while (index-- > 0) if (!isPropertyEqual(a, b, state, properties[index])) return false;
	return true;
}
/**
* Whether the objects are equal in value with strict property checking.
*/
function areObjectsEqualStrict(a, b, state) {
	const properties = getStrictProperties(a);
	let index = properties.length;
	if (getStrictProperties(b).length !== index) return false;
	let property;
	let descriptorA;
	let descriptorB;
	while (index-- > 0) {
		property = properties[index];
		if (!isPropertyEqual(a, b, state, property)) return false;
		descriptorA = getOwnPropertyDescriptor(a, property);
		descriptorB = getOwnPropertyDescriptor(b, property);
		if ((descriptorA || descriptorB) && (!descriptorA || !descriptorB || descriptorA.configurable !== descriptorB.configurable || descriptorA.enumerable !== descriptorB.enumerable || descriptorA.writable !== descriptorB.writable)) return false;
	}
	return true;
}
/**
* Whether the primitive wrappers passed are equal in value.
*/
function arePrimitiveWrappersEqual(a, b) {
	return sameValueEqual(a.valueOf(), b.valueOf());
}
/**
* Whether the regexps passed are equal in value.
*/
function areRegExpsEqual(a, b) {
	return a.source === b.source && a.flags === b.flags;
}
/**
* Whether the `Set`s are equal in value.
*/
function areSetsEqual(a, b, state) {
	const size = a.size;
	if (size !== b.size) return false;
	if (!size) return true;
	const matchedIndices = new Array(size);
	const aIterable = a.values();
	let aResult;
	let bResult;
	while (aResult = aIterable.next()) {
		if (aResult.done) break;
		const bIterable = b.values();
		let hasMatch = false;
		let matchIndex = 0;
		while (bResult = bIterable.next()) {
			if (bResult.done) break;
			if (!matchedIndices[matchIndex] && state.equals(aResult.value, bResult.value, aResult.value, bResult.value, a, b, state)) {
				hasMatch = matchedIndices[matchIndex] = true;
				break;
			}
			matchIndex++;
		}
		if (!hasMatch) return false;
	}
	return true;
}
/**
* Whether the TypedArray instances are equal in value.
*/
function areTypedArraysEqual(a, b) {
	let index = a.byteLength;
	if (b.byteLength !== index || a.byteOffset !== b.byteOffset) return false;
	while (index-- > 0) if (a[index] !== b[index]) return false;
	return true;
}
/**
* Whether the URL instances are equal in value.
*/
function areUrlsEqual(a, b) {
	return a.hostname === b.hostname && a.pathname === b.pathname && a.protocol === b.protocol && a.port === b.port && a.hash === b.hash && a.username === b.username && a.password === b.password;
}
function isPropertyEqual(a, b, state, property) {
	if ((property === REACT_OWNER || property === PREACT_OWNER || property === PREACT_VNODE) && (a.$$typeof || b.$$typeof)) return true;
	return hasOwn(b, property) && state.equals(a[property], b[property], property, property, a, b, state);
}
var toString = Object.prototype.toString;
/**
* Create a comparator method based on the type-specific equality comparators passed.
*/
function createEqualityComparator(config) {
	const supportedComparatorMap = createSupportedComparatorMap(config);
	const { areArraysEqual, areDatesEqual, areFunctionsEqual, areMapsEqual, areNumbersEqual, areObjectsEqual, areRegExpsEqual, areSetsEqual, getUnsupportedCustomComparator } = config;
	/**
	* compare the value of the two objects and return true if they are equivalent in values
	*/
	return function comparator(a, b, state) {
		if (a === b) return true;
		if (a == null || b == null) return false;
		const type = typeof a;
		if (type !== typeof b) return false;
		if (type !== "object") {
			if (type === "number" || type === "bigint") return areNumbersEqual(a, b, state);
			if (type === "function") return areFunctionsEqual(a, b, state);
			return false;
		}
		const constructor = a.constructor;
		if (constructor !== b.constructor) return false;
		if (constructor === Object) return areObjectsEqual(a, b, state);
		if (constructor === Array) return areArraysEqual(a, b, state);
		if (constructor === Date) return areDatesEqual(a, b, state);
		if (constructor === RegExp) return areRegExpsEqual(a, b, state);
		if (constructor === Map) return areMapsEqual(a, b, state);
		if (constructor === Set) return areSetsEqual(a, b, state);
		if (constructor === Promise) return false;
		if (Array.isArray(a)) return areArraysEqual(a, b, state);
		const tag = toString.call(a);
		const supportedComparator = supportedComparatorMap[tag];
		if (supportedComparator) return supportedComparator(a, b, state);
		const unsupportedCustomComparator = getUnsupportedCustomComparator && getUnsupportedCustomComparator(a, b, state, tag);
		if (unsupportedCustomComparator) return unsupportedCustomComparator(a, b, state);
		return false;
	};
}
/**
* Create the configuration object used for building comparators.
*/
function createEqualityComparatorConfig({ circular, createCustomConfig, strict }) {
	let config = {
		areArrayBuffersEqual,
		areArraysEqual: strict ? areObjectsEqualStrict : areArraysEqual,
		areDataViewsEqual,
		areDatesEqual,
		areErrorsEqual,
		areFunctionsEqual: strictEqual,
		areMapsEqual: strict ? combineComparators(areMapsEqual, areObjectsEqualStrict) : areMapsEqual,
		areNumbersEqual: sameValueEqual,
		areObjectsEqual: strict ? areObjectsEqualStrict : areObjectsEqual,
		arePrimitiveWrappersEqual,
		areRegExpsEqual,
		areSetsEqual: strict ? combineComparators(areSetsEqual, areObjectsEqualStrict) : areSetsEqual,
		areTypedArraysEqual: strict ? combineComparators(areTypedArraysEqual, areObjectsEqualStrict) : areTypedArraysEqual,
		areUrlsEqual,
		getUnsupportedCustomComparator: void 0
	};
	if (createCustomConfig) config = Object.assign({}, config, createCustomConfig(config));
	if (circular) {
		const areArraysEqual = createIsCircular(config.areArraysEqual);
		const areMapsEqual = createIsCircular(config.areMapsEqual);
		const areObjectsEqual = createIsCircular(config.areObjectsEqual);
		const areSetsEqual = createIsCircular(config.areSetsEqual);
		config = Object.assign({}, config, {
			areArraysEqual,
			areMapsEqual,
			areObjectsEqual,
			areSetsEqual
		});
	}
	return config;
}
/**
* Default equality comparator pass-through, used as the standard `isEqual` creator for
* use inside the built comparator.
*/
function createInternalEqualityComparator(compare) {
	return function(a, b, _indexOrKeyA, _indexOrKeyB, _parentA, _parentB, state) {
		return compare(a, b, state);
	};
}
/**
* Create the `isEqual` function used by the consuming application.
*/
function createIsEqual({ circular, comparator, createState, equals, strict }) {
	if (createState) return function isEqual(a, b) {
		const { cache = circular ? /* @__PURE__ */ new WeakMap() : void 0, meta } = createState();
		return comparator(a, b, {
			cache,
			equals,
			meta,
			strict
		});
	};
	if (circular) return function isEqual(a, b) {
		return comparator(a, b, {
			cache: /* @__PURE__ */ new WeakMap(),
			equals,
			meta: void 0,
			strict
		});
	};
	const state = {
		cache: void 0,
		equals,
		meta: void 0,
		strict
	};
	return function isEqual(a, b) {
		return comparator(a, b, state);
	};
}
/**
* Create a map of `toString()` values to their respective handlers for `tag`-based lookups.
*/
function createSupportedComparatorMap({ areArrayBuffersEqual, areArraysEqual, areDataViewsEqual, areDatesEqual, areErrorsEqual, areFunctionsEqual, areMapsEqual, areNumbersEqual, areObjectsEqual, arePrimitiveWrappersEqual, areRegExpsEqual, areSetsEqual, areTypedArraysEqual, areUrlsEqual }) {
	return {
		"[object Arguments]": areObjectsEqual,
		"[object Array]": areArraysEqual,
		"[object ArrayBuffer]": areArrayBuffersEqual,
		"[object AsyncGeneratorFunction]": areFunctionsEqual,
		"[object BigInt]": areNumbersEqual,
		"[object BigInt64Array]": areTypedArraysEqual,
		"[object BigUint64Array]": areTypedArraysEqual,
		"[object Boolean]": arePrimitiveWrappersEqual,
		"[object DataView]": areDataViewsEqual,
		"[object Date]": areDatesEqual,
		"[object Error]": areErrorsEqual,
		"[object Float16Array]": areTypedArraysEqual,
		"[object Float32Array]": areTypedArraysEqual,
		"[object Float64Array]": areTypedArraysEqual,
		"[object Function]": areFunctionsEqual,
		"[object GeneratorFunction]": areFunctionsEqual,
		"[object Int8Array]": areTypedArraysEqual,
		"[object Int16Array]": areTypedArraysEqual,
		"[object Int32Array]": areTypedArraysEqual,
		"[object Map]": areMapsEqual,
		"[object Number]": arePrimitiveWrappersEqual,
		"[object Object]": (a, b, state) => typeof a.then !== "function" && typeof b.then !== "function" && areObjectsEqual(a, b, state),
		"[object RegExp]": areRegExpsEqual,
		"[object Set]": areSetsEqual,
		"[object String]": arePrimitiveWrappersEqual,
		"[object URL]": areUrlsEqual,
		"[object Uint8Array]": areTypedArraysEqual,
		"[object Uint8ClampedArray]": areTypedArraysEqual,
		"[object Uint16Array]": areTypedArraysEqual,
		"[object Uint32Array]": areTypedArraysEqual
	};
}
/**
* Whether the items passed are deeply-equal in value.
*/
var deepEqual = createCustomEqual();
/**
* Whether the items passed are deeply-equal in value based on strict comparison.
*/
createCustomEqual({ strict: true });
/**
* Whether the items passed are deeply-equal in value, including circular references.
*/
createCustomEqual({ circular: true });
/**
* Whether the items passed are deeply-equal in value, including circular references,
* based on strict comparison.
*/
createCustomEqual({
	circular: true,
	strict: true
});
/**
* Whether the items passed are shallowly-equal in value.
*/
createCustomEqual({ createInternalComparator: () => sameValueEqual });
/**
* Whether the items passed are shallowly-equal in value based on strict comparison
*/
createCustomEqual({
	strict: true,
	createInternalComparator: () => sameValueEqual
});
/**
* Whether the items passed are shallowly-equal in value, including circular references.
*/
createCustomEqual({
	circular: true,
	createInternalComparator: () => sameValueEqual
});
/**
* Whether the items passed are shallowly-equal in value, including circular references,
* based on strict comparison.
*/
createCustomEqual({
	circular: true,
	createInternalComparator: () => sameValueEqual,
	strict: true
});
/**
* Create a custom equality comparison method.
*
* This can be done to create very targeted comparisons in extreme hot-path scenarios
* where the standard methods are not performant enough, but can also be used to provide
* support for legacy environments that do not support expected features like
* `RegExp.prototype.flags` out of the box.
*/
function createCustomEqual(options = {}) {
	const { circular = false, createInternalComparator: createCustomInternalComparator, createState, strict = false } = options;
	const comparator = createEqualityComparator(createEqualityComparatorConfig(options));
	return createIsEqual({
		circular,
		comparator,
		createState,
		equals: createCustomInternalComparator ? createCustomInternalComparator(comparator) : createInternalEqualityComparator(comparator),
		strict
	});
}
function useDeepCompareEffect(effect, dependencies) {
	useCustomCompareEffect(effect, dependencies, deepEqual);
}
var mapOptionKeys = /* @__PURE__ */ new Set([
	"backgroundColor",
	"clickableIcons",
	"controlSize",
	"disableDefaultUI",
	"disableDoubleClickZoom",
	"draggable",
	"draggableCursor",
	"draggingCursor",
	"fullscreenControl",
	"fullscreenControlOptions",
	"gestureHandling",
	"headingInteractionEnabled",
	"isFractionalZoomEnabled",
	"keyboardShortcuts",
	"mapTypeControl",
	"mapTypeControlOptions",
	"mapTypeId",
	"maxZoom",
	"minZoom",
	"noClear",
	"panControl",
	"panControlOptions",
	"restriction",
	"rotateControl",
	"rotateControlOptions",
	"scaleControl",
	"scaleControlOptions",
	"scrollwheel",
	"streetView",
	"streetViewControl",
	"streetViewControlOptions",
	"styles",
	"tiltInteractionEnabled",
	"zoomControl",
	"zoomControlOptions"
]);
/**
* Internal hook to update the map-options when props are changed.
*
* @param map the map instance
* @param mapProps the props to update the map-instance with
* @internal
*/
function useMapOptions(map, mapProps) {
	const mapOptions = {};
	const keys = Object.keys(mapProps);
	for (const key of keys) {
		if (!mapOptionKeys.has(key)) continue;
		mapOptions[key] = mapProps[key];
	}
	useDeepCompareEffect(() => {
		if (!map) return;
		map.setOptions(mapOptions);
	}, [mapOptions]);
}
function useApiLoadingStatus() {
	var _a;
	return ((_a = (0, import_react.useContext)(APIProviderContext)) === null || _a === void 0 ? void 0 : _a.status) || APILoadingStatus.NOT_LOADED;
}
/**
* Internal hook that updates the camera when deck.gl viewState changes.
* @internal
*/
function useDeckGLCameraUpdate(map, props) {
	const { viewport, viewState } = props;
	const isDeckGlControlled = !!viewport;
	(0, import_react.useLayoutEffect)(() => {
		if (!map || !viewState) return;
		const { latitude, longitude, bearing: heading, pitch: tilt, zoom } = viewState;
		map.moveCamera({
			center: {
				lat: latitude,
				lng: longitude
			},
			heading,
			tilt,
			zoom: zoom + 1
		});
	}, [map, viewState]);
	return isDeckGlControlled;
}
function isLatLngLiteral(obj) {
	if (!obj || typeof obj !== "object") return false;
	if (!("lat" in obj && "lng" in obj)) return false;
	return Number.isFinite(obj.lat) && Number.isFinite(obj.lng);
}
function latLngEquals(a, b) {
	if (!a || !b) return false;
	const A = toLatLngLiteral(a);
	const B = toLatLngLiteral(b);
	if (A.lat !== B.lat || A.lng !== B.lng) return false;
	return true;
}
function toLatLngLiteral(obj) {
	if (isLatLngLiteral(obj)) return obj;
	return obj.toJSON();
}
function toLatLngBoundsLiteral(obj) {
	if ("north" in obj && "south" in obj && "east" in obj && "west" in obj) return obj;
	const ne = obj.getNorthEast().toJSON();
	const sw = obj.getSouthWest().toJSON();
	return {
		north: ne.lat,
		east: ne.lng,
		south: sw.lat,
		west: sw.lng
	};
}
function boundsEquals(a, b) {
	if (!a || !b) return false;
	const A = toLatLngBoundsLiteral(a);
	const B = toLatLngBoundsLiteral(b);
	return A.north === B.north && A.south === B.south && A.east === B.east && A.west === B.west;
}
/**
* Compares two paths (arrays of LatLng points) for equality.
*/
function pathEquals(a, b) {
	if (!a || !b) return a === b;
	const arrayB = "getArray" in b ? b.getArray() : b;
	if (a.length !== arrayB.length) return false;
	for (let i = 0; i < a.length; i++) if (!latLngEquals(a[i], arrayB[i])) return false;
	return true;
}
/**
* Compares two arrays of paths (for Polygon) for equality.
*/
function pathsEquals(a, b) {
	if (!a || !b) return a === b;
	const arrayB = "getArray" in b ? b.getArray().map((inner) => inner.getArray()) : b;
	if (a.length !== arrayB.length) return false;
	for (let i = 0; i < a.length; i++) if (!pathEquals(a[i], arrayB[i])) return false;
	return true;
}
function useMapCameraParams(map, cameraStateRef, mapProps) {
	const center = mapProps.center ? toLatLngLiteral(mapProps.center) : null;
	let lat = null;
	let lng = null;
	if (center && Number.isFinite(center.lat) && Number.isFinite(center.lng)) {
		lat = center.lat;
		lng = center.lng;
	}
	const zoom = Number.isFinite(mapProps.zoom) ? mapProps.zoom : null;
	const heading = Number.isFinite(mapProps.heading) ? mapProps.heading : null;
	const tilt = Number.isFinite(mapProps.tilt) ? mapProps.tilt : null;
	(0, import_react.useLayoutEffect)(() => {
		if (!map) return;
		const nextCamera = {};
		let needsUpdate = false;
		if (lat !== null && lng !== null && (cameraStateRef.current.center.lat !== lat || cameraStateRef.current.center.lng !== lng)) {
			nextCamera.center = {
				lat,
				lng
			};
			needsUpdate = true;
		}
		if (zoom !== null && cameraStateRef.current.zoom !== zoom) {
			nextCamera.zoom = zoom;
			needsUpdate = true;
		}
		if (heading !== null && cameraStateRef.current.heading !== heading) {
			nextCamera.heading = heading;
			needsUpdate = true;
		}
		if (tilt !== null && cameraStateRef.current.tilt !== tilt) {
			nextCamera.tilt = tilt;
			needsUpdate = true;
		}
		if (needsUpdate) map.moveCamera(nextCamera);
	});
}
var AuthFailureMessage = () => {
	return import_react.createElement("div", { style: {
		position: "absolute",
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		zIndex: 999,
		display: "flex",
		flexFlow: "column nowrap",
		textAlign: "center",
		justifyContent: "center",
		fontSize: ".8rem",
		color: "rgba(0,0,0,0.6)",
		background: "#dddddd",
		padding: "1rem 1.5rem"
	} }, import_react.createElement("h2", null, "Error: AuthFailure"), import_react.createElement("p", null, "A problem with your API key prevents the map from rendering correctly. Please make sure the value of the ", import_react.createElement("code", null, "APIProvider.apiKey"), " prop is correct. Check the error-message in the console for further details."));
};
function useCallbackRef() {
	const [el, setEl] = (0, import_react.useState)(null);
	return [el, (0, import_react.useCallback)((value) => setEl(value), [setEl])];
}
/**
* Hook to check if the Maps JavaScript API is loaded
*/
function useApiIsLoaded() {
	return useApiLoadingStatus() === APILoadingStatus.LOADED;
}
function useForceUpdate() {
	const [, forceUpdate] = (0, import_react.useReducer)((x) => x + 1, 0);
	return forceUpdate;
}
function handleBoundsChange(map, ref) {
	const center = map.getCenter();
	const zoom = map.getZoom();
	const heading = map.getHeading() || 0;
	const tilt = map.getTilt() || 0;
	const bounds = map.getBounds();
	if (!center || !bounds || !Number.isFinite(zoom)) console.warn("[useTrackedCameraState] at least one of the values from the map returned undefined. This is not expected to happen. Please report an issue at https://github.com/visgl/react-google-maps/issues/new");
	Object.assign(ref.current, {
		center: (center === null || center === void 0 ? void 0 : center.toJSON()) || {
			lat: 0,
			lng: 0
		},
		zoom: zoom || 0,
		heading,
		tilt
	});
}
/**
* Creates a mutable ref object to track the last known state of the map camera.
* This is used in `useMapCameraParams` to reduce stuttering in normal operation
* by avoiding updates of the map camera with values that have already been processed.
*/
function useTrackedCameraStateRef(map) {
	const forceUpdate = useForceUpdate();
	const ref = (0, import_react.useRef)({
		center: {
			lat: 0,
			lng: 0
		},
		heading: 0,
		tilt: 0,
		zoom: 0
	});
	(0, import_react.useEffect)(() => {
		if (!map) return;
		const listener = google.maps.event.addListener(map, "bounds_changed", () => {
			handleBoundsChange(map, ref);
			forceUpdate();
		});
		return () => listener.remove();
	}, [map, forceUpdate]);
	return ref;
}
/**
* Stores a stack of map-instances for each mapId. Whenever an
* instance is used, it is removed from the stack while in use,
* and returned to the stack when the component unmounts.
* This allows us to correctly implement caching for multiple
* maps om the same page, while reusing as much as possible.
*
* FIXME: while it should in theory be possible to reuse maps solely
*   based on mapId/renderingType/colorScheme (as all other parameters can be
*   changed at runtime), we don't yet have good enough tracking of options to
*   reliably unset all the options that have been set.
*/
var CachedMapStack = class {
	static has(key) {
		return this.entries[key] && this.entries[key].length > 0;
	}
	static pop(key) {
		if (!this.entries[key]) return null;
		return this.entries[key].pop() || null;
	}
	static push(key, value) {
		if (!this.entries[key]) this.entries[key] = [];
		this.entries[key].push(value);
	}
};
CachedMapStack.entries = {};
/**
* The main hook takes care of creating map-instances and registering them in
* the api-provider context.
* @return a tuple of the map-instance created (or null) and the callback
*   ref that will be used to pass the map-container into this hook.
* @internal
*/
function useMapInstance(props, context) {
	const apiIsLoaded = useApiIsLoaded();
	const [map, setMap] = (0, import_react.useState)(null);
	const [container, containerRef] = useCallbackRef();
	const cameraStateRef = useTrackedCameraStateRef(map);
	const { id, defaultBounds, defaultCenter, defaultZoom, defaultHeading, defaultTilt, reuseMaps, renderingType, colorScheme } = props, mapOptions = __rest(props, [
		"id",
		"defaultBounds",
		"defaultCenter",
		"defaultZoom",
		"defaultHeading",
		"defaultTilt",
		"reuseMaps",
		"renderingType",
		"colorScheme"
	]);
	const hasZoom = props.zoom !== void 0 || props.defaultZoom !== void 0;
	const hasCenter = props.center !== void 0 || props.defaultCenter !== void 0;
	if (!defaultBounds && (!hasZoom || !hasCenter)) console.warn("<Map> component is missing configuration. You have to provide zoom and center (via the `zoom`/`defaultZoom` and `center`/`defaultCenter` props) or specify the region to show using `defaultBounds`. See https://visgl.github.io/react-google-maps/docs/api-reference/components/map#required");
	if (!mapOptions.center && defaultCenter) mapOptions.center = defaultCenter;
	if (!mapOptions.zoom && Number.isFinite(defaultZoom)) mapOptions.zoom = defaultZoom;
	if (!mapOptions.heading && Number.isFinite(defaultHeading)) mapOptions.heading = defaultHeading;
	if (!mapOptions.tilt && Number.isFinite(defaultTilt)) mapOptions.tilt = defaultTilt;
	const customIds = mapOptions.internalUsageAttributionIds;
	if (customIds == null) mapOptions.internalUsageAttributionIds = context.internalUsageAttributionIds;
	else mapOptions.internalUsageAttributionIds = [...context.internalUsageAttributionIds || [], ...customIds];
	for (const key of Object.keys(mapOptions)) if (mapOptions[key] === void 0) delete mapOptions[key];
	const savedMapStateRef = (0, import_react.useRef)(void 0);
	(0, import_react.useEffect)(() => {
		if (!container || !apiIsLoaded) return;
		const { addMapInstance, removeMapInstance } = context;
		const { mapId } = props;
		const cacheKey = `${mapId || "default"}:${renderingType || "default"}:${colorScheme || "LIGHT"}`;
		let mapDiv;
		let map;
		const cachedMap = reuseMaps && CachedMapStack.has(cacheKey) ? CachedMapStack.pop(cacheKey) : null;
		const cachedMapDiv = cachedMap === null || cachedMap === void 0 ? void 0 : cachedMap.getDiv();
		const reusedMap = cachedMap && cachedMapDiv instanceof Node ? cachedMap : null;
		if (reusedMap) {
			map = reusedMap;
			mapDiv = cachedMapDiv;
			container.appendChild(mapDiv);
			map.setOptions(mapOptions);
			setTimeout(() => map.moveCamera({}), 0);
		} else {
			if (cachedMap) google.maps.event.clearInstanceListeners(cachedMap);
			mapDiv = document.createElement("div");
			mapDiv.style.height = "100%";
			container.appendChild(mapDiv);
			map = new google.maps.Map(mapDiv, Object.assign(Object.assign(Object.assign({}, mapOptions), renderingType ? { renderingType } : {}), colorScheme ? { colorScheme } : {}));
		}
		setMap(map);
		addMapInstance(map, id);
		if (defaultBounds) {
			const { padding } = defaultBounds, defBounds = __rest(defaultBounds, ["padding"]);
			map.fitBounds(defBounds, padding);
		} else if (!hasZoom || !hasCenter) map.fitBounds({
			east: 180,
			west: -180,
			south: -90,
			north: 90
		});
		if (savedMapStateRef.current) {
			const { mapId: savedMapId, cameraState: savedCameraState } = savedMapStateRef.current;
			if (savedMapId !== mapId) map.moveCamera(savedCameraState);
		}
		return () => {
			savedMapStateRef.current = {
				mapId,
				cameraState: cameraStateRef.current
			};
			mapDiv.remove();
			if (reuseMaps) CachedMapStack.push(cacheKey, map);
			else google.maps.event.clearInstanceListeners(map);
			setMap(null);
			removeMapInstance(id);
		};
	}, [
		container,
		apiIsLoaded,
		id,
		props.mapId,
		props.renderingType,
		props.colorScheme
	]);
	return [
		map,
		containerRef,
		cameraStateRef
	];
}
var GoogleMapsContext = import_react.createContext(null);
var Map$1 = (props) => {
	const { children, id, className, style } = props;
	const context = (0, import_react.useContext)(APIProviderContext);
	const loadingStatus = useApiLoadingStatus();
	if (!context) throw new Error("<Map> can only be used inside an <ApiProvider> component.");
	const [map, mapRef, cameraStateRef] = useMapInstance(props, context);
	useMapCameraParams(map, cameraStateRef, props);
	useMapEvents(map, props);
	useMapOptions(map, props);
	const isDeckGlControlled = useDeckGLCameraUpdate(map, props);
	const isControlledExternally = !!props.controlled;
	(0, import_react.useEffect)(() => {
		if (!map) return;
		if (isDeckGlControlled) map.setOptions({ disableDefaultUI: true });
		if (isDeckGlControlled || isControlledExternally) map.setOptions({
			gestureHandling: "none",
			keyboardShortcuts: false
		});
		return () => {
			map.setOptions({
				gestureHandling: props.gestureHandling,
				keyboardShortcuts: props.keyboardShortcuts
			});
		};
	}, [
		map,
		isDeckGlControlled,
		isControlledExternally,
		props.gestureHandling,
		props.keyboardShortcuts
	]);
	const center = props.center ? toLatLngLiteral(props.center) : null;
	let lat = null;
	let lng = null;
	if (center && Number.isFinite(center.lat) && Number.isFinite(center.lng)) {
		lat = center.lat;
		lng = center.lng;
	}
	const cameraOptions = (0, import_react.useMemo)(() => {
		var _a, _b, _c;
		return {
			center: {
				lat: lat !== null && lat !== void 0 ? lat : 0,
				lng: lng !== null && lng !== void 0 ? lng : 0
			},
			zoom: (_a = props.zoom) !== null && _a !== void 0 ? _a : 0,
			heading: (_b = props.heading) !== null && _b !== void 0 ? _b : 0,
			tilt: (_c = props.tilt) !== null && _c !== void 0 ? _c : 0
		};
	}, [
		lat,
		lng,
		props.zoom,
		props.heading,
		props.tilt
	]);
	(0, import_react.useLayoutEffect)(() => {
		if (!map || !isControlledExternally) return;
		map.moveCamera(cameraOptions);
		const listener = map.addListener("bounds_changed", () => {
			map.moveCamera(cameraOptions);
		});
		return () => listener.remove();
	}, [
		map,
		isControlledExternally,
		cameraOptions
	]);
	const combinedStyle = (0, import_react.useMemo)(() => Object.assign({
		width: "100%",
		height: "100%",
		position: "relative",
		zIndex: isDeckGlControlled ? -1 : 0
	}, style), [style, isDeckGlControlled]);
	const contextValue = (0, import_react.useMemo)(() => ({ map }), [map]);
	if (loadingStatus === APILoadingStatus.AUTH_FAILURE) return import_react.createElement("div", {
		style: Object.assign({ position: "relative" }, className ? {} : combinedStyle),
		className
	}, import_react.createElement(AuthFailureMessage, null));
	return import_react.createElement("div", Object.assign({
		ref: mapRef,
		"data-testid": "map",
		style: className ? void 0 : combinedStyle,
		className
	}, id ? { id } : {}), map ? import_react.createElement(GoogleMapsContext.Provider, { value: contextValue }, children) : null);
};
Map$1.deckGLViewProps = true;
var shownMessages = /* @__PURE__ */ new Set();
function logErrorOnce(...args) {
	const key = JSON.stringify(args);
	if (!shownMessages.has(key)) {
		shownMessages.add(key);
		console.error(...args);
	}
}
/**
* Retrieves a map-instance from the context. This is either an instance
* identified by id or the parent map instance if no id is specified.
* Returns null if neither can be found.
*/
var useMap = (id = null) => {
	const ctx = (0, import_react.useContext)(APIProviderContext);
	const { map } = (0, import_react.useContext)(GoogleMapsContext) || {};
	if (ctx === null) {
		logErrorOnce("useMap(): failed to retrieve APIProviderContext. Make sure that the <APIProvider> component exists and that the component you are calling `useMap()` from is a sibling of the <APIProvider>.");
		return null;
	}
	const { mapInstances } = ctx;
	if (id !== null) return mapInstances[id] || null;
	if (map) return map;
	return mapInstances["default"] || null;
};
function useMapsLibrary(name) {
	var _a;
	const apiIsLoaded = useApiIsLoaded();
	const ctx = (0, import_react.useContext)(APIProviderContext);
	(0, import_react.useEffect)(() => {
		if (!apiIsLoaded || !ctx) return;
		ctx.importLibrary(name);
	}, [
		apiIsLoaded,
		ctx,
		name
	]);
	return (_a = ctx === null || ctx === void 0 ? void 0 : ctx.loadedLibraries[name]) !== null && _a !== void 0 ? _a : null;
}
/**
* A clone of the React namespace for reading APIs that may be missing in older
* supported React versions. Bundlers can rewrite direct React.someNewApi reads
* into named imports, which breaks React 17. Reading from this cloned object
* keeps those lookups optional.
*
* @see https://github.com/mui/material-ui/issues/41190#issuecomment-2040873379
*/
var SafeReact = Object.assign({}, import_react);
var useInsertionEffect = SafeReact.useInsertionEffect;
var useSafeInsertionEffect = useInsertionEffect && useInsertionEffect !== SafeReact.useLayoutEffect ? useInsertionEffect : (fn) => {
	fn();
};
function forbiddenInRender() {
	throw new Error("useEffectEvent: invalid call during rendering.");
}
function useEffectEventPolyfill(fn) {
	/**
	* Initialize the ref with `forbiddenInRender`, to catch illegal calls during
	* rendering. After the insertion effect ran, the ref will contain the actual
	* function, so all effects can see the actual value.
	*/
	const ref = (0, import_react.useRef)(forbiddenInRender);
	useSafeInsertionEffect(() => {
		ref.current = fn;
	}, [fn]);
	return ((...args) => ref.current(...args));
}
/**
* Uses a polyfill implementation of `useEffectEvent`. The native useEffectEvent
* implementation was causing issues that we do not fully understand yet.
*/
var useEffectEvent = useEffectEventPolyfill;
var noop$1 = () => {};
/**
* Internally used to bind events to Maps JavaScript API objects.
* @internal
*/
function useMapsEventListener(target, name, callback) {
	const eventFn = useEffectEvent(callback !== null && callback !== void 0 ? callback : noop$1);
	const isCallbackDefined = Boolean(callback);
	(0, import_react.useEffect)(() => {
		if (!target || !name || !isCallbackDefined) return;
		const listener = google.maps.event.addListener(target, name, eventFn);
		return () => listener.remove();
	}, [
		target,
		name,
		isCallbackDefined
	]);
}
/**
* Internally used to copy values from props into API-Objects
* whenever they change.
*
* @example
*   usePropBinding(marker, 'position', position);
*
* @internal
*/
function usePropBinding(object, prop, value) {
	(0, import_react.useEffect)(() => {
		if (!object) return;
		object[prop] = value;
	}, [
		object,
		prop,
		value
	]);
}
var noop = () => {};
/**
* Internally used to bind events to DOM nodes.
* @internal
*/
function useDomEventListener(target, name, callback) {
	const eventFn = useEffectEvent(callback !== null && callback !== void 0 ? callback : noop);
	const isCallbackDefined = Boolean(callback);
	(0, import_react.useEffect)(() => {
		if (!target || !name || !isCallbackDefined) return;
		const listenerCallback = eventFn;
		target.addEventListener(name, listenerCallback);
		return () => target.removeEventListener(name, listenerCallback);
	}, [
		target,
		name,
		isCallbackDefined
	]);
}
var GlobalStyleManager = class {
	constructor() {
		this.renderedStyles = /* @__PURE__ */ new Set();
		this.styleElement = null;
	}
	getStyleElement() {
		if (!this.styleElement) {
			this.styleElement = document.createElement("style");
			this.styleElement.setAttribute("data-rgm-anchor-styles", "");
			document.head.appendChild(this.styleElement);
		}
		return this.styleElement;
	}
	addAdvancedMarkerPointerEventsOverwrite() {
		if (this.renderedStyles.has("marker-pointer-events")) return;
		const styleElement = this.getStyleElement();
		styleElement.textContent += `
      gmp-advanced-marker[data-origin='rgm'] {
        pointer-events: none !important;
      }
    `;
		this.renderedStyles.add("marker-pointer-events");
	}
	cleanup() {
		if (this.styleElement) {
			this.styleElement.remove();
			this.styleElement = null;
			this.renderedStyles.clear();
		}
	}
};
var globalStyleManager = new GlobalStyleManager();
function isVersionGreaterEqual(major, minor) {
	var _a;
	if (!((_a = google === null || google === void 0 ? void 0 : google.maps) === null || _a === void 0 ? void 0 : _a.version)) return void 0;
	const version = google.maps.version.split(".");
	const currentMajor = parseInt(version[0], 10);
	const currentMinor = parseInt(version[1], 10);
	return currentMajor > major || currentMajor === major && currentMinor >= minor;
}
var AdvancedMarkerContext = import_react.createContext(null);
/**
* @deprecated Using `anchorPosition` is deprecated.
*   Use `anchorLeft` and `anchorTop` instead.
*/
var AdvancedMarkerAnchorPoint = {
	TOP_LEFT: ["0%", "0%"],
	TOP_CENTER: ["50%", "0%"],
	TOP: ["50%", "0%"],
	TOP_RIGHT: ["100%", "0%"],
	LEFT_CENTER: ["0%", "50%"],
	LEFT_TOP: ["0%", "0%"],
	LEFT: ["0%", "50%"],
	LEFT_BOTTOM: ["0%", "100%"],
	RIGHT_TOP: ["100%", "0%"],
	RIGHT: ["100%", "50%"],
	RIGHT_CENTER: ["100%", "50%"],
	RIGHT_BOTTOM: ["100%", "100%"],
	BOTTOM_LEFT: ["0%", "100%"],
	BOTTOM_CENTER: ["50%", "100%"],
	BOTTOM: ["50%", "100%"],
	BOTTOM_RIGHT: ["100%", "100%"],
	CENTER: ["50%", "50%"]
};
var AdvancedMarker = (0, import_react.forwardRef)((props, ref) => {
	const { children, style, className, anchorPoint } = props;
	const [marker, contentContainer] = useAdvancedMarker(props);
	const advancedMarkerContextValue = (0, import_react.useMemo)(() => marker ? { marker } : null, [marker]);
	(0, import_react.useImperativeHandle)(ref, () => marker, [marker]);
	if (!contentContainer) return null;
	return import_react.createElement(AdvancedMarkerContext.Provider, { value: advancedMarkerContextValue }, (0, import_react_dom.createPortal)(import_react.createElement(MarkerContent, {
		anchorPoint,
		styles: style,
		className
	}, children), contentContainer));
});
AdvancedMarker.displayName = "AdvancedMarker";
function isAdvancedMarker(marker) {
	return marker.content !== void 0;
}
function isElementNode(node) {
	return node.nodeType === Node.ELEMENT_NODE;
}
var MarkerContent = ({ children, styles, className }) => {
	return import_react.createElement("div", {
		className,
		style: styles
	}, children);
};
function useAdvancedMarker(props) {
	const [marker, setMarker] = (0, import_react.useState)(null);
	const [contentContainer, setContentContainer] = (0, import_react.useState)(null);
	const map = useMap();
	const markerLibrary = useMapsLibrary("marker");
	const { children, onClick, onKeyDown, onKeyUp, className, onMouseEnter, onMouseLeave, onDrag, onDragStart, onDragEnd, collisionBehavior, clickable, draggable, position, title, zIndex, anchorPoint, anchorLeft, anchorTop } = props;
	const numChildren = import_react.Children.count(children);
	(0, import_react.useEffect)(() => {
		if (!map || !markerLibrary) return;
		const newMarker = new markerLibrary.AdvancedMarkerElement();
		newMarker.map = map;
		setMarker(newMarker);
		let contentElement = null;
		if (numChildren > 0) {
			contentElement = document.createElement("div");
			newMarker.content = contentElement;
			setContentContainer(contentElement);
		}
		return () => {
			newMarker.map = null;
			contentElement === null || contentElement === void 0 || contentElement.remove();
			setMarker(null);
			setContentContainer(null);
		};
	}, [
		map,
		markerLibrary,
		numChildren
	]);
	(0, import_react.useEffect)(() => {
		if (!(marker === null || marker === void 0 ? void 0 : marker.content) || !isElementNode(marker.content) || numChildren > 0) return;
		marker.content.className = className !== null && className !== void 0 ? className : "";
	}, [
		marker,
		className,
		numChildren
	]);
	useAdvancedMarkerAnchoring(marker, anchorPoint, anchorLeft, anchorTop, numChildren > 0);
	usePropBinding(marker, "position", position);
	usePropBinding(marker, "title", title !== null && title !== void 0 ? title : "");
	usePropBinding(marker, "zIndex", zIndex);
	usePropBinding(marker, "collisionBehavior", collisionBehavior);
	(0, import_react.useEffect)(() => {
		if (!marker) return;
		if (draggable !== void 0) marker.gmpDraggable = draggable;
		else if (onDrag || onDragStart || onDragEnd) marker.gmpDraggable = true;
		else marker.gmpDraggable = false;
	}, [
		marker,
		draggable,
		onDrag,
		onDragEnd,
		onDragStart
	]);
	(0, import_react.useEffect)(() => {
		if (!marker) return;
		const gmpClickable = clickable !== void 0 ? clickable : Boolean(onClick) || Boolean(onKeyDown) || Boolean(onKeyUp) || Boolean(onMouseEnter) || Boolean(onMouseLeave);
		marker.gmpClickable = gmpClickable;
		if ((marker === null || marker === void 0 ? void 0 : marker.content) && isElementNode(marker.content)) {
			marker.content.style.pointerEvents = gmpClickable ? "all" : "none";
			marker.content.style.cursor = gmpClickable && onClick ? "pointer" : "";
		}
	}, [
		marker,
		clickable,
		onClick,
		onKeyDown,
		onKeyUp,
		onMouseEnter,
		onMouseLeave
	]);
	useMapsEventListener(marker, "drag", onDrag);
	useMapsEventListener(marker, "dragstart", onDragStart);
	useMapsEventListener(marker, "dragend", onDragEnd);
	useDomEventListener(marker, "gmp-click", onClick);
	useDomEventListener(marker, "keydown", onKeyDown);
	useDomEventListener(marker, "keyup", onKeyUp);
	useDomEventListener(marker, "mouseenter", onMouseEnter);
	useDomEventListener(marker, "mouseleave", onMouseLeave);
	return [marker, contentContainer];
}
function useAdvancedMarkerAnchoring(marker, anchorPoint, anchorLeft, anchorTop, hasChildren) {
	(0, import_react.useEffect)(() => {
		if (!marker || !hasChildren) return;
		const anchorOptionsSupported = isVersionGreaterEqual(3, 62);
		const contentElement = marker.content;
		if (!contentElement || !isElementNode(contentElement)) return;
		if (anchorLeft !== void 0 || anchorTop !== void 0) {
			if (!anchorOptionsSupported) console.warn(`AdvancedMarker: The anchorLeft and anchorTop props are only supported in Google Maps API version 3.62 and above. The current version is ${google.maps.version}.`);
			marker.anchorLeft = anchorLeft;
			marker.anchorTop = anchorTop;
			if (anchorPoint !== void 0) console.warn("AdvancedMarker: the anchorPoint prop is ignored when anchorLeft and/or anchorTop are set.");
			return;
		}
		if (anchorPoint !== void 0) {
			const [x, y] = anchorPoint !== null && anchorPoint !== void 0 ? anchorPoint : AdvancedMarkerAnchorPoint["BOTTOM"];
			const translateX = `calc(-1 * ${x})`;
			const translateY = `calc(-1 * ${y})`;
			if (anchorOptionsSupported) {
				marker.anchorLeft = translateX;
				marker.anchorTop = translateY;
				contentElement.style.transform = "";
			} else {
				contentElement.style.transform = `translate(50%, 100%) translate(${translateX}, ${translateY})`;
				marker.dataset.origin = "rgm";
				globalStyleManager.addAdvancedMarkerPointerEventsOverwrite();
			}
		}
	}, [
		marker,
		anchorPoint,
		anchorLeft,
		anchorTop,
		hasChildren
	]);
}
function useCircle(props) {
	var _a, _b, _c;
	const { onClick, onDrag, onDragStart, onDragEnd, onMouseOver, onMouseOut, onRadiusChanged, onCenterChanged, center, defaultCenter, radius, defaultRadius } = props, destructuredOptions = __rest(props, [
		"onClick",
		"onDrag",
		"onDragStart",
		"onDragEnd",
		"onMouseOver",
		"onMouseOut",
		"onRadiusChanged",
		"onCenterChanged",
		"center",
		"defaultCenter",
		"radius",
		"defaultRadius"
	]);
	const [circle, setCircle] = (0, import_react.useState)(null);
	const map = useMap();
	const circleOptions = useMemoized(Object.assign(Object.assign({}, destructuredOptions), {
		clickable: (_a = destructuredOptions.clickable) !== null && _a !== void 0 ? _a : Boolean(onClick),
		draggable: (_b = destructuredOptions.draggable) !== null && _b !== void 0 ? _b : Boolean(onDrag || onDragStart || onDragEnd || onCenterChanged),
		editable: (_c = destructuredOptions.editable) !== null && _c !== void 0 ? _c : Boolean(onRadiusChanged)
	}), deepEqual);
	(0, import_react.useEffect)(() => {
		if (!map) {
			if (map === void 0) console.error("<Circle> has to be inside a Map component.");
			return;
		}
		const newCircle = new google.maps.Circle(Object.assign(Object.assign({}, circleOptions), {
			center: center !== null && center !== void 0 ? center : defaultCenter,
			radius: radius !== null && radius !== void 0 ? radius : defaultRadius
		}));
		newCircle.setMap(map);
		setCircle(newCircle);
		return () => {
			newCircle.setMap(null);
			setCircle(null);
		};
	}, [map]);
	useMapsEventListener(circle, "click", onClick);
	useMapsEventListener(circle, "drag", onDrag);
	useMapsEventListener(circle, "dragstart", onDragStart);
	useMapsEventListener(circle, "dragend", onDragEnd);
	useMapsEventListener(circle, "mouseover", onMouseOver);
	useMapsEventListener(circle, "mouseout", onMouseOut);
	useMapsEventListener(circle, "radius_changed", onRadiusChanged ? () => {
		const newRadius = circle === null || circle === void 0 ? void 0 : circle.getRadius();
		if (newRadius !== void 0) onRadiusChanged(newRadius);
	} : null);
	useMapsEventListener(circle, "center_changed", onCenterChanged ? () => {
		onCenterChanged(circle === null || circle === void 0 ? void 0 : circle.getCenter());
	} : null);
	(0, import_react.useEffect)(() => {
		if (!circle) return;
		circle.setOptions(circleOptions);
	}, [circle, circleOptions]);
	(0, import_react.useEffect)(() => {
		if (!circle || !center) return;
		if (!latLngEquals(center, circle.getCenter())) circle.setCenter(center);
	}, [circle, center]);
	(0, import_react.useEffect)(() => {
		if (!circle || radius === void 0) return;
		if (radius !== circle.getRadius()) circle.setRadius(radius);
	}, [circle, radius]);
	return circle;
}
var Circle = (0, import_react.forwardRef)((props, ref) => {
	const circle = useCircle(props);
	(0, import_react.useImperativeHandle)(ref, () => circle, [circle]);
	return import_react.createElement(import_react.Fragment, null);
});
Circle.displayName = "Circle";
function setValueForStyles(element, styles, prevStyles) {
	if (styles != null && typeof styles !== "object") throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
	const elementStyle = element.style;
	if (prevStyles == null) {
		if (styles == null) return;
		for (const styleName in styles) {
			if (!styles.hasOwnProperty(styleName)) continue;
			setValueForStyle(elementStyle, styleName, styles[styleName]);
		}
		return;
	}
	for (const styleName in prevStyles) if (prevStyles.hasOwnProperty(styleName) && (styles == null || !styles.hasOwnProperty(styleName))) if (styleName.indexOf("--") === 0) elementStyle.setProperty(styleName, "");
	else if (styleName === "float") elementStyle.cssFloat = "";
	else elementStyle[styleName] = "";
	if (styles == null) return;
	for (const styleName in styles) {
		const value = styles[styleName];
		if (styles.hasOwnProperty(styleName) && prevStyles[styleName] !== value) setValueForStyle(elementStyle, styleName, value);
	}
}
function setValueForStyle(elementStyle, styleName, value) {
	const isCustomProperty = styleName.indexOf("--") === 0;
	if (value == null || typeof value === "boolean" || value === "") if (isCustomProperty) elementStyle.setProperty(styleName, "");
	else if (styleName === "float") elementStyle.cssFloat = "";
	else elementStyle[styleName] = "";
	else if (isCustomProperty) elementStyle.setProperty(styleName, value);
	else if (typeof value === "number" && value !== 0 && !isUnitlessNumber(styleName)) elementStyle[styleName] = value + "px";
	else if (styleName === "float") elementStyle.cssFloat = value;
	else elementStyle[styleName] = ("" + value).trim();
}
var unitlessNumbers = /* @__PURE__ */ new Set([
	"animationIterationCount",
	"aspectRatio",
	"borderImageOutset",
	"borderImageSlice",
	"borderImageWidth",
	"boxFlex",
	"boxFlexGroup",
	"boxOrdinalGroup",
	"columnCount",
	"columns",
	"flex",
	"flexGrow",
	"flexPositive",
	"flexShrink",
	"flexNegative",
	"flexOrder",
	"gridArea",
	"gridRow",
	"gridRowEnd",
	"gridRowSpan",
	"gridRowStart",
	"gridColumn",
	"gridColumnEnd",
	"gridColumnSpan",
	"gridColumnStart",
	"fontWeight",
	"lineClamp",
	"lineHeight",
	"opacity",
	"order",
	"orphans",
	"scale",
	"tabSize",
	"widows",
	"zIndex",
	"zoom",
	"fillOpacity",
	"floodOpacity",
	"stopOpacity",
	"strokeDasharray",
	"strokeDashoffset",
	"strokeMiterlimit",
	"strokeOpacity",
	"strokeWidth"
]);
function isUnitlessNumber(name) {
	return unitlessNumbers.has(name);
}
/**
* Component to render an Info Window with the Maps JavaScript API
*/
var InfoWindow = (props) => {
	const { children, headerContent, style, className, pixelOffset, anchor, shouldFocus, onClose, onCloseClick } = props, volatileInfoWindowOptions = __rest(props, [
		"children",
		"headerContent",
		"style",
		"className",
		"pixelOffset",
		"anchor",
		"shouldFocus",
		"onClose",
		"onCloseClick"
	]);
	const mapsLibrary = useMapsLibrary("maps");
	const [infoWindow, setInfoWindow] = (0, import_react.useState)(null);
	const contentContainerRef = (0, import_react.useRef)(null);
	const headerContainerRef = (0, import_react.useRef)(null);
	const infoWindowOptions = useMemoized(volatileInfoWindowOptions, deepEqual);
	(0, import_react.useEffect)(() => {
		if (!mapsLibrary) return;
		contentContainerRef.current = document.createElement("div");
		headerContainerRef.current = document.createElement("div");
		const opts = Object.assign({}, infoWindowOptions);
		if (pixelOffset) opts.pixelOffset = new google.maps.Size(pixelOffset[0], pixelOffset[1]);
		if (headerContent) opts.headerContent = typeof headerContent === "string" ? headerContent : headerContainerRef.current;
		const infoWindow = new google.maps.InfoWindow(opts);
		infoWindow.setContent(contentContainerRef.current);
		setInfoWindow(infoWindow);
		return () => {
			var _a, _b;
			infoWindow.setContent(null);
			(_a = contentContainerRef.current) === null || _a === void 0 || _a.remove();
			(_b = headerContainerRef.current) === null || _b === void 0 || _b.remove();
			contentContainerRef.current = null;
			headerContainerRef.current = null;
			setInfoWindow(null);
		};
	}, [mapsLibrary]);
	const prevStyleRef = (0, import_react.useRef)(null);
	(0, import_react.useLayoutEffect)(() => {
		if (!infoWindow || !contentContainerRef.current) return;
		setValueForStyles(contentContainerRef.current, style || null, prevStyleRef.current);
		prevStyleRef.current = style || null;
		if (className !== contentContainerRef.current.className) contentContainerRef.current.className = className || "";
	}, [
		infoWindow,
		className,
		style
	]);
	(0, import_react.useEffect)(() => {
		if (!infoWindow) return;
		const opts = Object.assign({}, infoWindowOptions);
		if (!pixelOffset) opts.pixelOffset = null;
		else opts.pixelOffset = new google.maps.Size(pixelOffset[0], pixelOffset[1]);
		if (!headerContent) opts.headerContent = null;
		else opts.headerContent = typeof headerContent === "string" ? headerContent : headerContainerRef.current;
		infoWindow.setOptions(opts);
	}, [
		infoWindowOptions,
		pixelOffset,
		headerContent
	]);
	useMapsEventListener(infoWindow, "close", onClose);
	useMapsEventListener(infoWindow, "closeclick", onCloseClick);
	const map = useMap();
	(0, import_react.useEffect)(() => {
		var _a;
		if (!map || !infoWindow || anchor === null) return;
		const isOpenedWithAnchor = !!anchor;
		const openOptions = { map };
		if (anchor) {
			openOptions.anchor = anchor;
			if (isAdvancedMarker(anchor) && anchor.content instanceof Element) {
				const anchorBcr = anchor === null || anchor === void 0 ? void 0 : anchor.getBoundingClientRect();
				if (anchorBcr && anchor.dataset.origin === "rgm") {
					const anchorDomContent = (_a = anchor.content.firstElementChild) === null || _a === void 0 ? void 0 : _a.firstElementChild;
					const contentBcr = anchorDomContent === null || anchorDomContent === void 0 ? void 0 : anchorDomContent.getBoundingClientRect();
					const anchorOffsetX = contentBcr.x - anchorBcr.x + (contentBcr.width - anchorBcr.width) / 2;
					const anchorOffsetY = contentBcr.y - anchorBcr.y;
					const opts = Object.assign({}, infoWindowOptions);
					opts.pixelOffset = new google.maps.Size(pixelOffset ? pixelOffset[0] + anchorOffsetX : anchorOffsetX, pixelOffset ? pixelOffset[1] + anchorOffsetY : anchorOffsetY);
					infoWindow.setOptions(opts);
				}
			}
		}
		if (shouldFocus !== void 0) openOptions.shouldFocus = shouldFocus;
		infoWindow.open(openOptions);
		return () => {
			if (isOpenedWithAnchor) infoWindow.set("anchor", null);
			infoWindow.close();
		};
	}, [
		infoWindow,
		anchor,
		map,
		shouldFocus,
		infoWindowOptions,
		pixelOffset
	]);
	return import_react.createElement(import_react.Fragment, null, contentContainerRef.current && (0, import_react_dom.createPortal)(children, contentContainerRef.current), headerContainerRef.current !== null && (0, import_react_dom.createPortal)(headerContent, headerContainerRef.current));
};
/**
* Extracts paths as a nested array from a Polygon instance.
*/
function getPathsArray(polygon) {
	const mvcPaths = polygon.getPaths();
	const result = [];
	for (let i = 0; i < mvcPaths.getLength(); i++) result.push(mvcPaths.getAt(i).getArray());
	return result;
}
function usePolygon(props) {
	var _a, _b, _c;
	const { onClick, onDrag, onDragStart, onDragEnd, onMouseOver, onMouseOut, onPathsChanged, polygon: externalPolygon, encodedPaths, paths, defaultPaths } = props, destructuredOptions = __rest(props, [
		"onClick",
		"onDrag",
		"onDragStart",
		"onDragEnd",
		"onMouseOver",
		"onMouseOut",
		"onPathsChanged",
		"polygon",
		"encodedPaths",
		"paths",
		"defaultPaths"
	]);
	const [polygon, setPolygon] = (0, import_react.useState)(null);
	const map = useMap();
	const geometryLibrary = useMapsLibrary("geometry");
	const isUpdatingRef = (0, import_react.useRef)(false);
	const polygonOptions = useMemoized(Object.assign(Object.assign({}, destructuredOptions), {
		clickable: (_a = destructuredOptions.clickable) !== null && _a !== void 0 ? _a : Boolean(onClick),
		draggable: (_b = destructuredOptions.draggable) !== null && _b !== void 0 ? _b : Boolean(onDrag || onDragStart || onDragEnd || onPathsChanged),
		editable: (_c = destructuredOptions.editable) !== null && _c !== void 0 ? _c : Boolean(onPathsChanged)
	}), deepEqual);
	(0, import_react.useEffect)(() => {
		if (!map) {
			if (map === void 0) console.error("<Polygon> has to be inside a Map component.");
			return;
		}
		let instance;
		if (externalPolygon) {
			instance = externalPolygon;
			const initialPaths = paths !== null && paths !== void 0 ? paths : defaultPaths;
			if (initialPaths && Array.isArray(initialPaths)) instance.setPaths(initialPaths);
			instance.setOptions(polygonOptions);
		} else {
			const initialPaths = paths !== null && paths !== void 0 ? paths : defaultPaths;
			const polygonOptionsWithPaths = Object.assign({}, polygonOptions);
			if (initialPaths && Array.isArray(initialPaths)) polygonOptionsWithPaths.paths = initialPaths;
			instance = new google.maps.Polygon(polygonOptionsWithPaths);
		}
		instance.setMap(map);
		setPolygon(instance);
		return () => {
			instance.setMap(null);
			setPolygon(null);
		};
	}, [map, externalPolygon]);
	useMapsEventListener(polygon, "click", onClick);
	useMapsEventListener(polygon, "drag", onDrag);
	useMapsEventListener(polygon, "dragstart", onDragStart);
	useMapsEventListener(polygon, "mouseover", onMouseOver);
	useMapsEventListener(polygon, "mouseout", onMouseOut);
	useMapsEventListener(polygon, "dragend", (e) => {
		onDragEnd === null || onDragEnd === void 0 || onDragEnd(e);
		if (onPathsChanged && polygon && !isUpdatingRef.current) onPathsChanged(getPathsArray(polygon));
	});
	(0, import_react.useEffect)(() => {
		if (!polygon || !onPathsChanged) return;
		const listeners = [];
		const mvcPaths = polygon.getPaths();
		if (typeof mvcPaths.getLength !== "function" || typeof mvcPaths.getAt !== "function") return;
		const handlePathsChange = () => {
			if (!isUpdatingRef.current) onPathsChanged(getPathsArray(polygon));
		};
		const subscribeToInnerPath = (innerPath) => {
			listeners.push(google.maps.event.addListener(innerPath, "insert_at", handlePathsChange));
			listeners.push(google.maps.event.addListener(innerPath, "remove_at", handlePathsChange));
			listeners.push(google.maps.event.addListener(innerPath, "set_at", handlePathsChange));
		};
		for (let i = 0; i < mvcPaths.getLength(); i++) subscribeToInnerPath(mvcPaths.getAt(i));
		listeners.push(google.maps.event.addListener(mvcPaths, "insert_at", (index) => {
			subscribeToInnerPath(mvcPaths.getAt(index));
			handlePathsChange();
		}));
		listeners.push(google.maps.event.addListener(mvcPaths, "set_at", (index) => {
			subscribeToInnerPath(mvcPaths.getAt(index));
			handlePathsChange();
		}));
		listeners.push(google.maps.event.addListener(mvcPaths, "remove_at", handlePathsChange));
		return () => {
			listeners.forEach((listener) => listener.remove());
		};
	}, [
		polygon,
		onPathsChanged,
		paths,
		encodedPaths,
		polygonOptions.editable,
		polygonOptions.draggable
	]);
	(0, import_react.useEffect)(() => {
		if (!polygon) return;
		polygon.setOptions(polygonOptions);
	}, [polygon, polygonOptions]);
	(0, import_react.useEffect)(() => {
		if (!polygon || !paths) return;
		if (!Array.isArray(paths)) return;
		const firstPath = paths[0];
		if (!pathsEquals(Array.isArray(firstPath) ? paths : [paths], polygon.getPaths())) {
			isUpdatingRef.current = true;
			polygon.setPaths(paths);
			isUpdatingRef.current = false;
		}
	}, [polygon, paths]);
	(0, import_react.useEffect)(() => {
		if (!polygon || !encodedPaths || !geometryLibrary) return;
		isUpdatingRef.current = true;
		const decodedPaths = encodedPaths.map((encodedPath) => geometryLibrary.encoding.decodePath(encodedPath));
		polygon.setPaths(decodedPaths);
		isUpdatingRef.current = false;
	}, [
		polygon,
		encodedPaths,
		geometryLibrary
	]);
	return polygon;
}
var Polygon = (0, import_react.forwardRef)((props, ref) => {
	const polygon = usePolygon(props);
	(0, import_react.useImperativeHandle)(ref, () => polygon, [polygon]);
	return import_react.createElement(import_react.Fragment, null);
});
Polygon.displayName = "Polygon";
function usePolyline(props) {
	var _a, _b, _c;
	const { onClick, onDrag, onDragStart, onDragEnd, onMouseOver, onMouseOut, onPathChanged, polyline: externalPolyline, encodedPath, path, defaultPath } = props, destructuredOptions = __rest(props, [
		"onClick",
		"onDrag",
		"onDragStart",
		"onDragEnd",
		"onMouseOver",
		"onMouseOut",
		"onPathChanged",
		"polyline",
		"encodedPath",
		"path",
		"defaultPath"
	]);
	const [polyline, setPolyline] = (0, import_react.useState)(null);
	const map = useMap();
	const geometryLibrary = useMapsLibrary("geometry");
	const isUpdatingRef = (0, import_react.useRef)(false);
	const polylineOptions = useMemoized(Object.assign(Object.assign({}, destructuredOptions), {
		clickable: (_a = destructuredOptions.clickable) !== null && _a !== void 0 ? _a : Boolean(onClick),
		draggable: (_b = destructuredOptions.draggable) !== null && _b !== void 0 ? _b : Boolean(onDrag || onDragStart || onDragEnd || onPathChanged),
		editable: (_c = destructuredOptions.editable) !== null && _c !== void 0 ? _c : Boolean(onPathChanged)
	}), deepEqual);
	(0, import_react.useEffect)(() => {
		if (!map) {
			if (map === void 0) console.error("<Polyline> has to be inside a Map component.");
			return;
		}
		let instance;
		if (externalPolyline) {
			instance = externalPolyline;
			const initialPath = path !== null && path !== void 0 ? path : defaultPath;
			if (initialPath && Array.isArray(initialPath)) instance.setPath(initialPath);
			instance.setOptions(polylineOptions);
		} else {
			const initialPath = path !== null && path !== void 0 ? path : defaultPath;
			const polylineOptionsWithPath = Object.assign({}, polylineOptions);
			if (initialPath && Array.isArray(initialPath)) polylineOptionsWithPath.path = initialPath;
			instance = new google.maps.Polyline(polylineOptionsWithPath);
		}
		instance.setMap(map);
		setPolyline(instance);
		return () => {
			instance.setMap(null);
			setPolyline(null);
		};
	}, [map, externalPolyline]);
	useMapsEventListener(polyline, "click", onClick);
	useMapsEventListener(polyline, "drag", onDrag);
	useMapsEventListener(polyline, "dragstart", onDragStart);
	useMapsEventListener(polyline, "mouseover", onMouseOver);
	useMapsEventListener(polyline, "mouseout", onMouseOut);
	useMapsEventListener(polyline, "dragend", (e) => {
		onDragEnd === null || onDragEnd === void 0 || onDragEnd(e);
		if (onPathChanged && polyline && !isUpdatingRef.current) onPathChanged(polyline.getPath().getArray());
	});
	(0, import_react.useEffect)(() => {
		if (!polyline || !onPathChanged) return;
		const mvcPath = polyline.getPath();
		if (!mvcPath) return;
		const handlePathChange = () => {
			if (!isUpdatingRef.current) onPathChanged(mvcPath.getArray());
		};
		const listeners = [
			google.maps.event.addListener(mvcPath, "insert_at", handlePathChange),
			google.maps.event.addListener(mvcPath, "remove_at", handlePathChange),
			google.maps.event.addListener(mvcPath, "set_at", handlePathChange)
		];
		return () => {
			listeners.forEach((listener) => listener.remove());
		};
	}, [
		polyline,
		onPathChanged,
		path,
		encodedPath,
		polylineOptions.editable,
		polylineOptions.draggable
	]);
	(0, import_react.useEffect)(() => {
		if (!polyline) return;
		polyline.setOptions(polylineOptions);
	}, [polyline, polylineOptions]);
	(0, import_react.useEffect)(() => {
		if (!polyline || !path) return;
		const currentPath = polyline.getPath();
		if (!pathEquals(path, currentPath)) {
			isUpdatingRef.current = true;
			polyline.setPath(path);
			isUpdatingRef.current = false;
		}
	}, [polyline, path]);
	(0, import_react.useEffect)(() => {
		if (!polyline || !encodedPath || !geometryLibrary) return;
		isUpdatingRef.current = true;
		const decodedPath = geometryLibrary.encoding.decodePath(encodedPath);
		polyline.setPath(decodedPath);
		isUpdatingRef.current = false;
	}, [
		polyline,
		encodedPath,
		geometryLibrary
	]);
	return polyline;
}
var Polyline = (0, import_react.forwardRef)((props, ref) => {
	const polyline = usePolyline(props);
	(0, import_react.useImperativeHandle)(ref, () => polyline, [polyline]);
	return import_react.createElement(import_react.Fragment, null);
});
Polyline.displayName = "Polyline";
var DEFAULT_CAMERA_STATE = {
	center: {
		lat: 0,
		lng: 0,
		altitude: 0
	},
	range: 0,
	heading: 0,
	tilt: 0,
	roll: 0
};
/**
* Camera property names that correspond to gmp-*change events.
*/
var CAMERA_PROPS = [
	"center",
	"range",
	"heading",
	"tilt",
	"roll"
];
/**
* Updates the camera state ref with values from the map element.
*/
function updateCameraState(map3d, ref, prop) {
	const value = map3d[prop];
	if (value == null) return;
	if (prop === "center") {
		const center = value;
		ref.current.center = center.toJSON ? center.toJSON() : center;
	} else ref.current[prop] = value;
}
/**
* Creates a mutable ref object to track the last known state of the 3D map camera.
* This is used in `useMap3DCameraParams` to reduce stuttering by avoiding updates
* of the map camera with values that have already been processed.
*
* @internal
*/
function useTrackedCameraStateRef3D(map3d) {
	const forceUpdate = useForceUpdate();
	const ref = (0, import_react.useRef)(Object.assign({}, DEFAULT_CAMERA_STATE));
	(0, import_react.useEffect)(() => {
		if (!map3d) return;
		const listeners = [];
		for (const prop of CAMERA_PROPS) {
			const eventName = `gmp-${prop}change`;
			const handler = () => {
				updateCameraState(map3d, ref, prop);
				forceUpdate();
			};
			map3d.addEventListener(eventName, handler);
			listeners.push(() => map3d.removeEventListener(eventName, handler));
		}
		return () => {
			for (const removeListener of listeners) removeListener();
		};
	}, [map3d, forceUpdate]);
	return ref;
}
/**
* Hook to manage the Map3DElement instance lifecycle.
*
* Handles:
* - Waiting for the 'maps3d' library to load
* - Waiting for the 'gmp-map-3d' custom element to be defined
* - Creating a callback ref for the element
* - Applying initial options when the element is ready
* - Tracking camera state
*
* @internal
*/
function useMap3DInstance(props) {
	const maps3dLib = useMapsLibrary("maps3d");
	const [customElementReady, setCustomElementReady] = (0, import_react.useState)(false);
	const [, containerRef] = useCallbackRef();
	const [map3d, map3dRef] = useCallbackRef();
	const cameraStateRef = useTrackedCameraStateRef3D(map3d);
	(0, import_react.useEffect)(() => {
		customElements.whenDefined("gmp-map-3d").then(() => {
			setCustomElementReady(true);
		});
	}, []);
	(0, import_react.useEffect)(() => {
		if (!map3d) return;
		const { center, heading, tilt, range, roll, defaultCenter, defaultHeading, defaultTilt, defaultRange, defaultRoll, id, style, className, children, onCenterChanged, onHeadingChanged, onTiltChanged, onRangeChanged, onRollChanged, onCameraChanged, onClick, onSteadyChange, onAnimationEnd, onError, mode, gestureHandling } = props, elementOptions = __rest(props, [
			"center",
			"heading",
			"tilt",
			"range",
			"roll",
			"defaultCenter",
			"defaultHeading",
			"defaultTilt",
			"defaultRange",
			"defaultRoll",
			"id",
			"style",
			"className",
			"children",
			"onCenterChanged",
			"onHeadingChanged",
			"onTiltChanged",
			"onRangeChanged",
			"onRollChanged",
			"onCameraChanged",
			"onClick",
			"onSteadyChange",
			"onAnimationEnd",
			"onError",
			"mode",
			"gestureHandling"
		]);
		const initialCenter = center !== null && center !== void 0 ? center : defaultCenter;
		const initialHeading = heading !== null && heading !== void 0 ? heading : defaultHeading;
		const initialTilt = tilt !== null && tilt !== void 0 ? tilt : defaultTilt;
		const initialRange = range !== null && range !== void 0 ? range : defaultRange;
		const initialRoll = roll !== null && roll !== void 0 ? roll : defaultRoll;
		const initialOptions = Object.assign({}, elementOptions);
		if (initialCenter) initialOptions.center = initialCenter;
		if (initialHeading !== void 0) initialOptions.heading = initialHeading;
		if (initialTilt !== void 0) initialOptions.tilt = initialTilt;
		if (initialRange !== void 0) initialOptions.range = initialRange;
		if (initialRoll !== void 0) initialOptions.roll = initialRoll;
		Object.assign(map3d, initialOptions);
	}, [map3d]);
	return [
		map3d,
		containerRef,
		map3dRef,
		cameraStateRef,
		!!maps3dLib && customElementReady
	];
}
/**
* Converts a LatLngAltitude or LatLngAltitudeLiteral to a literal object.
*/
function toLatLngAltitudeLiteral(value) {
	if (!value) return null;
	if ("toJSON" in value && typeof value.toJSON === "function") return value.toJSON();
	return value;
}
/**
* Hook to update Map3D camera parameters when props change.
* Compares the current camera state with props and updates only when there are differences.
*
* @internal
*/
function useMap3DCameraParams(map3d, cameraStateRef, props) {
	var _a, _b, _c, _d, _e, _f, _g;
	const centerLiteral = toLatLngAltitudeLiteral(props.center);
	const lat = (_a = centerLiteral === null || centerLiteral === void 0 ? void 0 : centerLiteral.lat) !== null && _a !== void 0 ? _a : null;
	const lng = (_b = centerLiteral === null || centerLiteral === void 0 ? void 0 : centerLiteral.lng) !== null && _b !== void 0 ? _b : null;
	const altitude = (_c = centerLiteral === null || centerLiteral === void 0 ? void 0 : centerLiteral.altitude) !== null && _c !== void 0 ? _c : null;
	const range = (_d = props.range) !== null && _d !== void 0 ? _d : null;
	const heading = (_e = props.heading) !== null && _e !== void 0 ? _e : null;
	const tilt = (_f = props.tilt) !== null && _f !== void 0 ? _f : null;
	const roll = (_g = props.roll) !== null && _g !== void 0 ? _g : null;
	(0, import_react.useLayoutEffect)(() => {
		var _a;
		if (!map3d) return;
		const currentState = cameraStateRef.current;
		if (lat !== null && lng !== null && (currentState.center.lat !== lat || currentState.center.lng !== lng || altitude !== null && currentState.center.altitude !== altitude)) map3d.center = {
			lat,
			lng,
			altitude: (_a = altitude !== null && altitude !== void 0 ? altitude : currentState.center.altitude) !== null && _a !== void 0 ? _a : 0
		};
		if (range !== null && currentState.range !== range) map3d.range = range;
		if (heading !== null && currentState.heading !== heading) map3d.heading = heading;
		if (tilt !== null && currentState.tilt !== tilt) map3d.tilt = tilt;
		if (roll !== null && currentState.roll !== roll) map3d.roll = roll;
	});
}
/**
* Camera-related event types for the aggregated onCameraChanged handler.
*/
var CAMERA_EVENTS = [
	"gmp-centerchange",
	"gmp-headingchange",
	"gmp-tiltchange",
	"gmp-rangechange",
	"gmp-rollchange"
];
/**
* Creates a camera changed event with current camera state.
*/
function createCameraEvent(map3d, type) {
	const center = map3d.center;
	let centerLiteral;
	if (center && "toJSON" in center && typeof center.toJSON === "function") centerLiteral = center.toJSON();
	else if (center) centerLiteral = center;
	else centerLiteral = {
		lat: 0,
		lng: 0,
		altitude: 0
	};
	return {
		type,
		map3d,
		detail: {
			center: centerLiteral,
			range: map3d.range || 0,
			heading: map3d.heading || 0,
			tilt: map3d.tilt || 0,
			roll: map3d.roll || 0
		}
	};
}
/**
* Creates a click event from a LocationClickEvent or PlaceClickEvent.
*/
function createClickEvent(map3d, srcEvent) {
	const placeClickEvent = srcEvent;
	return {
		type: "gmp-click",
		map3d,
		detail: {
			position: srcEvent.position || null,
			placeId: placeClickEvent.placeId
		}
	};
}
/**
* Creates a steady change event.
*/
function createSteadyChangeEvent(map3d, srcEvent) {
	return {
		type: "gmp-steadychange",
		map3d,
		detail: { isSteady: srcEvent.isSteady }
	};
}
/**
* Hook to set up event handlers for Map3D events.
*
* @internal
*/
function useMap3DEvents(map3d, props) {
	const { onCenterChanged, onHeadingChanged, onTiltChanged, onRangeChanged, onRollChanged, onCameraChanged, onClick, onSteadyChange, onAnimationEnd, onError } = props;
	useMap3DEvent(map3d, "gmp-centerchange", onCenterChanged, createCameraEvent);
	useMap3DEvent(map3d, "gmp-headingchange", onHeadingChanged, createCameraEvent);
	useMap3DEvent(map3d, "gmp-tiltchange", onTiltChanged, createCameraEvent);
	useMap3DEvent(map3d, "gmp-rangechange", onRangeChanged, createCameraEvent);
	useMap3DEvent(map3d, "gmp-rollchange", onRollChanged, createCameraEvent);
	(0, import_react.useEffect)(() => {
		if (!map3d || !onCameraChanged) return;
		const handler = () => {
			onCameraChanged(createCameraEvent(map3d, "camerachange"));
		};
		for (const eventName of CAMERA_EVENTS) map3d.addEventListener(eventName, handler);
		return () => {
			for (const eventName of CAMERA_EVENTS) map3d.removeEventListener(eventName, handler);
		};
	}, [map3d, onCameraChanged]);
	(0, import_react.useEffect)(() => {
		if (!map3d || !onClick) return;
		const handler = (ev) => {
			onClick(createClickEvent(map3d, ev));
		};
		map3d.addEventListener("gmp-click", handler);
		return () => map3d.removeEventListener("gmp-click", handler);
	}, [map3d, onClick]);
	(0, import_react.useEffect)(() => {
		if (!map3d || !onSteadyChange) return;
		const handler = (ev) => {
			onSteadyChange(createSteadyChangeEvent(map3d, ev));
		};
		map3d.addEventListener("gmp-steadychange", handler);
		return () => map3d.removeEventListener("gmp-steadychange", handler);
	}, [map3d, onSteadyChange]);
	useMap3DEvent(map3d, "gmp-animationend", onAnimationEnd, (map3d, type) => ({
		type,
		map3d
	}));
	useMap3DEvent(map3d, "gmp-error", onError, (map3d, type) => ({
		type,
		map3d
	}));
}
/**
* Helper hook for individual events.
*/
function useMap3DEvent(map3d, eventName, handler, createEvent) {
	(0, import_react.useEffect)(() => {
		if (!map3d || !handler) return;
		const listener = () => {
			handler(createEvent(map3d, eventName));
		};
		map3d.addEventListener(eventName, listener);
		return () => map3d.removeEventListener(eventName, listener);
	}, [
		map3d,
		eventName,
		handler,
		createEvent
	]);
}
/**
* Set of option keys that can be updated on Map3DElement.
* Camera props (center, heading, tilt, range, roll) are handled separately.
*/
var MAP_3D_OPTION_KEYS = /* @__PURE__ */ new Set([
	"bounds",
	"defaultUIHidden",
	"gestureHandling",
	"internalUsageAttributionIds",
	"maxAltitude",
	"maxHeading",
	"maxTilt",
	"minAltitude",
	"minHeading",
	"minTilt",
	"mode"
]);
/**
* Hook to update Map3D options when props change.
*
* @internal
*/
function useMap3DOptions(map3d, props) {
	const options = (0, import_react.useMemo)(() => {
		const result = {};
		const keys = Object.keys(props);
		for (const key of keys) {
			if (!MAP_3D_OPTION_KEYS.has(key)) continue;
			const value = props[key];
			if (value === void 0) continue;
			result[key] = value;
		}
		return result;
	}, [props]);
	useDeepCompareEffect(() => {
		if (!map3d) return;
		Object.assign(map3d, options);
	}, [map3d, options]);
}
/**
* React context for accessing the Map3D instance from child components.
*/
var GoogleMaps3DContext = import_react.createContext(null);
/**
* Default styles for the map container.
*/
var DEFAULT_CONTAINER_STYLE = {
	width: "100%",
	height: "100%",
	position: "relative"
};
/**
* A React component that renders a 3D map using the Google Maps JavaScript API.
*
* @example
* ```tsx
* <APIProvider apiKey={API_KEY}>
*   <Map3D
*     defaultCenter={{ lat: 37.7749, lng: -122.4194, altitude: 1000 }}
*     defaultRange={5000}
*     defaultHeading={0}
*     defaultTilt={45}
*   />
* </APIProvider>
* ```
*/
var Map3D = (0, import_react.forwardRef)((props, ref) => {
	const { children, id, className, style } = props;
	const context = (0, import_react.useContext)(APIProviderContext);
	if (!context) throw new Error("<Map3D> can only be used inside an <APIProvider> component.");
	const { addMap3DInstance, removeMap3DInstance } = context;
	const [map3d, containerRef, map3dRef, cameraStateRef, isReady] = useMap3DInstance(props);
	useMap3DCameraParams(map3d, cameraStateRef, props);
	useMap3DEvents(map3d, props);
	useMap3DOptions(map3d, props);
	(0, import_react.useEffect)(() => {
		if (!map3d) return;
		const instanceId = id !== null && id !== void 0 ? id : "default";
		addMap3DInstance(map3d, instanceId);
		return () => {
			removeMap3DInstance(instanceId);
		};
	}, [map3d, id]);
	(0, import_react.useImperativeHandle)(ref, () => ({
		map3d,
		flyCameraAround: (options) => {
			map3d === null || map3d === void 0 || map3d.flyCameraAround(options);
		},
		flyCameraTo: (options) => {
			map3d === null || map3d === void 0 || map3d.flyCameraTo(options);
		},
		stopCameraAnimation: () => {
			map3d === null || map3d === void 0 || map3d.stopCameraAnimation();
		}
	}), [map3d]);
	const combinedStyle = (0, import_react.useMemo)(() => Object.assign(Object.assign({}, DEFAULT_CONTAINER_STYLE), style), [style]);
	const contextValue = (0, import_react.useMemo)(() => ({ map3d }), [map3d]);
	if (!isReady) return import_react.createElement("div", Object.assign({
		ref: containerRef,
		"data-testid": "map-3d",
		style: className ? void 0 : combinedStyle,
		className
	}, id ? { id } : {}));
	return import_react.createElement("div", Object.assign({
		ref: containerRef,
		"data-testid": "map-3d",
		style: className ? void 0 : combinedStyle,
		className
	}, id ? { id } : {}), import_react.createElement("gmp-map-3d", {
		ref: map3dRef,
		style: {
			width: "100%",
			height: "100%"
		}
	}, map3d && import_react.createElement(GoogleMaps3DContext.Provider, { value: contextValue }, children)));
});
Map3D.displayName = "Map3D";
var Marker3DContext = (0, import_react.createContext)(null);
/**
* Marker3D component for displaying markers on a Map3D.
*
* Automatically uses Marker3DInteractiveElement when onClick is provided,
* otherwise uses Marker3DElement.
*
* Children can include:
* - `<img>` elements (automatically wrapped in <template>)
* - `<svg>` elements (automatically wrapped in <template>)
* - PinElement instances (passed through directly)
*
* @example
* ```tsx
* // Basic marker
* <Marker3D position={{ lat: 37.7749, lng: -122.4194 }} label="SF" />
*
* // Interactive marker
* <Marker3D
*   position={{ lat: 37.7749, lng: -122.4194 }}
*   onClick={() => console.log('clicked')}
*   title="Click me"
* />
*
* // Custom marker with image
* <Marker3D position={{ lat: 37.7749, lng: -122.4194 }}>
*   <img src="/icon.png" width={32} height={32} />
* </Marker3D>
* ```
*/
var Marker3D = (0, import_react.forwardRef)(function Marker3D(props, ref) {
	const { children, onClick, position, altitudeMode, collisionBehavior, drawsWhenOccluded, extruded, label, sizePreserved, zIndex, title } = props;
	const isInteractive = Boolean(onClick);
	const [marker, setMarker] = (0, import_react.useState)(null);
	const [contentHandledExternally, setContentHandledExternally] = (0, import_react.useState)(false);
	const contentContainer = (0, import_react.useMemo)(() => {
		const container = document.createElement("div");
		container.style.display = "none";
		document.body.appendChild(container);
		return container;
	}, []);
	(0, import_react.useEffect)(() => {
		return () => contentContainer.remove();
	}, [contentContainer]);
	const markerRef = (0, import_react.useCallback)((node) => {
		setMarker(node);
		if (typeof ref === "function") ref(node);
		else if (ref) ref.current = node;
	}, [ref]);
	useDomEventListener(marker, "gmp-click", onClick);
	(0, import_react.useLayoutEffect)(() => {
		if (contentHandledExternally) return;
		if (!marker || !contentContainer) return;
		while (marker.firstChild) marker.removeChild(marker.firstChild);
		const childNodes = Array.from(contentContainer.childNodes);
		for (const node of childNodes) {
			if (node.nodeType !== Node.ELEMENT_NODE) continue;
			const element = node;
			const tagName = element.tagName.toLowerCase();
			if (tagName === "img" || tagName === "svg") {
				const template = document.createElement("template");
				template.content.appendChild(element.cloneNode(true));
				marker.appendChild(template);
			} else marker.appendChild(element.cloneNode(true));
		}
	}, [
		marker,
		contentContainer,
		children,
		contentHandledExternally
	]);
	const contextValue = (0, import_react.useMemo)(() => ({
		marker,
		setContentHandledExternally
	}), [marker]);
	usePropBinding(marker, "position", position);
	usePropBinding(marker, "altitudeMode", altitudeMode);
	usePropBinding(marker, "collisionBehavior", collisionBehavior);
	usePropBinding(marker, "drawsWhenOccluded", drawsWhenOccluded);
	usePropBinding(marker, "extruded", extruded);
	usePropBinding(marker, "label", label);
	usePropBinding(marker, "sizePreserved", sizePreserved);
	usePropBinding(marker, "zIndex", zIndex);
	usePropBinding(marker, "title", title !== null && title !== void 0 ? title : "");
	return import_react.createElement(Marker3DContext.Provider, { value: contextValue }, isInteractive ? import_react.createElement("gmp-marker-3d-interactive", { ref: markerRef }) : import_react.createElement("gmp-marker-3d", { ref: markerRef }), (0, import_react_dom.createPortal)(children, contentContainer));
});
Marker3D.displayName = "Marker3D";
/**
* Popover component for displaying info windows on a Map3D.
*
* Similar to InfoWindow for 2D maps, Popover provides a way to show
* contextual information at a specific location or attached to a marker
* on a 3D map.
*
* @example
* ```tsx
* // Basic popover at position
* <Popover
*   position={{ lat: 37.7749, lng: -122.4194 }}
*   open={isOpen}
* >
*   <div>Hello from San Francisco!</div>
* </Popover>
*
* // Popover anchored to a marker (place as sibling, use anchor prop)
* <Marker3D
*   ref={markerRef}
*   position={{ lat: 37.7749, lng: -122.4194 }}
*   onClick={() => setOpen(true)}
* />
* <Popover
*   anchor={markerRef.current}
*   open={isOpen}
*   onClose={() => setOpen(false)}
* >
*   <div>Marker info</div>
* </Popover>
* ```
*/
var Popover = (0, import_react.forwardRef)(function Popover(props, ref) {
	var _a;
	const { children, headerContent, style, className, open = true, position, anchor, anchorId, altitudeMode, lightDismissDisabled, autoPanDisabled, onClose } = props;
	const [popover, setPopover] = (0, import_react.useState)(null);
	const prevStyleRef = (0, import_react.useRef)(null);
	(0, import_react.useImperativeHandle)(ref, () => popover, [popover]);
	usePopoverCloseObserver(popover, open, onClose);
	usePropBinding(popover, "open", open !== null && open !== void 0 ? open : false);
	usePropBinding(popover, "altitudeMode", altitudeMode);
	usePropBinding(popover, "lightDismissDisabled", lightDismissDisabled);
	usePropBinding(popover, "autoPanDisabled", autoPanDisabled);
	usePropBinding(popover, "positionAnchor", (_a = anchor !== null && anchor !== void 0 ? anchor : anchorId) !== null && _a !== void 0 ? _a : position);
	(0, import_react.useLayoutEffect)(() => {
		if (!popover) return;
		setValueForStyles(popover, style || null, prevStyleRef.current);
		prevStyleRef.current = style || null;
	}, [popover, style]);
	return import_react.createElement("gmp-popover", {
		ref: setPopover,
		className
	}, headerContent && import_react.createElement("div", { slot: "header" }, headerContent), children);
});
Popover.displayName = "Popover";
/**
* Custom hook to observe the open attribute of a popover element
* and call onClose when it transitions from open to closed due to light dismiss.
* Does not call onClose when the open prop changes programmatically.
*/
function usePopoverCloseObserver(popover, open, onClose) {
	const previousOpenState = (0, import_react.useRef)(void 0);
	const openPropRef = (0, import_react.useRef)(open);
	(0, import_react.useEffect)(() => {
		openPropRef.current = open;
	}, [open]);
	(0, import_react.useEffect)(() => {
		if (!popover || !onClose) return;
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) if (mutation.type === "attributes" && mutation.attributeName === "open") {
				const isOpen = popover.hasAttribute("open");
				if (previousOpenState.current === true && !isOpen && openPropRef.current !== false) onClose();
				previousOpenState.current = isOpen;
			}
		});
		observer.observe(popover, {
			attributes: true,
			attributeFilter: ["open"]
		});
		previousOpenState.current = popover.hasAttribute("open");
		return () => {
			observer.disconnect();
		};
	}, [popover, onClose]);
}
function useMarker(props) {
	const [marker, setMarker] = (0, import_react.useState)(null);
	const map = useMap();
	const { onClick, onDrag, onDragStart, onDragEnd, onMouseOver, onMouseOut } = props, markerOptions = __rest(props, [
		"onClick",
		"onDrag",
		"onDragStart",
		"onDragEnd",
		"onMouseOver",
		"onMouseOut"
	]);
	const { position, draggable } = markerOptions;
	(0, import_react.useEffect)(() => {
		if (!map) {
			if (map === void 0) console.error("<Marker> has to be inside a Map component.");
			return;
		}
		const newMarker = new google.maps.Marker(markerOptions);
		newMarker.setMap(map);
		setMarker(newMarker);
		return () => {
			newMarker.setMap(null);
			setMarker(null);
		};
	}, [map]);
	(0, import_react.useEffect)(() => {
		if (!marker) return;
		const m = marker;
		const gme = google.maps.event;
		if (onClick) gme.addListener(m, "click", onClick);
		if (onDrag) gme.addListener(m, "drag", onDrag);
		if (onDragStart) gme.addListener(m, "dragstart", onDragStart);
		if (onDragEnd) gme.addListener(m, "dragend", onDragEnd);
		if (onMouseOver) gme.addListener(m, "mouseover", onMouseOver);
		if (onMouseOut) gme.addListener(m, "mouseout", onMouseOut);
		marker.setDraggable(Boolean(draggable));
		return () => {
			gme.clearInstanceListeners(m);
		};
	}, [
		marker,
		draggable,
		onClick,
		onDrag,
		onDragStart,
		onDragEnd,
		onMouseOver,
		onMouseOut
	]);
	(0, import_react.useEffect)(() => {
		if (!marker) return;
		if (markerOptions) marker.setOptions(markerOptions);
	}, [marker, markerOptions]);
	(0, import_react.useEffect)(() => {
		if (draggable || !position || !marker) return;
		marker.setPosition(position);
	}, [
		draggable,
		position,
		marker
	]);
	return marker;
}
/**
* Component to render a marker on a map
*/
var Marker = (0, import_react.forwardRef)((props, ref) => {
	const marker = useMarker(props);
	(0, import_react.useImperativeHandle)(ref, () => marker, [marker]);
	return import_react.createElement(import_react.Fragment, null);
});
Marker.displayName = "Marker";
function useRectangle(props) {
	var _a, _b, _c;
	const { onClick, onDrag, onDragStart, onDragEnd, onMouseOver, onMouseOut, onBoundsChanged, bounds, defaultBounds } = props, destructuredOptions = __rest(props, [
		"onClick",
		"onDrag",
		"onDragStart",
		"onDragEnd",
		"onMouseOver",
		"onMouseOut",
		"onBoundsChanged",
		"bounds",
		"defaultBounds"
	]);
	const [rectangle, setRectangle] = (0, import_react.useState)(null);
	const map = useMap();
	const rectangleOptions = useMemoized(Object.assign(Object.assign({}, destructuredOptions), {
		clickable: (_a = destructuredOptions.clickable) !== null && _a !== void 0 ? _a : Boolean(onClick),
		draggable: (_b = destructuredOptions.draggable) !== null && _b !== void 0 ? _b : Boolean(onDrag || onDragStart || onDragEnd || onBoundsChanged),
		editable: (_c = destructuredOptions.editable) !== null && _c !== void 0 ? _c : Boolean(onBoundsChanged)
	}), deepEqual);
	(0, import_react.useEffect)(() => {
		if (!map) {
			if (map === void 0) console.error("<Rectangle> has to be inside a Map component.");
			return;
		}
		const newRectangle = new google.maps.Rectangle(Object.assign(Object.assign({}, rectangleOptions), { bounds: bounds !== null && bounds !== void 0 ? bounds : defaultBounds }));
		newRectangle.setMap(map);
		setRectangle(newRectangle);
		return () => {
			newRectangle.setMap(null);
			setRectangle(null);
		};
	}, [map]);
	useMapsEventListener(rectangle, "click", onClick);
	useMapsEventListener(rectangle, "drag", onDrag);
	useMapsEventListener(rectangle, "dragstart", onDragStart);
	useMapsEventListener(rectangle, "dragend", onDragEnd);
	useMapsEventListener(rectangle, "mouseover", onMouseOver);
	useMapsEventListener(rectangle, "mouseout", onMouseOut);
	useMapsEventListener(rectangle, "bounds_changed", onBoundsChanged ? () => {
		onBoundsChanged(rectangle === null || rectangle === void 0 ? void 0 : rectangle.getBounds());
	} : null);
	(0, import_react.useEffect)(() => {
		if (!rectangle) return;
		rectangle.setOptions(rectangleOptions);
	}, [rectangle, rectangleOptions]);
	(0, import_react.useEffect)(() => {
		if (!rectangle || !bounds) return;
		if (!boundsEquals(bounds, rectangle.getBounds())) rectangle.setBounds(bounds);
	}, [rectangle, bounds]);
	return rectangle;
}
var Rectangle = (0, import_react.forwardRef)((props, ref) => {
	const rectangle = useRectangle(props);
	(0, import_react.useImperativeHandle)(ref, () => rectangle, [rectangle]);
	return import_react.createElement(import_react.Fragment, null);
});
Rectangle.displayName = "Rectangle";
//#endregion
export { useMap as a, Map$1 as i, AdvancedMarker as n, useMapsLibrary as o, InfoWindow as r, APIProvider as t };
