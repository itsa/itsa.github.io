---
module: event-dom
maintainer: Marco Asbreuk
title: DOM-events
intro: "DOM-events can be listened by without an emitterName. By using the `filter`-argument you specify which node to listen to. Because the filter (selector) is a String, we can pass it as 3rd parameter."
---

<style type="text/css">
    #addbtn-container {
        margin: 2em 0;
        min-height: 2em;
    }
</style>

Click on the `Show popup` to to show a pop-up.

<div id="addbtn-container">
    <button id="buttongo" class="pure-button pure-button-primary pure-button-bordered">Show popup</button>
</div>


Code-example:

```html
<body>
    <button id="buttongo" class="pure-button pure-button-primary pure-button-bordered">Show popup</button>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var showMsg = function(e) {
        alert('Button was clicked');
        console.log(e);
    };

    ITSA.Event.after('tap', showMsg, '#buttongo');
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var showMsg = function(e) {
        alert('Button was clicked '+e.shiftKey);
        console.log(e);
    };

    ITSA.Event.before('tap', showMsg, '#buttongo');
</script>
