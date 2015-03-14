---
module: js-ext
maintainer: Marco Asbreuk
title: Observing objects
intro: "This example shows how objects can be observed for changes"
---

<p class="spaced">Code-example:</p>

```html
<button class="pure-button pure-button-bordered itsa-icon"><i icon="grid-anim"></i></button>
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
    var obj = {
        val1: 10,
        val2: [1],
        val3: {a: 1},
        val4: [{b: 10}]
    };
    obj.observe(function() {
        console.warn('Object changed');
    });

    ITSA.later(function() {
        obj.val1 = 20;
    }, 5000);

    ITSA.later(function() {
        obj.val2[obj.val2.length] = 2;
    }, 10000);

    ITSA.later(function() {
        obj.val3.a = 2;
    }, 15000);

    ITSA.later(function() {
        obj.val2[0] = 9;
    }, 20000);

    ITSA.later(function() {
        obj.val3.b = 2;
    }, 25000);

    ITSA.later(function() {
        obj.val4[0].b = 20;
    }, 30000);
</script>
