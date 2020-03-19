import React from "react";
import {Router, Route, Switch, Link, NavLink} from "react-router-dom";
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
import {settings, history, storage, api, checkAuth, updateUserCache, user, userChanged, authHeaders} from "./lib";
import {onUpdateFound} from "index";

interface State{
  offline: boolean;
  updateAvailable: boolean;
}

class App extends React.PureComponent<any, State>{
  drawerToggleRef: React.RefObject<HTMLInputElement>;

  constructor(props: any){
    super(props);

    this.state = {
      offline: false,
      updateAvailable: false
    };

    this.drawerToggleRef = React.createRef<HTMLInputElement>();

    document.documentElement.style.setProperty("--animations", settings.getBool(settings.DISABLE_ANIMATIONS) ? "0" : "1");

    updateUserCache();
    checkAuth();
    this.loadSettings();

    window.ononline = () => this.setState({offline: false});
    window.onoffline = () => this.setState({offline: true});

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
    onUpdateFound.push(() => this.setState({updateAvailable: true}));
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
        ...(await authHeaders())
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
          <nav className="navbar">
            <Link to="/">
              <span className="icon">{Icon("logo", false)}</span>
              <span>BZList</span>
            </Link>
            {this.state.updateAvailable && <a href="/" onClick={() => window.location.reload()}>
              <span className="icon">{Icon("update", true, "url(#a)")}</span>
              <span>Update Ready!</span>
            </a>}
            <NavLink activeClassName="active" to="/" exact>
              <span className="icon">{Icon("servers")}</span>
              <span>Servers</span>
            </NavLink>
            <NavLink activeClassName="active" to="/players">
              <span className="icon">{Icon("players")}</span>
              <span>Players</span>
            </NavLink>
            <NavLink activeClassName="active" to="/help">
              <span className="icon">{Icon("help")}</span>
              <span>Help</span>
            </NavLink>
            <NavLink activeClassName="active" to="/feedback">
              <span className="icon">{Icon("feedback")}</span>
              <span>Send Feedback</span>
            </NavLink>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSdHA0q3MjVvRMNozwkUFv4dMDhIA-YFCSyt-97P3Afvsdv1zQ/viewform?usp=sf_link" target="_blank" rel="noopener noreferrer">
              <span className="icon">{Icon("survey")}</span>
              <span>Survey</span>
            </a>
            <a href="https://github.com/bzlist/bzlist.net" target="_blank" rel="noopener noreferrer">
              <span className="icon">{Icon("github")}</span>
              <span>GitHub</span>
            </a>
            <NavLink activeClassName="active" to="/settings">
              <span className="icon">{Icon("settings")}</span>
              <span>Settings</span>
            </NavLink>
            <NavLink activeClassName="active" to="/account">
              <span className="icon">
                {user.bzid !== "" ?
                  <img src={`https://forums.bzflag.org/download/file.php?avatar=${user.bzid}.png`} height="15" alt="" style={{borderRadius: "2px"}}/>
                :
                  Icon("account")
                }
              </span>
              <span>Account</span>
            </NavLink>
          </nav>
          <div className="main">
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
