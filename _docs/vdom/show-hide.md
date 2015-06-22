---
module: vdom
maintainer: Marco Asbreuk
title: Show or hide a DOM-node
intro: "This example shows how you can show and hide a node. To hide a node on startup, you must add the 'itsa-hidden' as well as hide the element initially through node.hide(). The latter is needed to be able to call node.show(true) on the initial hidden Node. Without initially hided by JS, there won't be a fade-effect for the first time the node gets visible."
---

<style type="text/css">
    #btncontainer {
        margin: 2em 0;
        min-height: 2em;
    }
    #btncontainer button {
        margin-top: 0.5em;
        min-width: 16em;
        display: block;
    }
    .container {
        background-color: #F00;
        text-align: center;
        margin: 2em 0;
        padding-top: 1.5em;
        height: 100px;
        width: 100px;
        border: solid 1px #000;
        position: absolute;
        top: 32em;
        left: 23em;
        z-index: 1;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: default;
    }
    .body-content.module p.spaced {
        margin-top: 4em;
    }
</style>

Clik on the button to toggle the className:

<div id="btncontainer">
    <button id="button-show" class="pure-button pure-button-primary pure-button-bordered">Show Node</button>
    <button id="button-show-faded" class="pure-button pure-button-primary pure-button-bordered">Show Node faded</button>
    <button id="button-hide" class="pure-button pure-button-primary pure-button-bordered">Hide Node</button>
    <button id="button-hide-faded" class="pure-button pure-button-primary pure-button-bordered">Hide Node faded</button>
</div>

<div class="container itsa-hidden"></div>

<p class="spaced">Code-example:</p>

```html
<body>
    <div id="btncontainer">
        <button id="button-show" class="pure-button pure-button-primary pure-button-bordered">Show Node</button>
        <button id="button-show-faded" class="pure-button pure-button-primary pure-button-bordered">Show Node faded</button>
        <button id="button-hide" class="pure-button pure-button-primary pure-button-bordered">Hide Node</button>
        <button id="button-hide-faded" class="pure-button pure-button-primary pure-button-bordered">Hide Node faded</button>
    </div>

    <div class="container itsa-hidden itsa-transparent"></div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var container = document.getElement('.container');

    var action = function(e) {
        switch (e.target.getId()) {
            case 'button-show': container.show();
                break;
            case 'button-show-faded': container.show(5);
                break;
            case 'button-hide': container.hide();
                break;
            case 'button-hide-faded': container.hide(5);
        }
    };

    ITSA.Event.after('tap', action, 'button');

</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var container = document.getElement('.container');

    var action = function(e) {
        switch (e.target.getId()) {
            case 'button-show': container.show();
                break;
            case 'button-show-faded': container.show(5);
                break;
            case 'button-hide': container.hide();
                break;
            case 'button-hide-faded': container.hide(5);
        }
    };

    ITSA.Event.after('tap', action, 'button');
</script>
