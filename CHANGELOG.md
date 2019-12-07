# Changelog

This is an outline and does not contain every change. Check the commits for a full list of changes.

## v0.10.1 - Fixes 🛠 (2019-12-6)

### Added
- "what's new" link to help page

### Changed
- Improved handling of boolean settings

### Fixed
- Icons rendering above mobile nav menu
- List buttons spacing
- Server titles from overflowing
- Settings page errors and warnings
- Warning in Dropdown and Switch components
- Account page token parsing
- Old urls in package.json
- package.json name field
- Settings not syncing properly
- Servers with hidden observers being on top

## v0.10.0 - New Authentication (2019-12-5)

### Added
- Fade in animation to play dialog
- Link to version release on GitHub
- "this minute" to time ago
- Custom scrollbars
- Detect if API is offline
- Custom icons

### Changed
- Primary button shadow is now colored
- Navbar is now a gradient
- Improved hamburger (mobile) menu
- Improved table rendering performance
- Using new authentication system

## v0.9.2 - Hide Servers and More Gradients (2019-11-29)

### Added
- Setting to hide specific servers
- Scroll to top is now smooth
- Version number to help page

### Changed
- Improved README
- Primary button background is now a gradient
- Wording on account sign in is improved
- Replaced checkboxes with switches
- Largest headings color is now a gradient
- Tweaked shadows

### Fixed
- Typo and wording in changelog
- Server details table hover contrast

### Added

## v0.9.1 - Tweaks, Fixes, and More Settings (2019-11-29)

### Added
- Link to changelog in readme
- Scroll to top button on player page
- Hide observers by default and sort them to bottom
- Setting to hide observers from server list player count
- Setting to only get servers with players online
- dns-prefetch for domains
- Team info to server details page

### Changed
- Logo tweaked
- Don't show score for observers
- Compressed icons
- Better hamburger menu
- Theme colors
- Optimized settings
- Don't show players table on server with none online
- Improved navigation drawer
- Updated dependencies
- Tweaked styling

## Removed
- Loading shimmer effect

### Fixed
- Time ago not always updating
- Service worker not always updating
- Unsafe code from TimeAgo component
- Settings not syncing properly

## v0.9.0 - React & tweaks 😮 (2019-11-9)

**NOTE:** This includes a complete(ish) rewrite from Angular to React. Overall it is mostly the same with very few functional changes and some appearience changes. The old version can be found at https://old.bzflag.net/. BZList is also now relicened from GPL-3.0 to MIT.

**Before rewrite.**

### Added
- Support for TWA
- Offline detection
- stylelint for SCSS linting
- Account for syncing settings
- Terms of Service
- Privacy Policy

### Changed
- Updated server card
- Reduced whitespace o server and player pages
- Use shorthand for game-style in server list

### Fixed
- Scrollbar always being present
- Footer not always being on bottom

---

**After rewrite.**

### Added
- Show more button for servers
- Scroll to top button on server list
- Feedback page
- Hamburger menu on mobile
- Detect if API is offline (kinda)

### Changed
- Logo in README
- Tweaks to server details page
- Focus more on important data

## v0.8.0 - Search & new UI 🔍 (2019-10-21)

### Added
- Custom wrapper for Socket.io
- Added option to hide specific servers
- Added search for servers and players
- Use OS theme when one is not selected
- Copy to clipboard button on server page
- Player list server column addded to settings
- Settings reset button

### Changed
- Updated help page
- Shimmer effect when servers are loading
- Updated checkbox
- Dropdown for theme selection
- Redesigned UI

### Fixed
- Build error in settings page
- GitHub icon not changing color with theme
- Navigation bar overflowing on mobile
- Server page header not sticking
- SSR error

## v0.7.0 - Server page redesign ✨ (2019-9-30)

### Added
- Server and player data is now cached
- Remember last sorted field for tables
- Added banner image to server page

### Changed
- GitHub link now goes directly to bzlist.net project
- Removed old account button
- Moved version number to navigation bar
- Adjusted new table hover effect
- New logo
- Updated server page design
- Updated button design
- Updated splashscreen

### Fixed
- Fixed team sorting getting messed up
- Fixed settings page
- Fixed typo in README

## v0.6.0 (2019-9-19)

- Improved service worker
- Use Socket.io instead of Firebase for data
- Improved performance

## v0.5.1 (2019-8-17)

- Improved UI
- Make back button actually go back
- Fixed server list going crazy when updating
- Fixed servers in grid view not being sorted
- Added loading spinner messages
- Added experimental table look
- Added setting to only show servers with players
- Updated footer
- Added version number to help page
- Cleaned up code

## v0.5.0 - Sorting just arrived 📃 (2019-8-6)

- Add midnight theme
- Higher contrast badges
- Add team information to server details page
- Only show button the join teams that exist
- Add sorting to all tables (servers, players, teams)
- Improved security
- Add number of online observers to server list

## v0.4.0 - Players are here! 🦸‍ (2019-7-28)

- Add button to launch BZFlag and join server
- Add dedicated players page
- Don't show player tk column on no tk servers
- Updated to Angular 8 with Ivy (improved performance)
- Add setting to toffle player motto
- Add a few FAQ Q&As
- Performance improvments

## v0.3.4 (2019-6-17)

- Fixed bold text being blurry
- Removed animation when switching pages
- Add back button to server page
- Increased headline font size on mobile
- Disabled checkboxes are now grey
- Improved server list performance

## v0.3.3 (2019-6-15)

- time-ago pipe auto update
- Travis CI build checking
- Custom checkboxes
- Updated look
- Removed Angular Material

## HOTFIX: v0.3.21 (2019-5-7)

- Fix component name `servers` (now `app-servers`) in home page

## v0.3.2 (2019-5-7)

- Added server online/offline status
- Updated footer
- Various slight tweaks to look
- Updated linting configuration

## v0.3.1 (2019-4-30)

- Added server side rendering
- Added Open Graph and Twitter meta tags
- Updated loading screen

## v0.3.0 - User accounts 👨‍💼 (2019-4-23)

- Added meta tags
- Change title on different pages
- Hide server list table column settings when using grid view
- Added user accounts
- Improved responsiveness
- Light and dark theme colors
- Handle tables being compact automatically
- Store settings in local storage instead of cookies
- Updated home page
- Removed dedicated 3rd party licenses page

## v0.2.1 (2019-4-20)

- Hide GitHub button in navigation bar when on mobile
- Use grid view on mobile
- Use ngsw instead of sw-precache
- Updated Badges look
- Improved and responsive server details page
- Updated Help page
- Updated Home page

## v0.2.0 - UX + Dark Mode 🌑 (2019-4-18)

- Added Settings page
- Dark theme/mode
- Grid view
- Major update to how tables look
- Removed old API code
- Removed search box

## v0.1.0 - Fire Update 🔥 (2019-4-17)

- Added `webpack-bundle-analyzer` tool
- Server details on dedicated page
- Real-time information
- Page switching animation
- `package.json` to be more friendly and have more options
- Firebase as backend/database
- Fixed server list sorting not always being correct
- Broke sorting tables

## v0.0.2 (2019-4-16)

- Added logo
- Added GitHub link
- HTTP request error handling
- Time formatting
- Added Loading spinner
- Added Budgets to angular.json
- Changelog
- Updated Look
- Removed Score data for observers
