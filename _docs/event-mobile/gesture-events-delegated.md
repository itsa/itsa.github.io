---
module: event-mobile
maintainer: Marco Asbreuk
title: Gesture-events delegated
intro: "All gesture-events are subscribed using delegation. Even if you are listening to one node by id-reference. Advantage of this approach is that you can setup the listeners without the need to worry whether the nodes are in the DOM. This examples shows how subscribers of a specific node as well as multiple nodes by a selector are set up. The subscribers are setup before the nodes are in the DOM."
---

<style type="text/css">
    #addbtn-container {
        margin-top: 2em;
        min-height: 2.1em;
    }
    #container {
        margin: 2em 0;
        padding: 1em;
        min-height: 4.6em;
        background-color: #ddd;
    }
    #container button {
        margin: 0.25em;
    }
</style>

Tap on the `Add-button` to add some extra buttons. Tap on those extra buttons to show a pop-up.

<div id="addbtn-container"></div>
<div id="container"></div>


Code-example:

```html
<body>
    <div id="addbtn-container"></div>
    <div id="container"></div>
</body>
```

```js
<script src="parcela-min.js"></script>
<script>
    var Parcela = require('parcela');
    var count, container, addNewButton, showButtonText;

    count = 0;
    container = document.getElementById('container');

    addNewButton = function(e) {
        var button = document.createElement('button');
        count++;
        button.className = 'pure-button pure-button-primary pure-button-bordered';
        button.innerHTML = 'Tap me '+count;
        container.appendChild(button);
    };

    showButtonText = function(e) {
        alert(e.target.innerHTML);
    };

    Parcela.Event.after('tap', addNewButton, '#addbtn');
    Parcela.Event.after('tap', showButtonText, '#container button');

    setTimeout(function() {
        var button = document.createElement('button');
        button.id = 'addbtn';
        button.className = 'pure-button pure-button-primary pure-button-bordered';
        button.innerHTML = 'Add button';
        document.getElementById('addbtn-container').appendChild(button);
    }, 500);
</script>
```

<script src="../../dist/parcela-min.js"></script>
<script>
    var Parcela = require('parcela');
    var count, container, addNewButton, showButtonText;

    count = 0;
    container = document.getElementById('container');

    addNewButton = function(e) {
        var button = document.createElement('button');
        count++;
        button.className = 'pure-button pure-button-primary pure-button-bordered';
        button.innerHTML = 'Tap me '+count;
        container.appendChild(button);
    };

    showButtonText = function(e) {
        alert(e.target.innerHTML);
    };

    Parcela.Event.after('tap', addNewButton, '#addbtn');
    Parcela.Event.after('tap', showButtonText, '#container button');

    setTimeout(function() {
        var button = document.createElement('button');
        button.id = 'addbtn';
        button.className = 'pure-button pure-button-primary pure-button-bordered';
        button.innerHTML = 'Add button';
        document.getElementById('addbtn-container').appendChild(button);
    }, 500);
</script>
