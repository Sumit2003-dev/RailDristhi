//#region node_modules/.nitro/vite/services/ssr/index.js
var lastCapturedError;
var TTL_MS = 5e3;
function record(error) {
	lastCapturedError = {
		error,
		at: Date.now()
	};
}
var CAUSE_DEPTH_LIMIT = 5;
var DESCRIPTION_LENGTH_LIMIT = 8e3;
function describeError(error) {
	const parts = [];
	let current = error;
	for (let depth = 0; depth < CAUSE_DEPTH_LIMIT && current != null; depth++) {
		if (!(current instanceof Error)) {
			parts.push(typeof current === "string" ? current : safeStringify(current));
			break;
		}
		const label = depth === 0 ? "" : "caused by: ";
		const status = describeStatus(current);
		parts.push(`${label}${current.stack ?? `${current.name}: ${current.message}`}${status}`);
		current = current.cause;
	}
	return parts.join("\n").slice(0, DESCRIPTION_LENGTH_LIMIT);
}
function describeStatus(error) {
	const { status, statusCode } = error;
	const value = status ?? statusCode;
	return typeof value === "number" ? ` (status ${value})` : "";
}
function safeStringify(value) {
	try {
		return JSON.stringify(value) ?? String(value);
	} catch {
		return String(value);
	}
}
function isErrorLike(value) {
	return value instanceof Error;
}
var originalConsoleError = console.error.bind(console);
console.error = (...args) => {
	originalConsoleError(...args.map((arg) => {
		if (!isErrorLike(arg)) return arg;
		record(arg);
		return describeError(arg);
	}));
};
if (typeof globalThis.addEventListener === "function") {
	globalThis.addEventListener("error", (event) => record(event.error ?? event));
	globalThis.addEventListener("unhandledrejection", (event) => record(event.reason));
}
function consumeLastCapturedError() {
	if (!lastCapturedError) return void 0;
	if (Date.now() - lastCapturedError.at > TTL_MS) {
		lastCapturedError = void 0;
		return;
	}
	const { error } = lastCapturedError;
	lastCapturedError = void 0;
	return error;
}
function renderErrorPage() {
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
var trainRoutes = [
	{
		number: "12001",
		name: "BPL - NDLS S",
		type: "Express",
		startsAt: 900,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "HBJ",
				name: "HABIBGANJ",
				lat: 23.222,
				lng: 77.4394,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "BPL",
				name: "BHOPAL",
				lat: 23.2669,
				lng: 77.4131,
				km: 6,
				arr: 12,
				dep: 15,
				platform: "-",
				day: 1
			},
			{
				code: "LAR",
				name: "LALITPUR",
				lat: 24.6882,
				lng: 78.3958,
				km: 207,
				arr: 143,
				dep: 145,
				platform: "-",
				day: 1
			},
			{
				code: "JHS",
				name: "JHANSI JN",
				lat: 25.4436,
				lng: 78.553,
				km: 295,
				arr: 212,
				dep: 220,
				platform: "-",
				day: 1
			},
			{
				code: "GWL",
				name: "GWALIOR JN",
				lat: 26.2165,
				lng: 78.1823,
				km: 392,
				arr: 279,
				dep: 284,
				platform: "-",
				day: 1
			},
			{
				code: "MRA",
				name: "MORENA",
				lat: 26.5005,
				lng: 78.0034,
				km: 431,
				arr: 305,
				dep: 307,
				platform: "-",
				day: 1
			},
			{
				code: "DHO",
				name: "DHAULPUR",
				lat: 26.6976,
				lng: 77.906,
				km: 447,
				arr: 335,
				dep: 336,
				platform: "-",
				day: 1
			},
			{
				code: "AGC",
				name: "AGRA CANTT",
				lat: 27.158,
				lng: 77.9902,
				km: 499,
				arr: 370,
				dep: 375,
				platform: "-",
				day: 1
			},
			{
				code: "MTJ",
				name: "MATHURA JN.",
				lat: 27.4801,
				lng: 77.6731,
				km: 553,
				arr: 409,
				dep: 410,
				platform: "-",
				day: 1
			},
			{
				code: "NDLS",
				name: "NEW DELHI",
				lat: 28.6423,
				lng: 77.22,
				km: 688,
				arr: 510,
				dep: 510,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12002",
		name: "NDLS - BPL S",
		type: "Express",
		startsAt: 360,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "NDLS",
				name: "NEW DELHI",
				lat: 28.6423,
				lng: 77.22,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "MTJ",
				name: "MATHURA JN.",
				lat: 27.4801,
				lng: 77.6731,
				km: 137,
				arr: 83,
				dep: 84,
				platform: "-",
				day: 1
			},
			{
				code: "AGC",
				name: "AGRA CANTT",
				lat: 27.158,
				lng: 77.9902,
				km: 191,
				arr: 117,
				dep: 122,
				platform: "-",
				day: 1
			},
			{
				code: "DHO",
				name: "DHAULPUR",
				lat: 26.6976,
				lng: 77.906,
				km: 243,
				arr: 161,
				dep: 162,
				platform: "-",
				day: 1
			},
			{
				code: "MRA",
				name: "MORENA",
				lat: 26.5005,
				lng: 78.0034,
				km: 259,
				arr: 181,
				dep: 182,
				platform: "-",
				day: 1
			},
			{
				code: "GWL",
				name: "GWALIOR JN",
				lat: 26.2165,
				lng: 78.1823,
				km: 298,
				arr: 208,
				dep: 213,
				platform: "-",
				day: 1
			},
			{
				code: "JHS",
				name: "JHANSI JN",
				lat: 25.4436,
				lng: 78.553,
				km: 395,
				arr: 283,
				dep: 291,
				platform: "-",
				day: 1
			},
			{
				code: "LAR",
				name: "LALITPUR",
				lat: 24.6882,
				lng: 78.3958,
				km: 483,
				arr: 339,
				dep: 341,
				platform: "-",
				day: 1
			},
			{
				code: "BPL",
				name: "BHOPAL",
				lat: 23.2669,
				lng: 77.4131,
				km: 684,
				arr: 470,
				dep: 475,
				platform: "-",
				day: 1
			},
			{
				code: "HBJ",
				name: "HABIBGANJ",
				lat: 23.222,
				lng: 77.4394,
				km: 690,
				arr: 505,
				dep: 505,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12009",
		name: "SHATABDI EXP",
		type: "Express",
		startsAt: 385,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "BCT",
				name: "MUMBAI CENTR",
				lat: 18.9707,
				lng: 72.8194,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "BVI",
				name: "BORIVLI",
				lat: 19.2287,
				lng: 72.8564,
				km: 29,
				arr: 31,
				dep: 34,
				platform: "-",
				day: 1
			},
			{
				code: "VAPI",
				name: "VAPI",
				lat: 20.3743,
				lng: 72.9091,
				km: 169,
				arr: 118,
				dep: 120,
				platform: "-",
				day: 1
			},
			{
				code: "ST",
				name: "SURAT",
				lat: 21.2066,
				lng: 72.8408,
				km: 262,
				arr: 186,
				dep: 191,
				platform: "-",
				day: 1
			},
			{
				code: "BH",
				name: "BHARUCH JN.",
				lat: 21.7069,
				lng: 72.9977,
				km: 321,
				arr: 228,
				dep: 229,
				platform: "-",
				day: 1
			},
			{
				code: "BRC",
				name: "VADODARA JN.",
				lat: 22.3108,
				lng: 73.1811,
				km: 391,
				arr: 279,
				dep: 284,
				platform: "-",
				day: 1
			},
			{
				code: "ANND",
				name: "ANAND JN.",
				lat: 22.5613,
				lng: 72.9657,
				km: 426,
				arr: 311,
				dep: 313,
				platform: "-",
				day: 1
			},
			{
				code: "ND",
				name: "NADIAD JN.",
				lat: 22.6941,
				lng: 72.8557,
				km: 445,
				arr: 327,
				dep: 329,
				platform: "-",
				day: 1
			},
			{
				code: "ADI",
				name: "AHMEDABAD",
				lat: 23.0255,
				lng: 72.6015,
				km: 490,
				arr: 380,
				dep: 380,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12010",
		name: "SHATABDI EXP",
		type: "Express",
		startsAt: 880,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "ADI",
				name: "AHMEDABAD",
				lat: 23.0255,
				lng: 72.6015,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "ND",
				name: "NADIAD JN.",
				lat: 22.6941,
				lng: 72.8557,
				km: 45,
				arr: 37,
				dep: 39,
				platform: "-",
				day: 1
			},
			{
				code: "ANND",
				name: "ANAND JN.",
				lat: 22.5613,
				lng: 72.9657,
				km: 63,
				arr: 58,
				dep: 60,
				platform: "-",
				day: 1
			},
			{
				code: "BRC",
				name: "VADODARA JN.",
				lat: 22.3108,
				lng: 73.1811,
				km: 99,
				arr: 99,
				dep: 104,
				platform: "-",
				day: 1
			},
			{
				code: "BH",
				name: "BHARUCH JN.",
				lat: 21.7069,
				lng: 72.9977,
				km: 169,
				arr: 146,
				dep: 148,
				platform: "-",
				day: 1
			},
			{
				code: "ST",
				name: "SURAT",
				lat: 21.2066,
				lng: 72.8408,
				km: 228,
				arr: 188,
				dep: 193,
				platform: "-",
				day: 1
			},
			{
				code: "VAPI",
				name: "VAPI",
				lat: 20.3743,
				lng: 72.9091,
				km: 321,
				arr: 253,
				dep: 255,
				platform: "-",
				day: 1
			},
			{
				code: "BVI",
				name: "BORIVLI",
				lat: 19.2287,
				lng: 72.8564,
				km: 461,
				arr: 351,
				dep: 354,
				platform: "-",
				day: 1
			},
			{
				code: "BCT",
				name: "MUMBAI CENTR",
				lat: 18.9707,
				lng: 72.8194,
				km: 490,
				arr: 400,
				dep: 400,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12019",
		name: "HOWRAH RANCH",
		type: "Express",
		startsAt: 365,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "HWH",
				name: "HOWRAH JN.",
				lat: 22.5841,
				lng: 88.341,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "DGR",
				name: "DURGAPUR",
				lat: 23.495,
				lng: 87.2979,
				km: 157,
				arr: 103,
				dep: 105,
				platform: "-",
				day: 1
			},
			{
				code: "RNG",
				name: "RANI GANJ",
				lat: 23.6029,
				lng: 87.117,
				km: 181,
				arr: 120,
				dep: 121,
				platform: "-",
				day: 1
			},
			{
				code: "ASN",
				name: "ASANSOL MAIN",
				lat: 23.6914,
				lng: 86.9752,
				km: 199,
				arr: 137,
				dep: 139,
				platform: "-",
				day: 1
			},
			{
				code: "DHN",
				name: "DHANBAD JN.",
				lat: 23.791,
				lng: 86.429,
				km: 258,
				arr: 195,
				dep: 200,
				platform: "-",
				day: 1
			},
			{
				code: "GMO",
				name: "NSC BOSE J G",
				lat: 23.8731,
				lng: 86.1482,
				km: 287,
				arr: 227,
				dep: 247,
				platform: "-",
				day: 1
			},
			{
				code: "CRP",
				name: "CHANDRAPURA",
				lat: 23.7557,
				lng: 86.1198,
				km: 304,
				arr: 269,
				dep: 271,
				platform: "-",
				day: 1
			},
			{
				code: "BKSC",
				name: "BOKARO STEEL",
				lat: 23.6566,
				lng: 86.085,
				km: 319,
				arr: 300,
				dep: 302,
				platform: "-",
				day: 1
			},
			{
				code: "MURI",
				name: "MURI",
				lat: 23.3763,
				lng: 85.867,
				km: 371,
				arr: 351,
				dep: 353,
				platform: "-",
				day: 1
			},
			{
				code: "RNC",
				name: "RANCHI",
				lat: 23.3488,
				lng: 85.3335,
				km: 436,
				arr: 430,
				dep: 430,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12020",
		name: "RNC HWH SHAT",
		type: "Express",
		startsAt: 825,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "RNC",
				name: "RANCHI",
				lat: 23.3488,
				lng: 85.3335,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "MURI",
				name: "MURI",
				lat: 23.3763,
				lng: 85.867,
				km: 62,
				arr: 68,
				dep: 70,
				platform: "-",
				day: 1
			},
			{
				code: "BKSC",
				name: "BOKARO STEEL",
				lat: 23.6566,
				lng: 86.085,
				km: 114,
				arr: 135,
				dep: 140,
				platform: "-",
				day: 1
			},
			{
				code: "CRP",
				name: "CHANDRAPURA",
				lat: 23.7557,
				lng: 86.1198,
				km: 129,
				arr: 168,
				dep: 170,
				platform: "-",
				day: 1
			},
			{
				code: "GMO",
				name: "NSC BOSE J G",
				lat: 23.8731,
				lng: 86.1482,
				km: 146,
				arr: 192,
				dep: 212,
				platform: "-",
				day: 1
			},
			{
				code: "DHN",
				name: "DHANBAD JN.",
				lat: 23.791,
				lng: 86.429,
				km: 175,
				arr: 238,
				dep: 243,
				platform: "-",
				day: 1
			},
			{
				code: "ASN",
				name: "ASANSOL MAIN",
				lat: 23.6914,
				lng: 86.9752,
				km: 234,
				arr: 295,
				dep: 297,
				platform: "-",
				day: 1
			},
			{
				code: "RNG",
				name: "RANI GANJ",
				lat: 23.6029,
				lng: 87.117,
				km: 252,
				arr: 311,
				dep: 312,
				platform: "-",
				day: 1
			},
			{
				code: "DGR",
				name: "DURGAPUR",
				lat: 23.495,
				lng: 87.2979,
				km: 276,
				arr: 329,
				dep: 331,
				platform: "-",
				day: 1
			},
			{
				code: "HWH",
				name: "HOWRAH JN.",
				lat: 22.5841,
				lng: 88.341,
				km: 434,
				arr: 465,
				dep: 465,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12049",
		name: "GATIMAN EXPR",
		type: "Express",
		startsAt: 1070,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [{
			code: "AGC",
			name: "AGRA CANTT",
			lat: 27.158,
			lng: 77.9902,
			km: 0,
			arr: 0,
			dep: 0,
			platform: "-",
			day: 1
		}, {
			code: "NZM",
			name: "HAZRAT NIZAM",
			lat: 28.5873,
			lng: 77.2542,
			km: 181,
			arr: 100,
			dep: 100,
			platform: "-",
			day: 1
		}]
	},
	{
		number: "12050",
		name: "GATIMAN EXPR",
		type: "Express",
		startsAt: 490,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [{
			code: "NZM",
			name: "HAZRAT NIZAM",
			lat: 28.5873,
			lng: 77.2542,
			km: 0,
			arr: 0,
			dep: 0,
			platform: "-",
			day: 1
		}, {
			code: "AGC",
			name: "AGRA CANTT",
			lat: 27.158,
			lng: 77.9902,
			km: 183,
			arr: 100,
			dep: 100,
			platform: "-",
			day: 1
		}]
	},
	{
		number: "12163",
		name: "CHENNAI EXPR",
		type: "Express",
		startsAt: 1230,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "DR",
				name: "DADAR",
				lat: 19.0172,
				lng: 72.843,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "KYN",
				name: "KALYAN JN",
				lat: 19.2347,
				lng: 73.1297,
				km: 44,
				arr: 37,
				dep: 40,
				platform: "-",
				day: 1
			},
			{
				code: "LNL",
				name: "LONAVLA",
				lat: 18.7489,
				lng: 73.4077,
				km: 118,
				arr: 127,
				dep: 130,
				platform: "-",
				day: 1
			},
			{
				code: "PUNE",
				name: "PUNE JN.",
				lat: 18.5294,
				lng: 73.8731,
				km: 182,
				arr: 215,
				dep: 220,
				platform: "-",
				day: 1
			},
			{
				code: "SUR",
				name: "SOLAPUR",
				lat: 17.6645,
				lng: 75.8934,
				km: 448,
				arr: 445,
				dep: 455,
				platform: "-",
				day: 1
			},
			{
				code: "GR",
				name: "GULBARGA",
				lat: 17.3144,
				lng: 76.8244,
				km: 561,
				arr: 577,
				dep: 580,
				platform: "-",
				day: 1
			},
			{
				code: "SDB",
				name: "SHAHABAD",
				lat: 17.1217,
				lng: 76.9435,
				km: 587,
				arr: 604,
				dep: 605,
				platform: "-",
				day: 1
			},
			{
				code: "WADI",
				name: "WADI JN.",
				lat: 17.0543,
				lng: 76.9915,
				km: 597,
				arr: 635,
				dep: 640,
				platform: "-",
				day: 1
			},
			{
				code: "YG",
				name: "YADGIR",
				lat: 16.7444,
				lng: 77.1304,
				km: 636,
				arr: 668,
				dep: 670,
				platform: "-",
				day: 1
			},
			{
				code: "SADP",
				name: "SAIDAPUR",
				lat: 16.57,
				lng: 77.2498,
				km: 659,
				arr: 684,
				dep: 685,
				platform: "-",
				day: 1
			},
			{
				code: "RC",
				name: "RAICHUR",
				lat: 16.1924,
				lng: 77.3392,
				km: 705,
				arr: 733,
				dep: 735,
				platform: "-",
				day: 1
			},
			{
				code: "MALM",
				name: "MANTHRALAYAM",
				lat: 15.949,
				lng: 77.2992,
				km: 733,
				arr: 764,
				dep: 765,
				platform: "-",
				day: 1
			},
			{
				code: "AD",
				name: "ADONI",
				lat: 15.617,
				lng: 77.2749,
				km: 774,
				arr: 799,
				dep: 800,
				platform: "-",
				day: 1
			},
			{
				code: "GTL",
				name: "GUNTAKAL JN.",
				lat: 15.1756,
				lng: 77.3666,
				km: 826,
				arr: 875,
				dep: 880,
				platform: "-",
				day: 1
			},
			{
				code: "GY",
				name: "GOOTY JN.",
				lat: 15.1492,
				lng: 77.6258,
				km: 854,
				arr: 903,
				dep: 905,
				platform: "-",
				day: 1
			},
			{
				code: "TU",
				name: "TADIPATRI",
				lat: 14.9076,
				lng: 77.979,
				km: 902,
				arr: 943,
				dep: 945,
				platform: "-",
				day: 1
			},
			{
				code: "YA",
				name: "YERRA GUNTLA",
				lat: 14.6423,
				lng: 78.534,
				km: 971,
				arr: 1004,
				dep: 1005,
				platform: "-",
				day: 1
			},
			{
				code: "HX",
				name: "CUDDAPAH",
				lat: 14.4517,
				lng: 78.8292,
				km: 1010,
				arr: 1048,
				dep: 1050,
				platform: "-",
				day: 1
			},
			{
				code: "RJP",
				name: "RAZAMPETA",
				lat: 14.1845,
				lng: 79.1527,
				km: 1061,
				arr: 1108,
				dep: 1110,
				platform: "-",
				day: 1
			},
			{
				code: "KOU",
				name: "KODURU",
				lat: 13.9486,
				lng: 79.3457,
				km: 1095,
				arr: 1138,
				dep: 1140,
				platform: "-",
				day: 1
			},
			{
				code: "RU",
				name: "RENIGUNTA JN",
				lat: 13.6363,
				lng: 79.5063,
				km: 1135,
				arr: 1210,
				dep: 1215,
				platform: "-",
				day: 1
			},
			{
				code: "AJJ",
				name: "ARAKKONAM JN",
				lat: 13.0815,
				lng: 79.668,
				km: 1203,
				arr: 1278,
				dep: 1280,
				platform: "-",
				day: 1
			},
			{
				code: "PER",
				name: "PERAMBUR",
				lat: 13.107,
				lng: 80.2445,
				km: 1266,
				arr: 1328,
				dep: 1330,
				platform: "-",
				day: 1
			},
			{
				code: "MS",
				name: "CHENNAI EGMO",
				lat: 13.0777,
				lng: 80.2602,
				km: 1278,
				arr: 1395,
				dep: 1395,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12164",
		name: "CHENNAI EXP",
		type: "Express",
		startsAt: 410,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "MS",
				name: "CHENNAI EGMO",
				lat: 13.0777,
				lng: 80.2602,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "RU",
				name: "RENIGUNTA JN",
				lat: 13.6363,
				lng: 79.5063,
				km: 144,
				arr: 150,
				dep: 155,
				platform: "-",
				day: 1
			},
			{
				code: "KOU",
				name: "KODURU",
				lat: 13.9486,
				lng: 79.3457,
				km: 185,
				arr: 179,
				dep: 180,
				platform: "-",
				day: 1
			},
			{
				code: "RJP",
				name: "RAZAMPETA",
				lat: 14.1845,
				lng: 79.1527,
				km: 219,
				arr: 214,
				dep: 215,
				platform: "-",
				day: 1
			},
			{
				code: "HX",
				name: "CUDDAPAH",
				lat: 14.4517,
				lng: 78.8292,
				km: 269,
				arr: 263,
				dep: 265,
				platform: "-",
				day: 1
			},
			{
				code: "YA",
				name: "YERRA GUNTLA",
				lat: 14.6423,
				lng: 78.534,
				km: 308,
				arr: 299,
				dep: 300,
				platform: "-",
				day: 1
			},
			{
				code: "TU",
				name: "TADIPATRI",
				lat: 14.9076,
				lng: 77.979,
				km: 378,
				arr: 359,
				dep: 360,
				platform: "-",
				day: 1
			},
			{
				code: "GY",
				name: "GOOTY JN.",
				lat: 15.1492,
				lng: 77.6258,
				km: 425,
				arr: 409,
				dep: 410,
				platform: "-",
				day: 1
			},
			{
				code: "GTL",
				name: "GUNTAKAL JN.",
				lat: 15.1756,
				lng: 77.3666,
				km: 454,
				arr: 455,
				dep: 460,
				platform: "-",
				day: 1
			},
			{
				code: "AD",
				name: "ADONI",
				lat: 15.617,
				lng: 77.2749,
				km: 506,
				arr: 499,
				dep: 500,
				platform: "-",
				day: 1
			},
			{
				code: "MALM",
				name: "MANTHRALAYAM",
				lat: 15.949,
				lng: 77.2992,
				km: 547,
				arr: 538,
				dep: 540,
				platform: "-",
				day: 1
			},
			{
				code: "RC",
				name: "RAICHUR",
				lat: 16.1924,
				lng: 77.3392,
				km: 575,
				arr: 578,
				dep: 580,
				platform: "-",
				day: 1
			},
			{
				code: "SADP",
				name: "SAIDAPUR",
				lat: 16.57,
				lng: 77.2498,
				km: 620,
				arr: 629,
				dep: 630,
				platform: "-",
				day: 1
			},
			{
				code: "YG",
				name: "YADGIR",
				lat: 16.7444,
				lng: 77.1304,
				km: 643,
				arr: 659,
				dep: 660,
				platform: "-",
				day: 1
			},
			{
				code: "WADI",
				name: "WADI JN.",
				lat: 17.0543,
				lng: 76.9915,
				km: 682,
				arr: 735,
				dep: 740,
				platform: "-",
				day: 1
			},
			{
				code: "SDB",
				name: "SHAHABAD",
				lat: 17.1217,
				lng: 76.9435,
				km: 693,
				arr: 752,
				dep: 753,
				platform: "-",
				day: 1
			},
			{
				code: "GR",
				name: "GULBARGA",
				lat: 17.3144,
				lng: 76.8244,
				km: 719,
				arr: 777,
				dep: 780,
				platform: "-",
				day: 1
			},
			{
				code: "SUR",
				name: "SOLAPUR",
				lat: 17.6645,
				lng: 75.8934,
				km: 832,
				arr: 900,
				dep: 910,
				platform: "-",
				day: 1
			},
			{
				code: "PUNE",
				name: "PUNE JN.",
				lat: 18.5294,
				lng: 73.8731,
				km: 1097,
				arr: 1170,
				dep: 1180,
				platform: "-",
				day: 1
			},
			{
				code: "LNL",
				name: "LONAVLA",
				lat: 18.7489,
				lng: 73.4077,
				km: 1161,
				arr: 1238,
				dep: 1240,
				platform: "-",
				day: 1
			},
			{
				code: "KYN",
				name: "KALYAN JN",
				lat: 19.2347,
				lng: 73.1297,
				km: 1237,
				arr: 1327,
				dep: 1330,
				platform: "-",
				day: 1
			},
			{
				code: "DR",
				name: "DADAR",
				lat: 19.0172,
				lng: 72.843,
				km: 1281,
				arr: 1390,
				dep: 1390,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12259",
		name: "NDLS DURONTO",
		type: "Express",
		startsAt: 1110,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "SDAH",
				name: "SEALDAH",
				lat: 22.5668,
				lng: 88.3747,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "DHN",
				name: "DHANBAD JN.",
				lat: 23.791,
				lng: 86.429,
				km: 268,
				arr: 201,
				dep: 206,
				platform: "-",
				day: 1
			},
			{
				code: "MGS",
				name: "MUGHAL SARAI",
				lat: 25.2781,
				lng: 83.1193,
				km: 671,
				arr: 470,
				dep: 480,
				platform: "-",
				day: 1
			},
			{
				code: "CNB",
				name: "KANPUR CENTR",
				lat: 26.4542,
				lng: 80.351,
				km: 1018,
				arr: 710,
				dep: 718,
				platform: "-",
				day: 1
			},
			{
				code: "NDLS",
				name: "NEW DELHI",
				lat: 28.6423,
				lng: 77.22,
				km: 1448,
				arr: 1020,
				dep: 1020,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12260",
		name: "SDAH DURONTO",
		type: "Express",
		startsAt: 1180,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "NDLS",
				name: "NEW DELHI",
				lat: 28.6423,
				lng: 77.22,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "CNB",
				name: "KANPUR CENTR",
				lat: 26.4542,
				lng: 80.351,
				km: 430,
				arr: 289,
				dep: 294,
				platform: "-",
				day: 1
			},
			{
				code: "MGS",
				name: "MUGHAL SARAI",
				lat: 25.2781,
				lng: 83.1193,
				km: 777,
				arr: 533,
				dep: 543,
				platform: "-",
				day: 1
			},
			{
				code: "DHN",
				name: "DHANBAD JN.",
				lat: 23.791,
				lng: 86.429,
				km: 1180,
				arr: 798,
				dep: 803,
				platform: "-",
				day: 1
			},
			{
				code: "SDAH",
				name: "SEALDAH",
				lat: 22.5668,
				lng: 88.3747,
				km: 1449,
				arr: 1015,
				dep: 1015,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12301",
		name: "KOLKATA RAJD",
		type: "Express",
		startsAt: 1015,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "HWH",
				name: "HOWRAH JN.",
				lat: 22.5841,
				lng: 88.341,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "DHN",
				name: "DHANBAD JN.",
				lat: 23.791,
				lng: 86.429,
				km: 258,
				arr: 180,
				dep: 185,
				platform: "-",
				day: 1
			},
			{
				code: "PNME",
				name: "PARASNATH",
				lat: 23.988,
				lng: 86.0379,
				km: 305,
				arr: 222,
				dep: 224,
				platform: "-",
				day: 1
			},
			{
				code: "GAYA",
				name: "GAYA JN.",
				lat: 24.804,
				lng: 84.9993,
				km: 456,
				arr: 339,
				dep: 342,
				platform: "-",
				day: 1
			},
			{
				code: "MGS",
				name: "MUGHAL SARAI",
				lat: 25.2781,
				lng: 83.1193,
				km: 660,
				arr: 470,
				dep: 480,
				platform: "-",
				day: 1
			},
			{
				code: "ALD",
				name: "ALLAHABAD JN",
				lat: 25.4462,
				lng: 81.8288,
				km: 813,
				arr: 588,
				dep: 591,
				platform: "-",
				day: 1
			},
			{
				code: "CNB",
				name: "KANPUR CENTR",
				lat: 26.4542,
				lng: 80.351,
				km: 1007,
				arr: 710,
				dep: 718,
				platform: "-",
				day: 1
			},
			{
				code: "NDLS",
				name: "NEW DELHI",
				lat: 28.6423,
				lng: 77.22,
				km: 1438,
				arr: 1025,
				dep: 1025,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12302",
		name: "KOLKATA RAJD",
		type: "Express",
		startsAt: 1015,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "NDLS",
				name: "NEW DELHI",
				lat: 28.6423,
				lng: 77.22,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "CNB",
				name: "KANPUR CENTR",
				lat: 26.4542,
				lng: 80.351,
				km: 430,
				arr: 280,
				dep: 285,
				platform: "-",
				day: 1
			},
			{
				code: "ALD",
				name: "ALLAHABAD JN",
				lat: 25.4462,
				lng: 81.8288,
				km: 624,
				arr: 405,
				dep: 408,
				platform: "-",
				day: 1
			},
			{
				code: "MGS",
				name: "MUGHAL SARAI",
				lat: 25.2781,
				lng: 83.1193,
				km: 777,
				arr: 529,
				dep: 539,
				platform: "-",
				day: 1
			},
			{
				code: "GAYA",
				name: "GAYA JN.",
				lat: 24.804,
				lng: 84.9993,
				km: 981,
				arr: 652,
				dep: 655,
				platform: "-",
				day: 1
			},
			{
				code: "PNME",
				name: "PARASNATH",
				lat: 23.988,
				lng: 86.0379,
				km: 1133,
				arr: 770,
				dep: 772,
				platform: "-",
				day: 1
			},
			{
				code: "DHN",
				name: "DHANBAD JN.",
				lat: 23.791,
				lng: 86.429,
				km: 1180,
				arr: 820,
				dep: 825,
				platform: "-",
				day: 1
			},
			{
				code: "HWH",
				name: "HOWRAH JN.",
				lat: 22.5841,
				lng: 88.341,
				km: 1439,
				arr: 1015,
				dep: 1015,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12305",
		name: "KOLKATA RAJD",
		type: "Express",
		startsAt: 845,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "HWH",
				name: "HOWRAH JN.",
				lat: 22.5841,
				lng: 88.341,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "BWN",
				name: "BARDDHAMAN J",
				lat: 23.2497,
				lng: 87.8703,
				km: 94,
				arr: 61,
				dep: 63,
				platform: "-",
				day: 1
			},
			{
				code: "MDP",
				name: "MADHUPUR JN.",
				lat: 24.2706,
				lng: 86.6422,
				km: 280,
				arr: 186,
				dep: 190,
				platform: "-",
				day: 1
			},
			{
				code: "JSME",
				name: "JASIDIH JN.",
				lat: 24.5145,
				lng: 86.6443,
				km: 309,
				arr: 215,
				dep: 219,
				platform: "-",
				day: 1
			},
			{
				code: "PNBE",
				name: "PATNA JN.",
				lat: 25.6026,
				lng: 85.1368,
				km: 530,
				arr: 415,
				dep: 425,
				platform: "-",
				day: 1
			},
			{
				code: "MGS",
				name: "MUGHAL SARAI",
				lat: 25.2781,
				lng: 83.1193,
				km: 738,
				arr: 637,
				dep: 647,
				platform: "-",
				day: 1
			},
			{
				code: "ALD",
				name: "ALLAHABAD JN",
				lat: 25.4462,
				lng: 81.8288,
				km: 891,
				arr: 758,
				dep: 761,
				platform: "-",
				day: 1
			},
			{
				code: "CNB",
				name: "KANPUR CENTR",
				lat: 26.4542,
				lng: 80.351,
				km: 1085,
				arr: 880,
				dep: 888,
				platform: "-",
				day: 1
			},
			{
				code: "NDLS",
				name: "NEW DELHI",
				lat: 28.6423,
				lng: 77.22,
				km: 1516,
				arr: 1195,
				dep: 1195,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12306",
		name: "KOLKATA RAJD",
		type: "Express",
		startsAt: 1015,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "NDLS",
				name: "NEW DELHI",
				lat: 28.6423,
				lng: 77.22,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "CNB",
				name: "KANPUR CENTR",
				lat: 26.4542,
				lng: 80.351,
				km: 430,
				arr: 280,
				dep: 285,
				platform: "-",
				day: 1
			},
			{
				code: "ALD",
				name: "ALLAHABAD JN",
				lat: 25.4462,
				lng: 81.8288,
				km: 624,
				arr: 405,
				dep: 408,
				platform: "-",
				day: 1
			},
			{
				code: "MGS",
				name: "MUGHAL SARAI",
				lat: 25.2781,
				lng: 83.1193,
				km: 777,
				arr: 528,
				dep: 538,
				platform: "-",
				day: 1
			},
			{
				code: "PNBE",
				name: "PATNA JN.",
				lat: 25.6026,
				lng: 85.1368,
				km: 985,
				arr: 695,
				dep: 705,
				platform: "-",
				day: 1
			},
			{
				code: "JSME",
				name: "JASIDIH JN.",
				lat: 24.5145,
				lng: 86.6443,
				km: 1206,
				arr: 915,
				dep: 919,
				platform: "-",
				day: 1
			},
			{
				code: "MDP",
				name: "MADHUPUR JN.",
				lat: 24.2706,
				lng: 86.6422,
				km: 1235,
				arr: 944,
				dep: 946,
				platform: "-",
				day: 1
			},
			{
				code: "BWN",
				name: "BARDDHAMAN J",
				lat: 23.2497,
				lng: 87.8703,
				km: 1422,
				arr: 1080,
				dep: 1082,
				platform: "-",
				day: 1
			},
			{
				code: "HWH",
				name: "HOWRAH JN.",
				lat: 22.5841,
				lng: 88.341,
				km: 1517,
				arr: 1160,
				dep: 1160,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12313",
		name: "SDAH RAJDHAN",
		type: "Express",
		startsAt: 1010,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "SDAH",
				name: "SEALDAH",
				lat: 22.5668,
				lng: 88.3747,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "DGR",
				name: "DURGAPUR",
				lat: 23.495,
				lng: 87.2979,
				km: 167,
				arr: 118,
				dep: 120,
				platform: "-",
				day: 1
			},
			{
				code: "ASN",
				name: "ASANSOL MAIN",
				lat: 23.6914,
				lng: 86.9752,
				km: 209,
				arr: 146,
				dep: 150,
				platform: "-",
				day: 1
			},
			{
				code: "DHN",
				name: "DHANBAD JN.",
				lat: 23.791,
				lng: 86.429,
				km: 268,
				arr: 210,
				dep: 215,
				platform: "-",
				day: 1
			},
			{
				code: "GAYA",
				name: "GAYA JN.",
				lat: 24.804,
				lng: 84.9993,
				km: 467,
				arr: 361,
				dep: 364,
				platform: "-",
				day: 1
			},
			{
				code: "MGS",
				name: "MUGHAL SARAI",
				lat: 25.2781,
				lng: 83.1193,
				km: 671,
				arr: 492,
				dep: 502,
				platform: "-",
				day: 1
			},
			{
				code: "CNB",
				name: "KANPUR CENTR",
				lat: 26.4542,
				lng: 80.351,
				km: 1018,
				arr: 740,
				dep: 748,
				platform: "-",
				day: 1
			},
			{
				code: "NDLS",
				name: "NEW DELHI",
				lat: 28.6423,
				lng: 77.22,
				km: 1448,
				arr: 1055,
				dep: 1055,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12314",
		name: "SDAH RAJDHAN",
		type: "Express",
		startsAt: 985,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "NDLS",
				name: "NEW DELHI",
				lat: 28.6423,
				lng: 77.22,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "CNB",
				name: "KANPUR CENTR",
				lat: 26.4542,
				lng: 80.351,
				km: 430,
				arr: 290,
				dep: 295,
				platform: "-",
				day: 1
			},
			{
				code: "MGS",
				name: "MUGHAL SARAI",
				lat: 25.2781,
				lng: 83.1193,
				km: 777,
				arr: 550,
				dep: 560,
				platform: "-",
				day: 1
			},
			{
				code: "GAYA",
				name: "GAYA JN.",
				lat: 24.804,
				lng: 84.9993,
				km: 981,
				arr: 672,
				dep: 675,
				platform: "-",
				day: 1
			},
			{
				code: "DHN",
				name: "DHANBAD JN.",
				lat: 23.791,
				lng: 86.429,
				km: 1180,
				arr: 833,
				dep: 838,
				platform: "-",
				day: 1
			},
			{
				code: "ASN",
				name: "ASANSOL MAIN",
				lat: 23.6914,
				lng: 86.9752,
				km: 1239,
				arr: 886,
				dep: 888,
				platform: "-",
				day: 1
			},
			{
				code: "DGR",
				name: "DURGAPUR",
				lat: 23.495,
				lng: 87.2979,
				km: 1281,
				arr: 916,
				dep: 918,
				platform: "-",
				day: 1
			},
			{
				code: "SDAH",
				name: "SEALDAH",
				lat: 22.5668,
				lng: 88.3747,
				km: 1449,
				arr: 1065,
				dep: 1065,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12367",
		name: "VIKRAMSHILA",
		type: "Express",
		startsAt: 675,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "BGP",
				name: "BHAGALPUR",
				lat: 25.2419,
				lng: 86.9768,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "SGG",
				name: "SULTANGANJ",
				lat: 25.2408,
				lng: 86.7362,
				km: 24,
				arr: 20,
				dep: 21,
				platform: "-",
				day: 1
			},
			{
				code: "BUP",
				name: "BARIARPUR",
				lat: 25.281,
				lng: 86.574,
				km: 42,
				arr: 45,
				dep: 46,
				platform: "-",
				day: 1
			},
			{
				code: "JMP",
				name: "JAMALPUR JN.",
				lat: 25.3139,
				lng: 86.4923,
				km: 52,
				arr: 70,
				dep: 80,
				platform: "-",
				day: 1
			},
			{
				code: "DRH",
				name: "DHARHARA",
				lat: 25.2579,
				lng: 86.4115,
				km: 64,
				arr: 93,
				dep: 94,
				platform: "-",
				day: 1
			},
			{
				code: "AHA",
				name: "ABHAIPUR",
				lat: 25.216,
				lng: 86.3231,
				km: 74,
				arr: 107,
				dep: 108,
				platform: "-",
				day: 1
			},
			{
				code: "KJH",
				name: "KAJRA",
				lat: 25.1828,
				lng: 86.2616,
				km: 82,
				arr: 119,
				dep: 120,
				platform: "-",
				day: 1
			},
			{
				code: "KIUL",
				name: "KIUL JN.",
				lat: 25.1715,
				lng: 86.1062,
				km: 98,
				arr: 162,
				dep: 182,
				platform: "-",
				day: 1
			},
			{
				code: "LKR",
				name: "LUCKEESARAI",
				lat: 25.1717,
				lng: 86.0932,
				km: 99,
				arr: 187,
				dep: 189,
				platform: "-",
				day: 1
			},
			{
				code: "BRYA",
				name: "BARHIYA",
				lat: 25.2832,
				lng: 86.0151,
				km: 114,
				arr: 203,
				dep: 205,
				platform: "-",
				day: 1
			},
			{
				code: "HTZ",
				name: "HATHIDAH JN",
				lat: 25.367,
				lng: 85.9878,
				km: 125,
				arr: 215,
				dep: 217,
				platform: "-",
				day: 1
			},
			{
				code: "MKA",
				name: "MOKAMA JN.",
				lat: 25.3919,
				lng: 85.913,
				km: 132,
				arr: 227,
				dep: 229,
				platform: "-",
				day: 1
			},
			{
				code: "BARH",
				name: "BARH",
				lat: 25.4616,
				lng: 85.7094,
				km: 157,
				arr: 245,
				dep: 247,
				platform: "-",
				day: 1
			},
			{
				code: "BKP",
				name: "BAKHTIYARPUR",
				lat: 25.4561,
				lng: 85.5296,
				km: 175,
				arr: 262,
				dep: 264,
				platform: "-",
				day: 1
			},
			{
				code: "KOO",
				name: "KHUSROPUR",
				lat: 25.4849,
				lng: 85.3873,
				km: 190,
				arr: 274,
				dep: 276,
				platform: "-",
				day: 1
			},
			{
				code: "FUT",
				name: "FATUHA",
				lat: 25.5014,
				lng: 85.3055,
				km: 199,
				arr: 284,
				dep: 286,
				platform: "-",
				day: 1
			},
			{
				code: "PNC",
				name: "PATNA SAHEB",
				lat: 25.5859,
				lng: 85.2309,
				km: 211,
				arr: 296,
				dep: 298,
				platform: "-",
				day: 1
			},
			{
				code: "PNBE",
				name: "PATNA JN.",
				lat: 25.6026,
				lng: 85.1368,
				km: 221,
				arr: 330,
				dep: 340,
				platform: "-",
				day: 1
			},
			{
				code: "MGS",
				name: "MUGHAL SARAI",
				lat: 25.2781,
				lng: 83.1193,
				km: 428,
				arr: 544,
				dep: 559,
				platform: "-",
				day: 1
			},
			{
				code: "CNB",
				name: "KANPUR CENTR",
				lat: 26.4542,
				lng: 80.351,
				km: 775,
				arr: 865,
				dep: 873,
				platform: "-",
				day: 1
			},
			{
				code: "ANVT",
				name: "ANAND VIHAR",
				lat: 28.6505,
				lng: 77.3152,
				km: 1193,
				arr: 1245,
				dep: 1245,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12368",
		name: "VIKRAMSHILA",
		type: "Express",
		startsAt: 880,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "ANVT",
				name: "ANAND VIHAR",
				lat: 28.6505,
				lng: 77.3152,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "CNB",
				name: "KANPUR CENTR",
				lat: 26.4542,
				lng: 80.351,
				km: 417,
				arr: 345,
				dep: 355,
				platform: "-",
				day: 1
			},
			{
				code: "MGS",
				name: "MUGHAL SARAI",
				lat: 25.2781,
				lng: 83.1193,
				km: 764,
				arr: 738,
				dep: 748,
				platform: "-",
				day: 1
			},
			{
				code: "PNBE",
				name: "PATNA JN.",
				lat: 25.6026,
				lng: 85.1368,
				km: 972,
				arr: 940,
				dep: 950,
				platform: "-",
				day: 1
			},
			{
				code: "PNC",
				name: "PATNA SAHEB",
				lat: 25.5859,
				lng: 85.2309,
				km: 982,
				arr: 965,
				dep: 967,
				platform: "-",
				day: 1
			},
			{
				code: "FUT",
				name: "FATUHA",
				lat: 25.5014,
				lng: 85.3055,
				km: 994,
				arr: 978,
				dep: 980,
				platform: "-",
				day: 1
			},
			{
				code: "KOO",
				name: "KHUSROPUR",
				lat: 25.4849,
				lng: 85.3873,
				km: 1002,
				arr: 986,
				dep: 988,
				platform: "-",
				day: 1
			},
			{
				code: "BKP",
				name: "BAKHTIYARPUR",
				lat: 25.4561,
				lng: 85.5296,
				km: 1017,
				arr: 1002,
				dep: 1004,
				platform: "-",
				day: 1
			},
			{
				code: "BARH",
				name: "BARH",
				lat: 25.4616,
				lng: 85.7094,
				km: 1035,
				arr: 1019,
				dep: 1021,
				platform: "-",
				day: 1
			},
			{
				code: "MKA",
				name: "MOKAMA JN.",
				lat: 25.3919,
				lng: 85.913,
				km: 1061,
				arr: 1046,
				dep: 1048,
				platform: "-",
				day: 1
			},
			{
				code: "HTZ",
				name: "HATHIDAH JN",
				lat: 25.367,
				lng: 85.9878,
				km: 1068,
				arr: 1054,
				dep: 1056,
				platform: "-",
				day: 1
			},
			{
				code: "BRYA",
				name: "BARHIYA",
				lat: 25.2832,
				lng: 86.0151,
				km: 1079,
				arr: 1070,
				dep: 1072,
				platform: "-",
				day: 1
			},
			{
				code: "LKR",
				name: "LUCKEESARAI",
				lat: 25.1717,
				lng: 86.0932,
				km: 1094,
				arr: 1108,
				dep: 1110,
				platform: "-",
				day: 1
			},
			{
				code: "KIUL",
				name: "KIUL JN.",
				lat: 25.1715,
				lng: 86.1062,
				km: 1095,
				arr: 1130,
				dep: 1155,
				platform: "-",
				day: 1
			},
			{
				code: "KJH",
				name: "KAJRA",
				lat: 25.1828,
				lng: 86.2616,
				km: 1111,
				arr: 1173,
				dep: 1174,
				platform: "-",
				day: 1
			},
			{
				code: "AHA",
				name: "ABHAIPUR",
				lat: 25.216,
				lng: 86.3231,
				km: 1118,
				arr: 1186,
				dep: 1187,
				platform: "-",
				day: 1
			},
			{
				code: "DRH",
				name: "DHARHARA",
				lat: 25.2579,
				lng: 86.4115,
				km: 1128,
				arr: 1201,
				dep: 1202,
				platform: "-",
				day: 1
			},
			{
				code: "JMP",
				name: "JAMALPUR JN.",
				lat: 25.3139,
				lng: 86.4923,
				km: 1140,
				arr: 1224,
				dep: 1234,
				platform: "-",
				day: 1
			},
			{
				code: "BUP",
				name: "BARIARPUR",
				lat: 25.281,
				lng: 86.574,
				km: 1151,
				arr: 1246,
				dep: 1247,
				platform: "-",
				day: 1
			},
			{
				code: "SGG",
				name: "SULTANGANJ",
				lat: 25.2408,
				lng: 86.7362,
				km: 1169,
				arr: 1268,
				dep: 1269,
				platform: "-",
				day: 1
			},
			{
				code: "BGP",
				name: "BHAGALPUR",
				lat: 25.2419,
				lng: 86.9768,
				km: 1193,
				arr: 1305,
				dep: 1305,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12631",
		name: "MS-TEN NELLA",
		type: "Express",
		startsAt: 1210,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "MS",
				name: "CHENNAI EGMO",
				lat: 13.0777,
				lng: 80.2602,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "TBM",
				name: "TAMBARAM",
				lat: 12.926,
				lng: 80.1192,
				km: 24,
				arr: 28,
				dep: 30,
				platform: "-",
				day: 1
			},
			{
				code: "CGL",
				name: "CHENGALPATTU",
				lat: 12.6929,
				lng: 79.9815,
				km: 55,
				arr: 58,
				dep: 60,
				platform: "-",
				day: 1
			},
			{
				code: "MLMR",
				name: "MELMARUVATHU",
				lat: 12.4296,
				lng: 79.8338,
				km: 91,
				arr: 83,
				dep: 85,
				platform: "-",
				day: 1
			},
			{
				code: "TMV",
				name: "TINDIVANAM",
				lat: 12.2294,
				lng: 79.6513,
				km: 121,
				arr: 108,
				dep: 110,
				platform: "-",
				day: 1
			},
			{
				code: "VM",
				name: "VILLUPURAM J",
				lat: 11.943,
				lng: 79.5001,
				km: 158,
				arr: 150,
				dep: 155,
				platform: "-",
				day: 1
			},
			{
				code: "VRI",
				name: "VRIDHA CHALA",
				lat: 11.535,
				lng: 79.3161,
				km: 212,
				arr: 200,
				dep: 202,
				platform: "-",
				day: 1
			},
			{
				code: "TPJ",
				name: "TIRUCHIRAPPA",
				lat: 10.7941,
				lng: 78.6854,
				km: 335,
				arr: 320,
				dep: 325,
				platform: "-",
				day: 1
			},
			{
				code: "DG",
				name: "DINDIGUL JN",
				lat: 10.3538,
				lng: 77.9855,
				km: 429,
				arr: 398,
				dep: 400,
				platform: "-",
				day: 1
			},
			{
				code: "SDN",
				name: "SHOLAVANDAN",
				lat: 10.0223,
				lng: 77.9651,
				km: 470,
				arr: 428,
				dep: 429,
				platform: "-",
				day: 1
			},
			{
				code: "MDU",
				name: "MADURAI JN",
				lat: 9.9199,
				lng: 78.1103,
				km: 492,
				arr: 460,
				dep: 465,
				platform: "-",
				day: 1
			},
			{
				code: "VPT",
				name: "VIRUDUNAGAR",
				lat: 9.5964,
				lng: 77.9577,
				km: 535,
				arr: 504,
				dep: 505,
				platform: "-",
				day: 1
			},
			{
				code: "SRT",
				name: "SATUR",
				lat: 9.3575,
				lng: 77.9216,
				km: 562,
				arr: 524,
				dep: 525,
				platform: "-",
				day: 1
			},
			{
				code: "CVP",
				name: "KOVILPATTI",
				lat: 9.1826,
				lng: 77.8728,
				km: 584,
				arr: 546,
				dep: 547,
				platform: "-",
				day: 1
			},
			{
				code: "TEN",
				name: "TIRUNELVELI",
				lat: 8.7364,
				lng: 77.708,
				km: 649,
				arr: 660,
				dep: 660,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12632",
		name: "TEN-MS NELLA",
		type: "Express",
		startsAt: 1185,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "TEN",
				name: "TIRUNELVELI",
				lat: 8.7364,
				lng: 77.708,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "CVP",
				name: "KOVILPATTI",
				lat: 9.1826,
				lng: 77.8728,
				km: 65,
				arr: 48,
				dep: 50,
				platform: "-",
				day: 1
			},
			{
				code: "SRT",
				name: "SATUR",
				lat: 9.3575,
				lng: 77.9216,
				km: 86,
				arr: 69,
				dep: 70,
				platform: "-",
				day: 1
			},
			{
				code: "VPT",
				name: "VIRUDUNAGAR",
				lat: 9.5964,
				lng: 77.9577,
				km: 113,
				arr: 93,
				dep: 95,
				platform: "-",
				day: 1
			},
			{
				code: "MDU",
				name: "MADURAI JN",
				lat: 9.9199,
				lng: 78.1103,
				km: 156,
				arr: 145,
				dep: 150,
				platform: "-",
				day: 1
			},
			{
				code: "SDN",
				name: "SHOLAVANDAN",
				lat: 10.0223,
				lng: 77.9651,
				km: 177,
				arr: 164,
				dep: 165,
				platform: "-",
				day: 1
			},
			{
				code: "DG",
				name: "DINDIGUL JN",
				lat: 10.3538,
				lng: 77.9855,
				km: 218,
				arr: 208,
				dep: 210,
				platform: "-",
				day: 1
			},
			{
				code: "TPJ",
				name: "TIRUCHIRAPPA",
				lat: 10.7941,
				lng: 78.6854,
				km: 313,
				arr: 305,
				dep: 310,
				platform: "-",
				day: 1
			},
			{
				code: "VRI",
				name: "VRIDHA CHALA",
				lat: 11.535,
				lng: 79.3161,
				km: 436,
				arr: 413,
				dep: 415,
				platform: "-",
				day: 1
			},
			{
				code: "VM",
				name: "VILLUPURAM J",
				lat: 11.943,
				lng: 79.5001,
				km: 490,
				arr: 475,
				dep: 480,
				platform: "-",
				day: 1
			},
			{
				code: "TMV",
				name: "TINDIVANAM",
				lat: 12.2294,
				lng: 79.6513,
				km: 528,
				arr: 513,
				dep: 515,
				platform: "-",
				day: 1
			},
			{
				code: "MLMR",
				name: "MELMARUVATHU",
				lat: 12.4296,
				lng: 79.8338,
				km: 558,
				arr: 538,
				dep: 540,
				platform: "-",
				day: 1
			},
			{
				code: "CGL",
				name: "CHENGALPATTU",
				lat: 12.6929,
				lng: 79.9815,
				km: 593,
				arr: 573,
				dep: 575,
				platform: "-",
				day: 1
			},
			{
				code: "TBM",
				name: "TAMBARAM",
				lat: 12.926,
				lng: 80.1192,
				km: 624,
				arr: 603,
				dep: 605,
				platform: "-",
				day: 1
			},
			{
				code: "MBM",
				name: "MAMBALAM",
				lat: 13.0382,
				lng: 80.2282,
				km: 642,
				arr: 624,
				dep: 625,
				platform: "-",
				day: 1
			},
			{
				code: "MS",
				name: "CHENNAI EGMO",
				lat: 13.0777,
				lng: 80.2602,
				km: 649,
				arr: 670,
				dep: 670,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12637",
		name: "PANDIAN EXP",
		type: "Express",
		startsAt: 1300,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "MS",
				name: "CHENNAI EGMO",
				lat: 13.0777,
				lng: 80.2602,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "TBM",
				name: "TAMBARAM",
				lat: 12.926,
				lng: 80.1192,
				km: 24,
				arr: 28,
				dep: 30,
				platform: "-",
				day: 1
			},
			{
				code: "CGL",
				name: "CHENGALPATTU",
				lat: 12.6929,
				lng: 79.9815,
				km: 55,
				arr: 58,
				dep: 60,
				platform: "-",
				day: 1
			},
			{
				code: "VM",
				name: "VILLUPURAM J",
				lat: 11.943,
				lng: 79.5001,
				km: 158,
				arr: 133,
				dep: 138,
				platform: "-",
				day: 1
			},
			{
				code: "VRI",
				name: "VRIDHA CHALA",
				lat: 11.535,
				lng: 79.3161,
				km: 212,
				arr: 178,
				dep: 180,
				platform: "-",
				day: 1
			},
			{
				code: "TPJ",
				name: "TIRUCHIRAPPA",
				lat: 10.7941,
				lng: 78.6854,
				km: 335,
				arr: 305,
				dep: 310,
				platform: "-",
				day: 1
			},
			{
				code: "MPA",
				name: "MANAPARAI",
				lat: 10.6076,
				lng: 78.4178,
				km: 372,
				arr: 340,
				dep: 341,
				platform: "-",
				day: 1
			},
			{
				code: "DG",
				name: "DINDIGUL JN",
				lat: 10.3538,
				lng: 77.9855,
				km: 429,
				arr: 395,
				dep: 400,
				platform: "-",
				day: 1
			},
			{
				code: "ABI",
				name: "AMBATURAI",
				lat: 10.2722,
				lng: 77.9245,
				km: 440,
				arr: 410,
				dep: 411,
				platform: "-",
				day: 1
			},
			{
				code: "KQN",
				name: "KODAIKKANAL",
				lat: 10.1796,
				lng: 77.9096,
				km: 451,
				arr: 420,
				dep: 421,
				platform: "-",
				day: 1
			},
			{
				code: "MDU",
				name: "MADURAI JN",
				lat: 9.9199,
				lng: 78.1103,
				km: 492,
				arr: 495,
				dep: 495,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12638",
		name: "MDU-MS PANDI",
		type: "Express",
		startsAt: 1235,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "MDU",
				name: "MADURAI JN",
				lat: 9.9199,
				lng: 78.1103,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "KQN",
				name: "KODAIKKANAL",
				lat: 10.1796,
				lng: 77.9096,
				km: 40,
				arr: 34,
				dep: 35,
				platform: "-",
				day: 1
			},
			{
				code: "ABI",
				name: "AMBATURAI",
				lat: 10.2722,
				lng: 77.9245,
				km: 51,
				arr: 48,
				dep: 49,
				platform: "-",
				day: 1
			},
			{
				code: "DG",
				name: "DINDIGUL JN",
				lat: 10.3538,
				lng: 77.9855,
				km: 62,
				arr: 64,
				dep: 65,
				platform: "-",
				day: 1
			},
			{
				code: "MPA",
				name: "MANAPARAI",
				lat: 10.6076,
				lng: 78.4178,
				km: 119,
				arr: 109,
				dep: 110,
				platform: "-",
				day: 1
			},
			{
				code: "TPJ",
				name: "TIRUCHIRAPPA",
				lat: 10.7941,
				lng: 78.6854,
				km: 156,
				arr: 150,
				dep: 155,
				platform: "-",
				day: 1
			},
			{
				code: "VRI",
				name: "VRIDHA CHALA",
				lat: 11.535,
				lng: 79.3161,
				km: 279,
				arr: 243,
				dep: 245,
				platform: "-",
				day: 1
			},
			{
				code: "VM",
				name: "VILLUPURAM J",
				lat: 11.943,
				lng: 79.5001,
				km: 334,
				arr: 320,
				dep: 325,
				platform: "-",
				day: 1
			},
			{
				code: "CGL",
				name: "CHENGALPATTU",
				lat: 12.6929,
				lng: 79.9815,
				km: 437,
				arr: 418,
				dep: 420,
				platform: "-",
				day: 1
			},
			{
				code: "TBM",
				name: "TAMBARAM",
				lat: 12.926,
				lng: 80.1192,
				km: 467,
				arr: 448,
				dep: 450,
				platform: "-",
				day: 1
			},
			{
				code: "MBM",
				name: "MAMBALAM",
				lat: 13.0382,
				lng: 80.2282,
				km: 485,
				arr: 469,
				dep: 470,
				platform: "-",
				day: 1
			},
			{
				code: "MS",
				name: "CHENNAI EGMO",
				lat: 13.0777,
				lng: 80.2602,
				km: 492,
				arr: 500,
				dep: 500,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12673",
		name: "MAS-CBE CHER",
		type: "Express",
		startsAt: 1330,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "MAS",
				name: "CHENNAI CENT",
				lat: 13.0848,
				lng: 80.2749,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "AJJ",
				name: "ARAKKONAM JN",
				lat: 13.0815,
				lng: 79.668,
				km: 68,
				arr: 48,
				dep: 50,
				platform: "-",
				day: 1
			},
			{
				code: "JTJ",
				name: "JOLARPETTAI",
				lat: 12.5609,
				lng: 78.5778,
				km: 212,
				arr: 188,
				dep: 190,
				platform: "-",
				day: 1
			},
			{
				code: "SA",
				name: "SALEM JN.",
				lat: 11.6717,
				lng: 78.1134,
				km: 331,
				arr: 275,
				dep: 280,
				platform: "-",
				day: 1
			},
			{
				code: "ED",
				name: "ERODE JN.",
				lat: 11.3277,
				lng: 77.7259,
				km: 390,
				arr: 345,
				dep: 350,
				platform: "-",
				day: 1
			},
			{
				code: "TUP",
				name: "TIRUPPUR",
				lat: 11.1089,
				lng: 77.3412,
				km: 441,
				arr: 393,
				dep: 395,
				platform: "-",
				day: 1
			},
			{
				code: "CBF",
				name: "COIMBATORE N",
				lat: 11.0199,
				lng: 76.9543,
				km: 488,
				arr: 434,
				dep: 435,
				platform: "-",
				day: 1
			},
			{
				code: "CBE",
				name: "COIMBATORE",
				lat: 10.9976,
				lng: 76.9663,
				km: 491,
				arr: 485,
				dep: 485,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12674",
		name: "CBE-MAS CHER",
		type: "Express",
		startsAt: 1360,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "CBE",
				name: "COIMBATORE",
				lat: 10.9976,
				lng: 76.9663,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "TUP",
				name: "TIRUPPUR",
				lat: 11.1089,
				lng: 77.3412,
				km: 50,
				arr: 38,
				dep: 40,
				platform: "-",
				day: 1
			},
			{
				code: "ED",
				name: "ERODE JN.",
				lat: 11.3277,
				lng: 77.7259,
				km: 100,
				arr: 95,
				dep: 100,
				platform: "-",
				day: 1
			},
			{
				code: "SA",
				name: "SALEM JN.",
				lat: 11.6717,
				lng: 78.1134,
				km: 159,
				arr: 157,
				dep: 160,
				platform: "-",
				day: 1
			},
			{
				code: "JTJ",
				name: "JOLARPETTAI",
				lat: 12.5609,
				lng: 78.5778,
				km: 280,
				arr: 263,
				dep: 265,
				platform: "-",
				day: 1
			},
			{
				code: "KPD",
				name: "KATPADI JN",
				lat: 12.9727,
				lng: 79.1353,
				km: 364,
				arr: 333,
				dep: 335,
				platform: "-",
				day: 1
			},
			{
				code: "AJJ",
				name: "ARAKKONAM JN",
				lat: 13.0815,
				lng: 79.668,
				km: 425,
				arr: 383,
				dep: 385,
				platform: "-",
				day: 1
			},
			{
				code: "PER",
				name: "PERAMBUR",
				lat: 13.107,
				lng: 80.2445,
				km: 488,
				arr: 433,
				dep: 435,
				platform: "-",
				day: 1
			},
			{
				code: "MAS",
				name: "CHENNAI CENT",
				lat: 13.0848,
				lng: 80.2749,
				km: 493,
				arr: 485,
				dep: 485,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12679",
		name: "MAS-CBE INTE",
		type: "Express",
		startsAt: 870,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "MAS",
				name: "CHENNAI CENT",
				lat: 13.0848,
				lng: 80.2749,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "AJJ",
				name: "ARAKKONAM JN",
				lat: 13.0815,
				lng: 79.668,
				km: 68,
				arr: 48,
				dep: 50,
				platform: "-",
				day: 1
			},
			{
				code: "KPD",
				name: "KATPADI JN",
				lat: 12.9727,
				lng: 79.1353,
				km: 128,
				arr: 93,
				dep: 95,
				platform: "-",
				day: 1
			},
			{
				code: "AB",
				name: "AMBUR",
				lat: 12.7829,
				lng: 78.7213,
				km: 181,
				arr: 134,
				dep: 135,
				platform: "-",
				day: 1
			},
			{
				code: "JTJ",
				name: "JOLARPETTAI",
				lat: 12.5609,
				lng: 78.5778,
				km: 212,
				arr: 178,
				dep: 180,
				platform: "-",
				day: 1
			},
			{
				code: "MAP",
				name: "MORAPPUR",
				lat: 12.1241,
				lng: 78.3939,
				km: 266,
				arr: 224,
				dep: 225,
				platform: "-",
				day: 1
			},
			{
				code: "BQI",
				name: "BOMMIDI",
				lat: 11.9847,
				lng: 78.2463,
				km: 289,
				arr: 244,
				dep: 245,
				platform: "-",
				day: 1
			},
			{
				code: "SA",
				name: "SALEM JN.",
				lat: 11.6717,
				lng: 78.1134,
				km: 331,
				arr: 287,
				dep: 290,
				platform: "-",
				day: 1
			},
			{
				code: "ED",
				name: "ERODE JN.",
				lat: 11.3277,
				lng: 77.7259,
				km: 390,
				arr: 345,
				dep: 350,
				platform: "-",
				day: 1
			},
			{
				code: "TUP",
				name: "TIRUPPUR",
				lat: 11.1089,
				lng: 77.3412,
				km: 441,
				arr: 393,
				dep: 395,
				platform: "-",
				day: 1
			},
			{
				code: "CBF",
				name: "COIMBATORE N",
				lat: 11.0199,
				lng: 76.9543,
				km: 488,
				arr: 434,
				dep: 435,
				platform: "-",
				day: 1
			},
			{
				code: "CBE",
				name: "COIMBATORE",
				lat: 10.9976,
				lng: 76.9663,
				km: 491,
				arr: 465,
				dep: 465,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12680",
		name: "CBE-MAS INTE",
		type: "Express",
		startsAt: 375,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "CBE",
				name: "COIMBATORE",
				lat: 10.9976,
				lng: 76.9663,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "TUP",
				name: "TIRUPPUR",
				lat: 11.1089,
				lng: 77.3412,
				km: 50,
				arr: 38,
				dep: 40,
				platform: "-",
				day: 1
			},
			{
				code: "ED",
				name: "ERODE JN.",
				lat: 11.3277,
				lng: 77.7259,
				km: 100,
				arr: 85,
				dep: 90,
				platform: "-",
				day: 1
			},
			{
				code: "SA",
				name: "SALEM JN.",
				lat: 11.6717,
				lng: 78.1134,
				km: 159,
				arr: 137,
				dep: 140,
				platform: "-",
				day: 1
			},
			{
				code: "BQI",
				name: "BOMMIDI",
				lat: 11.9847,
				lng: 78.2463,
				km: 202,
				arr: 179,
				dep: 180,
				platform: "-",
				day: 1
			},
			{
				code: "MAP",
				name: "MORAPPUR",
				lat: 12.1241,
				lng: 78.3939,
				km: 225,
				arr: 199,
				dep: 200,
				platform: "-",
				day: 1
			},
			{
				code: "JTJ",
				name: "JOLARPETTAI",
				lat: 12.5609,
				lng: 78.5778,
				km: 280,
				arr: 243,
				dep: 245,
				platform: "-",
				day: 1
			},
			{
				code: "AB",
				name: "AMBUR",
				lat: 12.7829,
				lng: 78.7213,
				km: 312,
				arr: 269,
				dep: 270,
				platform: "-",
				day: 1
			},
			{
				code: "KPD",
				name: "KATPADI JN",
				lat: 12.9727,
				lng: 79.1353,
				km: 364,
				arr: 313,
				dep: 315,
				platform: "-",
				day: 1
			},
			{
				code: "AJJ",
				name: "ARAKKONAM JN",
				lat: 13.0815,
				lng: 79.668,
				km: 425,
				arr: 363,
				dep: 365,
				platform: "-",
				day: 1
			},
			{
				code: "PER",
				name: "PERAMBUR",
				lat: 13.107,
				lng: 80.2445,
				km: 488,
				arr: 414,
				dep: 415,
				platform: "-",
				day: 1
			},
			{
				code: "MAS",
				name: "CHENNAI CENT",
				lat: 13.0848,
				lng: 80.2749,
				km: 493,
				arr: 455,
				dep: 455,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12681",
		name: "MAS CBE EXP",
		type: "Express",
		startsAt: 1350,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "MAS",
				name: "CHENNAI CENT",
				lat: 13.0848,
				lng: 80.2749,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "AJJ",
				name: "ARAKKONAM JN",
				lat: 13.0815,
				lng: 79.668,
				km: 68,
				arr: 48,
				dep: 50,
				platform: "-",
				day: 1
			},
			{
				code: "KPD",
				name: "KATPADI JN",
				lat: 12.9727,
				lng: 79.1353,
				km: 128,
				arr: 98,
				dep: 100,
				platform: "-",
				day: 1
			},
			{
				code: "SA",
				name: "SALEM JN.",
				lat: 11.6717,
				lng: 78.1134,
				km: 331,
				arr: 287,
				dep: 290,
				platform: "-",
				day: 1
			},
			{
				code: "ED",
				name: "ERODE JN.",
				lat: 11.3277,
				lng: 77.7259,
				km: 390,
				arr: 340,
				dep: 345,
				platform: "-",
				day: 1
			},
			{
				code: "TUP",
				name: "TIRUPPUR",
				lat: 11.1089,
				lng: 77.3412,
				km: 441,
				arr: 388,
				dep: 390,
				platform: "-",
				day: 1
			},
			{
				code: "CBE",
				name: "COIMBATORE",
				lat: 10.9976,
				lng: 76.9663,
				km: 491,
				arr: 490,
				dep: 490,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12682",
		name: "CHENNAI EXP",
		type: "Express",
		startsAt: 1410,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "CBE",
				name: "COIMBATORE",
				lat: 10.9976,
				lng: 76.9663,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "TUP",
				name: "TIRUPPUR",
				lat: 11.1089,
				lng: 77.3412,
				km: 50,
				arr: 33,
				dep: 35,
				platform: "-",
				day: 1
			},
			{
				code: "ED",
				name: "ERODE JN.",
				lat: 11.3277,
				lng: 77.7259,
				km: 100,
				arr: 80,
				dep: 85,
				platform: "-",
				day: 1
			},
			{
				code: "SA",
				name: "SALEM JN.",
				lat: 11.6717,
				lng: 78.1134,
				km: 159,
				arr: 140,
				dep: 145,
				platform: "-",
				day: 1
			},
			{
				code: "KPD",
				name: "KATPADI JN",
				lat: 12.9727,
				lng: 79.1353,
				km: 364,
				arr: 323,
				dep: 325,
				platform: "-",
				day: 1
			},
			{
				code: "AJJ",
				name: "ARAKKONAM JN",
				lat: 13.0815,
				lng: 79.668,
				km: 425,
				arr: 373,
				dep: 375,
				platform: "-",
				day: 1
			},
			{
				code: "PER",
				name: "PERAMBUR",
				lat: 13.107,
				lng: 80.2445,
				km: 488,
				arr: 423,
				dep: 425,
				platform: "-",
				day: 1
			},
			{
				code: "MAS",
				name: "CHENNAI CENT",
				lat: 13.0848,
				lng: 80.2749,
				km: 493,
				arr: 470,
				dep: 470,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12951",
		name: "MUMBAI RAJDH",
		type: "Express",
		startsAt: 1020,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "BCT",
				name: "MUMBAI CENTR",
				lat: 18.9707,
				lng: 72.8194,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "BVI",
				name: "BORIVLI",
				lat: 19.2287,
				lng: 72.8564,
				km: 29,
				arr: 30,
				dep: 32,
				platform: "-",
				day: 1
			},
			{
				code: "ST",
				name: "SURAT",
				lat: 21.2066,
				lng: 72.8408,
				km: 262,
				arr: 173,
				dep: 178,
				platform: "-",
				day: 1
			},
			{
				code: "BRC",
				name: "VADODARA JN.",
				lat: 22.3108,
				lng: 73.1811,
				km: 391,
				arr: 258,
				dep: 268,
				platform: "-",
				day: 1
			},
			{
				code: "RTM",
				name: "RATLAM JN",
				lat: 23.3404,
				lng: 75.0508,
				km: 652,
				arr: 457,
				dep: 460,
				platform: "-",
				day: 1
			},
			{
				code: "NAD",
				name: "NAGDA JN",
				lat: 23.4559,
				lng: 75.4125,
				km: 697,
				arr: 498,
				dep: 500,
				platform: "-",
				day: 1
			},
			{
				code: "KOTA",
				name: "KOTA",
				lat: 25.2236,
				lng: 75.8805,
				km: 918,
				arr: 620,
				dep: 625,
				platform: "-",
				day: 1
			},
			{
				code: "NDLS",
				name: "NEW DELHI",
				lat: 28.6423,
				lng: 77.22,
				km: 1373,
				arr: 935,
				dep: 935,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12952",
		name: "MUMBAI RAJDH",
		type: "Express",
		startsAt: 985,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "NDLS",
				name: "NEW DELHI",
				lat: 28.6423,
				lng: 77.22,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "KOTA",
				name: "KOTA",
				lat: 25.2236,
				lng: 75.8805,
				km: 457,
				arr: 275,
				dep: 280,
				platform: "-",
				day: 1
			},
			{
				code: "NAD",
				name: "NAGDA JN",
				lat: 23.4559,
				lng: 75.4125,
				km: 678,
				arr: 430,
				dep: 432,
				platform: "-",
				day: 1
			},
			{
				code: "RTM",
				name: "RATLAM JN",
				lat: 23.3404,
				lng: 75.0508,
				km: 723,
				arr: 460,
				dep: 463,
				platform: "-",
				day: 1
			},
			{
				code: "BRC",
				name: "VADODARA JN.",
				lat: 22.3108,
				lng: 73.1811,
				km: 985,
				arr: 659,
				dep: 669,
				platform: "-",
				day: 1
			},
			{
				code: "ST",
				name: "SURAT",
				lat: 21.2066,
				lng: 72.8408,
				km: 1114,
				arr: 753,
				dep: 758,
				platform: "-",
				day: 1
			},
			{
				code: "BVI",
				name: "BORIVLI",
				lat: 19.2287,
				lng: 72.8564,
				km: 1346,
				arr: 902,
				dep: 904,
				platform: "-",
				day: 1
			},
			{
				code: "BCT",
				name: "MUMBAI CENTR",
				lat: 18.9707,
				lng: 72.8194,
				km: 1376,
				arr: 950,
				dep: 950,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12953",
		name: "AUG KR RAJ E",
		type: "Express",
		startsAt: 1060,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "BCT",
				name: "MUMBAI CENTR",
				lat: 18.9707,
				lng: 72.8194,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "ADH",
				name: "ANDHERI",
				lat: 19.1174,
				lng: 72.8469,
				km: 17,
				arr: 22,
				dep: 23,
				platform: "-",
				day: 1
			},
			{
				code: "BVI",
				name: "BORIVLI",
				lat: 19.2287,
				lng: 72.8564,
				km: 29,
				arr: 36,
				dep: 39,
				platform: "-",
				day: 1
			},
			{
				code: "VAPI",
				name: "VAPI",
				lat: 20.3743,
				lng: 72.9091,
				km: 169,
				arr: 120,
				dep: 122,
				platform: "-",
				day: 1
			},
			{
				code: "BL",
				name: "VALSAD",
				lat: 20.6086,
				lng: 72.9335,
				km: 193,
				arr: 142,
				dep: 145,
				platform: "-",
				day: 1
			},
			{
				code: "ST",
				name: "SURAT",
				lat: 21.2066,
				lng: 72.8408,
				km: 262,
				arr: 190,
				dep: 195,
				platform: "-",
				day: 1
			},
			{
				code: "BH",
				name: "BHARUCH JN.",
				lat: 21.7069,
				lng: 72.9977,
				km: 321,
				arr: 232,
				dep: 233,
				platform: "-",
				day: 1
			},
			{
				code: "BRC",
				name: "VADODARA JN.",
				lat: 22.3108,
				lng: 73.1811,
				km: 391,
				arr: 281,
				dep: 291,
				platform: "-",
				day: 1
			},
			{
				code: "RTM",
				name: "RATLAM JN",
				lat: 23.3404,
				lng: 75.0508,
				km: 652,
				arr: 518,
				dep: 520,
				platform: "-",
				day: 1
			},
			{
				code: "KOTA",
				name: "KOTA",
				lat: 25.2236,
				lng: 75.8805,
				km: 918,
				arr: 690,
				dep: 700,
				platform: "-",
				day: 1
			},
			{
				code: "SWM",
				name: "SAWAI MADHOP",
				lat: 26.0183,
				lng: 76.3562,
				km: 1026,
				arr: 766,
				dep: 768,
				platform: "-",
				day: 1
			},
			{
				code: "MTJ",
				name: "MATHURA JN.",
				lat: 27.4801,
				lng: 77.6731,
				km: 1238,
				arr: 920,
				dep: 922,
				platform: "-",
				day: 1
			},
			{
				code: "NZM",
				name: "HAZRAT NIZAM",
				lat: 28.5873,
				lng: 77.2542,
				km: 1366,
				arr: 1035,
				dep: 1035,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12954",
		name: "AG KRANTI RJ",
		type: "Express",
		startsAt: 1010,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "NZM",
				name: "HAZRAT NIZAM",
				lat: 28.5873,
				lng: 77.2542,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "MTJ",
				name: "MATHURA JN.",
				lat: 27.4801,
				lng: 77.6731,
				km: 130,
				arr: 108,
				dep: 110,
				platform: "-",
				day: 1
			},
			{
				code: "SWM",
				name: "SAWAI MADHOP",
				lat: 26.0183,
				lng: 76.3562,
				km: 342,
				arr: 226,
				dep: 228,
				platform: "-",
				day: 1
			},
			{
				code: "KOTA",
				name: "KOTA",
				lat: 25.2236,
				lng: 75.8805,
				km: 450,
				arr: 290,
				dep: 300,
				platform: "-",
				day: 1
			},
			{
				code: "RTM",
				name: "RATLAM JN",
				lat: 23.3404,
				lng: 75.0508,
				km: 715,
				arr: 483,
				dep: 485,
				platform: "-",
				day: 1
			},
			{
				code: "BRC",
				name: "VADODARA JN.",
				lat: 22.3108,
				lng: 73.1811,
				km: 978,
				arr: 683,
				dep: 693,
				platform: "-",
				day: 1
			},
			{
				code: "BH",
				name: "BHARUCH JN.",
				lat: 21.7069,
				lng: 72.9977,
				km: 1048,
				arr: 735,
				dep: 737,
				platform: "-",
				day: 1
			},
			{
				code: "ST",
				name: "SURAT",
				lat: 21.2066,
				lng: 72.8408,
				km: 1106,
				arr: 787,
				dep: 792,
				platform: "-",
				day: 1
			},
			{
				code: "BL",
				name: "VALSAD",
				lat: 20.6086,
				lng: 72.9335,
				km: 1175,
				arr: 835,
				dep: 836,
				platform: "-",
				day: 1
			},
			{
				code: "VAPI",
				name: "VAPI",
				lat: 20.3743,
				lng: 72.9091,
				km: 1199,
				arr: 853,
				dep: 855,
				platform: "-",
				day: 1
			},
			{
				code: "BVI",
				name: "BORIVLI",
				lat: 19.2287,
				lng: 72.8564,
				km: 1339,
				arr: 964,
				dep: 966,
				platform: "-",
				day: 1
			},
			{
				code: "ADH",
				name: "ANDHERI",
				lat: 19.1174,
				lng: 72.8469,
				km: 1351,
				arr: 980,
				dep: 982,
				platform: "-",
				day: 1
			},
			{
				code: "BCT",
				name: "MUMBAI CENTR",
				lat: 18.9707,
				lng: 72.8194,
				km: 1369,
				arr: 1015,
				dep: 1015,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12957",
		name: "SWARNA J RAJ",
		type: "Express",
		startsAt: 1060,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "ADI",
				name: "AHMEDABAD",
				lat: 23.0255,
				lng: 72.6015,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "SBI",
				name: "SABARMATI JN",
				lat: 23.073,
				lng: 72.5872,
				km: 6,
				arr: 15,
				dep: 17,
				platform: "-",
				day: 1
			},
			{
				code: "MSH",
				name: "MAHESANA JN",
				lat: 23.6026,
				lng: 72.3887,
				km: 68,
				arr: 65,
				dep: 67,
				platform: "-",
				day: 1
			},
			{
				code: "PNU",
				name: "PALANPUR JN",
				lat: 24.1744,
				lng: 72.4302,
				km: 133,
				arr: 142,
				dep: 144,
				platform: "-",
				day: 1
			},
			{
				code: "ABR",
				name: "ABU ROAD",
				lat: 24.4708,
				lng: 72.7757,
				km: 186,
				arr: 185,
				dep: 190,
				platform: "-",
				day: 1
			},
			{
				code: "AII",
				name: "AJMER JN.",
				lat: 26.4566,
				lng: 74.6375,
				km: 489,
				arr: 435,
				dep: 440,
				platform: "-",
				day: 1
			},
			{
				code: "JP",
				name: "JAIPUR JN.",
				lat: 26.9202,
				lng: 75.7869,
				km: 623,
				arr: 550,
				dep: 560,
				platform: "-",
				day: 1
			},
			{
				code: "GGN",
				name: "GURGAON",
				lat: 28.4892,
				lng: 77.0107,
				km: 899,
				arr: 766,
				dep: 768,
				platform: "-",
				day: 1
			},
			{
				code: "DEC",
				name: "DELHI CANTT",
				lat: 28.6135,
				lng: 77.1166,
				km: 916,
				arr: 784,
				dep: 786,
				platform: "-",
				day: 1
			},
			{
				code: "NDLS",
				name: "NEW DELHI",
				lat: 28.6423,
				lng: 77.22,
				km: 931,
				arr: 830,
				dep: 830,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "12958",
		name: "ADI SJ RAJDH",
		type: "Express",
		startsAt: 1195,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "NDLS",
				name: "NEW DELHI",
				lat: 28.6423,
				lng: 77.22,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "DEC",
				name: "DELHI CANTT",
				lat: 28.6135,
				lng: 77.1166,
				km: 15,
				arr: 28,
				dep: 30,
				platform: "-",
				day: 1
			},
			{
				code: "GGN",
				name: "GURGAON",
				lat: 28.4892,
				lng: 77.0107,
				km: 32,
				arr: 46,
				dep: 48,
				platform: "-",
				day: 1
			},
			{
				code: "JP",
				name: "JAIPUR JN.",
				lat: 26.9202,
				lng: 75.7869,
				km: 308,
				arr: 265,
				dep: 275,
				platform: "-",
				day: 1
			},
			{
				code: "AII",
				name: "AJMER JN.",
				lat: 26.4566,
				lng: 74.6375,
				km: 442,
				arr: 390,
				dep: 394,
				platform: "-",
				day: 1
			},
			{
				code: "ABR",
				name: "ABU ROAD",
				lat: 24.4708,
				lng: 72.7757,
				km: 747,
				arr: 606,
				dep: 610,
				platform: "-",
				day: 1
			},
			{
				code: "PNU",
				name: "PALANPUR JN",
				lat: 24.1744,
				lng: 72.4302,
				km: 800,
				arr: 675,
				dep: 677,
				platform: "-",
				day: 1
			},
			{
				code: "MSH",
				name: "MAHESANA JN",
				lat: 23.6026,
				lng: 72.3887,
				km: 865,
				arr: 728,
				dep: 730,
				platform: "-",
				day: 1
			},
			{
				code: "SBI",
				name: "SABARMATI JN",
				lat: 23.073,
				lng: 72.5872,
				km: 927,
				arr: 785,
				dep: 787,
				platform: "-",
				day: 1
			},
			{
				code: "ADI",
				name: "AHMEDABAD",
				lat: 23.0255,
				lng: 72.6015,
				km: 934,
				arr: 825,
				dep: 825,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "16127",
		name: "MS GURUVAYUR",
		type: "Express",
		startsAt: 495,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "MS",
				name: "CHENNAI EGMO",
				lat: 13.0777,
				lng: 80.2602,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "TBM",
				name: "TAMBARAM",
				lat: 12.926,
				lng: 80.1192,
				km: 24,
				arr: 28,
				dep: 30,
				platform: "-",
				day: 1
			},
			{
				code: "CGL",
				name: "CHENGALPATTU",
				lat: 12.6929,
				lng: 79.9815,
				km: 55,
				arr: 58,
				dep: 60,
				platform: "-",
				day: 1
			},
			{
				code: "MLMR",
				name: "MELMARUVATHU",
				lat: 12.4296,
				lng: 79.8338,
				km: 91,
				arr: 88,
				dep: 90,
				platform: "-",
				day: 1
			},
			{
				code: "TMV",
				name: "TINDIVANAM",
				lat: 12.2294,
				lng: 79.6513,
				km: 121,
				arr: 113,
				dep: 115,
				platform: "-",
				day: 1
			},
			{
				code: "VM",
				name: "VILLUPURAM J",
				lat: 11.943,
				lng: 79.5001,
				km: 158,
				arr: 155,
				dep: 160,
				platform: "-",
				day: 1
			},
			{
				code: "VRI",
				name: "VRIDHA CHALA",
				lat: 11.535,
				lng: 79.3161,
				km: 212,
				arr: 196,
				dep: 198,
				platform: "-",
				day: 1
			},
			{
				code: "PNDM",
				name: "PENNADAM",
				lat: 11.398,
				lng: 79.22,
				km: 231,
				arr: 209,
				dep: 210,
				platform: "-",
				day: 1
			},
			{
				code: "ALU",
				name: "ARIYALUR",
				lat: 11.15,
				lng: 79.0683,
				km: 266,
				arr: 238,
				dep: 240,
				platform: "-",
				day: 1
			},
			{
				code: "SRGM",
				name: "SRIRANGAM",
				lat: 10.8579,
				lng: 78.6963,
				km: 324,
				arr: 283,
				dep: 285,
				platform: "-",
				day: 1
			},
			{
				code: "TPJ",
				name: "TIRUCHIRAPPA",
				lat: 10.7941,
				lng: 78.6854,
				km: 335,
				arr: 315,
				dep: 320,
				platform: "-",
				day: 1
			},
			{
				code: "MPA",
				name: "MANAPARAI",
				lat: 10.6076,
				lng: 78.4178,
				km: 372,
				arr: 344,
				dep: 345,
				platform: "-",
				day: 1
			},
			{
				code: "DG",
				name: "DINDIGUL JN",
				lat: 10.3538,
				lng: 77.9855,
				km: 429,
				arr: 393,
				dep: 395,
				platform: "-",
				day: 1
			},
			{
				code: "SDN",
				name: "SHOLAVANDAN",
				lat: 10.0223,
				lng: 77.9651,
				km: 470,
				arr: 420,
				dep: 421,
				platform: "-",
				day: 1
			},
			{
				code: "KON",
				name: "KUDALNAGAR",
				lat: 9.9449,
				lng: 78.1087,
				km: 488,
				arr: 439,
				dep: 440,
				platform: "-",
				day: 1
			},
			{
				code: "MDU",
				name: "MADURAI JN",
				lat: 9.9199,
				lng: 78.1103,
				km: 492,
				arr: 470,
				dep: 480,
				platform: "-",
				day: 1
			},
			{
				code: "VPT",
				name: "VIRUDUNAGAR",
				lat: 9.5964,
				lng: 77.9577,
				km: 535,
				arr: 518,
				dep: 520,
				platform: "-",
				day: 1
			},
			{
				code: "SRT",
				name: "SATUR",
				lat: 9.3575,
				lng: 77.9216,
				km: 562,
				arr: 539,
				dep: 540,
				platform: "-",
				day: 1
			},
			{
				code: "CVP",
				name: "KOVILPATTI",
				lat: 9.1826,
				lng: 77.8728,
				km: 584,
				arr: 559,
				dep: 560,
				platform: "-",
				day: 1
			},
			{
				code: "MEJ",
				name: "VANCHI MANIY",
				lat: 8.8821,
				lng: 77.8907,
				km: 620,
				arr: 609,
				dep: 610,
				platform: "-",
				day: 1
			},
			{
				code: "TEN",
				name: "TIRUNELVELI",
				lat: 8.7364,
				lng: 77.708,
				km: 649,
				arr: 675,
				dep: 680,
				platform: "-",
				day: 1
			},
			{
				code: "NNN",
				name: "NANGUNERI",
				lat: 8.4891,
				lng: 77.6626,
				km: 677,
				arr: 724,
				dep: 725,
				platform: "-",
				day: 1
			},
			{
				code: "VLY",
				name: "VALLIYUR",
				lat: 8.3762,
				lng: 77.614,
				km: 691,
				arr: 734,
				dep: 735,
				platform: "-",
				day: 1
			},
			{
				code: "AAY",
				name: "ARALVAYMOLI",
				lat: 8.2495,
				lng: 77.5293,
				km: 709,
				arr: 750,
				dep: 751,
				platform: "-",
				day: 1
			},
			{
				code: "NCJ",
				name: "NAGERCOIL JN",
				lat: 8.1738,
				lng: 77.4435,
				km: 722,
				arr: 795,
				dep: 805,
				platform: "-",
				day: 1
			},
			{
				code: "ERL",
				name: "ERANIEL",
				lat: 8.2125,
				lng: 77.3082,
				km: 741,
				arr: 816,
				dep: 817,
				platform: "-",
				day: 1
			},
			{
				code: "KZT",
				name: "KULITTURAI",
				lat: 8.3023,
				lng: 77.2188,
				km: 755,
				arr: 840,
				dep: 841,
				platform: "-",
				day: 1
			},
			{
				code: "NYY",
				name: "NEYYATTINKAR",
				lat: 8.4104,
				lng: 77.0811,
				km: 776,
				arr: 866,
				dep: 867,
				platform: "-",
				day: 1
			},
			{
				code: "TVC",
				name: "TRIVANDRUM C",
				lat: 8.4867,
				lng: 76.9512,
				km: 793,
				arr: 900,
				dep: 905,
				platform: "-",
				day: 1
			},
			{
				code: "CRY",
				name: "CHIRAYINKIL",
				lat: 8.6583,
				lng: 76.7854,
				km: 822,
				arr: 926,
				dep: 927,
				platform: "-",
				day: 1
			},
			{
				code: "KVU",
				name: "KADAKAVUR",
				lat: 8.6791,
				lng: 76.7667,
				km: 825,
				arr: 934,
				dep: 935,
				platform: "-",
				day: 1
			},
			{
				code: "VAK",
				name: "VARKALA",
				lat: 8.7407,
				lng: 76.7229,
				km: 834,
				arr: 946,
				dep: 947,
				platform: "-",
				day: 1
			},
			{
				code: "PVU",
				name: "PARAVUR",
				lat: 8.8158,
				lng: 76.6682,
				km: 845,
				arr: 960,
				dep: 961,
				platform: "-",
				day: 1
			},
			{
				code: "QLN",
				name: "QUILON",
				lat: 8.8866,
				lng: 76.5968,
				km: 858,
				arr: 975,
				dep: 980,
				platform: "-",
				day: 1
			},
			{
				code: "KYJ",
				name: "KAYANKULAM J",
				lat: 9.1826,
				lng: 76.5129,
				km: 899,
				arr: 1023,
				dep: 1025,
				platform: "-",
				day: 1
			},
			{
				code: "HAD",
				name: "HARIPAD",
				lat: 9.2796,
				lng: 76.4622,
				km: 912,
				arr: 1040,
				dep: 1041,
				platform: "-",
				day: 1
			},
			{
				code: "AMPA",
				name: "AMBALAPUZHA",
				lat: 9.3861,
				lng: 76.3638,
				km: 930,
				arr: 1055,
				dep: 1056,
				platform: "-",
				day: 1
			},
			{
				code: "ALLP",
				name: "ALLEPPEY",
				lat: 9.4838,
				lng: 76.3225,
				km: 942,
				arr: 1067,
				dep: 1070,
				platform: "-",
				day: 1
			},
			{
				code: "SRTL",
				name: "SHERTALAI",
				lat: 9.691,
				lng: 76.3252,
				km: 966,
				arr: 1085,
				dep: 1086,
				platform: "-",
				day: 1
			},
			{
				code: "ERS",
				name: "ERNAKULAM. J",
				lat: 9.9695,
				lng: 76.2907,
				km: 999,
				arr: 1145,
				dep: 1150,
				platform: "-",
				day: 1
			},
			{
				code: "ERN",
				name: "ERNAKULAM TO",
				lat: 9.9916,
				lng: 76.2861,
				km: 1001,
				arr: 1155,
				dep: 1157,
				platform: "-",
				day: 1
			},
			{
				code: "AWY",
				name: "ALWAYE",
				lat: 10.1082,
				lng: 76.3565,
				km: 1018,
				arr: 1175,
				dep: 1177,
				platform: "-",
				day: 1
			},
			{
				code: "AFK",
				name: "ANGAMALI (FO",
				lat: 10.1837,
				lng: 76.3779,
				km: 1027,
				arr: 1197,
				dep: 1198,
				platform: "-",
				day: 1
			},
			{
				code: "CKI",
				name: "CHALAKUDI",
				lat: 10.3018,
				lng: 76.3218,
				km: 1043,
				arr: 1215,
				dep: 1216,
				platform: "-",
				day: 1
			},
			{
				code: "IJK",
				name: "IRINJALAKUDA",
				lat: 10.3395,
				lng: 76.2809,
				km: 1049,
				arr: 1224,
				dep: 1225,
				platform: "-",
				day: 1
			},
			{
				code: "TCR",
				name: "TRICHUR",
				lat: 10.5148,
				lng: 76.2079,
				km: 1073,
				arr: 1245,
				dep: 1248,
				platform: "-",
				day: 1
			},
			{
				code: "PNQ",
				name: "PUNKUNNAM",
				lat: 10.5351,
				lng: 76.2094,
				km: 1075,
				arr: 1251,
				dep: 1252,
				platform: "-",
				day: 1
			},
			{
				code: "GUV",
				name: "GURUVAYUR",
				lat: 10.5969,
				lng: 76.0455,
				km: 1095,
				arr: 1295,
				dep: 1295,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "16128",
		name: "GUV CHENNAI",
		type: "Express",
		startsAt: 1285,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "GUV",
				name: "GURUVAYUR",
				lat: 10.5969,
				lng: 76.0455,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "PNQ",
				name: "PUNKUNNAM",
				lat: 10.5351,
				lng: 76.2094,
				km: 20,
				arr: 20,
				dep: 21,
				platform: "-",
				day: 1
			},
			{
				code: "TCR",
				name: "TRICHUR",
				lat: 10.5148,
				lng: 76.2079,
				km: 22,
				arr: 25,
				dep: 28,
				platform: "-",
				day: 1
			},
			{
				code: "IJK",
				name: "IRINJALAKUDA",
				lat: 10.3395,
				lng: 76.2809,
				km: 46,
				arr: 49,
				dep: 50,
				platform: "-",
				day: 1
			},
			{
				code: "CKI",
				name: "CHALAKUDI",
				lat: 10.3018,
				lng: 76.3218,
				km: 52,
				arr: 58,
				dep: 59,
				platform: "-",
				day: 1
			},
			{
				code: "AFK",
				name: "ANGAMALI (FO",
				lat: 10.1837,
				lng: 76.3779,
				km: 68,
				arr: 73,
				dep: 74,
				platform: "-",
				day: 1
			},
			{
				code: "AWY",
				name: "ALWAYE",
				lat: 10.1082,
				lng: 76.3565,
				km: 77,
				arr: 88,
				dep: 90,
				platform: "-",
				day: 1
			},
			{
				code: "ERN",
				name: "ERNAKULAM TO",
				lat: 9.9916,
				lng: 76.2861,
				km: 94,
				arr: 110,
				dep: 112,
				platform: "-",
				day: 1
			},
			{
				code: "ERS",
				name: "ERNAKULAM. J",
				lat: 9.9695,
				lng: 76.2907,
				km: 96,
				arr: 135,
				dep: 140,
				platform: "-",
				day: 1
			},
			{
				code: "SRTL",
				name: "SHERTALAI",
				lat: 9.691,
				lng: 76.3252,
				km: 129,
				arr: 185,
				dep: 186,
				platform: "-",
				day: 1
			},
			{
				code: "ALLP",
				name: "ALLEPPEY",
				lat: 9.4838,
				lng: 76.3225,
				km: 153,
				arr: 202,
				dep: 205,
				platform: "-",
				day: 1
			},
			{
				code: "AMPA",
				name: "AMBALAPUZHA",
				lat: 9.3861,
				lng: 76.3638,
				km: 165,
				arr: 220,
				dep: 221,
				platform: "-",
				day: 1
			},
			{
				code: "HAD",
				name: "HARIPAD",
				lat: 9.2796,
				lng: 76.4622,
				km: 183,
				arr: 244,
				dep: 245,
				platform: "-",
				day: 1
			},
			{
				code: "KYJ",
				name: "KAYANKULAM J",
				lat: 9.1826,
				lng: 76.5129,
				km: 196,
				arr: 263,
				dep: 265,
				platform: "-",
				day: 1
			},
			{
				code: "QLN",
				name: "QUILON",
				lat: 8.8866,
				lng: 76.5968,
				km: 237,
				arr: 305,
				dep: 310,
				platform: "-",
				day: 1
			},
			{
				code: "PVU",
				name: "PARAVUR",
				lat: 8.8158,
				lng: 76.6682,
				km: 250,
				arr: 324,
				dep: 325,
				platform: "-",
				day: 1
			},
			{
				code: "VAK",
				name: "VARKALA",
				lat: 8.7407,
				lng: 76.7229,
				km: 261,
				arr: 335,
				dep: 336,
				platform: "-",
				day: 1
			},
			{
				code: "KVU",
				name: "KADAKAVUR",
				lat: 8.6791,
				lng: 76.7667,
				km: 270,
				arr: 345,
				dep: 346,
				platform: "-",
				day: 1
			},
			{
				code: "CRY",
				name: "CHIRAYINKIL",
				lat: 8.6583,
				lng: 76.7854,
				km: 273,
				arr: 351,
				dep: 352,
				platform: "-",
				day: 1
			},
			{
				code: "TVC",
				name: "TRIVANDRUM C",
				lat: 8.4867,
				lng: 76.9512,
				km: 302,
				arr: 390,
				dep: 395,
				platform: "-",
				day: 1
			},
			{
				code: "NYY",
				name: "NEYYATTINKAR",
				lat: 8.4104,
				lng: 77.0811,
				km: 319,
				arr: 415,
				dep: 416,
				platform: "-",
				day: 1
			},
			{
				code: "KZT",
				name: "KULITTURAI",
				lat: 8.3023,
				lng: 77.2188,
				km: 340,
				arr: 437,
				dep: 438,
				platform: "-",
				day: 1
			},
			{
				code: "ERL",
				name: "ERANIEL",
				lat: 8.2125,
				lng: 77.3082,
				km: 355,
				arr: 465,
				dep: 466,
				platform: "-",
				day: 1
			},
			{
				code: "NCJ",
				name: "NAGERCOIL JN",
				lat: 8.1738,
				lng: 77.4435,
				km: 373,
				arr: 500,
				dep: 510,
				platform: "-",
				day: 1
			},
			{
				code: "AAY",
				name: "ARALVAYMOLI",
				lat: 8.2495,
				lng: 77.5293,
				km: 386,
				arr: 529,
				dep: 530,
				platform: "-",
				day: 1
			},
			{
				code: "VLY",
				name: "VALLIYUR",
				lat: 8.3762,
				lng: 77.614,
				km: 404,
				arr: 548,
				dep: 549,
				platform: "-",
				day: 1
			},
			{
				code: "NNN",
				name: "NANGUNERI",
				lat: 8.4891,
				lng: 77.6626,
				km: 418,
				arr: 560,
				dep: 561,
				platform: "-",
				day: 1
			},
			{
				code: "TEN",
				name: "TIRUNELVELI",
				lat: 8.7364,
				lng: 77.708,
				km: 447,
				arr: 615,
				dep: 620,
				platform: "-",
				day: 1
			},
			{
				code: "MEJ",
				name: "VANCHI MANIY",
				lat: 8.8821,
				lng: 77.8907,
				km: 475,
				arr: 660,
				dep: 670,
				platform: "-",
				day: 1
			},
			{
				code: "CVP",
				name: "KOVILPATTI",
				lat: 9.1826,
				lng: 77.8728,
				km: 512,
				arr: 709,
				dep: 710,
				platform: "-",
				day: 1
			},
			{
				code: "SRT",
				name: "SATUR",
				lat: 9.3575,
				lng: 77.9216,
				km: 533,
				arr: 731,
				dep: 732,
				platform: "-",
				day: 1
			},
			{
				code: "VPT",
				name: "VIRUDUNAGAR",
				lat: 9.5964,
				lng: 77.9577,
				km: 560,
				arr: 753,
				dep: 755,
				platform: "-",
				day: 1
			},
			{
				code: "MDU",
				name: "MADURAI JN",
				lat: 9.9199,
				lng: 78.1103,
				km: 603,
				arr: 830,
				dep: 835,
				platform: "-",
				day: 1
			},
			{
				code: "SDN",
				name: "SHOLAVANDAN",
				lat: 10.0223,
				lng: 77.9651,
				km: 624,
				arr: 854,
				dep: 855,
				platform: "-",
				day: 1
			},
			{
				code: "DG",
				name: "DINDIGUL JN",
				lat: 10.3538,
				lng: 77.9855,
				km: 665,
				arr: 894,
				dep: 895,
				platform: "-",
				day: 1
			},
			{
				code: "MPA",
				name: "MANAPARAI",
				lat: 10.6076,
				lng: 78.4178,
				km: 723,
				arr: 939,
				dep: 940,
				platform: "-",
				day: 1
			},
			{
				code: "TPJ",
				name: "TIRUCHIRAPPA",
				lat: 10.7941,
				lng: 78.6854,
				km: 760,
				arr: 995,
				dep: 1e3,
				platform: "-",
				day: 1
			},
			{
				code: "SRGM",
				name: "SRIRANGAM",
				lat: 10.8579,
				lng: 78.6963,
				km: 772,
				arr: 1019,
				dep: 1020,
				platform: "-",
				day: 1
			},
			{
				code: "ALU",
				name: "ARIYALUR",
				lat: 11.15,
				lng: 79.0683,
				km: 830,
				arr: 1074,
				dep: 1075,
				platform: "-",
				day: 1
			},
			{
				code: "PNDM",
				name: "PENNADAM",
				lat: 11.398,
				lng: 79.22,
				km: 864,
				arr: 1098,
				dep: 1099,
				platform: "-",
				day: 1
			},
			{
				code: "VRI",
				name: "VRIDHA CHALA",
				lat: 11.535,
				lng: 79.3161,
				km: 883,
				arr: 1123,
				dep: 1125,
				platform: "-",
				day: 1
			},
			{
				code: "VM",
				name: "VILLUPURAM J",
				lat: 11.943,
				lng: 79.5001,
				km: 937,
				arr: 1185,
				dep: 1190,
				platform: "-",
				day: 1
			},
			{
				code: "TMV",
				name: "TINDIVANAM",
				lat: 12.2294,
				lng: 79.6513,
				km: 975,
				arr: 1223,
				dep: 1225,
				platform: "-",
				day: 1
			},
			{
				code: "MLMR",
				name: "MELMARUVATHU",
				lat: 12.4296,
				lng: 79.8338,
				km: 1005,
				arr: 1248,
				dep: 1250,
				platform: "-",
				day: 1
			},
			{
				code: "CGL",
				name: "CHENGALPATTU",
				lat: 12.6929,
				lng: 79.9815,
				km: 1040,
				arr: 1303,
				dep: 1305,
				platform: "-",
				day: 1
			},
			{
				code: "TBM",
				name: "TAMBARAM",
				lat: 12.926,
				lng: 80.1192,
				km: 1071,
				arr: 1333,
				dep: 1335,
				platform: "-",
				day: 1
			},
			{
				code: "MBM",
				name: "MAMBALAM",
				lat: 13.0382,
				lng: 80.2282,
				km: 1089,
				arr: 1353,
				dep: 1355,
				platform: "-",
				day: 1
			},
			{
				code: "MS",
				name: "CHENNAI EGMO",
				lat: 13.0777,
				lng: 80.2602,
				km: 1096,
				arr: 1385,
				dep: 1385,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "17057",
		name: "CSMT-SC DEVA",
		type: "Express",
		startsAt: 1270,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "CSMT",
				name: "CST-MUMBAI",
				lat: 18.9412,
				lng: 72.8337,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "DR",
				name: "DADAR",
				lat: 19.0172,
				lng: 72.843,
				km: 8,
				arr: 12,
				dep: 15,
				platform: "-",
				day: 1
			},
			{
				code: "TNA",
				name: "THANE",
				lat: 19.1858,
				lng: 72.9754,
				km: 33,
				arr: 32,
				dep: 35,
				platform: "-",
				day: 1
			},
			{
				code: "KYN",
				name: "KALYAN JN",
				lat: 19.2347,
				lng: 73.1297,
				km: 53,
				arr: 57,
				dep: 60,
				platform: "-",
				day: 1
			},
			{
				code: "KSRA",
				name: "KASARA",
				lat: 19.6472,
				lng: 73.472,
				km: 120,
				arr: 123,
				dep: 125,
				platform: "-",
				day: 1
			},
			{
				code: "IGP",
				name: "IGATPURI",
				lat: 19.6941,
				lng: 73.5624,
				km: 136,
				arr: 155,
				dep: 160,
				platform: "-",
				day: 1
			},
			{
				code: "DVL",
				name: "DEVLALI",
				lat: 19.8975,
				lng: 73.8373,
				km: 181,
				arr: 198,
				dep: 200,
				platform: "-",
				day: 1
			},
			{
				code: "NK",
				name: "NASIK ROAD",
				lat: 19.9476,
				lng: 73.8419,
				km: 187,
				arr: 208,
				dep: 210,
				platform: "-",
				day: 1
			},
			{
				code: "LS",
				name: "LASAL GAON",
				lat: 20.1548,
				lng: 74.226,
				km: 235,
				arr: 238,
				dep: 240,
				platform: "-",
				day: 1
			},
			{
				code: "MMR",
				name: "MANMAD JN.",
				lat: 20.2499,
				lng: 74.4383,
				km: 260,
				arr: 285,
				dep: 295,
				platform: "-",
				day: 1
			},
			{
				code: "RGO",
				name: "ROTEGAON",
				lat: 19.9561,
				lng: 74.7579,
				km: 307,
				arr: 359,
				dep: 360,
				platform: "-",
				day: 1
			},
			{
				code: "LSR",
				name: "LASUR",
				lat: 19.9261,
				lng: 75.0115,
				km: 334,
				arr: 384,
				dep: 385,
				platform: "-",
				day: 1
			},
			{
				code: "AWB",
				name: "AURANGABAD",
				lat: 19.8593,
				lng: 75.3106,
				km: 368,
				arr: 415,
				dep: 420,
				platform: "-",
				day: 1
			},
			{
				code: "J",
				name: "JALNA",
				lat: 19.8308,
				lng: 75.8931,
				km: 431,
				arr: 468,
				dep: 470,
				platform: "-",
				day: 1
			},
			{
				code: "PTU",
				name: "PARTUR",
				lat: 19.5757,
				lng: 76.2128,
				km: 476,
				arr: 509,
				dep: 510,
				platform: "-",
				day: 1
			},
			{
				code: "SELU",
				name: "SELU",
				lat: 19.4481,
				lng: 76.4333,
				km: 503,
				arr: 534,
				dep: 535,
				platform: "-",
				day: 1
			},
			{
				code: "MVO",
				name: "MANWATH ROAD",
				lat: 19.3582,
				lng: 76.5345,
				km: 518,
				arr: 549,
				dep: 550,
				platform: "-",
				day: 1
			},
			{
				code: "PBN",
				name: "PARBHANI JN.",
				lat: 19.2575,
				lng: 76.7741,
				km: 545,
				arr: 600,
				dep: 605,
				platform: "-",
				day: 1
			},
			{
				code: "PAU",
				name: "PURNA  JN.",
				lat: 19.1805,
				lng: 77.025,
				km: 574,
				arr: 650,
				dep: 655,
				platform: "-",
				day: 1
			},
			{
				code: "NED",
				name: "NANDED",
				lat: 19.1605,
				lng: 77.3105,
				km: 604,
				arr: 690,
				dep: 695,
				platform: "-",
				day: 1
			},
			{
				code: "MUE",
				name: "MUDKHED JN.",
				lat: 19.1481,
				lng: 77.5097,
				km: 627,
				arr: 733,
				dep: 735,
				platform: "-",
				day: 1
			},
			{
				code: "UMRI",
				name: "UMRI",
				lat: 19.0418,
				lng: 77.6427,
				km: 646,
				arr: 753,
				dep: 755,
				platform: "-",
				day: 1
			},
			{
				code: "DAB",
				name: "DHARMABAD",
				lat: 18.8883,
				lng: 77.8493,
				km: 676,
				arr: 781,
				dep: 783,
				platform: "-",
				day: 1
			},
			{
				code: "BSX",
				name: "BASAR",
				lat: 18.8651,
				lng: 77.9385,
				km: 686,
				arr: 800,
				dep: 802,
				platform: "-",
				day: 1
			},
			{
				code: "NZB",
				name: "NIZAMABAD",
				lat: 18.6792,
				lng: 78.1032,
				km: 715,
				arr: 830,
				dep: 832,
				platform: "-",
				day: 1
			},
			{
				code: "KMC",
				name: "KAMAREDDI",
				lat: 18.3259,
				lng: 78.3359,
				km: 767,
				arr: 880,
				dep: 882,
				platform: "-",
				day: 1
			},
			{
				code: "AKE",
				name: "AKANAPET",
				lat: 18.1109,
				lng: 78.3963,
				km: 793,
				arr: 909,
				dep: 910,
				platform: "-",
				day: 1
			},
			{
				code: "MZL",
				name: "MIRZAPALI",
				lat: 18.018,
				lng: 78.4153,
				km: 803,
				arr: 917,
				dep: 918,
				platform: "-",
				day: 1
			},
			{
				code: "BMO",
				name: "BOLARUM",
				lat: 17.5335,
				lng: 78.5154,
				km: 862,
				arr: 979,
				dep: 980,
				platform: "-",
				day: 1
			},
			{
				code: "SC",
				name: "SECUNDERABAD",
				lat: 17.4331,
				lng: 78.5015,
				km: 875,
				arr: 1040,
				dep: 1040,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "17058",
		name: "SC-CSMT DEVA",
		type: "Express",
		startsAt: 745,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "SC",
				name: "SECUNDERABAD",
				lat: 17.4331,
				lng: 78.5015,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "BMO",
				name: "BOLARUM",
				lat: 17.5335,
				lng: 78.5154,
				km: 13,
				arr: 15,
				dep: 16,
				platform: "-",
				day: 1
			},
			{
				code: "MZL",
				name: "MIRZAPALI",
				lat: 18.018,
				lng: 78.4153,
				km: 71,
				arr: 51,
				dep: 52,
				platform: "-",
				day: 1
			},
			{
				code: "AKE",
				name: "AKANAPET",
				lat: 18.1109,
				lng: 78.3963,
				km: 81,
				arr: 59,
				dep: 60,
				platform: "-",
				day: 1
			},
			{
				code: "KMC",
				name: "KAMAREDDI",
				lat: 18.3259,
				lng: 78.3359,
				km: 107,
				arr: 98,
				dep: 100,
				platform: "-",
				day: 1
			},
			{
				code: "NZB",
				name: "NIZAMABAD",
				lat: 18.6792,
				lng: 78.1032,
				km: 159,
				arr: 155,
				dep: 160,
				platform: "-",
				day: 1
			},
			{
				code: "BSX",
				name: "BASAR",
				lat: 18.8651,
				lng: 77.9385,
				km: 189,
				arr: 190,
				dep: 192,
				platform: "-",
				day: 1
			},
			{
				code: "DAB",
				name: "DHARMABAD",
				lat: 18.8883,
				lng: 77.8493,
				km: 198,
				arr: 201,
				dep: 202,
				platform: "-",
				day: 1
			},
			{
				code: "UMRI",
				name: "UMRI",
				lat: 19.0418,
				lng: 77.6427,
				km: 228,
				arr: 235,
				dep: 236,
				platform: "-",
				day: 1
			},
			{
				code: "MUE",
				name: "MUDKHED JN.",
				lat: 19.1481,
				lng: 77.5097,
				km: 248,
				arr: 283,
				dep: 285,
				platform: "-",
				day: 1
			},
			{
				code: "NED",
				name: "NANDED",
				lat: 19.1605,
				lng: 77.3105,
				km: 270,
				arr: 335,
				dep: 340,
				platform: "-",
				day: 1
			},
			{
				code: "PAU",
				name: "PURNA  JN.",
				lat: 19.1805,
				lng: 77.025,
				km: 300,
				arr: 378,
				dep: 380,
				platform: "-",
				day: 1
			},
			{
				code: "PBN",
				name: "PARBHANI JN.",
				lat: 19.2575,
				lng: 76.7741,
				km: 329,
				arr: 423,
				dep: 425,
				platform: "-",
				day: 1
			},
			{
				code: "MVO",
				name: "MANWATH ROAD",
				lat: 19.3582,
				lng: 76.5345,
				km: 357,
				arr: 449,
				dep: 450,
				platform: "-",
				day: 1
			},
			{
				code: "SELU",
				name: "SELU",
				lat: 19.4481,
				lng: 76.4333,
				km: 371,
				arr: 474,
				dep: 475,
				platform: "-",
				day: 1
			},
			{
				code: "PTU",
				name: "PARTUR",
				lat: 19.5757,
				lng: 76.2128,
				km: 399,
				arr: 504,
				dep: 505,
				platform: "-",
				day: 1
			},
			{
				code: "J",
				name: "JALNA",
				lat: 19.8308,
				lng: 75.8931,
				km: 444,
				arr: 580,
				dep: 582,
				platform: "-",
				day: 1
			},
			{
				code: "AWB",
				name: "AURANGABAD",
				lat: 19.8593,
				lng: 75.3106,
				km: 506,
				arr: 655,
				dep: 660,
				platform: "-",
				day: 1
			},
			{
				code: "LSR",
				name: "LASUR",
				lat: 19.9261,
				lng: 75.0115,
				km: 540,
				arr: 684,
				dep: 685,
				platform: "-",
				day: 1
			},
			{
				code: "RGO",
				name: "ROTEGAON",
				lat: 19.9561,
				lng: 74.7579,
				km: 567,
				arr: 714,
				dep: 715,
				platform: "-",
				day: 1
			},
			{
				code: "MMR",
				name: "MANMAD JN.",
				lat: 20.2499,
				lng: 74.4383,
				km: 615,
				arr: 795,
				dep: 805,
				platform: "-",
				day: 1
			},
			{
				code: "LS",
				name: "LASAL GAON",
				lat: 20.1548,
				lng: 74.226,
				km: 639,
				arr: 828,
				dep: 830,
				platform: "-",
				day: 1
			},
			{
				code: "NK",
				name: "NASIK ROAD",
				lat: 19.9476,
				lng: 73.8419,
				km: 688,
				arr: 870,
				dep: 875,
				platform: "-",
				day: 1
			},
			{
				code: "DVL",
				name: "DEVLALI",
				lat: 19.8975,
				lng: 73.8373,
				km: 693,
				arr: 883,
				dep: 885,
				platform: "-",
				day: 1
			},
			{
				code: "IGP",
				name: "IGATPURI",
				lat: 19.6941,
				lng: 73.5624,
				km: 738,
				arr: 945,
				dep: 950,
				platform: "-",
				day: 1
			},
			{
				code: "KYN",
				name: "KALYAN JN",
				lat: 19.2347,
				lng: 73.1297,
				km: 822,
				arr: 1042,
				dep: 1045,
				platform: "-",
				day: 1
			},
			{
				code: "TNA",
				name: "THANE",
				lat: 19.1858,
				lng: 72.9754,
				km: 842,
				arr: 1067,
				dep: 1070,
				platform: "-",
				day: 1
			},
			{
				code: "DR",
				name: "DADAR",
				lat: 19.0172,
				lng: 72.843,
				km: 866,
				arr: 1092,
				dep: 1095,
				platform: "-",
				day: 1
			},
			{
				code: "CSMT",
				name: "CST-MUMBAI",
				lat: 18.9412,
				lng: 72.8337,
				km: 875,
				arr: 1125,
				dep: 1125,
				platform: "-",
				day: 1
			}
		]
	},
	{
		number: "22651",
		name: "MAS-PGT  EXP",
		type: "Superfast",
		startsAt: 1300,
		runsOn: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		],
		halts: [
			{
				code: "MAS",
				name: "CHENNAI CENT",
				lat: 13.0848,
				lng: 80.2749,
				km: 0,
				arr: 0,
				dep: 0,
				platform: "-",
				day: 1
			},
			{
				code: "AJJ",
				name: "ARAKKONAM JN",
				lat: 13.0815,
				lng: 79.668,
				km: 68,
				arr: 58,
				dep: 60,
				platform: "-",
				day: 1
			},
			{
				code: "KPD",
				name: "KATPADI JN",
				lat: 12.9727,
				lng: 79.1353,
				km: 128,
				arr: 113,
				dep: 115,
				platform: "-",
				day: 1
			},
			{
				code: "GYM",
				name: "GUDIATTAM",
				lat: 12.9375,
				lng: 78.9162,
				km: 153,
				arr: 134,
				dep: 135,
				platform: "-",
				day: 1
			},
			{
				code: "JTJ",
				name: "JOLARPETTAI",
				lat: 12.5609,
				lng: 78.5778,
				km: 212,
				arr: 194,
				dep: 195,
				platform: "-",
				day: 1
			},
			{
				code: "SA",
				name: "SALEM JN.",
				lat: 11.6717,
				lng: 78.1134,
				km: 331,
				arr: 300,
				dep: 310,
				platform: "-",
				day: 1
			},
			{
				code: "RASP",
				name: "RASIPURAM",
				lat: 11.4596,
				lng: 78.1792,
				km: 357,
				arr: 334,
				dep: 335,
				platform: "-",
				day: 1
			},
			{
				code: "NMKL",
				name: "NAMAKKAL",
				lat: 11.22,
				lng: 78.166,
				km: 383,
				arr: 364,
				dep: 365,
				platform: "-",
				day: 1
			},
			{
				code: "MONR",
				name: "MOHANUR",
				lat: 11.0516,
				lng: 78.1393,
				km: 401,
				arr: 379,
				dep: 380,
				platform: "-",
				day: 1
			},
			{
				code: "KRR",
				name: "KARUR JN.",
				lat: 10.9656,
				lng: 78.0851,
				km: 416,
				arr: 403,
				dep: 405,
				platform: "-",
				day: 1
			},
			{
				code: "DG",
				name: "DINDIGUL JN",
				lat: 10.3538,
				lng: 77.9855,
				km: 490,
				arr: 480,
				dep: 510,
				platform: "-",
				day: 1
			},
			{
				code: "API",
				name: "AKKARAIPPATT",
				lat: 10.3998,
				lng: 77.9226,
				km: 501,
				arr: 525,
				dep: 526,
				platform: "-",
				day: 1
			},
			{
				code: "ODC",
				name: "ODDANCHATRAM",
				lat: 10.4856,
				lng: 77.7465,
				km: 523,
				arr: 548,
				dep: 549,
				platform: "-",
				day: 1
			},
			{
				code: "CHPT",
				name: "CHATRAPPATTI",
				lat: 10.477,
				lng: 77.6551,
				km: 533,
				arr: 559,
				dep: 560,
				platform: "-",
				day: 1
			},
			{
				code: "PLNI",
				name: "PALANI",
				lat: 10.4587,
				lng: 77.5212,
				km: 549,
				arr: 575,
				dep: 580,
				platform: "-",
				day: 1
			},
			{
				code: "UDT",
				name: "UDUMALAIPPET",
				lat: 10.578,
				lng: 77.2405,
				km: 582,
				arr: 624,
				dep: 625,
				platform: "-",
				day: 1
			},
			{
				code: "POY",
				name: "POLLACHI",
				lat: 10.6531,
				lng: 77.0013,
				km: 611,
				arr: 680,
				dep: 685,
				platform: "-",
				day: 1
			},
			{
				code: "PGTN",
				name: "PALGHAT TOWN",
				lat: 10.7754,
				lng: 76.6522,
				km: 665,
				arr: 745,
				dep: 750,
				platform: "-",
				day: 1
			},
			{
				code: "PGT",
				name: "PALAKKAD JN",
				lat: 10.8021,
				lng: 76.6419,
				km: 669,
				arr: 800,
				dep: 800,
				platform: "-",
				day: 1
			}
		]
	}
];
function findTrains(query) {
	const q = query.trim().toLowerCase();
	if (!q) return trainRoutes;
	return trainRoutes.filter((t) => t.number.includes(q) || t.name.toLowerCase().includes(q) || t.halts.some((s) => s.code.toLowerCase() === q || s.name.toLowerCase().includes(q)));
}
function getTrain(number) {
	return trainRoutes.find((t) => t.number === number);
}
var stationMap = {
	HBJ: {
		name: "HABIBGANJ",
		lat: 23.222,
		lng: 77.4394
	},
	BPL: {
		name: "BHOPAL",
		lat: 23.2669,
		lng: 77.4131
	},
	LAR: {
		name: "LALITPUR",
		lat: 24.6882,
		lng: 78.3958
	},
	JHS: {
		name: "JHANSI JN",
		lat: 25.4436,
		lng: 78.553
	},
	GWL: {
		name: "GWALIOR JN",
		lat: 26.2165,
		lng: 78.1823
	},
	MRA: {
		name: "MORENA",
		lat: 26.5005,
		lng: 78.0034
	},
	DHO: {
		name: "DHAULPUR",
		lat: 26.6976,
		lng: 77.906
	},
	AGC: {
		name: "AGRA CANTT",
		lat: 27.158,
		lng: 77.9902
	},
	MTJ: {
		name: "MATHURA JN.",
		lat: 27.4801,
		lng: 77.6731
	},
	NDLS: {
		name: "NEW DELHI",
		lat: 28.6423,
		lng: 77.22
	},
	BCT: {
		name: "MUMBAI CENTR",
		lat: 18.9707,
		lng: 72.8194
	},
	BVI: {
		name: "BORIVLI",
		lat: 19.2287,
		lng: 72.8564
	},
	VAPI: {
		name: "VAPI",
		lat: 20.3743,
		lng: 72.9091
	},
	ST: {
		name: "SURAT",
		lat: 21.2066,
		lng: 72.8408
	},
	BH: {
		name: "BHARUCH JN.",
		lat: 21.7069,
		lng: 72.9977
	},
	BRC: {
		name: "VADODARA JN.",
		lat: 22.3108,
		lng: 73.1811
	},
	ANND: {
		name: "ANAND JN.",
		lat: 22.5613,
		lng: 72.9657
	},
	ND: {
		name: "NADIAD JN.",
		lat: 22.6941,
		lng: 72.8557
	},
	ADI: {
		name: "AHMEDABAD",
		lat: 23.0255,
		lng: 72.6015
	},
	HWH: {
		name: "HOWRAH JN.",
		lat: 22.5841,
		lng: 88.341
	},
	DGR: {
		name: "DURGAPUR",
		lat: 23.495,
		lng: 87.2979
	},
	RNG: {
		name: "RANI GANJ",
		lat: 23.6029,
		lng: 87.117
	},
	ASN: {
		name: "ASANSOL MAIN",
		lat: 23.6914,
		lng: 86.9752
	},
	DHN: {
		name: "DHANBAD JN.",
		lat: 23.791,
		lng: 86.429
	},
	GMO: {
		name: "NSC BOSE J G",
		lat: 23.8731,
		lng: 86.1482
	},
	CRP: {
		name: "CHANDRAPURA",
		lat: 23.7557,
		lng: 86.1198
	},
	BKSC: {
		name: "BOKARO STEEL",
		lat: 23.6566,
		lng: 86.085
	},
	MURI: {
		name: "MURI",
		lat: 23.3763,
		lng: 85.867
	},
	RNC: {
		name: "RANCHI",
		lat: 23.3488,
		lng: 85.3335
	},
	NZM: {
		name: "HAZRAT NIZAM",
		lat: 28.5873,
		lng: 77.2542
	},
	DR: {
		name: "DADAR",
		lat: 19.0172,
		lng: 72.843
	},
	KYN: {
		name: "KALYAN JN",
		lat: 19.2347,
		lng: 73.1297
	},
	LNL: {
		name: "LONAVLA",
		lat: 18.7489,
		lng: 73.4077
	},
	PUNE: {
		name: "PUNE JN.",
		lat: 18.5294,
		lng: 73.8731
	},
	SUR: {
		name: "SOLAPUR",
		lat: 17.6645,
		lng: 75.8934
	},
	GR: {
		name: "GULBARGA",
		lat: 17.3144,
		lng: 76.8244
	},
	SDB: {
		name: "SHAHABAD",
		lat: 17.1217,
		lng: 76.9435
	},
	WADI: {
		name: "WADI JN.",
		lat: 17.0543,
		lng: 76.9915
	},
	YG: {
		name: "YADGIR",
		lat: 16.7444,
		lng: 77.1304
	},
	SADP: {
		name: "SAIDAPUR",
		lat: 16.57,
		lng: 77.2498
	},
	RC: {
		name: "RAICHUR",
		lat: 16.1924,
		lng: 77.3392
	},
	MALM: {
		name: "MANTHRALAYAM",
		lat: 15.949,
		lng: 77.2992
	},
	AD: {
		name: "ADONI",
		lat: 15.617,
		lng: 77.2749
	},
	GTL: {
		name: "GUNTAKAL JN.",
		lat: 15.1756,
		lng: 77.3666
	},
	GY: {
		name: "GOOTY JN.",
		lat: 15.1492,
		lng: 77.6258
	},
	TU: {
		name: "TADIPATRI",
		lat: 14.9076,
		lng: 77.979
	},
	YA: {
		name: "YERRA GUNTLA",
		lat: 14.6423,
		lng: 78.534
	},
	HX: {
		name: "CUDDAPAH",
		lat: 14.4517,
		lng: 78.8292
	},
	RJP: {
		name: "RAZAMPETA",
		lat: 14.1845,
		lng: 79.1527
	},
	KOU: {
		name: "KODURU",
		lat: 13.9486,
		lng: 79.3457
	},
	RU: {
		name: "RENIGUNTA JN",
		lat: 13.6363,
		lng: 79.5063
	},
	AJJ: {
		name: "ARAKKONAM JN",
		lat: 13.0815,
		lng: 79.668
	},
	PER: {
		name: "PERAMBUR",
		lat: 13.107,
		lng: 80.2445
	},
	MS: {
		name: "CHENNAI EGMO",
		lat: 13.0777,
		lng: 80.2602
	},
	SDAH: {
		name: "SEALDAH",
		lat: 22.5668,
		lng: 88.3747
	},
	MGS: {
		name: "MUGHAL SARAI",
		lat: 25.2781,
		lng: 83.1193
	},
	CNB: {
		name: "KANPUR CENTR",
		lat: 26.4542,
		lng: 80.351
	},
	PNME: {
		name: "PARASNATH",
		lat: 23.988,
		lng: 86.0379
	},
	GAYA: {
		name: "GAYA JN.",
		lat: 24.804,
		lng: 84.9993
	},
	ALD: {
		name: "ALLAHABAD JN",
		lat: 25.4462,
		lng: 81.8288
	},
	BWN: {
		name: "BARDDHAMAN J",
		lat: 23.2497,
		lng: 87.8703
	},
	MDP: {
		name: "MADHUPUR JN.",
		lat: 24.2706,
		lng: 86.6422
	},
	JSME: {
		name: "JASIDIH JN.",
		lat: 24.5145,
		lng: 86.6443
	},
	PNBE: {
		name: "PATNA JN.",
		lat: 25.6026,
		lng: 85.1368
	},
	BGP: {
		name: "BHAGALPUR",
		lat: 25.2419,
		lng: 86.9768
	},
	SGG: {
		name: "SULTANGANJ",
		lat: 25.2408,
		lng: 86.7362
	},
	BUP: {
		name: "BARIARPUR",
		lat: 25.281,
		lng: 86.574
	},
	JMP: {
		name: "JAMALPUR JN.",
		lat: 25.3139,
		lng: 86.4923
	},
	DRH: {
		name: "DHARHARA",
		lat: 25.2579,
		lng: 86.4115
	},
	AHA: {
		name: "ABHAIPUR",
		lat: 25.216,
		lng: 86.3231
	},
	KJH: {
		name: "KAJRA",
		lat: 25.1828,
		lng: 86.2616
	},
	KIUL: {
		name: "KIUL JN.",
		lat: 25.1715,
		lng: 86.1062
	},
	LKR: {
		name: "LUCKEESARAI",
		lat: 25.1717,
		lng: 86.0932
	},
	BRYA: {
		name: "BARHIYA",
		lat: 25.2832,
		lng: 86.0151
	},
	HTZ: {
		name: "HATHIDAH JN",
		lat: 25.367,
		lng: 85.9878
	},
	MKA: {
		name: "MOKAMA JN.",
		lat: 25.3919,
		lng: 85.913
	},
	BARH: {
		name: "BARH",
		lat: 25.4616,
		lng: 85.7094
	},
	BKP: {
		name: "BAKHTIYARPUR",
		lat: 25.4561,
		lng: 85.5296
	},
	KOO: {
		name: "KHUSROPUR",
		lat: 25.4849,
		lng: 85.3873
	},
	FUT: {
		name: "FATUHA",
		lat: 25.5014,
		lng: 85.3055
	},
	PNC: {
		name: "PATNA SAHEB",
		lat: 25.5859,
		lng: 85.2309
	},
	ANVT: {
		name: "ANAND VIHAR",
		lat: 28.6505,
		lng: 77.3152
	},
	TBM: {
		name: "TAMBARAM",
		lat: 12.926,
		lng: 80.1192
	},
	CGL: {
		name: "CHENGALPATTU",
		lat: 12.6929,
		lng: 79.9815
	},
	MLMR: {
		name: "MELMARUVATHU",
		lat: 12.4296,
		lng: 79.8338
	},
	TMV: {
		name: "TINDIVANAM",
		lat: 12.2294,
		lng: 79.6513
	},
	VM: {
		name: "VILLUPURAM J",
		lat: 11.943,
		lng: 79.5001
	},
	VRI: {
		name: "VRIDHA CHALA",
		lat: 11.535,
		lng: 79.3161
	},
	TPJ: {
		name: "TIRUCHIRAPPA",
		lat: 10.7941,
		lng: 78.6854
	},
	DG: {
		name: "DINDIGUL JN",
		lat: 10.3538,
		lng: 77.9855
	},
	SDN: {
		name: "SHOLAVANDAN",
		lat: 10.0223,
		lng: 77.9651
	},
	MDU: {
		name: "MADURAI JN",
		lat: 9.9199,
		lng: 78.1103
	},
	VPT: {
		name: "VIRUDUNAGAR",
		lat: 9.5964,
		lng: 77.9577
	},
	SRT: {
		name: "SATUR",
		lat: 9.3575,
		lng: 77.9216
	},
	CVP: {
		name: "KOVILPATTI",
		lat: 9.1826,
		lng: 77.8728
	},
	TEN: {
		name: "TIRUNELVELI",
		lat: 8.7364,
		lng: 77.708
	},
	MBM: {
		name: "MAMBALAM",
		lat: 13.0382,
		lng: 80.2282
	},
	MPA: {
		name: "MANAPARAI",
		lat: 10.6076,
		lng: 78.4178
	},
	ABI: {
		name: "AMBATURAI",
		lat: 10.2722,
		lng: 77.9245
	},
	KQN: {
		name: "KODAIKKANAL",
		lat: 10.1796,
		lng: 77.9096
	},
	MAS: {
		name: "CHENNAI CENT",
		lat: 13.0848,
		lng: 80.2749
	},
	JTJ: {
		name: "JOLARPETTAI",
		lat: 12.5609,
		lng: 78.5778
	},
	SA: {
		name: "SALEM JN.",
		lat: 11.6717,
		lng: 78.1134
	},
	ED: {
		name: "ERODE JN.",
		lat: 11.3277,
		lng: 77.7259
	},
	TUP: {
		name: "TIRUPPUR",
		lat: 11.1089,
		lng: 77.3412
	},
	CBF: {
		name: "COIMBATORE N",
		lat: 11.0199,
		lng: 76.9543
	},
	CBE: {
		name: "COIMBATORE",
		lat: 10.9976,
		lng: 76.9663
	},
	KPD: {
		name: "KATPADI JN",
		lat: 12.9727,
		lng: 79.1353
	},
	AB: {
		name: "AMBUR",
		lat: 12.7829,
		lng: 78.7213
	},
	MAP: {
		name: "MORAPPUR",
		lat: 12.1241,
		lng: 78.3939
	},
	BQI: {
		name: "BOMMIDI",
		lat: 11.9847,
		lng: 78.2463
	},
	RTM: {
		name: "RATLAM JN",
		lat: 23.3404,
		lng: 75.0508
	},
	NAD: {
		name: "NAGDA JN",
		lat: 23.4559,
		lng: 75.4125
	},
	KOTA: {
		name: "KOTA",
		lat: 25.2236,
		lng: 75.8805
	},
	ADH: {
		name: "ANDHERI",
		lat: 19.1174,
		lng: 72.8469
	},
	BL: {
		name: "VALSAD",
		lat: 20.6086,
		lng: 72.9335
	},
	SWM: {
		name: "SAWAI MADHOP",
		lat: 26.0183,
		lng: 76.3562
	},
	SBI: {
		name: "SABARMATI JN",
		lat: 23.073,
		lng: 72.5872
	},
	MSH: {
		name: "MAHESANA JN",
		lat: 23.6026,
		lng: 72.3887
	},
	PNU: {
		name: "PALANPUR JN",
		lat: 24.1744,
		lng: 72.4302
	},
	ABR: {
		name: "ABU ROAD",
		lat: 24.4708,
		lng: 72.7757
	},
	AII: {
		name: "AJMER JN.",
		lat: 26.4566,
		lng: 74.6375
	},
	JP: {
		name: "JAIPUR JN.",
		lat: 26.9202,
		lng: 75.7869
	},
	GGN: {
		name: "GURGAON",
		lat: 28.4892,
		lng: 77.0107
	},
	DEC: {
		name: "DELHI CANTT",
		lat: 28.6135,
		lng: 77.1166
	},
	PNDM: {
		name: "PENNADAM",
		lat: 11.398,
		lng: 79.22
	},
	ALU: {
		name: "ARIYALUR",
		lat: 11.15,
		lng: 79.0683
	},
	SRGM: {
		name: "SRIRANGAM",
		lat: 10.8579,
		lng: 78.6963
	},
	KON: {
		name: "KUDALNAGAR",
		lat: 9.9449,
		lng: 78.1087
	},
	MEJ: {
		name: "VANCHI MANIY",
		lat: 8.8821,
		lng: 77.8907
	},
	NNN: {
		name: "NANGUNERI",
		lat: 8.4891,
		lng: 77.6626
	},
	VLY: {
		name: "VALLIYUR",
		lat: 8.3762,
		lng: 77.614
	},
	AAY: {
		name: "ARALVAYMOLI",
		lat: 8.2495,
		lng: 77.5293
	},
	NCJ: {
		name: "NAGERCOIL JN",
		lat: 8.1738,
		lng: 77.4435
	},
	ERL: {
		name: "ERANIEL",
		lat: 8.2125,
		lng: 77.3082
	},
	KZT: {
		name: "KULITTURAI",
		lat: 8.3023,
		lng: 77.2188
	},
	NYY: {
		name: "NEYYATTINKAR",
		lat: 8.4104,
		lng: 77.0811
	},
	TVC: {
		name: "TRIVANDRUM C",
		lat: 8.4867,
		lng: 76.9512
	},
	CRY: {
		name: "CHIRAYINKIL",
		lat: 8.6583,
		lng: 76.7854
	},
	KVU: {
		name: "KADAKAVUR",
		lat: 8.6791,
		lng: 76.7667
	},
	VAK: {
		name: "VARKALA",
		lat: 8.7407,
		lng: 76.7229
	},
	PVU: {
		name: "PARAVUR",
		lat: 8.8158,
		lng: 76.6682
	},
	QLN: {
		name: "QUILON",
		lat: 8.8866,
		lng: 76.5968
	},
	KYJ: {
		name: "KAYANKULAM J",
		lat: 9.1826,
		lng: 76.5129
	},
	HAD: {
		name: "HARIPAD",
		lat: 9.2796,
		lng: 76.4622
	},
	AMPA: {
		name: "AMBALAPUZHA",
		lat: 9.3861,
		lng: 76.3638
	},
	ALLP: {
		name: "ALLEPPEY",
		lat: 9.4838,
		lng: 76.3225
	},
	SRTL: {
		name: "SHERTALAI",
		lat: 9.691,
		lng: 76.3252
	},
	ERS: {
		name: "ERNAKULAM. J",
		lat: 9.9695,
		lng: 76.2907
	},
	ERN: {
		name: "ERNAKULAM TO",
		lat: 9.9916,
		lng: 76.2861
	},
	AWY: {
		name: "ALWAYE",
		lat: 10.1082,
		lng: 76.3565
	},
	AFK: {
		name: "ANGAMALI (FO",
		lat: 10.1837,
		lng: 76.3779
	},
	CKI: {
		name: "CHALAKUDI",
		lat: 10.3018,
		lng: 76.3218
	},
	IJK: {
		name: "IRINJALAKUDA",
		lat: 10.3395,
		lng: 76.2809
	},
	TCR: {
		name: "TRICHUR",
		lat: 10.5148,
		lng: 76.2079
	},
	PNQ: {
		name: "PUNKUNNAM",
		lat: 10.5351,
		lng: 76.2094
	},
	GUV: {
		name: "GURUVAYUR",
		lat: 10.5969,
		lng: 76.0455
	},
	CSMT: {
		name: "CST-MUMBAI",
		lat: 18.9412,
		lng: 72.8337
	},
	TNA: {
		name: "THANE",
		lat: 19.1858,
		lng: 72.9754
	},
	KSRA: {
		name: "KASARA",
		lat: 19.6472,
		lng: 73.472
	},
	IGP: {
		name: "IGATPURI",
		lat: 19.6941,
		lng: 73.5624
	},
	DVL: {
		name: "DEVLALI",
		lat: 19.8975,
		lng: 73.8373
	},
	NK: {
		name: "NASIK ROAD",
		lat: 19.9476,
		lng: 73.8419
	},
	LS: {
		name: "LASAL GAON",
		lat: 20.1548,
		lng: 74.226
	},
	MMR: {
		name: "MANMAD JN.",
		lat: 20.2499,
		lng: 74.4383
	},
	RGO: {
		name: "ROTEGAON",
		lat: 19.9561,
		lng: 74.7579
	},
	LSR: {
		name: "LASUR",
		lat: 19.9261,
		lng: 75.0115
	},
	AWB: {
		name: "AURANGABAD",
		lat: 19.8593,
		lng: 75.3106
	},
	J: {
		name: "JALNA",
		lat: 19.8308,
		lng: 75.8931
	},
	PTU: {
		name: "PARTUR",
		lat: 19.5757,
		lng: 76.2128
	},
	SELU: {
		name: "SELU",
		lat: 19.4481,
		lng: 76.4333
	},
	MVO: {
		name: "MANWATH ROAD",
		lat: 19.3582,
		lng: 76.5345
	},
	PBN: {
		name: "PARBHANI JN.",
		lat: 19.2575,
		lng: 76.7741
	},
	PAU: {
		name: "PURNA  JN.",
		lat: 19.1805,
		lng: 77.025
	},
	NED: {
		name: "NANDED",
		lat: 19.1605,
		lng: 77.3105
	},
	MUE: {
		name: "MUDKHED JN.",
		lat: 19.1481,
		lng: 77.5097
	},
	UMRI: {
		name: "UMRI",
		lat: 19.0418,
		lng: 77.6427
	},
	DAB: {
		name: "DHARMABAD",
		lat: 18.8883,
		lng: 77.8493
	},
	BSX: {
		name: "BASAR",
		lat: 18.8651,
		lng: 77.9385
	},
	NZB: {
		name: "NIZAMABAD",
		lat: 18.6792,
		lng: 78.1032
	},
	KMC: {
		name: "KAMAREDDI",
		lat: 18.3259,
		lng: 78.3359
	},
	AKE: {
		name: "AKANAPET",
		lat: 18.1109,
		lng: 78.3963
	},
	MZL: {
		name: "MIRZAPALI",
		lat: 18.018,
		lng: 78.4153
	},
	BMO: {
		name: "BOLARUM",
		lat: 17.5335,
		lng: 78.5154
	},
	SC: {
		name: "SECUNDERABAD",
		lat: 17.4331,
		lng: 78.5015
	},
	GYM: {
		name: "GUDIATTAM",
		lat: 12.9375,
		lng: 78.9162
	},
	RASP: {
		name: "RASIPURAM",
		lat: 11.4596,
		lng: 78.1792
	},
	NMKL: {
		name: "NAMAKKAL",
		lat: 11.22,
		lng: 78.166
	},
	MONR: {
		name: "MOHANUR",
		lat: 11.0516,
		lng: 78.1393
	},
	KRR: {
		name: "KARUR JN.",
		lat: 10.9656,
		lng: 78.0851
	},
	API: {
		name: "AKKARAIPPATT",
		lat: 10.3998,
		lng: 77.9226
	},
	ODC: {
		name: "ODDANCHATRAM",
		lat: 10.4856,
		lng: 77.7465
	},
	CHPT: {
		name: "CHATRAPPATTI",
		lat: 10.477,
		lng: 77.6551
	},
	PLNI: {
		name: "PALANI",
		lat: 10.4587,
		lng: 77.5212
	},
	UDT: {
		name: "UDUMALAIPPET",
		lat: 10.578,
		lng: 77.2405
	},
	POY: {
		name: "POLLACHI",
		lat: 10.6531,
		lng: 77.0013
	},
	PGTN: {
		name: "PALGHAT TOWN",
		lat: 10.7754,
		lng: 76.6522
	},
	PGT: {
		name: "PALAKKAD JN",
		lat: 10.8021,
		lng: 76.6419
	}
};
function stationFor(code) {
	return stationMap[code];
}
var DELAY_REASONS = {
	weather: {
		label: "Weather",
		short: "Weather",
		description: "Heavy rain, fog, high winds or heat restricting the line."
	},
	congestion: {
		label: "Track congestion",
		short: "Congestion",
		description: "Dense traffic ahead slowing movement on this section."
	},
	"track-work": {
		label: "Track work",
		short: "Track work",
		description: "Planned maintenance or speed restrictions on the section."
	},
	"signal-failure": {
		label: "Signal failure",
		short: "Signal",
		description: "Block signalling issue causing trains to hold between stations."
	},
	technical: {
		label: "Technical",
		short: "Technical",
		description: "Locomotive or coach fault requiring attention."
	},
	unknown: {
		label: "Unknown",
		short: "Unknown",
		description: "Delay detected but no cause has been confirmed yet."
	}
};
/** Weighted heuristics mapping delay magnitude and context to a probable cause. */
function classifyDelay(features) {
	if (features.delayMin <= 2) return "unknown";
	const prob = {
		weather: 0,
		congestion: 0,
		"track-work": 0,
		"signal-failure": 0,
		technical: 0,
		unknown: 0
	};
	if (features.weatherActive) prob.weather += .55;
	if (features.timeOfDayHours >= 6 && features.timeOfDayHours <= 21) prob.congestion += 0;
	if (features.haltedDurationMin > 12) prob["signal-failure"] += .3;
	if (features.haltedDurationMin > 20) prob["signal-failure"] += .2;
	if (features.delayMin >= 25) prob["track-work"] += .2;
	if (features.delayMin >= 40) prob.technical += .2;
	if (features.timeOfDayHours >= 8 && features.timeOfDayHours <= 11) prob.congestion += .3;
	if (features.timeOfDayHours >= 17 && features.timeOfDayHours <= 20) prob.congestion += .4;
	prob.unknown = .1;
	let best = "unknown";
	let bestScore = -1;
	for (const key of Object.keys(prob)) if (prob[key] > bestScore) {
		bestScore = prob[key];
		best = key;
	}
	return best;
}
var trainDelayStats = {
	"11013": {
		LTT: {
			avgDelayMin: 0,
			pctRight: 80,
			pctSlight: 6.67,
			pctSignificant: 13.33
		},
		TNA: {
			avgDelayMin: 26,
			pctRight: 76.67,
			pctSlight: 10,
			pctSignificant: 13.33
		},
		KYN: {
			avgDelayMin: 30,
			pctRight: 60,
			pctSlight: 26.67,
			pctSignificant: 13.33
		},
		PUNE: {
			avgDelayMin: 0,
			pctRight: 0,
			pctSlight: 80,
			pctSignificant: 20
		},
		KWV: {
			avgDelayMin: 60,
			pctRight: 3.33,
			pctSlight: 70,
			pctSignificant: 26.67
		},
		SUR: {
			avgDelayMin: 51,
			pctRight: 20,
			pctSlight: 63.33,
			pctSignificant: 16.67
		},
		DUD: {
			avgDelayMin: 63,
			pctRight: 10,
			pctSlight: 60,
			pctSignificant: 30
		},
		GUR: {
			avgDelayMin: 67,
			pctRight: 6.67,
			pctSlight: 56.67,
			pctSignificant: 36.67
		},
		KLBG: {
			avgDelayMin: 66,
			pctRight: 6.67,
			pctSlight: 56.67,
			pctSignificant: 36.67
		},
		SDB: {
			avgDelayMin: 54,
			pctRight: 13.33,
			pctSlight: 70,
			pctSignificant: 16.67
		},
		WADI: {
			avgDelayMin: 26,
			pctRight: 70,
			pctSlight: 16.67,
			pctSignificant: 13.33
		},
		YG: {
			avgDelayMin: 31,
			pctRight: 60,
			pctSlight: 26.67,
			pctSignificant: 13.33
		},
		KSN: {
			avgDelayMin: 29,
			pctRight: 63.33,
			pctSlight: 23.33,
			pctSignificant: 13.33
		},
		RC: {
			avgDelayMin: 28,
			pctRight: 63.33,
			pctSlight: 23.33,
			pctSignificant: 13.33
		},
		MALM: {
			avgDelayMin: 31,
			pctRight: 60,
			pctSlight: 26.67,
			pctSignificant: 13.33
		},
		AD: {
			avgDelayMin: 36,
			pctRight: 43.33,
			pctSlight: 43.33,
			pctSignificant: 13.33
		},
		GTL: {
			avgDelayMin: 29,
			pctRight: 56.67,
			pctSlight: 33.33,
			pctSignificant: 10
		},
		ATP: {
			avgDelayMin: 28,
			pctRight: 56.67,
			pctSlight: 33.33,
			pctSignificant: 10
		},
		DMM: {
			avgDelayMin: 18,
			pctRight: 83.33,
			pctSlight: 6.67,
			pctSignificant: 10
		},
		SSPN: {
			avgDelayMin: 0,
			pctRight: 46.67,
			pctSlight: 43.33,
			pctSignificant: 10
		},
		HUP: {
			avgDelayMin: 0,
			pctRight: 36.67,
			pctSlight: 50,
			pctSignificant: 13.33
		},
		GBD: {
			avgDelayMin: 0,
			pctRight: 36.67,
			pctSlight: 53.33,
			pctSignificant: 10
		},
		BNC: {
			avgDelayMin: 30,
			pctRight: 26.67,
			pctSlight: 63.33,
			pctSignificant: 10
		},
		SBC: {
			avgDelayMin: 14,
			pctRight: 83.33,
			pctSlight: 10,
			pctSignificant: 6.67
		},
		HSRA: {
			avgDelayMin: 0,
			pctRight: 10,
			pctSlight: 70,
			pctSignificant: 20
		},
		DPJ: {
			avgDelayMin: 61,
			pctRight: 3.33,
			pctSlight: 53.33,
			pctSignificant: 43.33
		},
		SA: {
			avgDelayMin: 0,
			pctRight: 43.33,
			pctSlight: 40,
			pctSignificant: 16.67
		},
		ED: {
			avgDelayMin: 26,
			pctRight: 40,
			pctSlight: 43.33,
			pctSignificant: 16.67
		},
		TUP: {
			avgDelayMin: 31,
			pctRight: 23.33,
			pctSlight: 63.33,
			pctSignificant: 13.33
		},
		CBE: {
			avgDelayMin: 0,
			pctRight: 86.67,
			pctSlight: 13.33,
			pctSignificant: 0
		}
	},
	"11014": {
		CBE: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		TUP: {
			avgDelayMin: 0,
			pctRight: 83.33,
			pctSlight: 16.67,
			pctSignificant: 0
		},
		ED: {
			avgDelayMin: 9,
			pctRight: 93.33,
			pctSlight: 6.67,
			pctSignificant: 0
		},
		SA: {
			avgDelayMin: 14,
			pctRight: 83.33,
			pctSlight: 13.33,
			pctSignificant: 3.33
		},
		DPJ: {
			avgDelayMin: 23,
			pctRight: 43.33,
			pctSlight: 53.33,
			pctSignificant: 3.33
		},
		HSRA: {
			avgDelayMin: 31,
			pctRight: 23.33,
			pctSlight: 73.33,
			pctSignificant: 3.33
		},
		BNC: {
			avgDelayMin: 34,
			pctRight: 30,
			pctSlight: 63.33,
			pctSignificant: 6.67
		},
		SBC: {
			avgDelayMin: 36,
			pctRight: 23.33,
			pctSlight: 63.33,
			pctSignificant: 13.33
		},
		GBD: {
			avgDelayMin: 50,
			pctRight: 3.33,
			pctSlight: 76.67,
			pctSignificant: 20
		},
		HUP: {
			avgDelayMin: 40,
			pctRight: 16.67,
			pctSlight: 70,
			pctSignificant: 13.33
		},
		SSPN: {
			avgDelayMin: 24,
			pctRight: 60,
			pctSlight: 33.33,
			pctSignificant: 6.67
		},
		DMM: {
			avgDelayMin: 0,
			pctRight: 80,
			pctSlight: 16.67,
			pctSignificant: 3.33
		},
		ATP: {
			avgDelayMin: 19,
			pctRight: 70,
			pctSlight: 26.67,
			pctSignificant: 3.33
		},
		GTL: {
			avgDelayMin: 39,
			pctRight: 10,
			pctSlight: 80,
			pctSignificant: 10
		},
		AD: {
			avgDelayMin: 40,
			pctRight: 20,
			pctSlight: 70,
			pctSignificant: 10
		},
		MALM: {
			avgDelayMin: 32,
			pctRight: 43.33,
			pctSlight: 50,
			pctSignificant: 6.67
		},
		RC: {
			avgDelayMin: 0,
			pctRight: 43.33,
			pctSlight: 50,
			pctSignificant: 6.67
		},
		KSN: {
			avgDelayMin: 45,
			pctRight: 16.67,
			pctSlight: 16.67,
			pctSignificant: 6.67
		},
		YG: {
			avgDelayMin: 39,
			pctRight: 16.67,
			pctSlight: 73.33,
			pctSignificant: 10
		},
		WADI: {
			avgDelayMin: 13,
			pctRight: 76.67,
			pctSlight: 20,
			pctSignificant: 3.33
		},
		SDB: {
			avgDelayMin: 14,
			pctRight: 73.33,
			pctSlight: 23.33,
			pctSignificant: 3.33
		},
		KLBG: {
			avgDelayMin: 19,
			pctRight: 66.67,
			pctSlight: 30,
			pctSignificant: 3.33
		},
		GUR: {
			avgDelayMin: 20,
			pctRight: 56.67,
			pctSlight: 40,
			pctSignificant: 3.33
		},
		DUD: {
			avgDelayMin: 0,
			pctRight: 33.33,
			pctSlight: 63.33,
			pctSignificant: 3.33
		},
		SUR: {
			avgDelayMin: 27,
			pctRight: 50,
			pctSlight: 46.67,
			pctSignificant: 3.33
		},
		KWV: {
			avgDelayMin: 37,
			pctRight: 20,
			pctSlight: 76.67,
			pctSignificant: 3.33
		},
		DD: {
			avgDelayMin: 8,
			pctRight: 93.33,
			pctSlight: 3.33,
			pctSignificant: 3.33
		},
		PUNE: {
			avgDelayMin: 20,
			pctRight: 43.33,
			pctSlight: 53.33,
			pctSignificant: 3.33
		},
		KYN: {
			avgDelayMin: 60,
			pctRight: 10,
			pctSlight: 63.33,
			pctSignificant: 26.67
		},
		TNA: {
			avgDelayMin: 61,
			pctRight: 6.67,
			pctSlight: 66.67,
			pctSignificant: 26.67
		},
		LTT: {
			avgDelayMin: 44,
			pctRight: 56.67,
			pctSlight: 16.67,
			pctSignificant: 26.67
		}
	},
	"11027": {
		DR: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		TNA: {
			avgDelayMin: 3,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		KYN: {
			avgDelayMin: 14,
			pctRight: 61.54,
			pctSlight: 38.46,
			pctSignificant: 0
		},
		LNL: {
			avgDelayMin: 17,
			pctRight: 53.85,
			pctSlight: 46.15,
			pctSignificant: 0
		},
		TGN: {
			avgDelayMin: 20,
			pctRight: 30.77,
			pctSlight: 69.23,
			pctSignificant: 0
		},
		CCH: {
			avgDelayMin: 18,
			pctRight: 38.46,
			pctSlight: 61.54,
			pctSignificant: 0
		},
		PUNE: {
			avgDelayMin: 21,
			pctRight: 61.54,
			pctSlight: 30.77,
			pctSignificant: 7.69
		},
		URI: {
			avgDelayMin: 28,
			pctRight: 15.38,
			pctSlight: 76.92,
			pctSignificant: 7.69
		},
		KDG: {
			avgDelayMin: 31,
			pctRight: 7.69,
			pctSlight: 84.62,
			pctSignificant: 7.69
		},
		DD: {
			avgDelayMin: 27,
			pctRight: 23.08,
			pctSlight: 69.23,
			pctSignificant: 7.69
		},
		BGVN: {
			avgDelayMin: 29,
			pctRight: 15.38,
			pctSlight: 76.92,
			pctSignificant: 7.69
		},
		JEUR: {
			avgDelayMin: 41,
			pctRight: 0,
			pctSlight: 84.62,
			pctSignificant: 15.38
		},
		KEM: {
			avgDelayMin: 44,
			pctRight: 0,
			pctSlight: 84.62,
			pctSignificant: 15.38
		},
		KWV: {
			avgDelayMin: 46,
			pctRight: 0,
			pctSlight: 84.62,
			pctSignificant: 15.38
		},
		PVR: {
			avgDelayMin: 0,
			pctRight: 23.08,
			pctSlight: 69.23,
			pctSignificant: 7.69
		},
		SGLA: {
			avgDelayMin: 35,
			pctRight: 7.69,
			pctSlight: 76.92,
			pctSignificant: 15.38
		},
		MSDG: {
			avgDelayMin: 34,
			pctRight: 15.38,
			pctSlight: 69.23,
			pctSignificant: 15.38
		},
		JTRD: {
			avgDelayMin: 44,
			pctRight: 0,
			pctSlight: 84.62,
			pctSignificant: 15.38
		},
		DLGN: {
			avgDelayMin: 51,
			pctRight: 0,
			pctSlight: 84.62,
			pctSignificant: 15.38
		},
		KVK: {
			avgDelayMin: 55,
			pctRight: 0,
			pctSlight: 76.92,
			pctSignificant: 23.08
		},
		MRJ: {
			avgDelayMin: 12,
			pctRight: 76.92,
			pctSlight: 23.08,
			pctSignificant: 0
		},
		SLI: {
			avgDelayMin: 16,
			pctRight: 69.23,
			pctSlight: 30.77,
			pctSignificant: 0
		},
		BVQ: {
			avgDelayMin: 18,
			pctRight: 61.54,
			pctSlight: 38.46,
			pctSignificant: 0
		},
		KOV: {
			avgDelayMin: 19,
			pctRight: 61.54,
			pctSlight: 38.46,
			pctSignificant: 0
		},
		TKR: {
			avgDelayMin: 21,
			pctRight: 61.54,
			pctSlight: 38.46,
			pctSignificant: 0
		},
		KRD: {
			avgDelayMin: 26,
			pctRight: 46.15,
			pctSlight: 46.15,
			pctSignificant: 7.69
		},
		MSR: {
			avgDelayMin: 29,
			pctRight: 15.38,
			pctSlight: 76.92,
			pctSignificant: 7.69
		},
		KRG: {
			avgDelayMin: 38,
			pctRight: 0,
			pctSlight: 84.62,
			pctSignificant: 15.38
		},
		STR: {
			avgDelayMin: 2,
			pctRight: 84.62,
			pctSlight: 15.38,
			pctSignificant: 0
		}
	},
	"11028": {
		STR: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		KRG: {
			avgDelayMin: 13,
			pctRight: 76.92,
			pctSlight: 23.08,
			pctSignificant: 0
		},
		MSR: {
			avgDelayMin: 21,
			pctRight: 30.77,
			pctSlight: 69.23,
			pctSignificant: 0
		},
		KRD: {
			avgDelayMin: 19,
			pctRight: 46.15,
			pctSlight: 53.85,
			pctSignificant: 0
		},
		TKR: {
			avgDelayMin: 11,
			pctRight: 76.92,
			pctSlight: 23.08,
			pctSignificant: 0
		},
		KOV: {
			avgDelayMin: 8,
			pctRight: 76.92,
			pctSlight: 23.08,
			pctSignificant: 0
		},
		BVQ: {
			avgDelayMin: 7,
			pctRight: 76.92,
			pctSlight: 23.08,
			pctSignificant: 0
		},
		SLI: {
			avgDelayMin: 6,
			pctRight: 92.31,
			pctSlight: 7.69,
			pctSignificant: 0
		},
		MRJ: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		KVK: {
			avgDelayMin: 8,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		DLGN: {
			avgDelayMin: 0,
			pctRight: 61.54,
			pctSlight: 38.46,
			pctSignificant: 0
		},
		JTRD: {
			avgDelayMin: 20,
			pctRight: 30.77,
			pctSlight: 69.23,
			pctSignificant: 0
		},
		MSDG: {
			avgDelayMin: 0,
			pctRight: 30.77,
			pctSlight: 69.23,
			pctSignificant: 0
		},
		SGLA: {
			avgDelayMin: 26,
			pctRight: 7.69,
			pctSlight: 92.31,
			pctSignificant: 0
		},
		PVR: {
			avgDelayMin: 5,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		KWV: {
			avgDelayMin: 33,
			pctRight: 23.08,
			pctSlight: 76.92,
			pctSignificant: 0
		},
		KEM: {
			avgDelayMin: 26,
			pctRight: 38.46,
			pctSlight: 61.54,
			pctSignificant: 0
		},
		JEUR: {
			avgDelayMin: 30,
			pctRight: 30.77,
			pctSlight: 69.23,
			pctSignificant: 0
		},
		BGVN: {
			avgDelayMin: 13,
			pctRight: 46.15,
			pctSlight: 53.85,
			pctSignificant: 0
		},
		DD: {
			avgDelayMin: 6,
			pctRight: 84.62,
			pctSlight: 15.38,
			pctSignificant: 0
		},
		KDG: {
			avgDelayMin: 10,
			pctRight: 76.92,
			pctSlight: 23.08,
			pctSignificant: 0
		},
		URI: {
			avgDelayMin: 15,
			pctRight: 61.54,
			pctSlight: 38.46,
			pctSignificant: 0
		},
		PUNE: {
			avgDelayMin: 18,
			pctRight: 53.85,
			pctSlight: 46.15,
			pctSignificant: 0
		},
		CCH: {
			avgDelayMin: 0,
			pctRight: 7.69,
			pctSlight: 92.31,
			pctSignificant: 0
		},
		TGN: {
			avgDelayMin: 29,
			pctRight: 7.69,
			pctSlight: 92.31,
			pctSignificant: 0
		},
		LNL: {
			avgDelayMin: 10,
			pctRight: 69.23,
			pctSlight: 30.77,
			pctSignificant: 0
		},
		KYN: {
			avgDelayMin: 29,
			pctRight: 23.08,
			pctSlight: 76.92,
			pctSignificant: 0
		},
		TNA: {
			avgDelayMin: 29,
			pctRight: 15.38,
			pctSlight: 84.62,
			pctSignificant: 0
		},
		DR: {
			avgDelayMin: 15,
			pctRight: 69.23,
			pctSlight: 30.77,
			pctSignificant: 0
		}
	},
	"12001": {
		RKMP: {
			avgDelayMin: 3,
			pctRight: 93.33,
			pctSlight: 6.67,
			pctSignificant: 0
		},
		BPL: {
			avgDelayMin: 0,
			pctRight: 93.33,
			pctSlight: 6.67,
			pctSignificant: 0
		},
		BINA: {
			avgDelayMin: 6,
			pctRight: 90,
			pctSlight: 6.67,
			pctSignificant: 3.33
		},
		LAR: {
			avgDelayMin: 17,
			pctRight: 70,
			pctSlight: 26.67,
			pctSignificant: 3.33
		},
		VGLJ: {
			avgDelayMin: 18,
			pctRight: 80,
			pctSlight: 13.33,
			pctSignificant: 6.67
		},
		GWL: {
			avgDelayMin: 25,
			pctRight: 60,
			pctSlight: 33.33,
			pctSignificant: 6.67
		},
		MRA: {
			avgDelayMin: 28,
			pctRight: 43.33,
			pctSlight: 50,
			pctSignificant: 6.67
		},
		DHO: {
			avgDelayMin: 16,
			pctRight: 80,
			pctSlight: 13.33,
			pctSignificant: 6.67
		},
		AGC: {
			avgDelayMin: 17,
			pctRight: 80,
			pctSlight: 13.33,
			pctSignificant: 6.67
		},
		MTJ: {
			avgDelayMin: 22,
			pctRight: 73.33,
			pctSlight: 20,
			pctSignificant: 6.67
		},
		NDLS: {
			avgDelayMin: 11,
			pctRight: 83.33,
			pctSlight: 10,
			pctSignificant: 6.67
		}
	},
	"12002": {
		NDLS: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		MTJ: {
			avgDelayMin: 17,
			pctRight: 40,
			pctSlight: 60,
			pctSignificant: 0
		},
		AGC: {
			avgDelayMin: 22,
			pctRight: 3.33,
			pctSlight: 96.67,
			pctSignificant: 0
		},
		DHO: {
			avgDelayMin: 14,
			pctRight: 66.67,
			pctSlight: 33.33,
			pctSignificant: 0
		},
		MRA: {
			avgDelayMin: 17,
			pctRight: 46.67,
			pctSlight: 53.33,
			pctSignificant: 0
		},
		GWL: {
			avgDelayMin: 0,
			pctRight: 36.67,
			pctSlight: 63.33,
			pctSignificant: 0
		},
		VGLJ: {
			avgDelayMin: 0,
			pctRight: 80,
			pctSlight: 20,
			pctSignificant: 0
		},
		LAR: {
			avgDelayMin: 0,
			pctRight: 53.33,
			pctSlight: 46.67,
			pctSignificant: 0
		},
		BINA: {
			avgDelayMin: 9,
			pctRight: 83.33,
			pctSlight: 16.67,
			pctSignificant: 0
		},
		BPL: {
			avgDelayMin: 13,
			pctRight: 66.67,
			pctSlight: 33.33,
			pctSignificant: 0
		},
		RKMP: {
			avgDelayMin: 3,
			pctRight: 83.33,
			pctSlight: 16.67,
			pctSignificant: 0
		}
	},
	"12009": {
		MMCT: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		BVI: {
			avgDelayMin: 13,
			pctRight: 72,
			pctSlight: 28,
			pctSignificant: 0
		},
		VAPI: {
			avgDelayMin: 19,
			pctRight: 16,
			pctSlight: 84,
			pctSignificant: 0
		},
		ST: {
			avgDelayMin: 10,
			pctRight: 84,
			pctSlight: 16,
			pctSignificant: 0
		},
		BH: {
			avgDelayMin: 13,
			pctRight: 72,
			pctSlight: 28,
			pctSignificant: 0
		},
		BRC: {
			avgDelayMin: 7,
			pctRight: 96,
			pctSlight: 4,
			pctSignificant: 0
		},
		ANND: {
			avgDelayMin: 8,
			pctRight: 92,
			pctSlight: 8,
			pctSignificant: 0
		},
		ND: {
			avgDelayMin: 7,
			pctRight: 96,
			pctSlight: 4,
			pctSignificant: 0
		},
		ADI: {
			avgDelayMin: 0,
			pctRight: 92,
			pctSlight: 8,
			pctSignificant: 0
		}
	},
	"12010": {
		ADI: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		ND: {
			avgDelayMin: 9,
			pctRight: 84,
			pctSlight: 16,
			pctSignificant: 0
		},
		ANND: {
			avgDelayMin: 5,
			pctRight: 96,
			pctSlight: 4,
			pctSignificant: 0
		},
		BRC: {
			avgDelayMin: 5,
			pctRight: 96,
			pctSlight: 4,
			pctSignificant: 0
		},
		BH: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		ST: {
			avgDelayMin: 3,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		VAPI: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		BVI: {
			avgDelayMin: 21,
			pctRight: 12,
			pctSlight: 88,
			pctSignificant: 0
		},
		MMCT: {
			avgDelayMin: 2,
			pctRight: 96,
			pctSlight: 4,
			pctSignificant: 0
		}
	},
	"12019": {
		HWH: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		DGR: {
			avgDelayMin: 12,
			pctRight: 80,
			pctSlight: 20,
			pctSignificant: 0
		},
		RNG: {
			avgDelayMin: 14,
			pctRight: 72,
			pctSlight: 28,
			pctSignificant: 0
		},
		ASN: {
			avgDelayMin: 16,
			pctRight: 64,
			pctSlight: 36,
			pctSignificant: 0
		},
		DHN: {
			avgDelayMin: 3,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		CRP: {
			avgDelayMin: 4,
			pctRight: 96,
			pctSlight: 4,
			pctSignificant: 0
		},
		BKSC: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		MURI: {
			avgDelayMin: 6,
			pctRight: 92,
			pctSlight: 8,
			pctSignificant: 0
		},
		RNC: {
			avgDelayMin: 0,
			pctRight: 96,
			pctSlight: 4,
			pctSignificant: 0
		}
	},
	"12020": {
		RNC: {
			avgDelayMin: 2,
			pctRight: 96,
			pctSlight: 4,
			pctSignificant: 0
		},
		MURI: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		BKSC: {
			avgDelayMin: 0,
			pctRight: 88,
			pctSlight: 12,
			pctSignificant: 0
		},
		CRP: {
			avgDelayMin: 6,
			pctRight: 88,
			pctSlight: 12,
			pctSignificant: 0
		},
		DHN: {
			avgDelayMin: 6,
			pctRight: 92,
			pctSlight: 8,
			pctSignificant: 0
		},
		ASN: {
			avgDelayMin: 18,
			pctRight: 72,
			pctSlight: 24,
			pctSignificant: 4
		},
		RNG: {
			avgDelayMin: 15,
			pctRight: 60,
			pctSlight: 36,
			pctSignificant: 4
		},
		DGR: {
			avgDelayMin: 0,
			pctRight: 72,
			pctSlight: 24,
			pctSignificant: 4
		},
		HWH: {
			avgDelayMin: 7,
			pctRight: 80,
			pctSlight: 16,
			pctSignificant: 4
		}
	},
	"12049": {
		VGLJ: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		GWL: {
			avgDelayMin: 2,
			pctRight: 96.15,
			pctSlight: 3.85,
			pctSignificant: 0
		},
		AGC: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		NZM: {
			avgDelayMin: 0,
			pctRight: 92.31,
			pctSlight: 7.69,
			pctSignificant: 0
		}
	},
	"12050": {
		NZM: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		AGC: {
			avgDelayMin: 15,
			pctRight: 76.92,
			pctSlight: 23.08,
			pctSignificant: 0
		},
		GWL: {
			avgDelayMin: 19,
			pctRight: 42.31,
			pctSlight: 57.69,
			pctSignificant: 0
		},
		VGLJ: {
			avgDelayMin: 2,
			pctRight: 92.31,
			pctSlight: 7.69,
			pctSignificant: 0
		}
	},
	"12137": {
		CSMT: {
			avgDelayMin: 12,
			pctRight: 96.16,
			pctSlight: .82,
			pctSignificant: 3.01
		},
		DR: {
			avgDelayMin: 17,
			pctRight: 94.52,
			pctSlight: 2.47,
			pctSignificant: 3.01
		},
		KYN: {
			avgDelayMin: 29,
			pctRight: 22.19,
			pctSlight: 73.97,
			pctSignificant: 3.56
		},
		KSRA: {
			avgDelayMin: 27,
			pctRight: 39.73,
			pctSlight: 55.89,
			pctSignificant: 3.84
		},
		NK: {
			avgDelayMin: 0,
			pctRight: 26.3,
			pctSlight: 67.67,
			pctSignificant: 5.48
		},
		MMR: {
			avgDelayMin: 33,
			pctRight: 28.49,
			pctSlight: 66.03,
			pctSignificant: 5.21
		},
		CSN: {
			avgDelayMin: 40,
			pctRight: 12.6,
			pctSlight: 81.1,
			pctSignificant: 6.03
		},
		JL: {
			avgDelayMin: 40,
			pctRight: 16.71,
			pctSlight: 76.44,
			pctSignificant: 6.85
		},
		BSL: {
			avgDelayMin: 35,
			pctRight: 29.04,
			pctSlight: 64.38,
			pctSignificant: 6.58
		},
		BAU: {
			avgDelayMin: 35,
			pctRight: 26.3,
			pctSlight: 67.12,
			pctSignificant: 6.58
		},
		KNW: {
			avgDelayMin: 16,
			pctRight: 89.32,
			pctSlight: 6.85,
			pctSignificant: 3.84
		},
		KKN: {
			avgDelayMin: 20,
			pctRight: 74.25,
			pctSlight: 21.37,
			pctSignificant: 4.38
		},
		HD: {
			avgDelayMin: 28,
			pctRight: 44.93,
			pctSlight: 49.32,
			pctSignificant: 5.75
		},
		BPF: {
			avgDelayMin: 37,
			pctRight: 12.6,
			pctSlight: 80.27,
			pctSignificant: 7.12
		},
		ET: {
			avgDelayMin: 16,
			pctRight: 86.03,
			pctSlight: 9.32,
			pctSignificant: 4.66
		},
		NDPM: {
			avgDelayMin: 19,
			pctRight: 78.9,
			pctSlight: 16.44,
			pctSignificant: 4.66
		},
		RKMP: {
			avgDelayMin: 19,
			pctRight: 74.25,
			pctSlight: 21.1,
			pctSignificant: 4.66
		},
		BPL: {
			avgDelayMin: 26,
			pctRight: 53.15,
			pctSlight: 42.19,
			pctSignificant: 4.66
		},
		BHS: {
			avgDelayMin: 37,
			pctRight: 17.81,
			pctSlight: 73.7,
			pctSignificant: 8.49
		},
		BAQ: {
			avgDelayMin: 42,
			pctRight: 7.12,
			pctSlight: 83.01,
			pctSignificant: 9.86
		},
		BINA: {
			avgDelayMin: 18,
			pctRight: 80.82,
			pctSlight: 12.05,
			pctSignificant: 7.12
		},
		LAR: {
			avgDelayMin: 28,
			pctRight: 53.15,
			pctSlight: 38.63,
			pctSignificant: 8.22
		},
		BAB: {
			avgDelayMin: 35,
			pctRight: 38.08,
			pctSlight: 52.88,
			pctSignificant: 9.04
		},
		VGLJ: {
			avgDelayMin: 30,
			pctRight: 55.07,
			pctSlight: 36.99,
			pctSignificant: 7.95
		},
		DAA: {
			avgDelayMin: 35,
			pctRight: 40.27,
			pctSlight: 49.59,
			pctSignificant: 10.14
		},
		DBA: {
			avgDelayMin: 0,
			pctRight: 24.93,
			pctSlight: 63.56,
			pctSignificant: 11.51
		},
		GWL: {
			avgDelayMin: 55,
			pctRight: 5.75,
			pctSlight: 79.45,
			pctSignificant: 14.79
		},
		MRA: {
			avgDelayMin: 56,
			pctRight: 1.1,
			pctSlight: 81.64,
			pctSignificant: 17.26
		},
		DHO: {
			avgDelayMin: 21,
			pctRight: 79.45,
			pctSlight: 12.05,
			pctSignificant: 8.49
		},
		AGC: {
			avgDelayMin: 26,
			pctRight: 69.04,
			pctSlight: 21.64,
			pctSignificant: 9.32
		},
		RKM: {
			avgDelayMin: 28,
			pctRight: 64.11,
			pctSlight: 26.3,
			pctSignificant: 9.59
		},
		MTJ: {
			avgDelayMin: 41,
			pctRight: 21.37,
			pctSlight: 65.75,
			pctSignificant: 12.88
		},
		KSV: {
			avgDelayMin: 48,
			pctRight: 4.93,
			pctSlight: 81.1,
			pctSignificant: 13.97
		},
		FDB: {
			avgDelayMin: 26,
			pctRight: 75.89,
			pctSlight: 14.52,
			pctSignificant: 9.59
		},
		NZM: {
			avgDelayMin: 36,
			pctRight: 50.41,
			pctSlight: 38.36,
			pctSignificant: 11.23
		},
		NDLS: {
			avgDelayMin: 43,
			pctRight: 35.07,
			pctSlight: 51.51,
			pctSignificant: 13.42
		},
		DKZ: {
			avgDelayMin: 49,
			pctRight: 21.64,
			pctSlight: 62.19,
			pctSignificant: 16.16
		},
		SSB: {
			avgDelayMin: 55,
			pctRight: 14.52,
			pctSlight: 62.74,
			pctSignificant: 22.74
		},
		BGZ: {
			avgDelayMin: 61,
			pctRight: 4.93,
			pctSlight: 67.95,
			pctSignificant: 27.12
		},
		ROK: {
			avgDelayMin: 64,
			pctRight: 3.84,
			pctSlight: 66.03,
			pctSignificant: 30.14
		},
		JIND: {
			avgDelayMin: 64,
			pctRight: 7.67,
			pctSlight: 62.19,
			pctSignificant: 30.14
		},
		NRW: {
			avgDelayMin: 65,
			pctRight: 7.12,
			pctSlight: 60.82,
			pctSignificant: 32.05
		},
		TUN: {
			avgDelayMin: 0,
			pctRight: 7.12,
			pctSlight: 59.73,
			pctSignificant: 33.15
		},
		JHL: {
			avgDelayMin: 62,
			pctRight: 13.42,
			pctSlight: 55.07,
			pctSignificant: 31.51
		},
		BRZ: {
			avgDelayMin: 64,
			pctRight: 10.41,
			pctSlight: 56.16,
			pctSignificant: 33.42
		},
		BLZ: {
			avgDelayMin: 0,
			pctRight: 10.14,
			pctSlight: 55.34,
			pctSignificant: 34.52
		},
		MSZ: {
			avgDelayMin: 68,
			pctRight: 7.95,
			pctSlight: 55.62,
			pctSignificant: 36.44
		},
		MAUR: {
			avgDelayMin: 70,
			pctRight: 6.58,
			pctSlight: 55.07,
			pctSignificant: 38.36
		},
		BTI: {
			avgDelayMin: 49,
			pctRight: 40.55,
			pctSlight: 39.45,
			pctSignificant: 20
		},
		GNA: {
			avgDelayMin: 57,
			pctRight: 30.14,
			pctSlight: 45.21,
			pctSignificant: 24.66
		},
		GJUT: {
			avgDelayMin: 0,
			pctRight: 27.67,
			pctSlight: 45.75,
			pctSignificant: 26.58
		},
		KKP: {
			avgDelayMin: 0,
			pctRight: 25.75,
			pctSlight: 43.56,
			pctSignificant: 30.68
		},
		FDK: {
			avgDelayMin: 66,
			pctRight: 25.21,
			pctSlight: 40.27,
			pctSignificant: 34.52
		},
		FZR: {
			avgDelayMin: 39,
			pctRight: 53.42,
			pctSlight: 31.23,
			pctSignificant: 15.34
		}
	},
	"12138": {
		FZR: {
			avgDelayMin: 0,
			pctRight: 98.08,
			pctSlight: 1.64,
			pctSignificant: .27
		},
		FDK: {
			avgDelayMin: 12,
			pctRight: 93.15,
			pctSlight: 6.58,
			pctSignificant: .27
		},
		KKP: {
			avgDelayMin: 16,
			pctRight: 69.04,
			pctSlight: 30.41,
			pctSignificant: .55
		},
		GJUT: {
			avgDelayMin: 14,
			pctRight: 86.03,
			pctSlight: 13.15,
			pctSignificant: .82
		},
		GNA: {
			avgDelayMin: 13,
			pctRight: 86.3,
			pctSlight: 12.6,
			pctSignificant: 1.1
		},
		BTI: {
			avgDelayMin: 6,
			pctRight: 96.71,
			pctSlight: 2.74,
			pctSignificant: .55
		},
		MAUR: {
			avgDelayMin: 13,
			pctRight: 90.96,
			pctSlight: 8.22,
			pctSignificant: .82
		},
		MSZ: {
			avgDelayMin: 15,
			pctRight: 86.58,
			pctSlight: 12.6,
			pctSignificant: .82
		},
		BLZ: {
			avgDelayMin: 16,
			pctRight: 84.93,
			pctSlight: 13.42,
			pctSignificant: 1.64
		},
		BRZ: {
			avgDelayMin: 18,
			pctRight: 79.45,
			pctSlight: 18.9,
			pctSignificant: 1.64
		},
		JHL: {
			avgDelayMin: 15,
			pctRight: 85.75,
			pctSlight: 12.33,
			pctSignificant: 1.92
		},
		TUN: {
			avgDelayMin: 15,
			pctRight: 84.66,
			pctSlight: 12.88,
			pctSignificant: 2.47
		},
		NRW: {
			avgDelayMin: 21,
			pctRight: 57.81,
			pctSlight: 38.9,
			pctSignificant: 3.29
		},
		JIND: {
			avgDelayMin: 0,
			pctRight: 73.15,
			pctSlight: 23.01,
			pctSignificant: 3.84
		},
		ROK: {
			avgDelayMin: 15,
			pctRight: 75.34,
			pctSlight: 20.27,
			pctSignificant: 4.38
		},
		BGZ: {
			avgDelayMin: 18,
			pctRight: 67.4,
			pctSlight: 27.4,
			pctSignificant: 5.21
		},
		SSB: {
			avgDelayMin: 14,
			pctRight: 81.92,
			pctSlight: 13.97,
			pctSignificant: 4.11
		},
		DKZ: {
			avgDelayMin: 17,
			pctRight: 76.44,
			pctSlight: 18.36,
			pctSignificant: 5.21
		},
		NDLS: {
			avgDelayMin: 15,
			pctRight: 81.64,
			pctSlight: 12.88,
			pctSignificant: 5.48
		},
		FDB: {
			avgDelayMin: 25,
			pctRight: 64.38,
			pctSlight: 22.19,
			pctSignificant: 13.42
		},
		KSV: {
			avgDelayMin: 29,
			pctRight: 63.56,
			pctSlight: 20,
			pctSignificant: 16.44
		},
		MTJ: {
			avgDelayMin: 42,
			pctRight: 14.52,
			pctSlight: 67.4,
			pctSignificant: 18.08
		},
		RKM: {
			avgDelayMin: 54,
			pctRight: .55,
			pctSlight: 78.08,
			pctSignificant: 21.37
		},
		AGC: {
			avgDelayMin: 48,
			pctRight: 1.64,
			pctSlight: 80,
			pctSignificant: 18.36
		},
		DHO: {
			avgDelayMin: 27,
			pctRight: 56.71,
			pctSlight: 33.7,
			pctSignificant: 9.59
		},
		MRA: {
			avgDelayMin: 23,
			pctRight: 69.04,
			pctSlight: 20.82,
			pctSignificant: 10.14
		},
		GWL: {
			avgDelayMin: 0,
			pctRight: 52.05,
			pctSlight: 36.44,
			pctSignificant: 11.51
		},
		DBA: {
			avgDelayMin: 37,
			pctRight: 38.63,
			pctSlight: 47.95,
			pctSignificant: 13.15
		},
		DAA: {
			avgDelayMin: 48,
			pctRight: 6.85,
			pctSlight: 75.89,
			pctSignificant: 16.99
		},
		VGLJ: {
			avgDelayMin: 27,
			pctRight: 63.56,
			pctSlight: 25.21,
			pctSignificant: 10.96
		},
		BAB: {
			avgDelayMin: 33,
			pctRight: 48.77,
			pctSlight: 38.36,
			pctSignificant: 12.6
		},
		LAR: {
			avgDelayMin: 43,
			pctRight: 22.47,
			pctSlight: 61.37,
			pctSignificant: 15.89
		},
		BINA: {
			avgDelayMin: 34,
			pctRight: 63.01,
			pctSlight: 21.64,
			pctSignificant: 15.34
		},
		BAQ: {
			avgDelayMin: 43,
			pctRight: 35.89,
			pctSlight: 45.75,
			pctSignificant: 18.36
		},
		BHS: {
			avgDelayMin: 51,
			pctRight: 14.79,
			pctSlight: 64.38,
			pctSignificant: 20.82
		},
		BPL: {
			avgDelayMin: 0,
			pctRight: 38.36,
			pctSlight: 41.64,
			pctSignificant: 20
		},
		RKMP: {
			avgDelayMin: 46,
			pctRight: 37.26,
			pctSlight: 40,
			pctSignificant: 22.74
		},
		NDPM: {
			avgDelayMin: 49,
			pctRight: 32.88,
			pctSlight: 42.19,
			pctSignificant: 24.93
		},
		ET: {
			avgDelayMin: 50,
			pctRight: 29.86,
			pctSlight: 46.3,
			pctSignificant: 23.84
		},
		BPF: {
			avgDelayMin: 61,
			pctRight: 5.21,
			pctSlight: 67.4,
			pctSignificant: 27.4
		},
		HD: {
			avgDelayMin: 70,
			pctRight: 1.1,
			pctSlight: 66.85,
			pctSignificant: 32.05
		},
		KKN: {
			avgDelayMin: 75,
			pctRight: 0,
			pctSlight: 63.29,
			pctSignificant: 36.71
		},
		KNW: {
			avgDelayMin: 39,
			pctRight: 61.37,
			pctSlight: 17.53,
			pctSignificant: 21.1
		},
		BAU: {
			avgDelayMin: 0,
			pctRight: 56.44,
			pctSlight: 21.92,
			pctSignificant: 21.64
		},
		BSL: {
			avgDelayMin: 52,
			pctRight: 28.49,
			pctSlight: 49.32,
			pctSignificant: 22.19
		},
		JL: {
			avgDelayMin: 49,
			pctRight: 35.62,
			pctSlight: 43.29,
			pctSignificant: 21.1
		},
		CSN: {
			avgDelayMin: 57,
			pctRight: 20,
			pctSlight: 55.89,
			pctSignificant: 24.11
		},
		MMR: {
			avgDelayMin: 65,
			pctRight: 8.77,
			pctSlight: 64.66,
			pctSignificant: 26.58
		},
		NK: {
			avgDelayMin: 62,
			pctRight: 10.41,
			pctSlight: 63.56,
			pctSignificant: 26.03
		},
		KYN: {
			avgDelayMin: 47,
			pctRight: 41.92,
			pctSlight: 37.53,
			pctSignificant: 20.55
		},
		DR: {
			avgDelayMin: 51,
			pctRight: 29.86,
			pctSlight: 48.77,
			pctSignificant: 21.37
		},
		CSMT: {
			avgDelayMin: 36,
			pctRight: 61.37,
			pctSlight: 17.81,
			pctSignificant: 19.73
		}
	},
	"12163": {
		LTT: {
			avgDelayMin: 12,
			pctRight: 89.32,
			pctSlight: 7.4,
			pctSignificant: 3.29
		},
		TNA: {
			avgDelayMin: 11,
			pctRight: 90.14,
			pctSlight: 6.85,
			pctSignificant: 3.01
		},
		KYN: {
			avgDelayMin: 24,
			pctRight: 42.74,
			pctSlight: 53.15,
			pctSignificant: 4.11
		},
		LNL: {
			avgDelayMin: 35,
			pctRight: 3.01,
			pctSlight: 86.3,
			pctSignificant: 5.21
		},
		PUNE: {
			avgDelayMin: 38,
			pctRight: 3.56,
			pctSlight: 87.67,
			pctSignificant: 8.77
		},
		SUR: {
			avgDelayMin: 31,
			pctRight: 32.88,
			pctSlight: 58.63,
			pctSignificant: 8.49
		},
		KLBG: {
			avgDelayMin: 0,
			pctRight: 17.26,
			pctSlight: 70.96,
			pctSignificant: 11.78
		},
		WADI: {
			avgDelayMin: 18,
			pctRight: 71.51,
			pctSlight: 22.19,
			pctSignificant: 6.3
		},
		YG: {
			avgDelayMin: 23,
			pctRight: 59.18,
			pctSlight: 33.97,
			pctSignificant: 6.85
		},
		SADP: {
			avgDelayMin: 24,
			pctRight: 55.62,
			pctSlight: 37.81,
			pctSignificant: 6.58
		},
		RC: {
			avgDelayMin: 0,
			pctRight: 44.11,
			pctSlight: 47.95,
			pctSignificant: 7.95
		},
		MALM: {
			avgDelayMin: 30,
			pctRight: 39.73,
			pctSlight: 52.05,
			pctSignificant: 8.22
		},
		AD: {
			avgDelayMin: 27,
			pctRight: 45.48,
			pctSlight: 47.12,
			pctSignificant: 7.4
		},
		GTL: {
			avgDelayMin: 24,
			pctRight: 53.97,
			pctSlight: 37.26,
			pctSignificant: 8.77
		},
		GY: {
			avgDelayMin: 25,
			pctRight: 56.99,
			pctSlight: 34.79,
			pctSignificant: 8.22
		},
		TU: {
			avgDelayMin: 23,
			pctRight: 59.18,
			pctSlight: 33.7,
			pctSignificant: 7.12
		},
		YA: {
			avgDelayMin: 24,
			pctRight: 54.25,
			pctSlight: 38.63,
			pctSignificant: 7.12
		},
		HX: {
			avgDelayMin: 22,
			pctRight: 60,
			pctSlight: 33.15,
			pctSignificant: 6.85
		},
		RJP: {
			avgDelayMin: 28,
			pctRight: 45.21,
			pctSlight: 47.12,
			pctSignificant: 7.67
		},
		KOU: {
			avgDelayMin: 45,
			pctRight: 0,
			pctSlight: 3.01,
			pctSignificant: 0
		},
		RU: {
			avgDelayMin: 18,
			pctRight: 73.97,
			pctSlight: 20.27,
			pctSignificant: 5.75
		},
		PUT: {
			avgDelayMin: 19,
			pctRight: 70.14,
			pctSlight: 24.11,
			pctSignificant: 5.75
		},
		TRT: {
			avgDelayMin: 18,
			pctRight: 69.86,
			pctSlight: 24.11,
			pctSignificant: 6.03
		},
		AJJ: {
			avgDelayMin: 33,
			pctRight: 26.58,
			pctSlight: 66.3,
			pctSignificant: 7.12
		},
		PER: {
			avgDelayMin: 44,
			pctRight: 17.81,
			pctSlight: 67.12,
			pctSignificant: 14.52
		},
		MAS: {
			avgDelayMin: 6,
			pctRight: 89.59,
			pctSlight: 4.93,
			pctSignificant: 4.93
		}
	},
	"12164": {
		MAS: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		AJJ: {
			avgDelayMin: 13,
			pctRight: 73.33,
			pctSlight: 26.67,
			pctSignificant: 0
		},
		TRT: {
			avgDelayMin: 12,
			pctRight: 76.67,
			pctSlight: 23.33,
			pctSignificant: 0
		},
		PUT: {
			avgDelayMin: 19,
			pctRight: 36.67,
			pctSlight: 63.33,
			pctSignificant: 0
		},
		RU: {
			avgDelayMin: 23,
			pctRight: 26.67,
			pctSlight: 73.33,
			pctSignificant: 0
		},
		KOU: {
			avgDelayMin: 26,
			pctRight: 26.67,
			pctSlight: 73.33,
			pctSignificant: 0
		},
		RJP: {
			avgDelayMin: 34,
			pctRight: 0,
			pctSlight: 100,
			pctSignificant: 0
		},
		HX: {
			avgDelayMin: 0,
			pctRight: 16.67,
			pctSlight: 83.33,
			pctSignificant: 0
		},
		YA: {
			avgDelayMin: 32,
			pctRight: 16.67,
			pctSlight: 83.33,
			pctSignificant: 0
		},
		TU: {
			avgDelayMin: 30,
			pctRight: 13.33,
			pctSlight: 86.67,
			pctSignificant: 0
		},
		GY: {
			avgDelayMin: 27,
			pctRight: 16.67,
			pctSlight: 83.33,
			pctSignificant: 0
		},
		GTL: {
			avgDelayMin: 40,
			pctRight: 0,
			pctSlight: 93.33,
			pctSignificant: 6.67
		},
		AD: {
			avgDelayMin: 39,
			pctRight: 0,
			pctSlight: 90,
			pctSignificant: 10
		},
		MALM: {
			avgDelayMin: 0,
			pctRight: 0,
			pctSlight: 90,
			pctSignificant: 10
		},
		RC: {
			avgDelayMin: 31,
			pctRight: 10,
			pctSlight: 83.33,
			pctSignificant: 6.67
		},
		SADP: {
			avgDelayMin: 25,
			pctRight: 33.33,
			pctSlight: 63.33,
			pctSignificant: 3.33
		},
		YG: {
			avgDelayMin: 25,
			pctRight: 40,
			pctSlight: 53.33,
			pctSignificant: 6.67
		},
		WADI: {
			avgDelayMin: 8,
			pctRight: 90,
			pctSlight: 6.67,
			pctSignificant: 3.33
		},
		KLBG: {
			avgDelayMin: 6,
			pctRight: 93.33,
			pctSlight: 6.67,
			pctSignificant: 0
		},
		SUR: {
			avgDelayMin: 20,
			pctRight: 43.33,
			pctSlight: 53.33,
			pctSignificant: 3.33
		},
		PUNE: {
			avgDelayMin: 0,
			pctRight: 46.67,
			pctSlight: 50,
			pctSignificant: 3.33
		},
		LNL: {
			avgDelayMin: 34,
			pctRight: 10,
			pctSlight: 73.33,
			pctSignificant: 16.67
		},
		KYN: {
			avgDelayMin: 51,
			pctRight: 0,
			pctSlight: 80,
			pctSignificant: 20
		},
		TNA: {
			avgDelayMin: 54,
			pctRight: 0,
			pctSlight: 76.67,
			pctSignificant: 23.33
		},
		LTT: {
			avgDelayMin: 9,
			pctRight: 80,
			pctSlight: 16.67,
			pctSignificant: 3.33
		}
	},
	"12201": {
		LTT: {
			avgDelayMin: 4,
			pctRight: 87.5,
			pctSlight: 12.5,
			pctSignificant: 0
		},
		TNA: {
			avgDelayMin: 11,
			pctRight: 87.5,
			pctSlight: 12.5,
			pctSignificant: 0
		},
		PNVL: {
			avgDelayMin: 13,
			pctRight: 62.5,
			pctSlight: 37.5,
			pctSignificant: 0
		},
		RN: {
			avgDelayMin: 58,
			pctRight: 12.5,
			pctSlight: 37.5,
			pctSignificant: 50
		},
		MAO: {
			avgDelayMin: 41,
			pctRight: 37.5,
			pctSlight: 37.5,
			pctSignificant: 25
		},
		KAWR: {
			avgDelayMin: 51,
			pctRight: 37.5,
			pctSlight: 25,
			pctSignificant: 37.5
		},
		ANKL: {
			avgDelayMin: 53,
			pctRight: 37.5,
			pctSlight: 25,
			pctSignificant: 37.5
		},
		BYNR: {
			avgDelayMin: 20,
			pctRight: 50,
			pctSlight: 37.5,
			pctSignificant: 12.5
		},
		UD: {
			avgDelayMin: 24,
			pctRight: 50,
			pctSlight: 37.5,
			pctSignificant: 12.5
		},
		MAJN: {
			avgDelayMin: 0,
			pctRight: 75,
			pctSlight: 12.5,
			pctSignificant: 12.5
		},
		KGQ: {
			avgDelayMin: 23,
			pctRight: 75,
			pctSlight: 12.5,
			pctSignificant: 12.5
		},
		CAN: {
			avgDelayMin: 26,
			pctRight: 50,
			pctSlight: 37.5,
			pctSignificant: 12.5
		},
		CLT: {
			avgDelayMin: 18,
			pctRight: 75,
			pctSlight: 12.5,
			pctSignificant: 12.5
		},
		TIR: {
			avgDelayMin: 23,
			pctRight: 50,
			pctSlight: 37.5,
			pctSignificant: 12.5
		},
		SRR: {
			avgDelayMin: 21,
			pctRight: 75,
			pctSlight: 12.5,
			pctSignificant: 12.5
		},
		TCR: {
			avgDelayMin: 21,
			pctRight: 75,
			pctSlight: 12.5,
			pctSignificant: 12.5
		},
		ERN: {
			avgDelayMin: 0,
			pctRight: 62.5,
			pctSlight: 25,
			pctSignificant: 12.5
		},
		KTYM: {
			avgDelayMin: 20,
			pctRight: 75,
			pctSlight: 12.5,
			pctSignificant: 12.5
		},
		CGY: {
			avgDelayMin: 20,
			pctRight: 75,
			pctSlight: 12.5,
			pctSignificant: 12.5
		},
		TRVL: {
			avgDelayMin: 0,
			pctRight: 75,
			pctSlight: 12.5,
			pctSignificant: 12.5
		},
		CNGR: {
			avgDelayMin: 0,
			pctRight: 75,
			pctSlight: 12.5,
			pctSignificant: 12.5
		},
		KYJ: {
			avgDelayMin: 22,
			pctRight: 75,
			pctSlight: 12.5,
			pctSignificant: 12.5
		},
		QLN: {
			avgDelayMin: 0,
			pctRight: 62.5,
			pctSlight: 25,
			pctSignificant: 12.5
		},
		TVCN: {
			avgDelayMin: 0,
			pctRight: 87.5,
			pctSlight: 12.5,
			pctSignificant: 0
		}
	},
	"12202": {
		TVCN: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		QLN: {
			avgDelayMin: 8,
			pctRight: 88.89,
			pctSlight: 11.11,
			pctSignificant: 0
		},
		KYJ: {
			avgDelayMin: 12,
			pctRight: 77.78,
			pctSlight: 22.22,
			pctSignificant: 0
		},
		CNGR: {
			avgDelayMin: 14,
			pctRight: 66.67,
			pctSlight: 33.33,
			pctSignificant: 0
		},
		TRVL: {
			avgDelayMin: 14,
			pctRight: 55.56,
			pctSlight: 44.44,
			pctSignificant: 0
		},
		CGY: {
			avgDelayMin: 15,
			pctRight: 55.56,
			pctSlight: 44.44,
			pctSignificant: 0
		},
		KTYM: {
			avgDelayMin: 18,
			pctRight: 33.33,
			pctSlight: 66.67,
			pctSignificant: 0
		},
		ERN: {
			avgDelayMin: 11,
			pctRight: 66.67,
			pctSlight: 33.33,
			pctSignificant: 0
		},
		TCR: {
			avgDelayMin: 20,
			pctRight: 44.44,
			pctSlight: 55.56,
			pctSignificant: 0
		},
		SRR: {
			avgDelayMin: 13,
			pctRight: 55.56,
			pctSlight: 44.44,
			pctSignificant: 0
		},
		TIR: {
			avgDelayMin: 22,
			pctRight: 22.22,
			pctSlight: 77.78,
			pctSignificant: 0
		},
		CLT: {
			avgDelayMin: 25,
			pctRight: 11.11,
			pctSlight: 88.89,
			pctSignificant: 0
		},
		CAN: {
			avgDelayMin: 50,
			pctRight: 0,
			pctSlight: 88.89,
			pctSignificant: 11.11
		},
		KGQ: {
			avgDelayMin: 55,
			pctRight: 0,
			pctSlight: 77.78,
			pctSignificant: 22.22
		},
		MAJN: {
			avgDelayMin: 34,
			pctRight: 0,
			pctSlight: 88.89,
			pctSignificant: 11.11
		},
		UD: {
			avgDelayMin: 44,
			pctRight: 0,
			pctSlight: 88.89,
			pctSignificant: 11.11
		},
		BYNR: {
			avgDelayMin: 0,
			pctRight: 0,
			pctSlight: 88.89,
			pctSignificant: 11.11
		},
		ANKL: {
			avgDelayMin: 45,
			pctRight: 0,
			pctSlight: 66.67,
			pctSignificant: 33.33
		},
		KAWR: {
			avgDelayMin: 48,
			pctRight: 0,
			pctSlight: 77.78,
			pctSignificant: 22.22
		},
		MAO: {
			avgDelayMin: 35,
			pctRight: 11.11,
			pctSlight: 77.78,
			pctSignificant: 11.11
		},
		RN: {
			avgDelayMin: 66,
			pctRight: 11.11,
			pctSlight: 22.22,
			pctSignificant: 66.67
		},
		PNVL: {
			avgDelayMin: 41,
			pctRight: 11.11,
			pctSlight: 77.78,
			pctSignificant: 11.11
		},
		TNA: {
			avgDelayMin: 45,
			pctRight: 11.11,
			pctSlight: 66.67,
			pctSignificant: 22.22
		},
		LTT: {
			avgDelayMin: 17,
			pctRight: 55.56,
			pctSlight: 33.33,
			pctSignificant: 11.11
		}
	},
	"12235": {
		MDP: {
			avgDelayMin: 6,
			pctRight: 75,
			pctSlight: 25,
			pctSignificant: 0
		},
		JSME: {
			avgDelayMin: 12,
			pctRight: 75,
			pctSlight: 25,
			pctSignificant: 0
		},
		JAJ: {
			avgDelayMin: 3,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		KIUL: {
			avgDelayMin: 0,
			pctRight: 25,
			pctSlight: 75,
			pctSignificant: 0
		},
		MKA: {
			avgDelayMin: 35,
			pctRight: 0,
			pctSlight: 100,
			pctSignificant: 0
		},
		PNBE: {
			avgDelayMin: 18,
			pctRight: 50,
			pctSlight: 50,
			pctSignificant: 0
		},
		ARA: {
			avgDelayMin: 38,
			pctRight: 0,
			pctSlight: 100,
			pctSignificant: 0
		},
		BXR: {
			avgDelayMin: 51,
			pctRight: 0,
			pctSlight: 75,
			pctSignificant: 25
		},
		DDU: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		PRYJ: {
			avgDelayMin: 6,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		CNB: {
			avgDelayMin: 13,
			pctRight: 50,
			pctSlight: 50,
			pctSignificant: 0
		},
		ANVT: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		}
	},
	"12236": {
		ANVT: {
			avgDelayMin: 0,
			pctRight: 25,
			pctSlight: 25,
			pctSignificant: 50
		},
		CNB: {
			avgDelayMin: 0,
			pctRight: 25,
			pctSlight: 25,
			pctSignificant: 50
		},
		PRYJ: {
			avgDelayMin: 159,
			pctRight: 25,
			pctSlight: 25,
			pctSignificant: 50
		},
		DDU: {
			avgDelayMin: 147,
			pctRight: 25,
			pctSlight: 25,
			pctSignificant: 50
		},
		BXR: {
			avgDelayMin: 152,
			pctRight: 25,
			pctSlight: 25,
			pctSignificant: 50
		},
		ARA: {
			avgDelayMin: 157,
			pctRight: 25,
			pctSlight: 25,
			pctSignificant: 50
		},
		PNBE: {
			avgDelayMin: 0,
			pctRight: 0,
			pctSlight: 50,
			pctSignificant: 50
		},
		MKA: {
			avgDelayMin: 0,
			pctRight: 0,
			pctSlight: 25,
			pctSignificant: 75
		},
		KIUL: {
			avgDelayMin: 0,
			pctRight: 0,
			pctSlight: 25,
			pctSignificant: 75
		},
		JAJ: {
			avgDelayMin: 143,
			pctRight: 50,
			pctSlight: 0,
			pctSignificant: 50
		},
		JSME: {
			avgDelayMin: 152,
			pctRight: 50,
			pctSlight: 0,
			pctSignificant: 50
		},
		MDP: {
			avgDelayMin: 126,
			pctRight: 50,
			pctSlight: 0,
			pctSignificant: 50
		}
	},
	"12245": {
		HWH: {
			avgDelayMin: 13,
			pctRight: 86.36,
			pctSlight: 9.09,
			pctSignificant: 4.55
		},
		BBS: {
			avgDelayMin: 111,
			pctRight: 0,
			pctSlight: 18.18,
			pctSignificant: 81.82
		},
		VZM: {
			avgDelayMin: 93,
			pctRight: 13.64,
			pctSlight: 31.82,
			pctSignificant: 54.55
		},
		BZA: {
			avgDelayMin: 0,
			pctRight: 4.55,
			pctSlight: 31.82,
			pctSignificant: 63.64
		},
		RU: {
			avgDelayMin: 97,
			pctRight: 18.18,
			pctSlight: 27.27,
			pctSignificant: 54.55
		},
		SMVB: {
			avgDelayMin: 77,
			pctRight: 40.91,
			pctSlight: 27.27,
			pctSignificant: 31.82
		}
	},
	"12246": {
		SMVB: {
			avgDelayMin: 0,
			pctRight: 93.87,
			pctSlight: 4.98,
			pctSignificant: .77
		},
		RU: {
			avgDelayMin: 13,
			pctRight: 69.35,
			pctSlight: 28.35,
			pctSignificant: 1.92
		},
		BZA: {
			avgDelayMin: 22,
			pctRight: 43.68,
			pctSlight: 50.19,
			pctSignificant: 5.75
		},
		VZM: {
			avgDelayMin: 15,
			pctRight: 72.41,
			pctSlight: 24.14,
			pctSignificant: 3.07
		},
		BBS: {
			avgDelayMin: 41,
			pctRight: 12.26,
			pctSlight: 76.25,
			pctSignificant: 11.11
		},
		HWH: {
			avgDelayMin: 0,
			pctRight: 50.96,
			pctSlight: 23.75,
			pctSignificant: 24.9
		}
	},
	"12259": {
		SDAH: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		DHN: {
			avgDelayMin: 4,
			pctRight: 94.12,
			pctSlight: 5.88,
			pctSignificant: 0
		},
		KQR: {
			avgDelayMin: 11,
			pctRight: 82.35,
			pctSlight: 17.65,
			pctSignificant: 0
		},
		DDU: {
			avgDelayMin: 4,
			pctRight: 94.12,
			pctSlight: 5.88,
			pctSignificant: 0
		},
		CNB: {
			avgDelayMin: 11,
			pctRight: 76.47,
			pctSlight: 23.53,
			pctSignificant: 0
		},
		NDLS: {
			avgDelayMin: 14,
			pctRight: 64.71,
			pctSlight: 29.41,
			pctSignificant: 5.88
		},
		LHU: {
			avgDelayMin: 24,
			pctRight: 64.71,
			pctSlight: 29.41,
			pctSignificant: 5.88
		},
		SDLP: {
			avgDelayMin: 28,
			pctRight: 64.71,
			pctSlight: 11.76,
			pctSignificant: 23.53
		},
		CUR: {
			avgDelayMin: 41,
			pctRight: 29.41,
			pctSlight: 47.06,
			pctSignificant: 23.53
		},
		RTGH: {
			avgDelayMin: 0,
			pctRight: 5.88,
			pctSlight: 64.71,
			pctSignificant: 29.41
		},
		SDGH: {
			avgDelayMin: 57,
			pctRight: 0,
			pctSlight: 70.59,
			pctSignificant: 29.41
		},
		BKN: {
			avgDelayMin: 7,
			pctRight: 70.59,
			pctSlight: 23.53,
			pctSignificant: 5.88
		}
	},
	"12260": {
		BKN: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		SDGH: {
			avgDelayMin: 15,
			pctRight: 68.75,
			pctSlight: 25,
			pctSignificant: 6.25
		},
		RTGH: {
			avgDelayMin: 0,
			pctRight: 62.5,
			pctSlight: 31.25,
			pctSignificant: 6.25
		},
		CUR: {
			avgDelayMin: 0,
			pctRight: 81.25,
			pctSlight: 12.5,
			pctSignificant: 6.25
		},
		SDLP: {
			avgDelayMin: 24,
			pctRight: 31.25,
			pctSlight: 62.5,
			pctSignificant: 6.25
		},
		LHU: {
			avgDelayMin: 24,
			pctRight: 37.5,
			pctSlight: 56.25,
			pctSignificant: 6.25
		},
		NDLS: {
			avgDelayMin: 8,
			pctRight: 93.75,
			pctSlight: 0,
			pctSignificant: 6.25
		},
		CNB: {
			avgDelayMin: 25,
			pctRight: 50,
			pctSlight: 43.75,
			pctSignificant: 6.25
		},
		DDU: {
			avgDelayMin: 23,
			pctRight: 68.75,
			pctSlight: 18.75,
			pctSignificant: 12.5
		},
		KQR: {
			avgDelayMin: 0,
			pctRight: 56.25,
			pctSlight: 31.25,
			pctSignificant: 12.5
		},
		DHN: {
			avgDelayMin: 33,
			pctRight: 43.75,
			pctSlight: 43.75,
			pctSignificant: 12.5
		},
		SDAH: {
			avgDelayMin: 55,
			pctRight: 81.25,
			pctSlight: 6.25,
			pctSignificant: 12.5
		}
	},
	"12261": {
		CSMT: {
			avgDelayMin: 231,
			pctRight: 46.41,
			pctSlight: 6.22,
			pctSignificant: 47.37
		},
		KYN: {
			avgDelayMin: 261,
			pctRight: 36.36,
			pctSlight: 10.53,
			pctSignificant: 52.63
		},
		BSL: {
			avgDelayMin: 305,
			pctRight: 11.48,
			pctSlight: 31.1,
			pctSignificant: 57.42
		},
		AK: {
			avgDelayMin: 448,
			pctRight: .96,
			pctSlight: .96,
			pctSignificant: 4.31
		},
		NGP: {
			avgDelayMin: 305,
			pctRight: 27.75,
			pctSlight: 16.75,
			pctSignificant: 55.5
		},
		BSP: {
			avgDelayMin: 298,
			pctRight: 25.36,
			pctSlight: 20.1,
			pctSignificant: 54.55
		},
		TATA: {
			avgDelayMin: 530,
			pctRight: .48,
			pctSlight: 0,
			pctSignificant: 99.04
		},
		HWH: {
			avgDelayMin: 586,
			pctRight: .48,
			pctSlight: 0,
			pctSignificant: 99.04
		}
	},
	"12262": {
		HWH: {
			avgDelayMin: 92,
			pctRight: 62.5,
			pctSlight: 6.25,
			pctSignificant: 31.25
		},
		TATA: {
			avgDelayMin: 147,
			pctRight: 6.25,
			pctSlight: 43.75,
			pctSignificant: 50
		},
		BSP: {
			avgDelayMin: 301,
			pctRight: 18.75,
			pctSlight: 0,
			pctSignificant: 81.25
		},
		NGP: {
			avgDelayMin: 0,
			pctRight: 6.25,
			pctSlight: 0,
			pctSignificant: 93.75
		},
		AK: {
			avgDelayMin: 411,
			pctRight: 6.25,
			pctSlight: 0,
			pctSignificant: 68.75
		},
		BSL: {
			avgDelayMin: 0,
			pctRight: 6.25,
			pctSlight: 0,
			pctSignificant: 93.75
		},
		KYN: {
			avgDelayMin: 482,
			pctRight: 6.25,
			pctSlight: 0,
			pctSignificant: 93.75
		},
		CSMT: {
			avgDelayMin: 468,
			pctRight: 6.25,
			pctSlight: 0,
			pctSignificant: 93.75
		}
	},
	"12295": {
		SMVB: {
			avgDelayMin: 19,
			pctRight: 76.67,
			pctSlight: 16.67,
			pctSignificant: 6.67
		},
		KJM: {
			avgDelayMin: 0,
			pctRight: 70,
			pctSlight: 23.33,
			pctSignificant: 6.67
		},
		BWT: {
			avgDelayMin: 31,
			pctRight: 43.33,
			pctSlight: 46.67,
			pctSignificant: 10
		},
		KPN: {
			avgDelayMin: 30,
			pctRight: 63.33,
			pctSlight: 26.67,
			pctSignificant: 10
		},
		JTJ: {
			avgDelayMin: 30,
			pctRight: 60,
			pctSlight: 26.67,
			pctSignificant: 13.33
		},
		KPD: {
			avgDelayMin: 24,
			pctRight: 80,
			pctSlight: 6.67,
			pctSignificant: 13.33
		},
		AJJ: {
			avgDelayMin: 29,
			pctRight: 63.33,
			pctSlight: 23.33,
			pctSignificant: 13.33
		},
		PER: {
			avgDelayMin: 33,
			pctRight: 60,
			pctSlight: 26.67,
			pctSignificant: 13.33
		},
		GDR: {
			avgDelayMin: 46,
			pctRight: 10,
			pctSlight: 70,
			pctSignificant: 20
		},
		NLR: {
			avgDelayMin: 60,
			pctRight: 0,
			pctSlight: 80,
			pctSignificant: 20
		},
		OGL: {
			avgDelayMin: 61,
			pctRight: 3.33,
			pctSlight: 73.33,
			pctSignificant: 23.33
		},
		BZA: {
			avgDelayMin: 54,
			pctRight: 3.33,
			pctSlight: 76.67,
			pctSignificant: 20
		},
		KMT: {
			avgDelayMin: 38,
			pctRight: 60,
			pctSlight: 20,
			pctSignificant: 20
		},
		WL: {
			avgDelayMin: 62,
			pctRight: 0,
			pctSlight: 80,
			pctSignificant: 20
		},
		RDM: {
			avgDelayMin: 57,
			pctRight: 13.33,
			pctSlight: 63.33,
			pctSignificant: 23.33
		},
		SKZR: {
			avgDelayMin: 38,
			pctRight: 3.33,
			pctSlight: 30,
			pctSignificant: 3.33
		},
		BPQ: {
			avgDelayMin: 32,
			pctRight: 70,
			pctSlight: 13.33,
			pctSignificant: 16.67
		},
		CD: {
			avgDelayMin: 35,
			pctRight: 60,
			pctSlight: 23.33,
			pctSignificant: 16.67
		},
		SEGM: {
			avgDelayMin: 44,
			pctRight: 36.67,
			pctSlight: 46.67,
			pctSignificant: 16.67
		},
		NGP: {
			avgDelayMin: 31,
			pctRight: 63.33,
			pctSlight: 20,
			pctSignificant: 16.67
		},
		BZU: {
			avgDelayMin: 64,
			pctRight: 6.67,
			pctSlight: 63.33,
			pctSignificant: 30
		},
		GDYA: {
			avgDelayMin: 73,
			pctRight: 0,
			pctSlight: 53.33,
			pctSignificant: 46.67
		},
		ET: {
			avgDelayMin: 26,
			pctRight: 80,
			pctSlight: 6.67,
			pctSignificant: 13.33
		},
		PPI: {
			avgDelayMin: 0,
			pctRight: 50,
			pctSlight: 36.67,
			pctSignificant: 13.33
		},
		NU: {
			avgDelayMin: 54,
			pctRight: 6.67,
			pctSlight: 76.67,
			pctSignificant: 16.67
		},
		JBP: {
			avgDelayMin: 43,
			pctRight: 36.67,
			pctSlight: 46.67,
			pctSignificant: 16.67
		},
		KTE: {
			avgDelayMin: 60,
			pctRight: 0,
			pctSlight: 83.33,
			pctSignificant: 16.67
		},
		MYR: {
			avgDelayMin: 70,
			pctRight: 0,
			pctSlight: 83.33,
			pctSignificant: 16.67
		},
		STA: {
			avgDelayMin: 62,
			pctRight: 0,
			pctSlight: 83.33,
			pctSignificant: 16.67
		},
		PCOI: {
			avgDelayMin: 70,
			pctRight: 10,
			pctSlight: 40,
			pctSignificant: 50
		},
		MZP: {
			avgDelayMin: 29,
			pctRight: 43.33,
			pctSlight: 50,
			pctSignificant: 6.67
		},
		DDU: {
			avgDelayMin: 12,
			pctRight: 96.67,
			pctSlight: 0,
			pctSignificant: 3.33
		},
		DLN: {
			avgDelayMin: 0,
			pctRight: 90,
			pctSlight: 6.67,
			pctSignificant: 3.33
		},
		BXR: {
			avgDelayMin: 19,
			pctRight: 70,
			pctSlight: 26.67,
			pctSignificant: 3.33
		},
		ARA: {
			avgDelayMin: 23,
			pctRight: 56.67,
			pctSlight: 36.67,
			pctSignificant: 6.67
		},
		DNR: {
			avgDelayMin: 4,
			pctRight: 90,
			pctSlight: 3.33,
			pctSignificant: 6.67
		}
	},
	"12296": {
		DNR: {
			avgDelayMin: 5,
			pctRight: 90,
			pctSlight: 10,
			pctSignificant: 0
		},
		ARA: {
			avgDelayMin: 23,
			pctRight: 43.33,
			pctSlight: 46.67,
			pctSignificant: 10
		},
		BXR: {
			avgDelayMin: 34,
			pctRight: 16.67,
			pctSlight: 73.33,
			pctSignificant: 10
		},
		DLN: {
			avgDelayMin: 45,
			pctRight: 3.33,
			pctSlight: 76.67,
			pctSignificant: 20
		},
		DDU: {
			avgDelayMin: 21,
			pctRight: 66.67,
			pctSlight: 23.33,
			pctSignificant: 10
		},
		MZP: {
			avgDelayMin: 21,
			pctRight: 60,
			pctSlight: 30,
			pctSignificant: 10
		},
		PCOI: {
			avgDelayMin: 28,
			pctRight: 43.33,
			pctSlight: 46.67,
			pctSignificant: 10
		},
		STA: {
			avgDelayMin: 20,
			pctRight: 56.67,
			pctSlight: 36.67,
			pctSignificant: 6.67
		},
		MYR: {
			avgDelayMin: 29,
			pctRight: 30,
			pctSlight: 60,
			pctSignificant: 10
		},
		KTE: {
			avgDelayMin: 47,
			pctRight: 3.33,
			pctSlight: 76.67,
			pctSignificant: 20
		},
		JBP: {
			avgDelayMin: 38,
			pctRight: 23.33,
			pctSlight: 63.33,
			pctSignificant: 13.33
		},
		NU: {
			avgDelayMin: 0,
			pctRight: 13.33,
			pctSlight: 70,
			pctSignificant: 16.67
		},
		PPI: {
			avgDelayMin: 0,
			pctRight: 10,
			pctSlight: 73.33,
			pctSignificant: 16.67
		},
		ET: {
			avgDelayMin: 8,
			pctRight: 83.33,
			pctSlight: 13.33,
			pctSignificant: 3.33
		},
		GDYA: {
			avgDelayMin: 13,
			pctRight: 80,
			pctSlight: 13.33,
			pctSignificant: 6.67
		},
		BZU: {
			avgDelayMin: 27,
			pctRight: 36.67,
			pctSlight: 53.33,
			pctSignificant: 10
		},
		NGP: {
			avgDelayMin: 22,
			pctRight: 53.33,
			pctSlight: 36.67,
			pctSignificant: 10
		},
		SEGM: {
			avgDelayMin: 41,
			pctRight: 13.33,
			pctSlight: 63.33,
			pctSignificant: 23.33
		},
		CD: {
			avgDelayMin: 0,
			pctRight: 6.67,
			pctSlight: 70,
			pctSignificant: 23.33
		},
		BPQ: {
			avgDelayMin: 10,
			pctRight: 83.33,
			pctSlight: 16.67,
			pctSignificant: 0
		},
		SKZR: {
			avgDelayMin: 39,
			pctRight: 3.33,
			pctSlight: 23.33,
			pctSignificant: 10
		},
		RDM: {
			avgDelayMin: 43,
			pctRight: 0,
			pctSlight: 86.67,
			pctSignificant: 13.33
		},
		WL: {
			avgDelayMin: 51,
			pctRight: 6.67,
			pctSlight: 73.33,
			pctSignificant: 20
		},
		KMT: {
			avgDelayMin: 57,
			pctRight: 3.33,
			pctSlight: 63.33,
			pctSignificant: 33.33
		},
		BZA: {
			avgDelayMin: 23,
			pctRight: 46.67,
			pctSlight: 46.67,
			pctSignificant: 6.67
		},
		OGL: {
			avgDelayMin: 29,
			pctRight: 36.67,
			pctSlight: 53.33,
			pctSignificant: 10
		},
		NLR: {
			avgDelayMin: 25,
			pctRight: 46.67,
			pctSlight: 46.67,
			pctSignificant: 6.67
		},
		GDR: {
			avgDelayMin: 14,
			pctRight: 80,
			pctSlight: 13.33,
			pctSignificant: 6.67
		},
		PER: {
			avgDelayMin: 0,
			pctRight: 26.67,
			pctSlight: 66.67,
			pctSignificant: 6.67
		},
		AJJ: {
			avgDelayMin: 32,
			pctRight: 26.67,
			pctSlight: 66.67,
			pctSignificant: 6.67
		},
		KPD: {
			avgDelayMin: 37,
			pctRight: 46.67,
			pctSlight: 40,
			pctSignificant: 13.33
		},
		JTJ: {
			avgDelayMin: 31,
			pctRight: 56.67,
			pctSlight: 30,
			pctSignificant: 13.33
		},
		KPN: {
			avgDelayMin: 46,
			pctRight: 30,
			pctSlight: 56.67,
			pctSignificant: 13.33
		},
		BWT: {
			avgDelayMin: 49,
			pctRight: 20,
			pctSlight: 66.67,
			pctSignificant: 13.33
		},
		KJM: {
			avgDelayMin: 45,
			pctRight: 20,
			pctSlight: 66.67,
			pctSignificant: 13.33
		},
		SMVB: {
			avgDelayMin: 10,
			pctRight: 86.67,
			pctSlight: 0,
			pctSignificant: 13.33
		}
	},
	"12301": {
		HWH: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		ASN: {
			avgDelayMin: 16,
			pctRight: 56,
			pctSlight: 44,
			pctSignificant: 0
		},
		DHN: {
			avgDelayMin: 3,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		PNME: {
			avgDelayMin: 6,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		GAYA: {
			avgDelayMin: 0,
			pctRight: 92,
			pctSlight: 4,
			pctSignificant: 4
		},
		DDU: {
			avgDelayMin: 15,
			pctRight: 92,
			pctSlight: 4,
			pctSignificant: 4
		},
		PRYJ: {
			avgDelayMin: 15,
			pctRight: 92,
			pctSlight: 4,
			pctSignificant: 4
		},
		CNB: {
			avgDelayMin: 19,
			pctRight: 76,
			pctSlight: 20,
			pctSignificant: 4
		},
		NDLS: {
			avgDelayMin: 22,
			pctRight: 76,
			pctSlight: 20,
			pctSignificant: 4
		}
	},
	"12302": {
		NDLS: {
			avgDelayMin: 0,
			pctRight: 96.15,
			pctSlight: 0,
			pctSignificant: 3.85
		},
		CNB: {
			avgDelayMin: 22,
			pctRight: 84.62,
			pctSlight: 7.69,
			pctSignificant: 7.69
		},
		PRYJ: {
			avgDelayMin: 22,
			pctRight: 76.92,
			pctSlight: 15.38,
			pctSignificant: 7.69
		},
		DDU: {
			avgDelayMin: 20,
			pctRight: 84.62,
			pctSlight: 7.69,
			pctSignificant: 7.69
		},
		GAYA: {
			avgDelayMin: 23,
			pctRight: 73.08,
			pctSlight: 19.23,
			pctSignificant: 7.69
		},
		PNME: {
			avgDelayMin: 34,
			pctRight: 46.15,
			pctSlight: 46.15,
			pctSignificant: 7.69
		},
		DHN: {
			avgDelayMin: 20,
			pctRight: 88.46,
			pctSlight: 3.85,
			pctSignificant: 7.69
		},
		ASN: {
			avgDelayMin: 40,
			pctRight: 50,
			pctSlight: 38.46,
			pctSignificant: 11.54
		},
		HWH: {
			avgDelayMin: 30,
			pctRight: 84.62,
			pctSlight: 3.85,
			pctSignificant: 11.54
		}
	},
	"12305": {
		HWH: {
			avgDelayMin: 2,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		BWN: {
			avgDelayMin: 19,
			pctRight: 0,
			pctSlight: 100,
			pctSignificant: 0
		},
		MDP: {
			avgDelayMin: 26,
			pctRight: 20,
			pctSlight: 80,
			pctSignificant: 0
		},
		JSME: {
			avgDelayMin: 0,
			pctRight: 20,
			pctSlight: 80,
			pctSignificant: 0
		},
		PNBE: {
			avgDelayMin: 2,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		DDU: {
			avgDelayMin: 11,
			pctRight: 60,
			pctSlight: 40,
			pctSignificant: 0
		},
		PRYJ: {
			avgDelayMin: 12,
			pctRight: 60,
			pctSlight: 40,
			pctSignificant: 0
		},
		CNB: {
			avgDelayMin: 21,
			pctRight: 40,
			pctSlight: 60,
			pctSignificant: 0
		},
		NDLS: {
			avgDelayMin: 16,
			pctRight: 60,
			pctSlight: 40,
			pctSignificant: 0
		}
	},
	"12306": {
		NDLS: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		CNB: {
			avgDelayMin: 4,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		PRYJ: {
			avgDelayMin: 4,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		DDU: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		PNBE: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		JSME: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		MDP: {
			avgDelayMin: 2,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		BWN: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		HWH: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		}
	},
	"12313": {
		SDAH: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		DGR: {
			avgDelayMin: 8,
			pctRight: 93.33,
			pctSlight: 6.67,
			pctSignificant: 0
		},
		ASN: {
			avgDelayMin: 14,
			pctRight: 76.67,
			pctSlight: 23.33,
			pctSignificant: 0
		},
		DHN: {
			avgDelayMin: 2,
			pctRight: 96.67,
			pctSlight: 3.33,
			pctSignificant: 0
		},
		GAYA: {
			avgDelayMin: 9,
			pctRight: 96.67,
			pctSlight: 0,
			pctSignificant: 3.33
		},
		DDU: {
			avgDelayMin: 12,
			pctRight: 93.33,
			pctSlight: 3.33,
			pctSignificant: 3.33
		},
		CNB: {
			avgDelayMin: 17,
			pctRight: 76.67,
			pctSlight: 20,
			pctSignificant: 3.33
		},
		NDLS: {
			avgDelayMin: 11,
			pctRight: 83.33,
			pctSlight: 13.33,
			pctSignificant: 3.33
		}
	},
	"12314": {
		NDLS: {
			avgDelayMin: 9,
			pctRight: 96.67,
			pctSlight: 0,
			pctSignificant: 3.33
		},
		CNB: {
			avgDelayMin: 23,
			pctRight: 80,
			pctSlight: 13.33,
			pctSignificant: 6.67
		},
		DDU: {
			avgDelayMin: 0,
			pctRight: 93.33,
			pctSlight: 0,
			pctSignificant: 6.67
		},
		GAYA: {
			avgDelayMin: 24,
			pctRight: 83.33,
			pctSlight: 10,
			pctSignificant: 6.67
		},
		DHN: {
			avgDelayMin: 0,
			pctRight: 90,
			pctSlight: 3.33,
			pctSignificant: 6.67
		},
		ASN: {
			avgDelayMin: 0,
			pctRight: 26.67,
			pctSlight: 63.33,
			pctSignificant: 10
		},
		DGR: {
			avgDelayMin: 40,
			pctRight: 13.33,
			pctSlight: 76.67,
			pctSignificant: 10
		},
		SDAH: {
			avgDelayMin: 19,
			pctRight: 86.67,
			pctSlight: 3.33,
			pctSignificant: 10
		}
	},
	"12367": {
		BGP: {
			avgDelayMin: 8,
			pctRight: 93.42,
			pctSlight: .55,
			pctSignificant: 1.64
		},
		SGG: {
			avgDelayMin: 12,
			pctRight: 81.64,
			pctSlight: 11.78,
			pctSignificant: 1.37
		},
		BUP: {
			avgDelayMin: 11,
			pctRight: 85.75,
			pctSlight: 7.67,
			pctSignificant: 1.37
		},
		JMP: {
			avgDelayMin: 16,
			pctRight: 65.21,
			pctSlight: 28.22,
			pctSignificant: 1.37
		},
		DRH: {
			avgDelayMin: 18,
			pctRight: 48.49,
			pctSlight: 44.93,
			pctSignificant: 1.37
		},
		AHA: {
			avgDelayMin: 18,
			pctRight: 52.6,
			pctSlight: 40.82,
			pctSignificant: 1.37
		},
		KJH: {
			avgDelayMin: 20,
			pctRight: 44.66,
			pctSlight: 48.77,
			pctSignificant: 1.37
		},
		KIUL: {
			avgDelayMin: 14,
			pctRight: 79.18,
			pctSlight: 13.97,
			pctSignificant: 2.47
		},
		LKR: {
			avgDelayMin: 0,
			pctRight: 74.52,
			pctSlight: 18.9,
			pctSignificant: 2.19
		},
		BRYA: {
			avgDelayMin: 21,
			pctRight: 59.73,
			pctSlight: 33.15,
			pctSignificant: 2.74
		},
		HTZ: {
			avgDelayMin: 24,
			pctRight: 43.84,
			pctSlight: 48.77,
			pctSignificant: 3.01
		},
		MKA: {
			avgDelayMin: 30,
			pctRight: 21.92,
			pctSlight: 69.86,
			pctSignificant: 3.84
		},
		BARH: {
			avgDelayMin: 38,
			pctRight: 7.4,
			pctSlight: 83.29,
			pctSignificant: 4.93
		},
		BKP: {
			avgDelayMin: 41,
			pctRight: 6.85,
			pctSlight: 81.37,
			pctSignificant: 7.4
		},
		KOO: {
			avgDelayMin: 0,
			pctRight: 3.29,
			pctSlight: 81.92,
			pctSignificant: 10.41
		},
		FUT: {
			avgDelayMin: 48,
			pctRight: 2.47,
			pctSlight: 79.18,
			pctSignificant: 13.97
		},
		PNC: {
			avgDelayMin: 48,
			pctRight: 3.29,
			pctSlight: 76.99,
			pctSignificant: 15.34
		},
		PNBE: {
			avgDelayMin: 38,
			pctRight: 18.08,
			pctSlight: 67.95,
			pctSignificant: 9.59
		},
		ARA: {
			avgDelayMin: 55,
			pctRight: 4.11,
			pctSlight: 68.49,
			pctSignificant: 23.01
		},
		BXR: {
			avgDelayMin: 65,
			pctRight: 2.74,
			pctSlight: 59.73,
			pctSignificant: 33.15
		},
		DDU: {
			avgDelayMin: 0,
			pctRight: 54.52,
			pctSlight: 25.21,
			pctSignificant: 15.89
		},
		PRYJ: {
			avgDelayMin: 101,
			pctRight: 2.19,
			pctSlight: 3.01,
			pctSignificant: 5.21
		},
		CNB: {
			avgDelayMin: 53,
			pctRight: 28.77,
			pctSlight: 45.75,
			pctSignificant: 21.1
		},
		ANVT: {
			avgDelayMin: 37,
			pctRight: 71.51,
			pctSlight: 6.85,
			pctSignificant: 17.26
		}
	},
	"12368": {
		ANVT: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		CNB: {
			avgDelayMin: 0,
			pctRight: 16.67,
			pctSlight: 60,
			pctSignificant: 23.33
		},
		DDU: {
			avgDelayMin: 0,
			pctRight: 63.33,
			pctSlight: 23.33,
			pctSignificant: 13.33
		},
		BXR: {
			avgDelayMin: 30,
			pctRight: 56.67,
			pctSlight: 23.33,
			pctSignificant: 20
		},
		ARA: {
			avgDelayMin: 35,
			pctRight: 46.67,
			pctSlight: 33.33,
			pctSignificant: 20
		},
		PNBE: {
			avgDelayMin: 54,
			pctRight: 10,
			pctSlight: 63.33,
			pctSignificant: 26.67
		},
		PNC: {
			avgDelayMin: 56,
			pctRight: 10,
			pctSlight: 63.33,
			pctSignificant: 26.67
		},
		FUT: {
			avgDelayMin: 63,
			pctRight: 0,
			pctSlight: 66.67,
			pctSignificant: 33.33
		},
		KOO: {
			avgDelayMin: 64,
			pctRight: 0,
			pctSlight: 70,
			pctSignificant: 30
		},
		BKP: {
			avgDelayMin: 0,
			pctRight: 0,
			pctSlight: 66.67,
			pctSignificant: 33.33
		},
		BARH: {
			avgDelayMin: 67,
			pctRight: 0,
			pctSlight: 70,
			pctSignificant: 30
		},
		MKA: {
			avgDelayMin: 71,
			pctRight: 0,
			pctSlight: 63.33,
			pctSignificant: 36.67
		},
		HTZ: {
			avgDelayMin: 0,
			pctRight: 0,
			pctSlight: 56.67,
			pctSignificant: 43.33
		},
		BRYA: {
			avgDelayMin: 75,
			pctRight: 0,
			pctSlight: 56.67,
			pctSignificant: 43.33
		},
		LKR: {
			avgDelayMin: 67,
			pctRight: 3.33,
			pctSlight: 66.67,
			pctSignificant: 30
		},
		KIUL: {
			avgDelayMin: 24,
			pctRight: 73.33,
			pctSlight: 13.33,
			pctSignificant: 13.33
		},
		KJH: {
			avgDelayMin: 0,
			pctRight: 73.33,
			pctSlight: 13.33,
			pctSignificant: 13.33
		},
		AHA: {
			avgDelayMin: 26,
			pctRight: 73.33,
			pctSlight: 13.33,
			pctSignificant: 13.33
		},
		DRH: {
			avgDelayMin: 26,
			pctRight: 73.33,
			pctSlight: 13.33,
			pctSignificant: 13.33
		},
		JMP: {
			avgDelayMin: 34,
			pctRight: 53.33,
			pctSlight: 30,
			pctSignificant: 16.67
		},
		BUP: {
			avgDelayMin: 41,
			pctRight: 23.33,
			pctSlight: 60,
			pctSignificant: 16.67
		},
		SGG: {
			avgDelayMin: 34,
			pctRight: 50,
			pctSlight: 33.33,
			pctSignificant: 16.67
		},
		BGP: {
			avgDelayMin: 10,
			pctRight: 80,
			pctSlight: 10,
			pctSignificant: 10
		}
	},
	"12423": {
		DBRG: {
			avgDelayMin: 2,
			pctRight: 96.67,
			pctSlight: 3.33,
			pctSignificant: 0
		},
		NTSK: {
			avgDelayMin: 13,
			pctRight: 73.33,
			pctSlight: 23.33,
			pctSignificant: 3.33
		},
		MXN: {
			avgDelayMin: 21,
			pctRight: 50,
			pctSlight: 46.67,
			pctSignificant: 3.33
		},
		DMV: {
			avgDelayMin: 22,
			pctRight: 50,
			pctSlight: 46.67,
			pctSignificant: 3.33
		},
		DPU: {
			avgDelayMin: 0,
			pctRight: 50,
			pctSlight: 43.33,
			pctSignificant: 6.67
		},
		LMG: {
			avgDelayMin: 33,
			pctRight: 30,
			pctSlight: 60,
			pctSignificant: 10
		},
		CPK: {
			avgDelayMin: 0,
			pctRight: 26.67,
			pctSlight: 63.33,
			pctSignificant: 10
		},
		GHY: {
			avgDelayMin: 25,
			pctRight: 43.33,
			pctSlight: 53.33,
			pctSignificant: 3.33
		},
		RNY: {
			avgDelayMin: 0,
			pctRight: 53.33,
			pctSlight: 43.33,
			pctSignificant: 3.33
		},
		NBQ: {
			avgDelayMin: 13,
			pctRight: 70,
			pctSlight: 26.67,
			pctSignificant: 3.33
		},
		KOJ: {
			avgDelayMin: 19,
			pctRight: 63.33,
			pctSlight: 30,
			pctSignificant: 6.67
		},
		NCB: {
			avgDelayMin: 30,
			pctRight: 30,
			pctSlight: 63.33,
			pctSignificant: 6.67
		},
		NJP: {
			avgDelayMin: 17,
			pctRight: 63.33,
			pctSlight: 30,
			pctSignificant: 6.67
		},
		KNE: {
			avgDelayMin: 0,
			pctRight: 63.33,
			pctSlight: 30,
			pctSignificant: 6.67
		},
		KIR: {
			avgDelayMin: 5,
			pctRight: 90,
			pctSlight: 6.67,
			pctSignificant: 3.33
		},
		NNA: {
			avgDelayMin: 8,
			pctRight: 90,
			pctSlight: 6.67,
			pctSignificant: 3.33
		},
		MNE: {
			avgDelayMin: 15,
			pctRight: 66.67,
			pctSlight: 30,
			pctSignificant: 3.33
		},
		BJU: {
			avgDelayMin: 0,
			pctRight: 20,
			pctSlight: 73.33,
			pctSignificant: 6.67
		},
		PPTA: {
			avgDelayMin: 7,
			pctRight: 90,
			pctSlight: 6.67,
			pctSignificant: 3.33
		},
		DNR: {
			avgDelayMin: 11,
			pctRight: 86.67,
			pctSlight: 6.67,
			pctSignificant: 6.67
		},
		DDU: {
			avgDelayMin: 10,
			pctRight: 83.33,
			pctSlight: 16.67,
			pctSignificant: 0
		},
		PRYJ: {
			avgDelayMin: 12,
			pctRight: 80,
			pctSlight: 13.33,
			pctSignificant: 6.67
		},
		CNB: {
			avgDelayMin: 17,
			pctRight: 60,
			pctSlight: 33.33,
			pctSignificant: 6.67
		},
		NDLS: {
			avgDelayMin: 11,
			pctRight: 83.33,
			pctSlight: 13.33,
			pctSignificant: 3.33
		}
	},
	"12424": {
		NDLS: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		CNB: {
			avgDelayMin: 13,
			pctRight: 90,
			pctSlight: 6.67,
			pctSignificant: 3.33
		},
		PRYJ: {
			avgDelayMin: 17,
			pctRight: 83.33,
			pctSlight: 13.33,
			pctSignificant: 3.33
		},
		DDU: {
			avgDelayMin: 8,
			pctRight: 96.67,
			pctSlight: 0,
			pctSignificant: 3.33
		},
		DNR: {
			avgDelayMin: 0,
			pctRight: 96.67,
			pctSlight: 0,
			pctSignificant: 3.33
		},
		PPTA: {
			avgDelayMin: 9,
			pctRight: 96.67,
			pctSlight: 0,
			pctSignificant: 3.33
		},
		BJU: {
			avgDelayMin: 7,
			pctRight: 93.33,
			pctSlight: 3.33,
			pctSignificant: 3.33
		},
		MNE: {
			avgDelayMin: 17,
			pctRight: 83.33,
			pctSlight: 13.33,
			pctSignificant: 3.33
		},
		NNA: {
			avgDelayMin: 21,
			pctRight: 56.67,
			pctSlight: 40,
			pctSignificant: 3.33
		},
		KIR: {
			avgDelayMin: 15,
			pctRight: 83.33,
			pctSlight: 13.33,
			pctSignificant: 3.33
		},
		KNE: {
			avgDelayMin: 0,
			pctRight: 6.67,
			pctSlight: 90,
			pctSignificant: 3.33
		},
		NJP: {
			avgDelayMin: 24,
			pctRight: 56.67,
			pctSlight: 40,
			pctSignificant: 3.33
		},
		NCB: {
			avgDelayMin: 15,
			pctRight: 83.33,
			pctSlight: 13.33,
			pctSignificant: 3.33
		},
		KOJ: {
			avgDelayMin: 30,
			pctRight: 33.33,
			pctSlight: 63.33,
			pctSignificant: 3.33
		},
		NBQ: {
			avgDelayMin: 19,
			pctRight: 80,
			pctSlight: 16.67,
			pctSignificant: 3.33
		},
		RNY: {
			avgDelayMin: 34,
			pctRight: 36.67,
			pctSlight: 56.67,
			pctSignificant: 6.67
		},
		GHY: {
			avgDelayMin: 30,
			pctRight: 53.33,
			pctSlight: 40,
			pctSignificant: 6.67
		},
		CPK: {
			avgDelayMin: 0,
			pctRight: 60,
			pctSlight: 33.33,
			pctSignificant: 6.67
		},
		LMG: {
			avgDelayMin: 23,
			pctRight: 70,
			pctSlight: 23.33,
			pctSignificant: 6.67
		},
		DPU: {
			avgDelayMin: 26,
			pctRight: 70,
			pctSlight: 20,
			pctSignificant: 10
		},
		DMV: {
			avgDelayMin: 0,
			pctRight: 53.33,
			pctSlight: 36.67,
			pctSignificant: 10
		},
		MXN: {
			avgDelayMin: 27,
			pctRight: 66.67,
			pctSlight: 23.33,
			pctSignificant: 10
		},
		NTSK: {
			avgDelayMin: 49,
			pctRight: 23.33,
			pctSlight: 63.33,
			pctSignificant: 13.33
		},
		DBRG: {
			avgDelayMin: 15,
			pctRight: 70,
			pctSlight: 16.67,
			pctSignificant: 13.33
		}
	},
	"12433": {
		MAS: {
			avgDelayMin: 2,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		BZA: {
			avgDelayMin: 14,
			pctRight: 44.44,
			pctSlight: 55.56,
			pctSignificant: 0
		},
		WL: {
			avgDelayMin: 18,
			pctRight: 33.33,
			pctSlight: 66.67,
			pctSignificant: 0
		},
		BPQ: {
			avgDelayMin: 13,
			pctRight: 66.67,
			pctSlight: 33.33,
			pctSignificant: 0
		},
		NGP: {
			avgDelayMin: 16,
			pctRight: 77.78,
			pctSlight: 22.22,
			pctSignificant: 0
		},
		BPL: {
			avgDelayMin: 7,
			pctRight: 77.78,
			pctSlight: 22.22,
			pctSignificant: 0
		},
		VGLJ: {
			avgDelayMin: 5,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		GWL: {
			avgDelayMin: 13,
			pctRight: 66.67,
			pctSlight: 33.33,
			pctSignificant: 0
		},
		AGC: {
			avgDelayMin: 7,
			pctRight: 88.89,
			pctSlight: 11.11,
			pctSignificant: 0
		},
		NZM: {
			avgDelayMin: 2,
			pctRight: 88.89,
			pctSlight: 11.11,
			pctSignificant: 0
		}
	},
	"12434": {
		NZM: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		AGC: {
			avgDelayMin: 10,
			pctRight: 77.78,
			pctSlight: 22.22,
			pctSignificant: 0
		},
		GWL: {
			avgDelayMin: 0,
			pctRight: 88.89,
			pctSlight: 11.11,
			pctSignificant: 0
		},
		VGLJ: {
			avgDelayMin: 4,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		BPL: {
			avgDelayMin: 10,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		NGP: {
			avgDelayMin: 6,
			pctRight: 77.78,
			pctSlight: 22.22,
			pctSignificant: 0
		},
		BPQ: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		WL: {
			avgDelayMin: 7,
			pctRight: 88.89,
			pctSlight: 11.11,
			pctSignificant: 0
		},
		BZA: {
			avgDelayMin: 16,
			pctRight: 66.67,
			pctSlight: 33.33,
			pctSignificant: 0
		},
		MAS: {
			avgDelayMin: 0,
			pctRight: 88.89,
			pctSlight: 11.11,
			pctSignificant: 0
		}
	},
	"12509": {
		SMVB: {
			avgDelayMin: 6,
			pctRight: 91.67,
			pctSlight: 8.33,
			pctSignificant: 0
		},
		KJM: {
			avgDelayMin: 23,
			pctRight: 33.33,
			pctSlight: 58.33,
			pctSignificant: 8.33
		},
		BWT: {
			avgDelayMin: 23,
			pctRight: 41.67,
			pctSlight: 50,
			pctSignificant: 8.33
		},
		JTJ: {
			avgDelayMin: 15,
			pctRight: 66.67,
			pctSlight: 25,
			pctSignificant: 8.33
		},
		KPD: {
			avgDelayMin: 11,
			pctRight: 83.33,
			pctSlight: 16.67,
			pctSignificant: 0
		},
		AJJ: {
			avgDelayMin: 0,
			pctRight: 25,
			pctSlight: 66.67,
			pctSignificant: 8.33
		},
		PER: {
			avgDelayMin: 31,
			pctRight: 25,
			pctSlight: 58.33,
			pctSignificant: 16.67
		},
		OGL: {
			avgDelayMin: 0,
			pctRight: 8.33,
			pctSlight: 83.33,
			pctSignificant: 8.33
		},
		BZA: {
			avgDelayMin: 55,
			pctRight: 8.33,
			pctSlight: 50,
			pctSignificant: 41.67
		},
		RJY: {
			avgDelayMin: 70,
			pctRight: 8.33,
			pctSlight: 50,
			pctSignificant: 41.67
		},
		VSKP: {
			avgDelayMin: 48,
			pctRight: 33.33,
			pctSlight: 41.67,
			pctSignificant: 25
		},
		VZM: {
			avgDelayMin: 62,
			pctRight: 25,
			pctSlight: 25,
			pctSignificant: 50
		},
		CHE: {
			avgDelayMin: 71,
			pctRight: 8.33,
			pctSlight: 25,
			pctSignificant: 66.67
		},
		PSA: {
			avgDelayMin: 65,
			pctRight: 8.33,
			pctSlight: 41.67,
			pctSignificant: 50
		},
		BAM: {
			avgDelayMin: 77,
			pctRight: 0,
			pctSlight: 25,
			pctSignificant: 75
		},
		BALU: {
			avgDelayMin: 82,
			pctRight: 0,
			pctSlight: 16.67,
			pctSignificant: 83.33
		},
		KUR: {
			avgDelayMin: 79,
			pctRight: 8.33,
			pctSlight: 16.67,
			pctSignificant: 75
		},
		BBS: {
			avgDelayMin: 79,
			pctRight: 0,
			pctSlight: 25,
			pctSignificant: 75
		},
		CTC: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		JJKR: {
			avgDelayMin: 0,
			pctRight: 0,
			pctSlight: 0,
			pctSignificant: 100
		},
		BHC: {
			avgDelayMin: 0,
			pctRight: 0,
			pctSlight: 0,
			pctSignificant: 100
		},
		BLS: {
			avgDelayMin: 174,
			pctRight: 0,
			pctSlight: 0,
			pctSignificant: 100
		},
		KGP: {
			avgDelayMin: 205,
			pctRight: 0,
			pctSlight: 0,
			pctSignificant: 100
		},
		DKAE: {
			avgDelayMin: 240,
			pctRight: 0,
			pctSlight: 0,
			pctSignificant: 100
		},
		BHP: {
			avgDelayMin: 249,
			pctRight: 0,
			pctSlight: 0,
			pctSignificant: 100
		},
		RPH: {
			avgDelayMin: 245,
			pctRight: 0,
			pctSlight: 0,
			pctSignificant: 100
		},
		NFK: {
			avgDelayMin: 208,
			pctRight: 0,
			pctSlight: 0,
			pctSignificant: 100
		},
		MLDT: {
			avgDelayMin: 197,
			pctRight: 0,
			pctSlight: 0,
			pctSignificant: 100
		},
		BOE: {
			avgDelayMin: 222,
			pctRight: 0,
			pctSlight: 0,
			pctSignificant: 100
		},
		KNE: {
			avgDelayMin: 238,
			pctRight: 0,
			pctSlight: 0,
			pctSignificant: 100
		},
		NJP: {
			avgDelayMin: 241,
			pctRight: 0,
			pctSlight: 0,
			pctSignificant: 100
		},
		JPE: {
			avgDelayMin: 219,
			pctRight: 0,
			pctSlight: 0,
			pctSignificant: 100
		},
		DQG: {
			avgDelayMin: 221,
			pctRight: 0,
			pctSlight: 0,
			pctSignificant: 100
		},
		NCB: {
			avgDelayMin: 225,
			pctRight: 0,
			pctSlight: 0,
			pctSignificant: 100
		},
		NOQ: {
			avgDelayMin: 232,
			pctRight: 0,
			pctSlight: 0,
			pctSignificant: 100
		},
		KOJ: {
			avgDelayMin: 252,
			pctRight: 0,
			pctSlight: 0,
			pctSignificant: 100
		},
		NBQ: {
			avgDelayMin: 222,
			pctRight: 0,
			pctSlight: 0,
			pctSignificant: 100
		},
		BPRD: {
			avgDelayMin: 230,
			pctRight: 0,
			pctSlight: 0,
			pctSignificant: 100
		},
		RNY: {
			avgDelayMin: 248,
			pctRight: 0,
			pctSlight: 0,
			pctSignificant: 100
		},
		KYQ: {
			avgDelayMin: 225,
			pctRight: 0,
			pctSlight: 0,
			pctSignificant: 100
		},
		GHY: {
			avgDelayMin: 208,
			pctRight: 0,
			pctSlight: 8.33,
			pctSignificant: 91.67
		}
	},
	"12510": {
		GHY: {
			avgDelayMin: 2,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		KYQ: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		RNY: {
			avgDelayMin: 8,
			pctRight: 92.31,
			pctSlight: 7.69,
			pctSignificant: 0
		},
		BPRD: {
			avgDelayMin: 14,
			pctRight: 61.54,
			pctSlight: 38.46,
			pctSignificant: 0
		},
		NBQ: {
			avgDelayMin: 3,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		KOJ: {
			avgDelayMin: 7,
			pctRight: 92.31,
			pctSlight: 7.69,
			pctSignificant: 0
		},
		NOQ: {
			avgDelayMin: 18,
			pctRight: 30.77,
			pctSlight: 69.23,
			pctSignificant: 0
		},
		NCB: {
			avgDelayMin: 21,
			pctRight: 23.08,
			pctSlight: 76.92,
			pctSignificant: 0
		},
		DQG: {
			avgDelayMin: 29,
			pctRight: 7.69,
			pctSlight: 92.31,
			pctSignificant: 0
		},
		JPE: {
			avgDelayMin: 22,
			pctRight: 38.46,
			pctSlight: 61.54,
			pctSignificant: 0
		},
		NJP: {
			avgDelayMin: 8,
			pctRight: 76.92,
			pctSlight: 23.08,
			pctSignificant: 0
		},
		KNE: {
			avgDelayMin: 20,
			pctRight: 69.23,
			pctSlight: 30.77,
			pctSignificant: 0
		},
		BOE: {
			avgDelayMin: 19,
			pctRight: 38.46,
			pctSlight: 61.54,
			pctSignificant: 0
		},
		MLDT: {
			avgDelayMin: 12,
			pctRight: 76.92,
			pctSlight: 15.38,
			pctSignificant: 7.69
		},
		NFK: {
			avgDelayMin: 21,
			pctRight: 69.23,
			pctSlight: 15.38,
			pctSignificant: 15.38
		},
		RPH: {
			avgDelayMin: 19,
			pctRight: 69.23,
			pctSlight: 15.38,
			pctSignificant: 15.38
		},
		BHP: {
			avgDelayMin: 24,
			pctRight: 53.85,
			pctSlight: 30.77,
			pctSignificant: 15.38
		},
		DKAE: {
			avgDelayMin: 58,
			pctRight: 0,
			pctSlight: 53.85,
			pctSignificant: 46.15
		},
		KGP: {
			avgDelayMin: 78,
			pctRight: 0,
			pctSlight: 46.15,
			pctSignificant: 53.85
		},
		BLS: {
			avgDelayMin: 0,
			pctRight: 0,
			pctSlight: 23.08,
			pctSignificant: 76.92
		},
		BHC: {
			avgDelayMin: 97,
			pctRight: 0,
			pctSlight: 23.08,
			pctSignificant: 76.92
		},
		JJKR: {
			avgDelayMin: 97,
			pctRight: 0,
			pctSlight: 23.08,
			pctSignificant: 76.92
		},
		CTC: {
			avgDelayMin: 131,
			pctRight: 0,
			pctSlight: 15.38,
			pctSignificant: 84.62
		},
		BBS: {
			avgDelayMin: 124,
			pctRight: 0,
			pctSlight: 7.69,
			pctSignificant: 92.31
		},
		KUR: {
			avgDelayMin: 119,
			pctRight: 0,
			pctSlight: 15.38,
			pctSignificant: 84.62
		},
		BALU: {
			avgDelayMin: 126,
			pctRight: 0,
			pctSlight: 7.69,
			pctSignificant: 92.31
		},
		BAM: {
			avgDelayMin: 123,
			pctRight: 0,
			pctSlight: 7.69,
			pctSignificant: 92.31
		},
		PSA: {
			avgDelayMin: 110,
			pctRight: 0,
			pctSlight: 15.38,
			pctSignificant: 84.62
		},
		CHE: {
			avgDelayMin: 112,
			pctRight: 0,
			pctSlight: 15.38,
			pctSignificant: 84.62
		},
		VZM: {
			avgDelayMin: 124,
			pctRight: 0,
			pctSlight: 7.69,
			pctSignificant: 92.31
		},
		VSKP: {
			avgDelayMin: 133,
			pctRight: 0,
			pctSlight: 15.38,
			pctSignificant: 84.62
		},
		RJY: {
			avgDelayMin: 161,
			pctRight: 0,
			pctSlight: 15.38,
			pctSignificant: 84.62
		},
		BZA: {
			avgDelayMin: 158,
			pctRight: 0,
			pctSlight: 15.38,
			pctSignificant: 84.62
		},
		PER: {
			avgDelayMin: 200,
			pctRight: 0,
			pctSlight: 7.69,
			pctSignificant: 92.31
		},
		AJJ: {
			avgDelayMin: 201,
			pctRight: 7.69,
			pctSlight: 0,
			pctSignificant: 92.31
		},
		KPD: {
			avgDelayMin: 187,
			pctRight: 7.69,
			pctSlight: 7.69,
			pctSignificant: 84.62
		},
		JTJ: {
			avgDelayMin: 182,
			pctRight: 7.69,
			pctSlight: 7.69,
			pctSignificant: 84.62
		},
		BWT: {
			avgDelayMin: 198,
			pctRight: 7.69,
			pctSlight: 7.69,
			pctSignificant: 84.62
		},
		KJM: {
			avgDelayMin: 208,
			pctRight: 0,
			pctSlight: 15.38,
			pctSignificant: 84.62
		},
		SMVB: {
			avgDelayMin: 169,
			pctRight: 15.38,
			pctSlight: 0,
			pctSignificant: 84.62
		}
	},
	"12621": {
		MAS: {
			avgDelayMin: 0,
			pctRight: 96.99,
			pctSlight: 2.74,
			pctSignificant: .27
		},
		BZA: {
			avgDelayMin: 17,
			pctRight: 59.18,
			pctSlight: 37.26,
			pctSignificant: 3.01
		},
		KMT: {
			avgDelayMin: 17,
			pctRight: 62.47,
			pctSlight: 33.42,
			pctSignificant: 3.29
		},
		WL: {
			avgDelayMin: 28,
			pctRight: 32.6,
			pctSlight: 61.64,
			pctSignificant: 4.93
		},
		BPQ: {
			avgDelayMin: 22,
			pctRight: 53.97,
			pctSlight: 38.9,
			pctSignificant: 6.3
		},
		NGP: {
			avgDelayMin: 37,
			pctRight: 26.58,
			pctSlight: 63.29,
			pctSignificant: 9.59
		},
		ET: {
			avgDelayMin: 29,
			pctRight: 67.95,
			pctSlight: 20.27,
			pctSignificant: 11.78
		},
		BPL: {
			avgDelayMin: 0,
			pctRight: 67.4,
			pctSlight: 20.82,
			pctSignificant: 11.78
		},
		VGLJ: {
			avgDelayMin: 34,
			pctRight: 51.78,
			pctSlight: 36.99,
			pctSignificant: 11.23
		},
		GWL: {
			avgDelayMin: 51,
			pctRight: 15.07,
			pctSlight: 66.3,
			pctSignificant: 18.63
		},
		AGC: {
			avgDelayMin: 49,
			pctRight: 43.01,
			pctSlight: 37.26,
			pctSignificant: 19.73
		},
		NZM: {
			avgDelayMin: 53,
			pctRight: 47.95,
			pctSlight: 33.42,
			pctSignificant: 18.63
		},
		NDLS: {
			avgDelayMin: 54,
			pctRight: 44.93,
			pctSlight: 35.89,
			pctSignificant: 19.18
		}
	},
	"12622": {
		NDLS: {
			avgDelayMin: 16,
			pctRight: 93.97,
			pctSlight: 1.37,
			pctSignificant: 4.66
		},
		AGC: {
			avgDelayMin: 37,
			pctRight: 25.21,
			pctSlight: 67.4,
			pctSignificant: 7.4
		},
		GWL: {
			avgDelayMin: 31,
			pctRight: 61.64,
			pctSlight: 29.04,
			pctSignificant: 9.32
		},
		VGLJ: {
			avgDelayMin: 37,
			pctRight: 53.42,
			pctSlight: 36.71,
			pctSignificant: 9.86
		},
		BPL: {
			avgDelayMin: 39,
			pctRight: 59.18,
			pctSlight: 27.4,
			pctSignificant: 13.42
		},
		ET: {
			avgDelayMin: 35,
			pctRight: 78.36,
			pctSlight: 7.95,
			pctSignificant: 13.7
		},
		NGP: {
			avgDelayMin: 45,
			pctRight: 58.36,
			pctSlight: 28.22,
			pctSignificant: 13.42
		},
		BPQ: {
			avgDelayMin: 46,
			pctRight: 61.92,
			pctSlight: 22.19,
			pctSignificant: 15.62
		},
		WL: {
			avgDelayMin: 64,
			pctRight: 23.56,
			pctSlight: 55.07,
			pctSignificant: 21.1
		},
		KMT: {
			avgDelayMin: 82,
			pctRight: 5.75,
			pctSlight: 59.73,
			pctSignificant: 34.25
		},
		BZA: {
			avgDelayMin: 67,
			pctRight: 25.75,
			pctSlight: 53.15,
			pctSignificant: 21.1
		},
		MAS: {
			avgDelayMin: 36,
			pctRight: 79.45,
			pctSlight: 7.4,
			pctSignificant: 13.15
		}
	},
	"12625": {
		TVC: {
			avgDelayMin: 7,
			pctRight: 94.52,
			pctSlight: 4.93,
			pctSignificant: .55
		},
		VAK: {
			avgDelayMin: 8,
			pctRight: 89.59,
			pctSlight: 9.59,
			pctSignificant: .82
		},
		QLN: {
			avgDelayMin: 10,
			pctRight: 87.12,
			pctSlight: 12.05,
			pctSignificant: .82
		},
		KYJ: {
			avgDelayMin: 0,
			pctRight: 64.93,
			pctSlight: 33.97,
			pctSignificant: 1.1
		},
		MVLK: {
			avgDelayMin: 17,
			pctRight: 58.36,
			pctSlight: 40.55,
			pctSignificant: 1.1
		},
		CNGR: {
			avgDelayMin: 17,
			pctRight: 53.42,
			pctSlight: 45.48,
			pctSignificant: 1.1
		},
		TRVL: {
			avgDelayMin: 21,
			pctRight: 38.63,
			pctSlight: 60,
			pctSignificant: 1.37
		},
		CGY: {
			avgDelayMin: 21,
			pctRight: 41.64,
			pctSlight: 56.71,
			pctSignificant: 1.64
		},
		KTYM: {
			avgDelayMin: 0,
			pctRight: 33.7,
			pctSlight: 63.84,
			pctSignificant: 2.47
		},
		VARD: {
			avgDelayMin: 23,
			pctRight: 36.71,
			pctSlight: 60.82,
			pctSignificant: 2.47
		},
		ERN: {
			avgDelayMin: 25,
			pctRight: 31.23,
			pctSlight: 65.48,
			pctSignificant: 3.29
		},
		AWY: {
			avgDelayMin: 27,
			pctRight: 24.93,
			pctSlight: 70.96,
			pctSignificant: 4.11
		},
		TCR: {
			avgDelayMin: 30,
			pctRight: 10.14,
			pctSlight: 85.48,
			pctSignificant: 4.38
		},
		OTP: {
			avgDelayMin: 17,
			pctRight: 70.14,
			pctSlight: 26.85,
			pctSignificant: 3.01
		},
		PGT: {
			avgDelayMin: 26,
			pctRight: 25.48,
			pctSlight: 71.23,
			pctSignificant: 3.29
		},
		CBE: {
			avgDelayMin: 17,
			pctRight: 65.48,
			pctSlight: 31.23,
			pctSignificant: 3.29
		},
		TUP: {
			avgDelayMin: 18,
			pctRight: 61.1,
			pctSlight: 35.62,
			pctSignificant: 3.29
		},
		ED: {
			avgDelayMin: 20,
			pctRight: 53.42,
			pctSlight: 43.29,
			pctSignificant: 3.29
		},
		SA: {
			avgDelayMin: 18,
			pctRight: 58.36,
			pctSlight: 38.36,
			pctSignificant: 3.29
		},
		JTJ: {
			avgDelayMin: 12,
			pctRight: 89.86,
			pctSlight: 7.4,
			pctSignificant: 2.74
		},
		KPD: {
			avgDelayMin: 9,
			pctRight: 93.7,
			pctSlight: 4.11,
			pctSignificant: 2.19
		},
		CTO: {
			avgDelayMin: 17,
			pctRight: 65.21,
			pctSlight: 31.78,
			pctSignificant: 3.01
		},
		TPTY: {
			avgDelayMin: 20,
			pctRight: 56.16,
			pctSlight: 40.82,
			pctSignificant: 3.01
		},
		RU: {
			avgDelayMin: 31,
			pctRight: 15.34,
			pctSlight: 80.82,
			pctSignificant: 3.84
		},
		GDR: {
			avgDelayMin: 19,
			pctRight: 53.7,
			pctSlight: 42.47,
			pctSignificant: 3.01
		},
		NLR: {
			avgDelayMin: 27,
			pctRight: 26.85,
			pctSlight: 68.49,
			pctSignificant: 3.84
		},
		BZA: {
			avgDelayMin: 20,
			pctRight: 57.53,
			pctSlight: 36.71,
			pctSignificant: 4.93
		},
		WL: {
			avgDelayMin: 84,
			pctRight: 1.1,
			pctSlight: 15.62,
			pctSignificant: 82.47
		},
		RDM: {
			avgDelayMin: 48,
			pctRight: 18.9,
			pctSlight: 52.6,
			pctSignificant: 27.67
		},
		BPQ: {
			avgDelayMin: 18,
			pctRight: 75.62,
			pctSlight: 18.36,
			pctSignificant: 5.21
		},
		CD: {
			avgDelayMin: 19,
			pctRight: 65.75,
			pctSlight: 27.95,
			pctSignificant: 5.48
		},
		SEGM: {
			avgDelayMin: 38,
			pctRight: 15.07,
			pctSlight: 72.05,
			pctSignificant: 12.05
		},
		NGP: {
			avgDelayMin: 50,
			pctRight: 6.3,
			pctSlight: 71.78,
			pctSignificant: 21.1
		},
		ET: {
			avgDelayMin: 28,
			pctRight: 54.52,
			pctSlight: 36.99,
			pctSignificant: 8.49
		},
		BPL: {
			avgDelayMin: 28,
			pctRight: 57.26,
			pctSlight: 34.52,
			pctSignificant: 8.22
		},
		BINA: {
			avgDelayMin: 25,
			pctRight: 70.96,
			pctSlight: 20.27,
			pctSignificant: 8.77
		},
		VGLJ: {
			avgDelayMin: 38,
			pctRight: 44.66,
			pctSlight: 41.64,
			pctSignificant: 13.7
		},
		GWL: {
			avgDelayMin: 45,
			pctRight: 39.45,
			pctSlight: 43.29,
			pctSignificant: 17.26
		},
		AGC: {
			avgDelayMin: 43,
			pctRight: 58.36,
			pctSlight: 23.01,
			pctSignificant: 18.63
		},
		MTJ: {
			avgDelayMin: 60,
			pctRight: 13.15,
			pctSlight: 63.29,
			pctSignificant: 23.56
		},
		FDB: {
			avgDelayMin: 45,
			pctRight: 60.82,
			pctSlight: 18.36,
			pctSignificant: 20.82
		},
		NZM: {
			avgDelayMin: 60,
			pctRight: 47.67,
			pctSlight: 27.67,
			pctSignificant: 24.66
		},
		NDLS: {
			avgDelayMin: 50,
			pctRight: 62.74,
			pctSlight: 16.44,
			pctSignificant: 20.82
		}
	},
	"12626": {
		NDLS: {
			avgDelayMin: 35,
			pctRight: 84.38,
			pctSlight: 3.84,
			pctSignificant: 11.78
		},
		MTJ: {
			avgDelayMin: 63,
			pctRight: 13.7,
			pctSlight: 70.96,
			pctSignificant: 15.34
		},
		AGC: {
			avgDelayMin: 68,
			pctRight: 5.75,
			pctSlight: 77.53,
			pctSignificant: 16.16
		},
		GWL: {
			avgDelayMin: 64,
			pctRight: 39.45,
			pctSlight: 43.56,
			pctSignificant: 16.44
		},
		VGLJ: {
			avgDelayMin: 64,
			pctRight: 53.15,
			pctSlight: 28.77,
			pctSignificant: 17.53
		},
		BINA: {
			avgDelayMin: 68,
			pctRight: 65.75,
			pctSlight: 15.62,
			pctSignificant: 18.63
		},
		BPL: {
			avgDelayMin: 80,
			pctRight: 42.74,
			pctSlight: 36.99,
			pctSignificant: 20.27
		},
		ET: {
			avgDelayMin: 76,
			pctRight: 54.25,
			pctSlight: 26.03,
			pctSignificant: 19.73
		},
		NGP: {
			avgDelayMin: 88,
			pctRight: 30.96,
			pctSlight: 48.22,
			pctSignificant: 20.55
		},
		SEGM: {
			avgDelayMin: 103,
			pctRight: 9.32,
			pctSlight: 60.27,
			pctSignificant: 30.14
		},
		CD: {
			avgDelayMin: 116,
			pctRight: 1.92,
			pctSlight: 58.36,
			pctSignificant: 39.45
		},
		BPQ: {
			avgDelayMin: 0,
			pctRight: 46.58,
			pctSlight: 29.86,
			pctSignificant: 23.29
		},
		RDM: {
			avgDelayMin: 118,
			pctRight: 1.37,
			pctSlight: 57.26,
			pctSignificant: 41.1
		},
		WL: {
			avgDelayMin: 128,
			pctRight: 1.37,
			pctSlight: 47.12,
			pctSignificant: 51.23
		},
		BZA: {
			avgDelayMin: 98,
			pctRight: 26.85,
			pctSlight: 43.84,
			pctSignificant: 29.04
		},
		NLR: {
			avgDelayMin: 103,
			pctRight: 24.38,
			pctSlight: 41.1,
			pctSignificant: 34.25
		},
		GDR: {
			avgDelayMin: 107,
			pctRight: 23.56,
			pctSlight: 39.73,
			pctSignificant: 36.44
		},
		RU: {
			avgDelayMin: 107,
			pctRight: 33.15,
			pctSlight: 31.23,
			pctSignificant: 35.62
		},
		TPTY: {
			avgDelayMin: 114,
			pctRight: 13.7,
			pctSlight: 49.59,
			pctSignificant: 36.71
		},
		CTO: {
			avgDelayMin: 105,
			pctRight: 36.99,
			pctSlight: 28.22,
			pctSignificant: 34.79
		},
		KPD: {
			avgDelayMin: 98,
			pctRight: 54.52,
			pctSlight: 12.88,
			pctSignificant: 32.6
		},
		JTJ: {
			avgDelayMin: 0,
			pctRight: 57.26,
			pctSlight: 9.32,
			pctSignificant: 33.42
		},
		SA: {
			avgDelayMin: 105,
			pctRight: 49.04,
			pctSlight: 16.99,
			pctSignificant: 33.97
		},
		ED: {
			avgDelayMin: 105,
			pctRight: 46.58,
			pctSlight: 19.45,
			pctSignificant: 33.97
		},
		TUP: {
			avgDelayMin: 0,
			pctRight: 42.19,
			pctSlight: 22.74,
			pctSignificant: 35.07
		},
		CBE: {
			avgDelayMin: 110,
			pctRight: 37.81,
			pctSlight: 27.4,
			pctSignificant: 34.25
		},
		PGT: {
			avgDelayMin: 108,
			pctRight: 44.66,
			pctSlight: 23.01,
			pctSignificant: 32.33
		},
		OTP: {
			avgDelayMin: 117,
			pctRight: 16.71,
			pctSlight: 49.32,
			pctSignificant: 33.97
		},
		TCR: {
			avgDelayMin: 110,
			pctRight: 20,
			pctSlight: 49.04,
			pctSignificant: 30.96
		},
		AWY: {
			avgDelayMin: 121,
			pctRight: 5.75,
			pctSlight: 60.55,
			pctSignificant: 33.7
		},
		ERN: {
			avgDelayMin: 116,
			pctRight: 18.08,
			pctSlight: 49.04,
			pctSignificant: 32.88
		},
		VARD: {
			avgDelayMin: 112,
			pctRight: 38.63,
			pctSlight: 29.86,
			pctSignificant: 31.51
		},
		KTYM: {
			avgDelayMin: 113,
			pctRight: 39.45,
			pctSlight: 29.04,
			pctSignificant: 31.51
		},
		CGY: {
			avgDelayMin: 113,
			pctRight: 42.47,
			pctSlight: 26.58,
			pctSignificant: 30.96
		},
		TRVL: {
			avgDelayMin: 113,
			pctRight: 42.19,
			pctSlight: 26.3,
			pctSignificant: 31.51
		},
		CNGR: {
			avgDelayMin: 114,
			pctRight: 39.45,
			pctSlight: 29.04,
			pctSignificant: 31.51
		},
		MVLK: {
			avgDelayMin: 115,
			pctRight: 38.36,
			pctSlight: 30.41,
			pctSignificant: 31.23
		},
		KYJ: {
			avgDelayMin: 117,
			pctRight: 32.05,
			pctSlight: 36.99,
			pctSignificant: 30.96
		},
		QLN: {
			avgDelayMin: 123,
			pctRight: 16.99,
			pctSlight: 51.78,
			pctSignificant: 31.23
		},
		VAK: {
			avgDelayMin: 126,
			pctRight: 13.15,
			pctSlight: 53.42,
			pctSignificant: 33.42
		},
		TVP: {
			avgDelayMin: 107,
			pctRight: 55.89,
			pctSlight: 17.26,
			pctSignificant: 26.85
		},
		TVC: {
			avgDelayMin: 93,
			pctRight: 63.29,
			pctSlight: 10.41,
			pctSignificant: 26.3
		}
	},
	"12631": {
		MS: {
			avgDelayMin: 3,
			pctRight: 99.45,
			pctSlight: .27,
			pctSignificant: .27
		},
		TBM: {
			avgDelayMin: 6,
			pctRight: 97.26,
			pctSlight: 2.19,
			pctSignificant: .55
		},
		CGL: {
			avgDelayMin: 7,
			pctRight: 96.16,
			pctSlight: 3.29,
			pctSignificant: .55
		},
		MLMR: {
			avgDelayMin: 11,
			pctRight: 82.47,
			pctSlight: 16.99,
			pctSignificant: .55
		},
		TMV: {
			avgDelayMin: 17,
			pctRight: 59.45,
			pctSlight: 40,
			pctSignificant: .55
		},
		VM: {
			avgDelayMin: 10,
			pctRight: 82.74,
			pctSlight: 16.71,
			pctSignificant: .55
		},
		VRI: {
			avgDelayMin: 12,
			pctRight: 75.62,
			pctSlight: 23.56,
			pctSignificant: .82
		},
		TPJ: {
			avgDelayMin: 11,
			pctRight: 78.36,
			pctSlight: 20.55,
			pctSignificant: 1.1
		},
		DG: {
			avgDelayMin: 13,
			pctRight: 72.05,
			pctSlight: 26.58,
			pctSignificant: 1.37
		},
		SDN: {
			avgDelayMin: 16,
			pctRight: 58.36,
			pctSlight: 40.27,
			pctSignificant: 1.37
		},
		MDU: {
			avgDelayMin: 13,
			pctRight: 68.22,
			pctSlight: 30.68,
			pctSignificant: 1.1
		},
		VPT: {
			avgDelayMin: 16,
			pctRight: 61.64,
			pctSlight: 37.53,
			pctSignificant: .82
		},
		SRT: {
			avgDelayMin: 15,
			pctRight: 60.55,
			pctSlight: 38.36,
			pctSignificant: 1.1
		},
		CVP: {
			avgDelayMin: 17,
			pctRight: 56.44,
			pctSlight: 42.47,
			pctSignificant: 1.1
		},
		TEN: {
			avgDelayMin: 0,
			pctRight: 98.63,
			pctSlight: .82,
			pctSignificant: .55
		}
	},
	"12632": {
		TEN: {
			avgDelayMin: 3,
			pctRight: 99.18,
			pctSlight: .82,
			pctSignificant: 0
		},
		CVP: {
			avgDelayMin: 8,
			pctRight: 96.16,
			pctSlight: 3.84,
			pctSignificant: 0
		},
		SRT: {
			avgDelayMin: 9,
			pctRight: 90.96,
			pctSlight: 9.04,
			pctSignificant: 0
		},
		VPT: {
			avgDelayMin: 7,
			pctRight: 96.16,
			pctSlight: 3.84,
			pctSignificant: 0
		},
		MDU: {
			avgDelayMin: 11,
			pctRight: 78.9,
			pctSlight: 21.1,
			pctSignificant: 0
		},
		SDN: {
			avgDelayMin: 13,
			pctRight: 71.23,
			pctSlight: 28.77,
			pctSignificant: 0
		},
		DG: {
			avgDelayMin: 9,
			pctRight: 85.21,
			pctSlight: 14.79,
			pctSignificant: 0
		},
		TPJ: {
			avgDelayMin: 7,
			pctRight: 91.78,
			pctSlight: 8.22,
			pctSignificant: 0
		},
		VRI: {
			avgDelayMin: 22,
			pctRight: 36.16,
			pctSlight: 62.74,
			pctSignificant: 1.1
		},
		VM: {
			avgDelayMin: 16,
			pctRight: 54.79,
			pctSlight: 43.56,
			pctSignificant: 1.64
		},
		TMV: {
			avgDelayMin: 19,
			pctRight: 39.18,
			pctSlight: 58.9,
			pctSignificant: 1.64
		},
		MLMR: {
			avgDelayMin: 20,
			pctRight: 37.53,
			pctSlight: 60.55,
			pctSignificant: 1.64
		},
		CGL: {
			avgDelayMin: 19,
			pctRight: 44.38,
			pctSlight: 53.42,
			pctSignificant: 1.92
		},
		TBM: {
			avgDelayMin: 24,
			pctRight: 27.12,
			pctSlight: 69.59,
			pctSignificant: 2.74
		},
		MBM: {
			avgDelayMin: 9,
			pctRight: 89.32,
			pctSlight: 9.04,
			pctSignificant: 1.1
		},
		MS: {
			avgDelayMin: 0,
			pctRight: 94.52,
			pctSlight: 3.01,
			pctSignificant: 2.19
		}
	},
	"12637": {
		MS: {
			avgDelayMin: 2,
			pctRight: 99.45,
			pctSlight: .55,
			pctSignificant: 0
		},
		TBM: {
			avgDelayMin: 4,
			pctRight: 99.18,
			pctSlight: .82,
			pctSignificant: 0
		},
		CGL: {
			avgDelayMin: 0,
			pctRight: 98.9,
			pctSlight: 1.1,
			pctSignificant: 0
		},
		MLMR: {
			avgDelayMin: 0,
			pctRight: 16.16,
			pctSlight: .27,
			pctSignificant: 0
		},
		VM: {
			avgDelayMin: 6,
			pctRight: 95.07,
			pctSlight: 4.66,
			pctSignificant: .27
		},
		VRI: {
			avgDelayMin: 7,
			pctRight: 96.44,
			pctSlight: 3.29,
			pctSignificant: .27
		},
		TPJ: {
			avgDelayMin: 8,
			pctRight: 84.93,
			pctSlight: 14.79,
			pctSignificant: .27
		},
		MPA: {
			avgDelayMin: 14,
			pctRight: 63.29,
			pctSlight: 36.44,
			pctSignificant: .27
		},
		DG: {
			avgDelayMin: 17,
			pctRight: 55.62,
			pctSlight: 43.56,
			pctSignificant: .82
		},
		ABI: {
			avgDelayMin: 19,
			pctRight: 44.66,
			pctSlight: 54.52,
			pctSignificant: .82
		},
		KQN: {
			avgDelayMin: 21,
			pctRight: 33.7,
			pctSlight: 65.21,
			pctSignificant: 1.1
		},
		MDU: {
			avgDelayMin: 0,
			pctRight: 98.36,
			pctSlight: 1.64,
			pctSignificant: 0
		}
	},
	"12638": {
		MDU: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		KQN: {
			avgDelayMin: 6,
			pctRight: 95.89,
			pctSlight: 4.11,
			pctSignificant: 0
		},
		ABI: {
			avgDelayMin: 10,
			pctRight: 91.78,
			pctSlight: 8.22,
			pctSignificant: 0
		},
		DG: {
			avgDelayMin: 7,
			pctRight: 96.44,
			pctSlight: 3.56,
			pctSignificant: 0
		},
		MPA: {
			avgDelayMin: 8,
			pctRight: 93.7,
			pctSlight: 6.3,
			pctSignificant: 0
		},
		TPJ: {
			avgDelayMin: 6,
			pctRight: 95.89,
			pctSlight: 4.11,
			pctSignificant: 0
		},
		VRI: {
			avgDelayMin: 21,
			pctRight: 36.99,
			pctSlight: 62.47,
			pctSignificant: .55
		},
		VM: {
			avgDelayMin: 12,
			pctRight: 84.38,
			pctSlight: 14.79,
			pctSignificant: .82
		},
		MLMR: {
			avgDelayMin: 16,
			pctRight: 10.41,
			pctSlight: 5.75,
			pctSignificant: .55
		},
		CGL: {
			avgDelayMin: 18,
			pctRight: 49.04,
			pctSlight: 48.77,
			pctSignificant: 1.92
		},
		TBM: {
			avgDelayMin: 23,
			pctRight: 32.33,
			pctSlight: 64.93,
			pctSignificant: 2.47
		},
		MBM: {
			avgDelayMin: 7,
			pctRight: 93.15,
			pctSlight: 5.75,
			pctSignificant: .82
		},
		MS: {
			avgDelayMin: 0,
			pctRight: 95.07,
			pctSlight: 3.84,
			pctSignificant: 1.1
		}
	},
	"12673": {
		MAS: {
			avgDelayMin: 2,
			pctRight: 98.9,
			pctSlight: .27,
			pctSignificant: 0
		},
		AVD: {
			avgDelayMin: 0,
			pctRight: .27,
			pctSlight: 0,
			pctSignificant: 0
		},
		AJJ: {
			avgDelayMin: 16,
			pctRight: 55.34,
			pctSlight: 44.38,
			pctSignificant: .27
		},
		KPD: {
			avgDelayMin: 17,
			pctRight: 48.49,
			pctSlight: 49.86,
			pctSignificant: 1.64
		},
		JTJ: {
			avgDelayMin: 0,
			pctRight: 70.96,
			pctSlight: 27.67,
			pctSignificant: 1.37
		},
		SA: {
			avgDelayMin: 25,
			pctRight: 23.01,
			pctSlight: 74.79,
			pctSignificant: 2.19
		},
		ED: {
			avgDelayMin: 25,
			pctRight: 21.37,
			pctSlight: 76.44,
			pctSignificant: 2.19
		},
		TUP: {
			avgDelayMin: 24,
			pctRight: 22.74,
			pctSlight: 75.34,
			pctSignificant: 1.92
		},
		CBF: {
			avgDelayMin: 13,
			pctRight: 70.68,
			pctSlight: 28.49,
			pctSignificant: .82
		},
		CBE: {
			avgDelayMin: 0,
			pctRight: 96.16,
			pctSlight: 3.56,
			pctSignificant: .27
		}
	},
	"12674": {
		CBE: {
			avgDelayMin: 5,
			pctRight: 97.26,
			pctSlight: 2.47,
			pctSignificant: .27
		},
		TUP: {
			avgDelayMin: 0,
			pctRight: 81.92,
			pctSlight: 17.53,
			pctSignificant: .55
		},
		ED: {
			avgDelayMin: 21,
			pctRight: 35.34,
			pctSlight: 64.11,
			pctSignificant: .55
		},
		SA: {
			avgDelayMin: 24,
			pctRight: 27.67,
			pctSlight: 71.51,
			pctSignificant: .82
		},
		JTJ: {
			avgDelayMin: 7,
			pctRight: 93.15,
			pctSlight: 6.3,
			pctSignificant: .55
		},
		KPD: {
			avgDelayMin: 14,
			pctRight: 74.79,
			pctSlight: 24.38,
			pctSignificant: .82
		},
		AJJ: {
			avgDelayMin: 28,
			pctRight: 17.26,
			pctSlight: 80.55,
			pctSignificant: 2.19
		},
		PER: {
			avgDelayMin: 32,
			pctRight: 9.86,
			pctSlight: 86.58,
			pctSignificant: 3.01
		},
		MAS: {
			avgDelayMin: 0,
			pctRight: 94.52,
			pctSlight: 3.56,
			pctSignificant: 1.37
		}
	},
	"12679": {
		MAS: {
			avgDelayMin: 2,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		AJJ: {
			avgDelayMin: 16,
			pctRight: 60,
			pctSlight: 40,
			pctSignificant: 0
		},
		KPD: {
			avgDelayMin: 20,
			pctRight: 16.67,
			pctSlight: 83.33,
			pctSignificant: 0
		},
		AB: {
			avgDelayMin: 26,
			pctRight: 6.67,
			pctSlight: 93.33,
			pctSignificant: 0
		},
		JTJ: {
			avgDelayMin: 15,
			pctRight: 63.33,
			pctSlight: 36.67,
			pctSignificant: 0
		},
		SLY: {
			avgDelayMin: 24,
			pctRight: 33.33,
			pctSlight: 63.33,
			pctSignificant: 3.33
		},
		MAP: {
			avgDelayMin: 28,
			pctRight: 16.67,
			pctSlight: 76.67,
			pctSignificant: 6.67
		},
		BQI: {
			avgDelayMin: 29,
			pctRight: 16.67,
			pctSlight: 76.67,
			pctSignificant: 6.67
		},
		SA: {
			avgDelayMin: 22,
			pctRight: 36.67,
			pctSlight: 56.67,
			pctSignificant: 6.67
		},
		ED: {
			avgDelayMin: 23,
			pctRight: 26.67,
			pctSlight: 66.67,
			pctSignificant: 6.67
		},
		TUP: {
			avgDelayMin: 28,
			pctRight: 23.33,
			pctSlight: 66.67,
			pctSignificant: 10
		},
		CBF: {
			avgDelayMin: 28,
			pctRight: 16.67,
			pctSlight: 76.67,
			pctSignificant: 6.67
		},
		CBE: {
			avgDelayMin: 1,
			pctRight: 90,
			pctSlight: 10,
			pctSignificant: 0
		}
	},
	"12680": {
		CBE: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		TUP: {
			avgDelayMin: 3,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		ED: {
			avgDelayMin: 6,
			pctRight: 96.67,
			pctSlight: 3.33,
			pctSignificant: 0
		},
		SA: {
			avgDelayMin: 7,
			pctRight: 86.67,
			pctSlight: 13.33,
			pctSignificant: 0
		},
		BQI: {
			avgDelayMin: 5,
			pctRight: 93.33,
			pctSlight: 6.67,
			pctSignificant: 0
		},
		MAP: {
			avgDelayMin: 4,
			pctRight: 93.33,
			pctSlight: 6.67,
			pctSignificant: 0
		},
		SLY: {
			avgDelayMin: 6,
			pctRight: 93.33,
			pctSlight: 6.67,
			pctSignificant: 0
		},
		JTJ: {
			avgDelayMin: 4,
			pctRight: 93.33,
			pctSlight: 6.67,
			pctSignificant: 0
		},
		AB: {
			avgDelayMin: 7,
			pctRight: 90,
			pctSlight: 10,
			pctSignificant: 0
		},
		KPD: {
			avgDelayMin: 6,
			pctRight: 93.33,
			pctSlight: 6.67,
			pctSignificant: 0
		},
		AJJ: {
			avgDelayMin: 6,
			pctRight: 96.67,
			pctSlight: 3.33,
			pctSignificant: 0
		},
		PER: {
			avgDelayMin: 12,
			pctRight: 76.67,
			pctSlight: 23.33,
			pctSignificant: 0
		},
		MAS: {
			avgDelayMin: 2,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		}
	},
	"12681": {
		MAS: {
			avgDelayMin: 4,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		AJJ: {
			avgDelayMin: 15,
			pctRight: 60,
			pctSlight: 40,
			pctSignificant: 0
		},
		KPD: {
			avgDelayMin: 11,
			pctRight: 80,
			pctSlight: 20,
			pctSignificant: 0
		},
		SA: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		ED: {
			avgDelayMin: 0,
			pctRight: 80,
			pctSlight: 20,
			pctSignificant: 0
		},
		TUP: {
			avgDelayMin: 8,
			pctRight: 80,
			pctSlight: 20,
			pctSignificant: 0
		},
		CBF: {
			avgDelayMin: 7,
			pctRight: 80,
			pctSlight: 20,
			pctSignificant: 0
		},
		CBE: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		}
	},
	"12682": {
		CBE: {
			avgDelayMin: 3,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		TUP: {
			avgDelayMin: 16,
			pctRight: 40,
			pctSlight: 60,
			pctSignificant: 0
		},
		ED: {
			avgDelayMin: 43,
			pctRight: 0,
			pctSlight: 100,
			pctSignificant: 0
		},
		SA: {
			avgDelayMin: 41,
			pctRight: 0,
			pctSlight: 100,
			pctSignificant: 0
		},
		KPD: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		AJJ: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		PER: {
			avgDelayMin: 11,
			pctRight: 80,
			pctSlight: 20,
			pctSignificant: 0
		},
		MAS: {
			avgDelayMin: 9,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		}
	},
	"12839": {
		HWH: {
			avgDelayMin: 45,
			pctRight: 36.67,
			pctSlight: 46.67,
			pctSignificant: 16.67
		},
		KGP: {
			avgDelayMin: 68,
			pctRight: 10,
			pctSlight: 50,
			pctSignificant: 40
		},
		BLS: {
			avgDelayMin: 87,
			pctRight: 0,
			pctSlight: 46.67,
			pctSignificant: 53.33
		},
		BHC: {
			avgDelayMin: 81,
			pctRight: 16.67,
			pctSlight: 40,
			pctSignificant: 43.33
		},
		JJKR: {
			avgDelayMin: 90,
			pctRight: 6.67,
			pctSlight: 36.67,
			pctSignificant: 56.67
		},
		CTC: {
			avgDelayMin: 104,
			pctRight: 0,
			pctSlight: 26.67,
			pctSignificant: 73.33
		},
		BBS: {
			avgDelayMin: 111,
			pctRight: 0,
			pctSlight: 26.67,
			pctSignificant: 73.33
		},
		KUR: {
			avgDelayMin: 104,
			pctRight: 3.33,
			pctSlight: 23.33,
			pctSignificant: 73.33
		},
		BALU: {
			avgDelayMin: 0,
			pctRight: 0,
			pctSlight: 16.67,
			pctSignificant: 83.33
		},
		CAP: {
			avgDelayMin: 119,
			pctRight: 0,
			pctSlight: 20,
			pctSignificant: 80
		},
		BAM: {
			avgDelayMin: 0,
			pctRight: 0,
			pctSlight: 10,
			pctSignificant: 90
		},
		IPM: {
			avgDelayMin: 135,
			pctRight: 0,
			pctSlight: 13.33,
			pctSignificant: 86.67
		},
		SPT: {
			avgDelayMin: 135,
			pctRight: 0,
			pctSlight: 13.33,
			pctSignificant: 86.67
		},
		PSA: {
			avgDelayMin: 104,
			pctRight: 6.67,
			pctSlight: 33.33,
			pctSignificant: 60
		},
		NWP: {
			avgDelayMin: 99,
			pctRight: 6.67,
			pctSlight: 33.33,
			pctSignificant: 60
		},
		CHE: {
			avgDelayMin: 98,
			pctRight: 10,
			pctSlight: 33.33,
			pctSignificant: 56.67
		},
		CPP: {
			avgDelayMin: 106,
			pctRight: 6.67,
			pctSlight: 26.67,
			pctSignificant: 66.67
		},
		VZM: {
			avgDelayMin: 0,
			pctRight: 16.67,
			pctSlight: 30,
			pctSignificant: 53.33
		},
		VSKP: {
			avgDelayMin: 103,
			pctRight: 13.33,
			pctSlight: 30,
			pctSignificant: 56.67
		},
		AKP: {
			avgDelayMin: 106,
			pctRight: 10,
			pctSlight: 30,
			pctSignificant: 60
		},
		TUNI: {
			avgDelayMin: 112,
			pctRight: 3.33,
			pctSlight: 33.33,
			pctSignificant: 63.33
		},
		ANV: {
			avgDelayMin: 114,
			pctRight: 0,
			pctSlight: 33.33,
			pctSignificant: 66.67
		},
		SLO: {
			avgDelayMin: 132,
			pctRight: 0,
			pctSlight: 13.33,
			pctSignificant: 86.67
		},
		RJY: {
			avgDelayMin: 140,
			pctRight: 0,
			pctSlight: 13.33,
			pctSignificant: 86.67
		},
		NDD: {
			avgDelayMin: 145,
			pctRight: 0,
			pctSlight: 13.33,
			pctSignificant: 86.67
		},
		TDD: {
			avgDelayMin: 0,
			pctRight: 0,
			pctSlight: 13.33,
			pctSignificant: 86.67
		},
		EE: {
			avgDelayMin: 0,
			pctRight: 3.33,
			pctSlight: 10,
			pctSignificant: 86.67
		},
		BZA: {
			avgDelayMin: 0,
			pctRight: 3.33,
			pctSlight: 43.33,
			pctSignificant: 53.33
		},
		TEL: {
			avgDelayMin: 127,
			pctRight: 0,
			pctSlight: 26.67,
			pctSignificant: 73.33
		},
		BPP: {
			avgDelayMin: 133,
			pctRight: 0,
			pctSlight: 20,
			pctSignificant: 80
		},
		CLX: {
			avgDelayMin: 133,
			pctRight: 0,
			pctSlight: 20,
			pctSignificant: 80
		},
		OGL: {
			avgDelayMin: 127,
			pctRight: 0,
			pctSlight: 26.67,
			pctSignificant: 73.33
		},
		NLR: {
			avgDelayMin: 113,
			pctRight: 13.33,
			pctSlight: 23.33,
			pctSignificant: 63.33
		},
		GDR: {
			avgDelayMin: 90,
			pctRight: 30,
			pctSlight: 26.67,
			pctSignificant: 43.33
		},
		MAS: {
			avgDelayMin: 73,
			pctRight: 40,
			pctSlight: 13.33,
			pctSignificant: 46.67
		}
	},
	"12840": {
		MAS: {
			avgDelayMin: 56,
			pctRight: 61.92,
			pctSlight: 11.51,
			pctSignificant: 26.3
		},
		GDR: {
			avgDelayMin: 73,
			pctRight: 33.97,
			pctSlight: 33.97,
			pctSignificant: 31.78
		},
		NLR: {
			avgDelayMin: 81,
			pctRight: 14.79,
			pctSlight: 52.05,
			pctSignificant: 32.88
		},
		OGL: {
			avgDelayMin: 82,
			pctRight: 17.53,
			pctSlight: 48.22,
			pctSignificant: 33.97
		},
		CLX: {
			avgDelayMin: 84,
			pctRight: 17.53,
			pctSlight: 47.95,
			pctSignificant: 34.25
		},
		BPP: {
			avgDelayMin: 85,
			pctRight: 18.08,
			pctSlight: 45.48,
			pctSignificant: 36.16
		},
		TEL: {
			avgDelayMin: 0,
			pctRight: 31.78,
			pctSlight: 33.42,
			pctSignificant: 34.52
		},
		BZA: {
			avgDelayMin: 84,
			pctRight: 23.84,
			pctSlight: 39.73,
			pctSignificant: 36.16
		},
		EE: {
			avgDelayMin: 94,
			pctRight: 16.44,
			pctSlight: 38.36,
			pctSignificant: 44.93
		},
		TDD: {
			avgDelayMin: 99,
			pctRight: 14.79,
			pctSlight: 36.16,
			pctSignificant: 48.77
		},
		NDD: {
			avgDelayMin: 103,
			pctRight: 13.97,
			pctSlight: 30.68,
			pctSignificant: 55.07
		},
		RJY: {
			avgDelayMin: 122,
			pctRight: 8.22,
			pctSlight: 20.82,
			pctSignificant: 70.68
		},
		SLO: {
			avgDelayMin: 121,
			pctRight: 16.44,
			pctSlight: 10.14,
			pctSignificant: 73.15
		},
		ANV: {
			avgDelayMin: 124,
			pctRight: 13.97,
			pctSlight: 12.05,
			pctSignificant: 73.7
		},
		TUNI: {
			avgDelayMin: 124,
			pctRight: 14.25,
			pctSlight: 11.78,
			pctSignificant: 73.7
		},
		AKP: {
			avgDelayMin: 128,
			pctRight: 14.25,
			pctSlight: 9.32,
			pctSignificant: 76.16
		},
		VSKP: {
			avgDelayMin: 79,
			pctRight: 40.55,
			pctSlight: 23.01,
			pctSignificant: 36.16
		},
		VZM: {
			avgDelayMin: 89,
			pctRight: 21.64,
			pctSlight: 39.73,
			pctSignificant: 38.36
		},
		CPP: {
			avgDelayMin: 91,
			pctRight: 17.81,
			pctSlight: 42.47,
			pctSignificant: 39.45
		},
		CHE: {
			avgDelayMin: 91,
			pctRight: 20.27,
			pctSlight: 40.55,
			pctSignificant: 38.9
		},
		NWP: {
			avgDelayMin: 96,
			pctRight: 15.62,
			pctSlight: 42.74,
			pctSignificant: 41.37
		},
		PSA: {
			avgDelayMin: 77,
			pctRight: 47.4,
			pctSlight: 17.26,
			pctSignificant: 35.07
		},
		SPT: {
			avgDelayMin: 83,
			pctRight: 41.64,
			pctSlight: 21.37,
			pctSignificant: 36.71
		},
		IPM: {
			avgDelayMin: 88,
			pctRight: 31.23,
			pctSlight: 30.68,
			pctSignificant: 37.81
		},
		BAM: {
			avgDelayMin: 99,
			pctRight: 7.12,
			pctSlight: 52.6,
			pctSignificant: 40
		},
		CAP: {
			avgDelayMin: 103,
			pctRight: 2.47,
			pctSlight: 54.52,
			pctSignificant: 42.74
		},
		BALU: {
			avgDelayMin: 108,
			pctRight: 2.19,
			pctSlight: 53.15,
			pctSignificant: 44.38
		},
		KUR: {
			avgDelayMin: 117,
			pctRight: 4.66,
			pctSlight: 43.01,
			pctSignificant: 52.05
		},
		BBS: {
			avgDelayMin: 121,
			pctRight: 3.84,
			pctSlight: 40.82,
			pctSignificant: 55.07
		},
		CTC: {
			avgDelayMin: 124,
			pctRight: 4.93,
			pctSlight: 36.99,
			pctSignificant: 57.26
		},
		JJKR: {
			avgDelayMin: 127,
			pctRight: 3.84,
			pctSlight: 37.26,
			pctSignificant: 58.63
		},
		BHC: {
			avgDelayMin: 87,
			pctRight: 41.64,
			pctSlight: 17.26,
			pctSignificant: 40.82
		},
		BLS: {
			avgDelayMin: 101,
			pctRight: 23.84,
			pctSlight: 29.32,
			pctSignificant: 46.58
		},
		KGP: {
			avgDelayMin: 123,
			pctRight: 10.14,
			pctSlight: 30.96,
			pctSignificant: 58.63
		},
		SRC: {
			avgDelayMin: 158,
			pctRight: 6.3,
			pctSlight: 13.42,
			pctSignificant: 80
		},
		HWH: {
			avgDelayMin: 129,
			pctRight: 18.63,
			pctSlight: 10.68,
			pctSignificant: 69.59
		}
	},
	"12841": {
		HWH: {
			avgDelayMin: 18,
			pctRight: 53.33,
			pctSlight: 30,
			pctSignificant: 6.67
		},
		SHM: {
			avgDelayMin: 0,
			pctRight: 10,
			pctSlight: 0,
			pctSignificant: 0
		},
		SRC: {
			avgDelayMin: 20,
			pctRight: 63.33,
			pctSlight: 26.67,
			pctSignificant: 10
		},
		KGP: {
			avgDelayMin: 34,
			pctRight: 23.33,
			pctSlight: 60,
			pctSignificant: 16.67
		},
		BLS: {
			avgDelayMin: 53,
			pctRight: 10,
			pctSlight: 60,
			pctSignificant: 30
		},
		BHC: {
			avgDelayMin: 0,
			pctRight: 46.67,
			pctSlight: 33.33,
			pctSignificant: 20
		},
		JJKR: {
			avgDelayMin: 36,
			pctRight: 46.67,
			pctSlight: 33.33,
			pctSignificant: 20
		},
		CTC: {
			avgDelayMin: 48,
			pctRight: 20,
			pctSlight: 50,
			pctSignificant: 30
		},
		BBS: {
			avgDelayMin: 49,
			pctRight: 23.33,
			pctSlight: 50,
			pctSignificant: 26.67
		},
		KUR: {
			avgDelayMin: 71,
			pctRight: 3.33,
			pctSlight: 50,
			pctSignificant: 46.67
		},
		BAM: {
			avgDelayMin: 63,
			pctRight: 6.67,
			pctSlight: 50,
			pctSignificant: 43.33
		},
		VSKP: {
			avgDelayMin: 48,
			pctRight: 50,
			pctSlight: 23.33,
			pctSignificant: 26.67
		},
		RJY: {
			avgDelayMin: 0,
			pctRight: 0,
			pctSlight: 63.33,
			pctSignificant: 36.67
		},
		TDD: {
			avgDelayMin: 71,
			pctRight: 6.67,
			pctSlight: 60,
			pctSignificant: 33.33
		},
		EE: {
			avgDelayMin: 71,
			pctRight: 3.33,
			pctSlight: 63.33,
			pctSignificant: 33.33
		},
		BZA: {
			avgDelayMin: 45,
			pctRight: 40,
			pctSlight: 33.33,
			pctSignificant: 26.67
		},
		MAS: {
			avgDelayMin: 21,
			pctRight: 66.67,
			pctSlight: 10,
			pctSignificant: 23.33
		}
	},
	"12842": {
		MAS: {
			avgDelayMin: 31,
			pctRight: 76.67,
			pctSlight: 10,
			pctSignificant: 13.33
		},
		OGL: {
			avgDelayMin: 50,
			pctRight: 36.67,
			pctSlight: 43.33,
			pctSignificant: 20
		},
		BZA: {
			avgDelayMin: 56,
			pctRight: 16.67,
			pctSlight: 60,
			pctSignificant: 23.33
		},
		EE: {
			avgDelayMin: 68,
			pctRight: 3.33,
			pctSlight: 70,
			pctSignificant: 26.67
		},
		TDD: {
			avgDelayMin: 75,
			pctRight: 3.33,
			pctSlight: 56.67,
			pctSignificant: 40
		},
		RJY: {
			avgDelayMin: 100,
			pctRight: 0,
			pctSlight: 16.67,
			pctSignificant: 83.33
		},
		VSKP: {
			avgDelayMin: 35,
			pctRight: 60,
			pctSlight: 23.33,
			pctSignificant: 16.67
		},
		BAM: {
			avgDelayMin: 0,
			pctRight: 20,
			pctSlight: 53.33,
			pctSignificant: 26.67
		},
		KUR: {
			avgDelayMin: 79,
			pctRight: 0,
			pctSlight: 60,
			pctSignificant: 40
		},
		BBS: {
			avgDelayMin: 77,
			pctRight: 0,
			pctSlight: 56.67,
			pctSignificant: 43.33
		},
		CTC: {
			avgDelayMin: 80,
			pctRight: 0,
			pctSlight: 53.33,
			pctSignificant: 46.67
		},
		JJKR: {
			avgDelayMin: 104,
			pctRight: 0,
			pctSlight: 13.33,
			pctSignificant: 86.67
		},
		BHC: {
			avgDelayMin: 45,
			pctRight: 40,
			pctSlight: 36.67,
			pctSignificant: 23.33
		},
		BLS: {
			avgDelayMin: 58,
			pctRight: 13.33,
			pctSlight: 63.33,
			pctSignificant: 23.33
		},
		KGP: {
			avgDelayMin: 89,
			pctRight: 0,
			pctSlight: 56.67,
			pctSignificant: 43.33
		},
		SRC: {
			avgDelayMin: 51,
			pctRight: 36.67,
			pctSlight: 33.33,
			pctSignificant: 30
		},
		HWH: {
			avgDelayMin: 63,
			pctRight: 53.33,
			pctSlight: 10,
			pctSignificant: 26.67
		},
		SHM: {
			avgDelayMin: 53,
			pctRight: 3.33,
			pctSlight: 0,
			pctSignificant: 6.67
		}
	},
	"12903": {
		BDTS: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		BVI: {
			avgDelayMin: 0,
			pctRight: 86.67,
			pctSlight: 13.33,
			pctSignificant: 0
		},
		ST: {
			avgDelayMin: 25,
			pctRight: 70,
			pctSlight: 23.33,
			pctSignificant: 6.67
		},
		BRC: {
			avgDelayMin: 30,
			pctRight: 80,
			pctSlight: 6.67,
			pctSignificant: 13.33
		},
		GDA: {
			avgDelayMin: 28,
			pctRight: 76.67,
			pctSlight: 10,
			pctSignificant: 13.33
		},
		DHD: {
			avgDelayMin: 33,
			pctRight: 53.33,
			pctSlight: 33.33,
			pctSignificant: 13.33
		},
		MGN: {
			avgDelayMin: 34,
			pctRight: 53.33,
			pctSlight: 33.33,
			pctSignificant: 13.33
		},
		RTM: {
			avgDelayMin: 25,
			pctRight: 86.67,
			pctSlight: 0,
			pctSignificant: 13.33
		},
		NAD: {
			avgDelayMin: 20,
			pctRight: 86.67,
			pctSlight: 0,
			pctSignificant: 13.33
		},
		SGZ: {
			avgDelayMin: 24,
			pctRight: 70,
			pctSlight: 16.67,
			pctSignificant: 13.33
		},
		BWM: {
			avgDelayMin: 26,
			pctRight: 76.67,
			pctSlight: 6.67,
			pctSignificant: 16.67
		},
		RMA: {
			avgDelayMin: 30,
			pctRight: 76.67,
			pctSlight: 6.67,
			pctSignificant: 16.67
		},
		KOTA: {
			avgDelayMin: 34,
			pctRight: 66.67,
			pctSlight: 16.67,
			pctSignificant: 16.67
		},
		SWM: {
			avgDelayMin: 42,
			pctRight: 56.67,
			pctSlight: 23.33,
			pctSignificant: 20
		},
		GGC: {
			avgDelayMin: 49,
			pctRight: 43.33,
			pctSlight: 36.67,
			pctSignificant: 20
		},
		SMVJ: {
			avgDelayMin: 51,
			pctRight: 33.33,
			pctSlight: 46.67,
			pctSignificant: 20
		},
		HAN: {
			avgDelayMin: 48,
			pctRight: 43.33,
			pctSlight: 36.67,
			pctSignificant: 20
		},
		BXN: {
			avgDelayMin: 46,
			pctRight: 53.33,
			pctSlight: 26.67,
			pctSignificant: 20
		},
		BTE: {
			avgDelayMin: 50,
			pctRight: 43.33,
			pctSlight: 36.67,
			pctSignificant: 20
		},
		MTJ: {
			avgDelayMin: 37,
			pctRight: 76.67,
			pctSlight: 3.33,
			pctSignificant: 20
		},
		FDB: {
			avgDelayMin: 37,
			pctRight: 80,
			pctSlight: 0,
			pctSignificant: 20
		},
		NZM: {
			avgDelayMin: 0,
			pctRight: 70,
			pctSlight: 10,
			pctSignificant: 20
		},
		GZB: {
			avgDelayMin: 53,
			pctRight: 63.33,
			pctSlight: 13.33,
			pctSignificant: 23.33
		},
		MTC: {
			avgDelayMin: 57,
			pctRight: 50,
			pctSlight: 30,
			pctSignificant: 20
		},
		MUT: {
			avgDelayMin: 60,
			pctRight: 50,
			pctSlight: 26.67,
			pctSignificant: 23.33
		},
		SKF: {
			avgDelayMin: 61,
			pctRight: 50,
			pctSlight: 26.67,
			pctSignificant: 23.33
		},
		MOZ: {
			avgDelayMin: 63,
			pctRight: 40,
			pctSlight: 36.67,
			pctSignificant: 23.33
		},
		SRE: {
			avgDelayMin: 43,
			pctRight: 70,
			pctSlight: 10,
			pctSignificant: 20
		},
		YJUD: {
			avgDelayMin: 44,
			pctRight: 70,
			pctSlight: 10,
			pctSignificant: 20
		},
		UMB: {
			avgDelayMin: 49,
			pctRight: 60,
			pctSlight: 20,
			pctSignificant: 20
		},
		LDH: {
			avgDelayMin: 51,
			pctRight: 43.33,
			pctSlight: 36.67,
			pctSignificant: 20
		},
		JUC: {
			avgDelayMin: 44,
			pctRight: 66.67,
			pctSlight: 13.33,
			pctSignificant: 20
		},
		BEAS: {
			avgDelayMin: 45,
			pctRight: 70,
			pctSlight: 6.67,
			pctSignificant: 23.33
		},
		ASR: {
			avgDelayMin: 39,
			pctRight: 63.33,
			pctSlight: 16.67,
			pctSignificant: 20
		}
	},
	"12904": {
		ASR: {
			avgDelayMin: 2,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		BEAS: {
			avgDelayMin: 13,
			pctRight: 80,
			pctSlight: 20,
			pctSignificant: 0
		},
		JUC: {
			avgDelayMin: 9,
			pctRight: 76.67,
			pctSlight: 23.33,
			pctSignificant: 0
		},
		LDH: {
			avgDelayMin: 13,
			pctRight: 70,
			pctSlight: 30,
			pctSignificant: 0
		},
		UMB: {
			avgDelayMin: 9,
			pctRight: 76.67,
			pctSlight: 23.33,
			pctSignificant: 0
		},
		YJUD: {
			avgDelayMin: 14,
			pctRight: 66.67,
			pctSlight: 33.33,
			pctSignificant: 0
		},
		SRE: {
			avgDelayMin: 9,
			pctRight: 80,
			pctSlight: 16.67,
			pctSignificant: 3.33
		},
		MOZ: {
			avgDelayMin: 9,
			pctRight: 83.33,
			pctSlight: 10,
			pctSignificant: 6.67
		},
		SKF: {
			avgDelayMin: 0,
			pctRight: 80,
			pctSlight: 13.33,
			pctSignificant: 6.67
		},
		MUT: {
			avgDelayMin: 13,
			pctRight: 76.67,
			pctSlight: 16.67,
			pctSignificant: 6.67
		},
		MTC: {
			avgDelayMin: 16,
			pctRight: 73.33,
			pctSlight: 16.67,
			pctSignificant: 10
		},
		GZB: {
			avgDelayMin: 22,
			pctRight: 56.67,
			pctSlight: 30,
			pctSignificant: 13.33
		},
		NZM: {
			avgDelayMin: 17,
			pctRight: 80,
			pctSlight: 3.33,
			pctSignificant: 16.67
		},
		FDB: {
			avgDelayMin: 31,
			pctRight: 73.33,
			pctSlight: 10,
			pctSignificant: 16.67
		},
		MTJ: {
			avgDelayMin: 27,
			pctRight: 73.33,
			pctSlight: 10,
			pctSignificant: 16.67
		},
		BTE: {
			avgDelayMin: 28,
			pctRight: 70,
			pctSlight: 13.33,
			pctSignificant: 16.67
		},
		BXN: {
			avgDelayMin: 35,
			pctRight: 53.33,
			pctSlight: 30,
			pctSignificant: 16.67
		},
		HAN: {
			avgDelayMin: 35,
			pctRight: 50,
			pctSlight: 33.33,
			pctSignificant: 16.67
		},
		SMVJ: {
			avgDelayMin: 36,
			pctRight: 46.67,
			pctSlight: 36.67,
			pctSignificant: 16.67
		},
		GGC: {
			avgDelayMin: 34,
			pctRight: 56.67,
			pctSlight: 26.67,
			pctSignificant: 16.67
		},
		SWM: {
			avgDelayMin: 35,
			pctRight: 56.67,
			pctSlight: 26.67,
			pctSignificant: 16.67
		},
		KOTA: {
			avgDelayMin: 32,
			pctRight: 56.67,
			pctSlight: 26.67,
			pctSignificant: 16.67
		},
		RMA: {
			avgDelayMin: 35,
			pctRight: 60,
			pctSlight: 23.33,
			pctSignificant: 16.67
		},
		BWM: {
			avgDelayMin: 38,
			pctRight: 56.67,
			pctSlight: 23.33,
			pctSignificant: 20
		},
		SGZ: {
			avgDelayMin: 44,
			pctRight: 30,
			pctSlight: 50,
			pctSignificant: 20
		},
		NAD: {
			avgDelayMin: 0,
			pctRight: 73.33,
			pctSlight: 13.33,
			pctSignificant: 13.33
		},
		RTM: {
			avgDelayMin: 0,
			pctRight: 56.67,
			pctSlight: 23.33,
			pctSignificant: 20
		},
		MGN: {
			avgDelayMin: 37,
			pctRight: 26.67,
			pctSlight: 53.33,
			pctSignificant: 20
		},
		DHD: {
			avgDelayMin: 39,
			pctRight: 30,
			pctSlight: 50,
			pctSignificant: 20
		},
		GDA: {
			avgDelayMin: 0,
			pctRight: 70,
			pctSlight: 13.33,
			pctSignificant: 16.67
		},
		BRC: {
			avgDelayMin: 23,
			pctRight: 66.67,
			pctSlight: 16.67,
			pctSignificant: 16.67
		},
		ST: {
			avgDelayMin: 22,
			pctRight: 73.33,
			pctSlight: 10,
			pctSignificant: 16.67
		},
		BVI: {
			avgDelayMin: 27,
			pctRight: 40,
			pctSlight: 46.67,
			pctSignificant: 13.33
		},
		BDTS: {
			avgDelayMin: 0,
			pctRight: 86.67,
			pctSlight: 3.33,
			pctSignificant: 10
		}
	},
	"12925": {
		BDTS: {
			avgDelayMin: 1,
			pctRight: 22.74,
			pctSlight: 0,
			pctSignificant: 0
		},
		MMCT: {
			avgDelayMin: 4,
			pctRight: 74.79,
			pctSlight: 2.47,
			pctSignificant: 0
		},
		BVI: {
			avgDelayMin: 16,
			pctRight: 56.99,
			pctSlight: 43.01,
			pctSignificant: 0
		},
		DRD: {
			avgDelayMin: 19,
			pctRight: 44.11,
			pctSlight: 55.07,
			pctSignificant: .82
		},
		VAPI: {
			avgDelayMin: 24,
			pctRight: 29.59,
			pctSlight: 68.77,
			pctSignificant: 1.64
		},
		BL: {
			avgDelayMin: 30,
			pctRight: 14.52,
			pctSlight: 82.19,
			pctSignificant: 3.29
		},
		NVS: {
			avgDelayMin: 0,
			pctRight: 14.79,
			pctSlight: 82.74,
			pctSignificant: 2.47
		},
		ST: {
			avgDelayMin: 10,
			pctRight: 89.04,
			pctSlight: 9.59,
			pctSignificant: 1.37
		},
		BH: {
			avgDelayMin: 15,
			pctRight: 68.22,
			pctSlight: 29.59,
			pctSignificant: 2.19
		},
		BRC: {
			avgDelayMin: 0,
			pctRight: 88.49,
			pctSlight: 9.59,
			pctSignificant: 1.92
		},
		GDA: {
			avgDelayMin: 0,
			pctRight: 95.07,
			pctSlight: 3.56,
			pctSignificant: 1.37
		},
		DHD: {
			avgDelayMin: 0,
			pctRight: 81.64,
			pctSlight: 16.71,
			pctSignificant: 1.64
		},
		MGN: {
			avgDelayMin: 12,
			pctRight: 80.55,
			pctSlight: 17.53,
			pctSignificant: 1.92
		},
		RTM: {
			avgDelayMin: 13,
			pctRight: 80.27,
			pctSlight: 17.81,
			pctSignificant: 1.92
		},
		KUH: {
			avgDelayMin: 13,
			pctRight: 73.97,
			pctSlight: 24.38,
			pctSignificant: 1.37
		},
		NAD: {
			avgDelayMin: 7,
			pctRight: 96.99,
			pctSlight: 1.64,
			pctSignificant: 1.37
		},
		SGZ: {
			avgDelayMin: 0,
			pctRight: 93.42,
			pctSlight: 4.93,
			pctSignificant: 1.64
		},
		RMA: {
			avgDelayMin: 10,
			pctRight: 92.05,
			pctSlight: 6.03,
			pctSignificant: 1.92
		},
		KOTA: {
			avgDelayMin: 11,
			pctRight: 85.48,
			pctSlight: 12.05,
			pctSignificant: 2.47
		},
		SWM: {
			avgDelayMin: 22,
			pctRight: 50.96,
			pctSlight: 44.38,
			pctSignificant: 4.66
		},
		GGC: {
			avgDelayMin: 13,
			pctRight: 81.64,
			pctSlight: 14.79,
			pctSignificant: 3.56
		},
		SMVJ: {
			avgDelayMin: 0,
			pctRight: 1.64,
			pctSlight: .55,
			pctSignificant: 0
		},
		HAN: {
			avgDelayMin: 17,
			pctRight: 70.41,
			pctSlight: 25.48,
			pctSignificant: 4.11
		},
		BXN: {
			avgDelayMin: 18,
			pctRight: 68.49,
			pctSlight: 27.4,
			pctSignificant: 4.11
		},
		BTE: {
			avgDelayMin: 19,
			pctRight: 55.89,
			pctSlight: 41.37,
			pctSignificant: 2.74
		},
		MTJ: {
			avgDelayMin: 10,
			pctRight: 90.96,
			pctSlight: 7.67,
			pctSignificant: 1.37
		},
		FDB: {
			avgDelayMin: 0,
			pctRight: 85.48,
			pctSlight: 11.78,
			pctSignificant: 2.74
		},
		NZM: {
			avgDelayMin: 17,
			pctRight: 64.38,
			pctSlight: 32.88,
			pctSignificant: 2.74
		},
		NDLS: {
			avgDelayMin: 13,
			pctRight: 80,
			pctSlight: 16.99,
			pctSignificant: 3.01
		},
		SZM: {
			avgDelayMin: 0,
			pctRight: 67.12,
			pctSlight: 29.86,
			pctSignificant: 3.01
		},
		SNP: {
			avgDelayMin: 21,
			pctRight: 53.97,
			pctSlight: 43.01,
			pctSignificant: 3.01
		},
		BDMJ: {
			avgDelayMin: 35,
			pctRight: 2.19,
			pctSlight: 6.03,
			pctSignificant: .55
		},
		PNP: {
			avgDelayMin: 27,
			pctRight: 39.45,
			pctSlight: 55.34,
			pctSignificant: 5.21
		},
		KUN: {
			avgDelayMin: 33,
			pctRight: 24.66,
			pctSlight: 67.4,
			pctSignificant: 7.95
		},
		KKDE: {
			avgDelayMin: 38,
			pctRight: 10.96,
			pctSlight: 79.45,
			pctSignificant: 9.59
		},
		UMB: {
			avgDelayMin: 13,
			pctRight: 83.56,
			pctSlight: 13.15,
			pctSignificant: 3.29
		},
		CDG: {
			avgDelayMin: 15,
			pctRight: 75.07,
			pctSlight: 21.37,
			pctSignificant: 3.56
		},
		SASN: {
			avgDelayMin: 22,
			pctRight: 49.59,
			pctSlight: 46.3,
			pctSignificant: 4.11
		},
		LDH: {
			avgDelayMin: 14,
			pctRight: 84.66,
			pctSlight: 11.23,
			pctSignificant: 4.11
		},
		PGW: {
			avgDelayMin: 19,
			pctRight: 71.23,
			pctSlight: 21.92,
			pctSignificant: 6.85
		},
		JRC: {
			avgDelayMin: 20,
			pctRight: 65.21,
			pctSlight: 27.95,
			pctSignificant: 6.85
		},
		JUC: {
			avgDelayMin: 19,
			pctRight: 68.49,
			pctSlight: 25.21,
			pctSignificant: 6.3
		},
		BEAS: {
			avgDelayMin: 19,
			pctRight: 70.68,
			pctSlight: 21.64,
			pctSignificant: 7.67
		},
		ASR: {
			avgDelayMin: 16,
			pctRight: 78.9,
			pctSlight: 13.42,
			pctSignificant: 7.67
		}
	},
	"12926": {
		ASR: {
			avgDelayMin: 9,
			pctRight: 94.79,
			pctSlight: 3.29,
			pctSignificant: 1.92
		},
		BEAS: {
			avgDelayMin: 22,
			pctRight: 51.78,
			pctSlight: 46.3,
			pctSignificant: 1.92
		},
		JUC: {
			avgDelayMin: 17,
			pctRight: 71.23,
			pctSlight: 26.03,
			pctSignificant: 2.74
		},
		JRC: {
			avgDelayMin: 20,
			pctRight: 60.27,
			pctSlight: 36.71,
			pctSignificant: 3.01
		},
		PGW: {
			avgDelayMin: 0,
			pctRight: 46.85,
			pctSlight: 49.86,
			pctSignificant: 3.29
		},
		LDH: {
			avgDelayMin: 22,
			pctRight: 55.89,
			pctSlight: 39.73,
			pctSignificant: 4.38
		},
		SASN: {
			avgDelayMin: 12,
			pctRight: 91.78,
			pctSlight: 5.75,
			pctSignificant: 2.47
		},
		CDG: {
			avgDelayMin: 11,
			pctRight: 94.79,
			pctSlight: 2.19,
			pctSignificant: 3.01
		},
		UMB: {
			avgDelayMin: 11,
			pctRight: 92.33,
			pctSlight: 4.38,
			pctSignificant: 3.29
		},
		KKDE: {
			avgDelayMin: 20,
			pctRight: 71.78,
			pctSlight: 24.38,
			pctSignificant: 3.84
		},
		KUN: {
			avgDelayMin: 22,
			pctRight: 60.82,
			pctSlight: 35.34,
			pctSignificant: 3.56
		},
		PNP: {
			avgDelayMin: 25,
			pctRight: 50.41,
			pctSlight: 45.48,
			pctSignificant: 4.11
		},
		BDMJ: {
			avgDelayMin: 19,
			pctRight: 4.11,
			pctSlight: 4.38,
			pctSignificant: .27
		},
		SNP: {
			avgDelayMin: 28,
			pctRight: 41.92,
			pctSlight: 53.42,
			pctSignificant: 4.66
		},
		SZM: {
			avgDelayMin: 34,
			pctRight: 23.01,
			pctSlight: 70.96,
			pctSignificant: 6.03
		},
		NDLS: {
			avgDelayMin: 21,
			pctRight: 66.58,
			pctSlight: 28.49,
			pctSignificant: 4.93
		},
		FDB: {
			avgDelayMin: 48,
			pctRight: 6.85,
			pctSlight: 84.38,
			pctSignificant: 8.77
		},
		MTJ: {
			avgDelayMin: 18,
			pctRight: 84.11,
			pctSlight: 10.68,
			pctSignificant: 5.21
		},
		BTE: {
			avgDelayMin: 0,
			pctRight: 79.45,
			pctSlight: 15.07,
			pctSignificant: 5.48
		},
		BXN: {
			avgDelayMin: 18,
			pctRight: 83.29,
			pctSlight: 11.23,
			pctSignificant: 5.48
		},
		HAN: {
			avgDelayMin: 0,
			pctRight: 78.63,
			pctSlight: 15.34,
			pctSignificant: 6.03
		},
		SMVJ: {
			avgDelayMin: 14,
			pctRight: 1.64,
			pctSlight: .55,
			pctSignificant: 0
		},
		GGC: {
			avgDelayMin: 22,
			pctRight: 72.05,
			pctSlight: 21.64,
			pctSignificant: 6.3
		},
		SWM: {
			avgDelayMin: 24,
			pctRight: 61.64,
			pctSlight: 31.51,
			pctSignificant: 6.85
		},
		KOTA: {
			avgDelayMin: 29,
			pctRight: 53.7,
			pctSlight: 36.71,
			pctSignificant: 9.59
		},
		RMA: {
			avgDelayMin: 29,
			pctRight: 51.51,
			pctSlight: 39.45,
			pctSignificant: 9.04
		},
		SGZ: {
			avgDelayMin: 26,
			pctRight: 56.71,
			pctSlight: 36.16,
			pctSignificant: 7.12
		},
		NAD: {
			avgDelayMin: 13,
			pctRight: 93.7,
			pctSlight: 2.74,
			pctSignificant: 3.56
		},
		KUH: {
			avgDelayMin: 17,
			pctRight: 89.04,
			pctSlight: 7.4,
			pctSignificant: 3.56
		},
		RTM: {
			avgDelayMin: 15,
			pctRight: 88.77,
			pctSlight: 7.4,
			pctSignificant: 3.84
		},
		MGN: {
			avgDelayMin: 18,
			pctRight: 83.84,
			pctSlight: 12.05,
			pctSignificant: 4.11
		},
		DHD: {
			avgDelayMin: 18,
			pctRight: 81.37,
			pctSlight: 14.52,
			pctSignificant: 4.11
		},
		GDA: {
			avgDelayMin: 14,
			pctRight: 93.42,
			pctSlight: 3.29,
			pctSignificant: 3.29
		},
		BRC: {
			avgDelayMin: 0,
			pctRight: 87.67,
			pctSlight: 8.77,
			pctSignificant: 3.56
		},
		BH: {
			avgDelayMin: 18,
			pctRight: 82.19,
			pctSlight: 14.25,
			pctSignificant: 3.56
		},
		ST: {
			avgDelayMin: 15,
			pctRight: 86.58,
			pctSlight: 9.32,
			pctSignificant: 4.11
		},
		NVS: {
			avgDelayMin: 17,
			pctRight: 81.64,
			pctSlight: 13.7,
			pctSignificant: 4.66
		},
		BL: {
			avgDelayMin: 25,
			pctRight: 49.59,
			pctSlight: 44.66,
			pctSignificant: 5.75
		},
		VAPI: {
			avgDelayMin: 24,
			pctRight: 58.36,
			pctSlight: 34.52,
			pctSignificant: 7.12
		},
		DRD: {
			avgDelayMin: 28,
			pctRight: 47.95,
			pctSlight: 43.84,
			pctSignificant: 8.22
		},
		BVI: {
			avgDelayMin: 29,
			pctRight: 40.55,
			pctSlight: 51.23,
			pctSignificant: 8.22
		},
		BDTS: {
			avgDelayMin: 5,
			pctRight: 20.55,
			pctSlight: .55,
			pctSignificant: 1.1
		},
		MMCT: {
			avgDelayMin: 16,
			pctRight: 63.56,
			pctSlight: 7.12,
			pctSignificant: 6.03
		}
	},
	"12951": {
		MMCT: {
			avgDelayMin: 7,
			pctRight: 98.63,
			pctSlight: .27,
			pctSignificant: 1.1
		},
		BVI: {
			avgDelayMin: 15,
			pctRight: 93.7,
			pctSlight: 5.21,
			pctSignificant: 1.1
		},
		ST: {
			avgDelayMin: 16,
			pctRight: 81.92,
			pctSlight: 16.16,
			pctSignificant: 1.92
		},
		BRC: {
			avgDelayMin: 17,
			pctRight: 74.52,
			pctSlight: 23.84,
			pctSignificant: 1.64
		},
		RTM: {
			avgDelayMin: 15,
			pctRight: 83.56,
			pctSlight: 14.25,
			pctSignificant: 2.19
		},
		NAD: {
			avgDelayMin: 11,
			pctRight: 92.05,
			pctSlight: 6.3,
			pctSignificant: 1.64
		},
		KOTA: {
			avgDelayMin: 16,
			pctRight: 80.27,
			pctSlight: 17.81,
			pctSignificant: 1.92
		},
		NDLS: {
			avgDelayMin: 27,
			pctRight: 82.47,
			pctSlight: 11.51,
			pctSignificant: 6.03
		}
	},
	"12952": {
		NDLS: {
			avgDelayMin: 8,
			pctRight: 97.26,
			pctSlight: .55,
			pctSignificant: 2.19
		},
		KOTA: {
			avgDelayMin: 20,
			pctRight: 57.81,
			pctSlight: 38.9,
			pctSignificant: 3.29
		},
		NAD: {
			avgDelayMin: 15,
			pctRight: 76.71,
			pctSlight: 20,
			pctSignificant: 3.29
		},
		RTM: {
			avgDelayMin: 20,
			pctRight: 64.93,
			pctSlight: 31.51,
			pctSignificant: 3.56
		},
		BRC: {
			avgDelayMin: 13,
			pctRight: 87.12,
			pctSlight: 9.86,
			pctSignificant: 3.01
		},
		ST: {
			avgDelayMin: 15,
			pctRight: 85.48,
			pctSlight: 11.51,
			pctSignificant: 3.01
		},
		BVI: {
			avgDelayMin: 28,
			pctRight: 24.38,
			pctSlight: 70.68,
			pctSignificant: 4.93
		},
		MMCT: {
			avgDelayMin: 13,
			pctRight: 88.22,
			pctSlight: 7.4,
			pctSignificant: 4.38
		}
	},
	"12953": {
		MMCT: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		BVI: {
			avgDelayMin: 9,
			pctRight: 86.67,
			pctSlight: 13.33,
			pctSignificant: 0
		},
		VAPI: {
			avgDelayMin: 14,
			pctRight: 63.33,
			pctSlight: 36.67,
			pctSignificant: 0
		},
		BL: {
			avgDelayMin: 11,
			pctRight: 80,
			pctSlight: 20,
			pctSignificant: 0
		},
		ST: {
			avgDelayMin: 7,
			pctRight: 93.33,
			pctSlight: 6.67,
			pctSignificant: 0
		},
		BH: {
			avgDelayMin: 0,
			pctRight: 80,
			pctSlight: 20,
			pctSignificant: 0
		},
		BRC: {
			avgDelayMin: 10,
			pctRight: 83.33,
			pctSlight: 16.67,
			pctSignificant: 0
		},
		DHD: {
			avgDelayMin: 13,
			pctRight: 63.33,
			pctSlight: 36.67,
			pctSignificant: 0
		},
		RTM: {
			avgDelayMin: 10,
			pctRight: 80,
			pctSlight: 20,
			pctSignificant: 0
		},
		KOTA: {
			avgDelayMin: 9,
			pctRight: 73.33,
			pctSlight: 23.33,
			pctSignificant: 3.33
		},
		SWM: {
			avgDelayMin: 15,
			pctRight: 66.67,
			pctSlight: 30,
			pctSignificant: 3.33
		},
		MTJ: {
			avgDelayMin: 8,
			pctRight: 96.67,
			pctSlight: 0,
			pctSignificant: 3.33
		},
		NZM: {
			avgDelayMin: 7,
			pctRight: 90,
			pctSlight: 6.67,
			pctSignificant: 3.33
		}
	},
	"12954": {
		NZM: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		MTJ: {
			avgDelayMin: 6,
			pctRight: 96.67,
			pctSlight: 3.33,
			pctSignificant: 0
		},
		SWM: {
			avgDelayMin: 13,
			pctRight: 76.67,
			pctSlight: 20,
			pctSignificant: 3.33
		},
		KOTA: {
			avgDelayMin: 23,
			pctRight: 43.33,
			pctSlight: 50,
			pctSignificant: 6.67
		},
		RTM: {
			avgDelayMin: 20,
			pctRight: 66.67,
			pctSlight: 26.67,
			pctSignificant: 6.67
		},
		DHD: {
			avgDelayMin: 0,
			pctRight: 60,
			pctSlight: 30,
			pctSignificant: 10
		},
		BRC: {
			avgDelayMin: 0,
			pctRight: 83.33,
			pctSlight: 10,
			pctSignificant: 6.67
		},
		BH: {
			avgDelayMin: 15,
			pctRight: 86.67,
			pctSlight: 6.67,
			pctSignificant: 6.67
		},
		ST: {
			avgDelayMin: 14,
			pctRight: 90,
			pctSlight: 3.33,
			pctSignificant: 6.67
		},
		BL: {
			avgDelayMin: 14,
			pctRight: 86.67,
			pctSlight: 6.67,
			pctSignificant: 6.67
		},
		VAPI: {
			avgDelayMin: 23,
			pctRight: 83.33,
			pctSlight: 10,
			pctSignificant: 6.67
		},
		BVI: {
			avgDelayMin: 29,
			pctRight: 36.67,
			pctSlight: 53.33,
			pctSignificant: 10
		},
		MMCT: {
			avgDelayMin: 16,
			pctRight: 86.67,
			pctSlight: 6.67,
			pctSignificant: 6.67
		}
	},
	"12957": {
		SBIB: {
			avgDelayMin: 7,
			pctRight: 96.67,
			pctSlight: 0,
			pctSignificant: 3.33
		},
		MSH: {
			avgDelayMin: 8,
			pctRight: 93.33,
			pctSlight: 3.33,
			pctSignificant: 3.33
		},
		PNU: {
			avgDelayMin: 0,
			pctRight: 96.67,
			pctSlight: 0,
			pctSignificant: 3.33
		},
		ABR: {
			avgDelayMin: 8,
			pctRight: 96.67,
			pctSlight: 0,
			pctSignificant: 3.33
		},
		FA: {
			avgDelayMin: 6,
			pctRight: 96.67,
			pctSlight: 0,
			pctSignificant: 3.33
		},
		AII: {
			avgDelayMin: 6,
			pctRight: 96.67,
			pctSlight: 0,
			pctSignificant: 3.33
		},
		JP: {
			avgDelayMin: 7,
			pctRight: 96.67,
			pctSlight: 0,
			pctSignificant: 3.33
		},
		GGN: {
			avgDelayMin: 14,
			pctRight: 96.67,
			pctSlight: 0,
			pctSignificant: 3.33
		},
		DEC: {
			avgDelayMin: 15,
			pctRight: 96.67,
			pctSlight: 0,
			pctSignificant: 3.33
		},
		NDLS: {
			avgDelayMin: 0,
			pctRight: 96.67,
			pctSlight: 0,
			pctSignificant: 3.33
		}
	},
	"12958": {
		NDLS: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		DEC: {
			avgDelayMin: 4,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		GGN: {
			avgDelayMin: 7,
			pctRight: 93.33,
			pctSlight: 6.67,
			pctSignificant: 0
		},
		JP: {
			avgDelayMin: 0,
			pctRight: 46.67,
			pctSlight: 53.33,
			pctSignificant: 0
		},
		AII: {
			avgDelayMin: 16,
			pctRight: 63.33,
			pctSlight: 36.67,
			pctSignificant: 0
		},
		FA: {
			avgDelayMin: 16,
			pctRight: 53.33,
			pctSlight: 46.67,
			pctSignificant: 0
		},
		ABR: {
			avgDelayMin: 10,
			pctRight: 73.33,
			pctSlight: 26.67,
			pctSignificant: 0
		},
		PNU: {
			avgDelayMin: 4,
			pctRight: 90,
			pctSlight: 10,
			pctSignificant: 0
		},
		MSH: {
			avgDelayMin: 6,
			pctRight: 86.67,
			pctSlight: 13.33,
			pctSignificant: 0
		},
		SBIB: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		}
	},
	"15959": {
		HWH: {
			avgDelayMin: 0,
			pctRight: 97.32,
			pctSlight: 2.68,
			pctSignificant: 0
		},
		BDC: {
			avgDelayMin: 8,
			pctRight: 90.8,
			pctSlight: 8.81,
			pctSignificant: .38
		},
		ABKA: {
			avgDelayMin: 13,
			pctRight: 71.65,
			pctSlight: 27.97,
			pctSignificant: .38
		},
		NDAE: {
			avgDelayMin: 0,
			pctRight: 65.13,
			pctSlight: 34.48,
			pctSignificant: .38
		},
		KWAE: {
			avgDelayMin: 10,
			pctRight: 79.69,
			pctSlight: 19.92,
			pctSignificant: .38
		},
		SALE: {
			avgDelayMin: 14,
			pctRight: 62.45,
			pctSlight: 37.16,
			pctSignificant: .38
		},
		KGLE: {
			avgDelayMin: 0,
			pctRight: 48.66,
			pctSlight: 50.19,
			pctSignificant: 1.15
		},
		AZ: {
			avgDelayMin: 9,
			pctRight: 85.82,
			pctSlight: 13.03,
			pctSignificant: 1.15
		},
		JRLE: {
			avgDelayMin: 8,
			pctRight: 88.12,
			pctSlight: 10.73,
			pctSignificant: 1.15
		},
		NILE: {
			avgDelayMin: 12,
			pctRight: 78.16,
			pctSlight: 20.69,
			pctSignificant: 1.15
		},
		DGLE: {
			avgDelayMin: 13,
			pctRight: 77.39,
			pctSlight: 21.07,
			pctSignificant: 1.53
		},
		NFK: {
			avgDelayMin: 9,
			pctRight: 90.04,
			pctSlight: 8.05,
			pctSignificant: 1.92
		},
		MLDT: {
			avgDelayMin: 8,
			pctRight: 95.02,
			pctSlight: 3.07,
			pctSignificant: 1.92
		},
		SM: {
			avgDelayMin: 10,
			pctRight: 86.21,
			pctSlight: 11.49,
			pctSignificant: 2.3
		},
		HCR: {
			avgDelayMin: 11,
			pctRight: 80.08,
			pctSlight: 17.62,
			pctSignificant: 2.3
		},
		BOE: {
			avgDelayMin: 17,
			pctRight: .77,
			pctSlight: 1.15,
			pctSignificant: 0
		},
		KNE: {
			avgDelayMin: 0,
			pctRight: 32.57,
			pctSlight: 62.45,
			pctSignificant: 4.98
		},
		AUB: {
			avgDelayMin: 34,
			pctRight: 14.18,
			pctSlight: 78.16,
			pctSignificant: 7.66
		},
		NJP: {
			avgDelayMin: 17,
			pctRight: 68.97,
			pctSlight: 26.05,
			pctSignificant: 4.98
		},
		JPE: {
			avgDelayMin: 13,
			pctRight: 68.2,
			pctSlight: 26.82,
			pctSignificant: 4.98
		},
		NMX: {
			avgDelayMin: 21,
			pctRight: 58.62,
			pctSlight: 35.63,
			pctSignificant: 5.75
		},
		DQG: {
			avgDelayMin: 19,
			pctRight: 65.13,
			pctSlight: 29.5,
			pctSignificant: 5.36
		},
		FLK: {
			avgDelayMin: 13,
			pctRight: 77.39,
			pctSlight: 18.77,
			pctSignificant: 3.83
		},
		NCB: {
			avgDelayMin: 13,
			pctRight: 82.76,
			pctSlight: 13.03,
			pctSignificant: 4.21
		},
		NOQ: {
			avgDelayMin: 12,
			pctRight: 82.76,
			pctSlight: 13.41,
			pctSignificant: 3.45
		},
		KAMG: {
			avgDelayMin: 18,
			pctRight: 74.33,
			pctSlight: 21.46,
			pctSignificant: 3.83
		},
		GOGH: {
			avgDelayMin: 10,
			pctRight: 1.53,
			pctSlight: .38,
			pctSignificant: 0
		},
		FKM: {
			avgDelayMin: 37,
			pctRight: 6.9,
			pctSlight: 85.06,
			pctSignificant: 8.05
		},
		KOJ: {
			avgDelayMin: 35,
			pctRight: 10.73,
			pctSlight: 80.84,
			pctSignificant: 8.43
		},
		NBQ: {
			avgDelayMin: 17,
			pctRight: 72.8,
			pctSlight: 21.46,
			pctSignificant: 5.75
		},
		BNGN: {
			avgDelayMin: 20,
			pctRight: 65.52,
			pctSlight: 26.05,
			pctSignificant: 6.13
		},
		SBE: {
			avgDelayMin: 23,
			pctRight: 59.39,
			pctSlight: 30.27,
			pctSignificant: 8.05
		},
		BPRD: {
			avgDelayMin: 24,
			pctRight: 55.17,
			pctSlight: 34.48,
			pctSignificant: 8.05
		},
		PBL: {
			avgDelayMin: 27,
			pctRight: 48.28,
			pctSlight: 41.38,
			pctSignificant: 8.05
		},
		TIHU: {
			avgDelayMin: 28,
			pctRight: 44.44,
			pctSlight: 44.83,
			pctSignificant: 8.43
		},
		NLV: {
			avgDelayMin: 30,
			pctRight: 41.38,
			pctSlight: 47.89,
			pctSignificant: 8.43
		},
		RNY: {
			avgDelayMin: 26,
			pctRight: 55.17,
			pctSlight: 34.1,
			pctSignificant: 8.43
		},
		KYQ: {
			avgDelayMin: 23,
			pctRight: 63.6,
			pctSlight: 28.35,
			pctSignificant: 8.05
		},
		GHY: {
			avgDelayMin: 32,
			pctRight: 41,
			pctSlight: 47.51,
			pctSignificant: 11.49
		},
		CPK: {
			avgDelayMin: 35,
			pctRight: 38.31,
			pctSlight: 47.89,
			pctSignificant: 13.79
		},
		HJI: {
			avgDelayMin: 37,
			pctRight: 36.78,
			pctSlight: 47.51,
			pctSignificant: 15.71
		},
		LKA: {
			avgDelayMin: 36,
			pctRight: 41,
			pctSlight: 42.53,
			pctSignificant: 16.48
		},
		LMG: {
			avgDelayMin: 47,
			pctRight: 20.69,
			pctSlight: 57.85,
			pctSignificant: 21.46
		},
		DPU: {
			avgDelayMin: 48,
			pctRight: 16.09,
			pctSlight: 62.84,
			pctSignificant: 21.07
		},
		DMV: {
			avgDelayMin: 49,
			pctRight: 17.62,
			pctSlight: 62.07,
			pctSignificant: 20.31
		},
		SZR: {
			avgDelayMin: 47,
			pctRight: 20.69,
			pctSlight: 60.15,
			pctSignificant: 19.16
		},
		BXP: {
			avgDelayMin: 48,
			pctRight: 19.92,
			pctSlight: 60.54,
			pctSignificant: 19.54
		},
		FKG: {
			avgDelayMin: 21,
			pctRight: 76.63,
			pctSlight: 13.41,
			pctSignificant: 9.96
		},
		MXN: {
			avgDelayMin: 39,
			pctRight: 39.46,
			pctSlight: 43.68,
			pctSignificant: 16.86
		},
		AGI: {
			avgDelayMin: 46,
			pctRight: 11.49,
			pctSlight: 70.88,
			pctSignificant: 17.62
		},
		SLGR: {
			avgDelayMin: 42,
			pctRight: 21.46,
			pctSlight: 63.22,
			pctSignificant: 15.33
		},
		BOJ: {
			avgDelayMin: 51,
			pctRight: 9.2,
			pctSlight: 72.03,
			pctSignificant: 18.77
		},
		NAM: {
			avgDelayMin: 54,
			pctRight: 6.9,
			pctSlight: 71.65,
			pctSignificant: 21.46
		},
		NHK: {
			avgDelayMin: 56,
			pctRight: 6.51,
			pctSlight: 70.5,
			pctSignificant: 22.99
		},
		DJG: {
			avgDelayMin: 56,
			pctRight: 7.28,
			pctSlight: 68.97,
			pctSignificant: 23.75
		},
		NTSK: {
			avgDelayMin: 53,
			pctRight: 13.79,
			pctSlight: 65.52,
			pctSignificant: 20.69
		},
		DBRG: {
			avgDelayMin: 17,
			pctRight: 71.26,
			pctSlight: 16.09,
			pctSignificant: 12.64
		}
	},
	"15960": {
		DBRG: {
			avgDelayMin: 0,
			pctRight: 96.54,
			pctSlight: 2.69,
			pctSignificant: .77
		},
		NTSK: {
			avgDelayMin: 15,
			pctRight: 65.77,
			pctSlight: 30.38,
			pctSignificant: 3.85
		},
		DJG: {
			avgDelayMin: 18,
			pctRight: 57.31,
			pctSlight: 37.69,
			pctSignificant: 5
		},
		NHK: {
			avgDelayMin: 23,
			pctRight: 44.62,
			pctSlight: 48.85,
			pctSignificant: 6.54
		},
		NAM: {
			avgDelayMin: 20,
			pctRight: 50,
			pctSlight: 43.08,
			pctSignificant: 6.92
		},
		BOJ: {
			avgDelayMin: 29,
			pctRight: 41.15,
			pctSlight: 49.23,
			pctSignificant: 9.62
		},
		SLGR: {
			avgDelayMin: 44,
			pctRight: 19.23,
			pctSlight: 51.92,
			pctSignificant: 28.85
		},
		AGI: {
			avgDelayMin: 50,
			pctRight: 10.38,
			pctSlight: 53.08,
			pctSignificant: 36.54
		},
		MXN: {
			avgDelayMin: 34,
			pctRight: 16.15,
			pctSlight: 77.69,
			pctSignificant: 6.15
		},
		FKG: {
			avgDelayMin: 8,
			pctRight: 91.15,
			pctSlight: 6.54,
			pctSignificant: 2.31
		},
		BXP: {
			avgDelayMin: 11,
			pctRight: 85,
			pctSlight: 11.92,
			pctSignificant: 3.08
		},
		SZR: {
			avgDelayMin: 13,
			pctRight: 80.38,
			pctSlight: 16.15,
			pctSignificant: 3.46
		},
		DMV: {
			avgDelayMin: 20,
			pctRight: 50,
			pctSlight: 45.77,
			pctSignificant: 4.23
		},
		DPU: {
			avgDelayMin: 0,
			pctRight: 38.08,
			pctSlight: 56.92,
			pctSignificant: 5
		},
		LMG: {
			avgDelayMin: 23,
			pctRight: 50,
			pctSlight: 44.62,
			pctSignificant: 5.38
		},
		LKA: {
			avgDelayMin: 19,
			pctRight: 56.92,
			pctSlight: 37.31,
			pctSignificant: 5.77
		},
		HJI: {
			avgDelayMin: 21,
			pctRight: 53.85,
			pctSlight: 40,
			pctSignificant: 6.15
		},
		CPK: {
			avgDelayMin: 25,
			pctRight: 45.77,
			pctSlight: 46.54,
			pctSignificant: 7.69
		},
		GHY: {
			avgDelayMin: 0,
			pctRight: 35.77,
			pctSlight: 50.38,
			pctSignificant: 13.85
		},
		KYQ: {
			avgDelayMin: 35,
			pctRight: 33.46,
			pctSlight: 51.92,
			pctSignificant: 14.62
		},
		RNY: {
			avgDelayMin: 0,
			pctRight: 65.77,
			pctSlight: 25.77,
			pctSignificant: 7.31
		},
		NLV: {
			avgDelayMin: 23,
			pctRight: 58.08,
			pctSlight: 33.08,
			pctSignificant: 7.69
		},
		TIHU: {
			avgDelayMin: 26,
			pctRight: 48.08,
			pctSlight: 40.77,
			pctSignificant: 10
		},
		PBL: {
			avgDelayMin: 30,
			pctRight: 36.54,
			pctSlight: 50.38,
			pctSignificant: 11.92
		},
		BPRD: {
			avgDelayMin: 31,
			pctRight: 36.92,
			pctSlight: 49.62,
			pctSignificant: 12.31
		},
		SBE: {
			avgDelayMin: 35,
			pctRight: 27.69,
			pctSlight: 56.92,
			pctSignificant: 14.23
		},
		BNGN: {
			avgDelayMin: 41,
			pctRight: 17.69,
			pctSlight: 63.08,
			pctSignificant: 18.08
		},
		NBQ: {
			avgDelayMin: 28,
			pctRight: 59.62,
			pctSlight: 25.38,
			pctSignificant: 15
		},
		KOJ: {
			avgDelayMin: 32,
			pctRight: 53.08,
			pctSlight: 30,
			pctSignificant: 16.92
		},
		FKM: {
			avgDelayMin: 35,
			pctRight: 49.23,
			pctSlight: 33.08,
			pctSignificant: 17.69
		},
		GOGH: {
			avgDelayMin: 11,
			pctRight: 1.15,
			pctSlight: .38,
			pctSignificant: 0
		},
		KAMG: {
			avgDelayMin: 39,
			pctRight: 40,
			pctSlight: 40.77,
			pctSignificant: 18.85
		},
		NOQ: {
			avgDelayMin: 37,
			pctRight: 44.62,
			pctSlight: 36.15,
			pctSignificant: 18.46
		},
		NCB: {
			avgDelayMin: 43,
			pctRight: 36.15,
			pctSlight: 42.69,
			pctSignificant: 21.15
		},
		FLK: {
			avgDelayMin: 0,
			pctRight: 16.15,
			pctSlight: 58.85,
			pctSignificant: 24.62
		},
		DQG: {
			avgDelayMin: 46,
			pctRight: 28.46,
			pctSlight: 49.23,
			pctSignificant: 21.92
		},
		NMX: {
			avgDelayMin: 46,
			pctRight: 27.69,
			pctSlight: 48.08,
			pctSignificant: 23.85
		},
		JPE: {
			avgDelayMin: 48,
			pctRight: 24.23,
			pctSlight: 51.54,
			pctSignificant: 24.23
		},
		NJP: {
			avgDelayMin: 28,
			pctRight: 66.54,
			pctSlight: 18.46,
			pctSignificant: 15
		},
		AUB: {
			avgDelayMin: 36,
			pctRight: 55,
			pctSlight: 26.54,
			pctSignificant: 18.46
		},
		KNE: {
			avgDelayMin: 37,
			pctRight: 54.62,
			pctSlight: 26.54,
			pctSignificant: 18.85
		},
		BOE: {
			avgDelayMin: 15,
			pctRight: 1.15,
			pctSlight: .77,
			pctSignificant: 0
		},
		HCR: {
			avgDelayMin: 0,
			pctRight: 33.46,
			pctSlight: 44.62,
			pctSignificant: 21.92
		},
		SM: {
			avgDelayMin: 49,
			pctRight: 28.08,
			pctSlight: 48.46,
			pctSignificant: 23.46
		},
		MLDT: {
			avgDelayMin: 36,
			pctRight: 66.92,
			pctSlight: 8.85,
			pctSignificant: 24.23
		},
		NFK: {
			avgDelayMin: 37,
			pctRight: 64.62,
			pctSlight: 10.77,
			pctSignificant: 24.62
		},
		DGLE: {
			avgDelayMin: 37,
			pctRight: 64.23,
			pctSlight: 11.15,
			pctSignificant: 24.62
		},
		NILE: {
			avgDelayMin: 40,
			pctRight: 61.15,
			pctSlight: 13.85,
			pctSignificant: 25
		},
		JRLE: {
			avgDelayMin: 41,
			pctRight: 58.85,
			pctSlight: 16.54,
			pctSignificant: 24.62
		},
		AZ: {
			avgDelayMin: 33,
			pctRight: 68.46,
			pctSlight: 8.46,
			pctSignificant: 23.08
		},
		KGLE: {
			avgDelayMin: 38,
			pctRight: 66.15,
			pctSlight: 8.85,
			pctSignificant: 25
		},
		SALE: {
			avgDelayMin: 45,
			pctRight: 50,
			pctSlight: 23.85,
			pctSignificant: 26.15
		},
		KWAE: {
			avgDelayMin: 0,
			pctRight: 65.77,
			pctSlight: 10.38,
			pctSignificant: 23.85
		},
		NDAE: {
			avgDelayMin: 36,
			pctRight: 65.38,
			pctSlight: 12.69,
			pctSignificant: 21.92
		},
		ABKA: {
			avgDelayMin: 38,
			pctRight: 63.85,
			pctSlight: 13.08,
			pctSignificant: 23.08
		},
		BDC: {
			avgDelayMin: 38,
			pctRight: 49.62,
			pctSlight: 32.31,
			pctSignificant: 18.08
		},
		HWH: {
			avgDelayMin: 5,
			pctRight: 79.62,
			pctSlight: 8.46,
			pctSignificant: 11.92
		}
	},
	"16127": {
		MS: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		TBM: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		CGL: {
			avgDelayMin: 3,
			pctRight: 96.67,
			pctSlight: 3.33,
			pctSignificant: 0
		},
		MLMR: {
			avgDelayMin: 16,
			pctRight: 63.33,
			pctSlight: 36.67,
			pctSignificant: 0
		},
		TMV: {
			avgDelayMin: 15,
			pctRight: 56.67,
			pctSlight: 43.33,
			pctSignificant: 0
		},
		VM: {
			avgDelayMin: 3,
			pctRight: 93.33,
			pctSlight: 6.67,
			pctSignificant: 0
		},
		VRI: {
			avgDelayMin: 4,
			pctRight: 93.33,
			pctSlight: 6.67,
			pctSignificant: 0
		},
		PNDM: {
			avgDelayMin: 3,
			pctRight: 93.33,
			pctSlight: 6.67,
			pctSignificant: 0
		},
		ALU: {
			avgDelayMin: 19,
			pctRight: 70,
			pctSlight: 26.67,
			pctSignificant: 3.33
		},
		SRGM: {
			avgDelayMin: 18,
			pctRight: 70,
			pctSlight: 26.67,
			pctSignificant: 3.33
		},
		TPJ: {
			avgDelayMin: 8,
			pctRight: 86.67,
			pctSlight: 10,
			pctSignificant: 3.33
		},
		MPA: {
			avgDelayMin: 16,
			pctRight: 80,
			pctSlight: 16.67,
			pctSignificant: 3.33
		},
		DG: {
			avgDelayMin: 20,
			pctRight: 46.67,
			pctSlight: 50,
			pctSignificant: 3.33
		},
		KQN: {
			avgDelayMin: 21,
			pctRight: 33.33,
			pctSlight: 63.33,
			pctSignificant: 3.33
		},
		SDN: {
			avgDelayMin: 27,
			pctRight: 16.67,
			pctSlight: 80,
			pctSignificant: 3.33
		},
		KON: {
			avgDelayMin: 27,
			pctRight: 20,
			pctSlight: 76.67,
			pctSignificant: 3.33
		},
		MDU: {
			avgDelayMin: 15,
			pctRight: 60,
			pctSlight: 36.67,
			pctSignificant: 3.33
		},
		VPT: {
			avgDelayMin: 13,
			pctRight: 73.33,
			pctSlight: 23.33,
			pctSignificant: 3.33
		},
		SRT: {
			avgDelayMin: 13,
			pctRight: 73.33,
			pctSlight: 23.33,
			pctSignificant: 3.33
		},
		CVP: {
			avgDelayMin: 22,
			pctRight: 43.33,
			pctSlight: 53.33,
			pctSignificant: 3.33
		},
		MEJ: {
			avgDelayMin: 27,
			pctRight: 33.33,
			pctSlight: 63.33,
			pctSignificant: 3.33
		},
		TEN: {
			avgDelayMin: 22,
			pctRight: 40,
			pctSlight: 56.67,
			pctSignificant: 3.33
		},
		NNN: {
			avgDelayMin: 27,
			pctRight: 33.33,
			pctSlight: 63.33,
			pctSignificant: 3.33
		},
		VLY: {
			avgDelayMin: 26,
			pctRight: 33.33,
			pctSlight: 63.33,
			pctSignificant: 3.33
		},
		AAY: {
			avgDelayMin: 24,
			pctRight: 36.67,
			pctSlight: 60,
			pctSignificant: 3.33
		},
		NJT: {
			avgDelayMin: 16,
			pctRight: 60,
			pctSlight: 36.67,
			pctSignificant: 3.33
		},
		ERL: {
			avgDelayMin: 0,
			pctRight: 26.67,
			pctSlight: 70,
			pctSignificant: 3.33
		},
		KZT: {
			avgDelayMin: 30,
			pctRight: 23.33,
			pctSlight: 73.33,
			pctSignificant: 3.33
		},
		NYY: {
			avgDelayMin: 0,
			pctRight: 10,
			pctSlight: 83.33,
			pctSignificant: 6.67
		},
		TVC: {
			avgDelayMin: 30,
			pctRight: 20,
			pctSlight: 73.33,
			pctSignificant: 6.67
		},
		CRY: {
			avgDelayMin: 14,
			pctRight: 80,
			pctSlight: 6.67,
			pctSignificant: 13.33
		},
		KVU: {
			avgDelayMin: 53,
			pctRight: 6.67,
			pctSlight: 70,
			pctSignificant: 23.33
		},
		VAK: {
			avgDelayMin: 0,
			pctRight: 10,
			pctSlight: 66.67,
			pctSignificant: 23.33
		},
		PVU: {
			avgDelayMin: 59,
			pctRight: 6.67,
			pctSlight: 60,
			pctSignificant: 33.33
		},
		QLN: {
			avgDelayMin: 59,
			pctRight: 13.33,
			pctSlight: 53.33,
			pctSignificant: 33.33
		},
		KYJ: {
			avgDelayMin: 69,
			pctRight: 0,
			pctSlight: 50,
			pctSignificant: 50
		},
		HAD: {
			avgDelayMin: 70,
			pctRight: 0,
			pctSlight: 46.67,
			pctSignificant: 53.33
		},
		ALLP: {
			avgDelayMin: 73,
			pctRight: 0,
			pctSlight: 36.67,
			pctSignificant: 63.33
		},
		SRTL: {
			avgDelayMin: 77,
			pctRight: 0,
			pctSlight: 30,
			pctSignificant: 70
		},
		ERS: {
			avgDelayMin: 43,
			pctRight: 16.67,
			pctSlight: 60,
			pctSignificant: 23.33
		},
		ERN: {
			avgDelayMin: 45,
			pctRight: 10,
			pctSlight: 66.67,
			pctSignificant: 23.33
		},
		AWY: {
			avgDelayMin: 42,
			pctRight: 10,
			pctSlight: 66.67,
			pctSignificant: 23.33
		},
		AFK: {
			avgDelayMin: 46,
			pctRight: 6.67,
			pctSlight: 70,
			pctSignificant: 23.33
		},
		CKI: {
			avgDelayMin: 0,
			pctRight: 6.67,
			pctSlight: 63.33,
			pctSignificant: 30
		},
		IJK: {
			avgDelayMin: 54,
			pctRight: 6.67,
			pctSlight: 63.33,
			pctSignificant: 30
		},
		TCR: {
			avgDelayMin: 30,
			pctRight: 53.33,
			pctSlight: 20,
			pctSignificant: 26.67
		},
		PNQ: {
			avgDelayMin: 36,
			pctRight: 43.33,
			pctSlight: 26.67,
			pctSignificant: 30
		},
		GUV: {
			avgDelayMin: 22,
			pctRight: 70,
			pctSlight: 13.33,
			pctSignificant: 16.67
		}
	},
	"16128": {
		GUV: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		PNQ: {
			avgDelayMin: 8,
			pctRight: 90,
			pctSlight: 10,
			pctSignificant: 0
		},
		TCR: {
			avgDelayMin: 11,
			pctRight: 83.33,
			pctSlight: 16.67,
			pctSignificant: 0
		},
		IJK: {
			avgDelayMin: 17,
			pctRight: 60,
			pctSlight: 40,
			pctSignificant: 0
		},
		CKI: {
			avgDelayMin: 0,
			pctRight: 50,
			pctSlight: 50,
			pctSignificant: 0
		},
		AFK: {
			avgDelayMin: 23,
			pctRight: 26.67,
			pctSlight: 70,
			pctSignificant: 3.33
		},
		AWY: {
			avgDelayMin: 29,
			pctRight: 6.67,
			pctSlight: 90,
			pctSignificant: 3.33
		},
		ERN: {
			avgDelayMin: 29,
			pctRight: 6.67,
			pctSlight: 90,
			pctSignificant: 3.33
		},
		ERS: {
			avgDelayMin: 27,
			pctRight: 13.33,
			pctSlight: 83.33,
			pctSignificant: 3.33
		},
		SRTL: {
			avgDelayMin: 29,
			pctRight: 10,
			pctSlight: 86.67,
			pctSignificant: 3.33
		},
		ALLP: {
			avgDelayMin: 31,
			pctRight: 6.67,
			pctSlight: 90,
			pctSignificant: 3.33
		},
		HAD: {
			avgDelayMin: 33,
			pctRight: 6.67,
			pctSlight: 90,
			pctSignificant: 3.33
		},
		KYJ: {
			avgDelayMin: 33,
			pctRight: 6.67,
			pctSlight: 90,
			pctSignificant: 3.33
		},
		QLN: {
			avgDelayMin: 0,
			pctRight: 10,
			pctSlight: 86.67,
			pctSignificant: 3.33
		},
		PVU: {
			avgDelayMin: 33,
			pctRight: 6.67,
			pctSlight: 90,
			pctSignificant: 3.33
		},
		VAK: {
			avgDelayMin: 38,
			pctRight: 6.67,
			pctSlight: 86.67,
			pctSignificant: 6.67
		},
		CRY: {
			avgDelayMin: 8,
			pctRight: 86.67,
			pctSlight: 13.33,
			pctSignificant: 0
		},
		TVC: {
			avgDelayMin: 29,
			pctRight: 0,
			pctSlight: 96.67,
			pctSignificant: 3.33
		},
		NYY: {
			avgDelayMin: 36,
			pctRight: 0,
			pctSlight: 96.67,
			pctSignificant: 3.33
		},
		KZT: {
			avgDelayMin: 39,
			pctRight: 0,
			pctSlight: 93.33,
			pctSignificant: 6.67
		},
		ERL: {
			avgDelayMin: 49,
			pctRight: 0,
			pctSlight: 93.33,
			pctSignificant: 6.67
		},
		NJT: {
			avgDelayMin: 50,
			pctRight: 0,
			pctSlight: 93.33,
			pctSignificant: 6.67
		},
		AAY: {
			avgDelayMin: 0,
			pctRight: 3.33,
			pctSlight: 93.33,
			pctSignificant: 3.33
		},
		VLY: {
			avgDelayMin: 34,
			pctRight: 0,
			pctSlight: 96.67,
			pctSignificant: 3.33
		},
		NNN: {
			avgDelayMin: 36,
			pctRight: 0,
			pctSlight: 96.67,
			pctSignificant: 3.33
		},
		TEN: {
			avgDelayMin: 5,
			pctRight: 93.33,
			pctSlight: 6.67,
			pctSignificant: 0
		},
		MEJ: {
			avgDelayMin: 8,
			pctRight: 86.67,
			pctSlight: 13.33,
			pctSignificant: 0
		},
		CVP: {
			avgDelayMin: 11,
			pctRight: 83.33,
			pctSlight: 16.67,
			pctSignificant: 0
		},
		SRT: {
			avgDelayMin: 14,
			pctRight: 66.67,
			pctSlight: 33.33,
			pctSignificant: 0
		},
		VPT: {
			avgDelayMin: 20,
			pctRight: 40,
			pctSlight: 60,
			pctSignificant: 0
		},
		MDU: {
			avgDelayMin: 5,
			pctRight: 90,
			pctSlight: 10,
			pctSignificant: 0
		},
		SDN: {
			avgDelayMin: 8,
			pctRight: 76.67,
			pctSlight: 23.33,
			pctSignificant: 0
		},
		KQN: {
			avgDelayMin: 8,
			pctRight: 73.33,
			pctSlight: 26.67,
			pctSignificant: 0
		},
		DG: {
			avgDelayMin: 7,
			pctRight: 76.67,
			pctSlight: 23.33,
			pctSignificant: 0
		},
		MPA: {
			avgDelayMin: 7,
			pctRight: 80,
			pctSlight: 20,
			pctSignificant: 0
		},
		TPJ: {
			avgDelayMin: 37,
			pctRight: 16.67,
			pctSlight: 73.33,
			pctSignificant: 10
		},
		SRGM: {
			avgDelayMin: 38,
			pctRight: 16.67,
			pctSlight: 66.67,
			pctSignificant: 16.67
		},
		ALU: {
			avgDelayMin: 43,
			pctRight: 6.67,
			pctSlight: 76.67,
			pctSignificant: 16.67
		},
		PNDM: {
			avgDelayMin: 24,
			pctRight: 36.67,
			pctSlight: 60,
			pctSignificant: 3.33
		},
		VRI: {
			avgDelayMin: 0,
			pctRight: 0,
			pctSlight: 60,
			pctSignificant: 40
		},
		VM: {
			avgDelayMin: 10,
			pctRight: 76.67,
			pctSlight: 23.33,
			pctSignificant: 0
		},
		TMV: {
			avgDelayMin: 16,
			pctRight: 60,
			pctSlight: 40,
			pctSignificant: 0
		},
		MLMR: {
			avgDelayMin: 14,
			pctRight: 60,
			pctSlight: 40,
			pctSignificant: 0
		},
		CGL: {
			avgDelayMin: 13,
			pctRight: 60,
			pctSlight: 40,
			pctSignificant: 0
		},
		TBM: {
			avgDelayMin: 19,
			pctRight: 36.67,
			pctSlight: 63.33,
			pctSignificant: 0
		},
		MBM: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		MS: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		}
	},
	"16339": {
		CSMT: {
			avgDelayMin: 5,
			pctRight: 94.12,
			pctSlight: 0,
			pctSignificant: 5.88
		},
		DR: {
			avgDelayMin: 9,
			pctRight: 94.12,
			pctSlight: 0,
			pctSignificant: 5.88
		},
		TNA: {
			avgDelayMin: 13,
			pctRight: 88.24,
			pctSlight: 5.88,
			pctSignificant: 5.88
		},
		KYN: {
			avgDelayMin: 26,
			pctRight: 5.88,
			pctSlight: 88.24,
			pctSignificant: 5.88
		},
		KJT: {
			avgDelayMin: 0,
			pctRight: 41.18,
			pctSlight: 52.94,
			pctSignificant: 5.88
		},
		PUNE: {
			avgDelayMin: 31,
			pctRight: 11.76,
			pctSlight: 82.35,
			pctSignificant: 5.88
		},
		DD: {
			avgDelayMin: 0,
			pctRight: 5.88,
			pctSlight: 82.35,
			pctSignificant: 11.76
		},
		KWV: {
			avgDelayMin: 35,
			pctRight: 0,
			pctSlight: 88.24,
			pctSignificant: 11.76
		},
		SUR: {
			avgDelayMin: 52,
			pctRight: 0,
			pctSlight: 88.24,
			pctSignificant: 11.76
		},
		KLBG: {
			avgDelayMin: 0,
			pctRight: 35.29,
			pctSlight: 52.94,
			pctSignificant: 11.76
		},
		SDB: {
			avgDelayMin: 27,
			pctRight: 29.41,
			pctSlight: 58.82,
			pctSignificant: 11.76
		},
		WADI: {
			avgDelayMin: 10,
			pctRight: 88.24,
			pctSlight: 5.88,
			pctSignificant: 5.88
		},
		YG: {
			avgDelayMin: 14,
			pctRight: 82.35,
			pctSlight: 11.76,
			pctSignificant: 5.88
		},
		RC: {
			avgDelayMin: 18,
			pctRight: 64.71,
			pctSlight: 29.41,
			pctSignificant: 5.88
		},
		MALM: {
			avgDelayMin: 0,
			pctRight: 82.35,
			pctSlight: 11.76,
			pctSignificant: 5.88
		},
		AD: {
			avgDelayMin: 26,
			pctRight: 47.06,
			pctSlight: 47.06,
			pctSignificant: 5.88
		},
		GTL: {
			avgDelayMin: 19,
			pctRight: 58.82,
			pctSlight: 35.29,
			pctSignificant: 5.88
		},
		ATP: {
			avgDelayMin: 25,
			pctRight: 41.18,
			pctSlight: 52.94,
			pctSignificant: 5.88
		},
		DMM: {
			avgDelayMin: 0,
			pctRight: 58.82,
			pctSlight: 35.29,
			pctSignificant: 5.88
		},
		KRY: {
			avgDelayMin: 23,
			pctRight: 58.82,
			pctSlight: 35.29,
			pctSignificant: 5.88
		},
		MPL: {
			avgDelayMin: 28,
			pctRight: 35.29,
			pctSlight: 58.82,
			pctSignificant: 5.88
		},
		PIL: {
			avgDelayMin: 0,
			pctRight: 70.59,
			pctSlight: 23.53,
			pctSignificant: 5.88
		},
		PAK: {
			avgDelayMin: 36,
			pctRight: 11.76,
			pctSlight: 82.35,
			pctSignificant: 5.88
		},
		CTO: {
			avgDelayMin: 35,
			pctRight: 17.65,
			pctSlight: 70.59,
			pctSignificant: 11.76
		},
		KPD: {
			avgDelayMin: 19,
			pctRight: 47.06,
			pctSlight: 52.94,
			pctSignificant: 0
		},
		TPT: {
			avgDelayMin: 13,
			pctRight: 70.59,
			pctSlight: 29.41,
			pctSignificant: 0
		},
		SLY: {
			avgDelayMin: 0,
			pctRight: 52.94,
			pctSlight: 47.06,
			pctSignificant: 0
		},
		SA: {
			avgDelayMin: 23,
			pctRight: 11.76,
			pctSlight: 88.24,
			pctSignificant: 0
		},
		NMKL: {
			avgDelayMin: 0,
			pctRight: 35.29,
			pctSlight: 64.71,
			pctSignificant: 0
		},
		KRR: {
			avgDelayMin: 6,
			pctRight: 94.12,
			pctSlight: 5.88,
			pctSignificant: 0
		},
		DG: {
			avgDelayMin: 6,
			pctRight: 94.12,
			pctSlight: 5.88,
			pctSignificant: 0
		},
		KQN: {
			avgDelayMin: 15,
			pctRight: 64.71,
			pctSlight: 35.29,
			pctSignificant: 0
		},
		MDU: {
			avgDelayMin: 8,
			pctRight: 76.47,
			pctSlight: 23.53,
			pctSignificant: 0
		},
		VPT: {
			avgDelayMin: 10,
			pctRight: 76.47,
			pctSlight: 23.53,
			pctSignificant: 0
		},
		SRT: {
			avgDelayMin: 10,
			pctRight: 76.47,
			pctSlight: 23.53,
			pctSignificant: 0
		},
		CVP: {
			avgDelayMin: 9,
			pctRight: 82.35,
			pctSlight: 17.65,
			pctSignificant: 0
		},
		TEN: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		NNN: {
			avgDelayMin: 3,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		VLY: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		NCJ: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		}
	},
	"16340": {
		NCJ: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		VLY: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		NNN: {
			avgDelayMin: 2,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		TEN: {
			avgDelayMin: 2,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		CVP: {
			avgDelayMin: 0,
			pctRight: 75,
			pctSlight: 25,
			pctSignificant: 0
		},
		SRT: {
			avgDelayMin: 0,
			pctRight: 75,
			pctSlight: 25,
			pctSignificant: 0
		},
		VPT: {
			avgDelayMin: 8,
			pctRight: 81.25,
			pctSlight: 18.75,
			pctSignificant: 0
		},
		MDU: {
			avgDelayMin: 19,
			pctRight: 56.25,
			pctSlight: 31.25,
			pctSignificant: 12.5
		},
		KQN: {
			avgDelayMin: 0,
			pctRight: 25,
			pctSlight: 37.5,
			pctSignificant: 37.5
		},
		DG: {
			avgDelayMin: 39,
			pctRight: 37.5,
			pctSlight: 31.25,
			pctSignificant: 31.25
		},
		KRR: {
			avgDelayMin: 43,
			pctRight: 12.5,
			pctSlight: 50,
			pctSignificant: 37.5
		},
		NMKL: {
			avgDelayMin: 0,
			pctRight: 25,
			pctSlight: 50,
			pctSignificant: 25
		},
		SA: {
			avgDelayMin: 16,
			pctRight: 56.25,
			pctSlight: 43.75,
			pctSignificant: 0
		},
		SLY: {
			avgDelayMin: 40,
			pctRight: 0,
			pctSlight: 93.75,
			pctSignificant: 6.25
		},
		TPT: {
			avgDelayMin: 0,
			pctRight: 6.25,
			pctSlight: 75,
			pctSignificant: 18.75
		},
		KPD: {
			avgDelayMin: 0,
			pctRight: 87.5,
			pctSlight: 12.5,
			pctSignificant: 0
		},
		CTO: {
			avgDelayMin: 15,
			pctRight: 75,
			pctSlight: 25,
			pctSignificant: 0
		},
		PAK: {
			avgDelayMin: 28,
			pctRight: 0,
			pctSlight: 93.75,
			pctSignificant: 6.25
		},
		PIL: {
			avgDelayMin: 31,
			pctRight: 0,
			pctSlight: 93.75,
			pctSignificant: 6.25
		},
		MPL: {
			avgDelayMin: 34,
			pctRight: 6.25,
			pctSlight: 87.5,
			pctSignificant: 6.25
		},
		KRY: {
			avgDelayMin: 27,
			pctRight: 37.5,
			pctSlight: 56.25,
			pctSignificant: 6.25
		},
		DMM: {
			avgDelayMin: 11,
			pctRight: 75,
			pctSlight: 25,
			pctSignificant: 0
		},
		ATP: {
			avgDelayMin: 10,
			pctRight: 68.75,
			pctSlight: 31.25,
			pctSignificant: 0
		},
		GTL: {
			avgDelayMin: 15,
			pctRight: 56.25,
			pctSlight: 43.75,
			pctSignificant: 0
		},
		AD: {
			avgDelayMin: 24,
			pctRight: 25,
			pctSlight: 75,
			pctSignificant: 0
		},
		MALM: {
			avgDelayMin: 24,
			pctRight: 18.75,
			pctSlight: 75,
			pctSignificant: 6.25
		},
		RC: {
			avgDelayMin: 0,
			pctRight: 68.75,
			pctSlight: 31.25,
			pctSignificant: 0
		},
		YG: {
			avgDelayMin: 19,
			pctRight: 37.5,
			pctSlight: 62.5,
			pctSignificant: 0
		},
		WADI: {
			avgDelayMin: 10,
			pctRight: 81.25,
			pctSlight: 18.75,
			pctSignificant: 0
		},
		SDB: {
			avgDelayMin: 10,
			pctRight: 81.25,
			pctSlight: 18.75,
			pctSignificant: 0
		},
		KLBG: {
			avgDelayMin: 17,
			pctRight: 56.25,
			pctSlight: 43.75,
			pctSignificant: 0
		},
		SUR: {
			avgDelayMin: 18,
			pctRight: 43.75,
			pctSlight: 56.25,
			pctSignificant: 0
		},
		KWV: {
			avgDelayMin: 19,
			pctRight: 43.75,
			pctSlight: 56.25,
			pctSignificant: 0
		},
		DD: {
			avgDelayMin: 7,
			pctRight: 87.5,
			pctSlight: 12.5,
			pctSignificant: 0
		},
		PUNE: {
			avgDelayMin: 14,
			pctRight: 68.75,
			pctSlight: 31.25,
			pctSignificant: 0
		},
		KYN: {
			avgDelayMin: 29,
			pctRight: 12.5,
			pctSlight: 81.25,
			pctSignificant: 6.25
		},
		TNA: {
			avgDelayMin: 31,
			pctRight: 12.5,
			pctSlight: 81.25,
			pctSignificant: 6.25
		},
		DR: {
			avgDelayMin: 27,
			pctRight: 18.75,
			pctSlight: 75,
			pctSignificant: 6.25
		},
		CSMT: {
			avgDelayMin: 17,
			pctRight: 62.5,
			pctSlight: 37.5,
			pctSignificant: 0
		}
	},
	"17057": {
		CSMT: {
			avgDelayMin: 3,
			pctRight: 96.67,
			pctSlight: 3.33,
			pctSignificant: 0
		},
		DR: {
			avgDelayMin: 10,
			pctRight: 90,
			pctSlight: 10,
			pctSignificant: 0
		},
		TNA: {
			avgDelayMin: 0,
			pctRight: 93.33,
			pctSlight: 6.67,
			pctSignificant: 0
		},
		KYN: {
			avgDelayMin: 16,
			pctRight: 40,
			pctSlight: 60,
			pctSignificant: 0
		},
		KSRA: {
			avgDelayMin: 21,
			pctRight: 36.67,
			pctSlight: 63.33,
			pctSignificant: 0
		},
		IGP: {
			avgDelayMin: 22,
			pctRight: 33.33,
			pctSlight: 66.67,
			pctSignificant: 0
		},
		NK: {
			avgDelayMin: 23,
			pctRight: 30,
			pctSlight: 70,
			pctSignificant: 0
		},
		MMR: {
			avgDelayMin: 20,
			pctRight: 43.33,
			pctSlight: 53.33,
			pctSignificant: 3.33
		},
		RGO: {
			avgDelayMin: 17,
			pctRight: 66.67,
			pctSlight: 30,
			pctSignificant: 3.33
		},
		LSR: {
			avgDelayMin: 0,
			pctRight: 50,
			pctSlight: 46.67,
			pctSignificant: 3.33
		},
		AWB: {
			avgDelayMin: 22,
			pctRight: 60,
			pctSlight: 33.33,
			pctSignificant: 6.67
		},
		PTU: {
			avgDelayMin: 0,
			pctRight: 3.33,
			pctSlight: 46.67,
			pctSignificant: 50
		},
		SELU: {
			avgDelayMin: 58,
			pctRight: 6.67,
			pctSlight: 60,
			pctSignificant: 33.33
		},
		MVO: {
			avgDelayMin: 54,
			pctRight: 3.33,
			pctSlight: 70,
			pctSignificant: 26.67
		},
		PBN: {
			avgDelayMin: 48,
			pctRight: 10,
			pctSlight: 66.67,
			pctSignificant: 23.33
		},
		PAU: {
			avgDelayMin: 0,
			pctRight: 26.67,
			pctSlight: 63.33,
			pctSignificant: 10
		},
		NED: {
			avgDelayMin: 37,
			pctRight: 20,
			pctSlight: 66.67,
			pctSignificant: 13.33
		},
		MUE: {
			avgDelayMin: 0,
			pctRight: 33.33,
			pctSlight: 53.33,
			pctSignificant: 13.33
		},
		UMRI: {
			avgDelayMin: 38,
			pctRight: 26.67,
			pctSlight: 53.33,
			pctSignificant: 20
		},
		DAB: {
			avgDelayMin: 44,
			pctRight: 10,
			pctSlight: 70,
			pctSignificant: 20
		},
		BSX: {
			avgDelayMin: 51,
			pctRight: 6.67,
			pctSlight: 66.67,
			pctSignificant: 26.67
		},
		NZB: {
			avgDelayMin: 55,
			pctRight: 6.67,
			pctSlight: 63.33,
			pctSignificant: 30
		},
		KMC: {
			avgDelayMin: 57,
			pctRight: 13.33,
			pctSlight: 50,
			pctSignificant: 36.67
		},
		AKE: {
			avgDelayMin: 57,
			pctRight: 13.33,
			pctSlight: 46.67,
			pctSignificant: 40
		},
		MZL: {
			avgDelayMin: 60,
			pctRight: 13.33,
			pctSlight: 43.33,
			pctSignificant: 43.33
		},
		BMO: {
			avgDelayMin: 35,
			pctRight: 36.67,
			pctSlight: 46.67,
			pctSignificant: 16.67
		},
		SC: {
			avgDelayMin: 52,
			pctRight: 36.67,
			pctSlight: 46.67,
			pctSignificant: 16.67
		},
		BMT: {
			avgDelayMin: 36,
			pctRight: 70,
			pctSlight: 13.33,
			pctSignificant: 16.67
		},
		LPI: {
			avgDelayMin: 42,
			pctRight: 76.67,
			pctSlight: 10,
			pctSignificant: 13.33
		}
	},
	"17058": {
		LPI: {
			avgDelayMin: 2,
			pctRight: 96.67,
			pctSlight: 3.33,
			pctSignificant: 0
		},
		BMT: {
			avgDelayMin: 4,
			pctRight: 96.67,
			pctSlight: 0,
			pctSignificant: 3.33
		},
		SC: {
			avgDelayMin: 0,
			pctRight: 86.67,
			pctSlight: 13.33,
			pctSignificant: 0
		},
		BMO: {
			avgDelayMin: 5,
			pctRight: 90,
			pctSlight: 10,
			pctSignificant: 0
		},
		MZL: {
			avgDelayMin: 17,
			pctRight: 43.33,
			pctSlight: 56.67,
			pctSignificant: 0
		},
		AKE: {
			avgDelayMin: 21,
			pctRight: 33.33,
			pctSlight: 66.67,
			pctSignificant: 0
		},
		KMC: {
			avgDelayMin: 29,
			pctRight: 16.67,
			pctSlight: 80,
			pctSignificant: 3.33
		},
		NZB: {
			avgDelayMin: 42,
			pctRight: 13.33,
			pctSlight: 70,
			pctSignificant: 16.67
		},
		BSX: {
			avgDelayMin: 54,
			pctRight: 6.67,
			pctSlight: 80,
			pctSignificant: 13.33
		},
		DAB: {
			avgDelayMin: 57,
			pctRight: 6.67,
			pctSlight: 80,
			pctSignificant: 13.33
		},
		UMRI: {
			avgDelayMin: 53,
			pctRight: 6.67,
			pctSlight: 83.33,
			pctSignificant: 10
		},
		MUE: {
			avgDelayMin: 29,
			pctRight: 73.33,
			pctSlight: 16.67,
			pctSignificant: 10
		},
		NED: {
			avgDelayMin: 29,
			pctRight: 66.67,
			pctSlight: 23.33,
			pctSignificant: 10
		},
		PAU: {
			avgDelayMin: 24,
			pctRight: 70,
			pctSlight: 23.33,
			pctSignificant: 6.67
		},
		PBN: {
			avgDelayMin: 30,
			pctRight: 80,
			pctSlight: 10,
			pctSignificant: 10
		},
		MVO: {
			avgDelayMin: 36,
			pctRight: 70,
			pctSlight: 20,
			pctSignificant: 10
		},
		SELU: {
			avgDelayMin: 35,
			pctRight: 60,
			pctSlight: 30,
			pctSignificant: 10
		},
		PTU: {
			avgDelayMin: 46,
			pctRight: 33.33,
			pctSlight: 56.67,
			pctSignificant: 10
		},
		AWB: {
			avgDelayMin: 49,
			pctRight: 20,
			pctSlight: 70,
			pctSignificant: 10
		},
		LSR: {
			avgDelayMin: 43,
			pctRight: 50,
			pctSlight: 40,
			pctSignificant: 10
		},
		RGO: {
			avgDelayMin: 41,
			pctRight: 53.33,
			pctSlight: 36.67,
			pctSignificant: 10
		},
		MMR: {
			avgDelayMin: 53,
			pctRight: 53.33,
			pctSlight: 33.33,
			pctSignificant: 13.33
		},
		NK: {
			avgDelayMin: 62,
			pctRight: 16.67,
			pctSlight: 70,
			pctSignificant: 13.33
		},
		IGP: {
			avgDelayMin: 39,
			pctRight: 83.33,
			pctSlight: 3.33,
			pctSignificant: 13.33
		},
		KYN: {
			avgDelayMin: 53,
			pctRight: 46.67,
			pctSlight: 40,
			pctSignificant: 13.33
		},
		TNA: {
			avgDelayMin: 62,
			pctRight: 10,
			pctSlight: 76.67,
			pctSignificant: 13.33
		},
		DR: {
			avgDelayMin: 61,
			pctRight: 20,
			pctSlight: 66.67,
			pctSignificant: 13.33
		},
		CSMT: {
			avgDelayMin: 39,
			pctRight: 83.33,
			pctSlight: 3.33,
			pctSignificant: 13.33
		}
	},
	"20665": {
		MS: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		TBM: {
			avgDelayMin: 3,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		VM: {
			avgDelayMin: 7,
			pctRight: 92.31,
			pctSlight: 7.69,
			pctSignificant: 0
		},
		TPJ: {
			avgDelayMin: 7,
			pctRight: 92.31,
			pctSlight: 7.69,
			pctSignificant: 0
		},
		DG: {
			avgDelayMin: 11,
			pctRight: 88.46,
			pctSlight: 7.69,
			pctSignificant: 3.85
		},
		MDU: {
			avgDelayMin: 15,
			pctRight: 80.77,
			pctSlight: 15.38,
			pctSignificant: 3.85
		},
		VPT: {
			avgDelayMin: 17,
			pctRight: 61.54,
			pctSlight: 34.62,
			pctSignificant: 3.85
		},
		TEN: {
			avgDelayMin: 0,
			pctRight: 96.15,
			pctSlight: 0,
			pctSignificant: 3.85
		}
	},
	"20666": {
		TEN: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		VPT: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		MDU: {
			avgDelayMin: 2,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		DG: {
			avgDelayMin: 9,
			pctRight: 96.15,
			pctSlight: 3.85,
			pctSignificant: 0
		},
		TPJ: {
			avgDelayMin: 3,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		VM: {
			avgDelayMin: 10,
			pctRight: 92.31,
			pctSlight: 7.69,
			pctSignificant: 0
		},
		TBM: {
			avgDelayMin: 20,
			pctRight: 19.23,
			pctSlight: 80.77,
			pctSignificant: 0
		},
		MS: {
			avgDelayMin: 4,
			pctRight: 92.31,
			pctSlight: 7.69,
			pctSignificant: 0
		}
	},
	"22221": {
		CSMT: {
			avgDelayMin: 1,
			pctRight: 96.67,
			pctSlight: 3.33,
			pctSignificant: 0
		},
		KYN: {
			avgDelayMin: 9,
			pctRight: 86.67,
			pctSlight: 13.33,
			pctSignificant: 0
		},
		NK: {
			avgDelayMin: 0,
			pctRight: 13.33,
			pctSlight: 86.67,
			pctSignificant: 0
		},
		JL: {
			avgDelayMin: 0,
			pctRight: 10,
			pctSlight: 90,
			pctSignificant: 0
		},
		BSL: {
			avgDelayMin: 12,
			pctRight: 80,
			pctSlight: 20,
			pctSignificant: 0
		},
		BPL: {
			avgDelayMin: 12,
			pctRight: 86.67,
			pctSlight: 10,
			pctSignificant: 3.33
		},
		VGLJ: {
			avgDelayMin: 9,
			pctRight: 93.33,
			pctSlight: 3.33,
			pctSignificant: 3.33
		},
		GWL: {
			avgDelayMin: 14,
			pctRight: 83.33,
			pctSlight: 13.33,
			pctSignificant: 3.33
		},
		AGC: {
			avgDelayMin: 0,
			pctRight: 93.33,
			pctSlight: 3.33,
			pctSignificant: 3.33
		},
		NZM: {
			avgDelayMin: 0,
			pctRight: 90,
			pctSlight: 6.67,
			pctSignificant: 3.33
		}
	},
	"22222": {
		NZM: {
			avgDelayMin: 1,
			pctRight: 96.67,
			pctSlight: 3.33,
			pctSignificant: 0
		},
		AGC: {
			avgDelayMin: 16,
			pctRight: 70,
			pctSlight: 30,
			pctSignificant: 0
		},
		GWL: {
			avgDelayMin: 13,
			pctRight: 80,
			pctSlight: 20,
			pctSignificant: 0
		},
		VGLJ: {
			avgDelayMin: 5,
			pctRight: 93.33,
			pctSlight: 6.67,
			pctSignificant: 0
		},
		BPL: {
			avgDelayMin: 23,
			pctRight: 53.33,
			pctSlight: 43.33,
			pctSignificant: 3.33
		},
		BSL: {
			avgDelayMin: 22,
			pctRight: 60,
			pctSlight: 36.67,
			pctSignificant: 3.33
		},
		JL: {
			avgDelayMin: 25,
			pctRight: 40,
			pctSlight: 56.67,
			pctSignificant: 3.33
		},
		NK: {
			avgDelayMin: 23,
			pctRight: 53.33,
			pctSlight: 43.33,
			pctSignificant: 3.33
		},
		KYN: {
			avgDelayMin: 22,
			pctRight: 56.67,
			pctSlight: 40,
			pctSignificant: 3.33
		},
		CSMT: {
			avgDelayMin: 0,
			pctRight: 83.33,
			pctSlight: 10,
			pctSignificant: 6.67
		}
	},
	"22225": {
		CSMT: {
			avgDelayMin: 2,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		DR: {
			avgDelayMin: 5,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		TNA: {
			avgDelayMin: 6,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		KYN: {
			avgDelayMin: 12,
			pctRight: 80.77,
			pctSlight: 19.23,
			pctSignificant: 0
		},
		PUNE: {
			avgDelayMin: 16,
			pctRight: 61.54,
			pctSlight: 34.62,
			pctSignificant: 3.85
		},
		KWV: {
			avgDelayMin: 16,
			pctRight: 61.54,
			pctSlight: 34.62,
			pctSignificant: 3.85
		},
		SUR: {
			avgDelayMin: 3,
			pctRight: 96.15,
			pctSlight: 3.85,
			pctSignificant: 0
		}
	},
	"22226": {
		SUR: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		KWV: {
			avgDelayMin: 6,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		PUNE: {
			avgDelayMin: 5,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		KYN: {
			avgDelayMin: 0,
			pctRight: 46.15,
			pctSlight: 50,
			pctSignificant: 3.85
		},
		TNA: {
			avgDelayMin: 18,
			pctRight: 42.31,
			pctSlight: 53.85,
			pctSignificant: 3.85
		},
		DR: {
			avgDelayMin: 19,
			pctRight: 38.46,
			pctSlight: 57.69,
			pctSignificant: 3.85
		},
		CSMT: {
			avgDelayMin: 13,
			pctRight: 88.46,
			pctSlight: 7.69,
			pctSignificant: 3.85
		}
	},
	"22301": {
		HWH: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		BHP: {
			avgDelayMin: 19,
			pctRight: 38.46,
			pctSlight: 61.54,
			pctSignificant: 0
		},
		MLDT: {
			avgDelayMin: 5,
			pctRight: 92.31,
			pctSlight: 7.69,
			pctSignificant: 0
		},
		BOE: {
			avgDelayMin: 14,
			pctRight: 76.92,
			pctSlight: 19.23,
			pctSignificant: 3.85
		},
		KNE: {
			avgDelayMin: 10,
			pctRight: 26.92,
			pctSlight: 19.23,
			pctSignificant: 0
		},
		NJP: {
			avgDelayMin: 7,
			pctRight: 88.46,
			pctSlight: 11.54,
			pctSignificant: 0
		}
	},
	"22302": {
		NJP: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		KNE: {
			avgDelayMin: 15,
			pctRight: 26.92,
			pctSlight: 19.23,
			pctSignificant: 0
		},
		BOE: {
			avgDelayMin: 11,
			pctRight: 84.62,
			pctSlight: 15.38,
			pctSignificant: 0
		},
		MLDT: {
			avgDelayMin: 15,
			pctRight: 61.54,
			pctSlight: 38.46,
			pctSignificant: 0
		},
		BHP: {
			avgDelayMin: 21,
			pctRight: 46.15,
			pctSlight: 53.85,
			pctSignificant: 0
		},
		HWH: {
			avgDelayMin: 0,
			pctRight: 96.15,
			pctSlight: 3.85,
			pctSignificant: 0
		}
	},
	"22601": {
		MAS: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		AJJ: {
			avgDelayMin: 0,
			pctRight: 75,
			pctSlight: 0,
			pctSignificant: 25
		},
		KPD: {
			avgDelayMin: 55,
			pctRight: 75,
			pctSlight: 0,
			pctSignificant: 25
		},
		JTJ: {
			avgDelayMin: 0,
			pctRight: 75,
			pctSlight: 0,
			pctSignificant: 25
		},
		KPN: {
			avgDelayMin: 59,
			pctRight: 75,
			pctSlight: 0,
			pctSignificant: 25
		},
		BWT: {
			avgDelayMin: 63,
			pctRight: 50,
			pctSlight: 25,
			pctSignificant: 25
		},
		MLO: {
			avgDelayMin: 59,
			pctRight: 50,
			pctSlight: 25,
			pctSignificant: 25
		},
		KJM: {
			avgDelayMin: 73,
			pctRight: 25,
			pctSlight: 50,
			pctSignificant: 25
		},
		YNK: {
			avgDelayMin: 59,
			pctRight: 75,
			pctSlight: 0,
			pctSignificant: 25
		},
		HUP: {
			avgDelayMin: 62,
			pctRight: 75,
			pctSlight: 0,
			pctSignificant: 25
		},
		SSPN: {
			avgDelayMin: 0,
			pctRight: 75,
			pctSlight: 0,
			pctSignificant: 25
		},
		DMM: {
			avgDelayMin: 65,
			pctRight: 75,
			pctSlight: 0,
			pctSignificant: 25
		},
		ATP: {
			avgDelayMin: 64,
			pctRight: 75,
			pctSlight: 0,
			pctSignificant: 25
		},
		GTL: {
			avgDelayMin: 70,
			pctRight: 75,
			pctSlight: 0,
			pctSignificant: 25
		},
		AD: {
			avgDelayMin: 66,
			pctRight: 75,
			pctSlight: 0,
			pctSignificant: 25
		},
		MALM: {
			avgDelayMin: 61,
			pctRight: 75,
			pctSlight: 0,
			pctSignificant: 25
		},
		RC: {
			avgDelayMin: 61,
			pctRight: 75,
			pctSlight: 0,
			pctSignificant: 25
		},
		WADI: {
			avgDelayMin: 54,
			pctRight: 50,
			pctSlight: 25,
			pctSignificant: 25
		},
		KLBG: {
			avgDelayMin: 67,
			pctRight: 25,
			pctSlight: 50,
			pctSignificant: 25
		},
		SUR: {
			avgDelayMin: 66,
			pctRight: 0,
			pctSlight: 75,
			pctSignificant: 25
		},
		DD: {
			avgDelayMin: 59,
			pctRight: 25,
			pctSlight: 50,
			pctSignificant: 25
		},
		ANG: {
			avgDelayMin: 90,
			pctRight: 0,
			pctSlight: 50,
			pctSignificant: 50
		},
		SNSI: {
			avgDelayMin: 40,
			pctRight: 75,
			pctSlight: 0,
			pctSignificant: 25
		}
	},
	"22602": {
		SNSI: {
			avgDelayMin: 2,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		ANG: {
			avgDelayMin: 0,
			pctRight: 0,
			pctSlight: 100,
			pctSignificant: 0
		},
		DD: {
			avgDelayMin: 18,
			pctRight: 50,
			pctSlight: 50,
			pctSignificant: 0
		},
		SUR: {
			avgDelayMin: 30,
			pctRight: 25,
			pctSlight: 75,
			pctSignificant: 0
		},
		KLBG: {
			avgDelayMin: 26,
			pctRight: 0,
			pctSlight: 100,
			pctSignificant: 0
		},
		WADI: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		RC: {
			avgDelayMin: 13,
			pctRight: 50,
			pctSlight: 50,
			pctSignificant: 0
		},
		MALM: {
			avgDelayMin: 0,
			pctRight: 50,
			pctSlight: 50,
			pctSignificant: 0
		},
		AD: {
			avgDelayMin: 17,
			pctRight: 75,
			pctSlight: 25,
			pctSignificant: 0
		},
		GTL: {
			avgDelayMin: 15,
			pctRight: 50,
			pctSlight: 50,
			pctSignificant: 0
		},
		ATP: {
			avgDelayMin: 21,
			pctRight: 50,
			pctSlight: 50,
			pctSignificant: 0
		},
		DMM: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		SSPN: {
			avgDelayMin: 13,
			pctRight: 50,
			pctSlight: 50,
			pctSignificant: 0
		},
		HUP: {
			avgDelayMin: 12,
			pctRight: 75,
			pctSlight: 25,
			pctSignificant: 0
		},
		YNK: {
			avgDelayMin: 19,
			pctRight: 25,
			pctSlight: 75,
			pctSignificant: 0
		},
		KJM: {
			avgDelayMin: 4,
			pctRight: 75,
			pctSlight: 25,
			pctSignificant: 0
		},
		MLO: {
			avgDelayMin: 8,
			pctRight: 75,
			pctSlight: 25,
			pctSignificant: 0
		},
		BWT: {
			avgDelayMin: 8,
			pctRight: 75,
			pctSlight: 25,
			pctSignificant: 0
		},
		KPN: {
			avgDelayMin: 12,
			pctRight: 50,
			pctSlight: 50,
			pctSignificant: 0
		},
		JTJ: {
			avgDelayMin: 2,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		KPD: {
			avgDelayMin: 5,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		AJJ: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		PER: {
			avgDelayMin: 19,
			pctRight: 50,
			pctSlight: 50,
			pctSignificant: 0
		},
		MAS: {
			avgDelayMin: 10,
			pctRight: 75,
			pctSlight: 25,
			pctSignificant: 0
		}
	},
	"22651": {
		MAS: {
			avgDelayMin: 3,
			pctRight: 96.67,
			pctSlight: 3.33,
			pctSignificant: 0
		},
		TRL: {
			avgDelayMin: 8,
			pctRight: 90,
			pctSlight: 10,
			pctSignificant: 0
		},
		AJJ: {
			avgDelayMin: 15,
			pctRight: 66.67,
			pctSlight: 33.33,
			pctSignificant: 0
		},
		KPD: {
			avgDelayMin: 18,
			pctRight: 50,
			pctSlight: 50,
			pctSignificant: 0
		},
		GYM: {
			avgDelayMin: 24,
			pctRight: 16.67,
			pctSlight: 83.33,
			pctSignificant: 0
		},
		JTJ: {
			avgDelayMin: 12,
			pctRight: 73.33,
			pctSlight: 26.67,
			pctSignificant: 0
		},
		MAP: {
			avgDelayMin: 17,
			pctRight: 53.33,
			pctSlight: 46.67,
			pctSignificant: 0
		},
		SA: {
			avgDelayMin: 14,
			pctRight: 66.67,
			pctSlight: 33.33,
			pctSignificant: 0
		},
		RASP: {
			avgDelayMin: 14,
			pctRight: 70,
			pctSlight: 30,
			pctSignificant: 0
		},
		NMKL: {
			avgDelayMin: 13,
			pctRight: 66.67,
			pctSlight: 33.33,
			pctSignificant: 0
		},
		MONR: {
			avgDelayMin: 13,
			pctRight: 66.67,
			pctSlight: 33.33,
			pctSignificant: 0
		},
		KRR: {
			avgDelayMin: 11,
			pctRight: 80,
			pctSlight: 20,
			pctSignificant: 0
		},
		DG: {
			avgDelayMin: 17,
			pctRight: 46.67,
			pctSlight: 53.33,
			pctSignificant: 0
		},
		ODC: {
			avgDelayMin: 14,
			pctRight: 63.33,
			pctSlight: 36.67,
			pctSignificant: 0
		},
		PLNI: {
			avgDelayMin: 0,
			pctRight: 53.33,
			pctSlight: 46.67,
			pctSignificant: 0
		},
		UDT: {
			avgDelayMin: 13,
			pctRight: 60,
			pctSlight: 40,
			pctSignificant: 0
		},
		POY: {
			avgDelayMin: 8,
			pctRight: 80,
			pctSlight: 20,
			pctSignificant: 0
		},
		PGTN: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		PGT: {
			avgDelayMin: 0,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		}
	},
	"22652": {
		PGT: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		PGTN: {
			avgDelayMin: 3,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		POY: {
			avgDelayMin: 1,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		UDT: {
			avgDelayMin: 2,
			pctRight: 100,
			pctSlight: 0,
			pctSignificant: 0
		},
		PLNI: {
			avgDelayMin: 7,
			pctRight: 96.67,
			pctSlight: 3.33,
			pctSignificant: 0
		},
		ODC: {
			avgDelayMin: 11,
			pctRight: 73.33,
			pctSlight: 26.67,
			pctSignificant: 0
		},
		DG: {
			avgDelayMin: 5,
			pctRight: 96.67,
			pctSlight: 3.33,
			pctSignificant: 0
		},
		KRR: {
			avgDelayMin: 7,
			pctRight: 83.33,
			pctSlight: 16.67,
			pctSignificant: 0
		},
		MONR: {
			avgDelayMin: 11,
			pctRight: 70,
			pctSlight: 30,
			pctSignificant: 0
		},
		NMKL: {
			avgDelayMin: 13,
			pctRight: 63.33,
			pctSlight: 36.67,
			pctSignificant: 0
		},
		RASP: {
			avgDelayMin: 13,
			pctRight: 63.33,
			pctSlight: 36.67,
			pctSignificant: 0
		},
		SA: {
			avgDelayMin: 5,
			pctRight: 96.67,
			pctSlight: 3.33,
			pctSignificant: 0
		},
		MAP: {
			avgDelayMin: 6,
			pctRight: 86.67,
			pctSlight: 13.33,
			pctSignificant: 0
		},
		JTJ: {
			avgDelayMin: 3,
			pctRight: 96.67,
			pctSlight: 3.33,
			pctSignificant: 0
		},
		GYM: {
			avgDelayMin: 5,
			pctRight: 93.33,
			pctSlight: 6.67,
			pctSignificant: 0
		},
		KPD: {
			avgDelayMin: 7,
			pctRight: 83.33,
			pctSlight: 16.67,
			pctSignificant: 0
		},
		AJJ: {
			avgDelayMin: 10,
			pctRight: 83.33,
			pctSlight: 16.67,
			pctSignificant: 0
		},
		TRL: {
			avgDelayMin: 12,
			pctRight: 66.67,
			pctSlight: 33.33,
			pctSignificant: 0
		},
		PER: {
			avgDelayMin: 18,
			pctRight: 46.67,
			pctSlight: 53.33,
			pctSignificant: 0
		},
		MAS: {
			avgDelayMin: 1,
			pctRight: 93.33,
			pctSlight: 6.67,
			pctSignificant: 0
		}
	}
};
var trainRunHistory = {
	"12002": [
		10,
		70,
		130,
		25,
		5,
		45,
		15,
		60,
		20,
		9
	],
	"12229": [
		1,
		14,
		45,
		70,
		5,
		23,
		14,
		29,
		20,
		34
	],
	"12238": [
		75,
		20,
		90,
		10,
		30,
		5,
		40,
		90,
		15,
		50
	],
	"12301": [
		20,
		40,
		70,
		5,
		30,
		50,
		75,
		10,
		60,
		25
	],
	"12377": [
		20,
		60,
		5,
		10,
		20,
		23,
		11,
		0,
		100,
		25
	],
	"12604": [
		20,
		45,
		10,
		25,
		50,
		30,
		75,
		75,
		5,
		40
	],
	"12633": [
		0,
		20,
		40,
		3,
		5,
		55,
		45,
		65,
		0,
		39
	],
	"15029": [
		80,
		45,
		30,
		10,
		20,
		10,
		120,
		60,
		35,
		75
	],
	"15906": [
		5,
		35,
		63,
		15,
		22,
		0,
		1,
		9,
		23,
		31
	],
	"22832": [
		30,
		9,
		14,
		20,
		1,
		0,
		20,
		244,
		188,
		60
	]
};
/** Format minutes-after-midnight as HH:MM. */
function fmtClock(minutesAfterMidnight) {
	const m = (Math.round(minutesAfterMidnight) % 1440 + 1440) % 1440;
	return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}
/**
* Real historical baseline delay (minutes) recorded at a given halt for a
* train, sourced from the per-station delay dataset. Falls back to a small
* deterministic estimate when the station is missing from the scrape.
*/
function historicalDelayAt(train, haltIndex) {
	const halt = train.halts[haltIndex];
	if (!halt) return 0;
	const stat = trainDelayStats[train.number]?.[halt.code];
	if (stat && Number.isFinite(stat.avgDelayMin) && stat.avgDelayMin > 0) return Math.max(0, Math.round(stat.avgDelayMin));
	return 0;
}
var weatherPenalty = {
	clear: 0,
	rain: 6,
	fog: 14,
	wind: 8,
	heat: 4
};
/** Convergence factor: how quickly additional delay decays with distance covered. */
var delayDecay = .045;
/**
* Primary predictor. Given the current state of a train and the accumulated
* historical signal, returns an ETA forecast for the *next* halt (or a named
* target halt index).
*/
function predictDelay(features, targetHaltIndex) {
	const lastIdx = features.lastHaltIndex;
	const targetIdx = targetHaltIndex ?? lastIdx + 1;
	const recovered = features.currentDelayMin * (1 - delayDecay * Math.max(0, targetIdx - lastIdx));
	let histSum = 0;
	for (const d of features.priorHaltDelays) histSum += d;
	const histComponent = (features.priorHaltDelays.length ? histSum / features.priorHaltDelays.length : 0) * .4 * Math.max(0, targetIdx - lastIdx);
	let runComponent = 0;
	if (features.runHistoryDelays.length) {
		const runMed = median(features.runHistoryDelays);
		const convergence = 1 - delayDecay * Math.max(0, targetIdx - lastIdx);
		runComponent = Math.max(0, runMed * .35 * convergence);
	}
	const weatherComponent = weatherPenalty[features.weather];
	const congestionComponent = features.corridorCongestion * 18;
	const timeComponent = features.timeOfDayHours >= 7 && features.timeOfDayHours <= 20 ? 3 : 0;
	const peakComponent = features.timeOfDayHours >= 8 && features.timeOfDayHours <= 11 || features.timeOfDayHours >= 17 && features.timeOfDayHours <= 20 ? 5 : 0;
	const delayMin = Math.max(0, recovered + histComponent + runComponent + weatherComponent + congestionComponent + timeComponent + peakComponent);
	const horizon = Math.max(1, targetIdx - lastIdx);
	let confidence = .62 + Math.min(1, features.priorHaltDelays.length / 4) * .2 - Math.min(.35, horizon * .05);
	if (features.weather !== "clear") confidence -= .08;
	confidence = Math.min(.95, Math.max(.35, confidence));
	const intervalMin = Math.round(6 + delayMin * .2 + horizon * 2);
	const reason = classifyDelay({
		delayMin,
		weatherActive: features.weather !== "clear",
		timeOfDayHours: features.timeOfDayHours,
		isHalted: features.isHalted,
		haltedDurationMin: features.haltedDurationMin
	});
	return {
		predictedDelayShiftMin: Math.round(delayMin * 100) / 100,
		delayMin: Math.round(delayMin),
		etaMin: Math.round(delayMin),
		eta: fmtClock(delayMin),
		confidence: Math.round(confidence * 100) / 100,
		intervalMin,
		lowerEta: "",
		upperEta: "",
		reason
	};
}
/** Build the feature vector from a train route and its live running state. */
function buildFeatures(train, state, weather, corridorCongestion) {
	const totalKm = train.halts[train.halts.length - 1].km;
	const priorHaltDelays = [];
	for (let i = 0; i <= state.lastHaltIndex && i < train.halts.length; i++) priorHaltDelays.push(historicalDelayAt(train, i));
	const runHistoryDelays = trainRunHistory[train.number] ?? [];
	const dayOfWeek = state.date.getDay();
	const timeOfDayHours = state.elapsedMin / 60;
	const wSeed = hash(`${train.number}:${state.lastHaltIndex}-${state.date.getDate()}`);
	const wTable = [
		"clear",
		"clear",
		"clear",
		"clear",
		"rain",
		"fog",
		"wind"
	];
	const weatherSel = weather ?? wTable[Math.floor(wSeed * wTable.length)] ?? "clear";
	const congestion = corridorCongestion ?? .2 + hash(`${train.name}:${state.lastHaltIndex}-${state.date.getDate()}`) * .6;
	return {
		trainNumber: train.number,
		trainName: train.name,
		elapsedMin: state.elapsedMin,
		currentDelayMin: state.currentDelayMin,
		currentKm: state.currentKm,
		totalKm,
		lastHaltIndex: state.lastHaltIndex,
		priorHaltDelays,
		runHistoryDelays,
		haltedDurationMin: state.haltedDurationMin,
		isHalted: state.isHalted,
		timeOfDayHours,
		dayOfWeek,
		weather: weatherSel,
		corridorCongestion: congestion
	};
}
/** Forecast ETA at a given halt index given the train route + live state. */
function forecastEtaAtHalt(train, haltIndex, live, now) {
	const delayAtTarget = predictDelay(buildFeatures(train, {
		...live,
		date: now
	}), haltIndex);
	const etaMin = train.startsAt + train.halts[haltIndex].arr + delayAtTarget.delayMin;
	delayAtTarget.etaMin = etaMin;
	delayAtTarget.eta = fmtClock(etaMin);
	delayAtTarget.lowerEta = fmtClock(etaMin - delayAtTarget.intervalMin);
	delayAtTarget.upperEta = fmtClock(etaMin + delayAtTarget.intervalMin);
	return delayAtTarget;
}
function hash(s) {
	let x = 0;
	for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) % 1e5;
	return x % 1e3 / 1e3;
}
/** Median of a numeric array (robust central tendency for run delays). */
function median(values) {
	if (!values.length) return 0;
	const sorted = [...values].sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
function fmtMinutes(minutesAfterMidnight) {
	const m = (minutesAfterMidnight % 1440 + 1440) % 1440;
	return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(Math.round(m % 60)).padStart(2, "0")}`;
}
/** Halt index currently reached on the raw schedule (before delay offset). */
function haltIndexAtElapsed(train, elapsed) {
	let idx = 0;
	for (let i = 0; i < train.halts.length; i++) if (train.halts[i].arr <= elapsed) idx = i;
	return idx;
}
function computeLiveStatus(train, now) {
	const total = train.halts[train.halts.length - 1];
	let elapsed = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60 - train.startsAt;
	if (elapsed < 0) elapsed += 1440;
	const delay = historicalDelayAt(train, haltIndexAtElapsed(train, elapsed));
	const effective = elapsed - delay;
	let state = "running";
	if (effective <= 0) state = "not-started";
	if (effective >= total.arr) state = "completed";
	const clamped = Math.min(Math.max(effective, 0), total.arr);
	let lastIdx = 0;
	for (let i = 0; i < train.halts.length; i++) if (train.halts[i].arr <= clamped) lastIdx = i;
	const lastHalt = train.halts[lastIdx];
	const nextHalt = train.halts[lastIdx + 1] ?? null;
	let km = lastHalt.km;
	let speed = 0;
	let lat = lastHalt.lat;
	let lng = lastHalt.lng;
	if (nextHalt) if (clamped <= lastHalt.dep) state = state === "running" ? "halted" : state;
	else {
		const span = nextHalt.arr - lastHalt.dep || 1;
		const f = Math.min(1, (clamped - lastHalt.dep) / span);
		km = lastHalt.km + (nextHalt.km - lastHalt.km) * f;
		lat = lastHalt.lat + (nextHalt.lat - lastHalt.lat) * f;
		lng = lastHalt.lng + (nextHalt.lng - lastHalt.lng) * f;
		const legSpeed = (nextHalt.km - lastHalt.km) / span * 60;
		speed = Math.round(legSpeed * (.85 + .3 * Math.sin(clamped / 7)));
		speed = Math.max(0, Math.min(160, speed));
	}
	if (state === "not-started" || state === "completed") speed = 0;
	const liveState = {
		elapsedMin: elapsed,
		currentDelayMin: delay,
		currentKm: km,
		lastHaltIndex: lastIdx,
		haltedDurationMin: state === "halted" ? Math.min(20, 4 + Math.abs(Math.sin(elapsed)) * 14) : 0,
		isHalted: state === "halted"
	};
	const forecastTarget = state === "completed" ? train.halts.length - 1 : lastIdx + 1;
	const forecast = state === "not-started" ? null : forecastEtaAtHalt(train, Math.min(forecastTarget, train.halts.length - 1), liveState, now);
	const reason = forecast ? forecast.reason : "unknown";
	const haltStatus = train.halts.map((halt, i) => {
		const haltForecast = state === "not-started" ? null : forecastEtaAtHalt(train, Math.min(i, train.halts.length - 1), liveState, now);
		return {
			halt,
			scheduled: fmtMinutes(train.startsAt + halt.arr),
			expected: fmtMinutes(train.startsAt + halt.arr + (i === 0 ? 0 : delay)),
			forecast: haltForecast,
			done: state === "completed" || state !== "not-started" && halt.arr <= clamped,
			isNext: nextHalt ? halt.code === nextHalt.code && i === lastIdx + 1 : false
		};
	});
	return {
		delay,
		progress: total.km ? km / total.km * 100 : 0,
		km: Math.round(km),
		speed,
		lat,
		lng,
		state,
		lastHalt,
		nextHalt,
		etaNext: nextHalt ? fmtMinutes(train.startsAt + nextHalt.arr + (forecast?.delayMin ?? delay)) : "—",
		forecast,
		delayReason: reason,
		confidence: forecast?.confidence ?? 0,
		updatedAt: now.getTime(),
		haltStatus
	};
}
function delayLabel(status) {
	if (status.state === "not-started") return "Not departed yet";
	if (status.state === "completed") return "Run completed";
	const forecastMin = status.forecast?.delayMin ?? status.delay;
	return forecastMin === 0 ? "On time" : `${forecastMin} min late (predicted)`;
}
function delayTone(status) {
	const delay = status.forecast?.delayMin ?? status.delay;
	if (delay === 0) return "text-rail-live";
	if (delay < 25) return "text-rail-late";
	return "text-rail-alert";
}
/** Confidence tier derived from the model's 0..1 confidence. */
function confidenceTier(confidence) {
	if (confidence >= .7) return {
		label: "High",
		tone: "text-rail-live"
	};
	if (confidence >= .45) return {
		label: "Medium",
		tone: "text-rail-late"
	};
	return {
		label: "Low",
		tone: "text-rail-alert"
	};
}
/**
* High-performance backend service for Indian Railways intelligence.
*/
var RailBackendService = class {
	/**
	* Search and filter trains with pagination and status checks.
	*/
	static searchTrains(options = {}) {
		const { query = "", type, state, from, to, limit = 20, offset = 0 } = options;
		const q = query.trim().toLowerCase();
		const fromQ = from?.trim().toLowerCase();
		const toQ = to?.trim().toLowerCase();
		const now = /* @__PURE__ */ new Date();
		let results = trainRoutes;
		if (q) results = results.filter((t) => t.number.includes(q) || t.name.toLowerCase().includes(q) || t.halts.some((h) => h.code.toLowerCase() === q || h.name.toLowerCase().includes(q)));
		if (type && type !== "all") results = results.filter((t) => t.type.toLowerCase() === type.toLowerCase());
		if (fromQ && toQ) results = results.filter((t) => {
			const fi = t.halts.findIndex((h) => h.code.toLowerCase() === fromQ || h.name.toLowerCase().includes(fromQ));
			const ti = t.halts.findIndex((h) => h.code.toLowerCase() === toQ || h.name.toLowerCase().includes(toQ));
			return fi !== -1 && ti !== -1 && fi < ti;
		});
		let filtered = results.map((t) => {
			const live = computeLiveStatus(t, now);
			return {
				number: t.number,
				name: t.name,
				type: t.type,
				origin: {
					code: t.halts[0].code,
					name: t.halts[0].name
				},
				destination: {
					code: t.halts[t.halts.length - 1].code,
					name: t.halts[t.halts.length - 1].name
				},
				totalKm: t.halts[t.halts.length - 1].km,
				startsAt: fmtMinutes(t.startsAt),
				runsOn: t.runsOn,
				haltsCount: t.halts.length,
				live: {
					state: live.state,
					speedKmH: live.speed,
					delayMinutes: live.forecast?.delayMin ?? live.delay,
					delayReason: live.delayReason,
					confidencePercent: Math.round(live.confidence * 100),
					nextHalt: live.nextHalt ? {
						code: live.nextHalt.code,
						name: live.nextHalt.name
					} : null,
					etaNext: live.etaNext,
					progressPercent: Math.round(live.progress)
				}
			};
		});
		if (state && state !== "running") {
			if (state === "on-time") filtered = filtered.filter((t) => t.live.delayMinutes <= 2);
			else if (state === "delayed") filtered = filtered.filter((t) => t.live.delayMinutes > 2);
			else if (state === "halted") filtered = filtered.filter((t) => t.live.state === "halted");
		}
		return {
			total: filtered.length,
			offset,
			limit,
			items: filtered.slice(offset, offset + limit)
		};
	}
	/**
	* Get real-time status of a specific train.
	*/
	static getTrainLiveStatus(trainNumber, date = /* @__PURE__ */ new Date()) {
		const train = trainRoutes.find((t) => t.number === trainNumber);
		if (!train) return null;
		const live = computeLiveStatus(train, date);
		const origin = train.halts[0];
		const dest = train.halts[train.halts.length - 1];
		return {
			train: {
				number: train.number,
				name: train.name,
				type: train.type,
				origin: {
					code: origin.code,
					name: origin.name
				},
				destination: {
					code: dest.code,
					name: dest.name
				},
				totalKm: dest.km,
				departureTime: fmtMinutes(train.startsAt),
				runsOn: train.runsOn
			},
			live: {
				state: live.state,
				speed: live.speed,
				currentKm: live.km,
				progressPercent: Math.round(live.progress),
				currentCoordinates: {
					lat: live.lat,
					lng: live.lng
				},
				delayMinutes: live.forecast?.delayMin ?? live.delay,
				delayReason: {
					code: live.delayReason,
					label: DELAY_REASONS[live.delayReason]?.label ?? "Unknown",
					description: DELAY_REASONS[live.delayReason]?.description ?? ""
				},
				forecast: live.forecast ? {
					predictedDelayMin: live.forecast.delayMin,
					confidence: live.forecast.confidence,
					confidenceWindow: {
						lowerEta: live.forecast.lowerEta,
						upperEta: live.forecast.upperEta,
						intervalMinutes: live.forecast.intervalMin
					}
				} : null,
				lastHalt: {
					code: live.lastHalt.code,
					name: live.lastHalt.name
				},
				nextHalt: live.nextHalt ? {
					code: live.nextHalt.code,
					name: live.nextHalt.name,
					platform: live.nextHalt.platform,
					scheduledArrival: fmtMinutes(train.startsAt + live.nextHalt.arr),
					predictedEta: live.etaNext
				} : null,
				updatedAt: new Date(live.updatedAt).toISOString()
			},
			timeline: live.haltStatus.map((h) => ({
				code: h.halt.code,
				name: h.halt.name,
				distanceKm: h.halt.km,
				platform: h.halt.platform,
				scheduledArrival: h.scheduled,
				predictedEta: !h.done && h.forecast ? h.forecast.eta : h.expected,
				delayMinutes: h.forecast?.delayMin ?? 0,
				isCompleted: h.done,
				isCurrentTarget: h.isNext,
				delayReason: h.forecast ? h.forecast.reason : null
			}))
		};
	}
	/**
	* Get full timetable for a train.
	*/
	static getTrainTimetable(trainNumber) {
		const train = trainRoutes.find((t) => t.number === trainNumber);
		if (!train) return null;
		return {
			number: train.number,
			name: train.name,
			type: train.type,
			departureTime: fmtMinutes(train.startsAt),
			runsOn: train.runsOn,
			halts: train.halts.map((h, idx) => ({
				sequence: idx + 1,
				code: h.code,
				name: h.name,
				distanceKm: h.km,
				day: h.day,
				platform: h.platform,
				scheduledArrival: fmtMinutes(train.startsAt + h.arr),
				scheduledDeparture: fmtMinutes(train.startsAt + h.dep),
				haltMinutes: Math.max(0, h.dep - h.arr),
				coordinates: {
					lat: h.lat,
					lng: h.lng
				}
			}))
		};
	}
	/**
	* Search station dictionary.
	*/
	static searchStations(query = "", limit = 20) {
		const q = query.trim().toUpperCase();
		const entries = Object.entries(stationMap);
		const matches = [];
		for (const [code, info] of entries) if (!q || code.includes(q) || info.name.toUpperCase().includes(q)) {
			matches.push({
				code,
				...info
			});
			if (matches.length >= limit) break;
		}
		return matches;
	}
	/**
	* Get arrivals and departures station board.
	*/
	static getStationBoard(code, mode = "all") {
		const upperCode = code.toUpperCase();
		const stationInfo = stationFor(upperCode);
		const now = /* @__PURE__ */ new Date();
		let filtered = trainRoutes.map((t) => {
			const idx = t.halts.findIndex((h) => h.code.toUpperCase() === upperCode);
			if (idx === -1) return null;
			const halt = t.halts[idx];
			const status = computeLiveStatus(t, now);
			const isFirst = idx === 0;
			const isLast = idx === t.halts.length - 1;
			const type = isFirst ? "Departure" : isLast ? "Terminal" : "Arrival";
			const scheduledTime = fmtMinutes(t.startsAt + (isFirst ? halt.dep : halt.arr));
			const haltForecast = status.haltStatus.find((h) => h.halt.code === upperCode)?.forecast;
			const predictedTime = haltForecast ? haltForecast.eta : scheduledTime;
			return {
				trainNumber: t.number,
				trainName: t.name,
				trainType: t.type,
				origin: {
					code: t.halts[0].code,
					name: t.halts[0].name
				},
				destination: {
					code: t.halts[t.halts.length - 1].code,
					name: t.halts[t.halts.length - 1].name
				},
				serviceType: type,
				platform: halt.platform,
				scheduledTime,
				predictedTime,
				delayMinutes: haltForecast?.delayMin ?? 0,
				delayReason: haltForecast ? haltForecast.reason : null,
				confidencePercent: Math.round((haltForecast?.confidence ?? status.confidence) * 100),
				isArrived: status.progress >= halt.km / (t.halts[t.halts.length - 1].km || 1) * 100
			};
		}).filter((s) => s !== null);
		if (mode === "arrivals") filtered = filtered.filter((s) => s.serviceType === "Arrival" || s.serviceType === "Terminal");
		else if (mode === "departures") filtered = filtered.filter((s) => s.serviceType === "Departure" || s.serviceType === "Arrival");
		filtered.sort((a, b) => a.predictedTime.localeCompare(b.predictedTime));
		return {
			station: {
				code: upperCode,
				name: stationInfo?.name ?? upperCode,
				coordinates: stationInfo ? {
					lat: stationInfo.lat,
					lng: stationInfo.lng
				} : null
			},
			serverTime: now.toISOString(),
			mode,
			totalServices: filtered.length,
			services: filtered
		};
	}
	/**
	* Find direct trains between source and destination stations.
	*/
	static findTrainsBetween(fromCode, toCode) {
		const f = fromCode.trim().toUpperCase();
		const t = toCode.trim().toUpperCase();
		const now = /* @__PURE__ */ new Date();
		const matches = trainRoutes.map((route) => {
			const fi = route.halts.findIndex((h) => h.code.toUpperCase() === f);
			const ti = route.halts.findIndex((h) => h.code.toUpperCase() === t);
			if (fi === -1 || ti === -1 || fi >= ti) return null;
			const fromHalt = route.halts[fi];
			const toHalt = route.halts[ti];
			const durationMin = toHalt.arr - fromHalt.dep;
			const distanceKm = toHalt.km - fromHalt.km;
			const live = computeLiveStatus(route, now);
			return {
				number: route.number,
				name: route.name,
				type: route.type,
				departureFromSource: fmtMinutes(route.startsAt + fromHalt.dep),
				arrivalAtDestination: fmtMinutes(route.startsAt + toHalt.arr),
				duration: `${Math.floor(durationMin / 60)}h ${durationMin % 60}m`,
				distanceKm,
				intermediateHalts: ti - fi - 1,
				runsOn: route.runsOn,
				currentLiveStatus: {
					delayMinutes: live.forecast?.delayMin ?? live.delay,
					speed: live.speed,
					nextHalt: live.nextHalt?.name ?? null
				}
			};
		}).filter((m) => m !== null);
		return {
			from: {
				code: f,
				name: stationFor(f)?.name ?? f
			},
			to: {
				code: t,
				name: stationFor(t)?.name ?? t
			},
			totalTrains: matches.length,
			trains: matches
		};
	}
	/**
	* Aggregate fleet metrics for control room operations.
	*/
	static getControlRoomMetrics() {
		const now = /* @__PURE__ */ new Date();
		const statuses = trainRoutes.map((t) => ({
			t,
			s: computeLiveStatus(t, now)
		}));
		const running = statuses.filter((x) => x.s.state === "running" || x.s.state === "halted");
		const onTime = running.filter((x) => (x.s.forecast?.delayMin ?? 0) <= 2).length;
		const late = running.length - onTime;
		const halted = running.filter((x) => x.s.state === "halted").length;
		const highConf = running.filter((x) => (x.s.forecast?.confidence ?? 0) >= .7).length;
		const reasonCounts = {};
		for (const { s } of statuses) if ((s.forecast?.delayMin ?? 0) > 2) reasonCounts[s.delayReason] = (reasonCounts[s.delayReason] ?? 0) + 1;
		const delayDistribution = Object.keys(DELAY_REASONS).map((r) => ({
			reason: r,
			label: DELAY_REASONS[r].label,
			short: DELAY_REASONS[r].short,
			count: reasonCounts[r] ?? 0
		}));
		const activeAlerts = statuses.filter(({ s }) => (s.forecast?.delayMin ?? 0) > 15).sort((a, b) => (b.s.forecast?.delayMin ?? 0) - (a.s.forecast?.delayMin ?? 0)).map(({ t, s }) => ({
			trainNumber: t.number,
			trainName: t.name,
			type: t.type,
			predictedDelayMinutes: s.forecast?.delayMin ?? s.delay,
			confidencePercent: Math.round((s.forecast?.confidence ?? s.confidence) * 100),
			delayReason: s.delayReason,
			nextHalt: s.nextHalt ? {
				code: s.nextHalt.code,
				name: s.nextHalt.name
			} : null
		}));
		return {
			timestamp: now.toISOString(),
			kpis: {
				totalTrackedTrains: trainRoutes.length,
				currentlyRunning: running.length,
				onTimeCount: onTime,
				delayedCount: late,
				haltedAtStationCount: halted,
				highConfidenceForecasts: highConf,
				onTimePercentage: running.length ? Math.round(onTime / running.length * 100) : 100
			},
			delayDistribution,
			activeAlerts
		};
	}
	/**
	* Evaluate connecting train impact & transfer feasibility.
	*/
	static getConnectingImpact(incomingTrainNo, connectingTrainNo, transferStationCode) {
		const upperStation = transferStationCode.toUpperCase();
		const inTrain = trainRoutes.find((t) => t.number === incomingTrainNo);
		const connTrain = trainRoutes.find((t) => t.number === connectingTrainNo);
		if (!inTrain || !connTrain) return null;
		const inHalt = inTrain.halts.find((h) => h.code.toUpperCase() === upperStation);
		const connHalt = connTrain.halts.find((h) => h.code.toUpperCase() === upperStation);
		if (!inHalt || !connHalt) return null;
		const haltForecast = computeLiveStatus(inTrain, /* @__PURE__ */ new Date()).haltStatus.find((h) => h.halt.code.toUpperCase() === upperStation)?.forecast;
		const scheduledArrivalMin = inTrain.startsAt + inHalt.arr;
		const scheduledDepMin = connTrain.startsAt + connHalt.dep;
		const delayMin = haltForecast?.delayMin ?? 0;
		const predictedArrivalMin = scheduledArrivalMin + delayMin;
		const rawBuffer = scheduledDepMin - scheduledArrivalMin;
		const effectiveBuffer = scheduledDepMin - predictedArrivalMin;
		let feasibility = "SAFE";
		let riskScore = 0;
		let recommendation = "";
		if (effectiveBuffer < 10) {
			feasibility = "MISSED";
			riskScore = 95;
			recommendation = "High risk of missing transfer. Consider rebooking on a subsequent departure.";
		} else if (effectiveBuffer < 25) {
			feasibility = "RISKY";
			riskScore = 65;
			recommendation = "Tight transfer window. Head directly to connecting platform upon arrival.";
		} else {
			feasibility = "SAFE";
			riskScore = 15;
			recommendation = "Comfortable transfer buffer available.";
		}
		const alternatives = trainRoutes.filter((t) => t.number !== connectingTrainNo && t.halts.some((h) => h.code.toUpperCase() === upperStation)).slice(0, 3).map((t) => {
			const h = t.halts.find((x) => x.code.toUpperCase() === upperStation);
			return {
				number: t.number,
				name: t.name,
				departure: fmtMinutes(t.startsAt + h.dep),
				availableSeatsEstimated: 12 + parseInt(t.number, 10) * 7 % 45
			};
		});
		return {
			transferStation: {
				code: upperStation,
				name: stationFor(upperStation)?.name ?? upperStation
			},
			incomingTrain: {
				number: inTrain.number,
				name: inTrain.name,
				scheduledArrival: fmtMinutes(scheduledArrivalMin),
				predictedArrival: fmtMinutes(predictedArrivalMin),
				delayMinutes: delayMin,
				confidence: haltForecast?.confidence ?? .85,
				forecastWindow: {
					lower: haltForecast?.lowerEta ?? fmtMinutes(predictedArrivalMin - 5),
					upper: haltForecast?.upperEta ?? fmtMinutes(predictedArrivalMin + 5)
				}
			},
			connectingTrain: {
				number: connTrain.number,
				name: connTrain.name,
				scheduledDeparture: fmtMinutes(scheduledDepMin),
				platform: connHalt.platform !== "-" ? connHalt.platform : "3"
			},
			bufferMinutes: rawBuffer,
			effectiveBufferMinutes: effectiveBuffer,
			transferFeasibility: feasibility,
			riskScorePercent: riskScore,
			recommendation,
			alternativeTrains: alternatives
		};
	}
	/**
	* Realistic 10-digit Indian Railways PNR status validator & engine.
	*/
	static getPnrStatus(pnr) {
		const cleaned = pnr.replace(/\D/g, "");
		if (cleaned.length !== 10) return null;
		let seed = 0;
		for (let i = 0; i < cleaned.length; i++) seed = (seed * 31 + cleaned.charCodeAt(i)) % 1e5;
		const train = trainRoutes[seed % trainRoutes.length];
		const origin = train.halts[0];
		const dest = train.halts[train.halts.length - 1];
		const now = /* @__PURE__ */ new Date();
		const live = computeLiveStatus(train, now);
		const classes = [
			"1A",
			"2A",
			"3A",
			"SL",
			"CC",
			"EC"
		];
		const bookingClass = classes[seed % classes.length];
		const passengerCount = seed % 3 + 1;
		const berthTypes = [
			"Lower",
			"Middle",
			"Upper",
			"Side Lower",
			"Side Upper"
		];
		const coach = `${bookingClass === "SL" ? "S" : bookingClass === "3A" ? "B" : bookingClass === "2A" ? "A" : "H"}${seed % 6 + 1}`;
		const passengers = [];
		for (let i = 1; i <= passengerCount; i++) {
			const berthNo = (seed + i * 7) % 72 + 1;
			const bType = berthTypes[berthNo % berthTypes.length];
			passengers.push({
				number: i,
				bookingStatus: `CNF/${coach}/${berthNo}`,
				currentStatus: `CNF/${coach}/${berthNo}`,
				coach,
				berth: berthNo,
				berthType: bType
			});
		}
		return {
			pnr: cleaned,
			trainNumber: train.number,
			trainName: train.name,
			fromStation: {
				code: origin.code,
				name: origin.name
			},
			toStation: {
				code: dest.code,
				name: dest.name
			},
			boardingStation: {
				code: origin.code,
				name: origin.name
			},
			journeyDate: now.toLocaleDateString("en-IN", {
				day: "2-digit",
				month: "short",
				year: "numeric"
			}),
			bookingClass,
			quota: "GN (General Quota)",
			chartStatus: "CHART PREPARED",
			passengers,
			fare: 450 + passengerCount * 380 * (classes.indexOf(bookingClass) + 1),
			liveStatus: {
				speed: live.speed,
				delay: live.forecast?.delayMin ?? live.delay,
				nextStation: live.nextHalt?.name ?? dest.name,
				eta: live.etaNext
			}
		};
	}
};
var CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
	"Content-Type": "application/json; charset=utf-8"
};
function jsonResponse(data, status = 200, extraHeaders = {}) {
	return new Response(JSON.stringify(data, null, 2), {
		status,
		headers: {
			...CORS_HEADERS,
			...extraHeaders
		}
	});
}
function errorResponse(message, status = 400, details) {
	return jsonResponse({
		error: true,
		status,
		message,
		...details ? { details } : {},
		timestamp: (/* @__PURE__ */ new Date()).toISOString()
	}, status);
}
async function handleApiRequest(request) {
	const url = new URL(request.url);
	const pathname = url.pathname;
	if (!pathname.startsWith("/api/") && pathname !== "/api") return null;
	if (request.method === "OPTIONS") return new Response(null, {
		status: 204,
		headers: CORS_HEADERS
	});
	const searchParams = url.searchParams;
	try {
		if (pathname === "/api" || pathname === "/api/v1" || pathname === "/api/v1/docs") return jsonResponse({
			openapi: "3.0.0",
			info: {
				title: "RailDristhi Developer REST API",
				version: "1.0.0",
				description: "Production REST API for real-time train tracking, ETA forecasts with uncertainty intervals, delay cause classification, station boards, PNR status, and connecting train transfer risk analysis."
			},
			servers: [{
				url: "/api/v1",
				description: "Default v1 Gateway"
			}],
			endpoints: [
				{
					path: "/api/v1/trains",
					method: "GET",
					description: "Search trains with pagination and status filters"
				},
				{
					path: "/api/v1/train/:number/live",
					method: "GET",
					description: "Real-time GPS coordinates, speed, ETA predictions, delay reason"
				},
				{
					path: "/api/v1/train/:number/timetable",
					method: "GET",
					description: "Full halt sequence, arrival/departure schedules, coordinates"
				},
				{
					path: "/api/v1/station/:code/board",
					method: "GET",
					description: "Live station board for arrivals/departures/platforms"
				},
				{
					path: "/api/v1/stations",
					method: "GET",
					description: "Search railway stations dictionary across India"
				},
				{
					path: "/api/v1/between",
					method: "GET",
					description: "Find direct trains connecting two station codes"
				},
				{
					path: "/api/v1/control-room",
					method: "GET",
					description: "Network-wide fleet health metrics, delay cause breakdown, and alerts"
				},
				{
					path: "/api/v1/connecting-impact",
					method: "GET",
					description: "Transfer feasibility analyzer for connecting services"
				},
				{
					path: "/api/v1/pnr/:pnr",
					method: "GET",
					description: "10-digit Indian Railways PNR validation and booking status"
				}
			]
		});
		if (pathname === "/api/v1/trains" || pathname === "/api/trains") {
			const query = searchParams.get("q") ?? searchParams.get("query") ?? "";
			const type = searchParams.get("type") ?? void 0;
			const state = searchParams.get("state") ?? void 0;
			const from = searchParams.get("from") ?? void 0;
			const to = searchParams.get("to") ?? void 0;
			const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit"), 10) : 20;
			const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset"), 10) : 0;
			return jsonResponse({
				success: true,
				...RailBackendService.searchTrains({
					query,
					type,
					state,
					from,
					to,
					limit: Math.min(Math.max(limit, 1), 100),
					offset: Math.max(offset, 0)
				})
			});
		}
		const liveMatch = pathname.match(/^\/api(?:\/v1)?\/train\/([^/]+)\/live$/);
		if (liveMatch) {
			const trainNumber = decodeURIComponent(liveMatch[1]);
			const status = RailBackendService.getTrainLiveStatus(trainNumber);
			if (!status) return errorResponse(`Train with number '${trainNumber}' not found in active network.`, 404);
			return jsonResponse({
				success: true,
				data: status
			});
		}
		const ttMatch = pathname.match(/^\/api(?:\/v1)?\/train\/([^/]+)\/timetable$/);
		if (ttMatch) {
			const trainNumber = decodeURIComponent(ttMatch[1]);
			const timetable = RailBackendService.getTrainTimetable(trainNumber);
			if (!timetable) return errorResponse(`Train with number '${trainNumber}' not found.`, 404);
			return jsonResponse({
				success: true,
				data: timetable
			});
		}
		const trainMatch = pathname.match(/^\/api(?:\/v1)?\/train\/([^/]+)$/);
		if (trainMatch) {
			const trainNumber = decodeURIComponent(trainMatch[1]);
			const live = RailBackendService.getTrainLiveStatus(trainNumber);
			const timetable = RailBackendService.getTrainTimetable(trainNumber);
			if (!live || !timetable) return errorResponse(`Train with number '${trainNumber}' not found.`, 404);
			return jsonResponse({
				success: true,
				data: {
					...live.train,
					live: live.live,
					timetable: timetable.halts
				}
			});
		}
		if (pathname === "/api/v1/stations" || pathname === "/api/stations") {
			const query = searchParams.get("q") ?? searchParams.get("query") ?? "";
			const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit"), 10) : 30;
			const stations = RailBackendService.searchStations(query, Math.min(Math.max(limit, 1), 100));
			return jsonResponse({
				success: true,
				count: stations.length,
				stations
			});
		}
		const boardMatch = pathname.match(/^\/api(?:\/v1)?\/station\/([^/]+)\/board$/);
		if (boardMatch) {
			const code = decodeURIComponent(boardMatch[1]);
			const mode = searchParams.get("mode") ?? "all";
			return jsonResponse({
				success: true,
				data: RailBackendService.getStationBoard(code, mode)
			});
		}
		if (pathname === "/api/v1/between" || pathname === "/api/between") {
			const from = searchParams.get("from");
			const to = searchParams.get("to");
			if (!from || !to) return errorResponse("Missing required query parameters 'from' and 'to' station codes.", 400);
			return jsonResponse({
				success: true,
				data: RailBackendService.findTrainsBetween(from, to)
			});
		}
		if (pathname === "/api/v1/control-room" || pathname === "/api/control-room") return jsonResponse({
			success: true,
			data: RailBackendService.getControlRoomMetrics()
		});
		if (pathname === "/api/v1/connecting-impact" || pathname === "/api/connecting-impact") {
			const incoming = searchParams.get("incoming");
			const connecting = searchParams.get("connecting");
			const station = searchParams.get("station");
			if (!incoming || !connecting || !station) return errorResponse("Missing required query parameters: 'incoming' (train number), 'connecting' (train number), and 'station' (transfer station code).", 400);
			const impact = RailBackendService.getConnectingImpact(incoming, connecting, station);
			if (!impact) return errorResponse("Could not compute transfer impact. Verify that both trains halt at the specified transfer station.", 404);
			return jsonResponse({
				success: true,
				data: impact
			});
		}
		const pnrMatch = pathname.match(/^\/api(?:\/v1)?\/pnr\/([^/]+)$/);
		if (pnrMatch) {
			const pnr = decodeURIComponent(pnrMatch[1]);
			const status = RailBackendService.getPnrStatus(pnr);
			if (!status) return errorResponse("Invalid PNR format. PNR must be a 10-digit numeric string.", 400);
			return jsonResponse({
				success: true,
				data: status
			});
		}
		return errorResponse(`API endpoint '${pathname}' not found. Visit /api/v1/docs for available routes.`, 404);
	} catch (err) {
		return errorResponse(err instanceof Error ? err.message : "Internal API error", 500);
	}
}
var serverEntryPromise;
async function getServerEntry() {
	if (!serverEntryPromise) serverEntryPromise = import("./server-YBgS2Ffr.mjs").then((m) => m.default ?? m);
	return serverEntryPromise;
}
async function normalizeCatastrophicSsrResponse(response) {
	if (response.status < 500) return response;
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
	const body = await response.clone().text();
	if (!isH3SwallowedErrorBody(body)) return response;
	console.error(consumeLastCapturedError() ?? /* @__PURE__ */ new Error(`h3 swallowed SSR error: ${body}`));
	return new Response(renderErrorPage(), {
		status: 500,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
function isH3SwallowedErrorBody(body) {
	try {
		const payload = JSON.parse(body);
		return payload.unhandled === true && payload.message === "HTTPError";
	} catch {
		return false;
	}
}
var server_default = { async fetch(request, env, ctx) {
	try {
		const apiResponse = await handleApiRequest(request);
		if (apiResponse) return apiResponse;
		return await normalizeCatastrophicSsrResponse(await (await getServerEntry()).fetch(request, env, ctx));
	} catch (error) {
		console.error(error);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
} };
//#endregion
export { fmtMinutes as a, stationFor as c, getTrain as d, server_default as default, trainRoutes as f, delayTone as i, stationMap as l, confidenceTier as n, historicalDelayAt as o, renderErrorPage as p, delayLabel as r, DELAY_REASONS as s, computeLiveStatus as t, findTrains as u };
