---
module: drag
maintainer: Marco Asbreuk
title: Monitoring with events
intro: "Dragging can be monitored using the dd, dd-drag and dd-drop events. <br><br><b>Note:</b> it is highly recommended to use the Promised-way instead of this example."
---

<style type="text/css">
    .container {
        margin: 10px;
        height: 100px;
        width: 100px;
        background-color: #990073;
        border: 2px solid #000;
        cursor: default;
        color: #FFF;
        text-align: center;
        padding-top: 10px;
    }
    .monitor-container {
        margin-top: 165px;
        width: 100%;
        min-height: 6em;
        border: solid 1px #000;
        background-color: #ddd;
        padding: 10px 20px;
    }
    .body-content.module .monitor-container p {
        margin: 0;
    }
    .body-content.module p.spaced {
        margin-top: 25px;
    }
</style>

Drag the item and watch for the events.


<div class="container" dd-draggable="true" dd-effect-allowed="all">drag me</div>
<div class="monitor-container"></div>

<p class="spaced">Code-example:</p>

```html
<body>
    <div class="container" dd-draggable="true" dd-dropzone=".drop-container" dd-effect-allowed="all">drag me</div>
    <div class="monitor-container"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        monitorCont = document.getElement('.monitor-container'),
        monitorContDropzone = document.getElement('.monitor-container.dz');

    ITSA.DD.init(); // ITSA combines the Drag-module with drag-drop into ITSA.DD

    ITSA.Event.after('dd', function(e) {
        monitorCont.setHTML('dd --> drag started');
    });

    ITSA.Event.after('dd-drag', function(e) {
        var node = monitorCont.getElement('.monitor-drag'),
            count;
        if (node) {
            count = node.getData('count')+1;
            node.setData('count', count);
            node.setText('dd-drag --> item is dragging: '+count+' events');
        }
        else {
            monitorCont.append('<p class="monitor-drag">dd-drag --> item is dragging: 1 event</p>');
            node = monitorCont.getElement('.monitor-drag'),
            node.setData('count', 1);
        }
    });

    ITSA.Event.after('dd-drop', function(e) {
        monitorCont.append('<p>dd-drop --> drag has finished</p>');
    });
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        monitorCont = document.getElement('.monitor-container');

    ITSA.DD.init(); // ITSA combines the Drag-module with drag-drop into ITSA.DD

    ITSA.Event.after('dd', function(e) {
        monitorCont.setHTML('dd --> drag started');
    });

    ITSA.Event.after('dd-drag', function(e) {
        var node = monitorCont.getElement('.monitor-drag'),
            count;
        if (node) {
            count = node.getData('count')+1;
            node.setData('count', count);
            node.setText('dd-drag --> item is dragging: '+count+' events');
        }
        else {
            monitorCont.append('<p class="monitor-drag">dd-drag --> item is dragging: 1 event</p>');
            node = monitorCont.getElement('.monitor-drag'),
            node.setData('count', 1);
        }
    });

    ITSA.Event.after('dd-drop', function(e) {
        monitorCont.append('<p>dd-drop --> drag has finished</p>');
    });
</script>
