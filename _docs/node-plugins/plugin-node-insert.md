---
module: node-plugin
maintainer: Marco Asbreuk
title: Plugin by node-insert
intro: "This example shows that a plugin automaticly gets initialized once a host with plugin-html gets inserted."
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

Drag the rectangle. The Node is made draggable the html that gets inserted.

<div class="base"></div>

<p class="spaced">Code-example:</p>

```html
<body>
    <div class="base"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');
    document.getElement('.base').setHTML('<div class="container" plugin-dd="true"></div>');
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');
    document.getElement('.base').setHTML('<div class="container" plugin-dd="true"></div>');
</script>
