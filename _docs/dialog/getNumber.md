---
module: dialog
maintainer: Marco Asbreuk
title: getNumber
intro: "This example uses a prompt to retrieve the name. The returnvalue is handled by the promise and will be shown by an alert."
---

<p class="spaced">Code-example:</p>


```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        askName = ITSA.prompt('Please enter your name:', 'someone', 'Name');

    askName.then(function(value) {
        ITSA.alert('Your name is: '+value);
    });
</script>
```

<script src="../../dist/itsabuild.js"></script>
<script>
    var ITSA = require('itsa'),
        askAge = ITSA.getNumber('Please enter your age:', 20, 0, 100, false, {label: 'Age'});

    askAge.then(function(value) {
        ITSA.alert('Your age is: '+value);
    });
</script>
