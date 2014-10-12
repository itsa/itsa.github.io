---
module: drag-drop
maintainer: Marco Asbreuk
title: Emitter dropzones
intro: "Drag and drop is done by a single event: <b>dragdrop</b>. The eventobject notifies you when the drag has finished. You can inspect the Promise e.drag.then for this purpose. You can also be notified on drag-move by setting a callback-function through: <b>e.setOnDrag(callbackFn)</b>. Draggable HtmlElements have the attribute: <b>draggable=\"true\"</b>"
---

<style type="text/css">
    .base-container {
        margin-bottom: 30px;
        width: 350px;
        height: 150px;
        background-color: #FF0;
        border: solid 10px #0F0;
    }
    .drop-container {
        margin-bottom: 30px;
        width: 350px;
        height: 150px;
        border: solid 2px #000;
        background-color: #0FF;
    }
    .container {
        text-align: center;
        margin: 2em 0;
        padding-top: 1.5em;
        height: 100px;
        width: 100px;
        background-color: #ddd;
        border: solid 10px #000;
        display: inline-block;
        *display: inline;
        *zoom: 1;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: default;
    }
    .dropactive {
        opacity: 0.6;
        filter: alpha(opacity=60); /* For IE8 and earlier */
        border: dotted 2px #000;
    }
    .container.dd-dragging {
        background-color: #0F0;
    }

</style>

Mouse the mouse over the 5 containers:

<div class="base-container">
    <div class="container" draggable="true" dd-emitter-name="blue"></div>
    <div class="container" draggable="true" dd-emitter-name="blue"></div>
    <div class="container" draggable="true" dd-emitter-name="blue"></div>
</div>

<div class="base-container">
    <div class="container" draggable="true" dd-emitter-name="red"></div>
    <div class="container" draggable="true" dd-emitter-name="red"></div>
    <div class="container" draggable="true" dd-emitter-name="red"></div>
</div>

<div class="drop-container" dropzone="emitter=blue"></div>
<div class="drop-container" dropzone="move emitter=red"></div>


<p class="spaced">Code-example:</p>

```html
<body>
    <div class="base-container">
        <div class="container" draggable="true" dd-emitter-name="blue"></div>
        <div class="container" draggable="true" dd-emitter-name="blue"></div>
        <div class="container" draggable="true" dd-emitter-name="blue"></div>
    </div>

    <div class="base-container">
        <div class="container" draggable="true" dd-emitter-name="red"></div>
        <div class="container" draggable="true" dd-emitter-name="red"></div>
        <div class="container" draggable="true" dd-emitter-name="red"></div>
    </div>

    <div class="drop-container" dropzone="emitter=blue"></div>
    <div class="drop-container" dropzone="move emitter=red"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');
</script>
```

<script src="../../dist/itsabuild.js"></script>
<script>
    var ITSA = require('itsa');
</script>
