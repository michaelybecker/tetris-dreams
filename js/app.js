'use strict';
$(function(){

Physijs.scripts.worker = "./js/physijs_worker.js";
Physijs.scripts.ammo = "./ammo.js";

var init, render, renderer, scene, camera, box;
var lights;
var sphere, plane;

init = function() {
  renderer = new THREE.WebGLRenderer( {antialias: true} );
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xFFFFFF);
  document.body.appendChild(renderer.domElement);

  scene = new Physijs.Scene;

  camera = new THREE.PerspectiveCamera (35, window.innerWidth / window.innerHeight, 1, 1000);

  camera.position.set(60,50,60);
  camera.lookAt(scene.position);
  scene.add(camera);

  //box
  box = new Physijs.BoxMesh(new THREE.CubeGeometry( 5,5,5), new THREE.MeshPhongMaterial( {color: 0x888888}));

scene.add(box);

sphere = new Physijs.SphereMesh(new THREE.SphereGeometry(3,15,15), new THREE.MeshPhongMaterial({color: 0x553246}));
sphere.position.set(3,13,0);
scene.add(sphere);

plane = new Physijs.BoxMesh(new THREE.BoxGeometry(40,1,40), new THREE.MeshBasicMaterial( {color: 0x884432}), 0);
plane.rotation.x = Math.PI;
plane.position.set(0,-10,0);
scene.add(plane);

lights = new THREE.PointLight( 0xFFFFFF, 1 );
lights.position.set(0,17,0);
scene.add(lights);


requestAnimationFrame(render);

};


render = function() {
  scene.simulate();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

init();




});
