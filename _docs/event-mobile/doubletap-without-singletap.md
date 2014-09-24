---
module: event-mobile
maintainer: Marco Asbreuk
title: doubletap without singletap
intro: "Normally, doubletap will emit a doubletap event and two singletap events. To prevent this, use Event.Hammer.requireFailure on both doubletap and tripletap. Not however, that a tap-event (single) will always wait until it is sure there was no double or tripletap. Therefore the userexperience will be slowered down."
---

<style type="text/css">
    #addbtn-container {
        margin: 2em 0;
        min-height: 2em;
    }
</style>

Doubletap on the `Show popup` to show a pop-up. Notice that the popup changes based on a single or doubletap.

<div id="addbtn-container">
    <button id="buttongo" class="pure-button pure-button-primary pure-button-bordered">Show popup</button>
</div>

Code-example:

```html
<body>
    <button id="buttongo" class="pure-button pure-button-primary pure-button-bordered">Show popup</button>
</body>
```

```js
<script src="parcela-min.js"></script>
<script>
    var Parcela = require('parcela');
    var showMsgSingle = function(e) {
        alert('Button was single tapped');
    };
    var showMsgDouble = function(e) {
        alert('Button was double tapped');
    };

    var singletap = Parcela.Event.Hammer.get('tap');
    var doubletap = Parcela.Event.Hammer.get('doubletap');
    var tripletap = Parcela.Event.Hammer.get('tripletap');

    singletap.requireFailure([tripletap, doubletap]);

    Parcela.Event.after('tap', showMsgSingle, '#buttongo');
    Parcela.Event.after('doubletap', showMsgDouble, '#buttongo');
</script>
```

<script src="../../dist/parcela-min.js"></script>
<script>
    var Parcela = require('parcela');
    var showMsgSingle = function(e) {
        alert('Button was single tapped');
    };
    var showMsgDouble = function(e) {
        alert('Button was double tapped');
    };

    var singletap = Parcela.Event.hammertime.get('tap');
    var doubletap = Parcela.Event.hammertime.get('doubletap');
    var tripletap = Parcela.Event.hammertime.get('tripletap');

    singletap.requireFailure([tripletap, doubletap]);

    Parcela.Event.after('tap', showMsgSingle, '#buttongo');
    Parcela.Event.after('doubletap', showMsgDouble, '#buttongo');
</script>
