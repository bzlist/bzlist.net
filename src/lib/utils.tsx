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
};

export const booleanYesNo = (value: boolean): JSX.Element => {
  // convert boolean value to yes/no with proper class
  return value ? <span className="yes">Yes</span> : <span className="no">No</span>;
};

export const autoPlural = (value: string): string => {
  return value.split(" ")[0] === "1" ? value : `${value}s`;
};

export const api =  async (endpoint: string, body: any = undefined, method = "POST", headers: any = {}): Promise<any> => {
  return fetch(`https://api.bzlist.net/${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    method,
    body: body !== undefined ? JSON.stringify(body) : undefined
  }).then((res: Response) => res.json()).catch(console.error);
};

let _bzLoginURL;
if(process.env.NODE_ENV === "production"){
  _bzLoginURL = "https://my.bzflag.org/weblogin.php?action=weblogin&url=https%3A%2F%2Fbzlist.net%2Faccount%3Fusername%3D%25USERNAME%25%26token%3D%25TOKEN%25";
}else{
  _bzLoginURL = "https://my.bzflag.org/weblogin.php?action=weblogin&url=http%3A%2F%2Flocalhost%3A3000%2Faccount%3Fusername%3D%25USERNAME%25%26token%3D%25TOKEN%25";
}
export const bzLoginURL = _bzLoginURL;
