---
module: panel
maintainer: Marco Asbreuk
title: "Panel with model"
intro: "This example shows how to setup a panel with more configuration, by passing model-data to its argument."
---


<p class="spaced">Code-example:</p>

```js
<script src="itsabuild-min.js"></script>
<script>
    var modelData;

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
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var modelData;

    modelData = {
        header: 'title',
        footer: '<button class="pure-button">Cancel</button><button class="pure-button">Ok</button>',
        content: 'I am a panel',
        visible: true,
        headerCloseBtn: true,
        draggable: true
    };

    document.createPanel(modelData);
</script>
