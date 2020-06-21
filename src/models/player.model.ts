import {TeamName} from "./server.model";

export interface Player{
  [index: string]: any;
  callsign: string;
  motto?: string;
  team: TeamName;
  wins?: number;
  losses?: number;
  tks?: number;
  server: string;
  timestamp: number;
}
