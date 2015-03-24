---
module: client-storage
maintainer: Marco Asbreuk
title: client-storage2
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
        db = new ITSA.ClientStorage('my_namespace5'),
        hash = [];

    hash.push(db.set('president1', {name: 'Barack', lastName: 'Obama', 'birth': 1961}));
    hash.push(db.set('president2', {name: 'John F.', lastName: 'Kennedy', 'birth': 1917}));
    hash.push(db.set('president2', {name: 'John F.', lastName: 'Kennedy another', 'birth': 1917}));
    hash.push(db.set('president3', {name: 'Bill', lastName: 'Clinton', 'birth': 1946}));

    window.Promise.finishAll(hash).finally(function() {
        db.deleteStorage().then(
            function(response) {
console.warn('removal ok');
            },
            function(err) {
console.warn('removal errored');
console.warn(err);

            }
        );
    });

</script>
