---
module: drag-drop
maintainer: Marco Asbreuk
title: Dropzones
intro: "Draggable items can be dropped inside dropzones. Dronzones are HtmlElements that have the attribute: <b>dropzone=\"true | move | copy\"</b>. The attribute-value determines what will be accepted when dropped. The draggable items on the other hand, need the attribute: <b>dd-effect-allowed=\"all | move | copy\"</b> which marks the Element so it can be inspected by the dropzone if it is accepted.<br><br>Once a draggable item has a dropzone set, it will return to its original place when it is dropped outside the dropzone."
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

Drag the items to the dropzones. The items can be copied by pressing the `Ctrl`- or `Cmd`-key

<div id="constr" class="base-container">
    <div class="container" plugin-dd="true" dd-dropzone=".drop-container" dd-effect-allowed="move">drag me</div>
    <div id="without" class="container">drag me (copyable)</div>
</div>

<div class="drop-container" plugin-dz="true" dz-dropzone="copy">only copied items</div>
<div class="drop-container" plugin-dz="true" dz-dropzone="move">only moved items</div>
<div id="dropzone-without" class="drop-container">copied and moved items</div>


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
    <div id="constr" class="base-container">
        <div class="container" plugin-dd="true" dd-dropzone=".drop-container" dd-effect-allowed="move">drag me</div>
        <div id="without" class="container">drag me (copyable)</div>
    </div>

    <div class="drop-container" plugin-dz="true" dz-dropzone="copy">only copied items</div>
    <div class="drop-container" plugin-dz="true" dz-dropzone="move">only moved items</div>
    <div id="dropzone-without" class="drop-container">copied and moved items</div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    document.getElement('#without').plug('dd', {'effect-allowed': 'all', dropzone: '.drop-container'});
    document.getElement('#dropzone-without').plug('dz');

    // we will change the text of copied items, so that it is clear they are only movable
    ITSA.Event.after('dropzone-drop', function(e) {
        e.dragNode.setText('drag me');
        if (!e.isCopied) {
            e.sourceNode.setText('drag me');
        }
    });

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    document.getElement('#without').plug('dd', {'effect-allowed': 'all', dropzone: '.drop-container'});
    document.getElement('#dropzone-without').plug('dz');

    // we will change the text of copied items, so that it is clear they are only movable
    ITSA.Event.after('dropzone-drop', function(e) {
        e.dragNode.setText('drag me');
        if (!e.isCopied) {
            e.sourceNode.setText('drag me');
        }
    });

</script>
