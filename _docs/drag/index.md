---
module: drag
itsaclassname: DD
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

#Features#

This module makes HtmlElement draggable in a very easy way, no clientside rendering:

* Functionalities `based upon HTML`
* Functionalities can be set both at the Element or a container-node
* Draggable items can be `constrained`
* Listen to only one event and use a `Promise` to be notified when ready
* Move `multiple items` at once
* Use `handles` where draggable items can be pickes up
* Draggable items are marked with `classes`, so dragging is easy to style


#The Basics#

Draggable items are HtmlElements. This Functionalities is made operational by setting the appropriate `attributes` the the HtmlElements Once the code:


HtmlElements are made draggable by defining the attribute `plugin-dd="true"`:

```html
<div plugin-dd="true">drag me</div>
```



#Draggable Elements#

Items can be made draggable by plain HTML, or by setting the right attributes with javascript later on. The latter is exactly what the Plugin does.

##Setting HTML-attributes##
A fully defined draggable HtmlElement with all features will look like this (note that the `drag-drop`-module offers additional attributes):

```html
<div plugin-dd="true" dd-handle="h1">
    <h1>drag me</h1>
    <p>Some content</p>
</div>
```

###dd-handle###
Should equal a `css-selector` of a descendant that should act as a handle where the draggable can be picked up.

###dd-emitter###
Which emitterName the draggable HtmlElement should have (will overrule the `UI`-emitterName). The `emitterName` will be used within the events `emittername:dd-drag` and `emittername:dd-drop`

##Using Plugins##
When this module gets imported, it defines the node-plugin: `dd`. Define a HtmlElement draggable or remove draggablilty-features can be done using this plugin.

###Define draggable###
```js
document.getElement('#someNode').plug('dd');
```

###Remove draggablity###
```js
document.getElement('#someNode').unplug('dd');
```

###Define draggable with options###
```js
document.getElement('#someNode').plug(
    'dd',
    {
        emitter: 'redItem',
        handle: 'h1'
    }
);
```


#Delegate dragging#

You can also define draggable behaviour at a container-HtmlElement, so you don't have to define the draggable-attributes on every single HtmlElement. Working this way, you need to specify which **descendants** need to be draggable by setting a css-selector `dd-draggable="css-selector"`:

```html
<div plugin-dd="true" dd-draggable="div" dd-handle="h1"> <!-- this div is not draggable -->
    <div><h1>drag me</h1></div> <!-- draggable -->
    <div><h1>drag me</h1></div> <!-- draggable -->
    <div><h1>drag me</h1></div> <!-- draggable -->
    <div><h1>drag me</h1></div> <!-- draggable -->
    <div><h1>drag me</h1></div> <!-- draggable -->
</div>
```
The container is defined as a `delegate`-container because `dd-draggable` is a `css-selector` instead of `"true"`. The css-selector defines which descendants are made draggable. Additional dragging attributes should be set on the same container-HtmlElement. During dragging, the draggable HtmlElement inherits the draggable attributes from the delegate-container and gets the appropriate draggable classes.


#Multiple items simultanious#

You can move multiple HtmlElements at the same time. This is done by defining which Element should go along with the `master`-draggable. This should be defined at the very first phase of the drag-cycle: inside a _before `dd`-event_-subscriber. The definition should be made by specifying `e.relatives` which should be a `NodeList`:

```js
ITSA.Event.before('dd', function(e) {
    e.relatives = document.getAll('.selected');
});
```


#Monitoring#

The drag-cycle can be monitored by subscribing to all separate `events`, or by subscribing to the `*:dd`-event and make use of `e.dd` which is a `Promise`. If you are familiar with Promises, the latter is highly preferable.

##Events##
The drag-cycle comes with 3 events, which all share the same eventobject. This means: changing the eventobject in a specific subscriber, makes it available in later subscribers (of other events) during this specific drag-cycle.

Note that the attribute `dd-emitter` (on the draggable HtmlElement) determines the `emitterName`. When not set, all events have the `UI` emitterName and could be listened to without the emitter-prefix.

###*:dd###
When the drag starts. Emits one time during the eventcycle. In case the attribute `dd-emitter` <u>is not set</u> on the draggable HtmlElement, this event has the `UI` emitterName (and could be listened to by just listening to the `dd`-event).

###*:dd-drag###
During dragging. Emits several times. In case the attribute `dd-emitter` <u>is not set</u> on the draggable HtmlElement, this event has the `UI` emitterName (and could be listened to by just listening to the `dd-drag`-event).

###*:dd-drop###
When the drag-cycle ends. Emits one time during the eventcycle. In case the attribute `dd-emitter` <u>is not set</u> on the draggable HtmlElement, this event has the `UI` emitterName (and could be listened to by just listening to the `dd-drop`-event).

##The eventobject##
The eventobject has the following properties:

* **e.target** {HtmlElement} the HtmlElement that is being dragged
* **e.currentTarget** {HtmlElement} the HtmlElement that is delegating
* **e.sourceTarget** {HtmlElement} the deepest HtmlElement where the mouse lies upon
* **e.dd** {Promise} Promise that gets fulfilled when dragging is ended. The fullfilled-callback has no arguments.
* **e.xMouse** {Number} the current x-position in the window-view
* **e.yMouse** {Number} the current y-position in the window-view
* **e.clientX** {Number} the current x-position in the window-view
* **e.clientY** {Number} the current y-position in the window-view
* **e.xMouseOrigin** {Number} the original x-position in the document when drag started (incl. scrollOffset)
* **e.yMouseOrigin** {Number} the original y-position in the document when drag started (incl. scrollOffset)
* **e.relatives** _optional_ {NodeList} an optional list that the user could set in a `before`-subscriber of the `dd`-event to inform which nodes are related to the draggable node and should be dragged as well.


##Promises##

You can also subscribe to only one event: `dd`-event and use `e.dd` (which is a Promise) to monitor further action. This Promise gets resolved when the drag-cycle is finished.

If you want to get informed during dragging, you can set up a callback to be informed. This can be done by using `e.dd.setCallback(callbackFn)`. This is made possible, because the [Promise is extended](../js-ext/index.html#promise.manage).

```js
ITSA.Event.after('dd', function(e) {

    e.dd.setCallback(function() {
        // this code is executed many times during dragging
    });

    e.dd.then(
        function() {
            // this code is executed at the end of the drag-cycle
        }
    );

});
```

#Classes#

Draggable items are marked with `classes`, so dragging is easy to style.

##Classes at draggable items#

###dd-dragging###
On every HtmlElement during dragging

###dd-master###
The master Element that is dragged. Will only be available when multiple HtmlElements are beging dragged and only on 1 HtmlElement (the one the mouse is holding).