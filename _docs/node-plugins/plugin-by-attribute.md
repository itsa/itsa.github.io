---
module: node-plugin
maintainer: Marco Asbreuk
title: Plugin by attribute
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

<div class="container" plugin-dd="false"></div>

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

    document.getElement('.container').plug(ITSA.Plugins.nodeDD);
</script>
```

<script src="../../dist/itsabuild.js"></script>
<script>
    var ITSA = require('itsa');

    ITSA.later(function() {
        document.getElement('.container').setAttr('plugin-dd', 'true');
    }, 1000);
    ITSA.later(function() {
        document.getElement('.container').removeAttr('plugin-dd');
    }, 3000);
</script>
