---
module: drag-drop
maintainer: Marco Asbreuk
title: Delegate draggable
intro: "Multiple items can be made draggable by specify <b>draggable=\"css-selector\"</b> at a container-Element. Make sure that -when delegate- the delegated items have the same CSS as [draggable] has."
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
    .base-container div,
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
    .dropactive[dropzone] {
        border-style: dashed;
    }
</style>

Drag the items, they are all draggable.

<div class="base-container" dd-draggable="div" dd-dropzone=".drop-container">
    <div>drag me</div>
    <div>drag me</div>
    <div>drag me</div>
    <div>drag me</div>
    <div>drag me</div>
</div>

<div class="drop-container" dropzone="true">dropzone</div>

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
    <div class="base-container" dd-draggable="div" dd-dropzone=".drop-container">
        <div>drag me</div>
        <div>drag me</div>
        <div>drag me</div>
        <div>drag me</div>
        <div>drag me</div>
    </div>
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
