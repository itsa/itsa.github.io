---
module: panel
maintainer: Marco Asbreuk
title: "Changing the panel"
intro: "This example shows how changing model.content leads to an updated Panel. The panel gets updated after 2 seconds."
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
        modelData;

    modelData = {
        header: 'title',
        footer: '<button class="pure-button">Cancel</button><button class="pure-button">Ok</button>',
        content: 'I am a panel',
        visible: true,
        headerCloseBtn: true,
        draggable: true
    };

    document.createPanel(modelData);

    ITSA.later(function() {
        modelData.content = 'Now I changed the content';
    }, 2000);
</script>
