---
module: event-mobile
maintainer: Marco Asbreuk
title: Preventing gesture-events
intro: "Events can be prevented by using a before-subscriber. Normally you would have logic here to determine whether or not preventDefault: this example preventDefaults always."
---

Tap on the button: no alert will come.

<button id="buttongo" class="pure-button pure-button-primary pure-button-bordered">Tap me</button>

Code-example:

```html
<body>
    <button id="buttongo" class="pure-button pure-button-primary pure-button-bordered">Tap me</button>
</body>
```

```js
<script src="itsabuild.js"></script>
<script>
    var ITSA = require('itsa');
    var afterTap = function(e) {
        // the alert will never pop-up
        alert('Button #buttongo is tapped');
    };
    var beforeTap = function(e) {
        e.preventDefault();
    };

    ITSA.Event.before('tap', beforeTap, '#buttongo');
    ITSA.Event.after('tap', afterTap, '#buttongo');
</script>
```

<script src="../../dist/itsabuild.js"></script>
<script>
    var ITSA = require('itsa');
    var afterTap = function(e) {
        // the alert will never pop-up
        alert('Button #buttongo is tapped');
    };
    var beforeTap = function(e) {
        e.preventDefault();
    };

    ITSA.Event.before('tap', beforeTap, '#buttongo');
    ITSA.Event.after('tap', afterTap, '#buttongo');
</script>