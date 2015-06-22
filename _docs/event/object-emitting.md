---
module: event
maintainer: Marco Asbreuk
title: Object emission
intro: "Emitting events can be done by Event.emit, but <u>preferable by .emit on an Class-instance or object</u>. This example demonstrates the latter. You can add this functionality on the object (preferable the prototype), by merging Event.Emitter('emitterName').<br><br>Emitting this way is very high-performant and this is the preferred way to add emit-functionality to a large number of objects."
---
Click on the button to make "Marco 10" save.

<button id="buttongo" class="pure-button pure-button-primary pure-button-bordered">Save</button>

Code-example:

```html
<body>
    <button id="buttongo" class="pure-button pure-button-primary pure-button-bordered">Save</button>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    // first create prototype-object and merge ITSA.Event.Emitter to the prototype:
    var profileproto = ITSA.Event.Emitter('PersonalProfile'),
        profiles = [],
        i, myProfile;

    // create 100 profiles which all can emit through their prototype:
    for (i=0; i<100; i++) {
        myProfile = Object.create(profileproto);
        myProfile.name = 'Marco '+i;
        profiles.push(myProfile);
    }

    ITSA.Event.after(
        'PersonalProfile:save',
        function(e) {
            alert(e.target.name+' got saved');
        }
    );

    ITSA.Event.after(
        'tap',
        function() {
            // we make the 11'th element to emit the save-event:
            profiles[10].emit('save');
        },
        '#buttongo'
    );
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    // first create prototype-object and merge ITSA.Event.Emitter to the prototype:
    var profileproto = ITSA.Event.Emitter('PersonalProfile'),
        profiles = [],
        i, myProfile;

    // create 100 profiles which all can emit through their prototype:
    for (i=0; i<100; i++) {
        myProfile = Object.create(profileproto);
        myProfile.name = 'Marco '+i;
        profiles.push(myProfile);
    }

    ITSA.Event.after(
        'PersonalProfile:save',
        function(e) {
            alert(e.target.name+' got saved');
        }
    );

    ITSA.Event.after(
        'tap',
        function() {
            // we make the 11'th element to emit the save-event:
            profiles[10].emit('save');
        },
        '#buttongo'
    );
</script>