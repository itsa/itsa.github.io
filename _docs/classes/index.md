---
module: js-ext
functionality: Classes
itsaclassname:
version: 0.0.1
modulesize: 1.69
dependencies: "polyfill"
maintainer: Marco Asbreuk
title: Classes
intro: "Using Classes in a very flexible and easy way."
firstpar: get-started
---



#The Basics#

####Native way to create Classes####
To create a class in JavaScript, the would use code like this:

```js
var Shape = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

Shape.prototype.move = function (x, y) {
    this.x += x;
    this.y += y;
};

var shape = new Shape(10, 20);
```

This module replaces this native way in easier and more flexible Classes:


#Create new Classes#

ITSA creates new Classes by `ITSA.Classes.createClass()`. This returns an instantiatable Class. Technically, it returns a sub-class of Function with the given constructor and prototype members.


##createClass##

####Example defining new Class####

```js
var Shape = ITSA.Classes.createClass(function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
},{
    move: function (x, y) {
        this.x += x;
        this.y += y;
    }
});
```

###initiate new instance###

Any `Class` can be iniatiated with `new Classname`. It is <u>very important</u> to use the `new` keyword, otherwise very unexpected things may happen:

####Example defining new Class####

```js
var myShape = new Shape(5, 10);
myShape.move(20, 30);
```

Multiple instances are completely independent from each other:
####Example defining new instances####

```js
var shape1 = new Shape(5, 10),
    shape2 = new Shape(50, 70);

shape1.move(20, 30);
// shape1 --> (20,30)
// shape2 --> (50,70)
```


##subClass##

Any `Class` can be subclassed with 'subClass()`. The subclass has its own constructor and optional extra members. By default, the constructor of the inherited Class gets invoked with the same arguments as what this constructor recieves:


####Example defining subClass####
```js
var Circle = Shape.subClass(
    function (x, y, r) {
        // under the hood, Shape's constructor gets invoked with the arguments: (x, y, r)
        // before continuing the following code:
        this.r = r || 1;
    },{
        area: function () {
            return this.r * this.r * Math.PI;
        }
    }
);
```

####Example defining new instances####

```js
var circle1 = new Circle(5, 10, 1),
    circle2 = new Circle(50, 70, 2);

circle1.area(); // <-- 3,14
circle2.area(); // <-- 12,57
```

If you don't want the inherited Class's constructor to be invoked, you can set the 3th argument <b>false</b>. In most cases, you probably want to invoke the inherited constructor manually by using `this.$superProp('constructor', arg1, arg2, ...)`.


#Access to super-Class properties#

####Example redefine constructor####
```js
var Circle = Shape.subClass(
    function (radius, x, y) {
        // we will manually invoke the super-constructor
        this.$superProp('constructor', x, y);
        this.radius = radius || 1;
    }, null, true
);
```

###access parent properties###

When subClassing, it is easy to access properties of its parent by invoke `this.$superProp(propertyName, args)`. Any property can be invoked: when it's a method, you can pass through its arguments as from the second argument-position. <u>`$superProp` is avialabe on the context `"this"`</u>.

When a `constructor` needs to be subClassed, you can use: `this.$superProp('constructor', args)`. Be sure you set the firth argument `false` in order to be able to manually invoke the super-constructor.

####Example redefine constructor####
```js
var Circle = Shape.subClass(
    function (radius, x, y) {
        // we will manually invoke the super-constructor
        this.$superProp('constructor', x, y);
        this.radius = radius || 1;
    }, null, true
);
```

##access ancestor properties##

If you want to access properties that lie higher in the Class-tree (higer than `parent`), you can use `this.$super.$superProp()` or multiple `$super` parts.  <u>`$super` is avialabe on the context `"this"`</u>.

####Example redefine properties higher up the chain####
```js
var Rectangle = Shape.subClass(
    function (x, y, l, h) {
        this.l = l || 0;
        this.h = h || 0;
    }
);
var Square = Rectangle.subClass(
    function (x, y, l) {
        this;$super.$superProp('constructor', x, y);
        this.l = l || 0;
    }, null, true
);
```


#Reconfigure Classes#

Existing Classes cannot have their inherited (parent) Class being redefined (just define a new Class in those cases). However, they can have their constructor redefined, or prototype-properties being redefined, extended, or removed.


##setConstructor##

Re-defines the constructor of an existing Class. From the point this change is made, any new instance will use this constructor. This also counts for sub-classes. `setConstructor` accepts the new constructor as its first argument, and optional a second boolean argument to specify if the constructor should be chained (invoking its parent constructor automaticly).

####Example setConstructor####

```js
var ClassA, ClassB, ClassC, c;

ClassA = Classes.createClass(function(x) {
    this.x = x;
});
ClassB = ClassA.subClass(function(x, y) {
    this.y = y;
}, false);
ClassC = ClassB.subClass(function(x, y, z) {
    this.z = z;
});

c = new B(1,2,3);
// c.x === undefined
// c.y === 2
// c.z === 3

B.setConstructor(function(x, y) {
    this.y = 3*y;
});

c = new B(1,2,3);
// c.x === 1
// c.y === 6
// c.z === 3
```

##mergePrototypes##

It allows to add extra methods to a given class.  This is helpful when common functionality needs to be added to multiple classes, without having to inherit from it.  For example, the previous example could have been made like this:

####Example mergePrototypes####

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

var Circle = ITSA.Classes.createClass(
    function (x, y, r) {
        this.r = r || 1;
    },{
        area: function () {
            return this.r * this.r * Math.PI;
        }
    }
).mergePrototypes(movable);
```

The merged methods will not overwrite existing methods unless the second argument is set to `true` to force the overwrite.

##Using $orig in mergePrototypes##

If the merged methods override existing ones, the original method will be available in the `$orig` property, <u>which is avialabe on the context `"this"`</u>.  This allows plugins that can be refer to the original methods. All arguments you pass into `$orig()` will be passed through to its original method.

It is possible to redefine the same method in descendent subClasses by using $orig() over and over again. All original methods will be available.

####Example mergePrototypes with usage $orig()####
```js
var ClassA = ITSA.Classes.createClass({
    method: function (a) {
        return a + 'a';
    }
}).mergePrototypes({
    method: function (b) {
        return this.$orig(b) + 'b';
    }
}, true);

var a = new ClassA();
console.log(a.method('1'));
// prints "1ab"
```

##RemovePrototypes##

####Example removePrototypes####

```js
var Circle = ITSA.Classes.createClass(
    function (x, y, r) {
        this.r = r || 1;
    },{
        area: function () {
            return this.r * this.r * Math.PI;
        }
    }
);

var c = new Circle(5);
C.removePrototypes('area');

c.area(); // <-- will throw an error: method `area` does not exist
```


#Events#

##Event-listener##

When the `event-module` is loaded, all Classes become an Event-listener (for more info on event-listeners: see the module `Event`). This behaviour is added to the Base-Class which all Classes inherit. The Event-listener makes the following properties available:

###after###
###onceAfter###
###before###
###onceBefore###
###selfAfter###
###selfOnceAfter###
###selfBefore###
###selfOnceBefore###

The methods named `selfxxx` make it posible to invoke the subscriber only when `e.target` equals the `instance`. This avoids unwanted interaction: see the examples.

##Event-emitter##

To make any Class an Event-emitter, you should merge `Event.Emitter()` at the prototype by yourself. This cannot be done by the module, because Event-emitters need an emittername, which is Class-specific.

####Example setting up Class Event-Emitter####

```js
var Circle = ITSA.Classes.createClass(
    function (x, y, r) {
        this.r = r || 1;
    },{
        area: function () {
            return this.r * this.r * Math.PI;
        }
    }
).mergePrototypes(Event.Emitter('circle'));

var c = new Circle(5);
c.emit('drawn'); // <-- will fire the 'circle:drawn'-event
```
