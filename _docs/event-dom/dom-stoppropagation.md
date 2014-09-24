---
module: event-dom
maintainer: Marco Asbreuk
title: DOM stopPropagation
intro: "DOM-events bubble up the dom-tree. Subscribers may call e.stopImmediatePropagation() or e.stopPropagation() in order to stop listeners higher up the dom-tree."
---

<style type="text/css">
    #container {
        margin: 2em 0;
        padding: 1em;
        min-height: 3em;
        background-color: #ddd;
    }
    button.pure-button {
        margin: 0.5em;
        display: block;
        min-width: 23em;
    }
</style>

Click on the buttons to see how the subscribers are invoked.

<div id="master-container">
    <div id="child-container">
        <div id="child-child-container">
            <button id="stop" class="pure-button pure-button-primary pure-button-bordered">START with e.stopPropagation()</button>
            <button id="stopImmediate" class="pure-button pure-button-primary pure-button-bordered">START with e.stopImmediatePropagation()</button>
            <button class="pure-button pure-button-primary pure-button-bordered">START without interuption</button>
            <button class="clear pure-button pure-button-primary pure-button-bordered">CLEAR CONSOLE</button>
        </div>
    </div>
</div>

<div id="container"></div>

Code-example:

```html
<body>
    <div id="master-container">
        <div id="child-container">
            <div id="child-child-container">
                <button id="stop">START with e.stopPropagation()</button>
                <button id="stopImmediate">START with e.stopImmediatePropagation()</button>
                <button>START without interuption</button>
                <button class="clear">CLEAR CONSOLE</button>
            </div>
        </div>
    </div>
    <div id="container"></div>
</body>
```

```js
<script src="parcela-min.js"></script>
<script>
    var Parcela = require('parcela');
    var container = document.getElementById('container'),
        addText = function(text) {
            var div = document.createElement('div');
            div.innerHTML = text;
            container.appendChild(div);
        };

    //====================================================

    Parcela.Event.after('click', function() {
        addText('after click --> document');
    });

    Parcela.Event.after('click', function() {
        addText('after click --> master-container');
    }, '#master-container');

    Parcela.Event.after('click', function() {
        addText('after click --> child-container');
    }, '#child-container');

    Parcela.Event.after('click', function() {
        addText('after click --> child-child-container');
    }, '#child-child-container');

    //====================================================

    Parcela.Event.before('click', function() {
        addText('before click --> document before');
    });

    Parcela.Event.before('click', function() {
        addText('before click --> master-container');
    }, '#master-container');

    Parcela.Event.before('click', function(e) {
        addText('before click --> child-container first subscriber');
    }, '#child-container');

    Parcela.Event.before('click', function(e) {
        if (e.sourceTarget.id==='stop') {
            e.stopPropagation();
        }
        if (e.sourceTarget.id==='stopImmediate') {
            e.stopImmediatePropagation();
        }
        addText('before click --> child-container second subscriber');
    }, '#child-container');

    Parcela.Event.before('click', function(e) {
        addText('before click --> child-container third subscriber');
    }, '#child-container');

    Parcela.Event.before('click', function(e) {
        addText('before click --> child-child-container');
    }, '#child-child-container');

    //====================================================

    Parcela.Event.before('click', function(e) {
        container.innerHTML = '';
        e.halt();
    }, 'button.clear');
</script>
```

<script src="../../dist/parcela-min.js"></script>
<script>
    var Parcela = require('parcela');
    var container = document.getElementById('container'),
        addText = function(text) {
            var div = document.createElement('div');
            div.innerHTML = text;
            container.appendChild(div);
        };

    //====================================================

    Parcela.Event.after('click', function() {
        addText('after click --> document');
    });

    Parcela.Event.after('click', function() {
        addText('after click --> master-container');
    }, '#master-container');

    Parcela.Event.after('click', function() {
        addText('after click --> child-container');
    }, '#child-container');

    Parcela.Event.after('click', function() {
        addText('after click --> child-child-container');
    }, '#child-child-container');

    //====================================================

    Parcela.Event.before('click', function() {
        addText('before click --> document before');
    });

    Parcela.Event.before('click', function() {
        addText('before click --> master-container');
    }, '#master-container');

    Parcela.Event.before('click', function(e) {
        addText('before click --> child-container first subscriber');
    }, '#child-container');

    Parcela.Event.before('click', function(e) {
        if (e.sourceTarget.id==='stop') {
            e.stopPropagation();
        }
        if (e.sourceTarget.id==='stopImmediate') {
            e.stopImmediatePropagation();
        }
        addText('before click --> child-container second subscriber');
    }, '#child-container');

    Parcela.Event.before('click', function(e) {
        addText('before click --> child-container third subscriber');
    }, '#child-container');

    Parcela.Event.before('click', function(e) {
        addText('before click --> child-child-container');
    }, '#child-child-container');

    //====================================================

    Parcela.Event.before('click', function(e) {
        container.innerHTML = '';
        e.halt();
    }, 'button.clear');
</script>
