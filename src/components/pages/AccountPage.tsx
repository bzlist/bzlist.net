import React from "react";

import {storage, api, user, checkAuth, deleteAccount, signout, updateUserCache, settings, authHeaders} from "lib";
import {Switch} from "components";

let bzLoginURL: string;
if(process.env.NODE_ENV === "production"){
  bzLoginURL = `https://my.bzflag.org/weblogin.php?action=weblogin&url=${encodeURIComponent(`${window.location.origin}/account?username=%USERNAME%&token=%TOKEN%`)}`;
}else{
  bzLoginURL = "https://my.bzflag.org/weblogin.php?action=weblogin&url=http%3A%2F%2Flocalhost%3A3000%2Faccount%3Fusername%3D%25USERNAME%25%26token%3D%25TOKEN%25";
}

const fetchSettings = async (): Promise<void> => {
  if(storage.get("syncSettings") !== "false" && storage.get("token") !== ""){
    const data = await api("users/settings", undefined, "GET", {
      ...(await authHeaders())
    });

    if(data && !data.error){
      settings.setData(data);

      if(data.theme){
        document.documentElement.setAttribute("data-theme", data.theme);
      }
    }
  }
};

interface State{
  error: string;
}

export class AccountPage extends React.PureComponent<any, State>{
  constructor(props: any){
    super(props);

    this.state = {
      error: ""
    };
  }

  componentDidMount(): void{
    const params: any = {};
    // decode query params
    window.location.search.substring(1).split("&").forEach((param: string) => params[param.split("=")[0]] = decodeURIComponent(param.split("=")[1]).replace(/\+/g, " "));
    if(params.username && params.token){
      this.login(params.username, params.token);
    }
  }

  async login(callsign: string, token: string): Promise<void>{
    // skip login of trying sign in as same account and already logged in
    if(callsign === user.callsign && storage.get("token") !== "" && storage.get("refreshToken") !== ""){
      if(await checkAuth()){
        return;
      }
    }

    const data = await api("users/token", {callsign, token});

    if(data.token && data.refreshToken){
      storage.set("token", data.token);
      storage.set("refreshToken", data.refreshToken);

      updateUserCache();
      await checkAuth();

      console.log(`signed in as ${user.callsign}`);
      fetchSettings();
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
              View <a href={`https://forums.bzflag.org/memberlist.php?mode=viewprofile&u=${user.bzid}`} target="_blank" rel="noopener noreferrer">forum profile</a>. More features coming soon!
            </p>
            <Switch
              label="Sync Settings"
              description="Sync all of your settings across devices"
              checked={storage.get("syncSettings") !== "false"}
              onChange={async (value: boolean) => {
                storage.set("syncSettings", value.toString());
                fetchSettings();
              }}/><br/>
            <button className="link" onClick={() => signout()}>Sign Out</button> • <button className="link" onClick={() => deleteAccount()}>Delete Account</button>
          </div>
        /* eslint-disable indent */
        :
          <div>
            <h1>Account</h1>
            <p>
              Sign in with your <a href="https://forums.bzflag.org" target="_blank" rel="noopener noreferrer">BZFlag account</a> to sync your settigs across devices.
              No password or extra information required.
            </p>
            <a className="btn btn-primary" href={bzLoginURL}>Sign In with BZFlag</a>
          </div>
        /* eslint-enable indent */
        }
        {this.state.error !== "" && <p className="no">Error: {this.state.error}</p>}
      </div>
    );
  }
}
