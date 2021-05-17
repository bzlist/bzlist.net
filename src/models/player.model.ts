import {TeamName} from "./server.model";

/** Player information */
export interface IPlayer{
  [index: string]: any;
  /** Team the player is currently on */
  team: TeamName;
  /** Number of wins (points/kills) */
  wins: number;
  /** Number of losses (-points/deaths) */
  losses: number;
  /** Number of team kills */
  tks: number;
  /** Callsign (in-game name) */
  callsign: string;
  /** Motto (in-game text) */
  motto: string;
  /** Unix timestamp of update time */
  timestamp?: number;
  /** Server player belongs to */
  server?: string;
}
