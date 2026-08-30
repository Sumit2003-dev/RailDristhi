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
