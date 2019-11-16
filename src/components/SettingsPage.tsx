import React from "react";

import {settings, cache} from "../lib";
import {Dropdown, Checkbox} from ".";

const themes = ["Light", "Dark", "Midnight"];

interface State{
  message: string;
}

export class SettingsPage extends React.Component<any, State>{
  constructor(props: any){
    super(props);

    this.state = {
      message: ""
    };
  }

  setTheme(value: string): void{
    document.documentElement.setAttribute("data-theme", value);
    settings.set("theme", value);
  }

  set(key: string, value: string): void{
    settings.set(key, value);
    this.message("Saved");
  }

  message(message: string): void{
    this.setState({message});
    setTimeout(() => this.setState({message: ""}), 3000);
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
        <h1>Settings</h1><br/>
        <Checkbox label="Compact Tables" checked={settings.get("compactTables") === "true"} onChange={(value: boolean) => this.set("compactTables", value.toString())}/><br/>
        <Checkbox label="Only Get Servers with Players" checked={settings.get("onlyServersWithPlayers") === "true"}
          onChange={(value: boolean) => this.set("onlyServersWithPlayers", value.toString())}/><br/>
        <Checkbox label="Exclude Observers from Player Count" checked={settings.get("excludeObservers") === "true"} onChange={(value: boolean) => this.set("excludeObservers", value.toString())}/><br/>
        <br/>
        <span className="label">Theme</span>
        <Dropdown items={themes} selected={currentTheme} onChange={(value: string) => this.setTheme(value.toLowerCase())}/>
        <p>
          <button className="btn btn-outline" onClick={() => {settings.clear();this.message("Settings cleared");}}>Reset</button>&nbsp;
          <button className="btn btn-outline" onClick={() => {cache.clear();this.message("Cache cleared");}}>Clear Cache</button>&nbsp;
          {this.state.message}
        </p>
      </div>
    );
  }
}
