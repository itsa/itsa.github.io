---
module: drag-drop
maintainer: Marco Asbreuk
title: Moving multiple items
intro: "Multiple items can be dragged at once by specifying <b>e.relatives</b> inside a before-subscriber to the <b>dd-start</b> event."
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
        border: 10px solid #000;
        cursor: default;
        display: inline-block;
        *display: inline;
        *zoom: 1;
        color: #FFF;
        text-align: center;
        font-size: 16px;
        line-height: 1.6em;
        padding: 16px 8px 0;
    }
    .drop-container {
        width: 100%;
        height: 300px;
        border: solid 8px #000;
        background-color: #c0e5fd;
        display: inline-block;
        *display: inline;
        *zoom: 1;
        margin-right: 20px;
        text-align: center;
        font-size: 17px;
        padding-top: 130px;
    }
    .dropactive[dropzone] {
        border-style: dashed;
    }
    .dd-master[dd-draggable="true"],
    .selected[dd-draggable="true"] {
        border-color: #AAA;
    }
</style>

Drag the items to the dropzones. The `movable or copyable` items will be copyable when the `Ctrl`-key (or `cmd`-key on a Mac) is pressed during dragging. Use the same Ctrl/cmd button to select multiple items.

<div id="constr" class="base-container">
    <div class="container" dd-draggable="true" dd-dropzone=".drop-container" dd-effect-allowed="all">drag me nr. 1</div>
    <div class="container" dd-draggable="true" dd-dropzone=".drop-container" dd-effect-allowed="all">drag me nr. 2</div>
    <div class="container" dd-draggable="true" dd-dropzone=".drop-container" dd-effect-allowed="all">drag me nr. 3</div>
    <div class="container" dd-draggable="true" dd-dropzone=".drop-container" dd-effect-allowed="all">drag me nr. 4</div>
    <div class="container" dd-draggable="true" dd-dropzone=".drop-container" dd-effect-allowed="all">drag me nr. 5</div>
</div>

<div class="drop-container" dropzone="true">dropzone</div>

<p class="spaced">Code-example:</p>

```css
<style type="text/css">
    .dropactive[dropzone] {
        border-style: dashed;
    }
    .dd-master[dd-draggable="true"],
    .selected[dd-draggable="true"] {
        border-color: #AAA;
    }
</style>
```

```html
<body>
    <div id="constr" class="base-container">
        <div class="container" dd-draggable="true" dd-dropzone=".drop-container" dd-effect-allowed="all">drag me nr. 1</div>
        <div class="container" dd-draggable="true" dd-dropzone=".drop-container" dd-effect-allowed="all">drag me nr. 2</div>
        <div class="container" dd-draggable="true" dd-dropzone=".drop-container" dd-effect-allowed="all">drag me nr. 3</div>
        <div class="container" dd-draggable="true" dd-dropzone=".drop-container" dd-effect-allowed="all">drag me nr. 4</div>
        <div class="container" dd-draggable="true" dd-dropzone=".drop-container" dd-effect-allowed="all">drag me nr. 5</div>
    </div>

    <div class="drop-container" dropzone="true">dropzone</div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');

    ITSA.DD.init();

    ITSA.Event.before('mousedown', function(e) {
        var ctrlPressed = e.ctrlKey || e.metaKey;
        if (!ctrlPressed) {
            document.getAll('.selected').removeClass('selected');
        }
        e.target.toggleClass('selected');
    }, '[dd-draggable="true"]');

    ITSA.Event.before('mousedownoutside', function(e) {
        document.getAll('.selected').removeClass('selected');
    }, '[dd-draggable="true"]');

    ITSA.Event.before('dd-start', function(e) {
        e.relatives = document.getAll('.selected');
    });

    ITSA.Event.after('dd-dropzone', function(e) {
        document.getAll('.selected').removeClass('selected');
    });
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');

    ITSA.DD.init();

    ITSA.Event.before('mousedown', function(e) {
        var ctrlPressed = e.ctrlKey || e.metaKey;
        if (!ctrlPressed) {
            document.getAll('.selected').removeClass('selected');
        }
        e.target.toggleClass('selected');
    }, '[dd-draggable="true"]');

    ITSA.Event.before('mousedownoutside', function(e) {
        document.getAll('.selected').removeClass('selected');
    }, '[dd-draggable="true"]');

    ITSA.Event.before('dd-start', function(e) {
        e.relatives = document.getAll('.selected');
    });

    ITSA.Event.after('dd-dropzone', function(e) {
        document.getAll('.selected').removeClass('selected');
    });
</script>
