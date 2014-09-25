---
module: utils
itsaclassname:
version: 0.0.1
modulesize: 1.09
dependencies:
maintainer: Marco Asbreuk
title: Utility functions
intro: "Small set of handy utility functions that is used at several ITSA modules."
firstpar: get-started
---

#The Basics#

The utility functions are all exported and accessable by their name. In ITSA-namespace, they are available as functions of ITSA.

##The utility functions##

###ITSA.async###

Executes a function asynchronously, by placing it at the javascript eventstack.

```js
ITSA.async(function() {
    // do something
});
```

###ITSA.later###

Executes a function asynchronously after a specific amount of time. It's alike `setTimeout` combined with `setInterval`, only those are buggy in some environments when you cancel the process. `ITSA.later` is proven to work stable and returns a handler with a `cancel`-method to cancel the request.

```js
ITSA.later(function() {
    // do something after 2 seconds
}, 2000);
```

```js
ITSA.later(function() {
    // do something periodic at 2 seconds
}, 2000, true);
```

```js
ITSA.later(function() {
    // do something after 2 seconds, then periodic at 5 seconds
}, 2000, 5000);
```

```js
var handler = ITSA.later(function() {
    // try to do something, but is happens to be canceled...
}, 2000);

handler.cancel();
```

###ITSA.idGenerator###

Generator of unique id's. Can be prepended with a namespace. Will start with 1, but you can pass any value as start-value. Any following generator will start up from its last value.

```js
ITSA.idGenerator(); // --> 1
ITSA.idGenerator(); // --> 2
ITSA.idGenerator(50); // --> 50
ITSA.idGenerator(); // --> 51
```

```js
ITSA.idGenerator('jsonp'); // --> 'jsonp1'
ITSA.idGenerator('itsa', 10); // --> 'itsa10'
ITSA.idGenerator(50); // --> 50

ITSA.idGenerator('jsonp'); // --> 'jsonp2'
ITSA.idGenerator('itsa', 10); // --> 'itsa11'
ITSA.idGenerator(50); // --> 51
```
