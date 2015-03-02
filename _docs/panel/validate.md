---
module: panel
maintainer: Marco Asbreuk
title: "Panel with validation"
intro: "This example shows how to use validation. Note that the panel only gets closed when pressed on the Ok-button"
---


<p class="spaced">Code-example:</p>

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        modelData, validateFn;

    validateFn = function(e) {
        return (e.button.getHTML()==='Ok');
    };

    modelData = {
        header: 'title',
        footer: '<button class="pure-button">Cancel</button><button class="pure-button">Ok</button>',
        content: 'I am a panel',
        visible: true,
        headerCloseBtn: true,
        validate: validateFn
    };

    document.createPanel(modelData);
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        modelData, validateFn;

    validateFn = function(e) {
        return (e.button.getHTML()==='Ok');
    };

    modelData = {
        header: 'title',
        footer: '<button class="pure-button">Cancel</button><button class="pure-button">Ok</button>',
        content: 'I am a panel',
        visible: true,
        headerCloseBtn: true,
        validate: validateFn
    };

    document.createPanel(modelData);
</script>
