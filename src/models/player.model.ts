export interface Player{
  [index: string]: any;
  callsign: string;
  motto?: string;
  server: string;
  timestamp: number;
  team: string;
  // wins: number;
  // losses: number;
  // tks: number;
  score: number;
}
