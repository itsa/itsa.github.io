---
module: node-plugin
maintainer: Marco Asbreuk
title: Changing properties
intro: "An element can be made draggable by using <b>node.plugin(ITSA.Plugins.nodeDD)</b>. The plugin does nothing more than add the right attribute to the draggable Element, and it just works.</b>"
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
        display: inline-block;
        *display: inline;
        *zoom: 1;
    }
</style>

Drag the 2 rectangles: they will be constrained to their container. The first is constrained using html, the second is set up using javascript.

<button id="switch" class="pure-button">Switch constrain</button>
<div class="base-container">
    <div id="dragnode" class="container" plugin-dd="true" plugin-constrain="true" constrain-selector=".base-container"></div>
</div>

<p class="spaced">Code-example:</p>

```html
<body>
    <div class="base-container">
        <div class="container" dd-draggable="true" constrain-selector=".base-container"></div>
        <div id="without" class="container" dd-draggable="true"></div>
    </div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');

    ITSA.DD.init(); // ITSA combines the Drag-module with drag-drop into ITSA.DD
    document.getElement('#without').plug(ITSA.Plugins.Constrain, {selector: '.base-container'});
</script>
```

<script src="../../dist/itsabuild.js"></script>
<script>
    var ITSA = require('itsa'),
        dragnode = document.getElement('#dragnode'),
        constrained = true;

    ITSA.DD.init(); // ITSA combines the Drag-module with drag-drop into ITSA.DD

    ITSA.Event.after('tap', function() {
        constrained = !constrained;
        dragnode.plugin.constrain.model.selector = constrained ? '.base-container' : 'window';
    }, '#switch');

</script>