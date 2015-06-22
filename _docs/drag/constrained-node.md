---
module: drag
maintainer: Marco Asbreuk
title: Constrained to a node
intro: "Draggable elements can be constrained by setting the attribute <b>constrain-selector=\"css-selector\"</b>, or using javascript by using <b>node.plugin(ITSA.Plugins.NodeConstrain, {selector: 'css-selector'})</b>. The plugin does nothing more than add the right attribute to the draggable Element, and it just works.</b>"
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

<div class="base-container">
    <div class="container" plugin-dd="true" plugin-constrain="true" constrain-selector=".base-container"></div>
    <div id="without" class="container" plugin-dd="true"></div>
</div>

<p class="spaced">Code-example:</p>

```html
<body>
    <div class="base-container">
        <div class="container" plugin-dd="true" plugin-constrain="true" constrain-selector=".base-container"></div>
        <div id="without" class="container" plugin-dd="true"></div>
    </div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    document.getElement('#without').plug('constrain', {selector: '.base-container'});
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    document.getElement('#without').plug('constrain', {selector: '.base-container'});
</script>
