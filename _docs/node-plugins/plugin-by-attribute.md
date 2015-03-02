---
module: node-plugin
maintainer: Marco Asbreuk
title: Plugin by attribute
intro: "This example shows how the dd-plugin can get activated by just defining its attribute."
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

Drag the rectangle. The Node is made draggable by defining the attribute *plugin-dd="true"*.

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
    document.getElement('.container').setAttr('plugin-dd', 'true');
</script>
```

<script src="../../dist/itsabuild.js"></script>
<script>
    var ITSA = require('itsa');
    document.getElement('.container').setAttr('plugin-dd', 'true');
</script>
