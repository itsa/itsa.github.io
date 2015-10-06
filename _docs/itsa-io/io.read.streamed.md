---
module: itsa-io
maintainer: Marco Asbreuk
title: Streamed IO.read()
intro: "Get streamed dataobject from the server using ITSA.IO.read() using streamback."
---

<style type="text/css">
    #container {
        margin: 2em 0;
        min-height: 2em;
    }
    #container button {
        margin-top: 0.5em;
        min-width: 16em;
    }
    #target-container {
        margin: 2em 0;
        padding: 1em;
        min-height: 3.6em;
        background-color: #ddd;
    }
</style>

Click on the button to initiate the request.

<div id="container">
    <button id="button-get" class="pure-button pure-button-primary pure-button-bordered">Click me get data</button>
</div>
<div id="target-container"></div>

Code-example:

```html
<body>
    <div id="container">
        <button id="button-get">Click me get data</button>
    </div>
    <div id="target-container"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var url = 'http://servercors.itsa.io/example/stream',
        container = document.getElementById('target-container'),
        writeResponse, writeResponse, streamFn;

    readyResponse = function(data) {
        // `data` has all the data, but we don't use it here.
        container.append('<br>READY');
    };

    errorResponse = function(e) {
        container.setText(e.message);
    };

    streamFn = function(data) {
        // data should be an array
        if (Array.isArray(data)) {
            data.forEach(function(item) {
                container.append(JSON.stringify(item)+'<br>');
            });
        }
    };

    ITSA.Event.after(
        'tap',
        function() {
            container.innerHTML = '';
            ITSA.IO.read(url, {example: 1}, {streamback: streamFn}).then(readyResponse, errorResponse);
        },
        '#button-get'
    );
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var url = 'http://servercors.itsa.io/example/stream',
        container = document.getElementById('target-container'),
        writeResponse, writeResponse, streamFn;

    readyResponse = function(data) {
        // `data` has all the data, but we don't use it here.
        container.append('<br>READY');
    };

    errorResponse = function(e) {
        container.setText(e.message);
    };

    streamFn = function(data) {
        // data should be an array
        if (Array.isArray(data)) {
            data.forEach(function(item) {
                container.append(JSON.stringify(item)+'<br>');
            });
        }
    };

    ITSA.Event.after(
        'tap',
        function() {
            container.innerHTML = '';
            ITSA.IO.read(url, {example: 1}, {streamback: streamFn}).then(readyResponse, errorResponse);
        },
        '#button-get'
    );
</script>