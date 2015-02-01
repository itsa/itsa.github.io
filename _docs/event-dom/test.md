---
module: event-dom
maintainer: Marco Asbreuk
title: TEST
intro: "All DOM-events are trully delegated. This means we can set up only <b>one subscriber</b> for all focus-events. Also notice how we prevent-default the submitbutton and focussed in instead, so we still get a focus-message on that button."
---

<style type="text/css">
    #msg-container {
        margin: 2em 0;
        padding: 1em;
        background-color: #ddd;

    }
</style>

Focus the formelements and see what element got the focus.

<div id="msg-container" class="inspected">
    OK
</div>

<button class="pure-button inspected">CLICK ME</button>

<script src="../../dist/itsabuild.js"></script>
<script>
    var ITSA = require('itsa');


    ITSA.Event.after(['tap', 'click', 'dblclick' , 'doubletap'], function(e) {
        console.info(e.type);
    }, '.inspected');

</script>
