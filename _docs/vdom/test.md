---
module: vdom
maintainer: Marco Asbreuk
title: Test commentnode
intro: "This example moves a div-node to a new location"
includeexample: 20em
---


Clik on the buttons to move the div:


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
        move1, move2;

    move1 = function() {
        container.setXY(525, 250);
    };

    move2 = function() {
        container.left = 200;
        container.top = 600;
    };

    ITSA.Event.after('click', move1, '#button-move1');
    ITSA.Event.after('click', move2, '#button-move2');

</script>
```