---
module: event-dom
maintainer: Marco Asbreuk
title: hover event
intro: "The hover-event is a single event. But it also notifies you when the hover has finished. You can inspect the Promise e.then for this purpose."
---

<style type="text/css">
    .base-container {
        position: absolute;
        top: 9em;
    }
    .container {
        text-align: center;
        margin: 2em 0;
        padding-top: 1.5em;
        height: 100px;
        width: 100px;
        background-color: #ddd;
        border: solid 1px #000;
        position: absolute;
        z-index: 1;
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

<div class="base-container">
    <div id="cont-1" class="container"></div>
    <div id="cont-2" class="container"></div>
    <div id="cont-3" class="container"></div>
    <div id="cont-4" class="container"></div>
    <div id="cont-5" class="container"></div>
</div>

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

<script src="../../dist/itsabuild-min.js"></script>
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
