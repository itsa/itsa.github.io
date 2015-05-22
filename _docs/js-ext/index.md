---
module: js-ext
itsaclassname:
version: 0.0.1
modulesize: 3.59
dependencies: "polyfill-base, ypromise (npm)"
maintainer: Marco Asbreuk
title: Extra functionality for basic objects
intro: "Adds several methods to Object, Function and Promise that are frequently used"
firstpar: get-started
---

#The Basics#

The `forEach` method added functional programing style looping through arrays, as did several other methods such as  `map`, or `some`.  That functionality is sorely lacking in `Object` which has the added complication of having to check via `hasOwnProperty` to see if the named member belongs to the object or has been inherited.

This module adds some easy to use methods to Object and a few to Function that allow for a kind of classical inheritance without ES6.

All this functionality is present in several libraries as functions that operate on the affected objects.  We think it makes no longer sense to do it this way.  The new methods are being added as non-enumerable methods so that they should not show when looping through an object.  Besides, when looping through an object, you should always have had to check for `hasOwnProperties` which would not list these.

##Object extensions##

Object has the following new methods.  They all check for `hasOwnProperty` or equivalent functionality.

### each

Like Array's `forEach` it loops through an object and calls the given function, optionally in the given context, passing it the value of the property, the name of the property and a copy of the whole object, a similar order of arguments to `forEach`.

```js
{a:1, b:2}.each(function(value, key) {
    console.log(key + ': ' value);
});
// Prints
// a: 1
// b: 2
```

### some

Like Array's `some` will loop through an object until the called function returns true.  The function will return true if any of the calls returned true (the condition was met) or false if no function returned true.

```js
console.log({a:1, b:2}.some(function(value, key) {
    return value === 2;
}));
// Prints true
```

### map

Like the similarly named method of Array, it will loop through an object returning a new object with the same keys but the values as returned by the function.  The function cannot change the keys themselves, the function receives them just for reference.  If the function returns `undefined` that property will not be included in the resulting object.

```js
console.log({a:1, b:2}.each(function(value, key) {
    return value * 2;
});
// Prints
// {a: 2, b: 4}
```

### keys

Returns an array with the names of the properties in the object.

```js
console.log({a: 1, b: 2}.keys());
// prints ['a', 'b']
// Same as:
console.log(Object.keys({a: 1, b: 2}));
```

### size

Returns the number of keys in the object.

```js
console.log({a: 15, b: 25}.size());
// prints 2
```

### toArray

Transforms the object into an array with  'key/value' objects

```js
console.log({country: 'USA', Continent: 'North America'}.toArray());
// prints [{key: 'country', value: 'USA'}, {key: 'Continent', value: 'North America'}]
```

### values

Returns an array with the values of the properties.

```js
console.log({a: 1, b: 2}.values());
// prints [1, 2]
```

### isEmpty

Returns true if the object has no properties of its own.

```js
console.log({}.isEmpty());     // true
console.log({a:1}.isEmpty());  // false
```

### shallowClone

Returns a shallow clone of the object.  Properties that are themselves references will not be traversed, thus, the cloned object would have a reference to the same object as the original.  It is handy and fast for objects that are known not to be deep.

If an object has a few properties known to contain shallow objects, it is easy to do a fast slightly deeper clone like this:

```js
var obj = {a: 1, b: 2, deep: {c:3, d:4}};
var newObj = obj.shallowClone();
newObj.deep = obj.deep.shallowClone();
```

### deepClone

Returns a deep copy of the object. Only handles members of primary types, Dates, Arrays and Objects.


### merge

Merges into the object a set of properties taken from another object.  Properties with the same name will be preserved unless the second argument is passed as true.  The original object is changed.  The method is chainable.

```js
var a = {a: 1, b: 2};
a.merge({b:99, c: 3}).merge({a:44, d:4}, true);
console.log(a);
// Prints:
// {a: 44, b:2, c: 3, d: 4}
```

### sameValue

Compares this object with the reference-object whether they have the same value. Not by reference, but their content as simple types.


### Object.merge

_(static method)_

Returns a new object resulting of merging the properties of the objects passed as its arguments.   If several objects have properties with the same name, the first one will prevail.

A useful example is filling up a configuration object with default values.

```js
var init = function (config) {
    config = Object.merge(config, defaultConfig);
}
```

The `config` argument can be missing but after calling `Object.merge` it will always be an object. In either case the returned object will have the properties in `defaultConfig` filling in the missing properties in `config`.

### Object.isObject

_(static method)_

Returns true when an object passed. Will return false for Array, Functions, RegExp, Date and Error objects.

```js
    var a = {};
    isObj = Object.isObject(a);
```

##String extensions##

String gets extended with the following new methods:

###endsWith###
Checks if the string ends with the value specified by `test`.

###parsable###
Checks if the string can be parsed into a number when using `parseInt()`

###startsWith###
Checks if the string starts with the value specified by `test`.

###substitute###
Performs `{placeholder}` substitution on a string.

###toDate###
Returns a ISO-8601 Date-object build by the String's value.

###trim###
Generated the string without any white-spaces at the start or end.

###trimLeft###
Generated the string without any white-spaces at the beginning.

###trimRight###
Generated the string without any white-spaces at the end.

###validateEmail###
Validates if the String's value represents a valid emailaddress.

###validateFloat###
Validates if the String's value represents a valid floated number.

###validateHexaColor###
Validates if the String's value represents a hexadecimal color.

###validateNumber###
Validates if the String's value represents a valid integer number.

###validateURL###
Validates if the String's value represents a valid URL.


##Array extensions##

Array gets extended with the following new methods:

###contains###
Checks whether an item is inside the Array. Alias for (array.indexOf(item) > -1).

###remove###
Removes an item from the array.


### deepClone
Returns a deep copy of the Array. Only handles members of primary types, Dates, Arrays and Objects.

###shuffle###
Shuffles the items in the Array randomly.


##Math extensions##

Math gets extended with the following new methods:

###inbetween###
Returns the value, while forcing it to be inbetween the specified edges.

###floorToZero###
Floors a value in the direction to zero.

###ceilFromZero###
Ceils a value from zero up.


##JSON extentions##

###parseWithDate###
Parses a stringified object and creates true `Date` properties.

###stringifyEscaped###
Stringifies an object while escaping the ' character. To be used together with parseEscaped.

###parseEscaped###
Parses anything that was stringified using 'stringifyEscaped'.


##Promise extentions##

###Promise.chainFns###

_(static method)_

Promise.**chainFns** could be seen as the _chained-version_ of Promise.all(). There is a big difference though: <u>you need to pass an array of function- or Promise-**references**</u>, _not invoked Promises_. These should be references, because Promise.chainFns() will invoke them when the time is ready.

The returnvalue of the functions is irrelevant. But if one of the functions returns a Promise, the chain will wait its execution for this function to be resolved. If one of the items returns a rejected Promise, the whole chain rejects by default, unless the second argument (finishAll) is set true. Preceding functions won't be invoked.

####chaining functions####
```js
p1 = function() {
    return Promise.resolve(5);
};

// note that p2 returns a simple type, not a Promise
p2 = function(amount) {
    // amount===5 --> passed through by p1
    return 10*amount;
};

p3 = function(amount) {
    // amount===50 --> passed through by p2
    return Promise.resolve(amount*5);
};

Promise.chainFns([p1, p2, p3]).then(
    function(total) {
        // total==250;
    }
);
```

###Promise.finishAll###

_(static method)_

Promise.**finishAll** returns a Promise that always fulfills. It is fulfilled when <u>all items are resolved</u> (either fulfilled or rejected).

This is useful for waiting for the resolution of multiple promises, such as reading multiple files in Node.js or making multiple XHR requests in the browser. Because -on the contrary of `Promise.all`- **finishAll** waits until all single Promises are resolved, you can handle all promises, even if some gets rejected.

####batching promises and wait for all to be finished####
```js
p1 = IO.send('/sendSMS', smsData1);
p2 = IO.send('/sendSMS', smsData2);
p3 = IO.send('/sendSMS', smsData3);

simulateRejectedP2 = p2.then(function() {
    throw new Error('we simulate the IO failed');
});

Promise.finishAll([p1, simulateRejectedP2, p3]).then(
    function(response) {
        // all SMS is send, either succesfully or with failures
    }
);

```
If you need to examine individual responses, `response` has 2 properties: response.**fulfilled** and response.**rejected**: both are arrays with the same length: each position hold the `returnvalue`, or `undefined` if the returnvalue is present in the other array.

###Promise.manage###

_(static method)_

Promises are meant to hold state. They can be pending or resolved and are supposed to resolve from the inside. The don't have a way to communicate by any handler and can't be resolved from outside without making workarrounds.

Promise.**manage**(`callbackFn`) returns a new Promise that is supposed to be managable from outside. You can pass in one argument: callbackFn. Promise.manage returns a new Promise which has three handlers:

* promise.fulfill
* promise.reject
* promise.callback
* promise.setCallback
* promise.pending

You can invoke promise.**callback**() which will invoke the original passed-in callbackFn - if any, or the callback which is set at a later time using `setCallback()`. The method promise.**fulfill**() and promise.**reject**() are meant to resolve the promise from outside, just like deferred can do.

####Promise.manage####
```js
var promise = Promise.manage(
    function(msg) {
        alert(msg);
    }
);

promise.then(
    function() {
        // promise is fulfilled, no further actions can be taken
    }
);

setTimeout(function() {
    promise.callback('hey, I\'m still busy');
}, 1000);

setTimeout(function() {
    promise.fulfill();
}, 2000);
```
**Note:** the _thennable_ (promise.then()) does not have these three methods: the thennable is a different Promise. You shouldn't need it at that point anyway, for the Promise is resolved at that stage.


###finally###
Every Promise-instance gets a .**finally**()-method at its prototype. You can call p.finally() at the very end of a chain, even after .catch().
This method will invoke the callback function regardless whether the chain resolves or rejects.

####p.finally()####
```js
setBodyMask(); // some function which makes a mask visible

p = IO.send('/sendSMS', smsData);

p.then(
    function() {
        alert('sms is send');
    },
    function() {
        alert('failed to send sms');
    }
)
.finally(hideBodyMask);

// hideBodyMask is some function that hides the mask
```

####p.finally() with .catch()####
```js
setBodyMask();

IO.send('/sendSMS', smsData)
.then(
    function() {
        alert('sms is send');
    }
)
.catch(
    function(err) {
        alert(err.message);
    }
)
.finally(hideBodyMask);
```


###thenFulfill###
Every Promise-instance gets a .**thenFulfill**()-method at its prototype. It is an alternative to .then in a way that it is fulfilled promise. Should the original promise be rejected, then .thenFulfill is fulfilled (with the rejected reason as argument).

This method is useful if you are in a Promise-chain where you want to get into the fulfilled chain, even if the chain got rejected before. It is comparable with .finally() only now you get a Promise in return which can use inside the chain.

####p.thenFulfill()####
```js
smsToUser1 = IO.send('/sendSMS', smsData1);
smsToUser2 = IO.send('/sendSMS', smsData2);
smsAdministratorConfirmation = IO.send('/sendSMS', smsConfirmation);

simulateRejectedSMS = smsToUser2.then(function() {
    throw new Error('we simulate the IO failed');
});


setBodyMask();

smsToUser1
.then(smsToUser1)
.then(simulateRejectedSMS)
.thenFulfill(smsAdministratorConfirmation) // will always be invoked
.finally(hideBodyMask);

```