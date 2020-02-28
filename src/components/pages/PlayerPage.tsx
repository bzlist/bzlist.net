import React from "react";

import {cache, socket, autoPlural, settings, history, notification, api} from "lib";
import {Player} from "models";
import {TimeAgo, Search, PlayerRow, PlayerCard} from "components";

const SORT_INDEXES = ["callsign", "score", "team", "server"];

interface State{
  players: Player[];
  sort: string;
  sortOrder: number;
  showObservers: boolean;
  searchQuery: string;
}

export class PlayerPage extends React.PureComponent<any, State>{
  mobile = false;
  firstData = true;

  constructor(props: any){
    super(props);

    this.state = {
      players: cache.getJson("players", []),
      sort: "",
      sortOrder: 0,
      showObservers: false,
      searchQuery: ""
    };

    if(window.innerWidth <= 768){
      this.mobile = true;
    }

    this.handleData = this.handleData.bind(this);

    if(settings.getBool(settings.DISABLE_REALTIME_DATA)){
      api("players", undefined, "GET").then(this.handleData);
      return;
    }

    socket.on<Player[]>("players", this.handleData);
    socket.emit("players");
  }

  componentDidMount(): void{
    const {sort, sortOrder} = settings.getJson("playerSort", {sort: "score", sortOrder: 1});
    this.sortBy(sort, sortOrder, document.querySelectorAll("th")[SORT_INDEXES.indexOf(sort)] as HTMLElement);
  }

  componentWillUnmount(): void{
    socket.off("players");
  }

  handleData(data: Player[]): void{
    this.setState({players: data});
    cache.set("players", JSON.stringify(data));

    // send notification(s) if any friends are online
    if(!this.firstData && settings.getBool(settings.NOTIFICATIONS) && settings.getBool(settings.PLAYER_NOTIFICATIONS) && settings.getJson("friends", []) !== []){
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
  }

  sortBy(sort: string, sortOrder: number, target: HTMLElement){
    // invert sort order if sorting by same field
    if(this.state.sort === sort){
      sortOrder = -this.state.sortOrder;
    }

    for(const element of document.querySelectorAll("th")){
      if(element.innerHTML.indexOf(" ") === element.innerHTML.length - 2){
        element.innerHTML = element.innerHTML.slice(0, -2);
      }
    }
    target.innerHTML += ` ${sortOrder < 0 ? "&#8593;" : "&#8595;"}`;

    this.setState({sort, sortOrder});
    settings.set("playerSort", JSON.stringify({sort, sortOrder}));
  }

  getPlayers(): Player[]{
    let players: Player[] = JSON.parse(JSON.stringify(this.state.players));

    if(this.state.searchQuery !== ""){
      players = players.filter((player) => player.callsign.toLowerCase().includes(this.state.searchQuery));
    }else if(!this.state.showObservers){
      players = players.filter((player: Player) => player.team !== "Observer");
    }

    players = players.sort((a: Player, b: Player) =>
      a.team === "Observer" ? 1 : b.team === "Observer" ? -1 : a[this.state.sort] > b[this.state.sort] ? -this.state.sortOrder : this.state.sortOrder
    );

    return players;
  }

  render(): JSX.Element{
    let table;

    if(this.state.players.length > 0){
      if(this.mobile){
        table = (
          <div className="card-list">
            {this.getPlayers().map((player: Player) => <PlayerCard key={`${player.callsign}:${player.server}`} player={player}/>)}
          </div>
        );
      }else{
        table = (
          <table className={settings.getBool(settings.COMPACT_TABLES) ? "table-compact" : ""}>
            <thead>
              <tr>
                <th onClick={(e) => this.sortBy("callsign", -1, e.currentTarget)}>Callsign</th>
                <th onClick={(e) => this.sortBy("score", 1, e.currentTarget)}>Score</th>
                <th onClick={(e) => this.sortBy("team", -1, e.currentTarget)}>Team</th>
                <th onClick={(e) => this.sortBy("server", -1, e.currentTarget)}>Server</th>
                <th></th>
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
          <div>With offline and mobile support</div><br/>
          <Search placeholder="Search by callsign" onValueChange={(value: string) => this.setState({searchQuery: value.toLowerCase()})}/>
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
