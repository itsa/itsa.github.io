---
module: drag-drop
maintainer: Marco Asbreuk
title: Draggable with handles
intro: "Draggable elements can have handles wher you can drag them. You set this up using the attribute <b>dd-handle==\"css-selector\"</b>, or using javascript by using <b>node.plugin(ITSA.Plugins.NodeDD, {handle: 'css-selector'})</b>. The plugin does nothing more than add the right attribute to the draggable Element, and it just works.</b>"
---

<style type="text/css">
    .container {
        margin: 10px;
        height: 100px;
        width: 100px;
        background-color: #990073;
        border: 2px solid #000;
        cursor: default;
        display: inline-block;
        *display: inline;
        *zoom: 1;
    }
    .body-content.module .container h1 {
        font-size: 1em;
        background-color: #000;
        color: #FFF;
        padding: 0.2em;
        margin: 0;
        text-align: center;
    }
</style>

Drag the 2 rectangles. The first is constrained using html, the second is set up using javascript.

<div class="container" dd-draggable="true" dd-handle="h1"><h1>drag me</h1></div>
<div id="without" class="container"><h1>drag me</h1></div>

<p class="spaced">Code-example:</p>

```html
<body>
    <div class="container" dd-draggable="true" dd-handle="h1"><h1>drag me</h1></div>
    <div id="without" class="container"><h1>drag me</h1></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');
    document.getElement('#without').plug(ITSA.Plugins.NodeDD, {handle: 'h1'});
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');
    document.getElement('#without').plug(ITSA.Plugins.NodeDD, {handle: 'h1'});
</script>
