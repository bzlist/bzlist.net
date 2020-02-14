import React from "react";

import {verboseGameStyle, history, favoriteServer, isFavoriteServer} from "../lib";
import {Server} from "../models";
import {Icon} from ".";

class ServerBase extends React.Component<{server: Server}, {favorite: boolean}>{
  constructor(props: any){
    super(props);

    this.state = {
      favorite: false
    };
  }

  shouldComponentUpdate(nextProps: {server: Server}, nextState: {favorite: boolean}): boolean{
    return nextState.favorite !== this.state.favorite || nextProps.server.timestamp !== this.props.server.timestamp;
  }

  onClick(append: string = ""): void{
    history.push(`/s/${this.props.server.address}/${this.props.server.port}${append}`);
  }
}

export class ServerRow extends ServerBase{
  render(): JSX.Element{
    return (
      <tr style={{fontWeight: this.props.server.playersCount > 0 ? "bold" : "inherit"}} onClick={() => this.onClick()}>
        <td>{this.props.server.playersCount}</td>
        <td>{this.props.server.address}:{this.props.server.port}</td>
        <td>
          <img src={`https://countryflags.io/${this.props.server.countryCode}/flat/32.png`} alt={this.props.server.countryCode} title={this.props.server.country}/>
        </td>
        <td title={verboseGameStyle(this.props.server.configuration.gameStyle)}>{this.props.server.configuration.gameStyle}</td>
        <td>{this.props.server.title}</td>
        <td><button className="btn icon" onClick={(e) => {
          e.stopPropagation();
          favoriteServer(this.props.server);
          this.setState({favorite: isFavoriteServer(this.props.server)});
        }}>{Icon("heart", isFavoriteServer(this.props.server), "url(#e)")}</button></td>
        <td><button className="btn icon btn-play" onClick={(e) => {
          e.stopPropagation();
          this.onClick("?play");
        }} title="Play">&#9658;</button></td>
      </tr>
    );
  }
}

export class ServerCard extends ServerBase{
  render(): JSX.Element{
    return (
      <div onClick={() => this.onClick()}>
        <h2>
          <button className="btn icon" onClick={(e) => {
            e.stopPropagation();
            favoriteServer(this.props.server);
            this.setState({favorite: isFavoriteServer(this.props.server)});
          }}>{Icon("heart", isFavoriteServer(this.props.server), "url(#e)")}</button>
          {this.props.server.title}
        </h2><br/>
        <table>
          <tbody>
            <tr>
              <td>Players</td>
              <td><b>{this.props.server.playersCount}</b></td>
            </tr>
            <tr>
              <td>Server</td>
              <td>{this.props.server.address}:{this.props.server.port}</td>
            </tr>
            <tr>
              <td>Game Style</td>
              <td>{verboseGameStyle(this.props.server.configuration.gameStyle)}</td>
            </tr>
            <tr>
              <td>Country</td>
              <td><img src={`https://countryflags.io/${this.props.server.countryCode}/flat/16.png`} title={this.props.server.country} alt=""/> {this.props.server.country}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
