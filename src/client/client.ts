import * as THREE from '/build/three.module.js';

import { OrbitControls } from '/jsm/controls/OrbitControls';
import { GLTFLoader } from '/jsm/loaders/GLTFLoader';
/* import * as PIXI from "pixi.js";
//const PIXI = require('pixi.js');

// setup PIXI ____________________________________________________________-

var pixiCanvas = document.getElementById("canv1");
var appPixi = new PIXI.Application(window.innerWidth, window.innerHeight)
var pixiRenderer = new PIXI.Renderer({view: pixiCanvas, width: 500, height: 500, antialias: true, backgroundColor: 0x92BE08});
var threeJSPixiTexture = new THREE.CanvasTexture(pixiRenderer.view);


document.body.appendChild(appPixi.view);*/


//threejs setup______________________________________________________________

const scene: THREE.Scene = new THREE.Scene();

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var light = new THREE.AmbientLight(0xFFFFFF, 0.8);
scene.add(light);

var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canv1");

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.outputEncoding = THREE.sRGBEncoding;

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', render);

//taso mallille
var geometry = new THREE.PlaneGeometry( 10, 10);
var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
var plane = new THREE.Mesh( geometry, material );
plane.rotateX( - Math.PI / 2);
scene.add( plane );

//3dmallin asettelu

var textureLoader= new THREE.TextureLoader();
var texture = textureLoader.load("models/ninja.png");
texture.encoding = THREE.sRGBEncoding;
texture.flipY = false;

var mixer = null;

const loader = new GLTFLoader();
loader.load(
    '/models/cibus_ninja.glb',
    function (gltf) {   
        var model = gltf.scene;
        
        gltf.scene.traverse( function( object ) 
        {
            
            if ((object instanceof THREE.Mesh)
            { 
                var mat = object.material;
                //mat.map = texture;
            }
        })

        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        mixer.clipAction(gltf.animations[4]).play();
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded')
    },
    (error) => {
        console.log(error);
    }
);

// scene things

var clock = new THREE.Clock();
camera.position.z = 4;

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
    render();
}

function render() {
    requestAnimationFrame(render);

    controls.update();
    
    var delta = clock.getDelta();
    if (mixer != null) 
    {
        mixer.update(delta);
    };

    renderer.render(scene, camera);
}

render();