---
module: dom-ext
maintainer: Marco Asbreuk
title: Positioning element
intro: "This example moves a div-node to a new location"
---

<style type="text/css">
    #btncontainer {
        margin: 2em 0;
        min-height: 2em;
    }
    #btncontainer button {
        margin-top: 0.5em;
        min-width: 16em;
    }
    .container {
        background-color: #F00;
        text-align: center;
        margin: 2em 0;
        padding-top: 1.5em;
        height: 100px;
        width: 100px;
        border: solid 1px #000;
    }
</style>

Clik on the button to move the div:

<div id="btncontainer">
    <button id="button-move" class="pure-button pure-button-primary pure-button-bordered">Move the div</button>
</div>

<div class="container"></div>

Code-example:

```html
<body>
    <div id="btncontainer">
        <button id="button-move">Move the div</button>
    </div>

    <div class="container"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        container = document.getElement('.container'),
        move;

    move = function() {
        container.setXY(350, 425);
    };

    ITSA.Event.after('click', move, '#button-move');
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        container = document.getElement('.container'),
        move;

    move = function() {
        container.setXY(350, 425);
    };

    ITSA.Event.after('click', move, '#button-move');
</script>