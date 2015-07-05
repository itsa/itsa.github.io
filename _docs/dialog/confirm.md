---
module: dialog
maintainer: Marco Asbreuk
title: confirm
intro: "This example uses confirm to retrieve validation. The returnvalue is handled by the promise and will be shown by an alert."
---

<p class="spaced">Code-example:</p>


```js
<script src="itsabuild-min.js"></script>
<script>
    var ask = ITSA.confirm('Do you want to continue?');

    ask.then(function(value) {
        if (value) {
            ITSA.alert('Agreed');
        }
        else {
            ITSA.alert('Disagreed');
        }
    });

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ask = ITSA.confirm('Do you want to continue?');

    ask.then(function(value) {
        if (value) {
            ITSA.alert('Agreed');
        }
        else {
            ITSA.alert('Disagreed');
        }
    });
</script>
