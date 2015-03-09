---
module: dialog
maintainer: Marco Asbreuk
title: catching errors
intro: "This example shows how javascript-erros can be caught by dialog."
---

<p class="spaced">Code-example:</p>


```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');

    ITSA.catchErrors(true);
    throw new Error('An error occured');
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');

    ITSA.catchErrors(true);
    throw new Error('An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured An error occured ');
</script>
