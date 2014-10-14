---
module: drag-drop
maintainer: Marco Asbreuk
title: Constrained to a node
intro: "Draggable elements can be constrained by setting the attribute <b>xy-constrain=\"css-selector\"</b>, or using javascript by using <b>node.plugin(ITSA.Plugins.NodeConstrain, {selector: 'css-selector'})</b>. The plugin does nothing more than add the right attribute to the draggable Element, and it just works.</b>"
---

<style type="text/css">
    .base-container {
        width: 500px;
        height: 300px;
        background-color: #EEE;
        border: solid 8px #999;
        margin-bottom: 1em;
    }
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
</style>

Drag the 2 rectangles: they will be constrained to their container. The first is constrained using html, the second is set up using javascript.

<div class="base-container">
    <div id="ohoh" class="container" dd-draggable="true" xy-constrain=".base-container"></div>
    <div id="without" class="container" dd-draggable="true"></div>
</div>

<p class="spaced">Code-example:</p>

```html
<body>
    <div class="base-container">
        <div class="container" dd-draggable="true" xy-constrain=".base-container"></div>
        <div id="without" class="container" dd-draggable="true"></div>
    </div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');

    ITSA.DD.init();
    document.getElement('#without').plug(ITSA.Plugins.NodeConstrain, {selector: '.base-container'});
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');

    ITSA.DD.init();
    document.getElement('#without').plug(ITSA.Plugins.NodeConstrain, {selector: '.base-container'});
</script>
