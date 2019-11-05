import React from "react";

import {Player} from "../models";
import {cache, socket, autoPlural} from "../lib";
import {TimeAgo} from "./TimeAgo";

export const PlayerRow = ({player, showServer = true}: {player: Player, showServer: boolean}) => {
  let serverTr;
  if(player.server && showServer){
    serverTr = <td key={player.server}>{player.server}</td>;
  }
  return (
    <tr>
      <td key={player.callsign}>{player.callsign} {player.motto ? (<i>({player.motto})</i>) : ""}</td>
      <td key={player.wins - player.losses}>{player.wins - player.losses}</td>
      <td key={player.team}>{player.team}</td>
      {serverTr}
    </tr>
  );
};

interface State{
  players: Player[];
  sort: string;
  sortOrder: number;
}

export class PlayerPage extends React.Component<any, State>{
  constructor(props: any){
    super(props);

    let playerCache = cache.get("players");
    if(playerCache === ""){
      playerCache = "[]";
    }

    this.state = {
      players: JSON.parse(playerCache),
      sort: "score",
      sortOrder: 1
    };

    socket.on<Player[]>("players", (data: Player[]) => {
      this.setState({players: data});
      cache.set("players", JSON.stringify(data));
    });
    socket.emit("players");
  }

  sortBy(sort: string, sortOrder: number){
    if(this.state.sort === sort){
      this.setState({sortOrder: -this.state.sortOrder});
    }else{
      this.setState({sort, sortOrder});
    }
  }

  getPlayers(): Player[]{
    return this.state.players.map((player: Player) => {
      player.score = player.wins - player.losses;
      return player;
    }).sort((a: Player, b: Player) => a[this.state.sort] > b[this.state.sort] ? -this.state.sortOrder : this.state.sortOrder);
  }

  render(): JSX.Element{
    let table;

    if(this.state.players.length > 0){
      table = (
        <table>
          <thead>
            <tr>
              <th onClick={() => this.sortBy("callsign", -1)}>Callsign</th>
              <th onClick={() => this.sortBy("score", 1)}>Score</th>
              <th onClick={() => this.sortBy("team", -1)}>Team</th>
              <th onClick={() => this.sortBy("server", -1)}>Server</th>
            </tr>
          </thead>
          <tbody>
            {this.getPlayers().map((player: Player) => <PlayerRow player={player} showServer={true}/>)}
          </tbody>
        </table>
      );
    }else{
      table = (
        <ul className="list-shimmer">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      );
    }

    // calculate number of players and observers and get timestamp
    let playerCount = 0;
    let observerCount = 0;
    let timestamp = -1;
    for(const player of this.state.players){
      player.team === "Observer" ? observerCount++ : playerCount++;

      if(player.timestamp > timestamp){
        timestamp = player.timestamp;
      }
    }

    return (
      <div>
        <div className="header">
          <h1>Real-time BZFlag server stats - but the players</h1>
          <p className="tagline">With offline and mobile support</p>
        </div>
        <div className="container">
          <h2>{autoPlural(`${playerCount} Player`)} and {autoPlural(`${observerCount} Observer`)} Online</h2>
          Updated <TimeAgo timestamp={timestamp}/>.<br/><br/>
          {table}
        </div>
      </div>
    );
  }
}
