---
module: event-dom
maintainer: Marco Asbreuk
title: Preventing DOM-events
intro: "Events can be prevented by using a before-subscriber. Normally you would have logic here to determine whether or not preventDefault: this example preventDefaults always."
---

Click on the button: no alert will come.

<button id="buttongo" class="pure-button pure-button-primary pure-button-bordered">Click me</button>

Code-example:

```html
<body>
    <button id="buttongo" class="pure-button pure-button-primary pure-button-bordered">Click me</button>
</body>
```

```js
<script src="parcela-min.js"></script>
<script>
    var Parcela = require('parcela');
    var afterClick = function(e) {
        // the alert will never pop-up
        alert('Button #buttongo is clicked');
    };
    var beforeClick = function(e) {
        e.preventDefault();
    };

    Parcela.Event.before('click', beforeClick, '#buttongo');
    Parcela.Event.after('click', afterClick, '#buttongo');
</script>
```

<script src="../../dist/parcela-min.js"></script>
<script>
    var Parcela = require('parcela');
    var afterClick = function(e) {
        // the alert will never pop-up
        alert('Button #buttongo is clicked');
    };
    var beforeClick = function(e) {
        e.preventDefault();
    };

    Parcela.Event.before('click', beforeClick, '#buttongo');
    Parcela.Event.after('click', afterClick, '#buttongo');
</script>