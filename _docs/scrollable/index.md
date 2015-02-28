---
module: scrollable
itsaclassname:
version: 0.0.1
modulesize: 1.69
dependencies: "polyfill"
maintainer: Marco Asbreuk
title: Transitions
intro: "CSS-transitions managable by Promises with extra handles."
firstpar: get-started-onlywindow
---



#The Basics#

Transitions are happening through CSS-transitions. This is available in every modern browser and IE10+. The transitions are delivers by the `vdom`-module. There are serveral sugar methods and setting classes that have a transition can be managed. All transition-methods return a `Promise`.

Transitions have a lot of pitfalls. This module uses a `transition-fix` to handle these. For example: `auto` width and height will transition properly. Also, the Promise will be resolved as soon as the transition has finished, even if several properties have different duration, or when the `transitionend`-events get messy (which happen in webkit with shorthand properties).


