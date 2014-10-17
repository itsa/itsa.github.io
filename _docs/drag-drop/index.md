---
module: drag-drop
itsaclassname: DD
version: 0.0.1
modulesize: 3.03
modulesizecombined: 17.73
dependencies: "polyfill/polyfill-base.js, js-ext/lib/function.js, js-ext/lib/object.js, utils, event"
maintainer: Marco Asbreuk
title: Drag and Drop
intro: "Drag and Drop is a module which makes draggable items without any initialisation: <b>just plain HTML</b>. The code that takes care of this is loaded once and uses event-delegation to perform its task. You can set attributes on the HtmlElements and they will act as draggables, or dropzones. Of coarse these functionality can be given afterwards using javascript: you can set attributes yourself, or use Plugin's on the HtmlElements.<br><br>Because HTML defines the drag and drop behaviour, drag-drop is perfectly suited for serverside rendering.<br><br>This module extends the module <b>drag</b>. You can find drag-related documentation at that module: this dicumentation is about the specific drop-features which this module provides."
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
* `dropzone="all"` --> equals `move` && `copy`
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
        emitterName: 'someEmitter1,someEmitter2'
    }
);
```

##Preparing the draggables##
The draggable HtmlElements could be set up in a way that they tell the system what dropzones they could be dropped. Only when you set this up, they can be dropped inside a dropzone. This definition can be made at every draggable HtmlElement, or delegated as [explained here](../drag/index.html#delegate-dragging).

In order to be able to drop a draggable, either the attribute `dd-dropzone` or `dd-emitter` should be set on the draggable (or its delgated container).

##additional HTML-attributes##
Beside the attribute `dd-constrain` and `dd-handle` -which are defined by the drag-module- you can define the next additional attributes on the draggables:


###dd-dropzone###
Css-selector that specifies the `dropzone` where the draggable HtmlElement could go to.

###dd-effect-allowed###
Which effects (`copy` or `move`) is allowed on the draggable HtmlElement.

###dd-emitter###
Which emitterName the draggable HtmlElement should have (will overrule the `UI`-emitterName).

###dd-dropzoneMovable###
Whether the draggable HtmlElement can be moved inside a dropzone (once it gets there)

##Delegate draggable attributes##
The same way as draggable containers can [delegate](../drag/index.html#delegate-dragging) `dd-attributes` to their draggables, `dropzones` can do this as well. This way the draggable that are moves inside a dropzone can take over the dropzone-specific draggable-attributes. If the dropzone has no delegated attributes, and the draggable element comes from within a delegated container, the draggable will keep the inline attributes from the delegate container.


By default, any draggable HtmlElement has `UI` as its emitter. You can overrule this inside a `before-subscriber` at the `dd`-event:
Define `emitter` during a drag-cycle:

```js
ITSA.Event.before('dd', function(e) {
    e.emitter = 'someEmitter';
});
```



##additional HTML-attributes by plugin##




#Move or copy#


#Monitoring#

##Events##

##Promises##


#Change dropbehaviour#


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