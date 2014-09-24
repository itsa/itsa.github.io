---
module: event-dom
maintainer: Marco Asbreuk
title: DOM-events NEW
intro: "DOM-events can be listened by without an emitterName. By using the `filter`-argument you specify which node to listen to. Because the filter (selector) is a String, we can pass it as 3rd parameter."
---

<style type="text/css">
    #addbtn-container {
        margin: 2em 0;
        min-height: 2em;
    }
</style>

Click on the `Show popup` to to show a pop-up.

<div id="addbtn-container">
    <button id="buttongo" class="pure-button pure-button-primary pure-button-bordered"><i id="the-i">Show</i> popup</button>
    <button id="buttongo2" class="pure-button pure-button-primary pure-button-bordered">Show popup</button>
    <button id="buttongo3" class="pure-button pure-button-primary pure-button-bordered">Show popup</button>
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

    var showMsg = function(e) {
        alert('Button was clicked');
        console.log(e);
    };

    Parcela.Event.after('click', showMsg, '#buttongo');
</script>
```

<script src="../../dist/parcela.js"></script>
<script>
    var Parcela = require('parcela');

    var showMsg = function(e) {
        e.a || (e.a=0);
        e.a++;
        console.info('Button was '+e.a+'x before clicked '+e.node.id);
        e.preventDefault();
console.info('CHECK WIL INVOKE AFTER: '+!e.defaultPrevented);
    };

    var showMsgA = function(e) {
        e.a || (e.a=0);
        e.a++;
        console.info('Button was '+e.a+'x after clicked '+e.node.id);
    };

    // Parcela.Event.after('click', showMsgA, '#buttongo');
    Parcela.Event.before('click', showMsg, 'div');

</script>
