---
module: js-ext
functionality: HashMap
itsaclassname:
version: 0.0.1
modulesize: 1.69
dependencies: "polyfill"
maintainer: Marco Asbreuk
title: HashMap
intro: "Used as an alternative for an object without prototype."
firstpar: get-started
---



#The Basics#

An HashMap is an very plain object without a prototype. Therefore it is a `clean` object: it lacks all Object.prototype methods and properties. This can be usefull when you want the object just being used as a quick reference-container. This module exports a function named: `createMap`, which is available on `ITSA` as `ITSA.createHashMap`.

####Example creating empty HashMap####
```js
var reservedWords = ITSA.createHashMap(),
    check;

reservedWords.new = true;
reservedWords.arguments = true;
reservedWords.boolean = true;

check = 'arguments';
if (reservedWords[check]) {
    alert('You cannot use '+check+' --> it is a reserved word');
}
```

####Example creating filled HashMap####
```js
var reservedWords = ITSA.createHashMap({
        new: true,
        arguments: true,
        boolean: true
    }),
    check;

check = 'arguments';
if (reservedWords[check]) {
    alert('You cannot use '+check+' --> it is a reserved word');
}
```