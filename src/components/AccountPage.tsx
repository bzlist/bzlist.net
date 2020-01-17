import React from "react";

import {storage, bzLoginURL, api, user, checkAuth, deleteAccount, signout, updateUserCache} from "../lib";
import {Switch} from ".";

interface State{
  error: string;
}

export class AccountPage extends React.Component<any, State>{
  tokenData: any = null;

  constructor(props: any){
    super(props);

    this.state = {
      error: ""
    };
  }

  componentDidMount(): void{
    const params: any = {};
    window.location.search.substring(1).split("&").forEach((param: string) => params[param.split("=")[0]] = decodeURIComponent(param.split("=")[1]).replace(/\+/g, " "));
    if(params.username && params.token){
      this.login(params.username, params.token);
    }
  }

  async login(callsign: string, token: string): Promise<void>{
    if(callsign === user.callsign && storage.get("token") !== ""){
      if(await checkAuth() === true){
        return;
      }
    }

    const data = await api("users/token", {callsign, token});

    if(data.token){
      storage.set("token", data.token);

      updateUserCache();
      await checkAuth();

      console.log(`signed in as ${user.callsign}`);
      // clean query params from URL
      const url = window.location.toString();
      window.history.replaceState({}, document.title, url.substring(0, url.indexOf("?")));
    }

    if(data.error){
      console.error("error signing in:", data.error);
      this.setState({error: data.error});
    }
  }

  render(): JSX.Element{
    return (
      <div className="wrapper">
        {user.bzid !== "" ?
          <div>
            <img src={`https://forums.bzflag.org/download/file.php?avatar=${user.bzid}.png`} height="42" style={{marginRight: "16px"}} alt=""/>
            <h1>{user.callsign}</h1>
            <p>
              View <a href={`https://forums.bzflag.org/memberlist.php?mode=viewprofile&u=${user.bzid}`} target="_blank" rel="noopener noreferrer">forum profile</a>.<br/>
              More features coming soon!<br/>
              {Math.round((user.exp - (Date.now() / 1000)) / 86400)} days until automatically logged out.
            </p>
            <Switch label="Sync Settings"
                    description="Sync all of your settings across devices"
                    checked={storage.get("syncSettings") === "true"}
                    onChange={(value: boolean) => storage.set("syncSettings", value.toString())}/><br/>
            <button className="link" onClick={() => signout()}>Sign Out</button> • <button className="link" onClick={() => deleteAccount()}>Delete Account</button>
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
        {this.state.error !== "" && <p className="no">Error: {this.state.error}</p>}
      </div>
    );
  }
}
