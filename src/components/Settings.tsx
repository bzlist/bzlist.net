import React from "react";

import * as storage from "../storage";
import {Dropdown} from "./Dropdown";

const themes = ["Light", "Dark", "Midnight"];

export class Settings extends React.Component{
  setTheme(value: string): void{
    document.documentElement.setAttribute("data-theme", value);
    storage.setSetting("theme", value);
  }

  render(): JSX.Element{
    let currentTheme = storage.getSetting("theme");
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
      </div>
    );
  }
}