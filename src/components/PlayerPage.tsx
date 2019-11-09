import React from "react";

import {Player} from "../models";
import {cache, socket, autoPlural, settings} from "../lib";
import {TimeAgo} from "./TimeAgo";
import {Link} from "react-router-dom";

export const PlayerRow = ({player, showServer = true}: {player: Player, showServer: boolean}) => {
  let serverTr;
  if(player.server && showServer){
    const serverLink = `/s/${player.server.split(":")[0]}/${player.server.split(":")[1]}`;
    serverTr = <td><Link to={serverLink}>{player.server}</Link></td>;
  }
  return (
    <tr>
      <td>{player.callsign} {player.motto ? <i>({player.motto})</i> : ""}</td>
      <td>{player.wins - player.losses}</td>
      <td>{player.team}</td>
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
  mobile = false;

  constructor(props: any){
    super(props);

    const {sort, sortOrder} = settings.getJson("playerSort", {sort: "score", sortOrder: 1});

    this.state = {
      players: cache.getJson("players", []),
      sort,
      sortOrder
    };

    socket.on<Player[]>("players", (data: Player[]) => {
      this.setState({players: data});
      cache.set("players", JSON.stringify(data));
    });
    socket.emit("players");

    if(window.innerWidth <= 768){
      this.mobile = true;
    }
  }

  componentWillUnmount(): void{
    socket.off("players");
  }

  sortBy(sort: string, sortOrder: number){
    if(this.state.sort === sort){
      sortOrder = -this.state.sortOrder;
    }

    this.setState({sort, sortOrder});
    settings.set("playerSort", JSON.stringify({sort, sortOrder}));
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
      if(this.mobile){
        table = (
          <div className="card-list">
            {this.getPlayers().map((player: Player) =>
              <div key={`${player.callsign}:${player.server}`}>
                <h2>{player.callsign}</h2><br/>
                <table style={{width:"100%"}} className={settings.get("compactTables") === "true" ? "table-compact" : ""}>
                  <tbody>
                    <tr>
                      <td>Score</td>
                      <td>{player.wins - player.losses}</td>
                    </tr>
                    <tr>
                      <td>Team</td>
                      <td>{player.team}</td>
                    </tr>
                    <tr>
                      <td>Server</td>
                      <td>{player.server}</td>
                    </tr>
                    {player.motto ?
                      <tr>
                        <td>Motto</td>
                        <td>{player.motto}</td>
                      </tr>
                    : null}
                  </tbody>
                </table>
                {/* <hr/>
                <small>
                  <img src={`https://countryflags.io/${server.countryCode}/flat/16.png`} title={server.country} alt=""/>&nbsp;
                  {server.country} • {server.playersCount} players online
                </small> */}
              </div>
            )}
          </div>
        );
      }else{
        table = (
          <table className={settings.get("compactTables") === "true" ? "table-compact" : ""}>
            <thead>
              <tr>
                <th onClick={() => this.sortBy("callsign", -1)}>Callsign</th>
                <th onClick={() => this.sortBy("score", 1)}>Score</th>
                <th onClick={() => this.sortBy("team", -1)}>Team</th>
                <th onClick={() => this.sortBy("server", -1)}>Server</th>
              </tr>
            </thead>
            <tbody>
              {this.getPlayers().map((player: Player) => <PlayerRow key={`${player.callsign}:${player.server}`} player={player} showServer={true}/>)}
            </tbody>
          </table>
        );
      }
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
          <div>With offline and mobile support</div>
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
