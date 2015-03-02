---
module: panel
itsaclassname:
version: 0.0.1
modulesize: 1.69
dependencies: "polyfill"
maintainer: Marco Asbreuk
title: Panel
intro: "Creating floating Panel-nodes which can be shown and hidden."
firstpar: get-started-onlywindow
---



#The Basics#

Panels are floating divs with content and optionally a header and footer. A Panel is defined by using: `document.createPanel()` which accepts as argument a `config`-object and optionally a boolean to tell whether the panel is a system-node (system-nodes keep hidden when querying the dom and retain when their parent-node gets new content).

When defining a panel, a new `div` element gets prepended to `body`. This panel-node has the `panel`-plugin by which the panel can be controlled. The config that is passed throug as first argument is being used as the `plugin.model`, so changing any properties on this object will control the panel.


##Show and hide a panel##
A panel can be shown or hidden by controlling `model.visible`. Also, a panel will always hide whenever a `button` is pressed inside the `header` or `footer`. The latter can be prevented by the `panel:buttonhide`-event.

#Defining a new Panel#

A Panel is defined by using: `document.createPanel()`. When a new Panel is defined, you pass through an object that will serve as the panel-plugin's `model`:

####Example simple panel####
```js
    var modelData = {
        content: 'I am a panel'
    }
    document.createPanel(modelData);

    // show the panel by set "visible" true:
    modelData.visible = true;
```



#Properties of a Panel#

A Panel has several properties, which all can be set and controlled by the config-argument which represents the `plugin.model` object. This object is the same as what was passed through when initiated, but can also be retrieved by either:

```
var model = panelNode._plugins.panel.model;
```

or:

```
panelNode.getPlugin('panel').then(
    function(plugin) {
        var model = plugin.model;
    }
);
```

Note that using the first way might result in `undefined` when the panel is not initialized yet.


##Overview##

###content###
{String} The main content of the panel.

###header###
{String} The header-content. When not specified and headerCloseBtn===false and there is a button-element in the footer, the header will not be shown.

###footer###
{String} The footer-content. When not specified, the footer will not be shown.

###visible###
{boolean} Whether the panel is visible. Defaults false.

###onTopWhenShowed###
{boolean} Controls whether the panel will be set ontop of other panels when it is made visible, even if its stack-number is lower than another visible panel. Defaults true.

###headerCloseBtn###
{boolean} Whether to show the close-button in the header. Defaults false, but will set true if there is no button-element in the footer.

###stack###
{number} The stack-number, which is alike the z-index. Not exactly the same: the real z-index is calculated by the stack-number. Panels with higher stack-number lie above panels with lower, although the value of `modal` and `onTopWhenShowed` might change this. Default is: 1.

###left###
{number} the leftposition on the screen in pixels.

###top###
{number} The top-positionon the screen in pixels.

###center###
{boolean} Whether to center the panel. When draggable, its position can become "uncentered" when dragged. Defaults true.

###minWidth###
{number} The minimal width of the panel, which is 150 px by default.

###maxWidth###
{number} The maximal width of the panel, which is 90% by default.

###minHeight###
{number} The minimal height of the panel, which is 75px by default.

###maxHeight###
{number} The minimal height of the panel, which is undefined by default.

###modal###
{boolean} Whether the panel should appear `modal` which means that a blurred layer appears behind the panel and obave the document.

###draggable###
{boolean} Whether the panel is draggable

###focusmanaged###
{boolean} Whether the panel's form-elements are controlled by the focusmanager. Defaults true.

###validate###
{Function} optional validation-function which recieves the event-object of the `panel:hide`-event and can be used to prevent the panel from hiding. When this function is defined, the returnvalue must be a boolean: when returned `false`, the `panel:hide`-event gets preventDefaulted, which means: it won't hide.

####Example validate####
```js
var validateFn = function(e) {
    // only hide when pressed the 'Ok'-button:
    return (e.button.getHTML()==='Ok');
};

var modelData = {
    header: 'title',
    footer: '<button class="pure-button">Cancel</button><button class="pure-button">Ok</button>',
    content: 'I am a panel',
    visible: true,
    validate: validateFn
};

document.createPanel(modelData);
```



#Events#

All panels emit `panel:shown` and `panel:hidden` whenever they are shown or hidden, either by buttonclicks or when controlling the panel.model. These events cannot be prevent-defaulted.

All panels will also emit the `panel:buttonhide` event when hiding by clicking on a button. The default-function will hide the panel, so subscribing to the `before`-event can prevent hiding and subscribing to the `after`-event makes sure the subscriber gets invoked when the panel is hidden.

##Overview##

###panel:shown###
This event-object has the next relevant properties:

* **e.target**: the panelNode
* **e.plugin**: the panel-plugin
* **e.model**: the plugin's model

###panel:hidden###
This event-object has the next relevant properties:

* **e.target**: the panelNode
* **e.plugin**: the panel-plugin
* **e.model**: the plugin's model

###panel:buttonhide###
This event-object has the next relevant properties:

* **e.target**: the panelNode
* **e.button**: the buttonNode that was pressed to make the panel hide.
* **e.plugin**: the panel-plugin
* **e.model**: the plugin's model