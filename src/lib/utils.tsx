import React from "react";

import {createBrowserHistory} from "history";
import {settings} from ".";
import {Server, GameStyle} from "../models";

export const API_ROOT = "https://api.bzlist.net";
export const history = createBrowserHistory();

export const verboseGameStyle = (value: GameStyle): string => {
  // turn the short abbreviation string to the verbose version
  switch(value){
    case "CTF":
      return "Capture The Flag";
    case "FFA":
      return "Free For All";
    case "OFFA":
      return "Open (Teamless) Free For All";
    case "Rabbit":
      return "Rabbit Chase";
    default:
      break;
  }

  return value;
};

export const booleanYesNo = (value: boolean): JSX.Element => {
  // convert boolean value to yes/no with proper class
  return value ? <span className="yes">Yes</span> : <span className="no">No</span>;
};

export const autoPlural = (value: string): string => {
  return value.split(" ")[0] === "1" ? value : `${value}s`;
};

export const api = async (endpoint: string, body: any = undefined, method = "POST", headers: any = {}): Promise<any> => {
  return fetch(`${API_ROOT}/${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    method,
    body: body !== undefined ? JSON.stringify(body) : undefined
  }).then((res: Response) => res.json()).catch(console.error);
};

export const notification = (title: string, body: string, tag: string, onclick: (this: Notification, event: Event) => void): void => {
  if(!window.Notification){
    return console.log("Browser does not support notifications");
  }

  if(Notification.permission === "denied"){
    return console.log("User blocked notifications.");
  }

  const notify = () => {
    const _notification = new Notification(title, {
      body,
      tag,
      renotify: true,
      icon: "/images/icon/512.png"
    });
    _notification.onclick = onclick;
  };

  if(Notification.permission === "granted"){
    notify();
  }else{
    Notification.requestPermission().then((result) => {
      if(result === "granted"){
        notify();
      }else{
        console.log("User blocked notifications.");
      }
    });
  }
};

export const favoriteServer = (server: Server | string): void => {
  if(server === undefined || server === null){
    return;
  }

  const address = typeof(server) === "object" ? `${server.address}:${server.port}` : server;
  const favoriteServers = settings.getJson("favoriteServers", []);

  if(favoriteServers.includes(address)){
    favoriteServers.splice(favoriteServers.indexOf(address), 1);
  }else{
    favoriteServers.push(address);
  }

  settings.set("favoriteServers", JSON.stringify(favoriteServers));
};

export const isFavoriteServer = (server: Server | null): boolean => {
  if(!server){
    return false;
  }

  return settings.getJson("favoriteServers", []).includes(`${server.address}:${server.port}`);
};

export const friendPlayer = (callsign: string): void => {
  const friends = settings.getJson("friends", []);

  if(friends.includes(callsign)){
    friends.splice(friends.indexOf(callsign), 1);
  }else{
    friends.push(callsign);
  }

  settings.set("friends", JSON.stringify(friends));
};

export const isPlayerFriend = (callsign: string): boolean => settings.getJson("friends", []).includes(callsign);

export const hideServer = (server: Server | null | string): void => {
  if(server === undefined || server === null){
    return;
  }

  const address = typeof(server) === "object" ? `${server.address}:${server.port}` : server;
  const hiddenServers = settings.getJson("hiddenServers", []);

  if(hiddenServers.includes(address)){
    hiddenServers.splice(hiddenServers.indexOf(address), 1);
  }else{
    hiddenServers.push(address);
  }

  settings.set("hiddenServers", JSON.stringify(hiddenServers));
};

export const isServerHidden = (server: Server | null | string): boolean => {
  if(server === undefined || server === null){
    return false;
  }

  const address = typeof(server) === "object" ? `${server.address}:${server.port}` : server;
  return settings.getJson("hiddenServers", []).includes(address);
};

export const sortBy = (
  sort: string,
  sortOrder: number,
  target: HTMLElement,
  currentSort: string,
  currentSortOrder: number,
  tableHeaders: React.RefObject<HTMLTableRowElement>,
  storageKey: string,
  callback: (sort: string, sortOrder: number) => void
): void => {
  // invert sort order if sorting by same field
  if(currentSort === sort){
    sortOrder = -currentSortOrder;
  }

  // remove all sort direction arrows
  for(const element of tableHeaders.current?.children ?? []){
    if(element.innerHTML.lastIndexOf(" ") === element.innerHTML.length - 2){
      element.innerHTML = element.innerHTML.slice(0, -2);
    }
  }

  if(target){
    target.innerHTML += ` ${sortOrder < 0 ? "&#8593;" : "&#8595;"}`;
  }

  settings.set(storageKey, JSON.stringify({sort, sortOrder}));
  callback(sort, sortOrder);
};

export const newServerToLegacy = (server: any): Server => {
  return {
    address: server.address,
    port: server.port,
    ip: server.ip,
    owner: server.owner,
    country: "",
    countryCode: "",
    timestamp: server.timestamp,
    title: server.title,
    teams: server.teams.map((team: any) => {
      team.score = team.wins - team.losses;
      return team;
    }),
    players: server.players,
    configuration: {
      maxShots: server.maxShots,
      maxPlayers: server.maxPlayers,
      superflags: server.options.flags,
      jumping: server.options.jumping,
      ricochet: server.options.ricochet,
      inertia: server.options.inertia,
      shaking: server.options.shaking,
      noTeamKills: server.options.noTeamKills,
      dropBadFlags: {
        wins: server.options.shake?.wins || 0,
        time: server.options.shake?.timeout || 0
      }
    },
    style: server.style
  } as Server;
};

export const joinGame = (server: Server | string, team: string): void => {
  window.location.href = `bzflag-launcher:${typeof(server) === "object" ? `${server.address}:${server.port}` : server} ${team.toLowerCase()}`;
};
