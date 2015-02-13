---
module: event
maintainer: Marco Asbreuk
title: Class listening
intro: "Listening for events can be done by Event.after, but also by .after on an object or Class-instance. This example demonstrates the latter. You can add this functionality on the instance, by merging Event.Listener."
---
Click on the buttonto save profile.

<button id="buttongo" class="pure-button pure-button-primary pure-button-bordered">Save profile</button>

Code-example:

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');
    // create Class "Members" and merge ITSA.Event.Listener to the prototype:
    var Members = ITSA.Classes.createClass(null, ITSA.Event.Listener),
        myMembers = new Members();
    myMembers.after('PersonalProfile:save', function(e) {
        alert('personal profile is saved');
    });

    ITSA.Event.after(
        'tap',
        function() {
            ITSA.Event.emit('PersonalProfile:save');
        },
        '#buttongo'
    );
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');
    // create Class "Members" and merge ITSA.Event.Listener to the prototype:
    var Members = ITSA.Classes.createClass(null, ITSA.Event.Listener),
        myMembers = new Members();
    myMembers.after('PersonalProfile:save', function(e) {
        alert('personal profile is saved');
    });

    ITSA.Event.after(
        'tap',
        function() {
            ITSA.Event.emit('PersonalProfile:save');
        },
        '#buttongo'
    );
</script>