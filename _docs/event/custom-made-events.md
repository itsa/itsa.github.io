---
module: event
maintainer: Marco Asbreuk
title: Custom made events
intro: "Custom Made Events are customevents that are defined by Event.defineEvent(). They differ from DOM-events in a way that they have to be defined manually by the programmer; DOM-events are customevents which are created automaticly."
---

Click on the button to save the profile.

<button id="save" class="pure-button pure-button-primary pure-button-bordered">Save profile</button>

Code-example:

```html
<body>
    <button id="save" class="pure-button pure-button-primary pure-button-bordered">Save profile</button>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var Profile = ITSA.Classes.createClass(null, ITSA.Event.Emitter('PersonalProfile')),
        myProfile = new Profile();

    myProfile.defineEvent('save') // defines "PersonalProfile:save"
             .defaultFn(function(e) {
                 alert('personal profile was saved');
             });

    ITSA.Event.after('tap', function() {
        myProfile.emit('save');
    }, '#save');
</script>
```


<script src="../../dist/itsabuild-min.js"></script>
<script>
    var Profile = ITSA.Classes.createClass(null, ITSA.Event.Emitter('PersonalProfile')),
        myProfile = new Profile();

    myProfile.defineEvent('save') // defines "PersonalProfile:save"
             .defaultFn(function(e) {
                 alert('personal profile was saved');
             });

    ITSA.Event.after('tap', function() {
        myProfile.emit('save');
    }, '#save');
</script>