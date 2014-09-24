---
module: virtual-dom
maintainer: Daniel Barreiro
title: "Parcela's virtual DOM manager"
intro: "Manages the virtual DOM, ensuring it is properly reflected in the browser actual DOM"
---

#The Basics#

One of the costliest operations in any web client application is handling the DOM.  The interface in between the JavaScript interpreted code and the DOM is very slow thus, the more it can be avoided, the better.   Parcela does this by keeping a copy of the actual DOM in what we call the virtual DOM.  This is a very succinct version of the actual DOM containing only relevant information.  When a render is requested, the virtual DOM will call the various Parcel instances requesting update versions of their views, which it will compare to its own virtual copy of the DOM.  It will then issue the smallest possible number of commands to the DOM to update it to reflect the new state.

The developer will usually have little interaction with the virtual DOM directly, it has only two methods, explained below. The usual way to interact with the virtual DOM is through the [Parcel](../parcel/index.html) class.

## The *actual*, the *existing* and the *expected* DOMs

The page that the browser shows is what we call the *actual* DOM.   Due to the cost of accessing the actual DOM, Parcela keeps a very handy copy of the actual DOM, which is the virtual-DOM.

There is always one copy of the virtual DOM and, occassionally and for brief intervals, sections of a second one.   The permanent one is the `existing` virtual DOM.  The actual DOM should reflect the `existing` virtual DOM since it has been created from it.

During the rendering process, a second `expected` virtual DOM is created by calling the `view` method of each of the `Parcel` instances.  The `existing` and the `expected` virtual DOMs are then compared and, when a difference is found, a suitable DOM method is invoked to change the actual DOM to reflect the new `expected` version.  The `existing` virtual DOM is also changed to reflect this new state.

At the end of the rendering process, the `expected` virtual DOM is dropped since, at this time, both the `existing` and the `expected` should be the alike.

The virtual DOM might represent the whole of the page or just a section of it.  Normally, the virtual DOM will be rooted under `document.body` but it can represent just a part of a page.

## The methods

### rootApp

The `rootApp` method defines the [parcel](../parcel/index.html) that will become the root of the application.  A Parcela application is made of a series of parcels nested within one another, the outer ones usually providing layout and the inner ones being active components showing the desired information.

The first argument to `rootApp` is a reference to a sub-class of `Parcel` that will become the root of the application.  This root application can be located anywhere within the web page.  A second argument can contain a reference to an actual DOM element in the page that will become the root of the application.  If missing `document.body` will be used.  Finally, a third, optional argument is a configuration object to be passed to the Parcel when instantiating it.

The root parcel will be appended to the given root, not disturbing any siblings that can be present.  In the `document.body` these will usually be the `<script>` tags loading the application.

It will automatically call the `render` method.   Calling `rootApp` more than once will dump the current virtual-DOM and completely replace the page.  The `destroy` method of the root parcel will be called before discarding it.

### render

The `render` method refreshes the screen. If called without any argument, it will start the process at the root parcel, otherwise, it will refresh only the given parcel, which must be part of the current virtual DOM.

The method will call the `view` methods of the parcels and generate the `expected` virtual DOM.   It will compare it with the `existing` virtual DOM and, when a difference is found, it will call the DOM methods to update the actual DOM.  The `existing` will then be updated to reflect these changes.

The `render` method will usually be called internally when the system detects external stimuli that might have produced changes within the state of the application.

### Routing

When [routing](../routing/index.html) is enabled, it is the routing subsystem that will call `rootApp` to trigger the render process for the corresponding page.

## The vNode

The basic structure of the virtual-DOM is the `vNode` which represents an actual DOM node.  It is an object with several properties.   There is one special kind of `vNode` that does not follow the standard which corresponds to text nodes.  For text nodes the whole `vNode` will only be a string or an instance of `String` with an added `node` property.

### tag

Corresponds to the `tagName` or `nodeName` property of an actual DOM node.  This is the only mandatory entry in a `vNode`.

### attrs

The `attrs` property is an object with properties corresponding to the DOM element properties.   It is optional and only attributes with values different from their defaults are included.

Two attributes receive special treatment.  The `class` attribute contains an array of strings.   The `style` attribute contains a further hash map of style names to their values.

The `attrs` may not be present if there are no entries.

### children

The `children` property is an array of child vNodes, if any.  The `children` property may be omitted if the `vNode` has no children.

### node

The `node` property holds a reference to the actual DOM node.  The property will be set in the *existing* virtual-DOM once it has been rendered into an actual DOM.

### parcel

A Parcela application is made of a series of nested Parcels.  Each instance of `Parcel` will be rendered into a `vNode` which, in turn, will produce an actual DOM node.   The `parcel` property points to the `Parcel` instance that created this `vNode`.

This property shows only in `vNode`s that correspond to a Parcel instance.  A `vNode` with its `parcel` propery set is usually called a `pNode`.

### stamp

In order to save on rendering time, `Parcel` instances can have a `stamp` method which will produce a value that represents the current state of the parcel. The virtual DOM doesn't care how this is computed but it only knows that if the result of calling `stamp` is the same as the last time, it means the contents of the parcel have not changed.   By default the `stamp` method of the `Parcel` base class returns `NaN` which is never equal to anything, not even to itself.  Thus, if unchanged, Parcels will always be checked for differences.  This does not mean that the whole DOM for the parcel will be refreshed, it only means the parcel in the *expected* vDOM will be checked for differences against the *existing* vDOM.  The virtual DOM tree will still be traversed in search for nested `pNode`s that might need refreshing.

See the [stamp](../parcel/index.html#the-stamp-method) method on the Parcel documentation.

