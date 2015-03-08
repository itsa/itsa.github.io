---
module: icons
maintainer: Marco Asbreuk
title: Button with right icon
intro: "This example shows how to generate a simple icon"
---

<button class="pure-button pure-button-bordered itsa-iconright">There was an error <icon-error></icon-error></button><button class="pure-button pure-button-bordered itsa-iconright">There was a warning <icon-alert></icon-alert></button>

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

<script src="../../dist/itsabuild.js"></script>
<script>
    var ITSA = require('itsa');
</script>
