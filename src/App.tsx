import React from "react";
import {Router, Route, Switch, Link} from "react-router-dom";
import "./App.scss";

import {HomePage, PlayerPage, PrivacyPolicyPage, TermsOfServicePage, HelpPage, ServerDetailsPage, SettingsPage, AccountPage, FeedbackPage} from "./components";
import {settings, history, storage, api} from "./lib";

interface State{
  offline: boolean;
  showHamburgerMenu: boolean;
}

class App extends React.Component<any, State>{
  constructor(props: any){
    super(props);

    this.state = {
      offline: false,
      showHamburgerMenu: false
    };

    this.loadSettings();

    window.ononline = () => this.setState({offline: false});
    window.onoffline = () => this.setState({offline: true});
  }

  async loadSettings(): Promise<void>{
    if(storage.get("syncSettings") === "true"){
      const callsign = storage.get("callsign");
      const token = storage.get("token");

      if(callsign !== "" && token !== ""){
        console.log("fetching settings");
        const data = await api("users/settings", {callsign, token});

        if(!data){
          this.setState({offline: true});
        }else if(data.error){
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
          {this.state.offline ?
            <div className="offline">Currently offline.</div>
          : null}
          <div className="navbar">
            <button className="btn icon hamburger" onClick={() => this.setState({showHamburgerMenu: !this.state.showHamburgerMenu})}>&#xE700;</button>
            <Link to="/" className="logo"><svg viewBox="0 0 12.79 3.175" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="b" x1="227" x2="234" y1="180.5" y2="168.5" gradientTransform="translate(7.144 -.794) scale(.2646)" gradientUnits="userSpaceOnUse" xlinkHref="#a"/><linearGradient id="a"><stop stopColor="#6f15af" offset="0"/><stop stopColor="#19a9d2" offset="1"/></linearGradient><linearGradient id="c" x1="73.72" x2="74.25" y1="46.99" y2="44.08" gradientTransform="translate(.096 -.02)" gradientUnits="userSpaceOnUse" xlinkHref="#a"/></defs><path d="M67.2 43.79a.264.264 0 100 .53h.265a.264.264 0 110 .528h-.53a.264.264 0 100 .53h.53c.004 0 .007-.003.011-.003a.926.926 0 00.003.002h.25a.264.264 0 110 .53h-1.058a.264.264 0 100 .529h.267c.145 0 .262.117.262.263v.004a.262.262 0 01-.262.262H68.119a.926.926 0 00.054 0 .926.926 0 00.88-.926l-.02-.185a.926.926 0 00-.26-.476.926.926 0 00.28-.662l-.02-.185a.926.926 0 00-.93-.74h-.27zm-1.06 1.058a.262.262 0 00-.263.263v.004c0 .145.118.262.263.262h.004a.262.262 0 00.263-.262v-.004a.262.262 0 00-.263-.263zm.427 1.608z" fill="url(#b)" transform="translate(-65.88 -43.79)"/><path d="M70.05 46.6h1.722v.325h-2.191v-.298l1.65-2.385h-1.623v-.327h2.098v.292zM72.69 46.6h1.426v.325h-1.825v-3.01h.399zM74.93 46.93h-.382v-2.237h.382zm-.413-2.83q0-.093.055-.157.058-.064.17-.064.112 0 .17.064.057.064.057.157t-.058.155-.17.062q-.11 0-.169-.062-.055-.062-.055-.155zM76.84 46.33q0-.155-.118-.24-.116-.087-.407-.149-.29-.062-.461-.148-.17-.087-.252-.207-.08-.12-.08-.285 0-.275.23-.466.234-.19.596-.19.38 0 .616.197.238.196.238.502h-.385q0-.157-.134-.27-.133-.115-.335-.115-.209 0-.327.091-.118.091-.118.238 0 .139.11.209t.395.134q.287.064.465.153.178.09.262.215.087.124.087.304 0 .3-.24.482-.24.18-.622.18-.268 0-.475-.095-.207-.096-.325-.265-.115-.172-.115-.37h.382q.01.192.153.306.145.111.38.111.217 0 .348-.086.132-.09.132-.236zM78.24 44.15v.542h.417v.295h-.417v1.387q0 .135.056.203.056.066.19.066.066 0 .182-.025v.31q-.151.042-.294.042-.256 0-.386-.155t-.13-.44v-1.388h-.407v-.295h.407v-.542z" fill="url(#c)" transform="translate(-65.88 -43.79)"/></svg></Link>
            <span style={{flex: 1}}></span>
            <nav className={this.state.showHamburgerMenu ? "visible" : ""}>
              <Link to="/" className="btn">Servers</Link>
              <Link to="/players" className="btn">Players</Link>
              <Link to="/help" className="btn">Help</Link>
              <Link to="/feedback" className="btn">Feedback</Link>
            </nav>
            <a className="btn icon" href="https://github.com/bzlist/bzlist.net" target="_blank" rel="noopener noreferrer">
              <svg height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </a>
            <Link to="/settings" className="btn icon">&#xE115;</Link>
            <Link to="/account" className="btn icon">&#xE77B;</Link>
          </div>
          <div style={{flex: 1}} onClick={() => this.setState({showHamburgerMenu: false})}>
            <Switch>
              <Route path="/players" component={PlayerPage}/>
              <Route path="/privacy-policy" component={PrivacyPolicyPage}/>
              <Route path="/terms-of-service" component={TermsOfServicePage}/>
              <Route path="/Help" component={HelpPage}/>
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
            <div className="copyright">Copyright &copy; 2019 The Noah</div>
          </footer>
        </div>
      </Router>
    );
  }
}

export default App;
