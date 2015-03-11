---
module: io
maintainer: Marco Asbreuk
title: IO.get()
intro: "Get response from the server using ITSA.IO.get()."
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
        url = 'http://servercors.itsa.io/example?example=1',
        container = document.getElementById('target-container'),
        writeResponse, writeResponse;

    writeResponse = function(data) {
        container.innerHTML = data;
    };

    errorResponse = function(e) {
        container.innerHTML = e.message;
    };

    ITSA.Event.after(
        'tap',
        function() {
            ITSA.IO.get(url).then(writeResponse, errorResponse);
        },
        '#button-get'
    );
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        url = 'http://servercors.itsa.io/example?example=1',
        container = document.getElementById('target-container'),
        writeResponse, writeResponse;

    writeResponse = function(data) {
        container.innerHTML = data;
    };

    errorResponse = function(e) {
        container.innerHTML = e.message;
    };

    ITSA.Event.after(
        'tap',
        function() {
            ITSA.IO.get(url).then(writeResponse, errorResponse);
        },
        '#button-get'
    );
</script>