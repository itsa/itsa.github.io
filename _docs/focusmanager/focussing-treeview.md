---
module: focusmanager
maintainer: Marco Asbreuk
title: Focussing treeview
intro: "This example shows how to set up a simple focusmanagers with plain HTML. <br><br>By setting the focus to the container, the first element gets focussed automaticly. Looping through the focussable items can be done by the tab-keys - which is the default."
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

<ul class="treeview" fm-manage=">li" fm-keyup="38" fm-keydown="40" noloop="true">
    <li>item</li>
    <li>item</li>
    <li class="treeview-subgroup" fm-manage=">ul >li" fm-keyup="38" fm-keydown="40" fm-enter="39" fm-leave="37" noloop="true">
        <span>group 1</span>
        <ul>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li class="treeview-subgroup" fm-manage=">ul >li" fm-keyup="38" fm-keydown="40" fm-enter="39" fm-leave="37" noloop="true">
               <span>group 1</span>
               <ul>
                    <li>item</li>
                    <li>item</li>
                    <li>item</li>
                    <li>item</li>
                    <li>item</li>
                    <li>item</li>
                    <li>item</li>
                    <li>item</li>
               </ul>
            </li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
        </ul>
    </li>
    <li>item</li>
    <li class="treeview-subgroup" fm-manage=">ul >li" fm-keyup="38" fm-keydown="40" fm-enter="39" fm-leave="37" noloop="true">
        <span>group 2</span>
            <ul>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
        </ul>
    </li>
    <li class="treeview-subgroup" fm-manage=">ul >li" fm-keyup="38" fm-keydown="40" fm-enter="39" fm-leave="37" noloop="true">
        <span>group 3</span>
            <ul>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
        </ul>
    </li>
    <li>item</li>
</ul>

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
    <div class="container pure-form" fm-manage="true">
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
