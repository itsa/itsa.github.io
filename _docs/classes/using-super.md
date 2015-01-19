---
module: js-ext
functionality: Classes
maintainer: Marco Asbreuk
title: Using $super and $superProp
intro: "This example shows how to inherit Classes. Every master-class should be defined using </b>ITSA.Classes.createClass()</b>. From that point out, Classes can be inherited by using <b>subClass</b> of the parent-Class."
---

<style type="text/css">
    #btn {
        display: block;
        min-width: 12em;
    }
    #cont {
        border: solid 1px #000;
        padding: 1em;
        min-width: 10em;
        min-height: 3em;
        display: block;
        margin-top: 1em;
    }
</style>

Click on the buttons to make the users speak or be silent.

<button id="btn" class="pure-button pure-button-bordered">Print Info</button>

<div id="cont"></div>


<p class="spaced">Code-example:</p>

```html
<body>
    <button id="btn">Print Info</button>
    <div id="cont"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        container = document.getElement('#cont'),
        A, B, C, D, d;

    A = ITSA.Classes.createClass(
        function(x) {
            this.x = x;
            this.rendered = true;
        },
        {
            getInfo: function() {
                return 'I am Class A, x='+this.x+', y='+this.y+', rendered='+this.rendered;
            }
        }
    );

    B = A.subClass(
        function(x, y) {
            // the constructor automaticly invoke its superclass with all arguments.
            // however, we are going to overrule and invoke it without arguments
            // which will lead into NO x-value set
            this.$superProp('constructor');
            this.y = y;
        },
        {
            getInfo: function() {
                return 'I am Class B';
            }
        },
        false
    );

    C = B.subClass({
            getInfo: function() {
                return this.$super.$superProp('getInfo');
            }
        }
    );

    D = C.subClass();

    d = new D(10, 20);

    ITSA.Event.after('click', function(e) {
        container.setHTML(d.getInfo());
    }, '#btn');

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        container = document.getElement('#cont'),
        A, B, C, D, d;

    A = ITSA.Classes.createClass(
        function(x) {
            this.x = x;
            this.rendered = true;
        },
        {
            getInfo: function() {
                return 'I am Class A, x='+this.x+', y='+this.y+', rendered='+this.rendered;
            }
        }
    );

    B = A.subClass(
        function(x, y) {
            // the constructor automaticly invoke its superclass with all arguments.
            // however, we are going to overrule and invoke it without arguments
            // which will lead into NO x-value set
            this.$superProp('constructor');
            this.y = y;
        },
        {
            getInfo: function() {
                return 'I am Class B';
            }
        },
        false
    );

    C = B.subClass({
            getInfo: function() {
                return this.$super.$superProp('getInfo');
            }
        }
    );

    D = C.subClass();

    d = new D(10, 20);

    ITSA.Event.after('click', function(e) {
        container.setHTML(d.getInfo());
    }, '#btn');

</script>