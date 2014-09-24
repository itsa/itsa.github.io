---
module: io
version: 0.0.1
maintainer: Marco Asbreuk
title: Promised-IO
intro: "This module consist of several files which provide easy IO. All modules extend <b>Parcela/io</b> and provide methods by which you can use IO."
firstpar: get-started
---

<b>Step 1:</b> create package.json

```json
{
    "name": "my-project",
    "version": "0.0.1",
    "dependencies": {
        "io": "Parcela/io",
        "io-transfer": "Parcela/io-transfer"
    }
}
```

<b>Step 2:</b> create your webapplication like this:

```js
<script>
    var IO = require('io'),
        IOtransfer = require('io-transfer'); // delivers the method 'get'

    IOtransfer.mergeInto(IO);

    IO.get('/getInfo?q=something').then(
        function(response) {
            // `response` holds the remotedata
        }
    );
</script>
```


#The Basics#

##Initiate request##
Every io is based upon Promises. This makes io really easy and straight foreward:

####Simple example####
```js
var io = require('io');

io.get(uri).then(
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
var io, request;

io = require('io');
request = io.get(uri);

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
var io = require('io');
io.get('/getInfo?q=something').then(
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
var io, data;

io = require('io');
data = {
    id: 10,
    personal: {
        name: 'Marco'
        lastname: 'Asbreuk'
    }
};

io.send('/send', data).then(
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

**Note:** Make sure the server responses a JSON-object and having the Content-Type set to `application/json`:

####io.read()####
```js
var io = require('io');

// the next io.read() method will make the request: '/getData?id=25'
io.read('/getData', {id: 25}).then(
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

###io.delete()###
Use io.delete() to delete a data-structure on the server. Use the second argument (object-type) to specify the arguments that will be transfered into a querystring together with the GET-request. This cannot be a deep-object.

####io.delete()####
```js
var io = require('io');

// the next io.delete() method will make the request: '/removeData?id=25'
io.delete('/removeData', {id: 25}).then(
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
var io, data;

io = require('io');
data = {
    personal: {
        name: 'Marco'
        lastname: 'Asbreuk'
    }
};

io.insert('/insertObject', data).then(
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
var io, data;

io = require('io');
data = {
    id: 25,
    personal: {
        name: 'Marco'
        lastname: 'Asbreuk'
    }
};

io.update('/updateObject', data).then(
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
var io, data;

io = require('io');
data = {
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

io.update('/updateObject', updateData, {allfields: false}).then(
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
var io, data;

io = require('io');
// the next io.read() method will make the request: '/getData?id=25'
io.read('/getData', {id: 25}, {parseJSONDate: true}).then(
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

#io-xml#

The **io-xml**-module is meant for xml-request. It adds one method to io: io.**readXML**(). When fulfilled, the callback returns a XML-object. On error, the promise gets rejected.

####io.readXML()####
```js
var io = require('io');

io.readXML(uri).then(
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

#io-assets#
#io-stream#

#io-cors#

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
var io, iocors;

io = require('io');
iocors = require('io-cors');
iocors.extend(io);

io.get('http://differentdomain.com/getData').then(
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
    res.set('cache-controll', 'no-cahce');
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
app.use(bodyParserIEcors());

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
* IE8 and IE9 (XDomainRequest)

###Not supported browsers###
* Opera mini
* IE7-

##Alternatives to CORS##

Because CORS its limitation and hard setup, we suggest to setup your server as a proxy instead. Make the request to the same origin (without CORS), and let your server fetch the data from the other origin. This not only saves you from sending extra code to the client, it also guarantees the code works in all browsers, has no limitation and no hard setup for the CORS-server. See **[io-proxy-node](#io-proxy-node)**.

#io-jsonp#

#io-proxy-node#
