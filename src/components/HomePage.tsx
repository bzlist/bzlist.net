import React from "react";
import "./HomePage.scss";

import {cache, socket, verboseGameStyle, history, autoPlural} from "../lib";
import {Server} from "../models";
import {TimeAgo} from "./TimeAgo";

const ServerRow = ({server}: {server: Server}) => (
  <tr onClick={() => history.push(`/s/${server.address}/${server.port}`)}>
    <td key={server.playersCount}>{server.playersCount}</td>
    <td key={`${server.address}:${server.port}`}>{server.address}:{server.port}</td>
    <td key={server.country}><img src={`https://countryflags.io/${server.countryCode}/flat/32.png`} alt={server.countryCode} title={server.country}/></td>
    <td key={server.configuration.gameStyle} title={verboseGameStyle(server.configuration.gameStyle)}>{server.configuration.gameStyle}</td>
    <td key={server.title}>{server.title}</td>
  </tr>
);

interface State{
  servers: Server[];
  sort: string;
  sortOrder: number;
  serversToShow: number;
}

export class HomePage extends React.Component<any, State>{
  mobile = false;

  constructor(props: any){
    super(props);

    let serverCache = cache.get("servers");
    if(serverCache === ""){
      serverCache = "[]";
    }

    this.state = {
      servers: JSON.parse(serverCache),
      sort: "playersCount",
      sortOrder: 1,
      serversToShow: 10
    };

    socket.on<Server[]>("servers", (data: Server[]) => {
      this.setState({servers: data});
      cache.set("servers", JSON.stringify(data));
    });
    socket.emit("servers");

    if(window.innerWidth <= 768){
      this.mobile = true;
    }
  }

  sortBy(sort: string, sortOrder: number): void{
    if(this.state.sort === sort){
      this.setState({sortOrder: -this.state.sortOrder});
    }else{
      this.setState({sort, sortOrder});
    }
  }

  getServers(): Server[]{
    const servers = this.state.servers;

    if(this.state.sort.startsWith("configuration.")){
      const sort = this.state.sort.replace("configuration.", "");
      servers.sort((a: Server, b: Server) => a.configuration[sort] > b.configuration[sort] ? -this.state.sortOrder : this.state.sortOrder);
    }else{
      servers.sort((a: Server, b: Server) => a[this.state.sort] > b[this.state.sort] ? -this.state.sortOrder : this.state.sortOrder);
    }

    return servers.slice(0, this.state.serversToShow > 0 ? this.state.serversToShow : this.state.servers.length);
  }

  showMore(): void{
    if(this.state.serversToShow > 0){
      this.setState({serversToShow: 0});
    }else{
      this.setState({serversToShow: 10});
    }
  }

  render(): JSX.Element{
    let servers;

    if(this.state.servers.length > 0){
      if(this.mobile){
        servers = (
          <div className="card-list">
            {this.getServers().map((server: Server) =>
              <div key={`${server.address}:${server.port}`} onClick={() => history.push(`/s/${server.address}/${server.port}`)}>
                <h2>{server.title}</h2><br/>
                <table style={{width:"100%"}}>
                  <tbody>
                    <tr>
                      <td>Server</td>
                      <td>{server.address}:{server.port}</td>
                    </tr>
                    <tr>
                      <td>IP Address</td>
                      <td>{server.ip}</td>
                    </tr>
                    <tr>
                      <td>Game Style</td>
                      <td>{verboseGameStyle(server.configuration.gameStyle)}</td>
                    </tr>
                  </tbody>
                </table>
                <hr/>
                <small>
                  <img src={`https://countryflags.io/${server.countryCode}/flat/16.png`} title={server.country} alt=""/>&nbsp;
                  {server.country} • {server.playersCount} players online
                </small>
              </div>
            )}
          </div>
        );
      }else{
        servers = (
          <table>
            <thead>
              <tr>
                <th onClick={() => this.sortBy("playersCount", 1)}>Players</th>
                <th onClick={() => this.sortBy("address", -1)}>Address</th>
                <th onClick={() => this.sortBy("country", -1)}>Country</th>
                <th onClick={() => this.sortBy("configuration.gameStyle", -1)}>Game Style</th>
                <th onClick={() => this.sortBy("title", -1)}>Title</th>
              </tr>
            </thead>
            <tbody>
              {this.getServers().map((server: Server) =>
                <ServerRow server={server}/>
              )}
            </tbody>
          </table>
        );
      }
    }else{
      servers = (
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
    for(const server of this.state.servers){
      playerCount += server.playersCount;

      const observerTeam = server.teams.find((team) => team.name === "Observer");
      if(observerTeam){
        playerCount -= observerTeam.players;
        observerCount += observerTeam.players;
      }

      if(server.timestamp > timestamp){
        timestamp = server.timestamp;
      }
    }

    return (
      <div>
        <div className="header">
          <h1>Real-time BZFlag server stats</h1>
          <p className="tagline">With offline and mobile support</p>
        </div>
        <div className="container">
          <h2>{this.state.servers.length} Public Servers Online</h2>
          {autoPlural(`${playerCount} player`)} and {autoPlural(`${observerCount} observer`)} online. Updated <TimeAgo timestamp={timestamp}/>.<br/><br/>
          {servers}
          <button className="btn btn-primary" onClick={() => this.showMore()} style={{margin:"22px 32px"}}>{this.state.serversToShow > 0 ? "Show All" : "Show Less"}</button>
        </div>
      </div>
    );
  }
}
