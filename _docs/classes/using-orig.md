---
module: js-ext
functionality: Classes
maintainer: Marco Asbreuk
title: Changing prototype with $orig()
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

<div id="cont"></div>


<p class="spaced">Code-example:</p>

```html
<body>
    <button id="btnMaster">Print Master values</button>
    <div id="cont"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var container = document.getElement('#cont'),
        MasterClass, SubClass, SubSubClass, master, sub, subsub;

    MasterClass = ITSA.Classes.createClass(
        function(x) {
            this.x = x;
        },
        {
            getValues: function() {
                return 'x: '+this.x;
            }
        }
    );

    master = new MasterClass(10);

    MasterClass.mergePrototypes({
        getValues: function() {
            return 'values of SubSubClass-instance --> '+this.$orig();
        }
    }, true);

    ITSA.Event.after('tap', function(e) {
        container.setHTML(master.getValues());
    }, '#btnMaster');
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var container = document.getElement('#cont'),
        MasterClass, SubClass, SubSubClass, master, sub, subsub;

    MasterClass = ITSA.Classes.createClass(
        function(x) {
            this.x = x;
        },
        {
            getValues: function(extra) {
                return 'x: '+this.x + ' '+extra;
            }
        }
    );

    master = new MasterClass(10);

    MasterClass.mergePrototypes({
        getValues: function(extra) {
            return 'first reassignment --> '+this.$orig(extra);
        }
    }, true);

    MasterClass.mergePrototypes({
        getValues: function(extra) {
            return 'second reassignment --> '+this.$orig(extra);
        }
    }, true);

    ITSA.Event.after('tap', function(e) {
        container.setHTML(master.getValues('yes!'));
    }, '#btnMaster');

</script>