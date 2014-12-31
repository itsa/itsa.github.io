---
module: drag-drop
maintainer: Marco Asbreuk
title: Emitter-dropzones
intro: "Draggable items can be dropped inside dropzones. When these dronzones are specified with <b>emittername=\"somename\"</b>, then they only accept draggable items with this specified emitterName. The draggable items can be labelled through the attribute <b>dd-emittername=\"somename\"</b> to identify the emitter.<br><br>Both the draggable items as well as dropzones can be setup using javascript as well. This is done with the red-item. The second blue-item gets its emitterName on the fly by subscribing to the dd-start event."
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
    .container[dd-emitter="blue"] {
        background-color: #00F;
    }
    #without-emitter,
    .container[dd-emitter="blue"] {
        background-color: #00F;
    }
    .container[dd-emitter="red"] {
        background-color: #F00;
    }
    .dropzone-awake[dd-dropzone] {
        border-style: dashed;
    }
</style>

Drag the items to the dropzones..

<div id="constr" class="base-container">
    <div class="container" dd-draggable="true" dd-emitter="blue"></div>
    <div id="without-emitter" class="container" dd-draggable="true"></div>
    <div id="without" class="container"></div>
</div>

<div class="drop-container" dd-dropzone="emitter=blue">only blue items</div>
<div id="dropzone-without" class="drop-container">only red items</div>


<p class="spaced">Code-example:</p>

```css
<style type="text/css">
    .dropzone-awake[dd-dropzone] {
        border-style: dashed;
    }
</style>
```

```html
<body>
    <div id="constr" class="base-container">
        <div class="container" dd-draggable="true" dd-emitter="blue"></div>
        <div id="without-emitter" class="container" dd-draggable="true"></div>
        <div id="without" class="container"></div>
    </div>

    <div class="drop-container" dd-dropzone="emitter=blue">only blue items</div>
    <div id="dropzone-without" class="drop-container">only red items</div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');

    ITSA.DD.init();
    document.getElement('#without').plug(ITSA.Plugins.nodeDD, {emitter: 'red'});
    document.getElement('#without-emitter').plug(ITSA.Plugins.nodeDD);
    document.getElement('#dropzone-without').plug(ITSA.Plugins.nodeDropzone, {dropzone: 'true emitter=red'});

    ITSA.Event.before('dd', function(e) {
        e.emitter = "blue";
    }, '#without-emitter');
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');

    ITSA.DD.init();
    document.getElement('#without').plug(ITSA.Plugins.nodeDD, {emitter: 'red'});
    document.getElement('#without-emitter').plug(ITSA.Plugins.nodeDD);
    document.getElement('#dropzone-without').plug(ITSA.Plugins.nodeDropzone, {dropzone: 'true emitter=red'});

    ITSA.Event.before('dd', function(e) {
        e.emitter = "blue";
        console.info('SETTING EMITTER');
    }, '#without-emitter');
</script>
