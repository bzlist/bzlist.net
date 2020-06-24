import {Player} from "./player.model";

export type GameStyle = "FFA" | "CTF" | "OFFA" | "Rabbit";
export type TeamName = "Rogue" | "Red" | "Green" | "Blue" | "Purple" | "Observer" | "Rabbit" | "Hunter";

export interface Team{
  name: TeamName;
  // players: number;
  maxPlayers: number;
  wins?: number;
  losses?: number;
}

interface Configuration{
  [index: string]: any;
  // gameStyle: string;
  // timeLimit: number;
  maxShots: number;
  maxPlayers: number;
  // maxPlayerScore: number;
  // maxTeamScore: number;
  superflags: boolean;
  jumping: boolean;
  ricochet: boolean;
  inertia: boolean;
  shaking: boolean;
  // antidoteFlags: boolean;
  // handicap: boolean;
  noTeamKills: boolean;
  dropBadFlags: {
    wins: number;
    time: number;
  };
}

export interface Server{
  [index: string]: any;
  address: string;
  port: number;
  ip: string;
  owner: string;
  // protocol: string;
  country: string;
  countryCode: string;
  timestamp: number;
  title: string;
  // online: boolean;
  teams: Array<Team>;
  players: Array<Player>;
  // playersCount: number;
  configuration: Configuration;
  style: GameStyle;
}
