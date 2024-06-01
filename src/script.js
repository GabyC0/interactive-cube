import * as THREE from 'three'
import { js } from 'three/examples/jsm/nodes/Nodes.js';
import gsap from 'gsap';

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

const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe:true })
)
scene.add(mesh);

// Sizes
const sizes = {
    width: 800,
    height: 600
}

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
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera);

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
camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3; 
camera.position.y = cursor.y * 10;
// camera.lookAt(new THREE.Vector3());
camera.lookAt(mesh.position);

    //render
    renderer.render(scene, camera);

    //call tick again on the next frame
    window.requestAnimationFrame(tick);
}
tick();