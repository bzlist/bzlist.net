import React from "react";
import {Router, Route, Switch, Link} from "react-router-dom";
import "./App.scss";

import {
  HomePage,
  PlayerPage,
  PrivacyPolicyPage,
  TermsOfServicePage,
  HelpPage,
  ServerDetailsPage,
  SettingsPage,
  AccountPage,
  FeedbackPage,
  Icon
} from "./components";
import {settings, history, storage, api, parseToken, checkAuth, updateUserCache, user, userChanged} from "./lib";

interface State{
  offline: boolean;
}

class App extends React.PureComponent<any, State>{
  drawerToggleRef: React.RefObject<HTMLInputElement>;

  constructor(props: any){
    super(props);

    this.state = {
      offline: false
    };

    this.drawerToggleRef = React.createRef<HTMLInputElement>();

    document.documentElement.style.setProperty("--animations", settings.getBool(settings.DISABLE_ANIMATIONS) ? "0" : "1");

    updateUserCache();
    checkAuth();
    this.loadSettings();

    window.ononline = () => this.setState({offline: false});
    window.onoffline = () => this.setState({offline: true});

    // swiping
    const touchsurface = document.documentElement,
          threshold = 100, // required min distance traveled to be considered swipe
          allowedTime = 300; // maximum time allowed to travel that distance
    let startX = 0,
        startY = 0,
        startTime = 0;

    touchsurface.addEventListener("touchstart", (e) => {
      const touch = e.changedTouches[0];
      startX = touch.pageX;
      startY = touch.pageY;
      startTime = new Date().getTime();
    });

    touchsurface.addEventListener("touchend", (e) => {
      const touch = e.changedTouches[0];
      const elapsedTime = new Date().getTime() - startTime;

      if(this.drawerToggleRef.current && elapsedTime <= allowedTime && Math.abs(touch.pageY - startY) <= 30){
        if(touch.pageX - startX >= threshold){
          this.drawerToggleRef.current.checked = true;
        }else if(touch.pageX + startX >= threshold){
          this.drawerToggleRef.current.checked = false;
        }
      }
    });

    this.setPageTitle(history.location.pathname);
    history.listen((location: any, action: string) => {
      this.setPageTitle(location.pathname);

      if(this.drawerToggleRef.current){
        this.drawerToggleRef.current.checked = false;
      }

      if(action !== "POP"){
        window.scrollTo(0, 0);
      }
    });
  }

  componentDidMount(): void{
    userChanged.push(() => this.forceUpdate());
  }

  async loadSettings(): Promise<void>{
    let currentTheme = settings.get("theme");
    if(currentTheme === ""){
      currentTheme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      settings.set("theme", currentTheme);
    }
    document.documentElement.setAttribute("data-theme", currentTheme);

    const token = storage.get("token");
    if(storage.get("syncSettings") !== "false" && token !== ""){
      console.log("fetching settings");
      const data = await api("users/settings", undefined, "GET", {
        "Authorization": `Bearer ${token}`
      });

      if(!data){
        this.setState({offline: true});
      }else if(data.error){
        console.error("error getting settings:", data.error);
      }else{
        settings.setData(data);

        if(data.theme && data.theme !== currentTheme){
          document.documentElement.setAttribute("data-theme", data.theme);
        }
        if(data.disableAnimations){
          document.documentElement.style.setProperty("--animations", settings.getBool(settings.DISABLE_ANIMATIONS) ? "0" : "1");
        }
      }
    }

    if(!this.state.offline){
      const data = await api("status", undefined, "GET");
      if(!data || !data.online){
        this.setState({offline: true});
      }
    }

    if(token !== ""){
      const tokenData = parseToken();
      if(tokenData.exp - (Date.now() / 1000) <= 43200){
        const data = await api("users/token/renew", undefined, "GET", {
          "Authorization": `Bearer ${token}`
        });

        if(!data){
          this.setState({offline: true});
        }else if(data.token){
          storage.set("token", data.token);
          updateUserCache();
        }
      }
    }

    if(settings.getBool(settings.CUSTOM_SCROLLBARS)){
      document.documentElement.classList.add("custom-scrollbars");
    }
  }

  setPageTitle(pathname: string): void{
    const path = pathname.slice(1);
    document.title = path === "" ? "BZList" : `${path[0].toUpperCase()}${path.slice(1, path.indexOf("/") === -1 ? undefined : path.indexOf("/"))} - BZList`;
  }

  render(): JSX.Element{
    return (
      <Router history={history}>
        <div className="body">
          {this.state.offline ? <div className="offline">Currently offline.</div> : null}
          <div className="navbar">
            <input type="checkbox" id="drawer-toggle" ref={this.drawerToggleRef}/>
            <label htmlFor="drawer-toggle" className="btn icon hamburger"></label>
            <Link to="/" className="logo">{Icon("logo", true, "url(#a)")}BZList</Link>
            <span style={{flex: 1}}></span>
            <a className="btn btn-primary" href="https://docs.google.com/forms/d/e/1FAIpQLSdHA0q3MjVvRMNozwkUFv4dMDhIA-YFCSyt-97P3Afvsdv1zQ/viewform?usp=sf_link" target="_blank" rel="noopener noreferrer">Survey</a>
            <span style={{flex: 1}}></span>
            <nav>
              <Link to="/" className="btn">Servers</Link>
              <Link to="/players" className="btn">Players</Link>
              <Link to="/help" className="btn">Help</Link>
              <Link to="/feedback" className="btn">Feedback</Link>
            </nav>
            <a className="btn icon" href="https://github.com/bzlist/bzlist.net" target="_blank" rel="noopener noreferrer">{Icon("github", false)}</a>
            <Link to="/settings" className="btn icon">{Icon("settings", false)}</Link>
            <Link to="/account" className="btn icon">
            {user.bzid !== "" ?
              <img src={`https://forums.bzflag.org/download/file.php?avatar=${user.bzid}.png`} height="15" alt="" style={{borderRadius: "2px"}}/>
            :
              Icon("account", false)
            }
            </Link>
          </div>
          <div style={{flex: 1}}>
            <Switch>
              <Route path="/players" component={PlayerPage}/>
              <Route path="/privacy-policy" component={PrivacyPolicyPage}/>
              <Route path="/terms-of-service" component={TermsOfServicePage}/>
              <Route path="/help" component={HelpPage}/>
              <Route path="/s/:address/:port" component={ServerDetailsPage}/>
              <Route path="/settings" component={SettingsPage}/>
              <Route path="/account" component={AccountPage}/>
              <Route path="/feedback" component={FeedbackPage}/>
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
            <div className="copyright">Copyright © 2019-2020 The Noah</div>
          </footer>
        </div>
      </Router>
    );
  }
}

export default App;
