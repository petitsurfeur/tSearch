var { ToggleButton } = require('sdk/ui/button/toggle');
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var monoLib = require("./monoLib.js");
var lang = require("./lang.js");

var pageMod = require("sdk/page-mod");
pageMod.PageMod({
    include: [
        self.data.url('index.html'),
        self.data.url('options.html'),
        self.data.url('magic.html'),
        self.data.url('history.html')
    ],
    contentScript: 'var vp = '+monoLib.virtulaPort.toString()+';vp("monoScope");',
    onAttach: function(tab) {
        monoLib.addPage('tab', tab);
    }
});

var createTab = function() {
    var tab = tabs.open({
        url: self.data.url("index.html")
    });
};

var button = ToggleButton({
    id: "tTinyOpenBtn",
    label: "Transmission easy client",
    icon: {
        "16": "./icons/icon-16.png",
        "32": "./icons/icon-32.png",
        "64": "./icons/icon-64.png"
    },
    onClick: createTab
});


var bg = require("./background.js");
var bg_addon = monoLib.virtualAddon('bg');

monoLib.addPage('bg', bg_addon);

bg.init(bg_addon, lang);