---
module: js-ext
functionality: Observers
itsaclassname:
version: 0.0.1
modulesize: 1.69
dependencies: "polyfill"
maintainer: Marco Asbreuk
title: Observers add simple observing for changes to objects and arrays. The observation is done deep (nested).
intro: "Using Classes in a very flexible and easy way."
firstpar: get-started
---



#The Basics#

Observing changes to objects or arrays could be done with ES6's `Object.observe` and `Array.observe`. These are static methods with the disadvantage observing only its direct members: not deep. Also, not all browsers support these ES feature yet.

This module adds teh methods `object.observe`, `object.unobserve`, `array.observe` and `array.unobserve` to the prototype of Object and Array. The observers are observing deep and uses a polyfill for browsers that don't support Object.observe and Array.observe natively.

When observing, you create an observer. When you stop observing, you allways need to `unobserve` to free occupied memory. Also, unobserving needs the same callback-reference as which is used by starting observing. The callback comes with one argument: the object/array-instance that is being observed.


####Example observing####
```js
var model = {},
    callbackFn;

callbackFn = function(item) {
    // `item` equals the bound model
    alert('model is changed');
};

// start observing:
model.observe(callbackFn);

model.dummy = 10; // --> will invoke `callbackFn` with `this` === model
```

####Example unobserving####
```js
var model = {},
    callbackFn;

callbackFn = function(item) {
    // `item` equals the bound model
    alert('model is changed');
};

// start observing:
model.observe(callbackFn);

model.dummy = 10;

// stop observing:
model.unobserve(callbackFn);
```