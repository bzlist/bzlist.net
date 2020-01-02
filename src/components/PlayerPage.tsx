import React from "react";
import {Link} from "react-router-dom";

import {cache, socket, autoPlural, settings, history, notification} from "../lib";
import {Player} from "../models";
import {TimeAgo} from ".";
import {Icon} from "./Icon";

const addFriend = (callsign: string): void => {
  const friends = settings.getJson("friends", []);

  if(friends.includes(callsign)){
    friends.splice(friends.indexOf(callsign), 1);
  }else{
    friends.splice(friends.indexOf(callsign), 0, callsign);
  }

  settings.set("friends", JSON.stringify(friends));
};

export class PlayerRow extends React.Component<{player: Player | null, showServer: boolean}, {friend: boolean}>{
  constructor(props: any){
    super(props);

    this.state = {
      friend: false
    };
  }

  // does not have return type JSX.Element to prevent "return null" from throwing an error
  render(){
    if(!this.props.player){
      return null;
    }

    const player = this.props.player;
    const isFriend = settings.getJson("friends", []).includes(player.callsign);
    const serverTr = player.server && this.props.showServer && <td><Link to={`/s/${player.server.split(":")[0]}/${player.server.split(":")[1]}`}>{player.server}</Link></td>;
    const friendIcon = Icon("friend", isFriend, "url(#e)");

    return (
      <tr>
        <td><b>{player.callsign}</b> {player.motto && `(${player.motto})`}</td>
        <td>{player.team !== "Observer" && player.score}</td>
        <td>{player.team}</td>
        {serverTr}
        <td><button className="btn icon" onClick={() => {
          addFriend(player.callsign);
          this.setState({friend: settings.getJson("friends", []).includes(player.callsign)});
        }} title={isFriend ? "Remove friend" : "Add as friend"}>{friendIcon}</button></td>
      </tr>
    );
  }
}

interface State{
  players: Player[];
  sort: string;
  sortOrder: number;
  showObservers: boolean;
}

export class PlayerPage extends React.Component<any, State>{
  mobile = false;
  firstData = true;

  constructor(props: any){
    super(props);

    const {sort, sortOrder} = settings.getJson("playerSort", {sort: "score", sortOrder: 1});

    this.state = {
      players: cache.getJson("players", []),
      sort,
      sortOrder,
      showObservers: false
    };

    socket.on<Player[]>("players", (data: Player[]) => {
      this.setState({players: data});
      cache.set("players", JSON.stringify(data));

      // send notification(s) if any friends are online
      if(!this.firstData && settings.getBool(settings.NOTIFICATIONS) && settings.getJson("friends", []) !== []){
        data.forEach((player: Player) => {
          if(!settings.getJson("friends", []).includes(player.callsign)){
            return;
          }

          notification(`${player.callsign} is online`, "", player.callsign, () => {
            history.push(`/s/${player.server.replace(":", "/")}`);
          });
        });
      }

      this.firstData = false;
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
    const players = this.state.players.sort((a: Player, b: Player) =>
      a.team === "Observer" ? 1 : b.team === "Observer" ? -1 : a[this.state.sort] > b[this.state.sort] ? -this.state.sortOrder : this.state.sortOrder
    );

    if(!this.state.showObservers){
      return players.filter((player: Player) => player.team !== "Observer");
    }

    return players;
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
                <table className={settings.getBool(settings.COMPACT_TABLES) ? "table-compact" : ""}>
                  <tbody>
                    {player.team !== "Observer" &&
                      <tr>
                        <td>Score</td>
                        <td>{player.score}</td>
                      </tr>
                    }
                    <tr>
                      <td>Team</td>
                      <td>{player.team}</td>
                    </tr>
                    <tr>
                      <td>Server</td>
                      <td><Link to={`/s/${player.server.split(":")[0]}/${player.server.split(":")[1]}`}>{player.server}</Link></td>
                    </tr>
                    {player.motto &&
                      <tr>
                        <td>Motto</td>
                        <td>{player.motto}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      }else{
        table = (
          <table className={settings.getBool(settings.COMPACT_TABLES) ? "table-compact" : ""}>
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
        <div>Loading...</div>
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
          <h1>Real-time BZFlag player stats</h1>
          <div>With offline and mobile support</div>
        </div>
        <div className="container">
          <h2>{autoPlural(`${playerCount} Player`)} and {autoPlural(`${observerCount} Observer`)} Online</h2>
          Updated <TimeAgo timestamp={timestamp}/>.<br/><br/>
          {table}
          <div className="btn-list">
            <button className="btn btn-primary" onClick={() => this.setState({showObservers: !this.state.showObservers})}>{!this.state.showObservers ? "Show Observers" : "Hide Observers"}</button>
            <button className="btn btn-outline" onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}>Scroll to Top</button>
          </div>
        </div>
      </div>
    );
  }
}
