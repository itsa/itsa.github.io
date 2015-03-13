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

<a class="pure-button class1" href="http://itsasbreuk.nl">CLICK ME</a>

<script src="../../dist/itsabuild.js"></script>
<script>
    var ITSA = require('itsa');


    ITSA.Event.before('anchorclick', function(e) {
        // e.preventDefault();
    }, 'a');

    ITSA.Event.before('tap', function(e) {
        console.info(e.type);
    }, 'a');


</script>
