---
module: event-dom
maintainer: Marco Asbreuk
title: DOM after-events
intro: "DOM-events do not have after-listeners by default. However, <b>event-dom</b> has.<br>You can type anything in the text-box and the event shows the new value."
---

<style type="text/css">
    #input-container {
        margin-top: 2em;
        min-height: 2.1em;
    }
    #container {
        margin: 2em 0;
        padding: 1em;
        min-height: 4.6em;
        background-color: #ddd;
    }
</style>

Enter some text:

<div id="input-container">
    <input id="example" />
</div>
<div id="container"></div>


Code-example:

```html
<body>
    <div id="input-container">
        <input id="example" />
    </div>
    <div id="container"></div>
</body>
```

```js
<script src="parcela-min.js"></script>
<script>
    var Parcela = require('parcela');
    var container = document.getElementById('container');

    var showMsg = function(e) {
        container.innerHTML = e.target.value;
    };

    Parcela.Event.after('keypress', showMsg, '#example');
</script>
```

<script src="../../dist/parcela-min.js"></script>
<script>
    var Parcela = require('parcela');
    var container = document.getElementById('container');

    var showMsg = function(e) {
        container.innerHTML = e.target.value;
    };

    Parcela.Event.after('keypress', showMsg, '#example');
</script>
