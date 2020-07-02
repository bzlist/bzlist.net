import React from "react";

import {verboseGameStyle, history, favoriteServer, isFavoriteServer, isServerHidden, shouldIgnoreClick} from "lib";
import {Server} from "models";
import {Icon} from "components";

class ServerBase extends React.Component<{server: Server, onMouseMove?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void}, {favorite: boolean}>{
  constructor(props: any){
    super(props);

    this.state = {
      favorite: isFavoriteServer(this.props.server)
    };

    this.onClick = this.onClick.bind(this);
  }

  shouldComponentUpdate(nextProps: {server: Server}, nextState: {favorite: boolean}): boolean{
    return nextState.favorite !== this.state.favorite || nextProps.server.timestamp !== this.props.server.timestamp;
  }

  onClick(e?: React.MouseEvent, append?: string): void{
    if(e && shouldIgnoreClick(e)){
      return;
    }

    history.push(`/s/${this.props.server.address}/${this.props.server.port}${append ?? ""}`);
  }
}

export class ServerRow extends ServerBase{
  render(): JSX.Element{
    return (
      <tr
        style={{
          fontWeight: this.props.server.players.length > 0 ? 500 : "inherit",
          color: isServerHidden(this.props.server) ? "hsla(210, 5%, 50%, .7)" : this.props.server.players.length > 0 ? "var(--color-text-headings)" : "inherit",
          cursor: "pointer"
        }}
        onClick={this.onClick}
        onMouseMove={this.props.onMouseMove}
        data-server
      >
        <td>{this.props.server.players.length}</td>
        <td>{this.props.server.address}:{this.props.server.port}</td>
        <td>
          <span aria-label={this.props.server.country}><img src={`https://countryflags.io/${this.props.server.countryCode}/flat/32.png`} alt={this.props.server.countryCode}/></span>
        </td>
        <td><span aria-label={verboseGameStyle(this.props.server.style)}>{this.props.server.style}</span></td>
        <td>{this.props.server.title}</td>
        <td><button className="btn icon" onClick={() => {
          favoriteServer(this.props.server);
          this.setState({favorite: isFavoriteServer(this.props.server)});
        }} aria-label={this.state.favorite ? "Unfavorite" : "Favorite"}>{Icon("heart", this.state.favorite, "url(#a)")}</button></td>
        <td><button className="btn icon" onClick={(e) => this.onClick(undefined, "?play")} aria-label="Play">{Icon("playCircle", true, "url(#c)")}</button></td>
      </tr>
    );
  }
}

export class ServerCard extends ServerBase{
  render(): JSX.Element{
    return (
      <div onClick={() => this.onClick()}>
        <h2>
          <button className="btn icon" onClick={() => {
            favoriteServer(this.props.server);
            this.setState({favorite: isFavoriteServer(this.props.server)});
          }}>{Icon("heart", isFavoriteServer(this.props.server), "url(#a)")}</button>
          {this.props.server.title}
        </h2>
        <table>
          <tbody>
            <tr>
              <td>Players</td>
              <td><b>{this.props.server.players.length}</b></td>
            </tr>
            <tr>
              <td>Server</td>
              <td>{this.props.server.address}:{this.props.server.port}</td>
            </tr>
            <tr>
              <td>Game Style</td>
              <td>{verboseGameStyle(this.props.server.style)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
