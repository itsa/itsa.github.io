---
module: parcel
maintainer: Daniel Barreiro
title: Active menu
intro: "Putting a little life into a menu"
includeexample: true
---
#The Basics#

In a [previous example](menu.html) we have seen how to build a simple menu.
That menu, however, was completely static, it didn't change except for the `hover` style.

The [Pure CSS](http://purecss.io/menus/) menu has the `pure-menu-selected` class name that,
when applied to one of the `<li>` items that make up the menu, will highlight it to signal
it is the current menu.

```js
var Menu = Parcela.Parcel.subClass({
	className: 'pure-menu pure-menu-open pure-menu-horizontal',
	defaultConfig: {
		items: [
			{url: 'home', label: 'Home'}
		]
	},
	init: function (config) {
		this.disabled = config.disabled || [];
	},
	view: function () {
		var self = this,
			v = Parcela.Parcel.vNode;
		return v('ul', this.items.map(function (item) {
			return v(
				'li', {
					class: (this.disabled.indexOf(item.url) >= 0 ?
						'pure-menu-disabled' :
						(item.url === this.selected ?
							'pure-menu-selected' :
							''
						)
					),
					onclick: function (ev) {
						self.selected = ev.target.hash.substr(1);
						Parcela.render();
						return false;
					}
				}, [v('a', {href: '#' + item.url}, item.label)]);
		}, this));
	}
});

```

Our `Menu` class is now slightly larger.  We have added an `init` method. The `init` function is called automatically by the constructor. The reason for this is that if we initialized `disabled` in the `defaultConfig`, and we had several menus in the same page at once, all the menus would point to the same, shared array and all would get the same items disabled.  This may be a desired behavior but, most likely, it wouldn't.

The other addition is the `view`.  Now, the `<li>` element gets a couple of attributes.  One is the `class` attribute which sets it to the values `pure-menu-disabled` or `pure-menu-selected` depending on whether the URL for the menu item is in the `disabled` array or is the `selected` item.

The other attribute is an event listener for the `click` event on the link.  This is not a good way to do it and usage of Parcela's own event system is a much better alternative but, for the purpose of this example, this is good enough.  Basically, it takes the URL from the clicked anchor and stores it in the `selected` property.  Then it calls `Parcela.render` method so the whole page is rendered again.  This is something Parcela's own event system would do automatically for you.

One notable thing that someone might miss is that we are not unsetting the `pure-menu-selected` class name from the previously selected item.  Usually, there would have been some `previousSelectedItem` property somewhere in that class.   This is not necessary with Parcela because you render the whole virtual DOM for the view from scratch.  However, this is not expensive.  Due to Parcela's virtualDOM manager, the actual DOM only receives two commands, one to take out the `pure-menu-selected` class name from one DOM node, the other to add it to the new selected item.


### Complete Code

The full code for this example:

```
var Parcela = require('parcela');
Parcela.ready().then(
	function () {
		var Menu = Parcela.Parcel.subClass({
			className: 'pure-menu pure-menu-open pure-menu-horizontal',
			defaultConfig: {
				items: [
					{url: 'home', label: 'Home'}
				]
			},
			init: function (config) {
				this.disabled = config.disabled || [];
			},
			view: function () {
				var self = this,
					v = Parcela.Parcel.vNode;
				return v('ul', this.items.map(function (item) {
					return v(
						'li', {
							class: (this.disabled.indexOf(item.url) >= 0 ?
								'pure-menu-disabled' :
								(item.url === this.selected ?
									'pure-menu-selected' :
									''
								)
							),
							onclick: function (ev) {
								self.selected = ev.target.hash.substr(1);
								Parcela.render();
								return false;
							}
						}, [v('a', {href: '#' + item.url}, item.label)]);
				}, this));
			}
		});

		Parcela.rootApp(Menu({
			items: [
				{url: 'home', label: 'Home'},
				{url: 'users', label: 'Users'},
				{url: 'groups',	label: 'Groups'}
			],
			selected: 'users'
		});
	}
);
```
