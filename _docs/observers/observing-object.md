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
    var ITSA = require('itsa'),
        modelData;

    modelData = {
        header: 'title',
        footer: '<button class="pure-button">Cancel</button><button class="pure-button">Ok</button>',
        content: 'I am a panel',
        visible: true,
        onTopWhenShowed: true,
        headerCloseBtn: true,
        draggable: true
    };

    document.createPanel(modelData);

    ITSA.later(function() {
        modelData.content = 'Now I changed the content';
    }, 2000);
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        model, callback;

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
