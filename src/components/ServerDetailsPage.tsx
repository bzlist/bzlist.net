import React from "react";
import {match, Link} from "react-router-dom";
import "./ServerDetailsPage.scss";

import {cache, socket, booleanYesNo, verboseGameStyle, autoPlural} from "../lib";
import {Server, Player, Team} from "../models";
import {TimeAgo, PlayerRow} from ".";

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
}

export class ServerDetailsPage extends React.Component<Props, State>{
  banner = "";

  constructor(props: Props){
    super(props);

    const {address, port} = this.props.match.params;

    // get cache
    let serverCache = cache.get("servers");
    if(serverCache === ""){
      serverCache = "[]";
    }
    let playerCache = cache.get("players");
    if(playerCache === ""){
      playerCache = "[]";
    }

    const serversCache = JSON.parse(serverCache);
    const playersCache = JSON.parse(playerCache);

    let server = null;
    if(serverCache && playerCache){
      server = serversCache.filter((_server: Server) => _server.address === address && _server.port === +port)[0];
      if(server){
        server.players = playersCache.filter((player: Player) => player.server === `${address}:${port}`).sort((a: Player, b: Player) => a.wins - a.losses > b.wins - b.losses ? -1 : 1);
      }
    }

    this.state = {
      server,
      selectTeam: false
    };

    socket.on<Server>(`${address}:${port}`, (data: Server) => {
      if(data.players){
        data.players.sort((a: Player, b: Player) => a.wins - a.losses > b.wins - b.losses ? -1 : 1);
      }
      this.setState({server: data});
    });
    socket.emit("server", {address, port: +port});
  }

  joinTeam(team: string): void{
    if(!this.state.server){
      return;
    }

    window.location.href = `bzflag-launcher:${this.state.server.address}:${this.state.server.port} ${team.toLowerCase()}`;
    this.setState({selectTeam: false});
  }

  render(): JSX.Element{
    if(!this.state.server || !this.state.server.players){
      const {address, port} = this.props.match.params;
      return (
        <div className="wrapper">
          <h1>{address}:{port} isn't in the database :(</h1><br/>
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
              <div className="close"><button className="btn icon" onClick={() => this.setState({selectTeam: false})}>&#xE711;</button></div>
            </div>
            <div className="inner">
              {this.state.server.teams.map((team: Team) =>
                <button key={team.name} className="btn outline" onClick={() => this.joinTeam(team.name)}>{team.name}</button>
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

    return (
      <div>
        <div className="banner" style={{background: `url(/images/servers/${this.state.server.address}_${this.state.server.port}.png), url(/images/servers/default.png) no-repeat top center`}}></div>
        <div className="container"><h1 className="title">{this.state.server.title}</h1></div>
        <div style={{"background":"var(--bg)"}}>
          <div className="server-header">
            <div><button className="play" onClick={() => this.setState({selectTeam: true})} title="Requires BZFlag Launcher">&#9658; Play</button></div>
            <div style={{position:"relative",bottom:"2px"}}>
              <img src={`https://countryflags.io/${this.state.server.countryCode}/flat/32.png`} style={{"margin":"0 6px -10px 0"}} alt=""/>
              <b>{this.state.server.country}</b>
            </div>
            <div style={{position:"relative",top:"4px"}}><b>Updated</b><br/><small><TimeAgo timestamp={this.state.server.timestamp}/></small></div>
          </div>
          <div className="container content">
            <div>
              <h1>Info</h1><br/>
              <table>
                <tbody>
                  <tr>
                    <th>Online</th>
                    <td>{booleanYesNo(this.state.server.online)}</td>
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
                    <th>Antidote Flags</th>
                    <td>{booleanYesNo(this.state.server.configuration.antidoteFlags)}</td>
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
                    <th>Drop Bad Flags</th>
                    <td>{booleanYesNo(this.state.server.configuration.shaking)}</td>
                  </tr>
                  <tr>
                    <th>Drop Bad Flags After</th>
                    <td>{autoPlural(`${this.state.server.configuration.dropBadFlags.wins} win`)} or {autoPlural(`${this.state.server.configuration.dropBadFlags.time} ssecond`)}</td>
                  </tr>
                  <tr>
                    <th>Inertia</th>
                    <td>{booleanYesNo(this.state.server.configuration.inertia)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h1>{playerCount} Players and {observerCount} Observers Online</h1><br/>
              <table>
              <thead>
                <tr>
                  <th>Callsign</th>
                  <th>Score</th>
                  <th>Team</th>
                </tr>
              </thead>
                <tbody>
                  {this.state.server.players.map((player: Player) =>
                    <PlayerRow key={player.callsign} player={player} showServer={false}/>
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
