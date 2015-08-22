---
module: uploader
itsaclassname: Uploader
version: 0.0.1
modulesize: 1.88
modulesizecombined: 16.42
dependencies: "polyfill, js-ext, vdom, io, event, utils"
maintainer: Marco Asbreuk
title: Uploader
intro: "Uploader for easy sending files to a server. The file(s) are send in chuncks (parallel). Combined with SPDY, or HTTP2, you get ultrafast file-uploads."
firstpar: get-started-onlywindow
---



#The Basics#

By nature, fileuploads using XMLHttpRequest2 is hard to set up. This module provides the `Uploader`-class which makes this process extremely easy and extremely fast. The most difficult part would probably be setting up the server. The **[io-filetransfer](../io/index.html#io-filetransfer)**-module has more information about the technical details and server-setup.

In most cases, you need only one uploader-instance, which can be reused, even when a previous upload is still busy. In rare cases, you might need multiple instances.

For convenience, HTMLInputElement is extended with the `sendFiles`-method, which returns a promise with an `abort()`-method.


#How to setup an Uploader instance#

The Uploader need to be instantiated, where you can pass a config:

```js
var defaultConfig, progressfn, uploader;

progressfn = function(e) {
    var percent = Math.round(100*(e.loaded/e.total));
    console.info(percent+'% loaded');
};

defaultOptions: {
    progressfn: progressfn
};

defaultConfig = {
    url: 'somedomain.com/processimage',
    options: defaultOptions;
};

myuploader = new ITSA.Uploader(defaultConfig);
```


#Using the uploader#

All examples below assume that you have set up an Uploader-instance in the variable `myuploader`.


##Selecting files##
Selecting files can be done either by using `selectFile()`, or `selectFiles()`, where the latter allows you to select multiple files. When invoked, the browser will show its fileselector.

####Example selecting files:####
```js
myuploader.selectFile();
```

**Note:** these methods are eventdriven: you can `preventDefault` this behaviour (see **[Events](#events)**).

##Sending file##
Sending files can be done by using `send()`. The selected files will be send using the default `config` that is set during initialization of the uploader. By passing an object as argument, these defaults can be changed.

####Example send files:####
```js
myuploader.send();
```

####Example send files with different config:####
```js
var config: {
    url: 'myotherdomain.com',
    params: {
        fileid: 1
    }
}
myuploader.send(config);
```

**Note:** this method is eventdriven: you can `preventDefault` this behaviour (see **[Events](#events)**).


##Selecting file with auto-send##
In case you want the selected files to be send immediately after selected, you can pass an object to the methods `selectFile/selectFiles` with the property **autoSend: true**.

####Example automatic sending files after selecting:####
```js
myuploader.selectFiles({autoSend: true});
```

##Events##

Uploaders methods are eventdriven. This means: selecting and sending occur by their default-function when emitting events. `selectFile`, `selectFiles` and `send` are basicly emitting events.

You can subscribe to these events, either to prevent defaultbehaviour, or to get informed when a transaction gets processed. In the latter case, `e.returnValue` will hold the `io-promise` which you can use to manage the request.

The next events are present:

* **uploader:fileschanged** Fired whenever the selected files are changed. Its defaultFn will start sending the files (if the selection is triggered with autoSend=true)
* **uploader:selectfiles** Fired to start selecting the files. Its defaultFn will pop-up the file-selector
* **uploader:send** Fired to start uploading through io. Its defaultFn will invoke sendFiles of the input-node

All events have the emittername `uploader`, which has nothing to do with the instance `myuploader` that has being used.

####Example preventing the file-selector:####
```js
ITSA.Event.before('uploader:selectfiles', function(e) {
    e.preventDefault();
});
```

##Managing the io-request##

When subscribed to the `uploader:send`-event, `e.returnValue` will hold the `io-promise` which you can use to manage the request. Of coarse this will be only available when using the `after` subscriber; not `before`.

####Example managing the serverresponse:####
```js
ITSA.Event.after('uploader:send', function(e) {
    // at this point, the upload has JUST started
    // file-uploading is busy and can be examinded with e.returnValue:
    var ioPromise = e.returnValue;
    ioPromise.then(
        function(serverResponse) {
            // at this point, the file(s) are uploaded and processed by the server
            // serverResponse should be an object
            // you can handle it here
        },
        function(err) {
            // io failed
            console.warn(err);
        }
    ).catch(function(err) {
        // always catch errors that occur in the previous thenable
        console.log(err);
    });
});
```

####Example aborting the io-request:####
```js
ITSA.Event.after('uploader:send', function(e) {
    // at this point, the upload has JUST started
    // file-uploading is busy and can be examinded with e.returnValue:
    var ioPromise = e.returnValue;
    // on whatever moment, you can abort the request
    // by invoke: ioPromise.abort();
});
```

##Monitoring the progress##

The uploadprocess can return its progress. You can specify the property `progressfn` to `options`, which should be a function. This function gets invoked several times during uploading, with one argument: {loaded: xxx, total: xxx}. If you are uploading multiple files at once, these values are related to the combined filesizes.

####Example monitoring upload-progress:####
```js
var defaultConfig, progressfn, uploader;

progressfn = function(e) {
    var percent = Math.round(100*(e.loaded/e.total));
    console.info(percent+'% loaded');
};

defaultOptions: {
    progressfn: progressfn
};

defaultConfig = {
    url: 'somedomain.com/processimage',
    options: defaultOptions;
};

myuploader = new ITSA.Uploader(defaultConfig);

myuploader.selectFiles({autoSend: true});
```


##Browser-support##

###Supported browsers###
* All modern browsers and IE10+ (XMLHttpRequest2)



#Using input.sendFiles()#

Preferable, you use the `Uploader` for sending files: it uses `input.sendFiles()` under the hood. However, you can use input.sendFiles() for any input-element, as long as its type is *"file"*.


####Example input.sendFiles()####
```js
var inputElement = document.getElement('input'), // type="file"
    ioPromise = fileInput.sendFiles('http://somedomain.com/processfile', {id: 'myfile'}, {progressfn: progressfn),
    progressfn;

progressfn = function(e) {
    var percent = Math.round(100*(e.loaded/e.total));
    console.info(percent+'% loaded');
};

ioPromise.then(
    function(JSONresponse) {
        // All files are succesfully uploaded
        // JSONresponse holds the serverresponse as an Array:
        // each item has the response of every separate file-upload
    },
    function(err) {
        // Error during file uploading
        // Also occurs on network-errors
        console.warn(err);
    }
);

// call ioPromise.abort() to abort the transmission (if needed)
```
<u>Characteristics:</u>
* request-method: **PUT**
* request Content-Type: **application/octet-stream**
* request-headers: X-ClientId, X-TransId, X-Partial, X-Total-size
* request-headers last chunk: X-ClientId, X-TransId, X-Partial, X-Total-size, X-Filename
* response-data: **object**
* response-data any but last chunk: **{status: "BUSY"}**
* response Content-Type: **application/json**