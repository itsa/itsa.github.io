---
module: polyfills
itsaclassname:
version: 0.0.1
modulesize: 0.57
dependencies:
maintainer: Marco Asbreuk
title: Polyfills for IE8
intro: "Small set of polyfills, only those who are used by the ITSA modules."
firstpar: get-started-onlywindow
---

#The Basics#

The polyfills that are defined work with `feature-detect`, so they won;t overwrite methods that are available and will work with browsers onther than IE8 who also lack these features. However, it are mostly `ES5`-features, so IE8 and below will probably be those who get fixed.

##Available polyfills##

###Array.isArray###

###Array.forEach###

###Array.indexOf###

###Array.some###

###Array.filter###

###Object.defineProperty###
