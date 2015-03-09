---
module: icons
maintainer: Marco Asbreuk
title: Change color
intro: "This example shows how to generate a simple icon"
---

<style type="text/css">
    body #itsa-alert-icon {
        fill: #F00;
    }
</style>

<i icon="alert"></i>

<p class="spaced">Code-example:</p>

```css
<style type="text/css">
    body #itsa-alert-icon {
        fill: #F00;
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

