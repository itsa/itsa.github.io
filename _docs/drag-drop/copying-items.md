---
module: drag-drop
maintainer: Marco Asbreuk
title: Copy items to dropzones
intro: "Draggable items can be dropped inside dropzones. Dronzones are HtmlElements that have the attribute: <b>dropzone=\"true | move | copy\"</b>. The attribute-value determines what will be accepted when dropped. The draggable items on the other hand, need the attribute: <b>dd-effect-allowed=\"all | move | copy\"</b> which marks the Element so it can be inspected by the dropzone if it is accepted.<br><br>Once a draggable item has a dropzone set, it will return to its original place when it is dropped outside the dropzone.<br><br>Copied items are duplicated: once duplicated, they are only movable."
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
        font-size: 14px;
        line-height: 1.2em;
        padding: 20px 8px 0;
    }
    .container {
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        user-select: none;
        float: left;
        position: relative;
    }
    .drop-container {
        width: 250px;
        height: 250px;
        border: solid 8px #000;
        background-color: #c0e5fd;
        display: inline-block;
        *display: inline;
        *zoom: 1;
        margin-right: 20px;
        text-align: center;
        font-size: 17px;
        padding-top: 105px;
    }
    .dropzone-awake[dz-dropzone] {
        border-style: dashed;
    }
</style>

Drag the items to the dropzones. The `movable and optional copyable` item will be copyable when the `Ctrl`-key (or `cmd`-key on a Mac) is pressed.

<div class="base-container" plugin-dd="true" dd-draggable=".container" dd-dropzone=".drop-container" >
    <div class="container" dd-effect-allowed="copy">copyable</div>
    <div class="container" dd-effect-allowed="move">movable</div>
    <div class="container" dd-effect-allowed="all">movable and optional copyable</div>
</div>

<div class="drop-container" plugin-dz="true" dz-dropzone="copy">only copied items</div>
<div class="drop-container" plugin-dz="true" dz-dropzone="move">only moved items</div>
<div class="drop-container" plugin-dz="true" dz-dropzone="true">copied and moved items</div>


<p class="spaced">Code-example:</p>

```css
<style type="text/css">
    .container {
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        user-select: none;
        float: left;
        position: relative;
    }
    .dropzone-awake[dd-dropzone] {
        border-style: dashed;
    }
</style>
```

```html
<body>
    <div class="base-container" dd-draggable=".container" dd-dropzone=".drop-container" >
        <div dd-effect-allowed="copy">copyable</div>
        <div dd-effect-allowed="move">movable</div>
        <div dd-effect-allowed="all">movable and optional copyable</div>
    </div>

    <div class="drop-container" dd-dropzone="copy">only copied items</div>
    <div class="drop-container" dd-dropzone="move">only moved items</div>
    <div class="drop-container" dd-dropzone="true">copied and moved items</div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');

    ITSA.DD.init();

    // we will change the text of copied items, so that it is clear they are only movable
    ITSA.Event.after('dropzone-drop', function(e) {
        e.dragNode.setText('movable');
        if (!e.isCopied) {
            e.sourceNode.setText('movable');
        }
    });
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');

    ITSA.DD.init();

    // we will change the text of copied items, so that it is clear they are only movable
    ITSA.Event.after('dropzone-drop', function(e) {
        e.dragNode.setText('movable');
        if (!e.isCopied) {
            e.sourceNode.setText('movable');
        }
    });
</script>
