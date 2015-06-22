---
module: vdom
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
        min-width: 20em;
        display: block;
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

Clik on the buttons to move the div:

<div id="btncontainer">
    <button id="button-move1" class="pure-button pure-button-primary pure-button-bordered">Move using node.setXY()</button>
    <button id="button-move2" class="pure-button pure-button-primary pure-button-bordered">Move using node.left and node.top</button>
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
    var container = document.getElement('.container'),
        move1, move2;

    move1 = function() {
        container.setXY(525, 250);
    };

    move2 = function() {
        container.left = 200;
        container.top = 600;
    };

    ITSA.Event.after('tap', move1, '#button-move1');
    ITSA.Event.after('tap', move2, '#button-move2');

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var container = document.getElement('.container'),
        move1, move2;

    move1 = function() {
        container.setXY(525, 250);
    };

    move2 = function() {
        container.left = 200;
        container.top = 600;
    };

    ITSA.Event.after('tap', move1, '#button-move1');
    ITSA.Event.after('tap', move2, '#button-move2');
</script>