---
module: focusmanager
maintainer: Marco Asbreuk
title: Different focuskeys
intro: "This example shows how to setup a focusmanager that navigates with different keys: <b>arrow-up</b> and <b>arrow-down</b>. You could as wel use a plugin, with an additional config-object that looks like: <b>{keyup: 39, keydown: 41}</b>.<br><br>By setting the focus to the container, the first element gets focussed automaticly."
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
    .body-content.module p.spaced {
        margin-top: 4em;
    }
</style>

<div class="container pure-form" plugin-fm="true" fm-keyup="38" fm-keydown="40">
    <input type="text" value="first"/>
    <input type="text" value="second"/>
    <input type="checkbox" />
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
</style>
```

```html
<body>
    <div class="container pure-form" plugin-fm="true" fm-keyup="38" fm-keydown="40">
        <input type="text" value="first"/>
        <input type="text" value="second"/>
        <input type="checkbox" />
        <button class="pure-button pure-button-bordered">Cancel</button>
        <button class="pure-button pure-button-bordered">OK</button>
    </div>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');
    document.getElement('.container').focus();
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');
    document.getElement('.container').focus();
</script>
