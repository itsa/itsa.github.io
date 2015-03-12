---
module: icons
maintainer: Marco Asbreuk
title: Switching icons
intro: "This example shows how to switch icons. Click on the button to switch."
---

<button class="pure-button pure-button-bordered itsa-icon"><i icon="question"></i></button>

<p class="spaced">Code-example:</p>

```html
<button class="pure-button pure-button-bordered itsa-icon"><i icon="question"></i></button>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');

    ITSA.Event.after('tap', function(e) {
        var button = e.target,
            iconNode = button.getElement('i');
        iconNode.setAttr('icon', (iconNode.getAttr('icon')==='question') ? 'exclamation' : 'question');
    }, 'button');
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');

    ITSA.Event.after('tap', function(e) {
        var button = e.target,
            iconNode = button.getElement('i');
        iconNode.setAttr('icon', (iconNode.getAttr('icon')==='question') ? 'exclamation' : 'question');
    }, 'button');
</script>
