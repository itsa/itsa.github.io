---
module: panel
maintainer: Marco Asbreuk
title: Simple panel
intro: "This example show how to setup a simple panel in its most basic way: by passing just a String as the only argument."
---


<p class="spaced">Code-example:</p>

```js
<script src="itsabuild-min.js"></script>
<script>
    var modelData;

    modelData = {
        content: 'I am a panel'
    }
    document.createPanel(modelData);
    modelData.visible = true;
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var modelData;

    modelData = {
        content: 'I am a panel'
    }
    document.createPanel(modelData);
    modelData.visible = true;
</script>
