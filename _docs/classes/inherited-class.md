---
module: js-ext
functionality: Classes
maintainer: Marco Asbreuk
title: Inherit classes
intro: "This example shows how to inherit Classes. Every master-class should be defined using </b>ITSA.Classes.createClass()</b>. From that point out, Classes can be inherited by using <b>subClass</b> of the parent-Class."
---

<style type="text/css">
    #btnMaster, #btnSub, #btnSubSub {
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

<button id="btnMaster" class="pure-button pure-button-bordered">Print Master values</button>
<button id="btnSub" class="pure-button pure-button-bordered">Print Sub values</button>
<button id="btnSubSub" class="pure-button pure-button-bordered">Print SubSub values</button>

<div id="cont"></div>


<p class="spaced">Code-example:</p>

```html
<body>
    <button id="btnMaster">Print Master values</button>
    <button id="btnSub">Print Sub values</button>
    <button id="btnSubSub">Print SubSub values</button>
    <div id="cont"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        container = document.getElement('#cont'),
        MasterClass, SubClass, SubSubClass, master, sub, subsub;

    MasterClass = ITSA.Classes.createClass(
        function(x) {
            this.x = x;
        },
        {
            printValues: function() {
                container.setHTML('values of MasterClass-instance --> x: '+this.x);
            }
        }
    );

    SubClass = MasterClass.subClass(
        function(x, y) {
            // the constructor automaticly invoke its superclass!
            this.y = y;
        },
        {
            printValues: function() {
                container.setHTML('values of SubClass-instance --> x: '+this.x+', y: '+this.y);
            }
        }
    );

    SubSubClass = SubClass.subClass(
        function(x, y, z) {
            // the constructor automaticly invoke its superclass!
            this.z = z;
        },
        {
            printValues: function() {
                container.setHTML('values of SubSubClass-instance --> x: '+this.x+', y: '+this.y+', z: '+this.z);
            }
        }
    );

    master = new MasterClass(1);
    sub = new SubClass(10, 20);
    subsub = new SubSubClass(100, 200, 300);

    ITSA.Event.after('tap', function(e) {
        master.printValues();
    }, '#btnMaster');

    ITSA.Event.after('tap', function(e) {
        sub.printValues();
    }, '#btnSub');

    ITSA.Event.after('tap', function(e) {
        subsub.printValues();
    }, '#btnSubSub');

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        container = document.getElement('#cont'),
        MasterClass, SubClass, SubSubClass, master, sub, subsub;

    MasterClass = ITSA.Classes.createClass(
        function(x) {
            this.x = x;
        },
        {
            printValues: function() {
                container.setHTML('values of MasterClass-instance --> x: '+this.x);
            }
        }
    );

    SubClass = MasterClass.subClass(
        function(x, y) {
            // the constructor automaticly invoke its superclass!
            this.y = y;
        },
        {
            printValues: function() {
                container.setHTML('values of SubClass-instance --> x: '+this.x+', y: '+this.y);
            }
        }
    );

    SubSubClass = SubClass.subClass(
        function(x, y, z) {
            // the constructor automaticly invoke its superclass!
            this.z = z;
        },
        {
            printValues: function() {
                container.setHTML('values of SubSubClass-instance --> x: '+this.x+', y: '+this.y+', z: '+this.z);
            }
        }
    );

    master = new MasterClass(1);
    sub = new SubClass(10, 20);
    subsub = new SubSubClass(100, 200, 300);

    ITSA.Event.after('tap', function(e) {
        master.printValues();
    }, '#btnMaster');

    ITSA.Event.after('tap', function(e) {
        sub.printValues();
    }, '#btnSub');

    ITSA.Event.after('tap', function(e) {
        subsub.printValues();
    }, '#btnSubSub');

</script>