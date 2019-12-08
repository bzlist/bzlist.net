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
  IconDefs,
  Icon
} from "./components";
import {settings, history, storage, api, parseToken} from "./lib";

interface State{
  offline: boolean;
}

class App extends React.Component<any, State>{
  constructor(props: any){
    super(props);

    this.state = {
      offline: false
    };

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
      const drawerToggle: any = document.querySelector("#drawer-toggle");

      if(drawerToggle && elapsedTime <= allowedTime && Math.abs(touch.pageY - startY) <= 30){
        if(touch.pageX - startX >= threshold){
          drawerToggle.checked = true;
        }else if(touch.pageX + startX >= threshold){
          drawerToggle.checked = false;
        }
      }
    });

    history.listen(() => {
      const drawerToggle: any = document.querySelector("#drawer-toggle");
      if(drawerToggle){
        drawerToggle.checked = false;
      }
    });
  }

  async loadSettings(): Promise<void>{
    let currentTheme = settings.get("theme");
    if(currentTheme === ""){
      currentTheme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      settings.set("theme", currentTheme);
    }
    document.documentElement.setAttribute("data-theme", currentTheme);

    const token = storage.get("token");
    if(storage.get("syncSettings") === "true" && token !== ""){
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
      }
    }else{
      const data = await api("status", undefined, "GET");
      if(!data || !data.online){
        this.setState({offline: true});
      }
    }

    if(settings.getBool(settings.CUSTOM_SCROLLBARS)){
      document.documentElement.classList.add("custom-scrollbars");
    }
  }

  render(): JSX.Element{
    const token = parseToken();

    return (
      <Router history={history}>
        <div className="body">
          {this.state.offline ? <div className="offline">Currently offline.</div> : null}
          <div className="navbar">
            <input type="checkbox" id="drawer-toggle"/>
            <label htmlFor="drawer-toggle" className="btn icon hamburger"></label>
            <Link to="/" className="logo"><svg viewBox="0 0 12.79 3.175" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><defs><linearGradient id="a"><stop stopColor="#6f15af" offset="0"/><stop stopColor="#19a9d2" offset="1"/></linearGradient><linearGradient id="b" x1="69.57" x2="69.83" y1="47" y2="43.83" gradientTransform="translate(-204.6 -137.6) scale(3.163)" gradientUnits="userSpaceOnUse" xlinkHref="#a"/><linearGradient id="c" x1="226" x2="230" y1="180.5" y2="168.5" gradientTransform="matrix(1 0 0 .9999 -222 -168.5)" gradientUnits="userSpaceOnUse" xlinkHref="#a"/></defs><path transform="translate(-.355) scale(.2646)" d="M33.19.996a.67.67 0 00-.494.201.643.643 0 00-.201.47c0 .187.067.348.2.482a.67.67 0 00.495.2.675.675 0 00.496-.2.675.675 0 00.201-.497.6.6 0 00-.2-.455.675.675 0 00-.497-.2zm-17.72.563v.857h6.119l-6.213 7.834v.684h7.686v-.858h-6.359l6.199-7.834V1.56zm9.539 0v9.375h6.24v-.858h-5.25V1.558zm18.01.79v1.54h-1.258v.804h1.258v4.258c0 .652.18 1.157.537 1.514.357.357.865.535 1.525.535.286 0 .558-.04.817-.12.267-.09.49-.215.67-.376l-.335-.683a1.408 1.408 0 01-.482.27 1.69 1.69 0 01-.562.093c-.393 0-.696-.108-.91-.322-.206-.223-.31-.546-.31-.965V4.694h2.144v-.805H43.97V2.35zm-4.637 1.487c-.875 0-1.558.187-2.049.562-.491.375-.736.856-.736 1.445 0 .473.12.844.361 1.111.25.268.55.46.898.576.349.107.808.215 1.38.323.428.071.772.146 1.03.226.26.072.473.184.643.336.17.143.254.343.254.602a.972.972 0 01-.469.857c-.303.196-.777.295-1.42.295-.482 0-.946-.072-1.393-.215a3.709 3.709 0 01-1.11-.576l-.429.75c.295.25.701.46 1.22.629.526.16 1.074.242 1.645.242.911 0 1.62-.178 2.13-.535.517-.366.777-.859.777-1.475 0-.455-.12-.811-.362-1.07s-.532-.442-.87-.549c-.34-.107-.79-.215-1.353-.322-.455-.08-.813-.155-1.072-.227-.259-.08-.477-.2-.656-.361-.17-.16-.254-.377-.254-.645 0-.348.152-.627.455-.841.313-.215.772-.323 1.38-.323.803 0 1.495.2 2.075.602l.414-.762c-.294-.196-.667-.352-1.123-.469a5.148 5.148 0 00-1.367-.187zm-5.672.052v7.045h.951V3.888z" fill="url(#b)"/><path transform="translate(.265 .264) scale(.2206)" d="M5 .001c-.554 0-1 .446-1 1s.446 1 1 1h1c.554 0 1 .446 1 1s-.446 1-1 1H4c-.554 0-1 .446-1 1s.446 1 1 1h3c.554 0 1 .446 1 1 0 .553-.446 1-1 1H3c-.554 0-1 .445-1 1 0 .553.446 1 1 1h1.008c.55 0 .992.442.992.999 0 .557-.442 1-.992 1 0 0 4.6-.002 4.668-.004A3.5 3.5 0 0012 8.5l-.07-.701a3.503 3.503 0 00-.983-1.797A3.5 3.5 0 0012 3.5l-.07-.701a3.501 3.501 0 00-3.518-2.8H8.41zm-5 5C0 5.557.443 6 1 6c.557 0 1-.443 1-1 0-.557-.443-1-1-1-.557 0-1 .443-1 1z" fill="url(#c)"/></svg></Link>
            <span style={{flex: 1}}></span>
            <nav>
              <Link to="/" className="btn">Servers</Link>
              <Link to="/players" className="btn">Players</Link>
              <Link to="/help" className="btn">Help</Link>
              <Link to="/feedback" className="btn">Feedback</Link>
            </nav>
            <a className="btn icon" href="https://github.com/bzlist/bzlist.net" target="_blank" rel="noopener noreferrer">
              {Icon("github", false)}
            </a>
            <Link to="/settings" className="btn icon">{Icon("settings", false)}</Link>
            <Link to="/account" className="btn icon">
            {token && token.bzid ?
              <img src={`https://forums.bzflag.org/download/file.php?avatar=${token.bzid}.png`} height="15"/>
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
        {IconDefs()}
      </Router>
    );
  }
}

export default App;
