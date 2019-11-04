import React from "react";
import "./HomePage.scss";

import * as storage from "../storage";
import {Server} from "../models";
import {socket} from "../socket";
import {TimeAgo} from "./TimeAgo";
import {verboseGameStyle} from "../utils";

const ServerRow = ({server}: {server: Server}) => (
  <tr>
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
}

export class HomePage extends React.Component<any, State>{
  constructor(props: React.Props<any>){
    super(props);

    let serverCache = storage.getItem("serversCache");
    if(serverCache === ""){
      serverCache = "[]";
    }

    this.state = {
      servers: JSON.parse(serverCache),
      sort: "playersCount",
      sortOrder: 1
    };

    socket.on<Server[]>("servers", (data: Server[]) => {
      this.setState({servers: data});
      storage.setItem("serversCache", JSON.stringify(data));
    });
    socket.emit("servers");
  }

  sortBy(sort: string, sortOrder: number){
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

    return servers;
  }

  render(): JSX.Element{
    let table;

    if(this.state.servers.length > 0){
      table = (
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
          <h1 className="headline">Real-time BZFlag server stats</h1>
          <p className="tagline">With offline and mobile support</p>
        </div>
        <div className="container">
          <h1>{this.state.servers.length} Public Servers Online</h1>
          {playerCount} players and {observerCount} observers online. Updated <TimeAgo timestamp={timestamp}/>.<br/><br/>
          {table}
        </div>
      </div>
    );
  }
}
