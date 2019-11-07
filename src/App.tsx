import React from "react";
import {Router, Route, Switch, Link} from "react-router-dom";
import "./App.scss";

import {HomePage, PlayerPage, PrivacyPolicyPage, TermsOfServicePage, HelpPage, ServerDetailsPage, SettingsPage, AccountPage} from "./components";
import {settings, history, storage, api} from "./lib";

class App extends React.Component{
  constructor(props: any){
    super(props);

    this.loadSettings();
  }

  async loadSettings(): Promise<void>{
    if(storage.get("syncSettings") === "true"){
      const callsign = storage.get("callsign");
      const token = storage.get("token");

      if(callsign !== "" && token !== ""){
        console.log("fetching settings");
        const data = await api("settings", {callsign, token});

        if(data.error){
          console.error("error getting settings:", data.error);
        }else{
          settings.clear();
          settings.setData(data);
        }
      }
    }

    let currentTheme = settings.get("theme");
    if(currentTheme === ""){
      currentTheme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      settings.set("theme", currentTheme);
    }
    document.documentElement.setAttribute("data-theme", currentTheme);
  }

  render(): JSX.Element{
    return (
      <Router history={history}>
        <div className="body">
          <div className="navbar">
            <Link to="/" className="logo"><svg viewBox="0 0 12.79 3.175" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><defs><linearGradient id="linearGradient10622" x1="227" x2="234" y1="180.5" y2="168.5" gradientTransform="matrix(.2646 0 0 .2646 7.144 -.7937)" gradientUnits="userSpaceOnUse" xlinkHref="#linearGradient1556"/><linearGradient id="linearGradient1556"><stop stopColor="#6f15af" offset="0"/><stop stopColor="#19a9d2" offset="1"/></linearGradient><linearGradient id="linearGradient10634" x1="73.72" x2="74.25" y1="46.99" y2="44.08" gradientTransform="translate(.09553 -.01933)" gradientUnits="userSpaceOnUse" xlinkHref="#linearGradient1556"/></defs><g transform="translate(-65.88 -43.79)"><path d="m67.2 43.79c-0.1466 0-0.2646 0.118-0.2646 0.2646s0.118 0.2646 0.2646 0.2646h0.2646c0.1466 0 0.2646 0.118 0.2646 0.2646s-0.118 0.2646-0.2646 0.2646h-0.5292c-0.1466 0-0.2646 0.118-0.2646 0.2646 0 0.1466 0.118 0.2646 0.2646 0.2646h0.5292c0.0042 0 0.0077-0.0024 0.01189-0.0026a0.926 0.926 0 0 0 0.0021 0.0021 0.926 0.926 0 0 0-5.16e-4 5.16e-4h0.2511c0.1466 0 0.2646 0.118 0.2646 0.2646s-0.118 0.2646-0.2646 0.2646h-1.058c-0.1466 0-0.2646 0.118-0.2646 0.2646s0.118 0.2646 0.2646 0.2646h0.2666c0.1454 0 0.2625 0.1171 0.2625 0.2625v0.0041c0 0.1454-0.1171 0.2625-0.2625 0.2625h1.178c0.0011 0 2e-3 -5.03e-4 0.0031-5.16e-4a0.926 0.926 0 0 0 0.05374-5.19e-4 0.926 0.926 0 0 0 0.8795-0.925l-0.0186-0.1855a0.926 0.926 0 0 0-0.2599-0.4754 0.926 0.926 0 0 0 0.2785-0.662l-0.0186-0.1855a0.926 0.926 0 0 0-0.9307-0.7405 0.926 0.926 0 0 0-5.16e-4 0h-0.2688zm-1.06 1.058c-0.1454 0-0.2625 0.1171-0.2625 0.2625v0.0041c0 0.1454 0.1171 0.2625 0.2625 0.2625h0.0041c0.1454 0 0.2625-0.1171 0.2625-0.2625v-0.0041c0-0.1454-0.1171-0.2625-0.2625-0.2625zm0.4268 1.608c-0.03156 0.01331-0.05993 0.03246-0.08372 0.05633 0.02373-0.02372 0.05229-0.04308 0.08372-0.05633z" fill="url(#linearGradient10622)"/><g fill="url(#linearGradient10634)" strokeWidth=".2646" aria-label="ZList"><path d="m70.05 46.6h1.722v0.3245h-2.191v-0.2977l1.65-2.385h-1.623v-0.3266h2.098v0.2915z"/><path d="m72.69 46.6h1.426v0.3245h-1.825v-3.01h0.3989z"/><path d="m74.93 46.93h-0.3824v-2.237h0.3824zm-0.4134-2.83q0-0.09302 0.05581-0.1571 0.05788-0.06408 0.1695-0.06408 0.1116 0 0.1695 0.06408 0.05788 0.06408 0.05788 0.1571 0 0.09302-0.05788 0.155t-0.1695 0.06201q-0.1116 0-0.1695-0.06201-0.05581-0.06201-0.05581-0.155z"/><path d="m76.84 46.33q0-0.155-0.1178-0.2398-0.1158-0.08682-0.4072-0.1488-0.2894-0.06201-0.461-0.1488-0.1695-0.08682-0.2522-0.2067-0.08062-0.1199-0.08062-0.2853 0-0.2749 0.2315-0.4651 0.2336-0.1902 0.5953-0.1902 0.3803 0 0.616 0.1964 0.2377 0.1964 0.2377 0.5023h-0.3845q0-0.1571-0.1344-0.2708-0.1323-0.1137-0.3349-0.1137-0.2088 0-0.3266 0.09095-0.1178 0.09095-0.1178 0.2377 0 0.1385 0.1096 0.2088t0.3948 0.1344q0.2873 0.06408 0.4651 0.153 0.1778 0.08888 0.2625 0.215 0.08682 0.124 0.08682 0.3039 0 0.2997-0.2398 0.4816-0.2398 0.1798-0.6222 0.1798-0.2687 0-0.4754-0.09508-0.2067-0.09508-0.3245-0.2646-0.1158-0.1716-0.1158-0.37h0.3824q0.01033 0.1922 0.153 0.3059 0.1447 0.1116 0.3803 0.1116 0.217 0 0.3473-0.08682 0.1323-0.08888 0.1323-0.2356z"/><path d="m78.24 44.15v0.5416h0.4175v0.2956h-0.4175v1.387q0 0.1344 0.05581 0.2026 0.05581 0.06615 0.1902 0.06615 0.06615 0 0.1819-0.02481v0.3101q-0.1509 0.04134-0.2935 0.04134-0.2563 0-0.3865-0.155-0.1302-0.155-0.1302-0.4403v-1.387h-0.4072v-0.2956h0.4072v-0.5416z"/></g></g></svg></Link>
            <span style={{flex: 1}}></span>
            <nav>
              <Link to="/" className="btn mobile-hide">Servers</Link>
              <Link to="/players" className="btn">Players</Link>
              <Link to="/help" className="btn">Help</Link>
            </nav>
            <a className="btn icon" href="https://github.com/bzlist/bzlist.net" target="_blank" rel="noopener noreferrer">
              <svg height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </a>
            <Link to="/settings" className="btn icon">&#xE115;</Link>
            <Link to="/account" className="btn icon">&#xE77B;</Link>
          </div>
          <div style={{flex: 1}}>
            <Switch>
              <Route path="/players" component={PlayerPage}/>
              <Route path="/privacy-policy" component={PrivacyPolicyPage}/>
              <Route path="/terms-of-service" component={TermsOfServicePage}/>
              <Route path="/Help" component={HelpPage}/>
              <Route path="/s/:address/:port" component={ServerDetailsPage}/>
              <Route path="/settings" component={SettingsPage}/>
              <Route path="/account" component={AccountPage}/>
              <Route path="/" component={HomePage}/>
            </Switch>
          </div>
          <footer>
            <div className="links">
              <a href="https://github.com/bzlist/bzlist.net" target="_blank" rel="noopener noreferrer">GitHub</a> •&nbsp;
              <a href="https://github.com/gosquared/flags/blob/master/LICENSE.txt" target="_blank" rel="noopener noreferrer">GoSquared's Flags License</a> •&nbsp;
              <Link to="/terms-of-service">Terms of Service</Link> •&nbsp;
              <Link to="/privacy-policy">Privacy Policy</Link>
            </div>
            <div className="copyright">Copyright &copy; 2019 The Noah</div>
          </footer>
        </div>
      </Router>
    );
  }
}

export default App;
