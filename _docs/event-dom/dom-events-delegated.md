---
module: event-dom
maintainer: Marco Asbreuk
title: DOM-events delegated
intro: "All DOM-events are subscribed using delegation. Even if you are listening to one node by id-reference. Advantage of this approach is that you can setup the listeners without the need to worry whether the nodes are in the DOM. This examples shows how subscribers of a specific node as well as multiple nodes by a selector are set up. The subscribers are setup before the nodes are in the DOM."
---

<style type="text/css">
    #addbtn-container {
        margin-top: 2em;
        min-height: 2.1em;
    }
    #container {
        margin: 2em 0;
        padding: 1em;
        min-height: 4.6em;
        background-color: #ddd;
    }
    #container button {
        margin: 0.25em;
    }
</style>

Click on the `Add-button` to add some extra buttons. Click on those extra buttons to show a pop-up.

<div id="addbtn-container">
    <button id="addbtn" class="pure-button pure-button-primary pure-button-bordered">Add button</button>
</div>

<div id="container"></div>


Code-example:

```html
<body>
    <div id="addbtn-container">
        <button id="addbtn" class="pure-button pure-button-primary pure-button-bordered">Add button</button>
    </div>

    <div id="container"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var count, container, addNewButton, showButtonText;

    count = 0;
    container = document.getElement('#container');

    addNewButton = function(e) {
        container.append('<button class="pure-button pure-button-primary pure-button-bordered">Click me '+(++count)+'</button>');
    };

    showButtonText = function(e) {
        alert(e.target.getHTML());
    };

    ITSA.Event.after('tap', addNewButton, '#addbtn');
    ITSA.Event.after('tap', showButtonText, '#container button');

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var count, container, addNewButton, showButtonText;

    count = 0;
    container = document.getElement('#container');

    addNewButton = function(e) {
        container.append('<button class="pure-button pure-button-primary pure-button-bordered">Click me '+(++count)+'</button>');
    };

    showButtonText = function(e) {
        alert(e.target.getHTML());
    };

    ITSA.Event.after('tap', addNewButton, '#addbtn');
    ITSA.Event.after('tap', showButtonText, '#container button');

</script>
