---
module: io
maintainer: Marco Asbreuk
title: IO.read()
intro: "Get dataobject from the server using ITSA.IO.read()."
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
    var ITSA = require('itsa'),
        url = 'http://servercors.itsa.io/example',
        container = document.getElementById('target-container'),
        writeResponse, writeResponse;

    writeResponse = function(data) {
        // data should be an object with the `age` property
        var response = '';
        if (Object.isObject(data)) {
            data.each(function(value, key) {
                response += key + ': <b>' + value + '</b><br>';
            });
        }
        container.innerHTML = response;
    };

    errorResponse = function(e) {
        container.innerHTML = e.message;
    };

    ITSA.Event.after(
        'click',
        function() {
            ITSA.IO.read(url, {example: 2}).then(writeResponse, errorResponse);
        },
        '#button-get'
    );
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        url = 'http://servercors.itsa.io/example',
        container = document.getElementById('target-container'),
        writeResponse, writeResponse;

    writeResponse = function(data) {
        // data should be an object with the `age` property
        var response = '';
        if (Object.isObject(data)) {
            data.each(function(value, key) {
                response += key + ': <b>' + value + '</b><br>';
            });
        }
        container.innerHTML = response;
    };

    errorResponse = function(e) {
        container.innerHTML = e.message;
    };

    ITSA.Event.after(
        'click',
        function() {
            ITSA.IO.read(url, {example: 2}).then(writeResponse, errorResponse);
        },
        '#button-get'
    );
</script>