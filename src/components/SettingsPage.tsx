import React from "react";

import {settings, cache, IBoolSetting} from "../lib";
import {Dropdown, Switch} from ".";

const themes = ["Light", "Dark", "Midnight"];

interface State{
  message: string;
}

export class SettingsPage extends React.Component<any, State>{
  messageTimeout: any;

  constructor(props: any){
    super(props);

    this.state = {
      message: ""
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

  render(): JSX.Element{
    let currentTheme = settings.get("theme");
    if(currentTheme === ""){
      currentTheme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      this.setTheme(currentTheme);
    }
    currentTheme = currentTheme[0].toUpperCase() + currentTheme.slice(1);

    return (
      <div className="wrapper">
        <h1>Settings</h1><br/><br/>
        <div>
          <Switch label="Compact Tables"
                  description="Reduce the height of table rows to fit more on the screen at once"
                  checked={settings.getBool(settings.COMPACT_TABLES)}
                  onChange={(value: boolean) => this.set(settings.COMPACT_TABLES, value)}/><br/>
          <Switch label="Active Servers Only"
                  description="Only get servers with at least 1 player or observer"
                  checked={settings.getBool(settings.ONLY_SERVERS_WITH_PLAYERS)}
                  onChange={(value: boolean) => this.set(settings.ONLY_SERVERS_WITH_PLAYERS, value)}/><br/>
          <Switch label="Ignore Online Observers"
                  description="Don't treat observers as players on the server list"
                  checked={settings.getBool(settings.EXCLUDE_OBSERVERS)}
                  onChange={(value: boolean) => this.set(settings.EXCLUDE_OBSERVERS, value)}/><br/>
          <Switch label="Custom Scrollbars"
                  description="Use custom scrollbars instead of the default ones"
                  checked={settings.getBool(settings.CUSTOM_SCROLLBARS)}
                  onChange={(value: boolean) => this.set(settings.CUSTOM_SCROLLBARS, value)}/>
        </div>
        <span className="label">Theme</span>
        <Dropdown items={themes} selected={currentTheme} onChange={(value: string) => this.setTheme(value.toLowerCase())}/><br/>
        <div className="btn-list">
          <button className="btn btn-outline" onClick={() => {settings.clear();this.message("Settings cleared");}}>Reset</button>
          <button className="btn btn-outline" onClick={() => {cache.clear();this.message("Cache cleared");}}>Clear Cache</button>
          <b>{this.state.message}</b>
        </div>
      </div>
    );
  }
}
