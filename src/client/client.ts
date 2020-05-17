import * as THREE from '/build/three.module.js';
import { GLTFLoader } from '/jsm/loaders/GLTFLoader';
import { DragControls } from '/jsm/controls/DragControls';
import * as PIXI from "/pixi.js/dist/pixi.js";

// setup PIXI ____________________________________________________________

/*var pixiCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canv1");
var appPixi = new PIXI.Application({width: 200, height: 200});
var pixiRenderer = new PIXI.Renderer({view: pixiCanvas, width: 500, height: 500, antialias: true, backgroundColor: 0x92BE08});
var threeJSPixiTexture = new THREE.CanvasTexture(pixiRenderer.view);

document.body.appendChild(appPixi.view);

var backGrndImg = PIXI.utils.TextureCache["img/swampland.jpg"];
var sprite = new PIXI.Sprite(backGrndImg);

//add background image to scene

appPixi.stage.addChild(backGrndImg);*/



//threejs setup______________________________________________________________

        const scene: THREE.Scene = new THREE.Scene();
        
        //add camera
        const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        //Add light
        var light = new THREE.AmbientLight(0xFFFFFF, 0.8);
        scene.add(light);
        var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canv1");

        //3renderer setup
        const renderer = new THREE.WebGLRenderer({ canvas: canvas });  //should be pixiCanvas but pixi refuses to work
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        renderer.outputEncoding = THREE.sRGBEncoding;

        //floor for the 3d environment
        var geometry = new THREE.PlaneGeometry( 10, 10, 1, 1);
        var material = new THREE.MeshPhongMaterial({color: 0xeeeeee, shininess: 0});
        var plane = new THREE.Mesh(geometry, material);
        plane.rotateX(-Math.PI / 2);
        plane.receiveShadow = true;
        plane.position.y = -0.5;
        scene.add(plane);


        
        //3dmodel and texture setup
        var textureLoader= new THREE.TextureLoader();

        //Load background texture
        textureLoader.load('img/swampland.jpg' , function(texture)
            {
             scene.background = texture;  
            });

            //3d model textures
        var texture = textureLoader.load("models/ninja.png");
        texture.encoding = THREE.sRGBEncoding;
        texture.flipY = true;    
        
        var mixer = null;
        var mat;
        var model;

        //drag controller setup
        const draggables: THREE.Mesh[] = [];
        const controls = new DragControls(draggables, camera, renderer.domElement);
        controls.addEventListener("dragstart", function(event) {
            event.object.material.opacity = 0.33;
            console.log("start");
            });
        controls.addEventListener("dragend", function(event) {
            event.object.material.opacity = 1;
            console.log("end");
        });

        const loader = new GLTFLoader();
        loader.load
        (
            '/models/cibus_ninja.glb',
            function (gltf) 
            {   
                model = gltf.scene;
        
                gltf.scene.traverse( function( object ) 
                     {            
                       if ((object instanceof THREE.Mesh))
                        {
                            draggables.push(object);
                              mat = object.material;
                              mat.map = texture;
                        }
                    });

                scene.add(model);
                
                //Animation activation
                mixer = new THREE.AnimationMixer(model);
                mixer.clipAction(gltf.animations[4]).play();
                      
            },
            (xhr) => 
            {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded')
            },
            (error) => 
            {
                console.log(error);
            }
        );

        //ninja model controls
       var x = 0;
       var y = 0;

        window.addEventListener('keydown', function (event) 
        {
           switch (event.keyCode) 
           {

                case 37: // vas
                   x = x - 0.2; 
                   model.position.x = x;
                   animate();
                break
                case 38: // ylös
                  y = y + 0.2; 
                  model.position.y = y;
                  animate();
                break
                case 39: // oik
                  x = x + 0.2; 
                  model.position.x = x;
                  animate();
                break
                case 40: // alas
                  y = y - 0.2; 
                  model.position.y = y;
                  animate();
                break
            }
        }); 

//second 3d model for testing with dragcontrols
loader.load(
  "models/monkey.glb",
  function(gltf) {
    gltf.scene.traverse(function(child) {
      if ((child as THREE.Mesh).isMesh) {
        let m = child as THREE.Mesh;
          m.position.x = 2;
          m.position.y = 2;

        draggables.push(m as THREE.Mesh);
      }
    });
    scene.add(gltf.scene);
  },
  xhr => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  error => {
    console.log(error);
  }
);

        // scene initialisation
        camera.position.z = 5;
        camera.position.y = 2;
        var clock = new THREE.Clock();

        window.addEventListener('resize', onWindowResize, false);
    
//reset camera and canvas size if change in window
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
    animate();
}

var animate = function() {
  requestAnimationFrame(animate);
  var delta = clock.getDelta();
  if (mixer != null) 
  {
      mixer.update(delta);
  };
  renderer.render(scene, camera);
};

animate();
