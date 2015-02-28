---
module: drag-drop
maintainer: Marco Asbreuk
title: Change drop-behaviour
intro: "By default, any item dropped inside a dropzone will be visible inside the dropzone. To change this, you can subscribe to the before-<b>dd-drop</b> event and preventDefault()."
---

<style type="text/css">
    .base-container {
        width: 100%;
        height: 180px;
        background-color: #EEE;
        border: solid 8px #999;
        margin-bottom: 1em;
        padding: 20px;
    }
    .container {
        margin: 10px;
        height: 100px;
        width: 100px;
        background-color: #990073;
        border: 2px solid #000;
        display: inline-block;
        *display: inline;
        *zoom: 1;
        color: #FFF;
        text-align: center;
        font-size: 16px;
        line-height: 1.4em;
        padding: 16px 8px 0;
    }
    .drop-container {
        width: 250px;
        height: 250px;
        border: solid 8px #000;
        background-color: #c0e5fd;
        display: inline-block;
        *display: inline;
        *zoom: 1;
        float: left;
        margin-right: 20px;
        text-align: center;
        font-size: 17px;
        padding-top: 18px;
    }
    .body-content.module p.spaced {
        margin-top: 290px;
    }
    .dropzone-awake[dz-dropzone] {
        border-style: dashed;
    }
</style>

Drag the items to the dropzones.

<div class="base-container">
    <div class="container" plugin-dd="true" dd-dropzone=".drop-container">drag me nr. 1</div>
    <div class="container" plugin-dd="true" dd-dropzone=".drop-container">drag me nr. 2</div>
    <div class="container" plugin-dd="true" dd-dropzone=".drop-container">drag me nr. 3</div>
    <div class="container" plugin-dd="true" dd-dropzone=".drop-container">drag me nr. 4</div>
    <div class="container" plugin-dd="true" dd-dropzone=".drop-container">drag me nr. 5</div>
</div>

<div class="drop-container return" plugin-dz="true"><b>accept and return</b><br></div>
<div class="drop-container absorb" plugin-dz="true"><b>accept and absorb</b><br></div>

<p class="spaced">Code-example:</p>

```css
<style type="text/css">
    .dropzone-awake[dz-dropzone] {
        border-style: dashed;
    }
</style>
```

```html
<body>
    <div class="base-container">
        <div class="container" plugin-dd="true" dd-dropzone=".drop-container">drag me nr. 1</div>
        <div class="container" plugin-dd="true" dd-dropzone=".drop-container">drag me nr. 2</div>
        <div class="container" plugin-dd="true" dd-dropzone=".drop-container">drag me nr. 3</div>
        <div class="container" plugin-dd="true" dd-dropzone=".drop-container">drag me nr. 4</div>
        <div class="container" plugin-dd="true" dd-dropzone=".drop-container">drag me nr. 5</div>
    </div>

    <div class="drop-container return" plugin-dz="true"><b>accept and return</b><br></div>
    <div class="drop-container absorb" plugin-dz="true"><b>accept and absorb</b><br></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        returnItem, absorbItem;

    returnItem = function(e) {
        e.preventDefault();
        ITSA.DD.restoreDraggables();
        e.dropTarget.append('<br>'+e.target.getText()+' added');
    };

    absorbItem = function(e) {
        e.preventDefault();
        // note that we have to remove both the nodes: original e.target
        // as well as the draggable: e.copyTarget.
        // also note that, when dragging multiple draggables, we have to handle e.relatives
        // which is a hash containing all draggable nodes as well as their originals.
        e.dropTarget.append('<br>'+e.target.getText()+' added');
        e.sourceNode.remove();
        e.dragNode.remove();
        ITSA.DD._emitDropzoneDrop(e); // fire the dropzone-drop event
    };

    ITSA.Event.before(
        'dd-drop',
        returnItem,
        function(e) {
            return e.dropTarget && e.dropTarget.hasClass('return');
        }
    );

    ITSA.Event.before(
        'dd-drop',
        absorbItem,
        function(e) {
            return e.dropTarget && e.dropTarget.hasClass('absorb');
        }
    );

</script>
```

<script src="../../dist/itsabuild.js"></script>
<script>
    var ITSA = require('itsa'),
        returnItem, absorbItem;

    returnItem = function(e) {
        e.preventDefault();
        ITSA.DD.restoreDraggables();
        e.dropTarget.append('<br>'+e.target.getText()+' added');
    };

    absorbItem = function(e) {
        e.preventDefault();
        // note that we have to remove both the nodes: original e.target
        // as well as the draggable: e.copyTarget.
        // also note that, when dragging multiple draggables, we have to handle e.relatives
        // which is a hash containing all draggable nodes as well as their originals.
        e.dropTarget.append('<br>'+e.target.getText()+' added');
        e.sourceNode.remove();
        e.dragNode.remove();
        ITSA.DD._emitDropzoneDrop(e); // fire the dropzone-drop event
    };

    ITSA.Event.before(
        'dd-drop',
        returnItem,
        function(e) {
            return e.dropTarget && e.dropTarget.hasClass('return');
        }
    );

    ITSA.Event.before(
        'dd-drop',
        absorbItem,
        function(e) {
            return e.dropTarget && e.dropTarget.hasClass('absorb');
        }
    );
</script>
