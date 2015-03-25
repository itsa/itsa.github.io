---
module: client-storage
itsaclassname: ClientStorage
version: 0.0.1
modulesize: 1.99
modulesizecombined: 15.32
dependencies: ""
maintainer: Marco Asbreuk
title: ClientStorage for storage of key-value pairs
intro: "This module works as an alternative for localStorage. It has almost the same API, but with more features. It uses the module `client-db` for storage, thus in most environments indexeddb will be used as storagemechanism. Those environments that use localStorage, will have exactly the same features."
firstpar: get-started-onlywindow
extracodefirstpar:
---

#The Basics#

ClientStorage is a `Class` that creates a store under a specific namespace. Multiple stores can be set up simultaniously. Once set up, you can `set` and `get` items to and from the store. The keys are unique `String`-types, the values can be any type: objects (even Data-objects) retain their structure.

All methods are `Promise`-based. This means, you can use them, but need the thenable to inspect the returnvalues.


##Differences with native localStorage##

* You can create multiple storages in separate namespaces
* The storeed values can be of any type (not just Strings)
* All methods are Promise-based
* Extra methods like `clear`, `size`, `each` and `some`


#Usage#

First, you need to initiate a storage. If the specified storage is already available, you get a reference to it, otherwise you get a reference to a new created store:

####Example creating storage####
```js
var presidentsStorage = new ITSA.ClientStorage('presidents');
```

####Example store a value####
```js
var presidentsStorage = new ITSA.ClientStorage('presidents'),
    president = {
        name: 'John F.',
        lastName: 'Kennedy',
        'birth': 1917
    };
presidentsStorage.set('president1': president);
```

####Example store a value and inspect####
```js
var presidentsStorage = new ITSA.ClientStorage('presidents'),
    president = {
        name: 'John F.',
        lastName: 'Kennedy',
        'birth': 1917
    };
presidentsStorage.set('president1': president).then(
    function() {
        // storage succeeded
    },
    function(err) {
        console.warn(err);
    }
);
```

####Example retrieve a value####
```js
var presidentsStorage = new ITSA.ClientStorage('presidents');

presidentsStorage.get('president1').then(
    function(president) {
        // `president` is an object (JFK)
        // in case of no record: `president`===`undefined`
    },
    function(err) {
        console.warn(err);
    }
);
```

The promises only rejects on errors. When retrieving a record that isn't available, the promise gets resolved with `undefined` as response-value.



#Storage-methods#

All examples are based upon the `presidents`-storage above.

##Available methods##

###contains###
####Example contains####
```js
presidentsStorage.contains({name: 'John F.', lastName: 'Kennedy', 'birth': 1917}).then(
    function(result) {
        // result === true
    }
);
presidentsStorage.contains({name: 'Bill', lastName: 'Clinton', 'birth': 1946}).then(
    function(result) {
        // result === false
    }
);
```

###clear###
####Example clear####
```js
presidentsStorage.clear().then(
    function() {
        presidentsStorage.contains({name: 'John F.', lastName: 'Kennedy', 'birth': 1917}).then(
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
presidentsStorage.delete('president1').then(
    function() {
        presidentsStorage.contains({name: 'John F.', lastName: 'Kennedy', 'birth': 1917}).then(
            function(result) {
                // result === false
            }
        );
    }
);
```

###deleteStorage###
####Example deleteStorage####
```js
presidentsStorage.deleteStorage();
// presidentsStorage should cannot be used anymore
```

###each###
####Example each####
```js
var years = 0;
presidentsStorage.each(function(record) {
    years += record.birth;
}).then(
    function() {
        // years has the total amount of years of all Presidents
    }
);
```

###get###
####Example get####
```js
presidentsStorage.get('president1').then(
    function(president) {
        // `president` is an object (JFK)
    }
);
```

###has###
####Example has####
```js
presidentsStorage.has('president1').then(
    function(result) {
        // result === true
    }
);
presidentsStorage.contains('president2').then(
    function(result) {
        // result === false
    }
);
```

###set###
####Example set####
```js
var president = {
        name: 'Barack',
        lastName: 'Obama',
        'birth': 1961
    };
presidentsStorage.set('president2': president);
```

###size###
####Example size####
```js
presidentsStorage.size().then(
    function(value) {
        // value === size of storage
    }
);
```

###some###
####Example some####
```js
presidentsStorage.some(function(record) {
    return (record.birth===1917);
}).then(
    function(president) {
        // `president` is an object (JFK)
    }
);
```

```js
presidentsStorage.some(function(record) {
    return (record.birth===1999);
}).then(
    function(president) {
        // `president` is `undefined`
    }
);
```



#ITSA.localStorage#

For convenience, `ITSA` already has an universal storage defined: `ITSA.localStorage`. This is just a `Client-Storage`-instance with a custom-global namespace. You can use this straight ahead:

####Example usage ITSA.localStorage####
```js
var president = {
        name: 'John F.',
        lastName: 'Kennedy',
        'birth': 1917
    };
ITSA.localStorage.set('president1': president);
```

```js
ITSA.localStorage.get('president1').then(
    function(president) {
        // ...
    }
);
```
