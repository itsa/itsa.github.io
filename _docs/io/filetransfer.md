---
module: io
maintainer: Marco Asbreuk
title: IO.sendBlob()
intro: "Sending a file to the server using ITSA.IO.sendBlob()."
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

**Note:** this example does not use SPDY. Max uploadsize = 10Mb. The uploaded file will be removed on the server immediately.

<div id="container">
    <input id="filetosend" multiple type="file">
    <button id="button-send" class="pure-button pure-button-primary pure-button-bordered">Click me to upload the file</button>
</div>
<div id="target-container"></div>

Code-example:

```html
<body>
    <div id="container">
        <input id="filetosend" multiple type="file">
        <button id="button-send" class="pure-button pure-button-primary pure-button-bordered">Click me to upload the file</button>
    </div>
    <div id="target-container"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var url = 'http://somedomain.com/upload',
        container = document.getElement('#target-container'),
        writeResponse, writeResponse, progressfn;

    writeResponse = function(response) {
        container.setHTML(JSON.stringify(response));
    };

    errorResponse = function(e) {
        container.setHTML(e.message);
    };

    progressfn = function(e) {
        var percent = Math.round(100*(e.loaded/e.total));
        container.setHTML(percent+'% loaded');
    };

    ITSA.Event.after(
        'tap',
        function() {
            var fileInput = document.getElement('#filetosend'),
                firstFile = fileInput.files[0],
                sendPromise = IO.sendBlob(url, firstFile, null, {progressfn: progressfn);
            sendPromise.then(writeResponse, errorResponse);
        },
        '#button-send'
    );
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var url = 'http://newsite.matrix-wijnen.nl/procesimage',
        container = document.getElement('#target-container'),
        writeResponse, writeResponse, progressfn;

    writeResponse = function(response) {
        container.setHTML('Finished');
    };

    errorResponse = function(e) {
        container.setHTML(e.message);
    };

    progressfn = function(e) {
        var percent = Math.round(100*(e.loaded/e.total));
        container.setHTML(percent+'% loaded');
    };

    ITSA.Event.after(
        'tap',
        function() {
            var fileInput = document.getElement('#filetosend'),
                firstFile = fileInput.files[0],
                sendPromise = ITSA.IO.sendBlob(url, firstFile, null, {progressfn: progressfn});
            sendPromise.then(writeResponse, errorResponse);
        },
        '#button-send'
    );
</script>