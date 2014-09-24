---
module: promise-ext
version: 0.0.1
maintainer: Marco Asbreuk
title: Promise Extentions
intro: "This module extends <b>Promise</b> by adding extra useful methods. Be sure you have native Promise on the system, or include a PromiseA+ compatible npm-module like <i>ypromise</i>."
firstpar: get-started
---

<b>Step 1:</b> create package.json

```json
{
    "name": "my-project",
    "version": "0.0.1",
    "dependencies": {
        "ypromise": "*",
        "promise-ext": "Parcela/promise-ext"
    }
}
```

<b>Step 2:</b> create your webapplication like this:

```js
<script>
    require('ypromise'); // will define Promise if not available natively
    require('promise-ext');

    var p1 = Promise.resolve(),
        p2 = Promise.resolve();

    Promise.finishAll([p1, p2]).then(
        function(response) {
            ...
        }
    );
</script>
```

#Summary of Promise-methods#

##Static methods##

###Promise.chainFns###

Promise.**chainFns** could be seen as the _chained-version_ of Promise.all(). There is a big difference though: <u>you need to pass an array of function- or Promise-**references**</u>, _not invoked Promised_. These should be references, because Promise.chainFns() will invoke them when the time is ready.

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

Promises are meant to hold state. They can be pending or resolved and are supposed to resolve from the inside. The don't have a way to communicate by any handler and can't be resolved from outside without making workarrounds.

Promise.**manage**(`callbackFn`) returns a new Promise that is supposed to be managable from outside. You can pass in one argument: callbackFn. Promise.manage returns a new Promise which has three handlers:

* promise.fulfill
* promise.reject
* promise.callback

You can invoke promise.**callback**() which will invoke the original passed-in callbackFn - if any. The method promise.**fulfill**() and promise.**reject**() are meant to resolve the promise from outside, just like deferred can do.

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

##Instance methods##

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

This method is useful if you are in a Promise-chain where you want to get into the fulfilled channel, even if the chain got rejected before. It is comparable with .finally() only now you get a Promise in return which can use inside the chain.

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