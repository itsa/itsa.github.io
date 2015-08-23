---
module: uploader
maintainer: Marco Asbreuk
title: Multiple uploaders
intro: "Sending a several file to the server with all an unique id."
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
    .target-container {
        margin: 2em 0;
        padding: 1em;
        min-height: 3.6em;
    }
</style>

This example will use three uploaders only once. Select three files and upload them to the server. They will all be marked with an unique id.

**Note:** this example does not use SPDY. Max uploadsize = 10Mb.

<div id="container">
    <button id="button1" class="pure-button pure-button-primary pure-button-bordered">Select file 1</button><span id="target1" class="target-container"></span><br>
    <button id="button2" class="pure-button pure-button-primary pure-button-bordered">Select file 2</button><span id="target2" class="target-container"></span><br>
    <button id="button3" class="pure-button pure-button-primary pure-button-bordered">Select file 3</button><span id="target3" class="target-container"></span><br>
    <button id="button-send" class="pure-button pure-button-primary pure-button-bordered">Send files</button>
</div>


Code-example:

```html
<body>
    <div id="container">
        <button id="button1">Select file 1</button><span id="target1" class="target-container"></span><br>
        <button id="button2">Select file 2</button><span id="target2" class="target-container"></span><br>
        <button id="button3">Select file 3</button><span id="target3" class="target-container"></span><br>
        <button id="button-send" class="pure-button pure-button-primary pure-button-bordered">Send files</button>
    </div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var url = 'http://somedomain.com.upload',
        selectBtn1 = document.getElement('#button1'),
        selectBtn2 = document.getElement('#button2'),
        selectBtn3 = document.getElement('#button3'),
        sendBtn = document.getElement('#button-send'),
        MB10 = 10*1024*1024,
        uploader1, uploader2, uploader3, removeUploader, errorResponse, progressfn, displayFileNameAndSize;


    removeUploader = function(uploader) {
        uploader.destroy();
    };

    errorResponse = function(e) {
        container.setHTML(e.message || e);
    };

    progressfn = function(e) {
        var uploader = e.target,
            percent = Math.round(100*(e.loaded/e.total)),
            containerTarget =document.getElement(e.containerTarget || '#target1');
        containerTarget.setHTML(percent+'% loaded');
    };

    displayFileNameAndSize = function(e) {
        var uploader = e.target,
            containerTarget = document.getElement(e.containerTarget || '#target1'),
            selectedFile = uploader.getFiles()[0];
        containerTarget.setHTML(selectedFile.name+' ('+selectedFile.size+' bytes)');
    };

    uploader1 = new ITSA.Uploader({url: url, params: {id: 1}, options: {progressfn: progressfn}, maxFileSize: MB10});
    uploader2 = new ITSA.Uploader({url: url, params: {id: 2}, options: {progressfn: progressfn}, maxFileSize: MB10});
    uploader3 = new ITSA.Uploader({url: url, params: {id: 3}, options: {progressfn: progressfn}, maxFileSize: MB10});

    ITSA.Event.after(
        'tap',
        function() {
            uploader1.hasFiles && uploader1.send({containerTarget: '#target1'});
            uploader2.hasFiles && uploader2.send({containerTarget: '#target2'});
            uploader3.hasFiles && uploader3.send({containerTarget: '#target3'});
            selectBtn1.disable();
            selectBtn2.disable();
            selectBtn3.disable();
            sendBtn.disable();
        },
        '#button-send'
    );

    ITSA.Event.after(
        'tap',
        function(e) {
            var nodeId = e.target.getId();
            (nodeId==='button1') && uploader1.selectFile({containerTarget: '#target1'});
            (nodeId==='button2') && uploader2.selectFile({containerTarget: '#target2'});
            (nodeId==='button3') && uploader3.selectFile({containerTarget: '#target3'});
        },
        '#container button:not(#select-button)'
    );

    ITSA.Event.after('uploader:fileschanged', displayFileNameAndSize);

    ITSA.Event.after('uploader:send', function(e) {
        var ioPromise = e.returnValue,
            uploader = e.target;
        ioPromise.then(removeUploader.bind(null, uploader), errorResponse);
    });

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var url = 'http://newsite.matrix-wijnen.nl/procesimage',
        selectBtn1 = document.getElement('#button1'),
        selectBtn2 = document.getElement('#button2'),
        selectBtn3 = document.getElement('#button3'),
        sendBtn = document.getElement('#button-send'),
        MB10 = 10*1024*1024,
        uploader1, uploader2, uploader3, removeUploader, errorResponse, progressfn, displayFileNameAndSize;


    selectBtn1.enable();
    selectBtn2.enable();
    selectBtn3.enable();
    sendBtn.enable();

    removeUploader = function(uploader) {
        uploader.destroy();
    };

    errorResponse = function(e) {
        container.setHTML(e.message || e);
    };

    progressfn = function(e) {
        var uploader = e.target,
            percent = Math.round(100*(e.loaded/e.total)),
            containerTarget =document.getElement(e.containerTarget || '#target1');
        containerTarget.setHTML(percent+'% loaded');
    };

    displayFileNameAndSize = function(e) {
        var uploader = e.target,
            containerTarget = document.getElement(e.containerTarget || '#target1'),
            selectedFile = uploader.getFiles()[0];
        containerTarget.setHTML(selectedFile.name+' ('+selectedFile.size+' bytes)');
    };

    uploader1 = new ITSA.Uploader({url: url, params: {id: 1}, options: {progressfn: progressfn}, maxFileSize: MB10});
    uploader2 = new ITSA.Uploader({url: url, params: {id: 2}, options: {progressfn: progressfn}, maxFileSize: MB10});
    uploader3 = new ITSA.Uploader({url: url, params: {id: 3}, options: {progressfn: progressfn}, maxFileSize: MB10});

    ITSA.Event.after(
        'tap',
        function() {
            uploader1.hasFiles && uploader1.send({containerTarget: '#target1'});
            uploader2.hasFiles && uploader2.send({containerTarget: '#target2'});
            uploader3.hasFiles && uploader3.send({containerTarget: '#target3'});
            selectBtn1.disable();
            selectBtn2.disable();
            selectBtn3.disable();
            sendBtn.disable();
        },
        '#button-send'
    );

    ITSA.Event.after(
        'tap',
        function(e) {
            var nodeId = e.target.getId();
            (nodeId==='button1') && uploader1.selectFile({containerTarget: '#target1'});
            (nodeId==='button2') && uploader2.selectFile({containerTarget: '#target2'});
            (nodeId==='button3') && uploader3.selectFile({containerTarget: '#target3'});
        },
        '#container button:not(#select-button)'
    );

    ITSA.Event.after('uploader:fileschanged', displayFileNameAndSize);

    ITSA.Event.after('uploader:send', function(e) {
        var ioPromise = e.returnValue,
            uploader = e.target;
        ioPromise.then(removeUploader.bind(null, uploader), errorResponse);
    });

</script>