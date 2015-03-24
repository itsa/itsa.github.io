---
module: client-storage
maintainer: Marco Asbreuk
title: client-storage
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
        databaseName = 'test_version',
        databaseVersion = 2,
        tablesUnique = [
            {
                name: 'presidents',
                uniqueIndexes: ['name'],
                indexes: ['birth', 'lastName']
            }
        ],
        db;

    db = new ITSA.DB(databaseName, databaseVersion, tablesUnique);

        db.save('presidents', {name: 'John F.', lastName: 'Kennedy', 'birth': 1917}, true).catch(function(err) {console.warn(err);});
        db.save('presidents', {name: 'Bill', lastName: 'Clinton', 'birth': 1946}, true).catch(function(err) {console.warn(err);});

    db.save('presidents', {name: 'Barack', lastName: 'Obama', 'birth': 1961}, true).then(
        function(result) {
            console.warn('OBAMA SAVE OK:');
            console.warn(result);
        },
        function(err) {
            console.warn('OBAMA SAVE ERROR:');
            console.warn(err);
        }
    );

    db.save('presidents', {name: 'John F.', lastName: 'Kennedy another 4', 'birth': 1917}, true).then(
        function(result) {
            console.warn('KENNEDY SAVE OK:');
            console.warn(result);
        },
        function(err) {
            console.warn('KENNEDY SAVE ERROR:');
            console.warn(err);
        }
    );


    // db.read('presidents', 'birth', 19612).then(
    //     function(result) {
    //         console.warn('READ OK:');
    //         console.warn(result);
    //     },
    //     function(err) {
    //         console.warn('READ ERROR:');
    //         console.warn(err);
    //     }
    // );
// ITSA.later(function() {
    // db.deleteDatabase();
// }, 10000);
</script>
