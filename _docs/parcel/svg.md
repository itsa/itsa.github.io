---
module: parcel
maintainer: Daniel Barreiro
title: SVG example
intro: "Drawing a circle in SVG"
includeexample: true
---
#The Basics#

Parcela is aware of namespaced elements such as `<svg>` or `<math>` elements or the `xmlns` element attribute.  It will use the proper namespaced function (`createElementNS` instead of `createElement`) when it is within a namespaced element.

```js
var v = Parcela.Parcel.vNode,
	SVG = Parcela.Parcel.subClass({
		view: function () {
			return v(
				'svg',
				{
					width:'200px',
					height:'150px'
				},
				v(
					'circle',
					{
						cx:"100",
						cy:"75",
						r:"50",
						fill:"#ff0000"
					}
				)
			);
		}
	});

Parcela.rootApp(SVG);

```

We create a `SVG` parcel inheriting from the `Parcel` class.  We can freely use the `'svg'` tagName.  The renderer will recognize it as one needing special handling through namespaced DOM methods and will handle it properly as well as its child elements, such as the circle.

### Complete Code

The full code for this example (the circle on the left hand side was generated via plain HTML):

```
var Parcela = require('parcela');
Parcela.ready().then(
	function () {
		var v = Parcela.Parcel.vNode,
			SVG = Parcela.Parcel.subClass({
				view: function () {
					return [
						v('h1','Generated via Parcel'),
						v(
							'svg',
							{
								width:'200px',
								height:'150px'
							},
							v(
								'circle',
								{
									cx:"100",
									cy:"75",
									r:"50",
									fill:"#ff0000"
								}
							)
						)
					];
				}
			});

		Parcela.rootApp(SVG);
	}
);
```
