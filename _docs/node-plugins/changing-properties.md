---
module: node-plugin
maintainer: Marco Asbreuk
title: Changing properties
intro: "Plugin-properties can be changed by using plugin.model. This example shows how the property <b>selector</b> can be changed."
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

Click on the button to change the draggable's constrain.

<button id="switch" class="pure-button">Switch constrain</button>
<div class="base-container">
    <div id="dragnode" class="container" plugin-dd="true" plugin-constrain="true" constrain-selector=".base-container"></div>
</div>

<p class="spaced">Code-example:</p>

```html
<body>
    <button id="switch" class="pure-button">Switch constrain</button>
    <div class="base-container">
        <div id="dragnode" class="container" plugin-dd="true" plugin-constrain="true" constrain-selector=".base-container"></div>
    </div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        dragnode = document.getElement('#dragnode'),
        constrained = true;

    ITSA.Event.after('tap', function() {
        constrained = !constrained;
        dragnode.getPlugin('constrain').then(
            function(plugin) {
                plugin.model.selector = constrained ? '.base-container' : 'window';
            }
        );
    }, '#switch');
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        dragnode = document.getElement('#dragnode'),
        constrained = true;

    ITSA.Event.after('tap', function() {
        constrained = !constrained;
        dragnode.getPlugin('constrain').then(
            function(plugin) {
                plugin.model.selector = constrained ? '.base-container' : 'window';
            }
        );
    }, '#switch');

</script>