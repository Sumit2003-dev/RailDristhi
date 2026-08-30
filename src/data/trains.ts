export type Halt = {
  code: string;
  name: string;
  lat: number;
  lng: number;
  km: number;
  /** minutes after origin departure */
  arr: number;
  /** minutes after origin departure */
  dep: number;
  platform: string;
  day: number;
};

export type TrainRoute = {
  number: string;
  name: string;
  type: string;
  /** origin departure time, minutes after midnight */
  startsAt: number;
  runsOn: string[];
  halts: Halt[];
};

const h = (
  code: string,
  name: string,
  lat: number,
  lng: number,
  km: number,
  arr: number,
  dep: number,
  platform: string,
): Halt => ({ code, name, lat, lng, km, arr, dep, platform, day: 1 });

export const trainRoutes: TrainRoute[] = [
  {
    number: "22439",
    name: "Vande Bharat Express",
    type: "Vande Bharat",
    startsAt: 6 * 60,
    runsOn: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    halts: [
      h("NDLS", "New Delhi", 28.6427, 77.2196, 0, 0, 0, "1"),
      h("UMB", "Ambala Cantt", 30.3626, 76.8302, 200, 130, 133, "3"),
      h("LDH", "Ludhiana Junction", 30.9126, 75.8573, 313, 205, 208, "2"),
      h("JRC", "Jalandhar Cantt", 31.2946, 75.6, 364, 245, 247, "1"),
      h("PTKC", "Pathankot Cantt", 32.2733, 75.652, 475, 330, 333, "4"),
      h("JAT", "Jammu Tawi", 32.7085, 74.8571, 583, 425, 430, "1"),
      h("SVDK", "Katra", 32.9917, 74.9319, 632, 480, 480, "2"),
    ],
  },
  {
    number: "12951",
    name: "Mumbai Rajdhani",
    type: "Rajdhani",
    startsAt: 17 * 60,
    runsOn: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    halts: [
      h("MMCT", "Mumbai Central", 18.9696, 72.8194, 0, 0, 0, "5"),
      h("BVI", "Borivali", 19.2288, 72.8567, 34, 25, 27, "3"),
      h("ST", "Surat", 21.2049, 72.8397, 263, 165, 168, "2"),
      h("BRC", "Vadodara Junction", 22.3105, 73.1812, 392, 250, 255, "4"),
      h("RTM", "Ratlam Junction", 23.3315, 75.0367, 653, 415, 420, "1"),
      h("KOTA", "Kota Junction", 25.1802, 75.8397, 918, 590, 595, "2"),
      h("NDLS", "New Delhi", 28.6427, 77.2196, 1384, 895, 895, "16"),
    ],
  },
  {
    number: "12259",
    name: "Sealdah Duronto",
    type: "Duronto",
    startsAt: 20 * 60 + 5,
    runsOn: ["Mon", "Wed", "Fri", "Sun"],
    halts: [
      h("SDAH", "Sealdah", 22.5675, 88.3703, 0, 0, 0, "9"),
      h("DHN", "Dhanbad Junction", 23.7957, 86.4304, 259, 195, 198, "2"),
      h("GAYA", "Gaya Junction", 24.7955, 85.0002, 447, 320, 325, "1"),
      h("DDU", "Pt DD Upadhyaya", 25.2833, 83.1167, 660, 460, 470, "3"),
      h("CNB", "Kanpur Central", 26.4499, 80.3319, 1013, 690, 695, "6"),
      h("NDLS", "New Delhi", 28.6427, 77.2196, 1454, 950, 950, "12"),
    ],
  },
  {
    number: "12009",
    name: "Shatabdi Express",
    type: "Shatabdi",
    startsAt: 6 * 60 + 25,
    runsOn: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    halts: [
      h("MMCT", "Mumbai Central", 18.9696, 72.8194, 0, 0, 0, "1"),
      h("BVI", "Borivali", 19.2288, 72.8567, 34, 22, 24, "2"),
      h("ST", "Surat", 21.2049, 72.8397, 263, 155, 158, "3"),
      h("BRC", "Vadodara Junction", 22.3105, 73.1812, 392, 240, 245, "1"),
      h("ADI", "Ahmedabad Junction", 23.0258, 72.6017, 492, 330, 330, "5"),
    ],
  },
  {
    number: "12841",
    name: "Coromandel Express",
    type: "Superfast",
    startsAt: 14 * 60 + 50,
    runsOn: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    halts: [
      h("HWH", "Howrah Junction", 22.5839, 88.3425, 0, 0, 0, "13"),
      h("KGP", "Kharagpur Junction", 22.3392, 87.3245, 116, 95, 100, "2"),
      h("BBS", "Bhubaneswar", 20.2696, 85.8419, 437, 320, 325, "1"),
      h("VSKP", "Visakhapatnam", 17.7215, 83.3018, 878, 650, 665, "5"),
      h("BZA", "Vijayawada Junction", 16.5175, 80.622, 1228, 890, 900, "8"),
      h("MAS", "Chennai Central", 13.0827, 80.2757, 1660, 1195, 1195, "7"),
    ],
  },
  {
    number: "12627",
    name: "Karnataka Express",
    type: "Superfast",
    startsAt: 19 * 60 + 15,
    runsOn: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    halts: [
      h("SBC", "KSR Bengaluru", 12.9784, 77.5713, 0, 0, 0, "8"),
      h("SC", "Secunderabad", 17.4344, 78.5013, 610, 480, 490, "1"),
      h("NGP", "Nagpur Junction", 21.1533, 79.0882, 1189, 900, 910, "3"),
      h("BPL", "Bhopal Junction", 23.2683, 77.4014, 1580, 1180, 1185, "4"),
      h("JHS", "Jhansi Junction", 25.4486, 78.5685, 1871, 1390, 1398, "2"),
      h("AGC", "Agra Cantt", 27.1578, 78.0006, 2086, 1545, 1550, "1"),
      h("NDLS", "New Delhi", 28.6427, 77.2196, 2280, 1705, 1705, "9"),
    ],
  },
];

export function findTrains(query: string): TrainRoute[] {
  const q = query.trim().toLowerCase();
  if (!q) return trainRoutes;
  return trainRoutes.filter(
    (t) =>
      t.number.includes(q) ||
      t.name.toLowerCase().includes(q) ||
      t.halts.some((s) => s.code.toLowerCase() === q || s.name.toLowerCase().includes(q)),
  );
}

export function getTrain(number: string) {
  return trainRoutes.find((t) => t.number === number);
}
