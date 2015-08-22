---
module: uploader
maintainer: Marco Asbreuk
title: Uploader.sendFiles()
intro: "Sending multiple files to the server using ITSA.Uploader.sendFiles()."
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

Click on the button to select and automaticly send multiple selected files.

**Note:** this example does not use SPDY.

<div id="container">
    <button id="button-send" class="pure-button pure-button-primary pure-button-bordered">Click me to upload multiple files</button>
</div>
<div id="target-container"></div>

Code-example:

```html
<body>
    <div id="container">
        <button id="button-send" class="pure-button pure-button-primary pure-button-bordered">Click me to upload multiple files</button>
    </div>
    <div id="target-container"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var url = 'http://somedomain.com.upload',
        container = document.getElement('#target-container'),
        uploader, writeResponse, errorResponse, progressfn;


    writeResponse = function(response) {
        container.setHTML('Finished uploading');
    };

    errorResponse = function(e) {
        container.setHTML(e.message);
    };

    progressfn = function(e) {
        var percent = Math.round(100*(e.loaded/e.total));
        container.setHTML(percent+'% loaded');
    };

    uploader = new ITSA.Uploader({url: url, options: {progressfn: progressfn}});

    ITSA.Event.after(
        'tap',
        function() {
            uploader.selectFiles({autoSend: true});
        },
        '#button-send'
    );

    ITSA.Event.after('uploader:send', function(e) {
        var ioPromise = e.returnValue;
        ioPromise.then(writeResponse, errorResponse);
    });

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var url = 'http://newsite.matrix-wijnen.nl/procesimage',
        container = document.getElement('#target-container'),
        uploader, writeResponse, errorResponse, progressfn;


    writeResponse = function(response) {
        container.setHTML('Finished uploading');
    };

    errorResponse = function(e) {
        container.setHTML(e.message);
    };

    progressfn = function(e) {
        var percent = Math.round(100*(e.loaded/e.total));
        container.setHTML(percent+'% loaded');
    };

    uploader = new ITSA.Uploader({url: url, options: {progressfn: progressfn}});

    ITSA.Event.after(
        'tap',
        function() {
            uploader.selectFiles({autoSend: true});
        },
        '#button-send'
    );

    ITSA.Event.after('uploader:send', function(e) {
        var ioPromise = e.returnValue;
        ioPromise.then(writeResponse, errorResponse);
    });

</script>