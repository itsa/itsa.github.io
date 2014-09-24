---
module: parcel
maintainer: Daniel Barreiro
title: Parcels of screen real-state
intro: "Each Parcel instance is responsible for handling its own little patch of screen"
---
#The Basics#

Parcels are responsible for displaying information to the user.   Each should be responsible for a little section of the screen.  Parcels can contain other Parcels and a whole single page application will often be a single Parcel that has sub-Parcels that contain further sub-sub-Parcels and so on (see [Nesting Parcels](#nesting-parcels) below).

Parcels are lightweight and easy to nest, there is no reason to pack lots of power in a few Parcels, it is better to subdivide the job into several Parcels.  Thus, a Table might be build of a Parcel for the Table element itself plus sub-Parcels for each of the head, body and footer sections, each containing a Parcel for each of the rows.

Parcels are created as subclasses of the `Parcel` class.

```js
var Table = Parcela.Parcel.subClass({
    init: function (config) {
		// code to control state and behavior
	},
	view: function () {
		// should return an updated image 
		// of its parcel of virtual DOM.
		return '';
	},
	destroy: function () {
	    // free any resources taken in init.
	}
};
```

##Initialization

The `init` method is responsible for setting up the Parcel so it can respond to external events.  Its main tasks are:

* Setting the initial state of the Parcel.
* Creating references to external data that the `view` might use.
* Attaching events listeners to resources might affect it.

The `init` method will receive at least the configuration options, a hash map of names and values for its initial state and options.  It will also receive, unmodified, any extra arguments the constructor might have received.

The configuration options are usually the first argument provided to the constructor when creating an instance.  Even if no argument was provided when creating the instance, the `init` method will always receive at least an empty object.

If a `defaultConfig` property is set, it will be merged with configuration options so as to ensure the `init` method will always receive an object with a minimal set of values, even if the constructor was passed none.

```js
var Circle = Parcela.Parcel.subClass({
    init: function (config, extra) {
	    console.log(config.x, config.y, config.r, extra);
		console.log(this.x, this.y, this.r);
	},
	defaultConfig: {
	   x: 0,
	   y: 0,
	   r: 10
	}// ....
}

new Circle({x:1,y:2},'whatever');
/*
Would print:
1 2 10 whatever
1 2 10
*/
```
The constructor not only ensures `config` is an object and that it has a minimal set of properties but it also sets those configuration options as instance properties accessible through `this`. The constructor will not overwrite any existing members, be them properties or, specially, methods.   

The `init` method will still receive those configuration options and is free to do as it chooses.  Thus, if any of the options needs validation or resolving into some internal format, the `init` method can still do it.  Automatic setting can be prevented by simply having the property declared.  On the other hand, make sure **not** to declare properties that you might want to have set via the configuration options.  Set them in the `defaultConfig` instead.

### Destructor

Any external resources referenced or created in `init` should be destroyed in the `destroy` function.  Though JavaScript knows nothing about object destruction, Parcela calls the `destroy` method of a `Parcel` when replacing the root application, be it via the [`rootApp`](../virtual-dom/index.html#rootapp) method or when the [routing](../routing/index.html) module navigates away from a page.

The default implementation of `destroy` in `Parcel` loops through all the properties of the instance and if it finds any property holding a reference to an instance of `Parcela`, that is, a sub-parcel, or an array of them, it will call their `destroy` method.  Be careful to maintain the inheritance chain when overriding `destroy` or replacing its default funcionality. If any sub-parcel is stored in any other place, the developer must ensure its `destroy` method is called.

### Models

The `init` method is responsible to attach to the models. In an MVC pattern, state is kept in the model.  We prefer to split it in two, which we call:

* *data* for models external to the Parcel instance, though accessible to it, that might be shared with others and is usually preserved in permanent, external storage.
* *state* which is closely associated with this particular instance of the Parcel, it is usually initialized through the `config` argument of the constructor and it is kept in instance properties. 

The *state* is thus just a small fraction of the overall model of the application which is closely associated to the Parcel instance.  Conceptually, it is just a part of the **M** in MVC.

Parcels will keep the *state* stored internally while it will keep references to the *data*.  The `init` method has to obtain those references and keep an eye on them as well as maintain the internal *state*.

##View

The `view` method is responsible for producing the image of what is to be displayed.  It does so by returning an object or an array of objects describing the HTML to be displayed, expressed as `vNode`s

A `vNode` is an abstract representation of a DOM element.  As such it will have, amongst others, the following properties:

* `tag`: the `tagName` or `nodeName` of the DOM element.
* `attrs`: a hash map of attributes of this element.
* `children`: an array of child elements

This is a valid, if rather pointless, Parcel:

```js
var Hello = Parcela.Parcel.subClass({
    view: function () {
	    return {tag:'p', attrs:{class:'greeting'}, children:['Hello World!']};
	}
});
```

The children of a `vNode` can be plain values that will be displayed as strings, other `vNode`s or other Parcel instances.

### Parcel.vNode

Though the view may return such an object directly, it is more convenient to use helpers to assemble them.  The `Parcel` class already contains the `vNode` static method that makes it easier to assemble them.

```js
var v = Parcela.Parcel.vNode;
var Issues = Parcela.Parcel.subClass({
    view: function () {
	    return v('div#issues.help',[
		   v('a', {href:'https://github.com/Parcela/parcela.github.io/issues'}, 'Issues with docs'),
		   v('a[href=https://github.com/Parcela/parcel/issues]', 'Issues with Parcel')
		]);
	}
});
```
The `Parcel.vNode` helper makes it easier to create a view by accepting various forms for its arguments, only the first being mandatory.  They are:

* `tag`: which accepts a limited form of CSS selectors.  It will usually be composed of:
    * `tagName`: the name of the HTML element.  It defaults to a `<div>` but then it requires any of the following:
	* `id`: a valid id precededby a `#`.
	* `className`: one or more CSS classNames, each precededby a `.`.
	* `attributes`: each set enclosed in square brackets with the name of the attribute, an `=` sign and the value.  Only one attribute can be set per set of square brackets but any number of sets can follow.
* `attrs`: a hash map with further attributes. The values given in this hash map will supplement or override those given as part of the tag, except for:
    * `class`: the `class` attribute can be given as a string or as an array of strings.  These will be concatenated to those specified as part of the `tag`, if any.
	* `style`: the `style` attribute should be set to a hash map of style attribute names to values.  The names must be in DOM, not HTML format: `brackgroundColor`, not <strike>background-color</strike>.
* `children`: a children or an array of children.  They can be:
    * a value which will be rendered as an HTML textNode.
	* another `vNode`
	* a Parcel instance.
	
Both `attrs` and `children` are optional, `v('hr')` produces a valid `vNode`.

### Caching

`Parcel.vNode` caches the nodes by their `tag`. In order to improve performance it is best to provide the `id` and `class` attributes as part of the `tag` but only if they remain constant.  For variable parts, it is best to use the second argument.  Thus:

```js
v('h1#caching.main', 'Caching');

// Is faster than;
v('h1', attrs: {id:'caching', class:'main'},'Caching');

// But this is not:
v('p#p' + count++);
```

The last one, since in each occurrence would produce a different `tag` due to the ever-changing `id`, it would fill the cache with `vNode`s that would never be recalled again.  In that case, it is better to do 

```js
v('p', attrs:{id:'p' + count++})
```
	
Thus, the general rule should be, if it is constant, append it to the `tag`, if it is variable, set it in `attrs`.

### Parcel container

Each Parcel instance will be contained in a DOM element.  This helps in keeping all its constituents together and handle them as a unit.  By default such container is a `<div class="parcel"></div>`.  This can be changed by using the following properties:

* `containerType`: the `tagName` for the container.  Defaults to `'div'`.
* `className`: one or more CSS classNames to append to `parcel`.
* `attributes`: a hash of additional attributes for the container.

Thus, a Menu component might have:

```js
var Menu = Parcela.Parcel.subClass({
    containerType: 'ul',
	className:'menu',
	defaultConfig: {
		items: [
			{url: 'home', label:'Home'}
		]
	},
	view: function() {
		var v = Parcela.Parcel.vNode;
		return this.items.map(function(item) {
			return v('li', [v('a', {href: '#' + item.url}, item.label)]);
		});
	}
});

// Which can be called like this:
var menu = new Menu({
	items:[
		{url:'home', label: 'Home'},
		{url:'users', label: 'Users'},
		{url:'groups', label: 'Groups'}
	]
});
```

There is no need for an `init` method in this example as the configuration options will be read by the constructor, supplemented with the `defaultConfig` and stored in this instance automatically, which makes them available to the `view` as `this.items`.

The individual `<li>` elements will be enclosed within the `<ul class="parcel menu">` element which serves as a container for the whole Parcel, as set in the `containerType` and `className` properties. 

### preView and postView

A Parcel is not immediately shown on the screen when created nor destroyed when hidden.  If the developer wants to keep a tighter control over its resources, the Parcel provides the `preView` and `postView` methods.  The `preView` method will be called just before the `view` method the fist time the Parcel will be shown.  The `postView` will be called after the Parcel was taken off the screen.

They might be useful, for example, for starting and stopping a timer shown on screen, or an animation, that doesn't need to run while hidden.

## Nesting Parcels

A `vNode` can have other Parcels as children.  For example, we might have broken down the previous into an overall `Menu` Parcel and several `MenuItem` parcels:

```js
var MenuItem = Parcela.Parcel.subClass({
	containerType: 'li',
	view: function () {
		return Parcela.Parcel.vNode('a', {href: '#' + this.item.url}, this.item.label);
	}
});
	
var Menu = Parcela.Parcel.subClass({
    containerType: 'ul',
	className:'menu',
	defaultConfig: {
		items: [
			{url: 'home', label:'Home'}
		]
	},
	init: function (config) {
		this.menuItems = this.items.map(function (item) {
			return new MenuItem({item: item});
		});
	},
	view: function() {
		return this.menuItems;
	}
});

```

Each `MenuItem` uses an `li` as its container and its `view` produces the `a` element based on the `item` property which it expects to have set.   This is done in `Menu`.  In this case, we have opted to create the `MenuItem` instances in the `init` method.   The `init` method is run just once in the lifetime of the Parcel while the `view` is run on every refresh so, unless the content is dynamic and might need to be changed on every refresh, it is best to do any heavy-lifting in the `init` method as shown above.

We loop through the `items` property creating an array of `MenuItem` instances each of which receive a single item from the `items` array.  Once the `this.menuItems` array is initialized in the `init` method, the `view` just needs to return it when required.

Parcels can be nested into one another any number of levels.  A full Parcela application is made of a Parcel containing other Parcels containing further Parcels.  Some of those Parcels might simply provide a layout for the Parcels within using, for example, [Bootstrap](http://getbootstrap.com/css/#grid) or [PureCSS](http://purecss.io/grids/) grids.

## The stamp method

If a parcel knows its state has not changed, it can decline to be refreshed. Depending on the complexity of the parcel, this can improve performance, however, the refresh process is fast enough so that this is not a top priority task.

Parcela's virtual DOM contains a `pNode` for each `Parcel` instance.  One of the properties of the `pNode` is `stamp`.   In a refresh cycle, before calling the `view` method, the renderer calls the `stamp` method.  It then compares the value returned by the `stamp` method with the `stamp` property stored in the `pNode` in the previous refresh cycle.  If they match, the renderer will assume the Parcel has not changed and will skip over its content, the `view` method will not be called and its screen parcel not refreshed.   If the stamps don't match then the Parcel will be refreshed.  In any case, the parcels contained within the skipped parcel will still be checked.

Initially, `pNode.stamp` is set to `NaN` and the default `stamp` method also returns `NaN`.  Since `NaN` is never equal to anything, including itself, Parcels are refreshed by default.   However, by overriding the `stamp` method and returning a value that reflects the state of the Parcel and its models, the Parcel can control when it needs to be refreshed.

Strategies for the `stamp` function include:

* For parcels that never change, for example, parcels that simply provide a layout for other parcels contained within, the `stamp` method can always return the same value, any value (except `NaN`) would do, however, to make the intent clearer, `return false` is suggested.
* The `stamp` method should visit every item, be it a state variable or data, that the parcel depends on and produce something that reflects its state. Obviously it should be cheaper than actually producing a render, otherwise, it is not worth the trouble. An example might be do a `JSON.stringify()` of an object that reflects the variables that affect the parcel. Note that the `pNode` will keep in `pNode.stamp` a copy of the previous state of such object so this option might not be wise.
* Keep a `_stamp` property in the parcel. Every property setter in the parcel should increment it every time they change something. Make the `stamp` method return this property.
* Keep a `_lastTimeStamp` property and set it with a new timestamp from the `Date` object on every change. This is not particularly better than the previous.
* Likewise, keep an additional `_stamp` property on every model and modelList and update it every time something, anything, is changed. If a model belongs to a modelList, propagate the change in the model to the modelList (don't copy the value of `_stamp` from the model to the modelList, increment the `_stamp` property of the modelList independently of the increment of the model). Make the `stamp` method add up the value of the `_stamp` properties of everything that affects the view. Since the counters are always incremented, there is no possibility that one change would compensate another, they always increase.
