import {IPlayer} from "./player.model";

export type GameStyle = "FFA" | "CTF" | "OFFA" | "Rabbit";
export type TeamName = "Rogue" | "Red" | "Green" | "Blue" | "Purple" | "Observer" | "Rabbit" | "Hunter";

export interface IServer{
  [index: string]: any;
  /** Server game style */
  style: GameStyle;
  /** Configuration options */
  options: IGameOptions;
  /** Team info */
  teams: ITeam[];
  /** All players */
  players: IPlayer[];
  /** Maximum allowed player score */
  maxPlayerScore: number;
  /** Maximum allowed team score */
  maxTeamScore: number;
  /** Maximum number of players */
  maxPlayers: number;
  /** Number of shots */
  maxShots: number;
  /** Game time limit in deciseconds */
  timeLimit: number;
  /** Game time passed in deciseconds */
  elapsedTime: number;
  /** Automatically drop bad flags */
  shake: false | {
    /** Number of wins (points) required */
    wins: number;
    /** Time required to pass in deciseconds */
    timeout: number;
  };
  /** Unix timestamp of update time */
  timestamp: number;
}

/** Team information */
export interface ITeam{
  /** Which team (color/name) */
  name: TeamName;
  /** Number of players */
  players: number;
  /** Maximum number of players */
  maxPlayers: number;
  /** Number of wins (points) */
  wins?: number;
  /** Number of losses (-points) */
  losses?: number;
}

/** Game configuration options */
export interface IGameOptions{
  /** Flags enabled */
  flags: boolean;
  /** Jumping enabled */
  jumping: boolean;
  /** Inertia enabled */
  inertia: boolean;
  /** Ricochet enabled (shots bounce off walls) */
  ricochet: boolean;
  /** Shaking bad flags enabled */
  shaking: boolean;
  /** Antidote flags enabled */
  antidote: boolean;
  /** Handicap enabled */
  handicap: boolean;
  /** Inability to shoot teammates */
  noTeamKills: boolean;
}
