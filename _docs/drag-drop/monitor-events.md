---
module: drag-drop
maintainer: Marco Asbreuk
title: Monitoring with events
intro: "Dragging can be monitored using the dd, dd-drag, dd-over, dd-out, dd-drop and dd-dropzone events. <br><br><b>Note:</b> it is highly recommended to use the Promised-way instead of this example."
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
    .drop-container {
        width: 200px;
        height: 200px;
        border: solid 8px #000;
        background-color: #c0e5fd;
        margin-right: 20px;
        text-align: center;
        font-size: 17px;
        padding-top: 40px;
        float: left;
    }
    .monitor-container {
        margin-top: 230px;
        width: 100%;
        min-height: 100px;
        border: solid 1px #000;
        background-color: #ddd;
        padding: 10px 20px;
    }
    .monitor-container.dz {
        margin-top: 20px;
    }
    .body-content.module .monitor-container p {
        margin: 0;
    }
    .body-content.module p.spaced {
        margin-top: 25px;
    }
    .dropactive[dropzone] {
        border-style: dashed;
    }
</style>

Drag the item and watch for the events.


<div id="dropzone-1" class="drop-container" dropzone="true">dropzone</div>
<div class="container" dd-draggable="true" dd-dropzone=".drop-container" dd-effect-allowed="all">drag me</div>
<div class="monitor-container"></div>
<div class="monitor-container dz"></div>

<p class="spaced">Code-example:</p>

```css
<style type="text/css">
    .dropactive[dropzone] {
        border-style: dashed;
    }
</style>
```

```html
<body>
    <div id="dropzone-1" class="drop-container" dropzone="true">dropzone</div>
    <div class="container" dd-draggable="true" dd-dropzone=".drop-container" dd-effect-allowed="all">drag me</div>
    <div class="monitor-container"></div>
    <div class="monitor-container dz"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        monitorCont = document.getElement('.monitor-container'),
        monitorContDropzone = document.getElement('.monitor-container.dz');

    ITSA.DD.init();

    //=======================================================================

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

    ITSA.Event.before('dd-drop', function(e) {
        var dropId = e.dropTarget && e.dropTarget.getId();
        if (dropId) {
            monitorCont.append('before dd-drop --> inside '+dropId+'<br>');
        }
        else {
            monitorCont.append('before dd-drop --> outside any dropzone<br>');
        }
    });

    ITSA.Event.after('dd-drop', function(e) {
        var dropId = e.dropTarget && e.dropTarget.getId();
        if (dropId) {
            monitorCont.append('after dd-drop --> inside '+dropId+'<br>');
        }
        else {
            monitorCont.append('after dd-drop --> outside any dropzone<br>');
        }
    });

    //=======================================================================

    ITSA.Event.after(['dropzone', 'dropzone-out', 'dropzone-drop'], function(e) {
        var dropId = e.dropTarget.getId();
        monitorContDropzone.append(((e.type==='dd-drop') ? 'after ' : '')+e.type+' --> inside '+dropId+'<br>');
    });
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        monitorCont = document.getElement('.monitor-container'),
        monitorContDropzone = document.getElement('.monitor-container.dz');

    ITSA.DD.init();

    //=======================================================================

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

    ITSA.Event.before('dd-drop', function(e) {
        var dropId = e.dropTarget && e.dropTarget.getId();
        if (dropId) {
            monitorCont.append('before dd-drop --> inside '+dropId+'<br>');
        }
        else {
            monitorCont.append('before dd-drop --> outside any dropzone<br>');
        }
    });

    ITSA.Event.after('dd-drop', function(e) {
        var dropId = e.dropTarget && e.dropTarget.getId();
        if (dropId) {
            monitorCont.append('after dd-drop --> inside '+dropId+'<br>');
        }
        else {
            monitorCont.append('after dd-drop --> outside any dropzone<br>');
        }
    });

    //=======================================================================

    ITSA.Event.after(['dropzone', 'dropzone-out', 'dropzone-drop'], function(e) {
        var dropId = e.dropTarget.getId();
        monitorContDropzone.append(((e.type==='dd-drop') ? 'after ' : '')+e.type+' --> inside '+dropId+'<br>');
    });
</script>
