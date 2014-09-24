---
module: io-ext
maintainer: Marco Asbreuk
title: Transfer objects
intro: "This is the intro to this example of Extended IO"
---
#The Basics#

Here your content

Code-example:

```js
    var redObject = {};
    redObject.merge(I.Event.Emitter('red'));
    redObject.emit('save');
```

<!--
<script src="../../../build/core/core-min.js"></script>
<script>
    ITSA.ready().then(
        function() {
            // enter your code here
        }
    );
</script>
-->