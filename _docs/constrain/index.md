---
module: constrain
version: 0.0.1
modulesize: 1.99
modulesizecombined: 15.32
dependencies: "polyfill/polyfill-base.js, js-ext/lib/function.js, js-ext/lib/object.js, utils, event"
maintainer: Marco Asbreuk
title: Simple Drag and Drop
intro: "Drag is a module which makes draggable items without any initialisation: <b>just plain HTML</b>. The code that takes care of this is loaded once and uses event-delegation to perform its task. You can set attributes on the HtmlElements and they will act as draggables. Of coarse these functionality can be given afterwards using javascript: you can set attributes yourself, or use Plugin's on the HtmlElements.<br><br>Because HTML defines the drag-behaviour, this module is <u>perfectly suited for serverside rendering</u>.<br><br>Dragging is done using the event-dom module which uses event delegation. Therefore it is very efficient, flexible and has no memoryleaks when dom-nodes are removed."
firstpar: get-started-onlywindow
extracodefirstpar: "DD.init(); // DD is actually delivered by the drag-drop module which extends drag"
---

#The Basics#