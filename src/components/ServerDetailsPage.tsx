import React from "react";
import {match, Link} from "react-router-dom";
import "./ServerDetailsPage.scss";

import {cache, socket, booleanYesNo, verboseGameStyle, autoPlural, settings, isFavoriteServer, favoriteServer, hideServer} from "../lib";
import {Server, Player, Team} from "../models";
import {TimeAgo, PlayerRow, Switch, Icon} from ".";

const playerSort = (a: Player, b: Player) => a.team === "Observer" ? 1 : b.team === "Observer" ? -1 : a.score > b.score ? -1 : 1;

interface Params{
  address: string;
  port: string;
}

interface Props{
  match: match<Params>;
}

interface State{
  server: Server | null;
  selectTeam: boolean;
  favorite: boolean;
}

export class ServerDetailsPage extends React.PureComponent<Props, State>{
  address = "";
  port = -1;

  constructor(props: Props){
    super(props);

    this.address = this.props.match.params.address;
    this.port = +this.props.match.params.port;

    // get cache
    const serversCache: Server[] = cache.getJson("servers", []);
    const playersCache: Player[] = cache.getJson("players", []);

    let server = null;
    if(serversCache && playersCache){
      server = serversCache.filter((_server: Server) => _server.address === this.address && _server.port === this.port)[0];
      if(server){
        server.players = playersCache.filter((player: Player) => player.server === `${this.address}:${this.port}`).sort(playerSort);
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
      server,
      selectTeam,
      favorite: isFavoriteServer(server)
    };

    socket.on<Server>(`${this.address}:${this.port}`, (data: Server) => {
      if(data && data.players){
        data.players.sort(playerSort);
      }
      this.setState({server: data});

      if(!data){
        return;
      }

      // update servers cache
      if(serversCache){
        server = serversCache.filter((_server: Server) => _server.address === data.address && _server.port === data.port)[0];
        if(server){
          const serverIndex = serversCache.indexOf(server);
          server = {...data};
          delete server.players;

          serversCache[serverIndex] = server;
          cache.set("servers", JSON.stringify(serversCache));
        }
      }

      // update players cache
      if(playersCache && data.players){
        let players = data.players.map((player: Player) => {
          player.server = `${data.address}:${data.port}`;
          player.timestamp = data.timestamp;

          return player;
        });

        for(let i = 0; i < playersCache.length; i++){
          if(playersCache[i].server === `${data.address}:${data.port}`){
            playersCache.splice(i, 1);
            i--;
          }
        }

        players = players.concat(playersCache);
        cache.set("players", JSON.stringify(players));
      }
    });
    socket.emit("server", {address: this.address, port: this.port});
  }

  componentWillUnmount(): void{
    socket.off(`${this.address}:${this.port}`);
  }

  joinTeam(team: string): void{
    if(!this.state.server){
      return;
    }

    window.location.href = `bzflag-launcher:${this.state.server.address}:${this.state.server.port} ${team.toLowerCase()}`;
    this.setState({selectTeam: false});
  }

  render(): JSX.Element{
    if(!this.state.server){
      const {address, port} = this.props.match.params;
      return (
        <div className="wrapper">
          <h1>{address}:{port} isn't in the database :(</h1><br/><br/>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      );
    }

    let playPopup;
    if(this.state.selectTeam){
      playPopup = (
        <div className="play-popup">
          <span className="overlay" onClick={() => this.setState({selectTeam: false})}></span>
          <div>
            <div className="popup-header">
              <h3>Select Team</h3>
              <div className="close"><button className="btn icon" onClick={() => this.setState({selectTeam: false})}>{Icon("close")}</button></div>
            </div>
            <div className="inner">
              {this.state.server.teams.map((team: Team) =>
                <button key={team.name} className="btn btn-outline" onClick={() => this.joinTeam(team.name)}>{autoPlural(`${team.players} ${team.name}`)}</button>
              )}
            </div>
          </div>
        </div>
      );
    }

    // calculate number of players and observers
    let playerCount = this.state.server.playersCount;
    let observerCount = 0;

    const observerTeam = this.state.server.teams.find((team: Team) => team.name === "Observer");
    if(observerTeam){
      playerCount -= observerTeam.players;
      observerCount += observerTeam.players;
    }

    const isServerHidden = settings.getJson("hiddenServers", []).includes(`${this.state.server.address}:${this.state.server.port}`);

    return (
      <div>
        <div className="title" style={{background: `url(/images/servers/${this.state.server.address}_${this.state.server.port}.png), url(/images/servers/default.png) no-repeat center center`}}>
          <h1>{this.state.server.title}</h1>
        </div>
        <div className="server-header">
          <div className="mobile-hide"><button className="btn btn-play" onClick={() => this.setState({selectTeam: true})} title="Requires BZFlag Launcher">&#9658; Play</button></div>
          <div>
            <button className="btn icon" onClick={() => {
              favoriteServer(this.state.server as Server);
              this.setState({favorite: isFavoriteServer(this.state.server)});
            }}>{Icon("heart", isFavoriteServer(this.state.server), "url(#a)")}</button>
          </div>
          {"share" in navigator && <div>
            <button className="btn icon" onClick={() => (navigator as any).share({url: window.location.href, title: this.state.server?.title})}>{Icon("share", false)}</button>
          </div>}
          <div>
            <img src={`https://countryflags.io/${this.state.server.countryCode}/flat/32.png`} style={{margin:"0 4px 0 0"}} alt=""/>
            {this.state.server.country}
          </div>
          <div><b>{autoPlural(`${this.state.server.playersCount} Player`)}</b></div>
        </div>
        <div className="container">
          <Switch label="Hide Server" description="Don't show in server list" checked={isServerHidden} onChange={() => hideServer(this.state.server)}/><br/>
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
                    <td>{verboseGameStyle(this.state.server.configuration.gameStyle)}</td>
                  </tr>
                  <tr>
                    <th>Max shots</th>
                    <td>{this.state.server.configuration.maxShots}</td>
                  </tr>
                  <tr>
                    <th>Max Players</th>
                    <td>{this.state.server.configuration.maxPlayers}</td>
                  </tr>
                  <tr>
                    <th>Flags</th>
                    <td>{booleanYesNo(this.state.server.configuration.superflags)}</td>
                  </tr>
                  <tr>
                    <th>No Team Kills</th>
                    <td>{booleanYesNo(this.state.server.configuration.noTeamKills)}</td>
                  </tr>
                  <tr>
                    <th>Jumping</th>
                    <td>{booleanYesNo(this.state.server.configuration.jumping)}</td>
                  </tr>
                  <tr>
                    <th>Ricochet</th>
                    <td>{booleanYesNo(this.state.server.configuration.ricochet)}</td>
                  </tr>
                  <tr>
                    <th>Drop Bad Flags After</th>
                    <td>{autoPlural(`${this.state.server.configuration.dropBadFlags.wins} win`)} or {autoPlural(`${this.state.server.configuration.dropBadFlags.time} second`)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {this.state.server.playersCount > 0 && this.state.server.players &&
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
                    {this.state.server.players.map((player: Player) => <PlayerRow key={`${player.callsign}:${player.server}`} player={player} showServer={false}/>)}
                  </tbody>
                </table>
              </div>
            }
            <div>
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
                  {this.state.server.teams.sort((a: Team, b: Team) => a.score > b.score ? -1 : 1).map((team: Team) =>
                    <tr key={team.name}>
                      <td><b>{team.name}</b></td>
                      <td>{team.name === "Observer" ? "" : team.score}</td>
                      <td>{team.players} / {team.maxPlayers}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {playPopup}
      </div>
    );
  }
}
