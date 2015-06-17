---
module: event-dom
maintainer: Marco Asbreuk
title: DOM after-events
intro: "DOM-events do not have after-listeners by default. However, <b>event-dom</b> has.<br>You can type anything in the text-box and the event shows the new value. Notice that this example may examine the <b>keypress</b> event to monitor what key is pressed, <u>it is not the right way to examine changes in the input-element</u>. If you want to examine those, you need to use the <b>valuechange</b>-event."
---

<style type="text/css">
    #input-container {
        margin-top: 2em;
        min-height: 2.1em;
    }
    #container {
        margin: 2em 0;
        padding: 1em;
        min-height: 4.6em;
        background-color: #ddd;
    }
</style>

Enter some text:

<div id="input-container">
    <input id="example" />
</div>
<div id="container"></div>


Code-example:

```html
<body>
    <div id="input-container">
        <input id="example" />
    </div>
    <div id="container"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var container = document.getElement('#container');

    var showMsg = function(e) {
        container.setHTML(e.target.value);
    };

    ITSA.Event.after('keypress', showMsg, '#example');
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var container = document.getElement('#container');

    var showMsg = function(e) {
        container.setHTML(e.target.value);
    };

    ITSA.Event.after('keypress', showMsg, '#example');
</script>
