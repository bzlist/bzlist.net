import React from "react";
import {match, Link} from "react-router-dom";
import "./ServerDetailsPage.scss";

import {
  cache,
  socket,
  booleanYesNo,
  verboseGameStyle,
  autoPlural,
  settings,
  isFavoriteServer,
  favoriteServer,
  hideServer,
  api,
  isServerHidden,
  joinGame,
  teamSort
} from "lib";
import {IServer, IPlayer, ITeam, TeamName} from "models";
import {TimeAgo, PlayerRow, Switch, Icon, playerSort, Dropdown} from "components";
import {imageExt} from "index";
import {Dialog} from "components/Dialog";

const HISTORY_CHART_SIZE = {
  width: 300,
  height: 50
};

interface Params{
  address: string;
  port: string;
  timestamp: string;
}

interface Props{
  match: match<Params>;
}

interface State{
  server: IServer | null;
  selectTeam: boolean;
  favorite: boolean;
  history: IServer[];
  past: boolean;
  historyPeriod: "Day" | "3 Days" | "Week";
  selectedTeam: ITeam | null;
}

export class ServerDetailsPage extends React.PureComponent<Props, State>{
  address = "";
  port = -1;
  timestamp = 0;
  server: IServer | null = null;
  serversCache: IServer[];
  playersCache: IPlayer[];

  constructor(props: Props){
    super(props);

    this.address = this.props.match.params.address;
    this.port = +this.props.match.params.port;
    this.timestamp = +this.props.match.params.timestamp;

    // get cache
    this.serversCache = cache.getJson("servers", []);
    this.playersCache = cache.getJson("players", []);

    if(this.serversCache && this.playersCache){
      this.server = this.serversCache.filter((_server: IServer) => _server.address === this.address && _server.port === this.port)[0];
      if(this.server){
        this.server.players = this.playersCache.filter((player: IPlayer) => player.server === `${this.address}:${this.port}`).sort(playerSort);
      }
    }

    let selectTeam = false;
    const params: any = {};
    // decode query params
    window.location.search.substring(1).split("&").forEach((param: string) => params[param.split("=")[0]] = decodeURIComponent(param.split("=")[1]).replace(/\+/g, " "));
    if(params.play){
      selectTeam = true;
    }
    // clean query params from URL
    const url = window.location.toString();
    window.history.replaceState({}, document.title, url.substring(0, url.indexOf("?")));

    this.state = {
      server: this.server,
      selectTeam,
      favorite: isFavoriteServer(this.server),
      history: [],
      past: !isNaN(this.timestamp),
      historyPeriod: "Day",
      selectedTeam: null
    };

    this.handleData = this.handleData.bind(this);

    if(this.timestamp){
      api(`servers/${this.address}/${this.port}/${this.timestamp}`, undefined, "GET").then(this.handleData);
    }else{
      this.fetchHistory();
      this.fetchData();
    }
  }

  componentWillUnmount(): void{
    if(!settings.getBool(settings.DISABLE_REALTIME_DATA)){
      socket.off(`${this.address}:${this.port}`);
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State): void{
    if(!prevState.past && this.state.past){
      socket.off(`${this.address}:${this.port}`);
    }else if(prevState.past && !this.state.past){
      this.fetchData();
    }

    if(prevState.historyPeriod !== this.state.historyPeriod || prevState.server?.timestamp !== this.state.server?.timestamp){
      this.fetchHistory();
    }
  }

  fetchData(): void{
    if(settings.getBool(settings.DISABLE_REALTIME_DATA)){
      api(`servers/${this.address}/${this.port}`, undefined, "GET").then(this.handleData);
      return;
    }

    socket.on<IServer>(`${this.address}:${this.port}`, this.handleData);
    socket.emit("server", {address: this.address, port: this.port});
  }

  fetchHistory(): void{
    const hours = this.state.historyPeriod === "3 Days" ? 72 : this.state.historyPeriod === "Week" ? 168 : 24;
    api(`history/${this.address}/${this.port}?hours=${hours}${this.state.server ? `&timestamp=${this.state.server.timestamp}` : ""}`, undefined, "GET").then((data: IServer[]) => {
      this.setState({
        history: data.sort((a: IServer, b: IServer) => a.timestamp - b.timestamp).map((server: IServer) => {
          if(server.players){
            server.players = server.players.sort(playerSort);
          }

          return server;
        })
      });
    });
  }

  handleData(data: IServer): void{
    if(data && data.players){
      data.players.sort(playerSort);
    }
    this.setState({server: data});

    if(!data){
      document.title = "Server Not Found - BZList";
      return;
    }

    document.title = `${data.title} - BZList`;

    if(this.state.past){
      return;
    }

    // update servers cache
    if(this.serversCache){
      this.server = this.serversCache.filter((_server: IServer) => _server.address === data.address && _server.port === data.port)[0];
      if(this.server){
        const serverIndex = this.serversCache.indexOf(this.server);
        this.server = {...data};
        delete this.server.players;

        this.serversCache[serverIndex] = this.server;
        cache.set("servers", JSON.stringify(this.serversCache));
      }
    }

    // update players cache
    if(this.playersCache && data.players){
      let players = data.players.map((player: IPlayer) => {
        player.server = `${data.address}:${data.port}`;
        player.timestamp = data.timestamp;

        return player;
      });

      for(let i = 0; i < this.playersCache.length; i++){
        if(this.playersCache[i].server === `${data.address}:${data.port}`){
          this.playersCache.splice(i, 1);
          i--;
        }
      }

      players = players.concat(this.playersCache);
      cache.set("players", JSON.stringify(players));
    }
  }

  joinTeam(team: TeamName): void{
    if(!this.state.server){
      return;
    }

    joinGame(this.state.server, team);
    this.setState({selectTeam: false, selectedTeam: null});
  }

  getTeamCount(team: ITeam | null): number{
    if(!this.state.server || !team){
      return 0;
    }

    if(team.name === "Rogue"){
      return this.state.server.players.filter((player: IPlayer) => player.team === "Rogue" || player.team === "Hunter" || player.team === "Rabbit").length;
    }

    return this.state.server.players.filter((player: IPlayer) => player.team === team.name).length;
  }

  render(): JSX.Element{
    if(!this.state.server){
      return (
        <div className="wrapper">
          <h1>{this.address}:{this.port} isn't in the database :(</h1><br/><br/>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      );
    }

    // calculate number of players and observers
    const observerCount = this.state.server.players.filter((player: IPlayer) => player.team === "Observer").length;
    const playerCount = this.state.server.players.length - observerCount;

    const imageUrl = `/images/servers/${this.state.server.address}_${this.state.server.port}`;

    const maxPlayerCountServer = [...this.state.history].sort((a: IServer, b: IServer) => a.players.length < b.players.length ? 1 : -1)[0];
    const historyPlayerMultiplier = (maxPlayerCountServer ? HISTORY_CHART_SIZE.height / maxPlayerCountServer.players.length : 0);

    return (
      <div>
        <div className="title" style={{background: `url(${imageUrl}.${imageExt}), url(/images/servers/default.png) center`}}>
          <h1>{this.state.server.title}</h1>
        </div>
        <div className="server-header">
          <div className="mobile-hide">
            <button className="btn icon" onClick={() =>
              this.setState({selectTeam: true})
            } aria-label="Requires BZFlag Launcher">{Icon("playCircle", true, "url(#c)")}&nbsp;&nbsp;Play</button>
          </div>
          <div>
            <button className="btn icon" onClick={() => {
              favoriteServer(this.state.server as IServer);
              this.setState({favorite: isFavoriteServer(this.state.server)});
            }}>{Icon("heart", isFavoriteServer(this.state.server), "url(#a)")}</button>
          </div>
          {"share" in navigator && <div>
            <button className="btn icon" onClick={() =>
              (navigator as any).share({url: window.location.href, title: this.state.server?.title})
            } aria-label="Share">{Icon("share", false)}</button>
          </div>}
          <div>
            <img src={`/images/country-flags/${this.state.server.countryCode.toLowerCase()}.svg`} height="24px" style={{margin:"0 4px 0 0"}} alt=""/>
            {this.state.server.country}
          </div>
          <div><b>{autoPlural(`${this.state.server.players.length} Player`)}</b></div>
        </div>
        <div className="container">
          <div className="card-list content">
            <div>
              <h2>Info</h2>
              <table className={settings.getBool(settings.COMPACT_TABLES) ? "table-compact" : ""}>
                <tbody>
                  <tr>
                    <th>Updated</th>
                    <td><TimeAgo timestamp={this.state.server.timestamp}/></td>
                  </tr>
                  <tr>
                    <th>Server</th>
                    <td>{this.state.server.address}:{this.state.server.port}</td>
                  </tr>
                  <tr>
                    <th>IP Address</th>
                    <td>{this.state.server.ip}</td>
                  </tr>
                  <tr>
                    <th>Owner</th>
                    <td>{this.state.server.owner}</td>
                  </tr>
                  <tr>
                    <th>Game Style</th>
                    <td>{verboseGameStyle(this.state.server.style)}</td>
                  </tr>
                  <tr>
                    <th>Max shots</th>
                    <td>{this.state.server.maxShots}</td>
                  </tr>
                  <tr>
                    <th>Max Players</th>
                    <td>{this.state.server.maxPlayers}</td>
                  </tr>
                  <tr>
                    <th>Flags</th>
                    <td>{booleanYesNo(this.state.server.options.flags)}</td>
                  </tr>
                  <tr>
                    <th>No Team Kills</th>
                    <td>{booleanYesNo(this.state.server.options.noTeamKills)}</td>
                  </tr>
                  <tr>
                    <th>Jumping</th>
                    <td>{booleanYesNo(this.state.server.options.jumping)}</td>
                  </tr>
                  <tr>
                    <th>Ricochet</th>
                    <td>{booleanYesNo(this.state.server.options.ricochet)}</td>
                  </tr>
                  <tr>
                    <th>Drop Bad Flags After</th>
                    <td>
                      {
                        this.state.server.shake ?
                          `${autoPlural(`${this.state.server.shake.wins} win`)} or ${autoPlural(`${this.state.server.shake.timeout} second`)}` :
                          "Never"
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {this.state.server.players.length > 0 &&
              <div className="players">
                <h2>{autoPlural(`${playerCount} Player`)} and {autoPlural(`${observerCount} Observer`)}</h2>
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
                    {this.state.server.players.map((player: IPlayer) =>
                      <PlayerRow key={`${player.callsign}:${player.server}${this.state.server?.timestamp}`} player={player} showServer={false} showMotto={false}/>
                    )}
                  </tbody>
                </table>
              </div>
            }
            <div className="teams">
              <h2>{autoPlural(`${this.state.server.teams.length} Team`)}</h2>
              <table className={settings.getBool(settings.COMPACT_TABLES) ? "table-compact" : ""}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Score</th>
                    <th>Players</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.server.teams.sort(teamSort).map((team: ITeam) =>
                    <tr key={team.name} onClick={() => this.setState({selectedTeam: team})}>
                      <td><b>{team.name}</b></td>
                      <td>{team.wins !== undefined && team.losses !== undefined && team.wins - team.losses}</td>
                      <td>{this.getTeamCount(team)} / {team.maxPlayers}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div>
              <h2>Player History<span className="beta"></span></h2>
              <span className="label">Past</span>
              <Dropdown items={["Day", "3 Days", "Week"]} selected={this.state.historyPeriod} onChange={(value: any) => this.setState({historyPeriod: value})}/><br/>
              {this.state.history.length > 0 ?
                <div className="history">
                  <svg viewBox={`0 0 ${HISTORY_CHART_SIZE.width} ${HISTORY_CHART_SIZE.height}`} className="chart">
                    <polyline
                      fill="none"
                      points={this.state.history.map((server: IServer, i: number) =>
                        `${HISTORY_CHART_SIZE.width / this.state.history.length * i},${HISTORY_CHART_SIZE.height - server.players.length * historyPlayerMultiplier}`
                      ).join(" ")}
                    />
                  </svg>
                  <div>
                    <span>
                      -{Math.ceil(((this.state.past ? this.state.server.timestamp : Math.floor(new Date().getTime() / 1000)) - this.state.history[0].timestamp) / 3600)}h
                    </span>
                    <span>
                      -{Math.round(((this.state.past ? this.state.server.timestamp : Math.floor(new Date().getTime() / 1000)) - this.state.history[this.state.history.length - 1].timestamp) / 60)}m
                    </span>
                  </div>
                </div>
                : this.state.history.length === 0 ? <span>No data for this period.</span>
                  : <span>Loading...</span>
              }
            </div>
          </div>
          <Switch
            label="Hide Server"
            description="Don't show in server list"
            checked={isServerHidden(this.server)}
            onChange={() => hideServer(this.state.server)}
          />
          {this.state.past && <button style={{marginTop: "2rem"}} className="btn btn-outline" onClick={() => this.setState({past: false})}>View Current</button>}
        </div>
        <div className="play-dialog">
          <Dialog title="Select Team" open={this.state.selectTeam} onClose={() => this.setState({selectTeam: false})}>
            {this.state.server.teams.map((team: ITeam) =>
              <button key={team.name} className="btn btn-outline" onClick={() => this.joinTeam(team.name)}>{autoPlural(`${this.getTeamCount(team)} ${team.name}`)}</button>
            )}
          </Dialog>
        </div>
        <Dialog title={this.state.selectedTeam?.name || ""} open={this.state.selectedTeam !== null} onClose={() => this.setState({selectedTeam: null})}>
          <table className={settings.getBool(settings.COMPACT_TABLES) ? "table-compact" : ""}>
            <tbody>
              {this.state.selectedTeam?.wins !== undefined && <tr>
                <th>Wins</th>
                <td>{this.state.selectedTeam?.wins}</td>
              </tr>}
              {this.state.selectedTeam?.losses !== undefined && <tr>
                <th>Losses</th>
                <td>{this.state.selectedTeam?.losses}</td>
              </tr>}
              <tr>
                <th>Players</th>
                <td>{this.getTeamCount(this.state.selectedTeam)}</td>
              </tr>
              <tr>
                <th>Max Players</th>
                <td>{this.state.selectedTeam?.maxPlayers}</td>
              </tr>
            </tbody>
          </table>
          <div className="btn-list">
            <button className="btn btn-primary" onClick={() => this.state.server && this.state.selectedTeam?.name && this.joinTeam(this.state.selectedTeam?.name)}>Join</button>
          </div>
        </Dialog>
      </div>
    );
  }
}
