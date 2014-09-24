YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Event",
        "Event.Emitter",
        "Event.Listener",
        "Function",
        "IO",
        "ITSA",
        "Object",
        "Promise",
        "Promise.Resolver",
        "Utils"
    ],
    "modules": [
        "ITSA",
        "event",
        "event-dom",
        "event-emitter",
        "event-hammerjs",
        "event-listener",
        "extend-function",
        "extend-js",
        "extend-object",
        "extend-promise",
        "io",
        "io-win",
        "utils"
    ],
    "allModules": [
        {
            "displayName": "event",
            "name": "event",
            "description": "Defines the Event-Class, which should be instantiated to get its functionality\n\n<i>Copyright (c) 2014 Parcela - https://github.com/Parcela</i>\nNew BSD License - https://github.com/ItsAsbreuk/itsa-library/blob/master/LICENSE"
        },
        {
            "displayName": "event-dom",
            "name": "event-dom",
            "description": "Integrates DOM-events to core-event-base. more about DOM-events:\nhttp://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/\n\nShould be called using  the provided `mergeInto`-method like this:"
        },
        {
            "displayName": "event-emitter",
            "name": "event-emitter",
            "description": "Extends the Event-instance by adding the method `Emitter` to it.\nThe `Emitter-method` returns an object that should be merged into any Class-instance or object you\nwant to extend with the emit-methods, so the appropriate methods can be invoked on the instance.\n\n<i>Copyright (c) 2014 Parcela - https://github.com/Parcela</i>\nNew BSD License - https://github.com/ItsAsbreuk/itsa-library/blob/master/LICENSE\n\nShould be called using  the provided `extend`-method like this:"
        },
        {
            "displayName": "event-hammerjs",
            "name": "event-hammerjs",
            "description": "Integrates DOM-events to core-event-base. more about DOM-events:\nhttp://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/\n\nShould be called using  the provided `init`-method like this:"
        },
        {
            "displayName": "event-listener",
            "name": "event-listener",
            "description": "Extends the Event-instance by adding the object `Listener` to it.\nThe returned object should be merged into any Class-instance or object you want to\nextend with the listener-methods, so the appropriate methods can be invoked on the instance.\n\n<i>Copyright (c) 2014 Parcela - https://github.com/Parcela</i>\nNew BSD License - https://github.com/ItsAsbreuk/itsa-library/blob/master/LICENSE\n\nShould be called using  the provided `extend`-method like this:"
        },
        {
            "displayName": "extend-function",
            "name": "extend-function",
            "description": "Pollyfils for often used functionality for Functions"
        },
        {
            "displayName": "extend-js",
            "name": "extend-js"
        },
        {
            "displayName": "extend-object",
            "name": "extend-object",
            "description": "Pollyfils for often used functionality for Objects"
        },
        {
            "displayName": "extend-promise",
            "name": "extend-promise",
            "description": "Provides additional Promise-methods. These are extra methods which are not part of the PromiseA+ specification,\nBut are all Promise/A+ compatable."
        },
        {
            "displayName": "io",
            "name": "io"
        },
        {
            "displayName": "io-win",
            "name": "io-win",
            "description": "Provides core IO-functionality.\n\nThe returned xhr DOES support CORS for all modern browsers.\nTo use CORS, you need to setup the responseserver right\nMore info about CORS: http://remysharp.com/2011/04/21/getting-cors-working/\n\n\n\n\nTODO: make STREAMING with IE9-browsers work: the XDomainRequest() seems not to fire the onprogress-event...\n      (and XMLHttpRequest1 doesn't have this event at all)\nTODO: make CORS with IE9-browsers work: the XDomainRequest() fails currently on cors..\n\n\n\n\nUsing CORS with IE9-browsers need special consideration, for it uses the XDomainRequest():\n1. Only GET and POST methods are supported. Other methods will be reset into one of these,\n   so make sure the cross-domain-server handles all requests as being send with the GET or POST method.\n2. Only text/plain is supported for the request's Content-Type header. This will lead into troubles when handling\n   POST-requests: the cross-domain-server needs to extract the parameters itself. For nodejs, there is a nice npm module:\n   `express-ie-cors` https://github.com/advanced/express-ie-cors/blob/master/lib/express-ie-cors.js\n3. No custom headers can be added to the request.\n4. No authentication or cookies will be sent with the request.\nmore info: http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx"
        },
        {
            "displayName": "ITSA",
            "name": "ITSA",
            "description": "The ITSA module is an aggregator for all the individual modules that the library uses.\nThe developer is free to use it as it is or tailor it to contain whatever modules\nhe/she might need in the global namespace.\n\nThe modules themselves work quite well independent of this module and can be used\nseparately without the need of them being integrated under one globa namespace."
        },
        {
            "displayName": "utils",
            "name": "utils",
            "description": "Collection of various utility functions."
        }
    ]
} };
});