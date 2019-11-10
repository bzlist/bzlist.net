import React from "react";

import {cache, socket, verboseGameStyle, history, autoPlural, settings} from "../lib";
import {Server} from "../models";
import {TimeAgo} from "./TimeAgo";

const ServerRow = ({server}: {server: Server}) => (
  <tr onClick={() => history.push(`/s/${server.address}/${server.port}`)} style={{fontWeight:server.playersCount > 0 ? "bold" : "inherit"}}>
    <td>{server.playersCount}</td>
    <td>{server.address}:{server.port}</td>
    <td><img src={`https://countryflags.io/${server.countryCode}/flat/32.png`} alt={server.countryCode} title={server.country}/></td>
    <td title={verboseGameStyle(server.configuration.gameStyle)}>{server.configuration.gameStyle}</td>
    <td>{server.title}</td>
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

    const {sort, sortOrder} = settings.getJson("serverSort", {sort: "playersCount", sortOrder: 1});

    this.state = {
      servers: cache.getJson("servers", []),
      sort,
      sortOrder,
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

  componentWillUnmount(): void{
    socket.off("servers");
  }

  sortBy(sort: string, sortOrder: number): void{
    if(this.state.sort === sort){
      sortOrder = -this.state.sortOrder;
    }

    this.setState({sort, sortOrder});
    settings.set("serverSort", JSON.stringify({sort, sortOrder}));
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
                <table>
                  <tbody>
                    <tr>
                      <td>Players</td>
                      <td><b>{server.playersCount}</b></td>
                    </tr>
                    <tr>
                      <td>Server</td>
                      <td>{server.address}:{server.port}</td>
                    </tr>
                    <tr>
                      <td>Game Style</td>
                      <td>{verboseGameStyle(server.configuration.gameStyle)}</td>
                    </tr>
                    <tr>
                      <td>Country</td>
                      <td><img src={`https://countryflags.io/${server.countryCode}/flat/16.png`} title={server.country} alt=""/> {server.country}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      }else{
        servers = (
          <table className={settings.get("compactTables") === "true" ? "table-compact" : ""}>
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
                <ServerRow key={`${server.address}:${server.port}`} server={server}/>
              )}
            </tbody>
          </table>
        );
      }
    }else{
      servers = (
        <div>Loading...</div>
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
          <div>With offline and mobile support</div>
        </div>
        <div className="container">
          <h2>{this.state.servers.length} Public Servers Online</h2>
          {autoPlural(`${playerCount} player`)} and {autoPlural(`${observerCount} observer`)} online. Updated <TimeAgo timestamp={timestamp}/>.<br/><br/>
          {servers}
          <button className="btn btn-primary" onClick={() => this.showMore()} style={{margin:"22px 32px"}}>{this.state.serversToShow > 0 ? "Show All" : "Show Less"}</button>
          {this.state.serversToShow <= 0 ?
            <button className="btn btn-outline" onClick={() => document.documentElement.scrollTop = 0} style={{margin:"22px 0"}}>Scroll to Top</button>
          : null}
        </div>
      </div>
    );
  }
}
