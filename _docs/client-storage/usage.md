---
module: client-storage
maintainer: Marco Asbreuk
title: Usage client-storage
intro: "This example shows how data can be stored using ClientStorage"
---

<p class="spaced">Code-example:</p>


```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        storage = new ITSA.ClientStorage('my_storage'),
        savePromise;

    savePromise = storage.set('president1', {name: 'Barack', lastName: 'Obama', 'birth': 1961})

    // wait for saving to be finished before reading it
    savePromise.then(
        function() {
            storage.get('president1').then(
                function(president) {
                    ITSA.alert('found: '+president.name+' '+president.lastName);
                }
            ).catch(function(err) {ITSA.warn(err);});
        }
    ).catch(function(err) {ITSA.warn(err);});
    .finally(function() {
        // cleanup
        db.deleteStorage();
    });

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        storage = new ITSA.ClientStorage('my_storage'),
        savePromise;

    savePromise = storage.set('president1', {name: 'Barack', lastName: 'Obama', 'birth': 1961})

    // wait for saving to be finished before reading it
    savePromise.then(
        function() {
            storage.get('president1').then(
                function(president) {
                    ITSA.alert('found: '+president.name+' '+president.lastName);
                }
            ).catch(function(err) {ITSA.warn(err);});
        }
    ).catch(function(err) {ITSA.warn(err);});
    .finally(function() {
        // cleanup
        db.deleteStorage();
    });

</script>
