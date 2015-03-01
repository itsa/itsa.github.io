---
module: panel
maintainer: Marco Asbreuk
title: Simple panel
intro: "This example shows how to interrupt a transition. Interruption can be done when using the interruption-methods that return a Promise, like node\'s class-methods or transition. These methods return Promise with extra methods: cancel, freeze and finish, which all interrupt the transition and force to the initial, current or final state immediately.<br><br>Start switching the class, while during transition experiment with canceling, freezing or finishing."
---


<p class="spaced">Code-example:</p>

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');
    var panelModel = document.createPanel('Hey');
    panelModel.visible = true;
</script>
```

<script src="../../dist/itsabuild.js"></script>
<script>
    var ITSA = require('itsa');
    var panelModel = document.createPanel({
        // header: 'title',
        footer: '<button class="pure-button">Cancel</button><button class="pure-button">Ok</button>',
        content: 'Hey',
        visible: true,
        onTopWhenShowed: true,
        draggable: true
    });
</script>
