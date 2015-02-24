---
module: drag-drop
itsaclassname: DD
version: 0.0.1
modulesize: 3.03
modulesizecombined: 17.73
dependencies: "polyfill/polyfill-base.js, js-ext/lib/function.js, js-ext/lib/object.js, utils, event"
maintainer: Marco Asbreuk
title: Drag and Drop
intro: "Drag and Drop is a module which makes draggable items without any initialisation: <b>just plain HTML</b>. The code that takes care of this is loaded once and uses event-delegation to perform its task. You can set attributes on the HtmlElements and they will act as draggables, or dropzones. Of coarse these functionality can be given afterwards using javascript: you can set attributes yourself, or use Plugin's on the HtmlElements.<br><br>Because HTML defines the drag and drop behaviour, drag-drop is perfectly suited for serverside rendering.<br><br>This module extends the module <b>drag</b>, <u>be sure you read that documentation first</u>. You can find drag-related documentation at that module: this documentation is about the specific drop-features provided by this module.<br><br>Drag and Drop is done using the event-dom module which uses event delegation. Therefore it is very efficient, flexible and has no memoryleaks when dom-nodes are removed."
firstpar: get-started-onlywindow
extracodefirstpar: DD.init();
---

#Features#

This module brings Drag and Drop to a higher level:

* Dropzone-functionalities `based upon HTML`
* `Move` or `Copy` items
* Define `dropzones` where draggable items can be dropped into
* Define `emitterNames` for draggable items and specify dropzones to accept specific emitters
* Dropzone-listening with only one event and use a `Promise` to be notified when ready
* Nice transition-return when a dropzone is missed

Inherited from the [drag-module](../drag/index.html):

* Functionalities can be set both at the Element or a parent-container
* Draggable items can be `constrained`
* Define `dropzones` where draggable items can be dropped into
* Define `emitterNames` for draggable items and specify dropzones to accept specific emitters
* Drag-listen to only one event and use a `Promise` to be notified when ready
* Move or Copy `multiple items` at once
* Use `handles` where draggable items can be pickes up


#The Basics#

Drag and Drop consist of two different parts: `drag` and `drop`. Both parts are related to HtmlElements: `draggable nodes` or `dropzone nodes` that act as a container where the draggable items can be dropped into. The draggable features are deliverd by the [drag-module](../drag/index.html) and extended with `copy`-support. The functionalities of the dropzones are made operational by setting the appropriate `attributes` the the dropzone-HtmlElements. Once the code:

```js
ITSA.DD.init();
```
is executed, delegated eventlisteners will make sure that any HtmlElement act as they should, as long as it has the right attributes. You can even set the attributes later on: it just will work, without any additional code.

HtmlElements can act as a `dropzone` where draggable items can be dropped inside. Dropzones are defined with the attribute `dropzone="true | move | copy"`. The type of dropzone determines wheter it accepts only copyable items, movable items, or both. As you can see later on, a dropzone can be limites to accept special emitters as well.

Not only do you need to define dropzones, you also need to tell the draggable items that they should go into a specific dropzone. This should be done by setting the attribute `dd-dropzone="css-selector"` on the draggable item:

```html
<div dd-draggable="true" dd-dropzone=".drop-container">drag me</div>
<div class="drop-container" dropzone="true"></div>
```



#Dropzones#

##Effect-allowed##
A dropzone should be defined as a dropzone by specifying the attribute `dropzone` in one of these ways:

* `dropzone="move"`
* `dropzone="copy"`
* `dropzone="all"` --> equals `move` and `copy`
* `dropzone="true"` --> equals `move`

The property determines whether movable or copyable items are accepted and is called: `effect-allowed`. The origin of the draggable will determine this, because the draggable needs to be set up as well.


##Constrain to Emitters##
Beside the `effect-allowed`, a dropzone can be setup to accept only one -or multiple- specific emitters. The `dropzone`-attribute can be extended like this:

```html
<div dropzone="true emittername=someEmitter">
```

where `effect-allowed` could be any of the previous mentioned wethods, or even left away. There are no <u>spaces allowed</u> inside the emitter-definition.

Of course, the emitter-definition of the draggable HtmlElement should be defined inside the draggable Element as well.

Multiple emitters are posible by separated them with a comma:

```html
<div dropzone="true emittername=someEmitter1,someEmitter2">
```

##Dropzone HTML-attributes##

###dropzone###
Should contain a `effect-allowed` and/or an `emitter` as explained above.

##Dropzone Plugin##
When this module gets imported, it defines the node-plugin: `ITSA.Plugins.NodeDropzone`. Define a HtmlElement a dropzone or remove dropzone-features can be done using this plugin.

###Define a dropzone###
```js
document.getElement('#someNode').plug(ITSA.Plugins.NodeDropzone);
```


###Define a dropzone with options###
```js
document.getElement('#someNode').plug(
    ITSA.Plugins.NodeDropzone,
    {
        move: true,
        copy: true,
        emitter: 'someEmitter1,someEmitter2'
    }
);
```

##Preparing the draggables##
The draggable HtmlElements could be set up in a way that they tell the system what dropzones they could be dropped. Only when you set this up, they can be dropped inside a dropzone. This definition can be made at every draggable HtmlElement, or delegated as [explained here](../drag/index.html#delegate-dragging).

In order to be able to drop a draggable, either the attribute `dd-dropzone` or `dd-emitter` should be set on the draggable (or its delegated container).

```html
<div dd-draggable="true" dd-dropzone=".container">drag me</div>
```

or

```html
<div dd-draggable="true" dd-emitter="redItem">drag me</div>
```

##HTML-attributes##
Beside the attribute `dd-constrain`, `dd-handle` and `dd-emitter` -which are defined by the drag-module- you can define the next additional attributes on the draggables. Like shown above, at least `dd-dropzone` or `dd-emitter` is required:

```html
<div dd-draggable="true" dd-dropzone".container" >drag me</div>
```

###dd-constrain###
Should equal `window` or a `css-selector` of an ancestor where the draggable should be constrained within.

###dd-handle###
Should equal a `css-selector` of a descendant that should act as a handle where the draggable can be picked up.

###dd-dropzone###
Css-selector that specifies the `dropzone` where the draggable HtmlElement could go to.

###dd-effect-allowed###
Which effects (`copy` or `move`) is allowed on the draggable HtmlElement.

###dd-emitter###
Which emitterName the draggable HtmlElement should have (will overrule the `UI`-emitterName). The `emitterName` will be used within the events `emittername:dd-drag` and `emittername:dd-drop`

###dd-dropzone-movable###
Whether the draggable HtmlElement can be moved inside a dropzone (once it gets there)


##Draggable attributes by plugin##
The node-plugin: `ITSA.Plugins.nodeDD` can be used as [explained here](../drag/index.html#using-plugins). However, using `drag-drop`, you can define more options at when plugin (which are all optional):

###Define draggable with options###
**Example**

```js
document.getElement('#someNode').plug(
    ITSA.Plugins.nodeDD,
    {
        draggable: true,
        constrain: '.container',
        handle: 'h1',
        dropzone: true
        emitter: 'blueItem'
        'effect-allowed': 'move'
        'dropzone-movable': true
    }
);
```

##dd-dropzone or dd-emitter##
As explained above, the draggable must have specified at least `dd-dropzone` or `dd-emitter`. Also, both can be set up. The difference is this:

* `dd-dropzone` should be used when you don't need an identification of the draggable.
* `dd-emitter` should be used when you want to identify the draggable to give droppable access.


##Delegate draggable attributes##
The same way as draggable containers can [delegate](../drag/index.html#delegate-dragging) `dd-attributes` to their draggables, `dropzones` can do this as well. This way the draggable that are moves inside a dropzone can take over the dropzone-specific draggable-attributes. If the dropzone has no delegated attributes, and the draggable element comes from within a delegated container, the draggable will keep the inline attributes from the delegate container.

A dropzone that can delegate to its draggabels could look like this:

```html
<div dropzone="true" dd-draggable="div" dd-handle="h1">
    <div><h1>drag me</h1></div> <!-- draggable item that is part of the dropzone -->
    <div><h1>drag me</h1></div> <!-- draggable item that is part of the dropzone -->
    <div><h1>drag me</h1></div> <!-- draggable item that is part of the dropzone -->
    <div><h1>drag me</h1></div> <!-- draggable item that is part of the dropzone -->
    <div><h1>drag me</h1></div> <!-- draggable item that is part of the dropzone -->
</div>
```





#Move or copy#
Items can be `moved` or `copied`, where copying can only be done when the draggable has `dd-dropzone` or `dd-emitter` defined. The move/copy behaviour is determined **by the draggable** be setting `dd-effect-allowed`:

```html
<div dd-draggable="true" dd-dropzone="true" dd-effect-allowed="copy">I will copy</div>
```

or

```html
<div dd-draggable="true" dd-dropzone="true" dd-effect-allowed="move">I will move</div>
```

or

```html
<div dd-draggable="true" dd-dropzone="true" dd-effect-allowed="all">I will move or copy</div>
```

Any draggable that is defined with `dd-effect-allowed="all"` will change its behaviour when the `Ctrl`-key (or `cmd`-key on a Mac) is pressed. These keys can be pressed before, or during dragging.

In case multiple items are copied, the `eventobject` will have the property `e.relativeDragNodes`, which is a NodeList that holds the HtmlElements that corresponds with the `e.relative` list, but is a list with draggable Elements.



#Monitoring dropzones#

Dropzones can be monitored by subscribing to all separate dropzone-`events`, or by subscribing to the `dropzone-over`-event and make use of `e.dropzone` which is a `Promise`. If you are familiar with Promises, the latter is highly preferable.

##Events##
The dropzone comes with 3 events, which all share the same eventobject as that was emitted by the `*:dd`-event. This means: changing the eventobject in a specific subscriber, makes it available in later subscribers (of other events) during this specific drag-cycle.

Note that the attribute `dd-emitter` (on the draggable HtmlElement) determines the `emitterName`. When not set, all events have the `UI` emitterName and could be listened to without the emitter-prefix.

###*:dropzone-over###
When a draggable HtmlElement comes over a dropzone. The event will only be emitted if the draggable has the rights to be dropped in the specific dropzone. In case the attribute `dd-emitter` <u>is not set</u> on the draggable HtmlElement, this event has the `UI` emitterName (and could be listened to by just listening to the `dropzone-over`-event).

###*:dropzone-out###
When a draggable HtmlElement leaves a valid dropzone. In case the attribute `dd-emitter` <u>is not set</u> on the draggable HtmlElement, this event has the `UI` emitterName (and could be listened to by just listening to the `dropzone-out`-event).

###*:dropzone-drop###
When a draggable item is dropped inside a dropzone (where it has the rights to be dropped). In case the attribute `dd-emitter` <u>is not set</u> on the draggable HtmlElement, this event has the `UI` emitterName (and could be listened to by just listening to the `dropzone-drop`-event).

##The eventobject##
The eventobject has the following properties:

* **e.target** {HtmlElement} the dropzone
* **e.dragNode** {HtmlElement} The HtmlElement that is being dragged
* **e.dropzone** {Promise} The Promise that gets fulfilled as soon as the draggable is dropped, or outside the dropzone Will fulfill with one argument: `onDropzone` {Boolean} when `true`, the draggable is dropped inside the dropzone, otherwise the draggable got outside the dropzone without beging dropped.
* **e.dropTarget** {HtmlElement} The dropzone HtmlElement. Equals e.target
* **e.ctrlKey** {Boolean} Whether the Ctrl/cmd key is pressed
* **e.isCopied** {Boolean} Whether the drag is a copy-drag
* **e.sourceNode** _optional_ {HtmlElement} The original Element. Only when a `copy` is made --> e.dragNode is being moved while e.sourceNode stand at its place.
* **e.currentTarget** {HtmlElement} the HtmlElement that is delegating the draggable
* **e.sourceTarget** {HtmlElement} the deepest HtmlElement of the draggable where the mouse lies upon
* **e.dd** {Promise} Promise that gets fulfilled when dragging is ended. The fullfilled-callback has no arguments.
* **e.xMouse** {Number} the current x-position in the window-view
* **e.yMouse** {Number} the current y-position in the window-view
* **e.clientX** {Number} the current x-position in the window-view
* **e.clientY** {Number} the current y-position in the window-view
* **e.xMouseOrigin** {Number} the original x-position in the document when drag started (incl. scrollOffset)
* **e.yMouseOrigin** {Number} the original y-position in the document when drag started (incl. scrollOffset)
* **e.relatives** _optional_ {NodeList} an optional list that the user could set in a `before`-subscriber of the `dd`-event to inform which nodes are related to the draggable node and should be dragged as well.
* **e.relativeDragNodes** _optional_ {NodeList} an optional list that holds the HtmlElements that corresponds with the `e.relative` list, but is a list with draggable Elements.

Notice that `e.target` refers to the dropzone-Element, whereas `e.dragNode` refers to the draggable node. In case of copying, there will be `e.sourceNode` and `e.dragNode`, because there are twoe HtmlElements involved.

When moving or coying multiple draggables at once, you can inspect `e.relatives` (and e.relativeDragNodes when copying).

##Promises##

You can also subscribe to only one event: `dropzone-over`-event and use `e.dropzone` (which is a Promise) to monitor further action. This Promise gets resolved when the draggable gets out of the dropzone, or when the draggable is dropped inside the dropzone. The Promise resolves with one argument: `onDropzone` which is a boolean that tells whether the draggable was dropped.

```js
    ITSA.Event.after('dropzone-over', function(e) {
        var dropId = e.dropTarget.getId();

        e.dropzone.then(
            function(onDropzone) {
                if (onDropzone) {
                    // dropped
                }
                else {
                    // moved outside dropzone without droppping
                }
            }
        );
    });
```



#Change dropbehaviour#

The default-function of `dd-drop`, is defined as doing this:

* When inside a dropzone, move the draggable inside the dropzone and restore all classes and attributes
* When outside a dropzone, return to its original position

You can overrule this behaviour by creating a before-subscriber at the dd-drop event and prevent its default behaviour. When define your own behaviuor, you might need two specific methods of DD:

* `ITSA.DD.restoreDraggables()` --> repositions all draggable items to their original position
* `ITSA.DD_emitDropzoneDrop(e)` fire a dropzone-drop event

####Example:####
```js
absorbItem = function(e) {
    e.preventDefault();
    // note that we have to remove both the nodes: original e.target
    // as well as the draggable: e.copyTarget.
    // also note that, when dragging multiple draggables, we have to handle e.relatives
    // which is a hash containing all draggable nodes as well as their originals.
    e.target.remove();
    e.dragNode.remove();
    e.dropTarget.append('<br>'+e.target.getText()+' added');
    ITSA.DD_emitDropzoneDrop(e); // fire thr dropzone-drop event
};

ITSA.Event.before(
    'dd-drop',
    absorbItem
);
```


#Classes#

Draggable items are marked with `classes`, so dragging is easy to style.

##Draggable HtmlElements##
The first two classes are made avaiable by the [drag-module](../drag/index.html). The last three are extra classes provided by this module.

###dd-dragging###
On every HtmlElement during dragging

###dd-master###
The master Element that is dragged. Will only be available when multiple Elements are beging dragged.

###dd-copysource###
Whenever an HtmlElement gets copied, this class appears on the original HtmlElement.

###dd-copy###
Whenever an HtmlElement gets copied, this class appears on the draggable HtmlElement.

###dd-above-dropzone###
Set on both the original element as well as the draggable element whenever the draggable HtmlElement comes above a valid dropzone.


##Dropzone HtmlElements##

###dropzone-awake###
Set on any dropzone that registeres a droppable HtmlElement begin moved inside its region.