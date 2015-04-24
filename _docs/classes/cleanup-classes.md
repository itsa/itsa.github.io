---
module: js-ext
functionality: Classes
maintainer: Marco Asbreuk
title: Cleanup classes with destroy()
intro: "This example shows how Class-instances can cleanup resources by calling <b>destroy</b>. This is the only method that automaticly invokes up through the hierarchy without using $super. The <b>destroy</b>-methods are invoked bottum up, till the highest Class. Note that the $super-<b>constructor</b> still needs to be invoked manually: after all, the system doesn't know which arguments you need to pass through, so you have to declare it yourself."
---

<style type="text/css">
    #cont {
        border: solid 1px #000;
        padding: 1em;
        min-width: 10em;
        min-height: 3em;
        display: block;
        margin-top: 1em;
    }
    #masternode,
    #childnode {
        border: solid 3px #000;
        background-color: #F00;
        width: 100px;
        height: 100px;
        margin: 0.5em;
    }
    #masternode {
        background-color: #F00;
    }
    #childnode {
        background-color: #00F;
    }
</style>

Click on the buttons to make the users speak or be silent.

<button id="btn" class="pure-button pure-button-bordered">Destroy the Class-instance</button>

<div id="cont"></div>


<p class="spaced">Code-example:</p>

```css
<style type="text/css">
    #cont {
        border: solid 1px #000;
        padding: 1em;
        min-width: 10em;
        min-height: 3em;
        display: block;
        margin-top: 1em;
    }
    #masternode,
    #childnode {
        border: solid 3px #000;
        background-color: #F00;
        width: 100px;
        height: 100px;
        margin: 0.5em;
    }
    #masternode {
        background-color: #F00;
    }
    #childnode {
        background-color: #00F;
    }
</style>
```

```html
<body>
    <button id="btn"">Destroy the Class-instance</button>
    <div id="cont"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        container = document.getElement('#cont'),
        MasterContainer, ChildContainer, containerInstance;

    MasterContainer = ITSA.Classes.createClass(
        function() {
            container.append('<div id="masternode"></div>');
        },
        {
            destroy: function() {
                var masternode = container.getElement('#masternode');
                masternode && masternode.remove();
            }
        }
    );

    ChildContainer = MasterContainer.subClass(
        function() {
            // the constructor does automaticly invoke its superclass!
            container.append('<div id="childnode"></div>');
        },
        {
            destroy: function() {
                // destroy does automaticly destroy the while hierarchy
                var childnode = container.getElement('#childnode');
                childnode && childnode.remove();
            }
        }
    );

    containerInstance = new ChildContainer();

    ITSA.Event.after('tap', function(e) {
        // Invoke `destroy` on the instance will execute `invoke`
        // on both ChildContainer and MasterContainer
        containerInstance.destroy();
    }, '#btn');

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        container = document.getElement('#cont'),
        MasterContainer, ChildContainer, containerInstance;

    MasterContainer = ITSA.Classes.createClass(
        function() {
            container.append('<div id="masternode"></div>');
        },
        {
            destroy: function() {
                var masternode = container.getElement('#masternode');
                masternode && masternode.remove();
            }
        }
    );

    ChildContainer = MasterContainer.subClass(
        function() {
            // the constructor does automaticly invoke its superclass!
            container.append('<div id="childnode"></div>');
        },
        {
            destroy: function() {
                // destroy does automaticly destroy the while hierarchy
                var childnode = container.getElement('#childnode');
                childnode && childnode.remove();
            }
        }
    );

    containerInstance = new ChildContainer();

    ITSA.Event.after('tap', function(e) {
        // Invoke `destroy` on the instance will execute `invoke`
        // on both ChildContainer and MasterContainer
        containerInstance.destroy();
    }, '#btn');

</script>
