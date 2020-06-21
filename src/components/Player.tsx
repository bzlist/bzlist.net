import React from "react";
import {Link} from "react-router-dom";

import {settings, friendPlayer, isPlayerFriend, joinGame} from "lib";
import {Player} from "models";
import {Icon, Dialog} from "components";
import {setDialog} from "App";

export const playerSort = (a: Player, b: Player) => a.team === "Observer" ? 1 : b.team === "Observer" ? -1 : (a.wins || 0) - (a.losses || 0) > (b.wins || 0) - (b.losses || 0) ? -1 : 1;

class PlayerBase extends React.Component<{player: Player, showServer?: boolean, showFriend: boolean}, {friend: boolean, showInfo: boolean}>{
  static defaultProps = {
    showFriend: true
  };

  score = (this.props.player.wins || 0) - (this.props.player.losses || 0);

  constructor(props: any){
    super(props);

    this.state = {
      friend: isPlayerFriend(this.props.player.callsign),
      showInfo: false
    };
  }

  shouldComponentUpdate(nextProps: {player: Player, showServer: boolean, showFriend: boolean}, nextState: {friend: boolean, showInfo: boolean}): boolean{
    return nextState.friend !== this.state.friend || nextProps.player.timestamp !== this.props.player.timestamp || nextState.showInfo !== this.state.showInfo;
  }

  componentDidUpdate(): void{
    const {player, showServer} = this.props;
    setDialog(<Dialog title={player.callsign} open={this.state.showInfo} onClose={() => this.setState({showInfo: false})}>
      <table className={settings.getBool(settings.COMPACT_TABLES) ? "table-compact" : ""}>
        <tbody>
          {player.motto && <tr>
            <th>Motto</th>
            <td>{player.motto}</td>
          </tr>}
          <tr>
            <th>Team</th>
            <td>{player.team}</td>
          </tr>
          {player.wins !== undefined && <tr>
            <th>Wins</th>
            <td>{player.wins}</td>
          </tr>}
          {player.losses !== undefined && <tr>
            <th>Losses</th>
            <td>{player.losses}</td>
          </tr>}
          {player.tks !== undefined && <tr>
            <th>Team Kills</th>
            <td>{player.tks}</td>
          </tr>}
        </tbody>
      </table>
      <div className="btn-list">
        <button className="btn btn-primary" onClick={() => joinGame(player.server, player.team)}>Join</button>
        {showServer && <Link onClick={() => setDialog(null)} to={`/s/${player.server.split(":")[0]}/${player.server.split(":")[1]}`} className="btn btn-outline">View Server</Link>}
      </div>
    </Dialog>);
  }
}

export class PlayerRow extends PlayerBase{
  render(): JSX.Element{
    const {player} = this.props;
    const serverTr = player.server && this.props.showServer && <td><Link to={`/s/${player.server.split(":")[0]}/${player.server.split(":")[1]}`}>{player.server}</Link></td>;

    return (
      <tr onClick={() => this.setState({showInfo: true})} style={{cursor: "pointer"}}>
        <td><b>{player.callsign}</b>{player.motto && ` (${player.motto})`}</td>
        <td>{player.team !== "Observer" && this.score}</td>
        <td>{player.team}</td>
        {serverTr}
        {this.props.showFriend &&
          <td><button className="btn icon" onClick={(e) => {
            e.stopPropagation();
            friendPlayer(player.callsign);
            this.setState({friend: isPlayerFriend(player.callsign)});
          }} aria-label={this.state.friend ? "Remove friend" : "Add as friend"}>{Icon("friend", this.state.friend, "url(#a)")}</button></td>
        }
      </tr>
    );
  }
}

export class PlayerCard extends PlayerBase{
  render(): JSX.Element{
    const {player} = this.props;

    return (
      <div onClick={() => this.setState({showInfo: true})}>
        <h2>
          <button className="btn icon" onClick={(e) => {
            e.stopPropagation();
            friendPlayer(player.callsign);
            this.setState({friend: isPlayerFriend(player.callsign)});
          }}>{Icon("friend", settings.getJson("friends", []).includes(player.callsign), "url(#a)")}</button>
          {player.callsign}
        </h2>
        <table className={settings.getBool(settings.COMPACT_TABLES) ? "table-compact" : ""}>
          <tbody>
            {player.team !== "Observer" &&
              <tr>
                <td>Score</td>
                <td>{this.score}</td>
              </tr>
            }
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
    );
  }
}
