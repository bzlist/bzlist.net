import React from "react";

import {cache, socket, history, autoPlural, settings, notification, api, sortBy, favoriteServer, isServerHidden} from "lib";
import {Server, Team, Player} from "models";
import {TimeAgo, Search, ServerRow, ServerCard, PlayerRow, playerSort, List} from "components";
import {imageExt} from "index";

const SORT_INDEXES = ["playersCount", "address", "country", "style", "title"];

interface State{
  servers: Server[];
  sort: string;
  sortOrder: number;
  serversToShow: number;
  showHidden: boolean;
  searchQuery: string;
  infoServer: Server | null;
}

export class HomePage extends React.PureComponent<any, State>{
  mobile = window.innerWidth <= 768;
  firstData = true;
  tableHeaders = React.createRef<HTMLTableRowElement>();
  infoPopoutRef = React.createRef<HTMLDivElement>();

  constructor(props: any){
    super(props);

    const playerCache = cache.getJson("players", []);

    this.state = {
      servers: cache.getJson("servers", []).map((server: Server) => {
        server.players = playerCache.filter((player: Player) => player.server === `${server.address}:${server.port}`);
        return server;
      }),
      sort: "",
      sortOrder: 0,
      serversToShow: 10,
      showHidden: false,
      searchQuery: "",
      infoServer: null
    };

    if(settings.getBool(settings.INFO_CARDS)){
      window.onmousemove = (e: MouseEvent) => {
        if(this.state.infoServer && !(e.target as HTMLElement).parentElement?.getAttribute("data-server")){
          this.setState({infoServer: null});
        }
      };
    }

    this.handleData = this.handleData.bind(this);

    if(settings.getBool(settings.DISABLE_REALTIME_DATA)){
      api("servers", undefined, "GET").then(this.handleData);
      return;
    }

    socket.on<Server[]>("servers", this.handleData);
    socket.emit("servers", {onlinePlayers: settings.getBool(settings.ONLY_SERVERS_WITH_PLAYERS)});
  }

  componentDidMount(): void{
    if(!settings.getBool(settings.DATA_SAVER)){
      new Image().src = "/images/servers/default.png";
    }

    const {sort, sortOrder} = settings.getJson("serverSort", {sort: "playersCount", sortOrder: 1});
    this.sortBy(sort, sortOrder, this.tableHeaders.current?.children[SORT_INDEXES.indexOf(sort)] as HTMLElement);

    window.onresize = (): void => {
      if(this.mobile !== (window.innerWidth <= 768)){
        this.mobile = window.innerWidth <= 768;
        this.forceUpdate();
      }
    };
  }

  componentWillUnmount(): void{
    socket.off("servers");
  }

  handleData(data: Server[]): void{
    this.setState({servers: data});
    cache.set("servers", JSON.stringify(data));
    cache.set("players", JSON.stringify(([] as Player[]).concat.apply([], data.map((server: Server) => (server.players || []).map((player: Player) => {
      player.server = `${server.address}:${server.port}`;
      player.timestamp = server.timestamp;
      return player;
    })))));

    data.forEach((server: Server) => {
      const observerTeam = server.teams.find((team: Team) => team.name === "Observer");
      if(!observerTeam){
        return;
      }

      const playerCount = server.players.length - observerTeam.players;
      if(playerCount >= 1){
        if(!settings.getBool(settings.DATA_SAVER)){
          new Image().src = `/images/servers/${server.address}_${server.port}.${imageExt}`;
        }

        if(!this.firstData &&
          playerCount >= 2 &&
          settings.getBool(settings.NOTIFICATIONS) &&
          settings.getBool(settings.SERVER_NOTIFICATIONS) &&
          favoriteServer(server.address))
        {
          notification(`${server.title} has ${playerCount} players`, "", `${server.address}:${server.port}`, () => {
            history.push(`/s/${server.address}/${server.port}`);
          });
        }
      }
    });

    this.firstData = false;
  }

  sortBy(sort: string, sortOrder: number, target: HTMLElement): void{
    sortBy(sort, sortOrder, target, this.state.sort, this.state.sortOrder, this.tableHeaders, "serverSort", (_sort: string, _sortOrder: number) =>
      this.setState({sort: _sort, sortOrder: _sortOrder})
    );
  }

  getServers(): Server[]{
    let servers: Server[] = JSON.parse(JSON.stringify(this.state.servers));

    if(!this.state.showHidden && this.state.searchQuery === ""){
      servers = servers.filter((server) => !isServerHidden(server));
    }

    if(this.state.searchQuery !== ""){
      servers = servers.filter((server) => server.title.toLowerCase().includes(this.state.searchQuery) || `${server.address.toLowerCase()}:${server.port}`.includes(this.state.searchQuery));
    }

    if(settings.getBool(settings.EXCLUDE_OBSERVERS)){
      servers = servers.map((server: Server) => {
        server.players.length -= server.teams.filter((team: Team) => team.name === "Observer")[0].players;
        return server;
      });
    }else if(settings.getBool(settings.IGNORE_OBSERVER_BOTS)){
      servers = servers.map((server: Server) => {
        server.players.length -= (server.players || []).filter((player: Player) => player.team === "Observer" && ["admin", "r3"].includes(player.callsign)).length;
        return server;
      });
    }

    servers.sort((a: Server, b: Server) => `${a.address}:${a.port}` > `${b.address}:${b.port}` ? 1 : -1);
    if(this.state.sort.startsWith("configuration.")){
      const sort = this.state.sort.replace("configuration.", "");
      servers.sort((a: Server, b: Server) => a.configuration[sort] > b.configuration[sort] ? -this.state.sortOrder : this.state.sortOrder);
    }else if(this.state.sort === "playersCount"){
      servers.sort((a: Server, b: Server) => a.players.length > b.players.length ? -this.state.sortOrder : this.state.sortOrder);
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
            {this.getServers().map((server: Server) => <ServerCard key={`${server.address}:${server.port}`} server={server}/>)}
          </div>
        );
      }else{
        servers = (
          <table className={settings.getBool(settings.COMPACT_TABLES) ? "table-compact" : ""}>
            <thead>
              <tr ref={this.tableHeaders}>
                <th onClick={(e) => this.sortBy("playersCount", 1, e.currentTarget)}>Players</th>
                <th onClick={(e) => this.sortBy("address", -1, e.currentTarget)}>Address</th>
                <th onClick={(e) => this.sortBy("country", -1, e.currentTarget)}>Country</th>
                <th onClick={(e) => this.sortBy("style", -1, e.currentTarget)}>Game Style</th>
                <th onClick={(e) => this.sortBy("title", -1, e.currentTarget)}>Title</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <List
                items={this.getServers()}
                increment={settings.getBool(settings.COMPACT_TABLES) ? 28 : 36}
                render={(server: Server) =>
                  <ServerRow key={`${server.address}:${server.port}`} server={server} onMouseMove={!settings.getBool(settings.INFO_CARDS) ? undefined : (e) => {
                    if(this.state.infoServer?.address !== server.address || this.state.infoServer.port !== server.port){
                      this.setState({infoServer: server});
                    }
                    if(!this.infoPopoutRef.current){
                      return;
                    }

                    const pos = {
                      x: e.pageX + 12,
                      y: e.pageY + 12
                    };

                    if(pos.x + this.infoPopoutRef.current.offsetWidth >= window.innerWidth){
                      pos.x = pos.x - this.infoPopoutRef.current.offsetWidth - 12;
                    }
                    if(pos.y + this.infoPopoutRef.current.offsetHeight >= window.innerHeight){
                      pos.y = pos.y - this.infoPopoutRef.current.offsetHeight - 12;
                    }

                    this.infoPopoutRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
                  }}/>
                }
              />
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
      playerCount += server.players.length;

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
          <div>With offline and mobile support</div><br/>
          <Search placeholder="Search by title or address" onValueChange={(value: string) => this.setState({searchQuery: value.toLowerCase()})}/>
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
        {this.state.infoServer && <div className="info-popout" ref={this.infoPopoutRef}>
          <h2>{this.state.infoServer.title}</h2>
          <small>Owner: {this.state.infoServer.owner}</small><br/><br/>
          <h3>{autoPlural(`${this.state.infoServer.players.length} Player`)} - {autoPlural(`${this.state.infoServer.teams.length} Team`)}</h3><br/>
          <div>
            {this.state.infoServer.players.length > 0 && this.state.infoServer.players && <>
              <table className={settings.getBool(settings.COMPACT_TABLES) ? "table-compact" : ""}>
              <thead>
                <tr>
                  <th>Callsign</th>
                  <th>Score</th>
                  <th>Team</th>
                  <th></th>
                </tr>
              </thead>
                <tbody>
                  {this.state.infoServer.players.sort(playerSort).map((player: Player) =>
                    <PlayerRow key={`${player.callsign}:${player.server}`} player={player} showServer={false} showFriend={false}/>
                  )}
                </tbody>
              </table>
            </>}
            <table className={settings.getBool(settings.COMPACT_TABLES) ? "table-compact" : ""}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Score</th>
                <th>Players</th>
              </tr>
            </thead>
              <tbody>
                {this.state.infoServer.teams.sort((a: Team, b: Team) => (a.wins - a.losses) > (b.wins - b.losses) ? -1 : 1).map((team: Team) =>
                  <tr key={team.name}>
                    <td><b>{team.name}</b></td>
                    <td>{team.name === "Observer" ? "" : team.wins - team.losses}</td>
                    <td>{team.players} / {team.maxPlayers}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>}
      </div>
    );
  }
}
