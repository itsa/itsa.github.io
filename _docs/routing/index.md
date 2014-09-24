---
module: routing
maintainer: Daniel Barreiro
title: Routing
intro: "Provides routing for single page applications"
---
#The Basics#

A single page application requires a simple way to move from one view to another and for all those movements to be refleted in the browser history and the location bar so they can be bookmarked and returned to at a later time.

The Router class provides those services for Parcela.  It is based on a routing table which associates each URL with the Parcel that will handle it.   If the user somehow navigates to any route in the table, the corresponding Parcel will be instantiated.  It will receive as its configuration attributes all the parameters received.

```
var Page1 = Parcela.Parcel.subClass({
    init: function (config) {
		console.log(config);
	},
	view: function () {
	     return this.route + ' [' + this.itemId + ']';
    }
});

Parcela.Router({
	'/': Page1,
	'/item/:itemId', Page1
});
```

In the example above we defined a simple Parcel that will show the arguments received when initialized and, when rendered, will show the route and the id of the requested item. (we will see how in a moment).

In the Router we define two routes, both pointing to the same Parcel we defined earlier.  The first route is the root of the application, the second is a parameterized route.  

If the user navigates to `http://server/` the first route will be matched an instance of `Page1` will be instantiated with the argument: `{route: '/'}`.  As with all Parcels, the initialization arguments are available to its `init` method, which in this case will print `{route: '/'}` in the console.  It will also set properties in the instance with the names of the arguments (unless those properties already exist, it will never overwrite an existing property or method).

The Parcel will be immediately rendered and the `view` will show `/ [undefined]`.

If the user navigates to `http//server/item/123` the second route will be activated.  A new instance of Page1 will be created (usually a separate Parcel would be provided) and passed the following argument: `{route: '/item/', itemId:'123'}` which the `init` method would log on the console.  The `view` would then display `/item/ [123].

## Routing

The `Parcela.Router` is actually a static class. It cannot be instanced, there can only one in an application. For simplicity, it is also a function which calls the `Router.setRouting` method.   The first argument, as we have seen above, is the routing table, a hash map made of routes and the Parcel that handles it.

There are three further optional arguments to this function.  
* The `mode` for the url, it can be any of `search` (the default), `hash` or `pathname` which will affect how the url is parsed.
* The `defaultRoute`, which will be used if the route the user navigates doesn't match any in the table.  By default it is set to `/`.  
* The DOM element that will contain the single page application.  If none is given, it defaults to `document.body`.  The application will append itself to that element without disturbing existing elements such as `<script>` tags.

### Variable routes

Routes can contain parameters prefixed with a colon `:` as shown above.  The Parcel routed into will receive a hash map with these parameters, indexed by the indentifier that follows the `:`.

The identifier can be further followed by three dots `...` which will make the router skip on path separators until the end of the string or whatever pattern follows the `...`.  Thus:
```
/diameter/:size.../length/:length 
```
Would allow to specify `/diameter/3/8"/length/4"` and get `{size:'3/8"': length:'4"'}`.

### Routing modes

**Must be rewritten:**  (taken from Mithril)

The m.route.mode property defines which URL portion is used to implement the routing mechanism. Its value can be set to either "search", "hash" or "pathname". Default value is "search". Note that if you're changing this configuration value, you should change it before calling m.route.

search mode uses the querystring (i.e. ?). This allows named anchors (i.e. <a href="#top">Back to top</a>, <a name="top"></a>) to work on the page, but routing changes causes page refreshes in IE8, due to its lack of support for history.pushState.

Example URL: http://server/?/path/to/page

hash mode uses the hash (i.e. #). It's the only mode in which routing changes do not cause page refreshes in any browser. However, this mode does not support named anchors.

Example URL: http://server/#/path/to/page

pathname mode allows routing URLs that contains no special characters, however this mode requires server-side setup in order to support bookmarking and page refreshes. It also causes page refreshes in IE8.

Example URL: http://server/path/to/page

The simplest server-side setup possible to support pathname mode is to serve the same content regardless of what URL is requested. In Apache, this URL rewriting can be achieved using ModRewrite.

## Parcel

The Parcel run by each route is a *appFrame* parcel.  It provides the outermost frame where all the other components of the parcel will be rendered.  It usually has little visible content of its own, it is mostly a skeleton where the rest of the components of that particular app are run.  However, it doesn't mean it doesn't do anything.

The *appFrame* parcel is responsible for ensuring that all the resources for the page are available.  It will usually load the data associated with the items requested via the url parameters.   If dynamic module loading is available, it will also require the modules needed to handle the data.  It will usually be responsible for updating the title bar, which also gets stored in the history and bookmarks, so it makes it easy for the user to go back to any page view.

