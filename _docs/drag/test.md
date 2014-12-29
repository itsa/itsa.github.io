---
module: drag
maintainer: Marco Asbreuk
title: TEST
intro: "Draggable elements can be setup using the attribute <b>dd-draggable=\"true\"</b>, or using javascript by using <b>node.plugin(ITSA.Plugins.NodeDD)</b>. This example uses plain HTML. Draggable items will force the window to scroll by default when coming outside the visible area.</b>"
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

Drag the 2 rectangles. The first is constrained using html, the second is set up using javascript.

<div class="container"></div>

<p class="spaced">Code-example:</p>

```html
<body>
    <div class="container" dd-draggable="true"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');
    ITSA.DD.init(); // ITSA combines the Drag-module with drag-drop into ITSA.DD
</script>
```

<script src="../../dist/itsabuild.js"></script>
<script>
    var ITSA = require('itsa');
    ITSA.DD.init(); // ITSA combines the Drag-module with drag-drop into ITSA.DD

    var hammertime = ITSA.Event.hammertime;
    var hammer = ITSA.Event.Hammer;

    // let the pan gesture support all directions.
    // this will block the vertical scrolling on a touch-device while on the element
    hammertime.get('pan').set({ direction: hammer.DIRECTION_ALL });

    // listen to events...
    // mc.on("panleft panright panup pandown tap press", function(ev) {
        // myElement.textContent = ev.type +" gesture detected.";
    // });

    ITSA.Event.after(['panstart', 'pandown', 'panmove', 'panup', 'panend'], function(e) {
        console.warn(e.type);
    }, '.container');

</script>

