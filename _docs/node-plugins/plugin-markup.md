---
module: node-plugin
maintainer: Marco Asbreuk
title: Plugin by markup
intro: "An element can be made draggable by using <b>node.plugin(ITSA.Plugins.dd)</b>. The plugin does nothing more than add the right attribute to the draggable Element, and it just works.</b>"
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

Drag the rectangle. The Node is made draggable by a plugin.

<div class="container" plugin-dd="true"></div>

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
</script>
```

<script src="../../dist/itsabuild.js"></script>
<script>
    var ITSA = require('itsa');
</script>
