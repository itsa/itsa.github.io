---
module: focusmanager
maintainer: Marco Asbreuk
title: Pure-form
intro: "This example shows how to set up a simple focusmanagers with plain HTML. <br><br>By setting the focus to the container, the first element gets focussed automaticly. Looping through the focussable items can be done by the tab-keys - which is the default."
---


<style type="text/css">
    .container {
        margin: 20px;
        border: solid 1px #000;
        padding: 10px;
        display: inline-block;
    }
    .container.focussed {
        border: solid 2px #F00;
        background-color: #F5F5F5;
    }
    .body-content.module p.spaced {
        margin-top: 4em;
    }
</style>

<form class="container pure-form pure-form-aligned" plugin-fm="true">
    <fieldset>
        <div class="pure-control-group">
            <label for="name">Username</label>
            <input id="name" type="text" value="first"/>
        </div>
        <div class="pure-control-group">
            <label for="pw">Password</label>
            <input id="pw" type="password" value="second"/>
        </div>
        <div class="pure-controls">
            <label for="cb" class="pure-checkbox"><input id="cb" type="checkbox" /> I've read the conditions</label>
        </div>
        <div class="pure-controls">
            <button class="pure-button pure-button-bordered">Cancel</button>
            <button class="pure-button pure-button-bordered">OK</button>
        </div>
    </fieldset>
</form>

<p class="spaced">Code-example:</p>

```css
<style type="text/css">
    .container {
        margin: 20px;
        border: solid 1px #000;
        padding: 10px;
        display: inline-block;
    }
    .container.focussed {
        border: solid 2px #F00;
        background-color: #F5F5F5;
    }
</style>
```

```html
<body>
    <form class="container pure-form pure-form-aligned" plugin-fm="true">
        <fieldset>
            <div class="pure-control-group">
                <label for="name">Username</label>
                <input id="name" type="text" value="first"/>
            </div>
            <div class="pure-control-group">
                <label for="pw">Password</label>
                <input id="pw" type="password" value="second"/>
            </div>
            <div class="pure-controls">
                <label for="cb" class="pure-checkbox"><input id="cb" type="checkbox" /> I've read the conditions</label>
            </div>
            <div class="pure-controls">
                <button class="pure-button pure-button-bordered">Cancel</button>
                <button class="pure-button pure-button-bordered">OK</button>
            </div>
        </fieldset>
    </form>
</body>
```

```js
<script src="itsabuild-min.js"></script>
<script>
    document.getElement('.container').focus();
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    document.getElement('.container').focus();
</script>
