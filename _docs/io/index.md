---
module: io
itsaclassname: IO
version: 0.0.2
modulesize: 4.67
dependencies: "polyfill/polyfill-base.js, js-ext, ypromise (npm)"
maintainer: Marco Asbreuk
title: Promised I/O
intro: "This module consist of several submodule which provide easy IO. All submodules should be merged into IO to extend its features. The submodules have different (extra) sizes."
firstpar: get-started-window
---

#The Basics#

ITSA comes with a rollup of all io-modules, available with `ITSA.IO` which is ready to use. If you setup your own build-file, you can choose whatever io sub-module you like: they all return the same IO-object. If you setup yourself, you need to pass through the window-object:

```js
var IO = require('io')(window);
```
or

```js
var IO = require('io/extra/io-stream.js')(window);
```
or

```js
var IO = require('io/extra/io-transfer.js')(window);

require('io/extra/io-stream.js')(window); // extending IO
require('io/extra/io-cors-ie9.js')(window); // extending IO
```

##Initiate request##
Every IO is based upon Promises. This makes io really easy and straight foreward:

####Simple example####
```js
ITSA.IO.get(uri).then(
    function(response) {
        // `response` holds the serverdata
    },
    function(err) {
        // err is an Error() instance with the reasson for failure
    }
);
```

##Aborting request##
All io-methods have an `abort()`-method. By calling this, the io-request aborts and the promise gets rejected:
####Aborting io####
```js
var request;

request = ITSA.IO.get(uri);

request.then(
    function(response) {
        // code will not come here
    },
    function(reason) {
        // code will come here:
        // reason === 'Request aborted'
    }
);

request.abort();
```

##Same domain policy##

###On the Browser###
When used within a browser, io should be done within the same domain by default. This means also the same protocol and same subdomain. This is because browsers use `XMLHttpRequest` to make io-requests and the same-origin policy is applicable. If you need to make Cross Domain Requests (CORS), then you should use either one of these modules:

* **[io-proxy-node](#io-proxy-node)**
* **[io-cors](#io-cors)**

###On NodeJS###
When using io inside NodeJS, the same-origin policy is not relevant: in NodeJS you can make cross-domain request directly.

#io-transfer#
<p class="module-intro">
custom require: <b>var IO = require('io/extra/io-transfer.js')(window);</b><br>
size-min gzipped: 4.67 + 2.16 = <b>6.83 kb</b><br>
dependencies: <b>io, polyfill</b>
</p>

The `io-transfer` module comes with the following methods:

* io.**get**()
* io.**send**()
* io.**read**()
* io.**delete**()
* io.**insert**()
* io.**update**()

##General##

###io.get()###
Use io.get() to make a simple get-request where additional arguments are passed through as a query to the uri:
####io.get()####
```js
ITSA.IO.get('/getInfo?q=something').then(
    function(response) {
        // `response` hold the serverdata
    }
);
```
<u>Characteristics:</u>
* request-method: **GET**
* request Content-Type: **not applicable**
* response-data: **any**
* response Content-Type: **any**

###io.send()###
Use io.send() to send an object. The object can have a deep structure: the data is JSON-stringified at the request:
####io.send()####
```js
var data = {
    id: 10,
    personal: {
        name: 'Marco'
        lastname: 'Asbreuk'
    }
};

ITSA.IO.send('/send', data).then(
    function(response) {
        // `response` holds any data the server responded
    }
);
```
<u>Characteristics:</u>
* request-method: **PUT** _by default: full data-structure_
* request Content-Type: **application/json**
* response-data: **any**
* response Content-Type: **any**

##Data-structures##

###io.read()###
Use io.read() to read data into an object. The Promise will return an object-type, by JSON-parse the serverdata automaticly. Use the second argument (object-type) to specify the arguments that will be transfered into a querystring together with the GET-request. This cannot be a deep-object.

By default, `object` will be created with `Object.prototype` as their prototype. However, by specify `options.parseProto` (type = object), you can specify the prototype. To avoid any object to be created with `parseProto` as its prototype, you might also use `parseProtoCheck`, which is a function, recieving the object as argument. A truthy returnvalue would set `parseProto`, an untruthy won't.

**Note:** Make sure the server responses a JSON-object and having the Content-Type set to `application/json`:

####io.read()####
```js
// the next ITSA.IO.read() method will make the request: '/getData?id=25'
ITSA.IO.read('/getData', {id: 25}).then(
    function(data) {
        // `data` is an object
    }
);
```
<u>Characteristics:</u>
* request-method: **GET**
* request Content-Type: **not applicable**
* response-data: **Requested object JSON stringified**
* response Content-Type: **application/json**

####io.read() with different prototype####
```js
// the next ITSA.IO.read() method will make the request: '/getData?id=25'
var myproto = {
    sayHello: function() {return 'hello';}
};
ITSA.IO.read(
    '/getData',
    {id: 25},
    {
        parseProto: myproto,
        parseProtoCheck: function(obj) {
            // note: object.hasKey is made available by the module js-ext/lib/object.js
            return obj.hasKey('person');
        }
    }
).then(
    function(data) {
        // `data` is an object
    }
);
```

###io.delete()###
Use io.delete() to delete a data-structure on the server. Use the second argument (object-type) to specify the arguments that will be transfered into a querystring together with the GET-request. This cannot be a deep-object.

####io.delete()####
```js
// the next ITSA.IO.delete() method will make the request: '/removeData?id=25'
ITSA.IO.delete('/removeData', {id: 25}).then(
    function(response) {
        // the object is successfully removed
        // `response` holds any data the server responded
    }
);
```
<u>Characteristics:</u>
* request-method: **GET**
* request Content-Type: **not applicable**
* response-data: **any**
* response Content-Type: **any**

###io.insert()###
Use io.insert() to send an object to the server and inform it to insert. The Promise should return the finally object (object-type) as it was stored on the server. In order to do so, the server should return the final object in JSON format.

**Note:** Make sure the server responses a JSON-object and having the Content-Type set to `application/json`:

####io.insert()####
```js
var data = {
    personal: {
        name: 'Marco'
        lastname: 'Asbreuk'
    }
};

ITSA.IO.insert('/insertObject', data).then(
    function(insertedObject) {
        /*
         *`insertedObject` holds any data the server responded
         * It's very likely, the key is added:
         *
         * insertedObject === {
         *     id: 25,
         *     personal: {
         *         name: 'Marco'
         *         lastname: 'Asbreuk'
         *     }
         * };
         */
    }
);
```
<u>Characteristics:</u>
* request-method: **POST** _by default: partial data-structure_
* request Content-Type: **application/json**
* response-data: **newly created object JSON-stringified**
* response Content-Type: **application/json**

###io.update()###
Use io.update() to send an object to the server and inform it to update. The Promise should return the finally object (object-type) as it was updated on the server. In order to do so, the server should return the final object in JSON format. There is no special key-identification in the request: the objectdata that was send should hold all information needed for the server to determine which object it should update.

**Note:** Make sure the server responses a JSON-object and having the Content-Type set to `application/json`:

####io.update()####
```js
var data = {
    id: 25,
    personal: {
        name: 'Marco'
        lastname: 'Asbreuk'
    }
};

ITSA.IO.update('/updateObject', data).then(
    function(updatedObject) {
        /*
         *`updatedObject` holds any data the server responded
         * It's very likely it is the same as you have send,
         * but if the server changed properties, you see them here
         *
         * updatedObject === {
         *     id: 25,
         *     personal: {
         *         name: 'Marco'
         *         lastname: 'Asbreuk'
         *     }
         * };
         */
    }
);
```
<u>Characteristics:</u>
* request-method: **PUT** _by default: full data-structure_
* request Content-Type: **application/json**
* response-data: **finally updated object JSON-stringified**
* response Content-Type: **application/json**

##Sending full or partial data##
When you use the methods io.**send**(), io.**insert**() or io.**update**(), it is important to specify if you send the **full** data-structure, or **partial**. This can be set using `options.allfields`. These methods all have their default (different) value for options.allfields.

It is important, because this will define whether a `POST` or `PUT` method will be used:

* **POST** is used when you send an object where not all its properties go within the request. For example if you want to insert an object, but the server adds a key to it. Or when you update (with the key), but you don't send the whole object, but just the properties that changed.
* **PUT** is used when you send the <u>whole object</u>. Thus, all its properties go within the request: there are no additional properties on the server-side. In other word: the object is exactly defined.

<u>Don't think in terms of POST or PUT, but in terms of options.allfields = true/false</u>.

####Update an object partially####
```js
var data = {
    id: 25,
    personal: {
        name: 'Marco'
        lastname: 'Asbreuk'
    },
    country: 'The Netherlands'
};
updateData = data.merge();
// we only want to update the Country:
delete updateData.personal;

ITSA.IO.update('/updateObject', updateData, {allfields: false}).then(
    function(updatedObject) {
    }
);
```

##Processing data on client##
When you use the methods io.**read**(), io.**insert**() or io.**update**(), the server should return JSON-data and the response's Content-Type has to be `application/json`. This way, the Promise holds an object-type in its fulfilled-callback.

###JSON Date-type client###
By default, _JSON does not parse Dates into Date-type_. Instead, they appear as String-type. However, by using the options argument, you can set {parseJSONDate: true}. This makes Date-properties to be parsed into date-types (assumed they are ISO-8601 formatted).

**Note:** by default parseJSONDate is set false. Only set true if you expect Date-types, because parsing Dates is a performancehit (each property is inspected to be a ISO-8601 Date).

####Reading objects with Date-fields####
```js
// the next ITSA.IO.read() method will make the request: '/getData?id=25'
ITSA.IO.read('/getData', {id: 25}, {parseJSONDate: true}).then(
    function(data) {
        // `data` is an object
        // data.birthday is Date-type
    }
);
```

##Processing data on server##
When you use the methods io.**send**(), io.**insert**() or io.**update**(), the client sends JSON-data with Content-Type `application/json`. The server should be set up to process application/json data.

###Determine update vs insert###
Both io.insert() as well as io.update() send an object to the server. You could **cannot** distinguish between these two methods by looking at the transfer-method. As explained [above](#sending-full-or-partial-data), both methods could use either the "POST" or "PUT" method.

One way to distinguish, is by using a different uri. Another way is to examine the HTTP-header: `X-Action`. This is a custom header that is set by both io.insert() and io.update(). X-Action will be either **insert** or **update**.

###JSON Date-type server###
At the server, you might want to process data-structures as having a true Date-type. Because the client is sending JSON-stringified data, and Date-type is transformed into ISO-8601 format --> this is a String-type.

By using the options argument, you can set **{parseJSONDate: true}**. This is helpful when receiving data (as explained [above](#json-date-type-client)), but it also helps to inform the server: it will add the HTTP-header `X-JSONDate: true`. This is a customheader which could be used as explained in the next example:

####Setting up express-server parsing Date-objects####
```js
var express = require('express'),
    bodyParser = require('body-parser'),
    DATEPATTERN = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/,
    REVIVER = function(key, value) {
        return DATEPATTERN.test(value) ? new Date(value) : value;
    };

var app = express();

app.use(function (req, res, next) {
    bodyParser.json(req.headers['x-jsondate'] ? {reviver: REVIVER} : null)(req, res, next);
})

app.all('*', function (req, res) {
    var data = req.param('data');
    // if `data` was send as a json-stringified object,
    // it is a true Object now.
    // if the header 'X-JSONDate' was set at the request,
    // it has fully Date-properties.
});

app.listen(8080);
```
**Note 1:** Don't use REVIVER for all data - even when there are no Date-types. Parsing Dates is a performancehit (each property is inspected to be a ISO-8601 Date).

**Note 2:** when using `io-cors` you must be aware that <u>IE<10 will not send custom HTTP-headers</u>.


#io-filetransfer#
<p class="module-intro">
custom require: <b>var IO = require('io/extra/io-filetransfer.js')(window);</b><br>
size-min gzipped: 8.11 + 4.78 = <b>12.89 kb</b><br>
dependencies: <b>io, js-ext, messages</b>
</p>
The **io-filetransfer**-module is meant to upload `blob's` or `files`. It adds one method to io: io.**sendBlob**(). When fulfilled, the callback returns a json-object. On error, the promise gets rejected.

The file(s) are send in chuncks (parallel). Combined with `SPDY`, or `HTTP2`, you get *ultrafast* file-uploads.

`IO.sendBlob` returns a promise with the `abort()`-method. This method can be used to abort the transmission. All chuncks will then be aborted.

####io.sendBlob()####
```js
var inputElement = document.getElement('input'), // type="file"
    firstFile = inputElement.files[0],
    ioPromise = IO.sendBlob('http://somedomain.com/processfile', firstFile, {id: 'myfile'}, {progressfn: progressfn}),
    progressfn;

progressfn = function(e) {
    var percent = Math.round(100*(e.loaded/e.total));
    console.info(percent+'% loaded');
};

ioPromise.then(
    function(JSONresponse) {
        // File succesfully uploaded
        // JSONresponse holds the serverresponse as an object
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


##Technical details##
Every blob-transfer and every chunk needs to be identified. This is automaticly done in the following way:

**Request:**

* Every client identified with an unique `X-ClientId`-header. This id will be automaticly retrieved by a preflight GET-request, at the time of the very first blob-transfer.
* Every blob-transfer is identified with a `X-TransferId`-header.
* Every blob-transfer is separated into chunks. Every chunk is identified with a `X-Partial` and `X-Total-size` header: the latter representing the size of all chunks.
* The final chunk has a header named `X-Filename` which equals either the filename, or 'blob'

**Response:**

* To get the unique `X-ClientId`-header, a preflight GET-request is made, returning a `String` with the unique ClientId.
* When sending the blob, Only the final response (when the file is rebuild on the server), has a json-object with any data. All other chunks have an object that looks like: {status: "BUSY"}


##Setting up the server##

The server needs to response 2 different requests: preflight request, asking the unique ClientId, and the PUT-request of all blob-chunks.

###Response of ClientId###
The response of the `ClientId` should be made in a way that it is unique to the server. Once the cient has this id (see it as a session-id, thought it is not stored as a cookie), it can upload blobs or files on behalf if this Id. This way the server can distinguish blobs with the same `X-TransId` (coming from different clients). The server-`route` should be exactly the same as where the blob is going to be uploaded, only it is a `GET`-request.

<u>Characteristics:</u>
* request-method: **GET**
* response-data: **ClientId**
* response Content-Type: **text/xml**

###Response of Blob/file###
Each chunk is send to the server with its own unique headers: `X-ClientId`, `X-TransId`, `X-Partial` and `X-Total-size`. The server should combine all chunks into one final file. The final chunk has a header named `X-Filename`: this is the moment that the server has both the filename, as well as the total number of chunks (the `X-Partial~ of this request). This last chunk is likely to arive the server before the second last chunk, so the server needs to monitor the number of chunks that arive for this `X-ClientId`+`X-TransId` combination. If all chunks have arived, the final file should be build and the server should response with any arbitrary `json-object` data. The intermediate chunk-requests should be returned with json-data: {"status": "BUSY"}

**Intermediate chunk-response:**

<u>Characteristics:</u>
* request-method: **PUT**
* response-data: **{status: "BUSY"}**
* response Content-Type: **application/json**

*Response once the final blob has been generated:* (not necessary the response of the last chunk-request)

<u>Characteristics:</u>
* request-method: **PUT**
* response-data: **any**
* response Content-Type: **application/json**

###Using CORS###
When using CORS, the server needs to be prepared in a special way (extra routes, additional headers):

* The above mentioned `GET` and `PUT` response, should come with: `header("access-control-allow-origin", "yourcrossdomain.com")` or `header("access-control-allow-origin", "*")`
* You should have an `OPTIONS` route defined, that defines permission for CORS. See example below:

####Route for OPTIONS request in Hapijs:####
```js
{
    method: 'OPTIONS',
    path: '/procesblob',
    handler: function (request, reply) {
        var requestHeaders = request.headers['access-control-request-headers'];
        reply().header("access-control-allow-origin", "*") // or reply().header("access-control-allow-origin", "yourcrossdomain.com")
               .header("access-control-allow-methods", "PUT,GET")
               .header("access-control-allow-headers", requestHeaders)
               .header("access-control-max-age", "1728000")
               .header("content-length", "0");
    }
}
```

###Example serverside code###
Setting up the server can be a tricky thing. We have made a `commonjs`-module for usage with `nodejs/hapijs`. **[This module can be found here](https://github.com/itsa-server/file-upload-handler)**. Note that this module will remove the file that has been created (in the tmp-dir) after the final response has been sent. So you must move the file to its final destination and return a promise, otherwise the created file is gone.

The code to use is, would be:

####Exampleroutes for Hapijs same domain:####
```js
var tmpDir = '/var/www/vhosts/somedomain/tmp/',
    destinationDir = '/var/www/vhosts/somedomain/httpdocs/images/',
    maxSize = 100*1024*1024, // 100Mb
    uploadHandler = require('file-upload-handler')(tmpDir, maxSize),
    maxFileSizeForThisRoute = 5*1024*1024, // 5Mb
    fsp = require('fs-promise'),
    routes;

require('fs-extra');

routes = [
    {
        method: 'GET',
        path: '/procesblob',
        handler: function (request, reply) {
            generateClientId(request, reply);
        }
    },

    {
        method: 'PUT',
        path: '/procesblob',
        handler: function (request, reply) {
            // max fileupload for this route is overruled into 5MB
            recieveFile(request, reply, maxFileSizeForThisRoute, function(fullTempFilename, originalFilename) {
                if (originalFilename) {
                    destinationFile = destinationDir+originalFilename;
                    return fsp.exists(destinationFile).then(function(exists) {
                        if (exists) {
                            return fsp.unlink(destinationFile);
                        }
                    })
                    .then(function() {
                        return fsp.move(fullTempFilename, destinationFile);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
                }
            });
        }
    }
];
```

####Exampleroutes for Hapijs using CORS:####
```js
var tmpDir = '/var/www/vhosts/somedomain/tmp/',
    destinationDir = '/var/www/vhosts/somedomain/httpdocs/images/',
    maxSize = 100*1024*1024, // 100Mb
    uploadHandler = require('file-upload-handler')(tmpDir, maxSize),
    maxFileSizeForThisRoute = 5*1024*1024, // 5Mb
    fsp = require('fs-promise'),
    routes;

require('fs-extra');

routes = [
    {
        method: 'GET',
        path: '/procesblob',
        handler: function (request, reply) {
            generateClientId(request, reply, 'yourcrossdomain.com');
        }
    },

    {
        method: 'PUT',
        path: '/procesblob',
        handler: function (request, reply) {
            // max fileupload for this route is overruled into 5MB
            recieveFile(request, reply, maxFileSizeForThisRoute, function(fullTempFilename, originalFilename) {
                if (originalFilename) {
                    destinationFile = destinationDir+originalFilename;
                    return fsp.exists(destinationFile).then(function(exists) {
                        if (exists) {
                            return fsp.unlink(destinationFile);
                        }
                    })
                    .then(function() {
                        return fsp.move(fullTempFilename, destinationFile);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
                }
            }, 'yourcrossdomain.com');
        }
    },
    {
        method: 'OPTIONS',
        path: '/procesblob',
        handler: function (request, reply) {
            var requestHeaders = request.headers['access-control-request-headers'];
            reply().header("access-control-allow-origin", "yourcrossdomain.com")
                   .header("access-control-allow-methods", "PUT,GET")
                   .header("access-control-allow-headers", requestHeaders)
                   .header("access-control-max-age", "1728000")
                   .header("content-length", "0");
        }
    }
];
```


#io-xml#
<p class="module-intro">
custom require: <b>var IO = require('io/extra/io-xml.js')(window);</b><br>
size-min gzipped: 4.67 + 0.44 = <b>5.11 kb</b><br>
dependencies: <b>io</b>
</p>
The **io-xml**-module is meant for xml-request. It adds one method to io: io.**readXML**(). When fulfilled, the callback returns a XML-object. On error, the promise gets rejected.

####io.readXML()####
```js
ITSA.IO.readXML(uri, {id: 25}).then(
    function(responseXML) {
        // responseXML holds an xml-object
    }
);
```
<u>Characteristics:</u>
* request-method: **GET**
* request Content-Type: **not applicable**
* response-data: **XML-object**
* response Content-Type: **text/xml**

#io/io-assets.js#
_work in progress_

#io-stream#
<p class="module-intro">
custom require: <b>var IO = require('io/extra/io-stream.js')(window);</b><br>
size-min gzipped: 4.67 + 0.23 = <b>4.90 kb</b><br>
dependencies: <b>io</b>
</p>

Streaming IO is extremely simple. You just need to define `options.streamback` and this callbackFn will recieve all streamed data. The final resolved Promise will resolve with all the data, just as if were a non-streamed request. The callbackFn recieves the data unmodified, or in case of `IO.read()` or `IO.readXML()` it will be parsed into an **object** or **XML-object**.

Streaming works for all browsers, also `IE9` and below (by using `XDomainRequest`).

##Handling streamed data##

###plain data###
```js
var options, callbackFn;

callbackFn = function(data) {
    // data is the partial data, unmodified
};
options = {
    url: '/stream',
    method: 'GET',
    streamback: callbackFn,
    data: {id: 25}
};

IO.request(options).then(
    function(xhr) {
        var allData = xhr.responseText;
    }
);
```

###using IO.read()###
```js
var url, data, options, callbackFn;

callbackFn = function(data) {
    // data is the partial data --> object or array
};

url: '/stream';
data: {id: 25};
options= {streamback: callbackFn};

IO.read(url, data, options).then(
    function(allData) {
        // allData is an object or array
    }
);
```

In order to make `IO.read()` process the data in its streamback, the server must send its response in defined parts, separated with an ending comma.

####Example server-response in case of a large object:####
```js
'{a:1, b:2, c:3,' // <-- first response
'd:1, e:2, f:3,' // <-- intermediate response
'g:1, h:2, i:3,' // <-- intermediate response
'j:1, k:2, l:3}' // <-- last response
```
Streamed-back data will be objects like: **{d:1, e:2, f: 3}**.

####Example server-response in case of a large array:####
```js
'[{a:1}, {b:2}, {c:3},' // <-- first response
'{d:1}, {e:2}, {f:3},' // <-- intermediate response
'{g:1}, {h:2}, {i:3},' // <-- intermediate response
'{j:1}, {k:2}, {l:3}]' // <-- last response
```
Streamed-back data will be arrays like: **[{d:1}, {e:2}, {f: 3}]**.


###using IO.readXML()###
```js
var url, data, options, callbackFn;

callbackFn = function(xml) {
    // xml is partial xml-data with the same documentElement as the final xml-object
};

url: '/stream';
data: {id: 25};
options= {streamback: callbackFn};

IO.readXML(url, data, options).then(
    function(allXML) {
        // allXML is an xml-object
    }
);
```

In order to make `IO.readXML()` process the data in its streamback, the server must send its response in defined XML-parts, separated with an ending comma.

####Example server-response in case of a large XML-object####
```js
<?xml version="1.0" encoding="UTF-8" ?><root><div>item 1</div><div>item 2</div><div>item 3</div> // <-- first response
<div>item 1</div><div>item 2</div><div>item 3</div> // <-- intermediate response
<div>item 4</div><div>item 5</div><div>item 6</div> // <-- intermediate response
<div>item 7</div><div>item 8</div><div>item 9</div></root> // <-- last response
```

**Note1:** When a streambackFn is defined, it will always be invoked, even if the server doesn;t stream. In that case, it will be invoked once with the final value.
**Note2:** `XDomainRequest` only fires the `onprogress`-event when the block of code exceeds 2kb [see here](http://blogs.msdn.com/b/ieinternals/archive/2010/04/06/comet-streaming-in-internet-explorer-with-xmlhttprequest-and-xdomainrequest.aspx). So, IE might not be as responsive as other browsers. The streamroutine is made in a way that `onprogress` always gets involved, even if the total amount of sata is below 2kb (see Note 1).


#io-cors-ie9#
<p class="module-intro">
custom require: <b>var IO = require('io/extra/io-cors-ie9.js')(window);</b><br>
size-min gzipped: 4.67 + 8.32 = <b>12.99 kb</b><br>
dependencies: <b>io, xmldom (npm)</b>
</p>

CORS stand for `Cross-Origin Resource Sharing`. In other words: loading data from a different origin. An origin is only the same when protocol and subdomain from both current site as from requested data-source are equal:

<u>Same origin:</u>

* **http://www.mydomain.com/** <--> **http://www.mydomain.com/**subfolder/

<u>Cross origin:</u>

* http://www.**mydomain**.com/ <--> http://www.**differentdomain**.com/
* http://**www**.mydomain.com/ <--> http://**subdomain**.mydomain.com/
* http://**www**.mydomain.com/ <--> http://mydomain.com/
* **http**://www.mydomain.com/ <--> **https**://www.mydomain.com/

By default, none of the io-submodules support CORS, though you might find out some browsers in some situatations will work (XMLHttpRequest2 supports CORS if the server is set up right).

To enable CORS, you must setup both the client and server.

**Note 1:** that CORS isn't magic. <u>If you don't need it, don't use it</u>. Not only you need to download more code, CORS has its limitations.
**Note 2:** instead of using `io-cors`, we advise to use `io-proxy-node`-module which can achieve the same without all CORS-limitations.

##Enable CORS on client##

To enable CORS on the client, you only need to include `io-cors` and extend IO:

```js
ITSA.IO.get('http://differentdomain.com/getData').then(
    function(response) {
        ...
    }
);
```

##Enable CORS on server##

While enabling CORS on the client is easy, setting up the server is a bit more difficult. You have to face these side-effecs:

* The server must be setup to accept your origin
* The server must be setup to response an `OPTIONS` request (known as Preflight)
* CORS on IE9- cannot send `HEADERS` and it only get create `POST` or `GET` requests
* The server should set the response-header "Cache-Control: no-cache"

These setup are required to make `io-cors` work well. Below is described why this module needs so (more reading about CORS: [read this article](http://www.nczonline.net/blog/2010/05/25/cross-domain-ajax-with-cross-origin-resource-sharing/)).

###Access-Control-Allow-Origin###
The server-response should have set the header `Access-Control-Allow-Origin`. This is the most basic rule for CORS. You can set this in the responseheader or make Apache or Nginx to do so.

####Allow origin in express (nodejs)####
```js
app.get('*', function (req, res) {
    // use: res.set('access-control-allow-origin', '*'); to allow all sites
    res.set('access-control-allow-origin', 'http://www.some-site.com');
    res.set('cache-controll', 'no-cache');
    res.send('some content');
});
```

####Allow origin in Apache####
```
<VirtualHost *:80>
    Header set Access-Control-Allow-Origin *
    ...
</VirtualHost>
```

###Preflight###

Moderns borwsers will use XMLHttpRequest2. This version supports CORS natively, but us has one side-effect: _when custom headers are set, a Preflight is made_. Because `io` will set the custom header 'If-Modified-Since' to prevent GET-responses from caching, you will always face the Preflight.

Preflight is that the browser makes an initial request to find out it has the rights to make the final request. This all happens automaticly: the browser will make an `OPTIONS` request. The tricky part is, that the server **should** response with information about what the client may request. This information should at least consist of these responseheaders:

* Access-Control-Allow-Origin
* Access-Control-Allow-Methods
* Access-Control-Allow-Headers

Suppossing in most cases you accept the requested headers, the server could be set up as this:
####Create OPTIONS response (nodejs)####
```js
app.options('*', function (req, res) {
  var requestHeaders = req.headers['access-control-request-headers'];
  res.set({
         'access-control-allow-origin': '*',
         'access-control-allow-methods': 'POST, GET, PUT, DELETE',
         'access-control-allow-headers': requestHeaders,
         'access-control-max-age': '1728000',
         'content-length': 0
     })
     .status(204)
     .send();
});
```

The `access-control-max-age`-header is set to prevent the client from making an OPTIONS-request all the time.

###IE9- has no headers and only GET/POST###
IE9 and cannot use XMLHttpRequest2, instead it uses [XDomainRequest](http://msdn.microsoft.com/en-us/library/cc288060(VS.85).aspx). This has some serious limitations:

* no request-headers are sent
* no request content-type is specified
* only GET and POST requests will be used

`io-cors` will take care of tranforming every io-request into an valid request. You don't need to bother. However, you should be aware that the server will receive less information when IE9- makes the request. These side-effect include the following:

* the server cannot know if you asked for 'application/json' data
* the server might create an alternative route for `DELETE` requests, as IE9- will request them as a `GET` request
* the server might create an alternative route for `PUT` requests, as IE9- will request them as a `POST` request
* because the client doesn't have a 'If-Modified-Since' header, the server should response with the header: 'cache-controll': 'no-cache'

To be able to handle 'application/json' requests, the server could look for the user-agent of the request. In case IE9- is found and its method is `POST`, it could assume 'application/json'. There is a node-module that does just that: [express-ie-cors](https://www.npmjs.org/package/express-ie-cors).

####Create GET and POST response (nodejs)####
```js
var express = require('express'),
    bodyParserIEcors = require('express-ie-cors'),
var app = express();

// parse application/x-www-form-urlencoded for IE using cors
// cors-ie cannot recieve a content-type: so it is unaware of the contentype and will not parse the right way
// in case of IE<10 browsers, the useragent is determined and contentype of 'application/json' is assumed on POST-requests
// in case you need another contentype, you could use something like this instead:
// app.use(bodyParserIEcors({contentType: 'application/x-www-form-urlencoded'}));
app.use(bodyParserIEcors('application/json;charset=utf-8'));

app.get('*', function (req, res) {
    res.set('access-control-allow-origin', '*');
    res.set('cache-control', 'no-cache');
    res.send('some content');
});

app.post('*', function (req, res) {
    res.set('access-control-allow-origin', '*');
    res.send('some content');
});
```

##Browser-support##

###Supported browsers###
* All modern browsers and IE10+ (XMLHttpRequest2)
* IE8 and IE9 (XDomainRequest), *except for io-filetransfer*

###Not supported browsers###
* Opera mini
* IE7-
* IE9- related to io-filetransfer

##Alternatives to CORS##

Because CORS its limitation and hard setup, we suggest to setup your server as a proxy instead. Make the request to the same origin (without CORS), and let your server fetch the data from the other origin. This not only saves you from sending extra code to the client, it also guarantees the code works in all browsers, has no limitation and no hard setup for the CORS-server. See **[io-proxy-node](#io-proxy-node)**.

#io/io-jsonp.js#

_work in progress_

#io/io-proxy-node.js#

_work in progress_