import React from "react";

import {storage, bzLoginURL, api} from "../lib";
import {Switch} from ".";

interface State{
  callsign: string;
  token: string;
  bzid: string;
  error: string;
}

export class AccountPage extends React.Component<any, State>{
  constructor(props: any){
    super(props);

    const token = storage.get("token");
    let callsign = "";
    let bzid = "";

    // load data from token
    if(token !== ""){
      const data = JSON.parse(window.atob(token.split(".")[1].replace("-", "+").replace("_", "/")));
      callsign = data.callsign;
      bzid = data.bzid;
    }

    this.state = {
      callsign,
      token,
      bzid,
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

    const data = await api("users/token", {callsign, token});

    if(data.token){
      this.setState({callsign, token: data.token});
      storage.set("token", this.state.token);

      this.checkToken();

      console.log(`signed in as ${this.state.callsign}`);
      window.location.href = "/account";
    }

    if(data.error){
      console.error("error signing in:", data.error);
      this.setState({error: data.error});
    }
  }

  async checkToken(): Promise<void>{
    if(!this.state.token || this.state.token === ""){
      this.setState({callsign: "", bzid: "", error: ""});
      return;
    }

    const data = await api("users/", undefined, "GET", {
      "Authorization": `Bearer ${this.state.token}`
    });

    if(!data || data.error){
      if(data && data.error){
        console.error("error checking token:", data.error);
      }
      this.setState({callsign: "", bzid: "", error: data && data.error ? data.error : ""});
      return;
    }

    this.setState({callsign: data.callsign, bzid: data.bzid, error: ""});
  }

  async signout(): Promise<void>{
    this.setState({callsign: "", token: "", bzid: ""});
    storage.remove("token");
  }

  async delete(): Promise<void>{
    const data = await api("users/", undefined, "DELETE", {
      "Authorization": `Bearer ${this.state.token}`
    });

    if(data.error){
      console.error("error delete account:", data.error);
      this.setState({error: data.error});
      return;
    }

    this.setState({callsign: "", token: "", bzid: ""});

    storage.remove("token");
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
              <Switch label="Sync Settings"
                      description="Sync all of your settings across devices"
                      checked={storage.get("syncSettings") === "true"}
                      onChange={(value: boolean) => storage.set("syncSettings", value.toString())}/><br/>
              <button className="link" onClick={() => this.signout()}>Sign Out</button> • <button className="link" onClick={() => this.delete()}>Delete Account</button>
            </div>
          :
            <div>
              <h1>Account</h1>
              <p>
                Sign in with your <a href="https://forums.bzflag.org" target="_blank" rel="noopener noreferrer">BZFlag account</a> to sync your settigs across devices.
                No password or extra information required.
              </p>
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
