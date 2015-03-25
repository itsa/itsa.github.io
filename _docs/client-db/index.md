---
module: client-db
itsaclassname: DB
version: 0.0.1
modulesize: 1.99
modulesizecombined: 15.32
dependencies: ""
maintainer: Marco Asbreuk
title: DB for storage of objects
intro: "This module creates storages for objects which can be retrieved convieniently or fast by indexes. The databases use <b>indexeddb</b>, or <b>localStorage</b> when indexeddb is not present. The localStorage polyfill has exactly the same features. Items can be retrieved by specifying a search-condition. When the search-condition uses indexes, retrieval is extremely fast."
firstpar: get-started-onlywindow
extracodefirstpar:
---

#The Basics#

DB is a `Class` that creates a database with a name, version and predefined tables. These tables have a name and optionally indexes can be specified.

Once a database is setup, you can use it to store and retrieve records. When setting up a database that does not exist, the database will be created. If a database of a previous version exists, it will be upgraded to the new version.

All methods are `Promise`-based. This means, you can use them, but need the thenable to inspect the returnvalues.


##Storage-system##

Under the hood, by default `indexeddb` is used as storagesystem. When indexeddb is not available, localStorage will be used, but upgraded so it has the same features.



#Usage#

You always need to use the exact database-definition before you can start using a DB-instance. This is required, because it will lead to a new database-definition when the client doesn't have it yet. Also this definition is responsible for version-upgrades.

####Example creating storage####
```js
var databaseName = 'myProject',
    version = 1, // needs to be a number
    tables = [
        {
            name: 'customers',
            uniqueIndexes: ['name'],
            indexes: ['birth']
        },
        {
            name: 'projects',
            uniqueIndexes: ['projectId'],
            indexes: ['name', 'location']
        }
    ],
    dbProjects;

dbProjects = new ITSA.DB(databaseName, version, tables);
```

####Example save a value####
```js
dbProjects.save('customers', {name: 'Barack', lastName: 'Obama', 'birth': 1961});
```

####Example save a value and inspect####
```js
dbProjects.save('customers', {name: 'Barack', lastName: 'Obama', 'birth': 1961}).then(
    function() {
        // record is stored
    }
).catch(function(err) {
    ITSA.warn(err);
});
```

####Example read a value####
```js
var key = 'name';
dbProjects.read('customers', key, 'Barack').then(
    function(record) {
        // record === {name: 'Barack', lastName: 'Obama', 'birth': 1961}
    }
).catch(function(err) {
    ITSA.warn(err);
});
```

The promises only rejects on errors. When reading a record that isn't available, the promise gets resolved with `undefined` as response-value.



#Storage-methods#

All examples are based upon the `myProject`-database above.

##Available methods##

###contains###
####Example contains####
```js
dbProjects.contains('customers', {name: 'Barack', lastName: 'Obama', 'birth': 1961}).then(
    function(result) {
        // result === true
    }
);
dbProjects.contains('customers', {name: 'Bill', lastName: 'Clinton', 'birth': 1946}).then(
    function(result) {
        // result === false
    }
);
```

###clear###
####Example clear####
```js
dbProjects.clear('customers').then(
    function() {
        dbProjects.contains('customers', {name: 'Barack', lastName: 'Obama', 'birth': 1961}).then(
            function(result) {
                // result === false
            }
        );
    }
);
```

###delete###
####Example delete####
```js
dbProjects.delete('customers', 'birth', [1960, 1961, 1962]).then(
    function() {
        dbProjects.contains('customers', {name: 'Barack', lastName: 'Obama', 'birth': 1961}).then(
            function(result) {
                // result === false
            }
        );
    }
);
```

###deleteDatabase###
####Example deleteDatabase####
```js
dbProjects.deleteDatabase();
// dbProjects should cannot be used anymore
```

###each###
####Example each####
```js
var years = 0;
dbProjects.each('customers', function(record) {
    years += record.birth;
}).then(
    function() {
        // years has the total amount of years of all Presidents
    }
);
```

###has###
####Example has####
```js
var key = 'birth';
dbProjects.has('customers', key, [1961, 1962]).then(
    function(result) {
        // result === true
    }
);
dbProjects.has('customers', key, 1999).then(
    function(result) {
        // result === false
    }
);
```

###read###
####Example get####
```js
var key = 'name';
dbProjects.read('customers', key, 'Barack').then(
    function(record) {
        // record === {name: 'Barack', lastName: 'Obama', 'birth': 1961}
    }
});
```

###readMany###
####Example get####
```js
var key = 'birth';
dbProjects.readMany('customers', key, 1961).then(
    function(records) {
        // records === [{name: 'Barack', lastName: 'Obama', 'birth': 1961}]
    }
});
```

###readAll###
####Example get####
```js
dbProjects.read('customers').then(
    function(records) {
        // records === [{name: 'Barack', lastName: 'Obama', 'birth': 1961}]
    }
});
```

###save###
####Example set####
```js
var president = {
        name: 'Barack',
        lastName: 'Obama',
        'birth': 1961
    };
dbProjects.save('customers', president);
```

###size###
####Example size####
```js
dbProjects.size('customers').then(
    function(value) {
        // value === size of table `customers`
    }
);
```

###some###
####Example some####
```js
dbProjects.some('customers', function(record) {
    return (record.birth===1917);
}).then(
    function(president) {
        // `president` is an object (JFK)
    }
);
```

```js
dbProjects.some('customers', function(record) {
    return (record.birth===1999);
}).then(
    function(president) {
        // `president` is `undefined`
    }
);
```