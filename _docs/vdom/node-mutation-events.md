---
module: vdom
maintainer: Marco Asbreuk
title: Node mutation-events
intro: "The vdom-module can make the dom-event module to fire <b>mutation-events</b>. These events get fired when both the vdom and dom-event module are loaded and there is a subscriber to one of the mutation-events."
---

<style type="text/css">
    #tree-container,
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
</style>

Add or change Nodes by using the buttons:

<div class="btn-container">
    <button id="insertNode" class="pure-button pure-button-bordered">Insert Node</button>
    <button id="removeNode" class="pure-button pure-button-bordered">Remove Node</button>
    <button id="setAttribute" class="pure-button pure-button-bordered">Set attribute</button>
    <button id="changeAttribute" class="pure-button pure-button-bordered">Change attribute</button>
    <button id="removeAttribute" class="pure-button pure-button-bordered">Remove attribute</button>
</div>

<div id="container"></div>

<div id="tree-container"></div>

<div id="msg-container"></div>

<p class="spaced">Code-example:</p>

```css
<style type="text/css">
    #tree-container,
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
</style>
```

```html
<body>
    <div class="btn-container">
        <button id="insertNode">Insert Node</button>
        <button id="removeNode">Remove Node</button>
        <button id="setAttribute">Set attribute</button>
        <button id="changeAttribute">Change attribute</button>
        <button id="removeAttribute">Remove attribute</button>
    </div>

    <div id="container"></div>
    <div id="tree-container"></div>
    <div id="msg-container"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        container = document.getElement('#container'),
        msgContainer = document.getElement('#msg-container'),
        treeContainer = document.getElement('#tree-container'),
        insertNode, removeNode, changeAttribute, showMessage;

    insertNode = function(e) {
        var node = document.getElement('#manipulated');
        msgContainer.empty(true);
        container.setHTML('<div id="manipulated">Node <u id="inner-u">is inserted</u></div>');
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
        var message = 'Node: <b>' +(e.target.getId() || e.target.getTagName()) + '</b>';
        message += ' fired event <b>' + e.type + '</b>';
        if (e.changed) {
            message += ' --> '+JSON.stringify(e.changed);
        }
        msgContainer.append('<br>'+message, null, null, true);
        treeContainer.setText(container.getOuterHTML());
    };

    ITSA.Event.after('tap', insertNode, '#insertNode');
    ITSA.Event.after('tap', removeNode, '#removeNode');
    ITSA.Event.after('tap', setAttribute, '#setAttribute');
    ITSA.Event.after('tap', changeAttribute, '#changeAttribute');
    ITSA.Event.after('tap', removeAttribute, '#removeAttribute');

    ITSA.Event.after(
        ['nodeinsert', 'noderemove', 'nodecontentchange', 'attributeinsert', 'attributeremove', 'attributechange'],
        showMessage,
        '#container'
    );

    treeContainer.setText(container.getOuterHTML());

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        container = document.getElement('#container'),
        msgContainer = document.getElement('#msg-container'),
        treeContainer = document.getElement('#tree-container'),
        insertNode, removeNode, changeAttribute, showMessage;

    insertNode = function(e) {
        var node = document.getElement('#manipulated');
        msgContainer.empty(true);
        container.setHTML('<div id="manipulated">Node <u id="inner-u">is inserted</u></div>');
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
        var message = 'Node: <b>' +(e.target.getId() || e.target.getTagName()) + '</b>';
        message += ' fired event <b>' + e.type + '</b>';
        if (e.changed) {
            message += ' --> '+JSON.stringify(e.changed);
        }
        msgContainer.append('<br>'+message, null, null, true);
        treeContainer.setText(container.getOuterHTML());
    };

    ITSA.Event.after('tap', insertNode, '#insertNode');
    ITSA.Event.after('tap', removeNode, '#removeNode');
    ITSA.Event.after('tap', setAttribute, '#setAttribute');
    ITSA.Event.after('tap', changeAttribute, '#changeAttribute');
    ITSA.Event.after('tap', removeAttribute, '#removeAttribute');

    ITSA.Event.after(
        ['nodeinsert', 'noderemove', 'nodecontentchange', 'attributeinsert', 'attributeremove', 'attributechange'],
        showMessage,
        '#container'
    );

    treeContainer.setText(container.getOuterHTML());

</script>
