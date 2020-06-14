import React from "react";
import {Link} from "react-router-dom";

import {version} from "../../../package.json";

export const HelpPage = (): JSX.Element => (
  /* tslint:disable:max-line-length */
  <div className="wrapper">
    <h1>Help</h1>
    <p>
      I can be contacted <a href="https://forums.bzflag.org/ucp.php?i=pm&mode=compose&u=58103" target="_blank" rel="noopener noreferrer">here</a> via the BZFlag Forums.
      You can also submit <Link to="/feedback">feedback</Link> directly.
    </p>
    <p>
      Check the status page <a href="https://bzlist.statuspage.io/" target="_blank" rel="noopener noreferrer">here</a>.
    </p>
    <h2>FAQ</h2>
    <p>
      <span className="label">What happened to "real-time?"</span><br/>
      Well, I'm getting there. It's a lot harder then it seems, and I will continue to work hard on it until it's finished.<br/><br/>
      <span className="label">How do I see details about a server?</span><br/>
      Click/tap on it and you will be brought to it's page. You can also manually go there by visiting bzlist.net/s/<b>HOSTNAME</b>/<b>PORT</b>.<br/><br/>
      <span className="label">How do I get back to the home page?</span><br/>
      If on desktop, there is a button in the header labled "Servers." On mobile and desktop the BZList logo will also take you back to the home page.<br/><br/>
      <span className="label">When chosing a team after clicking PLAY nothing happens.</span><br/>
      You must install <a href="https://github.com/The-Noah/bzflag-launcher" target="_blank" rel="noopener noreferrer">BZFlag Launcher</a>, however it is currently only supported on Windows.<br/><br/>
      <span className="label">Data doesn't seem to be updating.</span><br/>
      If the API had to restart (due to an error or update) then refreshing the page should fix it. Also data won't automatically update if you turned it off in <Link to="/settings/data-usage">settings</Link>. If you continue to experience issues contact me.
    </p>
    <p><small>Release version <a href={`https://github.com/bzlist/bzlist.net/releases/tag/v${version}`} target="_blank" rel="noopener noreferrer">v{version}</a> See <a href={`https://github.com/bzlist/bzlist.net/compare/v${version}...master`} target="_blank" rel="noopener noreferrer">what's new</a>.</small></p>
  </div>
  /* tslint:enable:max-line-length */
);
