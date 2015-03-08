---
module: icons
maintainer: Marco Asbreuk
title: Button with left icon
intro: "This example shows how to generate a simple icon"
---

<button class="pure-button pure-button-bordered itsa-iconleft"><icon-error></icon-error> There was an error</button><button class="pure-button pure-button-bordered itsa-iconleft"><icon-alert></icon-alert> Waring</button>

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
