---
module: client-db
maintainer: Marco Asbreuk
title: database storage
intro: "This example uses a prompt to retrieve the name. The returnvalue is handled by the promise and will be shown by an alert."
---

<p class="spaced">Code-example:</p>


```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        databaseName = 'my_database',
        version = 1,
        tables = [
            {
                name: 'presidents',
                uniqueIndexes: ['name'],
                indexes: ['birth', 'lastName']
            }
        ],
        db, savePromise;

    db = new ITSA.DB(databaseName, version, tables);

    savePromise = db.set('president1', {name: 'Barack', lastName: 'Obama', 'birth': 1961});

    // wait for saving to be finished before reading it
    savePromise.then(
        function() {
            db.read('presidents', 'birth', 1961).then(
                function(president) {
                    ITSA.alert('found: '+president.name+' '+president.lastName);
                }
            ).catch(function(err) {ITSA.warn(err);});
        }
    ).catch(function(err) {ITSA.warn(err);})
    .finally(function() {
        // cleanup
        db.deleteDatabase();
    });
</script>
```

<script src="../../dist/itsabuild.js"></script>
<script>
    var ITSA = require('itsa'),
        databaseName = 'my_database',
        version = 1,
        tables = [
            {
                name: 'presidents',
                uniqueIndexes: ['name'],
                indexes: ['birth', 'lastName']
            }
        ],
        db, savePromise;

    db = new ITSA.DB(databaseName, version, tables);

    savePromise = db.save('presidents', {name: 'Barack', lastName: 'Obama', 'birth': 1961});

    // wait for saving to be finished before reading it
    savePromise.then(
        function() {
            db.read('presidents', 'birth', 1961).then(
                function(president) {
                    ITSA.alert('found: '+president.name+' '+president.lastName);
                }
            ).catch(function(err) {ITSA.warn(err);});
        }
    ).catch(function(err) {ITSA.warn(err);})
    .finally(function() {
        // cleanup
        db.deleteDatabase();
    });

</script>
