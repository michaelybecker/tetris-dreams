'use strict';
$(function() {




    Physijs.scripts.worker = "./js/physijs_worker.js";
    Physijs.scripts.ammo = "./ammo.js";


    //leapmotion

    // var controller = new Leap.Controller().use('riggedHand').connect();

    var init, render, renderer, scene, camera, box;
    var lights;
    var brick1, brick1loader, brick2, brick2loader, brick3, brick3loader, brick4, brick4loader, brick5, brick5loader;
    var sphere, plane;
    var clock;
    var FPC, controls;
    var composer, bloom, bokeh, glitch;
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    var width = window.innerWidth,
        height = window.innerHeight;
    var controlsEnabled = false;

    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;
    var canJump = false;

    var prevTime = performance.now();
    var velocity = new THREE.Vector3();

    var multiplier = 200;

    var freezeArray = [];




    var times = 0;
    var maxTimes = 50;
    var dropInterval = 1000;

    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    if (havePointerLock) {

        var element = document.body;

        var pointerlockchange = function(event) {

            if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {

                controlsEnabled = true;
                controls.enabled = true;


            } else {

                controls.enabled = false;


                // instructions.style.display = '';

            }

        };

        var pointerlockerror = function(event) {

            // instructions.style.display = '';

        };

        // Hook pointer lock state change events
        document.addEventListener('pointerlockchange', pointerlockchange, false);
        document.addEventListener('mozpointerlockchange', pointerlockchange, false);
        document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

        document.addEventListener('pointerlockerror', pointerlockerror, false);
        document.addEventListener('mozpointerlockerror', pointerlockerror, false);
        document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

        document.body.addEventListener('click', function(event) {

            // Ask the browser to lock the pointer
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

            if (/Firefox/i.test(navigator.userAgent)) {

                var fullscreenchange = function(event) {

                    if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {

                        document.removeEventListener('fullscreenchange', fullscreenchange);
                        document.removeEventListener('mozfullscreenchange', fullscreenchange);

                        element.requestPointerLock();
                    }

                };

                document.addEventListener('fullscreenchange', fullscreenchange, false);
                document.addEventListener('mozfullscreenchange', fullscreenchange, false);

                element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

                element.requestFullscreen();

            } else {

                element.requestPointerLock();

            }

        }, false);

    } else {

        document.body.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

    }



    init = function() {

        clock = new THREE.Clock();


        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xFFFFFF);
        document.body.appendChild(renderer.domElement);

        scene = new Physijs.Scene;
        scene.setGravity(new THREE.Vector3(0, -50, 0));

        camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);

        camera.position.set(0, 0, 10);

        scene.add(camera);
        controls = new THREE.PointerLockControls(camera);
        scene.add(controls.getObject());

        //set crosshair in place
        //set chair in place
        $(".chair")[0].style.top = window.innerHeight / 2 + "px";
        $(".chair")[0].style.left = window.innerWidth / 2 + "px";

        var onKeyDown = function(event) {

            switch (event.keyCode) {

                case 38: // up
                case 87: // w
                    event.preventDefault();
                    moveForward = true;
                    break;

                case 37: // left
                case 65: // a
                    moveLeft = true;
                    break;

                case 40: // down
                case 83: // s
                    moveBackward = true;
                    break;

                case 39: // right
                case 68: // d
                    moveRight = true;
                    break;

                case 32: // space
                    if (canJump === true) velocity.y += 200;
                    canJump = false;
                    break;

            }

        };

        var onKeyUp = function(event) {

            switch (event.keyCode) {

                case 38: // up
                case 87: // w
                    moveForward = false;
                    break;

                case 37: // left
                case 65: // a
                    moveLeft = false;
                    break;

                case 40: // down
                case 83: // s
                    moveBackward = false;
                    break;

                case 39: // right
                case 68: // d
                    moveRight = false;
                    break;

            }

        };

        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('keyup', onKeyUp, false);


        window.addEventListener('resize', onWindowResize, false);

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            $(".chair")[0].style.top = window.innerHeight / 2 + "px";
            $(".chair")[0].style.left = window.innerWidth / 2 + "px";
        }


        // function onMouseMove(event) {

        //     // calculate mouse position in normalized device coordinates
        //     // (-1 to +1) for both components

        //     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        //     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // }


        brick1loader = brick2loader = brick3loader = brick4loader = brick5loader = new THREE.JSONLoader();


        function b1() {
            setTimeout(function() {

                var x = Math.floor((Math.random() * multiplier) + 1);
                var y = Math.floor((Math.random() * multiplier) + 1);
                brick5loader.load("./JSON/R-shape.json", function(geometry) {

                    var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshLambertMaterial({
                        color: 0xff3300
                    }));
                    mesh.scale.set(2, 2, 2);
                    mesh.position.y = 100;
                    mesh.position.x = x;
                    mesh.position.z = y;

                    mesh.rotation.x = x;
                    mesh.rotation.y = y;
                    mesh.rotation.z = x;

                    scene.add(mesh);


                });
            }, 2000);
        }

        function b2() {
            setTimeout(function() {

                var x = Math.floor((Math.random() * multiplier) + 1);
                var y = Math.floor((Math.random() * multiplier) + 1);
                brick5loader.load("./JSON/cube.json", function(geometry) {

                    var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshLambertMaterial({
                        color: 0x000080
                    }));
                    mesh.scale.set(2, 2, 2);
                    mesh.position.y = 100;
                    mesh.position.x = x;
                    mesh.position.z = y;

                    mesh.rotation.x = x;
                    mesh.rotation.y = y;
                    mesh.rotation.z = x;

                    scene.add(mesh);


                });
            }, 2000);

        }

        function b3() {
            setTimeout(function() {

                var x = Math.floor((Math.random() * multiplier) + 1);
                var y = Math.floor((Math.random() * multiplier) + 1);
                brick5loader.load("./JSON/squiggly.json", function(geometry) {

                    var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshLambertMaterial({
                        color: 0x008080
                    }));
                    mesh.scale.set(2, 2, 2);
                    mesh.position.y = 100;
                    mesh.position.x = x;
                    mesh.position.z = y;

                    mesh.rotation.x = x;
                    mesh.rotation.y = y;
                    mesh.rotation.z = x;

                    scene.add(mesh);


                });
            }, 2000);

        }


        function b4() {
            setTimeout(function() {

                var x = Math.floor((Math.random() * multiplier) + 1);
                var y = Math.floor((Math.random() * multiplier) + 1);
                brick5loader.load("./JSON/pedestal.json", function(geometry) {

                    var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshLambertMaterial({
                        color: 0xD2691E
                    }));
                    mesh.scale.set(2, 2, 2);
                    mesh.position.y = 100;
                    mesh.position.x = x;
                    mesh.position.z = y;

                    mesh.rotation.x = x;
                    mesh.rotation.y = y;
                    mesh.rotation.z = x;
                    scene.add(mesh);


                });
            }, 2000);

        }


        function b5() {
            setTimeout(function() {

                var x = Math.floor((Math.random() * multiplier) + 1);
                var y = Math.floor((Math.random() * multiplier) + 1);
                brick5loader.load("./JSON/longline.json", function(geometry) {

                    var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshLambertMaterial({
                        color: 0x800000
                    }));
                    mesh.scale.set(2, 2, 2);
                    mesh.position.y = 100;
                    mesh.position.x = x;
                    mesh.position.z = y;

                    mesh.rotation.x = x;
                    mesh.rotation.y = y;
                    mesh.rotation.z = x;

                    scene.add(mesh);


                });
            }, 2000);

        }



        var timelyMake = setInterval(function() {

            function makeBrick(i) {

                switch (i) {
                    case 1:
                        b1();
                        break;

                    case 2:
                        b2();
                        break;

                    case 3:
                        b3();
                        break;

                    case 4:
                        b4();
                        break;

                    case 5:
                        b5();
                        break;
                }


            }

            var brickNum = Math.round(Math.random() * 5) + 1;

            // console.log(brickNum);
            if (brickNum % 3 == 0) {
                makeBrick(1);
            } else if (brickNum % 4 == 0) {
                makeBrick(2);
            } else if (brickNum % 5 == 0) {
                makeBrick(3);
            } else if (brickNum % 2 == 0) {
                makeBrick(4);
            } else {
                makeBrick(5);
            }
            times++;
            // console.log("time: " + times);
            // console.log("maxtime:" + maxTimes);
            if (times >= maxTimes) {
                clearInterval(timelyMake);
            }
        }, dropInterval);

        //checkerboard plane

        var loader = new THREE.TextureLoader();

        var planeText = loader.load("../images/checkers.gif");
        planeText.wrapS = THREE.RepeatWrapping;
        planeText.wrapt = THREE.RepeatWrapping;
        planeText.repeat.set(0.01, 0.01);
        plane = new Physijs.BoxMesh(new THREE.BoxGeometry(1000, 1, 1000), new THREE.MeshLambertMaterial({ map: planeText }), 0);
        plane.rotation.x = Math.PI;
        plane.position.set(0, -2, 0);
        plane.name = "plane";
        scene.add(plane);

        lights = new THREE.PointLight(0xFFFFFF, 1);
        lights.position.set(0, 17, 0);
        scene.add(lights);

        var light2 = new THREE.AmbientLight(0xFFFFFF, 0.5);
        scene.add(light2);

        requestAnimationFrame(render);


        //skybox
        var skyGeometry = new THREE.BoxGeometry(700, 700, 700);
        var skyArray = [];
        var loader = new THREE.TextureLoader();
        skyArray.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/sides.jpg"),
            side: THREE.BackSide
        }));
        var loader = new THREE.TextureLoader();
        skyArray.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/sides.jpg"),
            side: THREE.BackSide
        }));
        var loader = new THREE.TextureLoader();
        skyArray.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/top.jpg"),
            side: THREE.BackSide
        }));
        var loader = new THREE.TextureLoader();
        skyArray.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/bottom.jpg"),
            side: THREE.BackSide
        }));
        var loader = new THREE.TextureLoader();
        skyArray.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/sides.jpg"),
            side: THREE.BackSide
        }));
        var loader = new THREE.TextureLoader();
        skyArray.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/sides.jpg"),
            side: THREE.BackSide
        }));


        var skyMaterial = new THREE.MeshFaceMaterial(skyArray);
        var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
        skyBox.position.y = 140;
        scene.add(skyBox);


        //postprocessing

        var bokehPass = new THREE.BokehPass(scene, camera, {
            focus: 1,
            aperture: 0.09,
            maxblur: 1.4,
            width: width,
            height: height
        });

        bokehPass.renderToScreen = true;

        composer = new THREE.EffectComposer(renderer);

        // dot screen
        // var dotScreenEffect = new THREE.ShaderPass(THREE.DotScreenShader);
        // dotScreenEffect.uniforms['scale'].value = 4;
        // dotScreenEffect.renderToScreen = true;
        // composer.addPass(dotScreenEffect);


        composer.addPass(new THREE.RenderPass(scene, camera));
        composer.addPass(bokehPass);



        camera.lookAt(new THREE.Vector3(0, 100, -100));


        // window.addEventListener('mousemove', onMouseMove, false);


        //helper plane for dragging
        // var helplane = new THREE.Mesh(
        //     new THREE.PlaneBufferGeometry(2000, 2000, 8, 8),
        //     new THREE.MeshBasicMaterial({ visible: true })
        // );
        // scene.add(helplane);

        //click raycasting
        document.addEventListener('mousedown', function() {

            var mouse = new THREE.Vector2();
            mouse.x = 0.0;
            mouse.y = 0.0;
            // console.log(mouse.x, mouse.y);
            // update the picking ray with the camera and mouse position
            raycaster.setFromCamera(mouse, camera);
            // calculate objects intersecting the picking ray
            var intersects = raycaster.intersectObjects(scene.children);
            for (var i = 0; i < intersects.length; i++) {

                if (intersects[i].object.name != "plane") {

                    intersects[i].object.material.color.set(0x00ff00);
                    // scene.remove(intersects[i].object);
                    freezeArray.push(intersects[i].object);


                }




            }

            console.log(controls.getObject().position);
        }, false);

        //end init
    };



    render = function() {
        // FPC.update(clock.getDelta());


        if (controlsEnabled) {

            var time = performance.now();
            var delta = (time - prevTime) / 500;

            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;

            velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

            if (moveForward) velocity.z -= 400.0 * delta;
            if (moveBackward) velocity.z += 400.0 * delta;

            if (moveLeft) velocity.x -= 400.0 * delta;
            if (moveRight) velocity.x += 400.0 * delta;

            // if (isOnObject === true) {
            //     velocity.y = Math.max(0, velocity.y);

            //     canJump = true;
            // }

            controls.getObject().translateX(velocity.x * delta);
            controls.getObject().translateY(velocity.y * delta);
            controls.getObject().translateZ(velocity.z * delta);

            if (controls.getObject().position.y < 10) {

                velocity.y = 0;
                controls.getObject().position.y = 10;

                // canJump = false;

            }

            prevTime = time;

        }

        if (freezeArray.length > 0) {
            freezeArray.forEach(function(i){

                i.setLinearVelocity(new THREE.Vector3(0, 0, 0));
                i.setAngularVelocity(new THREE.Vector3(0, 0, 0));
                i.__dirtyPosition = true;
                i.__dirtyRotation = true;
            });
        }
        requestAnimationFrame(render);
        scene.simulate();
        composer.render();
        // renderer.render(scene, camera);

    };

    init();




});
