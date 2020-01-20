import React from "react";

export const ChangelogPage = (): JSX.Element => (
  /* tslint:disable:max-line-length */
  /* eslint-disable jsx-a11y/accessible-emoji */
  <div className="wrapper">
    <h1>Changelog</h1>
    <p>This is an outline and does not contain every change. Check the commits for a full list of changes.</p>
    <h2>v0.10.5 (2020-1-18)</h2>
    <h3>Added</h3>
    <ul>
      <li>Hover text to add friend button</li>
    </ul>
    <h3>Changed</h3>
    <ul>
      <li>Improved cards (CSS grid)</li>
      <li>Minor tweaks</li>
      <li>Slight speed boost</li>
      <li>Updated splash screen author logo</li>
      <li>Updated copyright</li>
      <li>Shadows</li>
      <li>Background adn navbar are now gradients</li>
    </ul>
    <h3>Removed</h3>
    <ul>
      <li>Fireworks effect</li>
    </ul>
    <h2>v0.10.4 - Happy New Year! 🎆 (2020-1-2)</h2>
    <h3>Added</h3>
    <ul>
      <li>Option to favorite servers</li>
      <li>Sign in link on feedback page if not signed in</li>
      <li>Option to friend players</li>
      <li>Notifications if favorite server or friend is online</li>
      <li>&quot;Paradise Vally&quot; server screenshot</li>
    </ul>
    <h3>Changed</h3>
    <ul>
      <li>Special effect from snow to fireworks</li>
    </ul>
    <h2>v0.10.3 - Snow! ❄ (2019-12-15)</h2>
    <blockquote>
      <p><em>Note: During the development of this version some unused data was removed from the API which required slight tweaks.</em></p>
    </blockquote>
    <h3>Added</h3>
    <ul>
      <li>Max team size to server details</li>
      <li>Snow effect!</li>
    </ul>
    <h3>Changed</h3>
    <ul>
      <li>Updated dependencies</li>
    </ul>
    <h3>Fixed</h3>
    <ul>
      <li>Typos in CHANGELOG</li>
      <li>Wrong license in package.json</li>
      <li>ServerDetailsPage always needing</li>
      <li>Textarea not having border on focues</li>
      <li>Heading space on Terms of Service page</li>
      <li>Button list spacing</li>
    </ul>
    <h2>v0.10.2 (2019-12-13)</h2>
    <blockquote>
      <p><em>Note: During the development of this version a lot of work went into backend performance which helps with frontend performance.</em></p>
    </blockquote>
    <h3>Added</h3>
    <ul>
      <li>Account icon when signed in</li>
      <li>Time until auto logout</li>
      <li>Scroll to top when switching pages</li>
      <li>Auto renew token</li>
      <li>Social media card support (Open Graph protocol)</li>
    </ul>
    <h3>Changed</h3>
    <ul>
      <li>Removed gradient from navbar</li>
      <li>Made table hover a gradient</li>
      <li>Get server status even if syncing settings</li>
    </ul>
    <h3>Fixes</h3>
    <ul>
      <li>Player count going down when ignore observers is on</li>
    </ul>
    <h2>v0.10.1 - Fixes 🛠 (2019-12-6)</h2>
    <h3>Added</h3>
    <ul>
      <li>&quot;what&#39;s new&quot; link to help page</li>
    </ul>
    <h3>Changed</h3>
    <ul>
      <li>Improved handling of boolean settings</li>
    </ul>
    <h3>Fixed</h3>
    <ul>
      <li>Icons rendering above mobile nav menu</li>
      <li>List buttons spacing</li>
      <li>Server titles from overflowing</li>
      <li>Settings page errors and warnings</li>
      <li>Warning in Dropdown and Switch components</li>
      <li>Account page token parsing</li>
      <li>Old urls in package.json</li>
      <li>package.json name field</li>
      <li>Settings not syncing properly</li>
      <li>Servers with hidden observers being on top</li>
    </ul>
    <h2>v0.10.0 - New Authentication (2019-12-5)</h2>
    <h3>Added</h3>
    <ul>
      <li>Fade in animation to play dialog</li>
      <li>Link to version release on GitHub</li>
      <li>&quot;this minute&quot; to time ago</li>
      <li>Custom scrollbars</li>
      <li>Detect if API is offline</li>
      <li>Custom icons</li>
    </ul>
    <h3>Changed</h3>
    <ul>
      <li>Primary button shadow is now colored</li>
      <li>Navbar is now a gradient</li>
      <li>Improved hamburger (mobile) menu</li>
      <li>Improved table rendering performance</li>
      <li>Using new authentication system</li>
    </ul>
    <h2>v0.9.2 - Hide Servers and More Gradients (2019-11-29)</h2>
    <h3>Added</h3>
    <ul>
      <li>Setting to hide specific servers</li>
      <li>Scroll to top is now smooth</li>
      <li>Version number to help page</li>
    </ul>
    <h3>Changed</h3>
    <ul>
      <li>Improved README</li>
      <li>Primary button background is now a gradient</li>
      <li>Wording on account sign in is improved</li>
      <li>Replaced checkboxes with switches</li>
      <li>Largest headings color is now a gradient</li>
      <li>Tweaked shadows</li>
    </ul>
    <h3>Fixed</h3>
    <ul>
      <li>Typo and wording in changelog</li>
      <li>Server details table hover contrast</li>
    </ul>
    <h3>Added</h3>
    <h2>v0.9.1 - Tweaks, Fixes, and More Settings (2019-11-29)</h2>
    <h3>Added</h3>
    <ul>
      <li>Link to changelog in readme</li>
      <li>Scroll to top button on player page</li>
      <li>Hide observers by default and sort them to bottom</li>
      <li>Setting to hide observers from server list player count</li>
      <li>Setting to only get servers with players online</li>
      <li>dns-prefetch for domains</li>
      <li>Team info to server details page</li>
    </ul>
    <h3>Changed</h3>
    <ul>
      <li>Logo tweaked</li>
      <li>Don&#39;t show score for observers</li>
      <li>Compressed icons</li>
      <li>Better hamburger menu</li>
      <li>Theme colors</li>
      <li>Optimized settings</li>
      <li>Don&#39;t show players table on server with none online</li>
      <li>Improved navigation drawer</li>
      <li>Updated dependencies</li>
      <li>Tweaked styling</li>
    </ul>
    <h2>Removed</h2>
    <ul>
     <li>Loading shimmer effect</li>
    </ul>
    <h3>Fixed</h3>
    <ul>
      <li>Time ago not always updating</li>
      <li>Service worker not always updating</li>
      <li>Unsafe code from TimeAgo component</li>
      <li>Settings not syncing properly</li>
    </ul>
    <h2>v0.9.0 - React &amp; tweaks 😮 (2019-11-9)</h2>
    <p><strong>NOTE:</strong> This includes a complete(ish) rewrite from Angular to React. Overall it is mostly the same with very few functional changes and some appearience changes. The old version can be found at <a href="https://old.bzflag.net/">https://old.bzflag.net/</a>. BZList is also now relicened from GPL-3.0 to MIT.</p>
    <p><strong>Before rewrite.</strong></p>
    <h3>Added</h3>
    <ul>
      <li>Support for TWA</li>
      <li>Offline detection</li>
      <li>stylelint for SCSS linting</li>
      <li>Account for syncing settings</li>
      <li>Terms of Service</li>
      <li>Privacy Policy</li>
    </ul>
    <h3>Changed</h3>
    <ul>
      <li>Updated server card</li>
      <li>Reduced whitespace o server and player pages</li>
      <li>Use shorthand for game-style in server list</li>
    </ul>
    <h3>Fixed</h3>
    <ul>
      <li>Scrollbar always being present</li>
      <li>Footer not always being on bottom</li>
    </ul>
    <hr/>
    <p><strong>After rewrite.</strong></p>
    <h3>Added</h3>
    <ul>
      <li>Show more button for servers</li>
      <li>Scroll to top button on server list</li>
      <li>Feedback page</li>
      <li>Hamburger menu on mobile</li>
      <li>Detect if API is offline (kinda)</li>
    </ul>
    <h3>Changed</h3>
    <ul>
      <li>Logo in README</li>
      <li>Tweaks to server details page</li>
      <li>Focus more on important data</li>
    </ul>
    <h2>v0.8.0 - Search &amp; new UI 🔍 (2019-10-21)</h2>
    <h3>Added</h3>
    <ul>
      <li>Custom wrapper for Socket.io</li>
      <li>Added option to hide specific servers</li>
      <li>Added search for servers and players</li>
      <li>Use OS theme when one is not selected</li>
      <li>Copy to clipboard button on server page</li>
      <li>Player list server column addded to settings</li>
      <li>Settings reset button</li>
    </ul>
    <h3>Changed</h3>
    <ul>
      <li>Updated help page</li>
      <li>Shimmer effect when servers are loading</li>
      <li>Updated checkbox</li>
      <li>Dropdown for theme selection</li>
      <li>Redesigned UI</li>
    </ul>
    <h3>Fixed</h3>
    <ul>
      <li>Build error in settings page</li>
      <li>GitHub icon not changing color with theme</li>
      <li>Navigation bar overflowing on mobile</li>
      <li>Server page header not sticking</li>
      <li>SSR error</li>
    </ul>
    <h2>v0.7.0 - Server page redesign ✨ (2019-9-30)</h2>
    <h3>Added</h3>
    <ul>
      <li>Server and player data is now cached</li>
      <li>Remember last sorted field for tables</li>
      <li>Added banner image to server page</li>
    </ul>
    <h3>Changed</h3>
    <ul>
      <li>GitHub link now goes directly to bzlist.net project</li>
      <li>Removed old account button</li>
      <li>Moved version number to navigation bar</li>
      <li>Adjusted new table hover effect</li>
      <li>New logo</li>
      <li>Updated server page design</li>
      <li>Updated button design</li>
      <li>Updated splashscreen</li>
    </ul>
    <h3>Fixed</h3>
    <ul>
      <li>Fixed team sorting getting messed up</li>
      <li>Fixed settings page</li>
      <li>Fixed typo in README</li>
    </ul>
    <h2>v0.6.0 (2019-9-19)</h2>
    <ul>
      <li>Improved service worker</li>
      <li>Use Socket.io instead of Firebase for data</li>
      <li>Improved performance</li>
    </ul>
    <h2>v0.5.1 (2019-8-17)</h2>
    <ul>
      <li>Improved UI</li>
      <li>Make back button actually go back</li>
      <li>Fixed server list going crazy when updating</li>
      <li>Fixed servers in grid view not being sorted</li>
      <li>Added loading spinner messages</li>
      <li>Added experimental table look</li>
      <li>Added setting to only show servers with players</li>
      <li>Updated footer</li>
      <li>Added version number to help page</li>
      <li>Cleaned up code</li>
    </ul>
    <h2>v0.5.0 - Sorting just arrived 📃 (2019-8-6)</h2>
    <ul>
      <li>Add midnight theme</li>
      <li>Higher contrast badges</li>
      <li>Add team information to server details page</li>
      <li>Only show button the join teams that exist</li>
      <li>Add sorting to all tables (servers, players, teams)</li>
      <li>Improved security</li>
      <li>Add number of online observers to server list</li>
    </ul>
    <h2>v0.4.0 - Players are here! 🦸‍ (2019-7-28)</h2>
    <ul>
      <li>Add button to launch BZFlag and join server</li>
      <li>Add dedicated players page</li>
      <li>Don&#39;t show player tk column on no tk servers</li>
      <li>Updated to Angular 8 with Ivy (improved performance)</li>
      <li>Add setting to toffle player motto</li>
      <li>Add a few FAQ Q&amp;As</li>
      <li>Performance improvments</li>
    </ul>
    <h2>v0.3.4 (2019-6-17)</h2>
    <ul>
      <li>Fixed bold text being blurry</li>
      <li>Removed animation when switching pages</li>
      <li>Add back button to server page</li>
      <li>Increased headline font size on mobile</li>
      <li>Disabled checkboxes are now grey</li>
      <li>Improved server list performance</li>
    </ul>
    <h2>v0.3.3 (2019-6-15)</h2>
    <ul>
      <li>time-ago pipe auto update</li>
      <li>Travis CI build checking</li>
      <li>Custom checkboxes</li>
      <li>Updated look</li>
      <li>Removed Angular Material</li>
    </ul>
    <h2>HOTFIX: v0.3.21 (2019-5-7)</h2>
    <ul>
      <li>Fix component name <code>servers</code> (now <code>app-servers</code>) in home page</li>
    </ul>
    <h2>v0.3.2 (2019-5-7)</h2>
    <ul>
      <li>Added server online/offline status</li>
      <li>Updated footer</li>
      <li>Various slight tweaks to look</li>
      <li>Updated linting configuration</li>
    </ul>
    <h2>v0.3.1 (2019-4-30)</h2>
    <ul>
      <li>Added server side rendering</li>
      <li>Added Open Graph and Twitter meta tags</li>
      <li>Updated loading screen</li>
    </ul>
    <h2>v0.3.0 - User accounts 👨‍💼 (2019-4-23)</h2>
    <ul>
      <li>Added meta tags</li>
      <li>Change title on different pages</li>
      <li>Hide server list table column settings when using grid view</li>
      <li>Added user accounts</li>
      <li>Improved responsiveness</li>
      <li>Light and dark theme colors</li>
      <li>Handle tables being compact automatically</li>
      <li>Store settings in local storage instead of cookies</li>
      <li>Updated home page</li>
      <li>Removed dedicated 3rd party licenses page</li>
    </ul>
    <h2>v0.2.1 (2019-4-20)</h2>
    <ul>
      <li>Hide GitHub button in navigation bar when on mobile</li>
      <li>Use grid view on mobile</li>
      <li>Use ngsw instead of sw-precache</li>
      <li>Updated Badges look</li>
      <li>Improved and responsive server details page</li>
      <li>Updated Help page</li>
      <li>Updated Home page</li>
    </ul>
    <h2>v0.2.0 - UX + Dark Mode 🌑 (2019-4-18)</h2>
    <ul>
      <li>Added Settings page</li>
      <li>Dark theme/mode</li>
      <li>Grid view</li>
      <li>Major update to how tables look</li>
      <li>Removed old API code</li>
      <li>Removed search box</li>
    </ul>
    <h2>v0.1.0 - Fire Update 🔥 (2019-4-17)</h2>
    <ul>
      <li>Added <code>webpack-bundle-analyzer</code> tool</li>
      <li>Server details on dedicated page</li>
      <li>Real-time information</li>
      <li>Page switching animation</li>
      <li><code>package.json</code> to be more friendly and have more options</li>
      <li>Firebase as backend/database</li>
      <li>Fixed server list sorting not always being correct</li>
      <li>Broke sorting tables</li>
    </ul>
    <h2>v0.0.2 (2019-4-16)</h2>
    <ul>
      <li>Added logo</li>
      <li>Added GitHub link</li>
      <li>HTTP request error handling</li>
      <li>Time formatting</li>
      <li>Added Loading spinner</li>
      <li>Added Budgets to angular.json</li>
      <li>Changelog</li>
      <li>Updated Look</li>
      <li>Removed Score data for observers</li>
    </ul>
  </div>
  /* eslint-enable jsx-a11y/accessible-emoji */
  /* tslint:enable:max-line-length */
);
