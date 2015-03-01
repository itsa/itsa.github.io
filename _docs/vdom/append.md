---
module: vdom
maintainer: Marco Asbreuk
title: Appending content
intro: "This example appends content to a diV-container"
---

<style type="text/css">
    #container {
        margin: 2em 0;
        min-height: 2em;
    }
    #container button {
        margin-top: 0.5em;
        min-width: 16em;
    }
    #target-container {
        margin: 2em 0;
        padding: 1em;
        min-height: 3.6em;
        background-color: #ddd;
    }
</style>

Click on the button to initiate the request.

<div id="test">hmm</div>
<div id="container">
    <button id="button-get" class="pure-button pure-button-primary pure-button-bordered">Click me to add data</button>
</div>
<div id="target-container">This is the target-container</div>

Code-example:

```html
<body>
    <div id="container">
        <button id="button-get">Click me to add data</button>
    </div>
    <div id="target-container">This is the target-container</div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        container = document.getElement('#target-container'),
        addContent;

    addContent = function(data) {
        container.append('<br>Some <i>new data</i>');
    };

    ITSA.Event.after(
        'tap',
        addContent,
        '#button-get'
    );
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        container = document.getElement('#target-container'),
        addContent;

document.getElement('#test').setHTML('<div>I am inner</div>');

    addContent = function(data) {
        container.append('<br>Some <i>new data</i>');
    };

    ITSA.Event.after(
        'tap',
        addContent,
        '#button-get'
    );
</script>