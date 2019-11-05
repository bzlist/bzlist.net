import React from "react";

import {settings, cache} from "../lib";
import {Dropdown} from "./Dropdown";

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
        <span className="label">Theme</span>
        <Dropdown items={themes} selected={currentTheme} onChange={(value: string) => this.setTheme(value.toLowerCase())}/>
        <p>
          <button className="btn outline" onClick={() => {settings.clear();this.setState({message:"Settings cleared"});}}>Reset</button>
          <button className="btn outline" onClick={() => {cache.clear();this.setState({message:"Cache cleared"});}}>Clear Cache</button>
        </p>
        {this.state.message ?
          <p>{this.state.message}.</p>
        : null}
      </div>
    );
  }
}
