---
module: drag-drop
maintainer: Marco Asbreuk
title: Delegated dropzones
intro: "Multiple items can be made draggable by specify <b>draggable=\"css-selector\"</b> at a container-Element. Make sure that -when delegate- the delegated items have the same CSS as [draggable] has."
---

<style type="text/css">
    .drop-container {
        width: 40%;
        height: 300px;
        border: solid 8px #000;
        background-color: #c0e5fd;
        display: inline-block;
        *display: inline;
        *zoom: 1;
        margin: 15px;
        text-align: center;
        font-size: 17px;
        padding: 20px;
        float: left;
    }
    .drop-container div {
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
    .base-container div {
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        user-select: none;
        float: left;
        position: relative;
    }
    .body-content.module p.spaced {
        margin-top: 690px;
    }
    .dropactive[dropzone] {
        border-style: dashed;
    }
</style>

Drag the items, they are all draggable and can be moved or copied into any dropzone.

<div class="drop-container" dd-draggable="div" dd-dropzone=".drop-container" dd-effect-allowed="all" dropzone="true">
    <div>drag me</div>
    <div>drag me</div>
    <div>drag me</div>
    <div>drag me</div>
</div>

<div class="drop-container" dd-draggable="div" dd-dropzone=".drop-container" dd-effect-allowed="all" dropzone="true"></div>
<div class="drop-container" dd-draggable="div" dd-dropzone=".drop-container" dd-effect-allowed="all" dropzone="true"></div>
<div class="drop-container" dd-draggable="div" dd-dropzone=".drop-container" dd-effect-allowed="all" dropzone="true"></div>

<p class="spaced">Code-example:</p>

```css
<style>
    .dropactive[dropzone] {
        border-style: dashed;
    }

    /* give delegated items the same CSS as [draggable]: */
    .base-container div {
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        user-select: none;
        float: left;
        position: relative;
    }
</style>
```
```html
<body>
    <div class="drop-container" dd-draggable="div" dd-dropzone=".drop-container" dd-effect-allowed="all" dropzone="true">
        <div>drag me</div>
        <div>drag me</div>
        <div>drag me</div>
        <div>drag me</div>
    </div>

    <div class="drop-container" dd-draggable="div" dd-dropzone=".drop-container" dd-effect-allowed="all" dropzone="true"></div>
    <div class="drop-container" dd-draggable="div" dd-dropzone=".drop-container" dd-effect-allowed="all" dropzone="true"></div>
    <div class="drop-container" dd-draggable="div" dd-dropzone=".drop-container" dd-effect-allowed="all" dropzone="true"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');
    ITSA.DD.init();
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');
    ITSA.DD.init();
</script>
