---
module: event
maintainer: Marco Asbreuk
title: datachanged event
intro: "The datachange-event tries to make use of native Object.observe. On environments where this isn't present, it will use Event.finalize to compare any changes to the data after any event. This way, datachange-event works in all environments."
---

<style type="text/css">
    #container {
        margin: 2em 0;
        padding: 1em;
        min-height: 4em;
        background-color: #ddd;
    }
</style>

Click on the button to change datamodel.time --> datamodel is being observed.
After 3 seconds, the output-field will be made empty: just to show there is no repeated re-rendering of the same value.

<div id="observeinfo"></div>
<button id="btn" class="pure-button pure-button-bordered">Change data</button>
<div id="container"></div>


Code-example:

```html
<body>
    <button id="btn">Change data</button>
    <div id="container"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var container, dataHasChangedCallback, changeData, datamodel, cleanup, observeMsg;

    container = document.getElement('#container');
    observeMsg = (Object.observe ? 'supports' : 'does not support');

    dataHasChangedCallback = function(e) {
        var datamodel = e.target,
            emitter = e.emitter;
        cleanup && cleanup.cancel();
        container.setHTML(emitter+' got new data: <b>'+JSON.stringify(datamodel)+'</b>');
        cleanup = ITSA.later(function() {
            container.empty();
        }, 3000);
    };

    changeData = function(e) {
        datamodel.time = Date.now();
    };

    datamodel = {
        time: Date.now()
    };

    document.getElement('#observeinfo')
            .setHTML('This browser <b>'+observeMsg+'</b> native Object.observe');

    ITSA.Event.observe('myData', datamodel);
    ITSA.Event.after('*:datachanged', dataHasChangedCallback);
    ITSA.Event.after('tap', changeData, '#btn');

    document.getElement('#btn').focus();

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var container, dataHasChangedCallback, changeData, datamodel, cleanup, observeMsg;

    container = document.getElement('#container');
    observeMsg = (Object.observe ? 'supports' : 'does not support');

    dataHasChangedCallback = function(e) {
        var datamodel = e.target,
            emitter = e.emitter;
        cleanup && cleanup.cancel();
        container.setHTML(emitter+' got new data: <b>'+JSON.stringify(datamodel)+'</b>');
        cleanup = ITSA.later(function() {
            container.empty();
        }, 3000);
    };

    changeData = function(e) {
        datamodel.time = Date.now();
    };

    datamodel = {
        time: Date.now()
    };

    document.getElement('#observeinfo')
            .setHTML('This browser <b>'+observeMsg+'</b> native Object.observe');

    ITSA.Event.observe('myData', datamodel);
    ITSA.Event.after('*:datachanged', dataHasChangedCallback);
    ITSA.Event.after('tap', changeData, '#btn');

    document.getElement('#btn').focus();

</script>