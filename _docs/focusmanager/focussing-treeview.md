---
module: focusmanager
maintainer: Marco Asbreuk
title: Focussing treeview
intro: "This example shows how to set up a simple focusmanagers with plain HTML. <br><br>By setting the focus to the container, the first element gets focussed automaticly. Looping through the focussable items can be done by the tab-keys - which is the default."
---


<style type="text/css">
    .treeview {
        width: 200px;
        border: solid 1px #000;
    }
    .treeview li:focus {
        background-color: #c0e5fd;
    }
    .treeview li.focussed >span {
        background-color: #1f8dd6;
    }
    .body-content.module p.spaced {
        margin-top: 4em;
    }
</style>

<ul class="treeview" fm-manage=">li:not(.treeview-subgroup), >li >ul" fm-keyup="38" fm-keydown="40" fm-noloop="true">
    <li>item1</li>
    <li>item2</li>
    <li class="treeview-subgroup">
        <span>group 1</span>
        <ul fm-manage=">li:not(.treeview-subgroup), >li >ul" fm-keyup="38" fm-keydown="40" fm-enter="39" fm-leave="37" fm-noloop="true">
            <li>item3</li>
            <li>item4</li>
            <li>item5</li>
            <li class="treeview-subgroup">
               <span>group 1</span>
                <ul fm-manage=">li:not(.treeview-subgroup), >li >ul" fm-keyup="38" fm-keydown="40" fm-enter="39" fm-leave="37" fm-noloop="true">
                    <li>item6</li>
                    <li>item7</li>
                    <li>item8</li>
                    <li>item9</li>
                    <li>item10</li>
                    <li>item11</li>
                    <li>item12</li>
                    <li>item13</li>
               </ul>
            </li>
            <li>item14</li>
            <li>item15</li>
            <li>item16</li>
            <li>item17</li>
        </ul>
    </li>
    <li>item18</li>
    <li class="treeview-subgroup">
        <span>group 2</span>
        <ul fm-manage=">li:not(.treeview-subgroup), >li >ul" fm-keyup="38" fm-keydown="40" fm-enter="39" fm-leave="37" fm-noloop="true">
            <li>item19</li>
            <li>item20</li>
            <li>item21</li>
            <li>item22</li>
            <li>item23</li>
            <li>item24</li>
            <li>item25</li>
            <li>item26</li>
        </ul>
    </li>
    <li class="treeview-subgroup">
        <span>group 3</span>
        <ul fm-manage=">li:not(.treeview-subgroup), >li >ul" fm-keyup="38" fm-keydown="40" fm-enter="39" fm-leave="37" fm-noloop="true">
            <li>item27</li>
            <li>item28</li>
            <li>item29</li>
            <li>item30</li>
            <li>item31</li>
            <li>item32</li>
            <li>item33</li>
            <li>item34</li>
        </ul>
    </li>
    <li>item35</li>
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

<script src="../../dist/itsabuild.js"></script>
<script>
    var ITSA = require('itsa');
    document.getElement('.treeview').focus();
</script>
