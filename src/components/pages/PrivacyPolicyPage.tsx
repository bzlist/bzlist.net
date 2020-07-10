import React from "react";
import {Link} from "react-router-dom";

export const PrivacyPolicyPage = (): JSX.Element => (
  /* eslint-disable max-len */
  <div className="wrapper">
    <h1>Privacy Policy</h1>
    <p>This policy is effective as of 2 November 2019.</p>
    <p>Your privacy is important to me. It is BZList's policy to respect your privacy regarding any information I may collect from you across my website, <a href="https://bzlist.net">bzlist.net</a>, and other sites I own and operate.</p>
    <p>My website may link to external sites that are not operated by me. Please be aware that I have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.</p>
    <p>You are free to refuse my request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.</p>
    <p>Your continued use of my website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how I handle user data and personal information, feel free to <a href="https://forums.bzflag.org/ucp.php?i=pm&mode=compose&u=58103" target="_blank" rel="noopener noreferrer">contact me</a>.</p>
    <h2>Personal Information Collected and How it is Used</h2>
    <p>I only ask for personal information when I truly need it to provide a service to you. I collect it by fair and lawful means, with your knowledge and consent.</p>
    <p>I only retain collected information for as long as necessary to provide you with your requested service. What data I store, I’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorised access, disclosure, copying, use or modification.</p>
    <p>Some information collected is stored locally on your computer and not on any server.</p>
    <p>The following information is collected on my servers.</p>
    <ul>
      <li><b>Account</b> - If you sign in with your BZFlag account your callsign, BZID and settings (if chosen).</li>
      <li><b>IP Address and Browser Info</b> - Your IP address and browser info isn't used except for analytics. This is purely for me to know how the site is doing and will not affect any services provided.</li>
      <li><b>Interactions</b> <i>(optional)</i> - Some of your interactions will be saved for analytics. You can disable this in <Link to="/settings/data-usage">Data Usage</Link>.</li>
    </ul>
    <h2>Information Disclosure</h2>
    <p>I don’t share any personally identifying information publicly or with third-parties, except when required to by law.</p>
  </div>
  /* eslint-enable max-len */
);
