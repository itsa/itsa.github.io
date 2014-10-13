---
module: drag-drop
itsaclassname: DD
version: 0.0.1
modulesize: 3.46
modulesizecombined: 16.13
dependencies: "polyfill/polyfill-base.js, js-ext/lib/function.js, js-ext/lib/object.js, utils, event"
maintainer: Marco Asbreuk
title: Drag and Drop
intro: "The event-dom module integrates DOM-events into the event-module. Using this module, you have all the power of the event-module applied to DOM-events.<br><br><u>event-dom touches no single dom-node</u>. Listening to events always happens by listening at the capturephase of <i>document</i>. Subscribers can be set without the need of node's being part of the dom.<br><br>The loaderfiles combine <b>event</b>, <b>event-dom</b> and <b>event-mobile</b> all into ITSA.Event."
firstpar: get-started-onlywindow
---

#Features#

This module bring DOM-events to a higher level:

* subscribers work regardless of the domnode being part of the dom
* by using delegation, you can save many Event-subscribers
* only a small number of dom-listeners are created. Just one for every possible dom-event
* e.target always matches the selector
* no memoryleaks on the dom, no need to detach on the dom-node
* delegation support for `focus`, `blur`, `scroll`, `resize`, `error` and `load` event
* both `before` and `after` listeners can be set
* `mouseover`- and `mouseout`-events only occurs on the selector (not noisy)
* all events have an `eventoutside` counterpart


#The Basics#
