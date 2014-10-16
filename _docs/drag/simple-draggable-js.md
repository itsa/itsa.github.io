---
module: drag
maintainer: Marco Asbreuk
title: Simple draggable plugin
intro: "Draggable elements can be setup using the attribute <b>dd-draggable=\"true\"</b>, or using javascript by using <b>node.plugin(ITSA.Plugins.NodeDD)</b>. This example uses the plugin. The plugin does nothing more than add the right attribute to the draggable Element, and it just works.</b>"
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

<div class="container"></div>

<p class="spaced">Code-example:</p>

```html
<body>
    <div class="container"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');

    ITSA.DD.init(); // ITSA combines the Drag-module with drag-drop into ITSA.DD
    document.getElement('.container').plug(ITSA.Plugins.NodeDD);
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');

    ITSA.DD.init(); // ITSA combines the Drag-module with drag-drop into ITSA.DD
    document.getElement('.container').plug(ITSA.Plugins.NodeDD);
</script>
