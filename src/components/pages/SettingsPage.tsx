import React from "react";
import {Link} from "react-router-dom";
import "./SettingsPage.scss";

import {settings, cache, IBoolSetting, user, storage, favoriteServer, friendPlayer, history, hideServer} from "lib";
import {Dropdown, Switch, Icon} from "components";
import {List} from "components/List";

const themes = ["Light", "Dark", "Midnight"];
const TABS = ["Appearance", "Notifications", "Servers & Players", "Data Usage"];

const tabToUrl = (tab: string): string => {
  return tab.replace(/&/g, "").replace(/\s+/g, " ").replace(/ /g, "-").toLowerCase();
};

const notificationStatusText = (): string => {
  if("Notification" in window){
    const text = Notification.permission;
    return text === "default" ? "not enabled" : text;
  }

  return "not supported";
};

interface State{
  message: string;
  tab: number;
}

export class SettingsPage extends React.PureComponent<any, State>{
  messageTimeout: any;

  constructor(props: any){
    super(props);

    let tab = 0;
    for(let i = 0; i < TABS.length; i++){
      if(history.location.pathname.endsWith(tabToUrl(TABS[i]))){
        tab = i;
        break;
      }
    }

    this.state = {
      message: "",
      tab
    };
  }

  componentWillUnmount(): void{
    clearTimeout(this.messageTimeout);
  }

  setTheme(value: string): void{
    document.documentElement.setAttribute("data-theme", value);
    settings.set("theme", value);
  }

  set(key: IBoolSetting, value: boolean): void{
    settings.setBool(key, value);
    this.message("Saved");
  }

  message(message: string): void{
    this.setState({message});

    clearTimeout(this.messageTimeout);
    this.messageTimeout = setTimeout(() => this.setState({message: ""}), 3000);
  }

  setTab(index: number): void{
    this.setState({tab: index});
    history.push(`/settings/${tabToUrl(TABS[index])}`);
  }

  render(): JSX.Element{
    let currentTheme = settings.get("theme");
    if(currentTheme === ""){
      currentTheme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      this.setTheme(currentTheme);
    }
    currentTheme = currentTheme[0].toUpperCase() + currentTheme.slice(1);

    return (
      <div className="settings">
        <div className="settings__sidebar">
          <h2>Settings</h2>
          {TABS.map((tab: string, index: number) =>
            <button key={tab} className="btn" onClick={() => this.setTab(index)} data-selected={this.state.tab === index}>{tab}</button>
          )}
        </div>
        <div className="settings__inner">
          <h1>{TABS[this.state.tab]}</h1>
          {this.state.tab === 0 && <>
            <Switch label="Compact Tables"
                    description="Reduce the height of table rows to fit more on the screen at once"
                    checked={settings.getBool(settings.COMPACT_TABLES)}
                    onChange={(value: boolean) => this.set(settings.COMPACT_TABLES, value)}/>
            <Switch label="Ignore Online Observers"
                    description="Don't treat observers as players on the server list"
                    checked={settings.getBool(settings.EXCLUDE_OBSERVERS)}
                    onChange={(value: boolean) => this.set(settings.EXCLUDE_OBSERVERS, value)}/>
            <Switch label="Ignore Observers Bots"
                    description="Ignore observers that appear to be bots"
                    checked={settings.getBool(settings.IGNORE_OBSERVER_BOTS)}
                    onChange={(value: boolean) => this.set(settings.IGNORE_OBSERVER_BOTS, value)}/>
            <Switch label="Custom Scrollbars"
                    description="Use custom scrollbars instead of the default ones"
                    checked={settings.getBool(settings.CUSTOM_SCROLLBARS)}
                    onChange={(value: boolean) => this.set(settings.CUSTOM_SCROLLBARS, value)}/>
            <Switch label="Disable Animations"
                    description="Disable all animations"
                    checked={settings.getBool(settings.DISABLE_ANIMATIONS)}
                    onChange={(value: boolean) => this.set(settings.DISABLE_ANIMATIONS, value)}/>
            <Switch label="Experimental Info Cards"
                    description="Show experimental info card when mousing over a server"
                    checked={settings.getBool(settings.INFO_CARDS)}
                    onChange={(value: boolean) => this.set(settings.INFO_CARDS, value)}/>
            <span className="label">Theme</span>
            <Dropdown items={themes} selected={currentTheme} onChange={(value: string) => this.setTheme(value.toLowerCase())}/>
          </>}
          {this.state.tab === 1 && <>
            <br/><i>Notifications {notificationStatusText()}.</i><br/><br/>
            <Switch label="Receive Notifications"
                    description="Any notifications"
                    checked={settings.getBool(settings.NOTIFICATIONS)}
                    onChange={(value: boolean) => this.set(settings.NOTIFICATIONS, value)}/>
            <Switch label="Favorite Servers"
                    description="You will receive a notification if one of your favorite servers is online"
                    checked={settings.getBool(settings.SERVER_NOTIFICATIONS)}
                    onChange={(value: boolean) => this.set(settings.SERVER_NOTIFICATIONS, value)}/>
            <Switch label="Friends"
                    description="You will receive a notification if one of your friends is online"
                    checked={settings.getBool(settings.PLAYER_NOTIFICATIONS)}
                    onChange={(value: boolean) => this.set(settings.PLAYER_NOTIFICATIONS, value)}/>
          </>}
          {this.state.tab === 2 && <>
            <h3>Favorite Servers</h3>
            <input type="text" placeholder="Add server by host:port" onKeyUp={(e) => {
              if(e.keyCode === 13){
                favoriteServer(e.currentTarget.value);
                e.currentTarget.value = "";
                this.forceUpdate();
              }
            }}/>
            <div className="list">
              <List
                items={settings.getJson("favoriteServers", []).sort((a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()))}
                increment={37}
                render={(server: string) =>
                  <div key={server} onClick={() => history.push(`/s/${server.split(":")[0]}/${server.split(":")[1]}`)}>
                    <b>{server}</b>
                    <button className="btn icon" onClick={(e) => {
                      e.stopPropagation();
                      favoriteServer(server);
                      this.forceUpdate();
                    }}>{Icon("close")}</button>
                  </div>
                }
              />
            </div>
            <h3>Friends</h3>
            <input type="text" placeholder="Add player by callsign" onKeyUp={(e) => {
              if(e.keyCode === 13){
                friendPlayer(e.currentTarget.value);
                e.currentTarget.value = "";
                this.forceUpdate();
              }
            }}/>
            <div className="list">
              <List
                items={settings.getJson("friends", []).sort((a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()))}
                increment={37}
                render={(callsign: string) =>
                  <div key={callsign}>
                    <b>{callsign}</b>
                    <button className="btn icon" onClick={() => {
                      friendPlayer(callsign);
                      this.forceUpdate();
                    }}>{Icon("close")}</button>
                  </div>
                }
              />
            </div>
            <h3>Hidden Servers</h3>
            <input type="text" placeholder="Add server by host:port" onKeyUp={(e) => {
              if(e.keyCode === 13){
                hideServer(e.currentTarget.value);
                e.currentTarget.value = "";
                this.forceUpdate();
              }
            }}/>
            <div className="list">
              <List
                items={settings.getJson("hiddenServers", []).sort((a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()))}
                increment={37}
                render={(server: string) =>
                  <div key={server} onClick={() => history.push(`/s/${server.split(":")[0]}/${server.split(":")[1]}`)}>
                    <b>{server}</b>
                    <button className="btn icon" onClick={(e) => {
                      e.stopPropagation();
                      hideServer(server);
                      this.forceUpdate();
                    }}>{Icon("close")}</button>
                  </div>
                }
              />
            </div>
          </>}
          {this.state.tab === 3 && <>
            <Switch label="Data Saver"
                    description="Use less network data (can reduce performance)"
                    checked={settings.getBool(settings.DATA_SAVER)}
                    onChange={(value: boolean) => this.set(settings.DATA_SAVER, value)}/>
            <Switch label="Active Servers Only"
                    description="Only get servers with at least 1 player or observer"
                    checked={settings.getBool(settings.ONLY_SERVERS_WITH_PLAYERS)}
                    onChange={(value: boolean) => this.set(settings.ONLY_SERVERS_WITH_PLAYERS, value)}/>
            <Switch label="Disable Real-time Data"
                    description="Don't use real-time data (may save data)"
                    checked={settings.getBool(settings.DISABLE_REALTIME_DATA)}
                    onChange={(value: boolean) => this.set(settings.DISABLE_REALTIME_DATA, value)}/>
            <Switch label="Disable Analytics"
                    description="Don't collect client side analytics"
                    checked={settings.getBool(settings.DISABLE_ANALYTICS)}
                    onChange={(value: boolean) => this.set(settings.DISABLE_ANALYTICS, value)}/>
          </>}
          <div className="btn-list">
            <button className="btn btn-outline" onClick={() => {settings.clear();this.message("Settings cleared");}} aria-label="Reset all settings to default">Reset</button>
            <button className="btn btn-outline" onClick={() => {cache.clear();this.message("Cache cleared");}}>Clear Cache</button>
            <b>{this.state.message}</b>
          </div>
          {user.bzid !== "" && storage.get("syncSettings") !== "false" ? "Synced" : <><Link to="/account">Sign in</Link> to sync</>}.
        </div>
      </div>
    );
  }
}
