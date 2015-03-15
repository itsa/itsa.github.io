---
module: js-ext
functionality: LightMap
itsaclassname:
version: 0.0.1
modulesize: 1.69
dependencies: "polyfill"
maintainer: Marco Asbreuk
title: LightMap
intro: "LightMap is a Class-extention of WeakMap with additional methods, but without being weak. It is a light version of ES6's Map."
firstpar: get-started
---



#The Basics#

LightMap is -like ES6's Map- a map where you can store keys that can be of any type. You create a new LightMap with the `new` constructor:

```js
var myLightMap = new ITSA.LightMap();
```

Once created, you can add, check or delete items just like Map does:

####Example adding items to LightMap####
```js
var myLightMap = new ITSA.LightMap(),
    myObj = {},
    data = {};

myLightMap.set(myObj, data);
```



#Features#

A `LightMap` doesn't have all ES6's Map features, but the polyfill is light-weight. And it has most of the features needed in most cases:

##Summary##

###each###

###some###

###clear###

###has###

###get###

###set###

###size###

###delete###