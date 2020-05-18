import * as THREE from '/build/three.module.js';
import { GLTFLoader } from '/jsm/loaders/GLTFLoader';
import { OrbitControls } from "/jsm/controls/OrbitControls";
import { DragControls } from '/jsm/controls/DragControls';
import { GUI } from "/jsm/libs/dat.gui.module";
//import * as PIXI from "/pixi.js";
// setup PIXI ____________________________________________________________
/*
var pixiCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canv1");
var appPixi = new PIXI.Application({width: 200, height: 200});
var pixiRenderer = new PIXI.Renderer({view: pixiCanvas, width: 500, height: 500, antialias: true, backgroundColor: 0x92BE08});
var threeJSPixiTexture = new THREE.CanvasTexture(pixiRenderer.view);

document.body.appendChild(appPixi.view);

var backGrndImg = PIXI.utils.TextureCache["img/swampland.jpg"];
var sprite = new PIXI.Sprite(backGrndImg);

//add background image to scene

appPixi.stage.addChild(backGrndImg);*/
//threejs setup______________________________________________________________
var scene = new THREE.Scene();
//add camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//Add light
var light = new THREE.AmbientLight(0xFFFFFF, 0.8);
scene.add(light);
var canvas = document.getElementById("canv1");
//3renderer setup
var renderer = new THREE.WebGLRenderer({ canvas: canvas }); //should be pixiCanvas but pixi refuses to work
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.outputEncoding = THREE.sRGBEncoding;
//floor for the 3d environment
var geometry = new THREE.PlaneGeometry(10, 10, 1, 1);
var material = new THREE.MeshPhongMaterial({ color: 0xeeeeee, shininess: 0 });
var plane = new THREE.Mesh(geometry, material);
plane.rotateX(-Math.PI / 2);
plane.receiveShadow = true;
plane.position.y = -0.5;
scene.add(plane);
// texture setup
var textureLoader = new THREE.TextureLoader();
//Load background texture
textureLoader.load('img/swampland.jpg', function (texture) {
    scene.background = texture;
});
//3d model textures
var texture = textureLoader.load("models/ninja.png");
texture.encoding = THREE.sRGBEncoding;
//camera controls
var orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.screenSpacePanning = true;
orbitControls.target.set(0, 1, 0);
//dragcontrols init
var draggables = [];
var dragControls = new DragControls(draggables, camera, renderer.domElement);
dragControls.addEventListener("dragstart", function (event) {
    event.object.material.opacity = 0.33;
    console.log("start");
    orbitControls.enabled = false;
});
dragControls.addEventListener("drag", function (event) {
    orbitControls.enabled = false;
});
dragControls.addEventListener("dragend", function (event) {
    event.object.material.opacity = 0;
    orbitControls.enabled = true;
    console.log("end");
});
//loading of 3d object and variables for ninja
var model;
var ninjaModelGrp;
var ninjaDragBox;
var modelReady = false;
var mixer;
var animationActions = [];
var activeAction;
var lastAction;
var loader = new GLTFLoader();
loader.load('/models/cibus_ninja.glb', function (gltf) {
    gltf.scene.traverse(function (object) {
        console.log(object.type + " " + object.name);
        if ((object instanceof THREE.Group)) {
            ninjaModelGrp = object;
        }
        else if (object instanceof THREE.Mesh) {
            object.material.map = texture;
            object.material.side = THREE.BackSide;
        }
        object.castShadow = true;
    });
    //Animations
    mixer = new THREE.AnimationMixer(gltf.scene);
    var animationAction = mixer.clipAction(gltf.animations[0]);
    animationActions.push(animationAction);
    animationsFolder.add(animations, "Action0");
    animationAction = mixer.clipAction(gltf.animations[1]);
    animationActions.push(animationAction);
    animationsFolder.add(animations, "Action1");
    animationAction = mixer.clipAction(gltf.animations[2]);
    animationActions.push(animationAction);
    animationsFolder.add(animations, "Action2");
    animationAction = mixer.clipAction(gltf.animations[3]);
    animationActions.push(animationAction);
    animationsFolder.add(animations, "Action3");
    animationAction = mixer.clipAction(gltf.animations[4]);
    animationActions.push(animationAction);
    animationsFolder.add(animations, "Action4");
    activeAction = animationActions[0];
    setAction(animationActions[4]);
    //create box around model for dragging as skinned mesh not working with dragcontrols
    ninjaDragBox = new THREE.Mesh(new THREE.BoxGeometry(1, 2.5, 1), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
    ninjaDragBox.geometry.translate(0, 1.225, 0);
    scene.add(ninjaDragBox);
    draggables.push(ninjaDragBox);
    model = gltf.scene;
    scene.add(gltf.scene);
    modelReady = true;
}, (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
}, (error) => {
    console.log(error);
});
//ninja keyboard controls
var x = 0;
var y = 0;
window.addEventListener('keydown', function (event) {
    switch (event.keyCode) {
        case 37: // vas
            x = x - 0.2;
            model.position.x = x;
            break;
        case 38: // ylös
            y = y + 0.2;
            model.position.y = y;
            break;
        case 39: // oik
            x = x + 0.2;
            model.position.x = x;
            break;
        case 40: // alas
            y = y - 0.2;
            model.position.y = y;
            break;
    }
});
//animations set up
var animations = {
    Action0: function () {
        setAction(animationActions[0]);
    },
    Action1: function () {
        setAction(animationActions[1]);
    },
    Action2: function () {
        setAction(animationActions[2]);
    },
    Action3: function () {
        setAction(animationActions[3]);
    },
    Action4: function () {
        setAction(animationActions[4]);
    }
};
const setAction = (toAction) => {
    if (toAction !== activeAction) {
        lastAction = activeAction;
        activeAction = toAction;
        lastAction.fadeOut(1);
        activeAction.reset();
        activeAction.fadeIn(1);
        activeAction.play();
    }
};
// scene initialisation
camera.position.z = 5;
camera.position.y = 2;
var clock = new THREE.Clock();
const gui = new GUI();
const animationsFolder = gui.addFolder("Animations");
animationsFolder.open();
window.addEventListener('resize', onWindowResize, false);
//reset camera and canvas size if changed
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    animate();
}
var animate = function () {
    requestAnimationFrame(animate);
    if (modelReady) {
        mixer.update(clock.getDelta());
        ninjaModelGrp.position.copy(ninjaDragBox.position);
    }
    renderer.render(scene, camera);
};
animate();
