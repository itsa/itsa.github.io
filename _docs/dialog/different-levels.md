---
module: dialog
maintainer: Marco Asbreuk
title: different levels
intro: "This example generates three dialog-messages. The last one (after 1.5 sec delay) is a warning and will overrule the regular messages."
---

<p class="spaced">Code-example:</p>


```js
<script src="itsabuild-min.js"></script>
<script>
    ITSA.alert('I am the first alert');
    ITSA.alert('I a second first alert');

    ITSA.later(function() {
        ITSA.warn('i am a warning');
    }, 1500);

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    ITSA.alert('I am the first alert');
    ITSA.alert('I a second first alert');

    ITSA.later(function() {
        ITSA.warn('i am a warning');
    }, 1500);
</script>
