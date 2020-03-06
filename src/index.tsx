import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";

import "./index.scss";
import App from "./App";

ReactDOM.render(<BrowserRouter><App/></BrowserRouter>, document.getElementById("root"));

console.log("%cHang On!", "font-size: 56px");
console.log("%cThis place is dangerous, unless you understand exactly what you are doing, close this window and stay safe.", "font-size: 20px");
console.log("%cIf you do understand what you are doing, you should come help out! https://github.com/bzlist/bzlist.net", "font-size: 20px");

// register service worker
if(process.env.NODE_ENV === "production" && "serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/service-worker.js`).then((registration) => registration.onupdatefound = () => {
      const installingWorker = registration.installing;
      if(!installingWorker){
        return;
      }

      installingWorker.onstatechange = () => {
        if(installingWorker.state === "installed"){
          if(navigator.serviceWorker.controller){
            console.log("an update is available; please refresh");
            window.location.reload();
          }else{
            console.log("content is cached for offline use");
          }
        }
      };
    });
  });
}
