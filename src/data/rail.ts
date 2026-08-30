export type Train = {
  number: string;
  name: string;
  from: string;
  to: string;
  speed: number;
  delay: number;
  nextStation: string;
  eta: string;
  progress: number;
  type: string;
};

export const liveTrains: Train[] = [
  {
    number: "22439",
    name: "Vande Bharat Express",
    from: "NDLS",
    to: "SVDK",
    speed: 128,
    delay: 0,
    nextStation: "Ambala Cantt (UMB)",
    eta: "14:22",
    progress: 42,
    type: "Vande Bharat",
  },
  {
    number: "12951",
    name: "Mumbai Rajdhani",
    from: "MMCT",
    to: "NDLS",
    speed: 96,
    delay: 18,
    nextStation: "Kota Junction (KOTA)",
    eta: "21:05",
    progress: 61,
    type: "Rajdhani",
  },
  {
    number: "12259",
    name: "Sealdah Duronto",
    from: "SDAH",
    to: "NDLS",
    speed: 0,
    delay: 47,
    nextStation: "Kanpur Central (CNB)",
    eta: "05:48",
    progress: 74,
    type: "Duronto",
  },
  {
    number: "12009",
    name: "Shatabdi Express",
    from: "MMCT",
    to: "ADI",
    speed: 110,
    delay: 4,
    nextStation: "Surat (ST)",
    eta: "09:31",
    progress: 28,
    type: "Shatabdi",
  },
];

export const quickServices = [
  {
    title: "Station Board",
    description: "Live arrivals, departures and platform assignments",
    icon: "board",
  },
  {
    title: "Connecting Impact",
    description: "How a delayed arrival affects seat status on connecting services",
    icon: "seat",
  },
] as const;

export const features = [
  {
    title: "Live GPS + ETA forecast",
    body: "Follow every running train on a moving map with live speed and a model-predicted arrival time, not just a raw position.",
  },
  {
    title: "Model-driven predictions",
    body: "Every ETA carries a confidence score and a window, so staff can plan around real forecast uncertainty.",
  },
  {
    title: "Delay cause detection",
    body: "Each late train is tagged with a classified cause — weather, congestion, track work, signal or technical.",
  },
  {
    title: "Control-room dashboard",
    body: "A network-wide view of running trains, active delay alerts and the cause breakdown for operations staff.",
  },
  {
    title: "Trains between stations",
    body: "Every service linking two stations, with route-scoped halts and running days.",
  },
  {
    title: "Developer REST API",
    body: "Predicted ETA, delay causes, confidence intervals and GeoJSON route geometry behind a single documented endpoint.",
  },
];

export const networks = [
  { name: "Vande Bharat", active: 124 },
  { name: "Rajdhani", active: 70 },
  { name: "Shatabdi", active: 44 },
  { name: "Jan Shatabdi", active: 56 },
  { name: "Duronto", active: 48 },
  { name: "Garib Rath", active: 52 },
];

export const locals = [
  { city: "Mumbai", active: 3141 },
  { city: "Kolkata", active: 1520 },
  { city: "Chennai", active: 819 },
  { city: "Hyderabad", active: 88 },
];

export const stations = [
  ["New Delhi", "NDLS"],
  ["Howrah Junction", "HWH"],
  ["Mumbai Central", "MMCT"],
  ["Mumbai CSMT", "CSMT"],
  ["KSR Bengaluru", "SBC"],
  ["Chennai Central", "MAS"],
  ["Patna Junction", "PNBE"],
  ["Pune Junction", "PUNE"],
  ["Secunderabad", "SC"],
  ["Ahmedabad", "ADI"],
  ["Jaipur Junction", "JP"],
  ["Lucknow Charbagh", "LKO"],
  ["Bhopal Junction", "BPL"],
  ["Kanpur Central", "CNB"],
  ["Nagpur Junction", "NGP"],
  ["Prayagraj Junction", "PRYJ"],
];

export const faqs = [
  {
    q: "How do I see where my train is right now?",
    a: "Type the five digit train number or its name into the live status box. The map centres on the train and shows current speed, running delay and the next scheduled halt with its platform.",
  },
  {
    q: "How are arrival times predicted?",
    a: "The ETA model combines the current delay, historical drift at earlier halts, weather, corridor congestion and time of day. Every prediction carries a confidence score and an expected window instead of a single optimistic number.",
  },
  {
    q: "Why are some trains showing a delay cause?",
    a: "When a train is running late, the model classifies the most likely cause — weather, track congestion, planned track work, a signal failure or a technical issue — so staff can respond to the right problem.",
  },
  {
    q: "How does a delay affect my connecting train?",
    a: "The connecting-impact view shows whether your onward service is at risk and how crowded or available a later connection is likely to be, based on the predicted arrival of your incoming train.",
  },
  {
    q: "Can I use the data in my own product?",
    a: "Yes. The REST API exposes predicted ETA, delay causes, confidence intervals, live positions, timetables and route geometry, with a free sandbox tier for evaluation.",
  },
];
