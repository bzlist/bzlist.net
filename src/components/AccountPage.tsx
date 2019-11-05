import React from "react";

import {storage, bzLoginURL, api} from "../lib";

interface State{
  callsign: string;
  token: string;
  bzid: string;
  error: string;
}

export class AccountPage extends React.Component<any, State>{
  constructor(props: any){
    super(props);

    this.state = {
      callsign: storage.get("callsign"),
      token: storage.get("token"),
      bzid: storage.get("bzid"),
      error: ""
    };
  }

  componentDidMount(): void{
    this.checkToken();

    const params: any = {};
    window.location.search.substring(1).split("&").forEach((param: string) => params[param.split("=")[0]] = decodeURIComponent(param.split("=")[1]).replace(/\+/g, " "));
    if(params.username && params.token){
      this.login(params.username, params.token);
    }
  }

  async login(callsign: string, token: string): Promise<void>{
    if(callsign === this.state.callsign && this.state.token !== ""){
      await this.checkToken();
      if(this.state.bzid !== ""){
        return;
      }
    }

    const data = await api("token", {callsign, token});

    if(data.token){
      this.setState({callsign, token: data.token});
      storage.set("callsign", this.state.callsign);
      storage.set("token", this.state.token);

      this.checkToken();

      console.log(`signed in as ${this.state.callsign} with token ${this.state.token}`);
      window.location.href = "/account";
    }

    if(data.error){
      console.error("error signing in:", data.error);
      this.setState({error: data.error});
    }
  }

  async checkToken(): Promise<void>{
    if(this.state.callsign === "" || this.state.token === ""){
      this.setState({bzid: "", error: ""});
      return;
    }

    const data = await api("", {callsign: this.state.callsign, token: this.state.token});

    if(data.error){
      console.error("error checking token:", data.error);
      this.setState({bzid: "", error: data.error});
      return;
    }

    this.setState({bzid: data.bzid, error: ""});
    storage.set("bzid", this.state.bzid);
  }

  async signout(): Promise<void>{
    const data = await api("token", {callsign: this.state.callsign, token: this.state.token}, "DELETE");

    if(data.error){
      console.error("error signing out:", data.error);
      this.setState({error: data.error});
      return;
    }

    this.setState({callsign: "", token: "", bzid: ""});

    storage.remove("callsign");
    storage.remove("token");
    storage.remove("bzid");
  }

  async delete(): Promise<void>{
    const data = await api("", {callsign: this.state.callsign, token: this.state.token}, "DELETE");

    if(data.error){
      console.error("error delete account:", data.error);
      this.setState({error: data.error});
      return;
    }

    this.setState({callsign: "", token: "", bzid: ""});

    storage.remove("callsign");
    storage.remove("token");
    storage.remove("bzid");
  }

  render(): JSX.Element{
    return (
      <div className="wrapper">
        <div className="form">
          {this.state.bzid !== "" ?
            <div>
              <h1>{this.state.callsign}</h1>
              <p>
                View <a href={`https://forums.bzflag.org/memberlist.php?mode=viewprofile&u=${this.state.bzid}`} target="_blank" rel="noopener noreferrer">forum profile</a>.<br/>
                More features coming soon!
              </p>
              <button className="link" onClick={() => this.signout()}>Sign Out</button> • <button className="link" onClick={() => this.delete()}>Delete Account</button>
            </div>
          :
            <div>
              <h1>Account</h1>
              <p>Sign in to sync your settigs across devices.</p>
              <a className="btn btn-primary" href={bzLoginURL}>Sign In with BZFlag</a>
            </div>
          }
          {this.state.error !== "" ?
            <p className="no">Error: {this.state.error}</p>
          : null}
        </div>
      </div>

    );
  }
}
