---
module: drag
maintainer: Marco Asbreuk
title: Constrained to window
intro: "Draggable elements can be constrained to the 'window' by setting the attribute <b>constrain-selector=\"window\"</b>, or using javascript by using <b>node.plugin(ITSA.Plugins.NodeConstrain)</b>. The plugin does nothing more than add the right attribute to the draggable Element, and it just works.</b>"
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

Drag the 2 rectangles: they will be constrained inside the window. The first is constrained using html, the second is set up using javascript.

<div class="container" plugin-dd="true" plugin-constrain="true" constrain-selector="window"></div>
<div id="without" class="container" plugin-dd="true"></div>

<p class="spaced">Code-example:</p>

```html
<body>
    <div class="container" plugin-dd="true" plugin-constrain="true" constrain-selector="window"></div>
    <div id="without" class="container" plugin-dd="true"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');

    document.getElement('#without').plug('constrain');
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');

    document.getElement('#without').plug('constrain');
</script>
