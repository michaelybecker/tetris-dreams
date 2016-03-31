"use strict";$(function(){Physijs.scripts.worker="./js/physijs_worker.js",Physijs.scripts.ammo="./ammo.js";var e,t,n,o,a,i,r,s,c,d,l,m,u,E,h,p,w,M,T,k,f,R,g,H,v,b,L=window.innerWidth,y=window.innerHeight,x=!1,j=!1,P=!1,z=!1,B=!1,S=!1,q=performance.now(),F=new THREE.Vector3,O=200,I=0,C=100,W=500,U="pointerLockElement"in document||"mozPointerLockElement"in document||"webkitPointerLockElement"in document;if(U){var A=document.body,J=function(e){document.pointerLockElement===A||document.mozPointerLockElement===A||document.webkitPointerLockElement===A?(x=!0,R.enabled=!0):R.enabled=!1},N=function(e){};document.addEventListener("pointerlockchange",J,!1),document.addEventListener("mozpointerlockchange",J,!1),document.addEventListener("webkitpointerlockchange",J,!1),document.addEventListener("pointerlockerror",N,!1),document.addEventListener("mozpointerlockerror",N,!1),document.addEventListener("webkitpointerlockerror",N,!1),document.body.addEventListener("click",function(e){if(A.requestPointerLock=A.requestPointerLock||A.mozRequestPointerLock||A.webkitRequestPointerLock,/Firefox/i.test(navigator.userAgent)){var t=function(e){(document.fullscreenElement===A||document.mozFullscreenElement===A||document.mozFullScreenElement===A)&&(document.removeEventListener("fullscreenchange",t),document.removeEventListener("mozfullscreenchange",t),A.requestPointerLock())};document.addEventListener("fullscreenchange",t,!1),document.addEventListener("mozfullscreenchange",t,!1),A.requestFullscreen=A.requestFullscreen||A.mozRequestFullscreen||A.mozRequestFullScreen||A.webkitRequestFullscreen,A.requestFullscreen()}else A.requestPointerLock()},!1)}else document.body.innerHTML="Your browser doesn't seem to support Pointer Lock API";e=function(){function e(){a.aspect=window.innerWidth/window.innerHeight,a.updateProjectionMatrix(),n.setSize(window.innerWidth,window.innerHeight)}function i(){setTimeout(function(){var e=Math.floor(Math.random()*O+1),t=Math.floor(Math.random()*O+1);w.load("./JSON/R-shape.json",function(n){var a=new Physijs.BoxMesh(n,new THREE.MeshLambertMaterial({color:13882323}));a.scale.set(2,2,2),a.position.y=100,a.position.x=e,a.position.z=t,a.rotation.x=e,a.rotation.y=t,a.rotation.z=e,o.add(a)})},2e3)}function s(){setTimeout(function(){var e=Math.floor(Math.random()*O+1),t=Math.floor(Math.random()*O+1);w.load("./JSON/cube.json",function(n){var a=new Physijs.BoxMesh(n,new THREE.MeshLambertMaterial({color:128}));a.scale.set(2,2,2),a.position.y=100,a.position.x=e,a.position.z=t,a.rotation.x=e,a.rotation.y=t,a.rotation.z=e,o.add(a)})},2e3)}function d(){setTimeout(function(){var e=Math.floor(Math.random()*O+1),t=Math.floor(Math.random()*O+1);w.load("./JSON/squiggly.json",function(n){var a=new Physijs.BoxMesh(n,new THREE.MeshLambertMaterial({color:32896}));a.scale.set(2,2,2),a.position.y=100,a.position.x=e,a.position.z=t,a.rotation.x=e,a.rotation.y=t,a.rotation.z=e,o.add(a)})},2e3)}function m(){setTimeout(function(){var e=Math.floor(Math.random()*O+1),t=Math.floor(Math.random()*O+1);w.load("./JSON/pedestal.json",function(n){var a=new Physijs.BoxMesh(n,new THREE.MeshLambertMaterial({color:13789470}));a.scale.set(2,2,2),a.position.y=100,a.position.x=e,a.position.z=t,a.rotation.x=e,a.rotation.y=t,a.rotation.z=e,o.add(a)})},2e3)}function E(){setTimeout(function(){var e=Math.floor(Math.random()*O+1),t=Math.floor(Math.random()*O+1);w.load("./JSON/longline.json",function(n){var a=new Physijs.BoxMesh(n,new THREE.MeshLambertMaterial({color:8388608}));a.scale.set(2,2,2),a.position.y=100,a.position.x=e,a.position.z=t,a.rotation.x=e,a.rotation.y=t,a.rotation.z=e,o.add(a)})},2e3)}k=new THREE.Clock,n=new THREE.WebGLRenderer({antialias:!0}),n.setSize(window.innerWidth,window.innerHeight),n.setClearColor(16777215),document.body.appendChild(n.domElement),o=new Physijs.Scene,a=new THREE.PerspectiveCamera(35,window.innerWidth/window.innerHeight,1,1e3),a.position.set(10,0,1),a.lookAt(o.position),o.add(a),R=new THREE.PointerLockControls(a),o.add(R.getObject());var p=function(e){switch(e.keyCode){case 38:case 87:e.preventDefault(),j=!0;break;case 37:case 65:z=!0;break;case 40:case 83:P=!0;break;case 39:case 68:B=!0;break;case 32:S===!0&&(F.y+=200),S=!1}},M=function(e){switch(e.keyCode){case 38:case 87:j=!1;break;case 37:case 65:z=!1;break;case 40:case 83:P=!1;break;case 39:case 68:B=!1}};document.addEventListener("keydown",p,!1),document.addEventListener("keyup",M,!1),window.addEventListener("resize",e,!1),c=l=u=h=w=new THREE.JSONLoader;var f=setInterval(function(){function e(e){switch(e){case 1:i();break;case 2:s();break;case 3:d();break;case 4:m();break;case 5:E()}}var t=Math.round(5*Math.random())+1;e(t%3==0?1:t%4==0?2:t%5==0?3:t%2==0?4:5),I++,I>=C&&clearInterval(f)},W),H=new THREE.ImageUtils.loadTexture("../images/checkers.gif");H.wrapS=THREE.RepeatWrapping,H.wrapt=THREE.RepeatWrapping,H.repeat.set(.01,.01),T=new Physijs.BoxMesh(new THREE.BoxGeometry(1e3,1,1e3),new THREE.MeshLambertMaterial({map:H}),0),T.rotation.x=Math.PI,T.position.set(0,-2,0),o.add(T),r=new THREE.PointLight(16777215,1),r.position.set(0,17,0),o.add(r);var v=new THREE.AmbientLight(16777215,.5);o.add(v),requestAnimationFrame(t);var b=new THREE.BoxGeometry(700,700,700),x=[];x.push(new THREE.MeshBasicMaterial({map:THREE.ImageUtils.loadTexture("../images/sides.jpg"),side:THREE.BackSide})),x.push(new THREE.MeshBasicMaterial({map:THREE.ImageUtils.loadTexture("../images/sides.jpg"),side:THREE.BackSide})),x.push(new THREE.MeshBasicMaterial({map:THREE.ImageUtils.loadTexture("../images/top.jpg"),side:THREE.BackSide})),x.push(new THREE.MeshBasicMaterial({map:THREE.ImageUtils.loadTexture("../images/bottom.jpg"),side:THREE.BackSide})),x.push(new THREE.MeshBasicMaterial({map:THREE.ImageUtils.loadTexture("../images/sides.jpg"),side:THREE.BackSide})),x.push(new THREE.MeshBasicMaterial({map:THREE.ImageUtils.loadTexture("../images/sides.jpg"),side:THREE.BackSide}));var q=new THREE.MeshFaceMaterial(x),U=new THREE.Mesh(b,q);U.position.y=340,o.add(U);var A=new THREE.BokehPass(o,a,{focus:1,aperture:.09,maxblur:1.4,width:L,height:y});A.renderToScreen=!0,g=new THREE.EffectComposer(n),g.addPass(new THREE.RenderPass(o,a)),g.addPass(A)},t=function(){if(x){var e=performance.now(),n=(e-q)/1e3;F.x-=10*F.x*n,F.z-=10*F.z*n,F.y-=9.8*100*n,j&&(F.z-=400*n),P&&(F.z+=400*n),z&&(F.x-=400*n),B&&(F.x+=400*n),R.getObject().translateX(F.x*n),R.getObject().translateY(F.y*n),R.getObject().translateZ(F.z*n),R.getObject().position.y<10&&(F.y=0,R.getObject().position.y=10,S=!0),q=e}o.simulate(),requestAnimationFrame(t),g.render()},e()});