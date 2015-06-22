---
module: client-storage
maintainer: Marco Asbreuk
title: Usage ITSA.localStorage
intro: "This example shows how data can be stored using ITSA.localStorage"
---

<p class="spaced">Code-example:</p>


```js
<script src="itsabuild-min.js"></script>
<script>
    var savePromise = ITSA.localStorage.set('president1', {name: 'Barack', lastName: 'Obama', 'birth': 1961});

    // wait for saving to be finished before reading it
    savePromise.then(
        function() {
            ITSA.localStorage.get('president1').then(
                function(president) {
                    ITSA.alert('found: '+president.name+' '+president.lastName);
                }
            ).catch(function(err) {ITSA.warn(err);});
        }
    ).catch(function(err) {ITSA.warn(err);})
    .finally(function() {
        // cleanup
        ITSA.localStorage.delete('president1');
    });

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var savePromise = ITSA.localStorage.set('president1', {name: 'Barack', lastName: 'Obama', 'birth': 1961});

    // wait for saving to be finished before reading it
    savePromise.then(
        function() {
            ITSA.localStorage.get('president1').then(
                function(president) {
                    ITSA.alert('found: '+president.name+' '+president.lastName);
                }
            ).catch(function(err) {ITSA.warn(err);});
        }
    ).catch(function(err) {ITSA.warn(err);})
    .finally(function() {
        // cleanup
        return ITSA.localStorage.delete('president1');
    })
    .catch(function(err) {ITSA.warn(err);})

</script>
