---
module: drag
maintainer: Marco Asbreuk
title: Monitoring with Promises
intro: "Dragging can be monitored by listening to the 'dd' event and use the e.dd Promise.<br><br><b>Note:</b> it is recomended to use this Promise-way instead of subscribing to every single dd-event."
---

<style type="text/css">
    .container {
        margin: 10px;
        height: 100px;
        width: 100px;
        background-color: #990073;
        border: 2px solid #000;
        color: #FFF;
        text-align: center;
        padding-top: 10px;
    }
    .monitor-container {
        margin-top: 165px;
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
</style>

Drag the item and watch for the events.

<div class="container" plugin-dd="true" dd-effect-allowed="all">drag me</div>
<div class="monitor-container"></div>

<p class="spaced">Code-example:</p>

```html
<body>
    <div class="container" plugin-dd="true" dd-effect-allowed="all">drag me</div>
    <div class="monitor-container"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        monitorContStart = document.getElement('.monitor-container');

    ITSA.DD.init(); // ITSA combines the Drag-module with drag-drop into ITSA.DD

    ITSA.Event.after('dd', function(e) {
        monitorContStart.setHTML('dd --> drag started');

        e.dd.setCallback(function() {
            var node = monitorContStart.getElement('.monitor-drag'),
                count;
            if (node) {
                count = node.getData('count')+1;
                node.setData('count', count);
                node.setText('e.dd.callback --> item is dragging: '+count+' callbacks');
            }
            else {
                monitorContStart.append('<p class="monitor-drag">e.dd.callback --> item is dragging: 1 callback</p>');
                node = monitorContStart.getElement('.monitor-drag');
                node.setData('count', 1);
            }
        });

        e.dd.then(
            function() {
                var dropId = e.dropTarget && e.dropTarget.getId();
                if (dropId) {
                    monitorContStart.append('<p>e.dd.then() --> dropped inside '+dropId+'</p>');
                }
                else {
                    monitorContStart.append('<p>e.dd.then() --> dropped outside any dropzone</p>');
                }
            }
        );
    });

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        monitorContStart = document.getElement('.monitor-container');

    ITSA.DD.init(); // ITSA combines the Drag-module with drag-drop into ITSA.DD

    ITSA.Event.after('dd', function(e) {
        monitorContStart.setHTML('dd --> drag started');

        e.dd.setCallback(function() {
            var node = monitorContStart.getElement('.monitor-drag'),
                count;
            if (node) {
                count = node.getData('count')+1;
                node.setData('count', count);
                node.setText('e.dd.callback --> item is dragging: '+count+' callbacks');
            }
            else {
                monitorContStart.append('<p class="monitor-drag">e.dd.callback --> item is dragging: 1 callback</p>');
                node = monitorContStart.getElement('.monitor-drag');
                node.setData('count', 1);
            }
        });

        e.dd.then(
            function() {
                var dropId = e.dropTarget && e.dropTarget.getId();
                if (dropId) {
                    monitorContStart.append('<p>e.dd.then() --> dropped inside '+dropId+'</p>');
                }
                else {
                    monitorContStart.append('<p>e.dd.then() --> dropped outside any dropzone</p>');
                }
            }
        );
    });
</script>
