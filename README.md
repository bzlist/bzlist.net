# BZList

[![GitHub license](https://img.shields.io/github/license/bzlist/bzlist.net.svg)](https://github.com/bzlist/bzlist.net/blob/master/LICENSE)
![GitHub package.json version](https://img.shields.io/github/package-json/v/bzlist/bzlist.net)
[![Build Status](https://travis-ci.org/bzlist/bzlist.net.svg?branch=master)](https://travis-ci.org/bzlist/bzlist.net)
[![IRC #bzlist](https://img.shields.io/badge/IRC-%23bzlist-blue.svg)](http://webchat.freenode.net/?channels=#bzlist)

Socket.io + React = *(kind of)* real-time server stats for BZFlag.

The app is running at [bzlist.net](https://bzlist.net). The origonal version was writtin using Angular, and can be found [here](https://github.com/bzlist/bzlist.net-old).

## Get started

It's easy to get started, just follow the few steps below.

### Get the code

You can get the code by either cloning the reposity (which is recommended) or downloading it as a ZIP file.

To clone the repository run the following (you must have Git installed).
```sh
git clone https://github.com/bzlist/bzlist.net.git
cd bzlist.net
```

The ZIP file can be found at https://github.com/bzlist/bzlist.net/archive/master.zip.

### Install npm packages

Install the `npm` packages and verify everything is working:

```sh
npm install
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br/>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br/>
You will also see any lint errors in the console.

### `npm run lint`

Lints the TypeScript and SCSS files in `src`.

### `npm run build`

Builds the app for production to the `build` folder.<br/>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br/>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.