---
module: drag-drop
maintainer: Marco Asbreuk
title: drag and drop
intro: "Drag and drop is done by a single event: <b>dragdrop</b>. The eventobject notifies you when the drag has finished. You can inspect the Promise e.drag.then for this purpose. You can also be notified on drag-move by setting a callback-function through: <b>e.setOnDrag(callbackFn)</b>. Draggable HtmlElements have the attribute: <b>draggable=\"true\"</b>"
---

<style type="text/css">
    .base-container {
        position: absolute;
        top: 32em;
        width: 500px;
        height: 300px;
        /* overflow: scroll; */
        background-color: #FF0;
        border: solid 10px #0F0;
    }
    .drop-container {
        position: absolute;
        top: 32em;
        left: 600px;
        width: 200px;
        height: 200px;
        border: solid 2px #000;
        background-color: #0FF;
    }
    .drop-container.second {
        left: 850px;
    }
    .drop-container.third {
        left: 1100px;
    }
    .container {
        text-align: center;
        margin: 2em 0;
        padding-top: 1.5em;
        height: 100px;
        width: 100px;
        background-color: #ddd;
        border: solid 10px #000;
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
        top: 0;
    }
    #cont-2 {
        left: 180px;
        top: 0;
    }
    #cont-3 {
        left: 50px;
        top: 140px;
    }
    #cont-4 {
        left: 180px;
        top: 140px;
    }
    #cont-5 {
        left: 100px;
        top: 60px;
        z-index: 2;
        background-color: #F00;
    }
    .body-content.module p.spaced {
        margin-top: 20em;
    }
    .dropactive {
        opacity: 0.6;
        filter: alpha(opacity=60); /* For IE8 and earlier */
        border: dotted 2px #000;
    }
    .container.dd-dragging {
        background-color: #0F0;
    }

    #Xfilling {
        width: 700px;
        height: 500px;
        background-color: #00F;
    }
</style>

Mouse the mouse over the 5 containers:

<div id="constr" class="base-container">
    <div id="cont-1" class="container" draggable="true" dd-dropzone=".drop-container" dd-effect-allowed="all" dd-handle="i">the <i id="idI">handle</i> is here</div>
    <div id="cont-2" class="container" draggable="true" xy-constrain=".base-container">2</div>
    <div id="cont-3" class="container" draggable="true" dd-dropzone=".drop-container" dd-effect-allowed="move">this is <i>no handle</i></div>
    <div id="cont-4" class="container" draggable="true" dd-dropzone=".drop-container" dd-effect-allowed="copy">4</div>
    <div id="cont-5" class="container" xy-constrain="window">5</div>
    <div id="filling"></div>
</div>

<div id='dz1' class="drop-container"></div>
<div id='dz2' class="drop-container second"></div>
<div id='dz3' class="drop-container third"></div>


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
    var ITSA = require('itsa');
    var container = document.getElement('#cont-5');

    var showMsg = function(e) {
        var node = e.target;
        node.innerHTML = 'Dragging';
        e.drag.then(function(ev) {
            node.innerHTML = 'END';
        });
    };

document.getElement('#dz1').plug(ITSA.Plugins.NodeDropzone, {move: true});
document.getElement('#dz2').plug(ITSA.Plugins.NodeDropzone, {copy: true});
document.getElement('#dz3').plug(ITSA.Plugins.NodeDropzone);

document.getElement('#constr').scrollTo(0,100);


// console.info(container.getInlineStyle('left'));
// console.info(container.getInlineStyle('top'));
    // container.setXY(100, null);

    ITSA.later(function() {
        container.plug(ITSA.Plugins.NodeDD);
        container.plug(ITSA.Plugins.NodePlugin);
    }, 10);

   // ITSA.Event.after('dragdrop', showMsg, '.container');
</script>
