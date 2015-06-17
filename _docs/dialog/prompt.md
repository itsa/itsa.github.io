---
module: dialog
maintainer: Marco Asbreuk
title: prompt
intro: "This example uses a prompt to retrieve the name. The returnvalue is handled by the promise and will be shown by an alert."
---

<p class="spaced">Code-example:</p>


```js
<script src="itsabuild-min.js"></script>
<script>
    var askName = ITSA.prompt('Please enter your name:', 'someone', 'Name');

    askName.then(function(value) {
        ITSA.alert('Your name is: '+value);
    });

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var askName = ITSA.prompt('Please enter your name:', {defaultValue: 'someone', label: 'Name'});

    askName.then(function(value) {
        ITSA.alert('Your name is: '+value);
    });
</script>
