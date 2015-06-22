---
module: event-dom
maintainer: Marco Asbreuk
title: valuechange event
intro: "The valuechange-event is a sophisticated event. It will be emitted on every type of intermediate changes of the element. Even when you paste content by rightclicking the mouse."
---

<style type="text/css">
    #input-container {
        margin-top: 2em;
        min-height: 2.1em;
    }
    #container,
    #container2 {
        margin: 2em 0;
        padding: 1em;
        min-height: 4.6em;
        background-color: #ddd;
    }
</style>

Enter some text or paste it: see that an valuechange-event occurs:

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
        container.setText(e.value);
    };

    ITSA.Event.after('valuechange', showMsg, '#example');
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var container = document.getElement('#container');

    var showMsg = function(e) {
        container.setText(e.value);
    };

    ITSA.Event.after('valuechange', showMsg, '#example');
</script>