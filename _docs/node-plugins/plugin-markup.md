---
module: node-plugin
maintainer: Marco Asbreuk
title: Plugin by html markup
intro: "This example shows how the dd-plugin is activated by its html."
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

Drag the rectangle. The Node is made draggable its html.

<div class="container" plugin-dd="true"></div>

<p class="spaced">Code-example:</p>

```html
<body>
    <div class="container" plugin-dd="true"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');
</script>
