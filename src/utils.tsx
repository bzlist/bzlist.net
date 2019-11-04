
import React from "react";

import {createBrowserHistory} from "history";

export const history = createBrowserHistory();

export const verboseGameStyle = (value: string): string => {
  // turn the short abbreviation string to the verbose version
  switch(value){
    case "CTF":
      return "Capture The Flag";
    case "FFA":
      return "Free For All";
    case "OFFA":
      return "Open (Teamless) Free For All";
    case "Rabbit":
      return "Rabbit Chase";
    default:
      break;
  }

  return value;
}

export const booleanYesNo = (value: boolean): JSX.Element => {
  // convert boolean value to yes/no with proper class
  return value ? <span className="yes">Yes</span> : <span className="no">No</span>;
}

export const autoPlural = (value: string): string => {
  return value.split(" ")[0] === "1" ? value : `${value}s`;
}
