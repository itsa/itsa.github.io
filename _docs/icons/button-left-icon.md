---
module: icons
maintainer: Marco Asbreuk
title: Button with left icon
intro: "This example shows how to generate a simple icon"
---

<button class="pure-button pure-button-bordered itsa-iconleft"><i icon="error"></i> There was an error</button><button class="pure-button pure-button-bordered itsa-iconleft"><i icon="alert"></i> Waring</button>

<p class="spaced">Code-example:</p>

```html
<i is="error"></i>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');
</script>
