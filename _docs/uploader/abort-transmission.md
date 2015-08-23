---
module: uploader
maintainer: Marco Asbreuk
title: Abort sending files
intro: "Aborting transmission during IO."
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
    #container button {
        display: block;
        width: 20em;
        margin-top: 0.5em;
    }
</style>

Click on the button to initiate the request. During the request, the transfer can be aborted, which leads into a rejected io-promise.

**Note:** this example does not use SPDY. Max uploadsize = 10Mb.

<div id="container">
    <button id="button-send" class="pure-button pure-button-primary pure-button-bordered">Click me to upload multiple files</button>
    <button id="abortBtn"  class="pure-button pure-button-bordered" disabled="true">Abort IO</button>
</div>
<div id="target-container"></div>

Code-example:

```html
<body>
    <div id="container">
        <button id="button-send" class="pure-button pure-button-primary pure-button-bordered">Click me to upload multiple files</button>
        <button id="abortBtn"  class="pure-button pure-button-bordered" disabled="true">Abort IO</button>
    </div>
    <div id="target-container"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var url = 'http://somedomain.com/upload',
        container = document.getElement('#target-container'),
        abortBtn = element.getElement('#abortBtn'),
        MB10 = 10*1024*1024,
        uploader, writeResponse, errorResponse, progressfn, ioPromise;


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

    disableAbortBtn = function() {
        abortBtn.setAttr('disabled', 'true');
    };

    enableAbortBtn = function(ioPromise) {
        abortBtn.removeAttr('disabled');
    };

    uploader = new ITSA.Uploader({url: url, options: {progressfn: progressfn}, maxFileSize: MB10});

    ITSA.Event.after(
        'tap',
        function() {
            uploader.selectFiles({autoSend: true});
        },
        '#button-send'
    );

    ITSA.Event.after(
        'tap',
        function() {
            ioPromise.abort();
        },
        '#abortBtn'
    );

    ITSA.Event.after('uploader:send', function(e) {
        ioPromise = e.returnValue; // closure
        enableAbortBtn();
        ioPromise.then(writeResponse, errorResponse).finally(disableAbortBtn);
    });

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var url = 'http://newsite.matrix-wijnen.nl/procesimage',
        container = document.getElement('#target-container'),
        abortBtn = document.getElement('#abortBtn'),
        MB10 = 10*1024*1024,
        uploader, writeResponse, errorResponse, progressfn, ioPromise;


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

    disableAbortBtn = function() {
        abortBtn.disable();
    };

    enableAbortBtn = function(ioPromise) {
        abortBtn.enable();
    };

    uploader = new ITSA.Uploader({url: url, options: {progressfn: progressfn}, maxFileSize: MB10});

    ITSA.Event.after(
        'tap',
        function() {
            uploader.selectFiles({autoSend: true});
        },
        '#button-send'
    );

    ITSA.Event.after(
        'tap',
        function() {
            ioPromise.abort();
        },
        '#abortBtn'
    );

    ITSA.Event.after('uploader:send', function(e) {
        ioPromise = e.returnValue; // closure
        enableAbortBtn();
        ioPromise.then(writeResponse, errorResponse).finally(disableAbortBtn);
    });

</script>