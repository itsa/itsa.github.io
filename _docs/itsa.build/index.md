---
module: itsa.build
version: 0.0.2
modulesize: 25.45
dependencies: "all ITSA-modules, hammerjs (npm), ypromise (npm), xmldom (npm), querystring (npm)"
maintainer: Marco Asbreuk
title: Root of the standard distribution
intro: "The itsa.build module provides the main root `ITSA` namespace and aggregates all the modules that make for the standard distribution of ITSA"
firstpar: get-started-itsa
---
#The Basics#

To provide a convenient starting point for the usage of ITSA, we have created a standard distribution that collects the main resources of ITSA into one package and makes their methods accessible under the `ITSA` global namespace.

Though many applications can benefit from using the standard distribution, ITSA is not a monolithic framework.  Its separate modules can be combined in multiple ways. All of the modules are self-contained and take care of their own dependencies and make no reference to the global `ITSA` namespaced provided by this aggregator.

The standard distribution is packed into a bundle (`itsabuild-min.js`) using [Browserify](http://browserify.org/) and can be loaded in a single script-tag.

Some of the modules-export are functions which expect a `window` argument to be passed. Being designed to work both in the client and the server, these modules expect to receive the window by argument.

The standard distribution `itsa.build` contains a minimal `window emulator` when used in a non-browser environment like nodejs.

The aggregator is wrapped in this function:

```js
(function (window) {

    // window available for those modules who need it

})(global.window || require('node-win')());
```

Browserify creates `global.window` as reference to the browser's window. None of these are mandatory, the developer is free to use other Common-JS module bundler or DOM emulator to pass through the modules themselve.

Note that our window-emulator is not a full featured one. ITSA makes use of a very small number of window and DOM methods: `node-win` provides only those that are needed by ITSA-modules. Browsers will use their native window-object instead of `node-win`.