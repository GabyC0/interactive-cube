import * as THREE from 'three'
import { js } from 'three/examples/jsm/nodes/Nodes.js';
import gsap from 'gsap';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

//to debug in the browser
const gui = new GUI(
    //can add a width to the gui
    //width: 300,
    //title: 'Debug gui',
    //close/open folders by default
    //coleFolders: false,
);

//can close entire gui
//gui.close();
//hide and can set to open on key press
// gui.hide();

window.addEventListener('keydown', (event) => {
    if(event.key == 'h') 
        gui.show(gui._hidden);
})
//params: object, property of object

const debugObject = {};

//Cursor
const cursor = {
    x: 0,
    y: 0
};

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = - (event.clientY / sizes.height - 0.5);

    // console.log(cursor.x);
});



// console.log(gsap);

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Object
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// Buffer Geometry - typed array with a fixed length
// Float32Array - can only store floats
// there are two ways to create and fill a buffer geometry

// const postionsArray = new Float32Array(9); //- 1 dimension array

// //values of first vertex x,y,z
// positionsArray[0] = 0;
// positionsArray[1] = 0;
// positionsArray[2] = 0;

// //values of second vertex x,y,z
// positionsArray[3] = 0;
// positionsArray[4] = 1;
// positionsArray[5] = 0;

// //values of third vertex x,y,z
// positionsArray[6] = 1;
// positionsArray[7] = 0;
// positionsArray[8] = 0;

// const geometry = new THREE.BufferGeometry();

//to add many triangles:
// const count = 50;
// const positionsArray = new Float32Array(count * 3 * 3); //- we want many triangels each of 3 vertex with 3 values each
// //fill the array with random values
// for (let i = 0; i < count * 3 * 3; i++) {
//     positionsArray[i] = (Math.random() - 0.5) * 4;
// }
//create attribute
// const positionAttributes = new THREE.BufferAttribute(positionsArray, 3);
//send to geometry
// geometry.setAttribute('position', positionAttributes);
//other solution
// const positionsArray = new Float32Array([
//     0, 0, 0, //first vertex
//     0, 1, 0, //second vertex
//     1, 0, 0 //third vertex
// ]);

// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3); //- 3 because we have 3 values for each vertex

// geometry.setAttribute('position', positionsAttribute);

// const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

debugObject.color = "#3a6ea6";

// comment this back in to see the cube wireframe but comment mesh below out
// const mesh = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
//     new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: false })
// );

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
const cubeTweaks = gui.addFolder('Cube');
cubeTweaks.close();

// const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh);

//one or the other depending on clarity preference
// gui.add(mesh.position, 'y', -3, 3, 0.01);
cubeTweaks.add(mesh.position, 'y')
.min(-3)
.max(3)
.step(0.01)
.name('elevation');

cubeTweaks.add(mesh, 'visible');
cubeTweaks.add(mesh.material, 'wireframe');
cubeTweaks.addColor(debugObject, 'color').onChange(() => {
    // console.log(material.color);
    material.color.set(debugObject.color);
});

debugObject.spin = () => {
    //so it rotates full circle x2
    gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2 })
}
cubeTweaks.add(debugObject, 'spin');
debugObject.subdivision = 2;
cubeTweaks.add(debugObject, 'subdivision')
    .min(1)
    .max(20)
    .step(1)
    .onFinishChange(() => {
        mesh.geometry.dispose();
        mesh.geometry = new THREE.BoxGeometry(
            1, 1, 1, 
            debugObject.subdivision, debugObject.subdivision, debugObject.subdivision
        );
    });
// Sizes
const sizes = {
    //To change width or height you can add a number or window.innerWidth or window.innerHeight
    width: window.innerWidth,
    height: window.innerHeight
}

//listen to resize event
window.addEventListener('resize', () => {
    //update sizes
    sizes.width = window.innerWidth;;
    sizes.height = window.innerHeight;
    // console.log('window has been resized');

    //update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    //update renderer
    renderer.setSize(sizes.width, sizes.height);
});

//listen to double click event on window
window.addEventListener('dblclick', () => {
    //need a variable to not give an error on different browsers
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;

    if (!fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
});

// Camera
//perspective
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

//orthographic 
// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100);
// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

//Controls
const controls = new OrbitControls(camera,canvas);
//to disable controls: 
// controls.enabled = false;
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
//always have pixel ratio to not have issues with devices that have higher pixel ratio
renderer.setPixelRatio(Math.min(window.devicePixelRatio), 2);

//time
// let time = Date.now();

//clock
const clock = new THREE.Clock();

//using GSAP
//passing what object we're animating (mesh.position) and an object to specify the destination of the diff properties
// gsap.to(mesh.position, {duration: 1, delay: 1, x: 2 });
// gsap.to(mesh.position, {duration: 2, delay: 2, x: -2 });
// gsap.to(mesh.position, {duration: 1, delay: 3, x: 0 });

const tick = () => {

    //clock
    const elapsedTime = clock.getElapsedTime();
    // console.log(elapsedTime);

    // //time
    // const currentTime = Date.now();
    // const deltaTime = currentTime - time;
    // time = currentTime;
    // // console.log(time);
    // console.log(deltaTime);


    //update object 
    // mesh.rotation.x += 0.01
    // mesh.rotation.y += 0.01;
    // mesh.position.x += 0.01;
    // mesh.rotation.y += 0.001 * deltaTime;
    // mesh.rotation.y += 0.01; //on

    // mesh.rotation.y = elapsedTime;
    // mesh.position.y = Math.sin(elapsedTime); //on
    // mesh.position.x = Math.cos(elapsedTime); //on
    // camera.position.y = Math.sin(elapsedTime);
    // camera.position.x = Math.cos(elapsedTime);
    // camera.lookAt(mesh.position);

    //update camera
// camera.position.x = cursor.x * 10;
//to position on a circle
// camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
// camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3; 
// camera.position.y = cursor.y * 10;
// // camera.lookAt(new THREE.Vector3());
// camera.lookAt(mesh.position);

//update controls on each frame when using damping
controls.update();

//orbit controls


    //render
    renderer.render(scene, camera);

    //call tick again on the next frame
    window.requestAnimationFrame(tick);
}
tick();