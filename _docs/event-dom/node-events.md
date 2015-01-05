---
module: event-dom
maintainer: Marco Asbreuk
title: node mutation-events
intro: "The hover-event is a single event. But it also notifies you when the hover has finished. You can inspect the Promise e.hover.then for this purpose."
---

<style type="text/css">
    #msg-container {
        margin: 2em 0;
        padding: 1em;
        background-color: #ddd;
        border: solid 1px #000;
    }
    #container {
        text-align: center;
        margin: 2em 0;
        padding: 0.5em;
        border: solid 1px #000;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: default;
    }
    #cont-1 {
        left: 50px;
        top: 300px;
    }
    #cont-2 {
        left: 180px;
        top: 300px;
    }
    #cont-3 {
        left: 50px;
        top: 440px;
    }
    #cont-4 {
        left: 180px;
        top: 440px;
    }
    #cont-5 {
        left: 115px;
        top: 365px;
        z-index: 2;
        background-color: #F00;
    }
    .body-content.module p.spaced {
        margin-top: 20em;
    }
</style>

Mouse the mouse over the 5 containers:

<div class="btn-container">
    <button id="insertNode" class="pure-button pure-button-bordered">Insert Node</button>
    <button id="removeNode" class="pure-button pure-button-bordered">Remove Node</button>
    <button id="setAttribute" class="pure-button pure-button-bordered">Set attribute</button>
    <button id="changeAttribute" class="pure-button pure-button-bordered">Change attribute</button>
    <button id="removeAttribute" class="pure-button pure-button-bordered">Remove attribute</button>
</div>

<div id="container"></div>

<div id="msg-container"></div>

<p class="spaced">Code-example:</p>

```html
<body>
    <div class="base-container">
        <div id="cont1" class="container"></div>
        <div id="cont2" class="container"></div>
        <div id="cont3" class="container"></div>
        <div id="cont4" class="container"></div>
        <div id="cont5" class="container"></div>
    </div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');
    var container = document.getElementById('container');

    var showMsg = function(e) {
        var node = e.target;
        node.innerHTML = 'Mouse entered';
        e.hover.then(function(relatedTarget) {
            node.innerHTML = relatedTarget.id ? 'Went to '+relatedTarget.id : '';
        });
    };

    ITSA.Event.after('hover', showMsg, '.container');
</script>
```

<script src="../../dist/itsabuild.js"></script>
<script>
    var ITSA = require('itsa'),
        container = document.getElement('#container'),
        msgContainer = document.getElement('#msg-container'),
        insertNode, removeNode, changeAttribute, showMessage;

    insertNode = function(e) {
        var node = document.getElement('#manipulated');
        msgContainer.empty(true);
        container.setHTML('<div id="manipulated">Node is inserted</div>');
        // container.setHTML('<div id="manipulated">Node <u id="inner-u">is inserted</u></div>');
    };

    removeNode = function(e) {
        msgContainer.empty(true);
        container.empty();
    };

    setAttribute = function(e) {
        var node = document.getElement('#manipulated');
        msgContainer.empty(true);
        if (node) {
            node.setAttrs([
                {name: 'data-x', value: 10},
                {name: 'data-y', value: 20}
            ]);
        }
    };

    changeAttribute = function(e) {
        var node = document.getElement('#manipulated');
        msgContainer.empty(true);
        if (node) {
            node.setAttrs([
                {name: 'data-x', value: 15},
                {name: 'data-y', value: 25}
            ]);
        }
    };

    removeAttribute = function(e) {
        var node = document.getElement('#manipulated');
        msgContainer.empty(true);
        if (node) {
            node.removeAttrs([
                'data-x',
                'data-y'
            ]);
        }
    };

    showMessage = function(e) {
        var message = e.target.getId() || e.target.getTagName();
        message += ' --> ' + e.type;
        if (e.changed) {
            message += ' --> '+JSON.stringify(e.changed);
        }
        // msgContainer.append('<br>'+message, null, null, true);
        console.info(message);
    };

    ITSA.Event.after('click', insertNode, '#insertNode');
    ITSA.Event.after('click', removeNode, '#removeNode');
    ITSA.Event.after('click', setAttribute, '#setAttribute');
    ITSA.Event.after('click', changeAttribute, '#changeAttribute');
    ITSA.Event.after('click', removeAttribute, '#removeAttribute');

    ITSA.Event.after(
        ['nodeinsert', 'noderemove', 'nodecontentchange', 'attributeinsert', 'attributeremove', 'attributechange'],
        showMessage,
        '#container'
    );

</script>
