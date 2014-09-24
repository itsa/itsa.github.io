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
<script src="parcela-min.js"></script>
<script>
    var Parcela = require('parcela');
    var afterTap = function(e) {
        // the alert will never pop-up
        alert('Button #buttongo is tapped');
    };
    var beforeTap = function(e) {
        e.preventDefault();
    };

    Parcela.Event.before('tap', beforeTap, '#buttongo');
    Parcela.Event.after('tap', afterTap, '#buttongo');
</script>
```

<script src="../../dist/parcela.js"></script>
<script>
    var Parcela = require('parcela');
    var afterTap = function(e) {
        // the alert will never pop-up
        alert('Button #buttongo is tapped');
    };
    var beforeTap = function(e) {
        e.preventDefault();
    };

    Parcela.Event.before('tap', beforeTap, '#buttongo');
    Parcela.Event.after('tap', afterTap, '#buttongo');
</script>