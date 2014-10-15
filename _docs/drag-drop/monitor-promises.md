---
module: drag-drop
maintainer: Marco Asbreuk
title: Monitoring with Promises
intro: "Dragging can be monitored by listening to the 'dd' event and use the e.dd Promise. Or for dropzones, listen to 'dropzone' and use the e.dropzone Promise.<br><br><b>Note:</b> it is recomended to use this Promise-way instead of subscribing to every single dd-event."
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
    .monitor-container.spaced {
        margin-top: 230px;
    }
    .monitor-container {
        margin-top: 20px;
        width: 100%;
        height: 100px;
        border: solid 1px #000;
        background-color: #ddd;
        padding: 14px 20px;
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

<div class="monitor-container spaced"></div>
<div class="monitor-container"></div>

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

    <div class="monitor-container spaced"></div>
    <div class="monitor-container"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        monitorContStart = document.getElement('.monitor-container.spaced'),
        monitorContOver = document.getElement('.monitor-container:not(.spaced)');

    ITSA.DD.init();


    ITSA.Event.after('dd', function(e) {
        monitorContStart.setHTML('dd --> drag started');

        e.dd.setCallback(function() {
            var node = monitorContStart.getElement('.monitor-drag'),
                count;
            if (node) {
                count = node.getData('count')+1;
                node.setData('count', count);
                node.setText('dd-drag --> item is dragging: '+count+' callbacks');
            }
            else {
                monitorContStart.append('<p class="monitor-drag">dd-drag --> item is dragging: 1 callback</p>');
                node = monitorContStart.getElement('.monitor-drag'),
                node.setData('count', 1);
            }
        });

        e.dd.then(
            function() {
                var dropId = e.dropTarget && e.dropTarget.getId();
                if (dropId) {
                    monitorContStart.append('dd-drag --> dropped inside '+dropId);
                }
                else {
                    monitorContStart.append('dd-drag --> dropped outside any dropzone');
                }
            }
        );
    });


    ITSA.Event.after('dropzone', function(e) {
        var dropId = e.dropTarget.getId();
        monitorContOver.setHTML('dropzone --> dragged over dropzone '+dropId);

        e.dropzone.then(
            function(onDropzone) {
                monitorContOver.append('<br>dropzone --> '+(onDropzone ? 'dropped inside ' : 'moved outside ')+dropId);
            }
        );
    });
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        monitorContStart = document.getElement('.monitor-container.spaced'),
        monitorContOver = document.getElement('.monitor-container:not(.spaced)');

    ITSA.DD.init();


    ITSA.Event.after('dd', function(e) {
        monitorContStart.setHTML('dd --> drag started');

        e.dd.setCallback(function() {
            var node = monitorContStart.getElement('.monitor-drag'),
                count;
            if (node) {
                count = node.getData('count')+1;
                node.setData('count', count);
                node.setText('dd-drag --> item is dragging: '+count+' callbacks');
            }
            else {
                monitorContStart.append('<p class="monitor-drag">dd-drag --> item is dragging: 1 callback</p>');
                node = monitorContStart.getElement('.monitor-drag'),
                node.setData('count', 1);
            }
        });

        e.dd.then(
            function() {
                var dropId = e.dropTarget && e.dropTarget.getId();
                if (dropId) {
                    monitorContStart.append('e.dd.then() --> dropped inside '+dropId);
                }
                else {
                    monitorContStart.append('e.dd.then() --> dropped outside any dropzone');
                }
            }
        );
    });


    ITSA.Event.after('dropzone', function(e) {
        var dropId = e.dropTarget.getId();
        monitorContOver.setHTML('dropzone --> dragged over dropzone '+dropId);

        e.dropzone.then(
            function(onDropzone) {
                monitorContOver.append('<br>e.dropzone.then() --> '+(onDropzone ? 'dropped inside ' : 'moved outside ')+dropId);
            }
        );
    });
</script>
