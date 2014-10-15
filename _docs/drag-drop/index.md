---
module: drag-drop
itsaclassname: DD
version: 0.0.1
modulesize: 3.46
modulesizecombined: 16.13
dependencies: "polyfill/polyfill-base.js, js-ext/lib/function.js, js-ext/lib/object.js, utils, event"
maintainer: Marco Asbreuk
title: Drag and Drop
intro: "Drag and Drop is a module which makes draggable items without any initialisation: <b>just plain HTML</b>. The code that takes care of this is loaded once and uses event-delegation to perform its task. You can set attributes on the HtmlElements and they will act as draggables, or dropzones. Of coarse these functionality can be given afterwards using javascript: you can set attributes yourself, or use Plugin's on the HtmlElements.<br><br>Because HTML defines the drag and drop behaviour, drag-drop is perfectly suited for serverside rendering."
firstpar: get-started-onlywindow
extracodefirstpar: DD.init();
---

#Features#

This module bring Drag and Drop to a higher level:

* Functionalities `based upon HTML`
* Functionalities can be set both at the Element or at a parent-container
* Draggable items can be `constrained`
* `Move` or `Copy` items
* Define `dropzones` where draggable items can be dropped into
* Define `emitterNames` for draggable items and specify dropzones to accept specific emitters
* Listen to only one event and use a `Promise` to be notified when ready
* Move or Copy `multiple items` at once
* Use `handles` where draggable items can be pickes up
* Nice transition-return when a dropzone is missed


#The Basics#

Drag and Drop consist of two different parts: `drag` and `drop`. Both parts are related to HtmlElements: `draggable nodes` or `dropzone nodes` that act as a container where the draggable items can be dropped into. Both functionalities are made operational by setting the appropriate `attributes` the the Elements. Once the code:

```js
ITSA.DD.init();
```
is executed, delegated eventlisteners will make sure that any Element act as they should, as long as it has the right attributes. You can even set the attributes later on: it just will work, without any additional code.

##Drag##

HtmlElements are made draggable by defining the attribute `dd-draggable="true"`:

```html
<div dd-draggable="true">drag me</div>
```

You can also define this behaviour at a parent Element that works like a container. Working this way, you need to specify which **descendants** need to be draggable by setting a css-selector `dd-draggable="css-selector"`:

```html
<div dd-draggable="div"> <!-- this div is not draggable -->
    <div>drag me</div> <!-- draggable -->
    <div>drag me</div> <!-- draggable -->
    <div>drag me</div> <!-- draggable -->
    <div>drag me</div> <!-- draggable -->
    <div>drag me</div> <!-- draggable -->
</div>
```


##Drop##

HtmlElements can act as a `dropzone` where draggable items can be dropped inside. Dropzones are defined with the attribute `dropzone="true | move | copy"`. The type of dropzone determines wheter it accepts only copyable items, movable items, or both. As you can see later on, a dropzone can be limites to accept special emitters as well.

Not only do you need to define dropzones, you also need to tell the draggable items that they should go into a specific dropzone. This should be done by setting the attribute `dd-dropzone="css-selector"` on the draggable item:

```html
<div dd-draggable="true" dd-dropzone=".drop-container">drag me</div>
<div class="drop-container" dropzone="true"></div>
```


#Draggable Elements#

##Setting HTML-attributes##

###dd-constrain###

###dd-handle###

###dd-emittername###

##Using Plugins##

###ITSA.Plugins.NodeDD###

 NodeDD = NodePlugin.subClass(
        function (config) {
            config || (config={});
            this[DD_MINUS+DRAGGABLE] = true;
            this[DD_MINUS+DROPZONE] = config.dropzone;
            this[CONSTRAIN_ATTR] = config.constrain;
            this[DD_EMITTER_NAME] = config.emitterName;
            this[DD_HANDLE] = config.handle;
            this[DD_EFFECT_ALLOWED] = config.effectAllowed;
        }
    );

###ITSA.Plugins.NodeConstrain###

Is delivered by the module `dom-ext`.

    NodeConstrain = NodePlugin.subClass(
        function (config) {
            this['xy-constrain'] = (config && config.selector) || 'window';
        }
    );


#Dropzone Elements#

##Setting HTML-attributes##

###dropzone="true"###

###dropzone="copy"###

###dropzone="move"###

###dropzone="emittername"###

##Using Plugins##

###ITSA.Plugins.NodeDropzone###

    NodeDropzone = NodePlugin.subClass(
        function (config) {
            var dropzone = 'true',
                emitterName;
            config || (config={});
            if (config.copy && !config.move) {
                dropzone = COPY;
            }
            else if (!config.copy && config.move) {
                dropzone = MOVE;
            }
            (emitterName=config.emitterName) && (dropzone+=' '+EMITTER_NAME+'='+emitterName);
            this.dropzone = dropzone;
        }
    );


#Multiple items simultanious#

#Monitoring#

##Events##

##Promises##


#Change dropbehaviour#