import React from "react";

import {cache, socket, verboseGameStyle, history, autoPlural, settings, notification, favoriteServer, isFavoriteServer} from "../lib";
import {Server, Team} from "../models";
import {TimeAgo, Icon} from ".";

export class ServerRow extends React.Component<{server: Server}, {favorite: boolean}>{
  constructor(props: any){
    super(props);

    this.state = {
      favorite: false
    };
  }

  shouldComponentUpdate(nextProps: {server: Server}, nextState: {favorite: boolean}): boolean{
    return nextState.favorite !== this.state.favorite || nextProps.server.timestamp !== this.props.server.timestamp;
  }

  onClick(): void{
    history.push(`/s/${this.props.server.address}/${this.props.server.port}`);
  }

  render(): JSX.Element{
    return (
      <tr style={{fontWeight: this.props.server.playersCount > 0 ? "bold" : "inherit"}}>
        <td onClick={() => this.onClick()}>{this.props.server.playersCount}</td>
        <td onClick={() => this.onClick()}>{this.props.server.address}:{this.props.server.port}</td>
        <td onClick={() => this.onClick()}>
          <img src={`https://countryflags.io/${this.props.server.countryCode}/flat/32.png`} alt={this.props.server.countryCode} title={this.props.server.country}/>
        </td>
        <td onClick={() => this.onClick()} title={verboseGameStyle(this.props.server.configuration.gameStyle)}>{this.props.server.configuration.gameStyle}</td>
        <td onClick={() => this.onClick()}>{this.props.server.title}</td>
        <td><button className="btn icon" onClick={() => {
          favoriteServer(this.props.server);
          this.setState({favorite: isFavoriteServer(this.props.server)});
        }}>{Icon("heart", isFavoriteServer(this.props.server), "url(#e)")}</button></td>
        <td><button className="btn icon btn-play" onClick={() => history.push(`/s/${this.props.server.address}/${this.props.server.port}?play`)} title="Play">&#9658;</button></td>
      </tr>
    );
  }
}

interface State{
  servers: Server[];
  sort: string;
  sortOrder: number;
  serversToShow: number;
  showHidden: boolean;
}

export class HomePage extends React.PureComponent<any, State>{
  mobile = false;
  firstData = true;

  constructor(props: any){
    super(props);

    const {sort, sortOrder} = settings.getJson("serverSort", {sort: "playersCount", sortOrder: 1});

    this.state = {
      servers: cache.getJson("servers", []),
      sort,
      sortOrder,
      serversToShow: 10,
      showHidden: false
    };

    socket.on<Server[]>("servers", (data: Server[]) => {
      this.setState({servers: data});
      cache.set("servers", JSON.stringify(data));

      if(!this.firstData && settings.getBool(settings.NOTIFICATIONS) && settings.getJson("favoriteServers", []) !== []){
        data.forEach((server: Server) => {
          if(!settings.getJson("favoriteServers", []).includes(`${server.address}:${server.port}`)){
            return;
          }

          const observerTeam = server.teams.find((team: Team) => team.name === "Observer");
          if(!observerTeam){
            return;
          }

          const playerCount = server.playersCount - observerTeam.players;
          if(playerCount > 1){
            notification(`${server.title} has ${playerCount} players`, "", `${server.address}:${server.port}`, () => {
              history.push(`/s/${server.address}/${server.port}`);
            });
          }
        });
      }

      this.firstData = false;
    });
    socket.emit("servers", {onlinePlayers: settings.getBool(settings.ONLY_SERVERS_WITH_PLAYERS)});

    if(window.innerWidth <= 768){
      this.mobile = true;
    }
  }

  componentWillUnmount(): void{
    socket.off("servers");
  }

  sortBy(sort: string, sortOrder: number): void{
    // invert sort order if sorting by same field
    if(this.state.sort === sort){
      sortOrder = -this.state.sortOrder;
    }

    this.setState({sort, sortOrder});
    settings.set("serverSort", JSON.stringify({sort, sortOrder}));
  }

  getServers(): Server[]{
    let servers: Server[] = JSON.parse(JSON.stringify(this.state.servers));

    if(!this.state.showHidden){
      servers = servers.filter((server) => !settings.getJson("hiddenServers", []).includes(`${server.address}:${server.port}`));
    }

    if(settings.getBool(settings.EXCLUDE_OBSERVERS)){
      servers = servers.map((server: Server) => {
        server.playersCount -= server.teams.filter((team: Team) => team.name === "Observer")[0].players;
        return server;
      });
    }

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
          <table className={settings.getBool(settings.COMPACT_TABLES) ? "table-compact" : ""}>
            <thead>
              <tr>
                <th onClick={() => this.sortBy("playersCount", 1)}>Players</th>
                <th onClick={() => this.sortBy("address", -1)}>Address</th>
                <th onClick={() => this.sortBy("country", -1)}>Country</th>
                <th onClick={() => this.sortBy("configuration.gameStyle", -1)}>Game Style</th>
                <th onClick={() => this.sortBy("title", -1)}>Title</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.getServers().map((server: Server) => <ServerRow key={`${server.address}:${server.port}`} server={server}/>)}
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
          <div className="btn-list">
            {this.state.servers.length > this.state.serversToShow &&
              <button className="btn btn-primary" onClick={() => this.showMore()}>{this.state.serversToShow > 0 ? "Show All" : "Show Less"}</button>
            }
            {settings.getJson("hiddenServers", []).length > 0 &&
              <button className="btn btn-outline" onClick={() => this.setState({showHidden: !this.state.showHidden})}>{this.state.showHidden ? "Hide Hidden" : "Show Hidden"}</button>
            }
            {this.state.serversToShow <= 0 && <button className="btn btn-outline" onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}>Scroll to Top</button>}
          </div>
        </div>
      </div>
    );
  }
}
