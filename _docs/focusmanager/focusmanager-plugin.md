---
module: focusmanager
maintainer: Marco Asbreuk
title: Focusmanager by plugin
intro: "This example shows how to set up a simple focusmanagers with the plugin <b>ITSA.Plugins.focusManager</b>. Also, the config-property <b>manage</b> is changed in a way that the div-element with class <b>.area</b> can ge focus.<br><br>By setting the focus to the container, the first element gets focussed automaticly. Looping through the focussable items can be done by the tab-keys - which is the default."
---


<style type="text/css">
    .container {
        width: 300px;
        margin: 20px;
        border: solid 1px #000;
        padding: 10px;
        display: inline-block;
    }
    .container.focussed {
        border: solid 2px #F00;
        background-color: #F5F5F5;
    }
    .container input {
        display: block;
        margin: 4px 0;
    }
    .area {
        width: 50px;
        height: 30px;
        border: solid 1px #666;
        display: block;
        margin: 5px 0;
    }
    .area:focus {
        border: solid 2px #F00;
    }
    .body-content.module p.spaced {
        margin-top: 4em;
    }
</style>

<div class="container pure-form">
    <input type="text" value="first"/>
    <input type="text" value="second"/>
    <input type="checkbox" />
    <div class='area'></div>
    <button class="pure-button pure-button-bordered">Cancel</button>
    <button class="pure-button pure-button-bordered">OK</button>
</div>

<p class="spaced">Code-example:</p>

```css
<style type="text/css">
    .container {
        width: 300px;
        margin: 20px;
        border: solid 1px #000;
        padding: 10px;
        display: inline-block;
    }
    .container.focussed {
        border: solid 2px #F00;
        background-color: #F5F5F5;
    }
    .container input {
        display: block;
        margin: 4px 0;
    }
    .area {
        width: 50px;
        height: 30px;
        border: solid 1px #666;
        display: block;
        margin: 5px 0;
    }
    .area:focus {
        border: solid 2px #F00;
    }
</style>
```

```html
<body>
    <div class="container pure-form">
        <input type="text" value="first"/>
        <input type="text" value="second"/>
        <input type="checkbox" />
        <div class='area'></div>
        <button class="pure-button pure-button-bordered">Cancel</button>
        <button class="pure-button pure-button-bordered">OK</button>
    </div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        container = document.getElement('.container');

    container.plug(ITSA.Plugins.focusManager, {manage: 'button, input, .area'});
    document.getElement('.container').focus();
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa'),
        container = document.getElement('.container');

    container.plug(ITSA.Plugins.focusManager, {manage: 'button, input, .area'});
    document.getElement('.container').focus();
</script>