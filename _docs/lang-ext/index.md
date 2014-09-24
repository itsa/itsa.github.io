---
module: lang-ext
maintainer: Daniel Barreiro
title: Extra functionality for basic objects
intro: "Adds several methods to both Object and Function that are frequently used"
---
#The Basics#

The `forEach` method added functional programing style looping through arrays, as did several other methods such as  `map`, or `some`.  That functionality is sorely lacking in `Object` which has the added complication of having to check via `hasOwnProperty` to see if the named member belongs to the object or has been inherited.

This module adds some easy to use methods to Object and a few to Function that allow for a kind of classical inheritance without ES6.

All this functionality is present in several libraries as functions that operate on the affected objects.  We think it makes no longer sense to do it this way.  The new methods are being added as non-enumerable methods so that they should not show when looping through an object.  Besides, when looping through an object, you should always have had to check for `hasOwnProperties` which would not list these.

## Object extensions

Object has the following new methods.  They all check for `hasOwnProperty` or equivalent functionality.

### each

Like Array's `forEach` it loops through an object and calls the given function, optionally in the given context, passing it the value of the property, the name of the property and a copy of the whole object, a similar order of arguments to `forEach`.  

```js
{a:1, b:2}.each(function(value, key) {
    console.log(key + ': ' value);
});
// Prints
// a: 1
// b: 2
```

### some

Like Array's `some` will loop through an object until the called function returns true.  The function will return true if any of the calls returned true (the condition was met) or false if no function returned true.

```js
console.log({a:1, b:2}.some(function(value, key) {
    return value === 2;
}));
// Prints true
```

### map

Like the similarly named method of Array, it will loop through an object returning a new object with the same keys but the values as returned by the function.  The function cannot change the keys themselves, the function receives them just for reference.  If the function returns `undefined` that property will not be included in the resulting object.

```js
console.log({a:1, b:2}.each(function(value, key) {
    return value * 2;
});
// Prints
// {a: 2, b: 4}
```

### keys

Returns an array with the names of the properties in the object. 

```js
console.log({a: 1, b: 2}.keys());
// prints ['a', 'b']
// Same as:
console.log(Object.keys({a: 1, b: 2}));
```

### values

Returns an array with the values of the properties.

```js
console.log({a: 1, b: 2}.values());
// prints [1, 2]
```

### isEmpty

Returns true if the object has no properties of its own.

```js
console.log({}.isEmpty());     // true
console.log({a:1}.isEmpty());  // false
```

### shallowClone

Returns a shallow clone of the object.  Properties that are themselves references will not be traversed, thus, the cloned object would have a reference to the same object as the original.  It is handy and fast for objects that are known not to be deep.

If an object has a few properties known to contain shallow objects, it is easy to do a fast slightly deeper clone like this:

```js
var obj = {a: 1, b: 2, deep: {c:3, d:4}};
var newObj = obj.shallowClone();
newObj.deep = obj.deep.shallowClone();
```

### merge

Merges into the object a set of properties taken from another object.  Properties with the same name will be preserved unless the second argument is passed as true.  The original object is changed.  The method is chainable.

```js
var a = {a: 1, b: 2};
a.merge({b:99, c: 3}).merge({a:44, d:4}, true);
console.log(a);
// Prints:
// {a: 44, b:2, c: 3, d: 4}
```

### Object.merge

Returns a new object resulting of merging the properties of the objects passed as its arguments.   If several objects have properties with the same name, the first one will prevail.  

A useful example is filling up a configuration object with default values.

```js
var init = function (config) {
    config = Object.merge(config, defaultConfig);
}
```

The `config` argument can be missing but after calling `Object.merge` it will always be an object. In either case the returned object will have the properties in `defaultConfig` filling in the missing properties in `config`.

### createClass

Returns an instantiatable object, technically, it returns a sub-class of Function with the given constructor and prototype members.   Since it actually returns an instance of Function it might better be part of `Function` but it seemed more natural to find if here.   For further detaits see the following section.

## Function extensions

The extensions for Function real with classes.

To create a class in JavaScript you would do:

```js
var Shape = function (x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

Shape.prototype.move = function (x, y) {
	this.x += x;
	this.y += y;
};
```

With this extension you can do it like this:

```js
var Shape = Object.createClass(function (x, y) {
	this.x = x || 0;
	this.y = y || 0;
},{
	move: function (x, y) {
		this.x += x;
		this.y += y;
	}
});
```

The first argument will become the constructor of the new class and the second argument is a hash map of its prototypes.

### subClass

Returns a subclass of the given class with its own constructor and extra members:

```js
var Circle = Shape.subClass(
	function (x, y, r) {
		this.r = r || 1;
		Circle.$super.constructor.call(this, x, y);
	},{
		area: function () {
			return this.r * this.r * Math.PI;
		}
	}
);
```

The new `Circle` class is a subclass of `Shape`, its instances are instances of both `Circle` and `Shape`.   The sub-class has access to the original class members via the static `$super` object which has properties for each of the original class methods and its constructor so they can be chained.  The `Circle` class will have the `move` method inherited from `Shape`.

### mergePrototypes

It allows to add extra methods to a given class.  This is helpful when common functionality needs to be added to multiple classes, without having to inherit from it.  For example, the previous example could have been made like this:

```js
var movable = {
	move: function (x, y) {
		this.x += x;
		this.y += y;
	},
	moveX: function (x) {
		this.x += x;
	},
	moveY: function (y) {
		this.y += y;
	}
};

var Circle = Object.createClass(
	function (x, y, r) {
		this.r = r || 1;
		Circle.$super.constructor.call(this, x, y);
	},{
		area: function () {
			return this.r * this.r * Math.PI;
		}
	}
).mergePrototypes(movable);
```

The merged methods will not overwrite existing methods unless the second argument is set to `true` to force the overwrite.

If the merged methods override existing ones, the original method will be avaiable in the `$orig` static property.  This allows plugins that can be refer to the original methods.

```js
var ClassA = Object.createClass({
	method: function (a) {
		return a + 'a';
	}
}).mergePrototypes({
	method: function (b) {
		return ClassA.$orig.method.call(this, b) + 'b';
	}
}, true);

var a = new ClassA();
console.log(a.method('1'));
// prints "1ab"
```
