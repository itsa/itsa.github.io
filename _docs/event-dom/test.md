---
module: event-dom
maintainer: Marco Asbreuk
title: TEST
intro: "All DOM-events are trully delegated. This means we can set up only <b>one subscriber</b> for all focus-events. Also notice how we prevent-default the submitbutton and focussed in instead, so we still get a focus-message on that button."
---

<style type="text/css">
    #msg-container {
        margin: 2em;
        padding: 2em;
        background-color: #ddd;

    }
</style>

Focus the formelements and see what element got the focus.

<div id="msg-container" class="classA">
    <button class="pure-button class1"><b class="classB">CLICK</b> ME</button>
    <button class="pure-button class2"><b class="classC">CLICK</b> ME</button>
    <button class="pure-button class3"><b class="classD">CLICK</b> ME</button>
</div>

<button class="pure-button class11"><b class="classE">CLICK</b> ME</button>
<button class="pure-button class12"><b class="classF">CLICK</b> ME</button>

<script src="../../dist/itsabuild.js"></script>
<script>
    var ITSA = require('itsa');


    ITSA.Event.after('blurnode', function(e) {
        console.info('BLURNODE');
    }, '#msg-container');

    ITSA.Event.after('focusnode', function(e) {
        console.info('FOCUSNODE ');
        console.info(e.target);
    }, '#msg-container');

document.getElement('.class1').focus();

</script>
