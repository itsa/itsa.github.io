---
module: parcel
maintainer: Daniel Barreiro
title: Simple menu
intro: "Building a simple menu"
includeexample: true
---
#The Basics#

We will build a simple menu using the [Pure CSS](http://purecss.io/menus/) horizontal menu.

```js
var Menu = Parcela.Parcel.subClass({
	className:'pure-menu pure-menu-open pure-menu-horizontal',
	defaultConfig: {
		items: [
			{url: 'home', label:'Home'}
		]
	},
	view: function() {
		var v = Parcela.Parcel.vNode;
		return v('ul', this.items.map(function(item) {
			return v('li', [v('a', {href: '#' + item.url}, item.label)]);
		}));
	}
});
```

We create a `Menu` inheriting from the `Parcel` class.  The PureCSS menu requires an external `div` element with a series of classNames in it.  The default container for a Parcel is a `div` so we don't need to explicitly set that, but we do have to set those class names in the `className` property.

In order not to be left with an empty menu we set a minimal default menu by setting the default `items` configuration option in the `defaultConfig` property.  Thus, even if no configuration options are specified when creating the menu instance, there will be at least something to show.

There is no need for us to set an `init` function since the configuration options will be automatically read and merged as properties into the instance by the constructor.

In the `view` we return a `ul` element that has an array of `li` elements which are dynamically build using the `map` method of `Array` instances.  We are sure we will have a `this.items` array available because, even if the developer had forgottern to set it when creating this instance, a default array with a single item would have been provided via `defaultConfig`.

To create a menu we execute the following:

```js
Parcela.rootApp(Menu, {
	items:[
		{url:'home', label: 'Home'},
		{url:'users', label: 'Users'},
		{url:'groups', label: 'Groups'}
	]
});
```

We set the `Menu` class as the root parcel for our application via the `rootApp` method.  We are skipping on the second, optional argument of `Parcela.rootApp` which says where to render the application.  In this case, the application would be rendered into `document.body`.   The final argument is an object containing the configuration options for the `Menu` parcel, providing the menu items to be shown.

### Complete Code

The full code for this example:

```js
var Parcela = require('parcela');
Parcela.ready().then(
	function() {
		var Menu = Parcela.Parcel.subClass({
			className:'pure-menu pure-menu-open pure-menu-horizontal',
			defaultConfig: {
				items: [
					{url: 'home', label:'Home'}
				]
			},
			view: function() {
				var v = Parcela.Parcel.vNode;
				return v('ul',this.items.map(function(item) {
					return v('li', [v('a', {href: '#' + item.url}, item.label)]);
				}));
			}
		});

		Parcela.rootApp(Menu, {
			items:[
				{url:'home', label: 'Home'},
				{url:'users', label: 'Users'},
				{url:'groups', label: 'Groups'}
			]
		});
	}
);
```
