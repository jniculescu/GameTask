//import * as PIXI from "/pixi.js/dist/pixi.js";
import * as PIXI from "/pixi.js";
//var PIXI = require("pixi.js");
var fooOMG;
(function (fooOMG) {
    // setup PIXI ____________________________________________________________
    class PixiCode {
        constructor() {
            var pixiCanvas = document.getElementById("canv1");
            var appPixi = new PIXI.Application({ width: 200, height: 200 });
            var pixiRenderer = new PIXI.Renderer({ view: pixiCanvas, width: 500, height: 500, antialias: true, backgroundColor: 0x92BE08 });
            document.body.appendChild(appPixi.view);
            var backGrndImg = PIXI.utils.TextureCache["img/swampland.jpg"];
            var sprite = new PIXI.Sprite(backGrndImg);
            //add background image to scene
            appPixi.stage.addChild(backGrndImg);
        }
    }
    fooOMG.PixiCode = PixiCode;
})(fooOMG || (fooOMG = {}));
