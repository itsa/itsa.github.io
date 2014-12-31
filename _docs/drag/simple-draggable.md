---
module: drag
maintainer: Marco Asbreuk
title: Simple draggable
intro: "Draggable elements can be setup using the attribute <b>dd-draggable=\"true\"</b>, or using javascript by using <b>node.plugin(ITSA.Plugins.nodeDD)</b>. This example uses plain HTML. Draggable items will force the window to scroll by default when coming outside the visible area.</b>"
---

<style type="text/css">
    .container {
        margin: 10px;
        height: 100px;
        width: 100px;
        background-color: #990073;
        border: 2px solid #000;
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

<p class="spaced">Code-example:</p>

```html
<body>
    <div class="container" dd-draggable="true"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');
    ITSA.DD.init(); // ITSA combines the Drag-module with drag-drop into ITSA.DD
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');
    ITSA.DD.init(); // ITSA combines the Drag-module with drag-drop into ITSA.DD
</script>
