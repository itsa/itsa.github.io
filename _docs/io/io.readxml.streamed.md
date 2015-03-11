---
module: io
maintainer: Marco Asbreuk
title: Streamed IO.readXML()
intro: "Get streamed XML-object from the server using ITSA.IO.readXML() using streamback."
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
    #target-container div {
        display: block;
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
    var ITSA = require('itsa'),
        url = 'http://servercors.itsa.io/example/stream',
        container = document.getElementById('target-container'),
        writeResponse, writeResponse, streamFn;

    readyResponse = function(xml) {
        // `xml` has all the complete xml-object, but we don't use it here.
        container.append('<br>READY');
    };

    errorResponse = function(e) {
        container.setText(e.message);
    };

    streamFn = function(xml) {
        // xml should be an xml-object
        container.append(xml.documentElement.children);
    };

    ITSA.Event.after(
        'tap',
        function() {
            container.innerHTML = '';
            ITSA.IO.readXML(url, {example: 2}, {streamback: streamFn}).then(readyResponse, errorResponse);
        },
        '#button-get'
    );
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        url = 'http://servercors.itsa.io/example/stream',
        container = document.getElementById('target-container'),
        writeResponse, writeResponse, streamFn;

    readyResponse = function(xml) {
        // `xml` has all the complete xml-object, but we don't use it here.
        container.append('<br>READY');
    };

    errorResponse = function(e) {
        container.setText(e.message);
    };

    streamFn = function(xml) {
        // xml should be an xml-object
        container.append(xml.documentElement.children);
    };

    ITSA.Event.after(
        'tap',
        function() {
            container.innerHTML = '';
            ITSA.IO.readXML(url, {example: 2}, {streamback: streamFn}).then(readyResponse, errorResponse);
        },
        '#button-get'
    );
</script>