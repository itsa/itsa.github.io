---
module: panel
maintainer: Marco Asbreuk
title: Panel with callback
intro: "This example show how you can setup a callback to inspect what button was pressed to close the panel. When a button is pressed, the buttonText will be shown on the screen."
---

<style type="text/css">
    #cont {
        border: solid 1px #000;
        height: 2em;
        line-height: 2em;
        vertical-align: center;
        padding-left: 0.5em;
    }
</style>

<div id="cont"></div>
<p class="spaced">Code-example:</p>

```js
<script src="itsabuild-min.js"></script>
<script>
    var cb;
    cb = function(buttonNode) {
        document.getElement('#cont').setText(buttonNode.getHTML());
    };

    document.createPanel({
        header: 'title',
        footer: '<button class="pure-button">Cancel</button><button class="pure-button">Ok</button>',
        content: 'Press cancel, ok or the closebutton',
        visible: true,
        onTopWhenShowed: true,
        headerCloseBtn: true,
        callback: cb
    });

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var cb;
    cb = function(buttonNode) {
        document.getElement('#cont').setText(buttonNode.getHTML());
    };

    document.createPanel({
        header: 'title',
        footer: '<button class="pure-button">Cancel</button><button class="pure-button">Ok</button>',
        content: 'Press cancel, ok or the closebutton',
        visible: true,
        onTopWhenShowed: true,
        headerCloseBtn: true,
        callback: cb
    });

</script>
