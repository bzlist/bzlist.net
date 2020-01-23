import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";

import "./index.scss";
import App from "./App";
import {api} from "lib";

ReactDOM.render(<BrowserRouter><App/></BrowserRouter>, document.getElementById("root"));

const VAPID_PUBLIC_KEY = "BGc36mF6o5X6TXYF26XejtYFi9Vhq81U-P56V5KgB_2vPOd1Ecd2y0o0KO18kRczlICOHnGXyNbJ693JWMlEmUE";
const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for(let i = 0; i < rawData.length; ++i){
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

// register service worker
if(/*process.env.NODE_ENV === "production" && */"serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/service-worker.js`).then((registration) => {
      if(!navigator.serviceWorker.controller){
        return console.log("no active service worker");
      }

      registration.onupdatefound = () => {
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
      };

      registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      }).then((subscription) => {
        api("push-subscription", {subscription}, "POST");
      });
    });
  });
}
