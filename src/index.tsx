import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";

import "./index.scss";
import App from "./App";

// import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<BrowserRouter><App/></BrowserRouter>, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();

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
