---
module: focusmanager
maintainer: Marco Asbreuk
title: Nested focusmanagers in a form
intro: "This example shows how the focusmanager works when nested."
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
    .container2 {
        margin: 5px;
        border: solid 4px #000;
        padding: 10px;
        display: block;
    }
    .container2.focussed {
        border: solid 4px #F00;
        background-color: #DDD;
    }
    .container2.focussed:focus {
        border: dotted 4px #F00;
    }
    .body-content.module p.spaced {
        margin-top: 4em;
    }
</style>

<form class="container pure-form pure-form-aligned" plugin-fm="true">
    <div class="pure-form-message-inline">Navigate with tab and shift+tab</div>
    <fieldset>
        <div class="pure-control-group">
            <label for="name">Username</label>
            <input id="name" type="text" value="first"/>
        </div>
        <div class="pure-control-group">
            <label for="pw">Password</label>
            <input id="pw" type="password" value="second"/>
        </div>
        <div class="container2 pure-form pure-form-aligned" plugin-fm="true" fm-keyenter="39" fm-keyleave="27">
            <div class="pure-form-message-inline">Enter with key-right and leave with Esc</div>
            <div class="pure-form-message-inline">Navigate with tab and shift+tab</div>
            <fieldset>
                <div class="pure-control-group">
                    <label for="nameinner">Username</label>
                    <input id="nameinner" type="text" value="first"/>
                </div>
                <div class="pure-control-group">
                    <label for="pwinner">Password</label>
                    <input id="pwinner" type="password" value="second"/>
                </div>
                <div class="pure-controls">
                    <label for="cbinner" class="pure-checkbox"><input id="cbinner" type="checkbox" /> I've read the conditions</label>
                </div>
                <div class="pure-controls">
                    <button class="pure-button pure-button-bordered">Cancel</button>
                    <button class="pure-button pure-button-bordered">OK</button>
                </div>
            </fieldset>
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
    .container2 {
        margin: 5px;
        border: solid 4px #000;
        padding: 10px;
        display: block;
    }
    .container2.focussed {
        border: solid 4px #F00;
        background-color: #DDD;
    }
    .container2.focussed:focus {
        border: dotted 4px #F00;
    }
</style>
```

```html
<body>
    <form class="container pure-form pure-form-aligned" plugin-fm="true">
        <div class="pure-form-message-inline">Navigate with tab and shift+tab</div>
        <fieldset>
            <div class="pure-control-group">
                <label for="name">Username</label>
                <input id="name" type="text" value="first"/>
            </div>
            <div class="pure-control-group">
                <label for="pw">Password</label>
                <input id="pw" type="password" value="second"/>
            </div>
            <div class="container2 pure-form pure-form-aligned" plugin-fm="true">
                <div class="pure-form-message-inline">Enter with key-right and leave with Esc</div>
                <div class="pure-form-message-inline">Navigate with tab and shift+tab</div>
                <fieldset>
                    <div class="pure-control-group">
                        <label for="nameinner">Username</label>
                        <input id="nameinner" type="text" value="first"/>
                    </div>
                    <div class="pure-control-group">
                        <label for="pwinner">Password</label>
                        <input id="pwinner" type="password" value="second"/>
                    </div>
                    <div class="pure-controls">
                        <label for="cbinner" class="pure-checkbox"><input id="cbinner" type="checkbox" /> I've read the conditions</label>
                    </div>
                    <div class="pure-controls">
                        <button class="pure-button pure-button-bordered">Cancel</button>
                        <button class="pure-button pure-button-bordered">OK</button>
                    </div>
                </fieldset>
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
    var ITSA = require('itsa');
    document.getElement('.container').focus();
</script>
```

<script src="../../dist/itsabuild-min.js"></script>
<script>
    var ITSA = require('itsa');
    document.getElement('.container').focus();
</script>