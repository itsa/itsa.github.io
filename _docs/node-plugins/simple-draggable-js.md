---
module: node-plugin
maintainer: Marco Asbreuk
title: Simple draggable plugin
intro: "This example shows how to use Element.plug() to plug in the dd-plugin."
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

Drag the rectangle. The Node is made draggable by the dd-plugin.

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
    document.getElement('.container').plug('dd');
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    document.getElement('.container').plug('dd');
</script>
