---
module: parcel
maintainer: Daniel Barreiro
title: Nested parcels
intro: "Building a table out of nested Parcels"
includeexample: true
---
#The Basics#

We will build a table made of several Parcels nested within one another.  First we will make a Parcel for the table itself:

```js
var Table = Parcela.Parcel.subClass({
	containerType: 'table',
	className: 'pure-table',
	init: function (config) {
		this.header = new HeaderRow(config);
		this.body = new BodySection(config);
	},
	view: function () {
		return [
			this.header,
			this.body
		];
	}
});
```

We declare the `Table` parcel to use a `table` element as its container and, since we are using [Pure CSS](http://purecss.io/tables/) we set the required `className`.  Our table will be made of two sub-views, one for the header and one for the body.  They are both instanced in the `init` method passing them the same configuration options the table would receive on instantiation.

Those same two instances are then returned as an array in the `view`.  A `view` can return either a simple value, which will create a node of type text, a `vNode` or an instance of a Parcel, or an array of those elements in any combination.  Here, it returns an array made of those two parcel instances.  We can easily add a caption:

```js
view: function () {
	return [
		this.caption && v('caption', this.caption),
		this.header,
		this.body
	];
}
```

We check whether a `caption` configuration option was set and if so, add to the returned array a `vNode` made of a `caption` element containing the text of the caption.  If not `caption` was configured, the array would contain an `undefined` item, which will be ignored.

The table can be shown like this:

```js
Parcela.rootApp(Table, {
	rows:4,
	cols:5,
	caption:'this is the caption'
});
```

We set `Table` as the root parcel for our application.  The `rootApp` method will create an instance of `Table` using the object in the second argument as its configuration options.  In a more realistic scenario, these configuration options would include more information such as an array with labels for the columns and a reference to the data to display.  In this case, we will simply fill up the table with row and column indexes.

As it is, the table would crash if we failed to provide the number of rows and columns.  We can avoid that risk by adding a `defaultConfig` property to ensure that even if no configuration options are passed to the constructor on instantiation, the Parcel will render something usable:

```js
defaultConfig: {
	rows:2,
	cols:2
},
```

## The sub-views

The `Table` parcel relies on two other parcels to create its header and body sections, shown here:

```js
var HeaderRow = Parcela.Parcel.subClass({
	containerType: 'thead',
	init: function (config) {
		var ths = [];
		for (var c = 0; c < this.cols; c++){
			ths.push(v('th', 'H' + c));
		}
		this.ths = ths;
	},
	view: function () {
		return v('tr', this.ths);
	}
});

var BodySection = Parcela.Parcel.subClass({
	containerType: 'tbody',
	init: function (config) {
		this.dataRows = [];
		for (var r = 0; r < this.rows; r++) {
			this.dataRows[r] = new DataRow(Object.merge(config,{row:r}));
		}
	},
	view: function () {
		return this.dataRows;
	}
});
```

They are both simple Parcel sub-classes having their `containerType` set to `thead` and `tbody` elements.  The `HeaderRow` view returns a `vNode` made of a `tr` element with an array of `th` `vNode`s asembled in the `init` method based on the number of columns. For the body section, the rows are `DataRow` Parcels assembled in the `init` method as well.

The choice of assembling the header cells or the data rows in the `init` or in the `view` method depends on the application. The `init` method is called only once when the Parcel is created, the `view` method is called every time the full screen or this Parcel is refreshed.  Thus, depending on how dynamic the configuration of the table is, the developer can choose where to assemble the elements.  In this case, the table is mostly static so we do it in the `init` method so everything is ready made for rendering and later refreshes.

Finally, the `DataRow`:

```js
	var DataRow = Parcela.Parcel.subClass({
		containerType: 'tr',
		view: function () {
			var tds = [];
			for (var c = 0;c < this.cols; c++){
				tds.push(v('td','r'+ this.row + '-c' + c));
			}
			return tds;
		}
	});
```

In this case, to show the alternative, the data cells are assembled in the `view` method.  It is not as efficient as having them pre-assembled in the `init` method but, if the data came from an external source and was likely to change, the data cells would be immediately refreshed.

## Destructors

This example lacks any explict destructors, however, the `Parcel` class has a default destructor which is the one taking care of cleaning up.   

The default implementation of the `destroy` method checks all the properties of each Parcel instance and, if they hold references to other Parcel instances (their sub-parcels), it will call their `destroy` method. Thus, in `Table` when it finds the `header` and `body` properties as being instances of Parcel, it will call their `destroy` method.   The default `destroy` implementation also checks any array to see if it contains instances of Parcels.  Thus, in `BodySection`, when it finds the `dataRows` array containing Parcel instances, it will call their `destroy` method as well.

The whole cleaning up process starts with `rootApp`.  In a single-page-application, `rootApp` can be called more than once to switch in between the different views.  When `rootApp` is called, it checks if it has an earlier root Parcel and, if so, it will call its `destroy` method before replacing it by the new root Parcel.  

The default `destroy` method chains to the `destroy` methods of its child parcels.  If the developer has set any other resources that need cleaning up, the `destroy` method is the place to do it.  However, to ensure not to break the chain of destruction, the developer must ensure to call the original, default `destroy`.

```js
var MyParcel = Parcela.Parcel.subClass({
    init: // ...
	view: // ...
	destroy: function () {
	     MyParcel.$super.destroy.call(this);
		 // do my own cleaning up
	}
});
```

## Complete Code

The full code for this example:

```js
var Parcela = require('parcela');
Parcela.ready().then(
	function() {
		var v = Parcela.Parcel.vNode;


		var DataRow = Parcela.Parcel.subClass({
			containerType: 'tr',
			view: function () {
				var tds = [];
				for (var c = 0;c < this.cols; c++){
					tds.push(v('td','r'+ this.row + '-c' + c));
				}
				return tds;
			}
		});

		var HeaderRow = Parcela.Parcel.subClass({
			containerType: 'thead',
			init: function (config) {
				var ths = [];
				for (var c = 0; c < this.cols; c++){
					ths.push(v('th', 'H' + c));
				}
				this.ths = ths;
			},
			view: function () {
				return v('tr', this.ths);
			}
		});

		var BodySection = Parcela.Parcel.subClass({
			containerType: 'tbody',
			init: function (config) {
				this.dataRows = [];
				for (var r = 0; r < this.rows; r++) {
					this.dataRows[r] = new DataRow(Object.merge(config,{row:r}));
				}
			},
			view: function () {
				return this.dataRows;
			}
		});

		var Table = Parcela.Parcel.subClass({
			containerType:'table',
			className:'pure-table',
			defaultConfig: {
				rows:2,
				cols:2
			},
			init: function (config) {
				this.header = new HeaderRow(config);
				this.body = new BodySection(config);
			},
			view: function () {
				return [
					this.caption && v('caption', this.caption),
					this.header,
					this.body
				];
			}
		});

		Parcela.rootApp(Table, {
			rows:4,
			cols:5,
			caption:'this is the caption'
		});
	}
);
```


