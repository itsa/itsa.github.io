---
module: client-storage
itsaclassname: LocalStorage
version: 0.0.1
modulesize: 1.99
modulesizecombined: 15.32
dependencies: "polyfill/polyfill-base.js, js-ext/lib/function.js, js-ext/lib/object.js, utils, event"
maintainer: Marco Asbreuk
title: Dialog to process messages
intro: "This module processes messages by prompting a modal panel."
firstpar: get-started-onlywindow
extracodefirstpar:
---

#The Basics#

The `messages`-module generates messages by emitting appropriate events. This module subscribes to the following events:

* *:message
* *:warn
* *:error

These events are caught and handled by `dialog`. When multiple messages occur simultaniously, the get inside a queue, where all messages are handled one by one (FIFO). However, `error`-messages have higher priority than `warn`-messages, which have higher priority than normal messages. When a messages gets in the queue that has a higher priority than the current message displayed, the the current messages gets back in the queue, to enable the higher-priority message to be displayed.

Messages get finished once the dialog-panel is closed (on of the button is pressed), which will resolve the message-promise. When a message-promise inside the queue gets resolved, it will be removed out of the queue.

####Example alert####
```js
ITSA.alert('I am an alert').then(
    function() {
        // the message is closed here
    }
);
```

####Example prompt####
```js
var askName = ITSA.prompt('Please enter your name:', {defaultValue: 'someone', label: 'Name'});

askName.then(function(value) {
    ITSA.alert('Your name is: '+value);
});
```