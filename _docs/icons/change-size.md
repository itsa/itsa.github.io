---
module: icons
maintainer: Marco Asbreuk
title: Change size
intro: "This example shows how to generate a simple icon"
---

<style type="text/css">
    i[icon="alert"] svg {
        width: 5em;
        height: 5em;
    }
</style>

<i icon="alert"></i>

<p class="spaced">Code-example:</p>

```css
<style type="text/css">
    i[icon="alert"] svg {
        width: 5em;
        height: 5em;
    }
</style>
```

```html
<i icon="alert"></i>
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

