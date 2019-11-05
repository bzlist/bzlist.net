import React from "react";

export const HelpPage = (): JSX.Element => (
  <div className="wrapper">
    <h1>Help</h1>
    <p>I can be contacted <a href="https://forums.bzflag.org/ucp.php?i=pm&mode=compose&u=58103" target="_blank" rel="noopener noreferrer">here</a> via the BZFlag Forums.</p><br/>
    <h2>FAQ</h2>
    <p>
      <span className="label">How do I see details about a server?</span><br/>
      Click/tap on it and you will be brought to it's page. You can also manually go there by visiting bzlist.net/s/<b>HOSTNAME</b>/<b>PORT</b>.<br/><br/>
      <span className="label">How do I get back to the home page?</span><br/>
      If on desktop, there is a button in the header labled "Servers." On mobile and desktop the BZList logo will also take you back to the home page.<br/><br/>
      <span className="label">When chosing a team after clicking PLAY nothing happens.</span><br/>
      You must install <a href="https://github.com/The-Noah/bzflag-launcher" target="_blank" rel="noopener noreferrer">BZFlag Launcher</a>, however it is currently only supported on Windows.<br/><br/>
      <span className="label">Data doesn't seem to be updating.</span><br/>
      If the API had to restart (due to an error or update) then refreshing the page should fix it. If you continue to experience issues contact me.
    </p>
  </div>
);
