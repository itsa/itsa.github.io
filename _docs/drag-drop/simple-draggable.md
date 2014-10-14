---
module: drag-drop
maintainer: Marco Asbreuk
title: Simple draggable
intro: "Draggable elements can be setup using the attribute <b>dd-draggable=\"true\"</b>, or using javascript by using <b>node.plugin(ITSA.Plugins.NodeDD)</b>. The plugin does nothing more than add the right attribute to the draggable Element, and it just works. Draggable items will force the window to scroll by default when coming outside the visible area.</b>"
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
    .body-content.module p.spaced {
        margin-top: 150px;
    }
</style>

Drag the 2 rectangles. The first is constrained using html, the second is set up using javascript.

<div class="container" dd-draggable="true"></div>
<div id="without" class="container"></div>

<p class="spaced">Code-example:</p>

```html
<body>
    <div class="container" dd-draggable="true"></div>
    <div id="without" class="container"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');

    ITSA.DD.init();
    document.getElement('#without').plug(ITSA.Plugins.NodeConstrain);
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');

    ITSA.DD.init();
    document.getElement('#without').plug(ITSA.Plugins.NodeDD);
</script>
