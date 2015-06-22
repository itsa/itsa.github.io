---
module: js-ext
functionality: Observers
maintainer: Marco Asbreuk
title: "Observing an object"
intro: "This example shows how to observe a complex object for datachanges"
---


<p class="spaced">Code-example:</p>

```js
<script src="itsabuild-min.js"></script>
<script>
    var model, callback;

    model = {
        band: 'Marillion',
        titles: ['Script for a Jester\'s tear', 'Fugazi']
    };

    callback = function(item) {
        console.warn(JSON.stringify(item));
    };

    model.observe(callback);

    model.titles.push('Misplaced Childhood');

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var model, callback;

    model = {
        band: 'Marillion',
        titles: ['Script for a Jester\'s tear', 'Fugazi']
    };

    callback = function(item) {
        console.warn(JSON.stringify(item));
    };

    model.observe(callback);

    model.titles.push('Misplaced Childhood');

</script>
