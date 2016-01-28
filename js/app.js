'use strict';
$(function() {

    Physijs.scripts.worker = "./js/physijs_worker.js";
    Physijs.scripts.ammo = "./ammo.js";

    var init, render, renderer, scene, camera, box;
    var lights;
    var brick1, brick1loader, brick2, brick2loader, brick3, brick3loader, brick4, brick4loader;
    var sphere, plane;
    var clock;
    var FPC, controls;


    var controlsEnabled = false;

    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;
    var canJump = false;

    var prevTime = performance.now();
    var velocity = new THREE.Vector3();





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

            // instructions.style.display = 'none';

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

        camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);

        camera.position.set(10, 0, 1);
        camera.lookAt(scene.position);
        scene.add(camera);

        controls = new THREE.PointerLockControls(camera);
        scene.add(controls.getObject());

        var onKeyDown = function(event) {

            switch (event.keyCode) {

                case 38: // up
                case 87: // w
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
                    if (canJump === true) velocity.y += 350;
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


        //box
        box = new Physijs.BoxMesh(new THREE.CubeGeometry(5, 5, 5), new THREE.MeshPhongMaterial({
            color: 0x888888
        }));
        scene.add(box);

        //sphere
        sphere = new Physijs.SphereMesh(new THREE.SphereGeometry(3, 15, 15), new THREE.MeshPhongMaterial({
            color: 0x553246
        }));
        sphere.position.set(3, 13, 0);
        scene.add(sphere);

        //r-shape brick

        brick1loader = brick2loader = brick3loader = brick4loader = new THREE.JSONLoader();


        brick1loader.load("./JSON/R-shape.json", function(geometry) {

            var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshNormalMaterial());
            // mesh.scale.set(5,5,5);
            mesh.position.y = 20;

            scene.add(mesh);


        });

        brick2loader.load("./JSON/cube.json", function(geometry) {

            var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshNormalMaterial());
            // mesh.scale.set(5,5,5);
            mesh.position.y = 20;
            mesh.position.x = 30;

            scene.add(mesh);


        });

        brick2loader.load("./JSON/cube.json", function(geometry) {

            var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshNormalMaterial());
            // mesh.scale.set(5,5,5);
            mesh.position.y = 20;
            mesh.position.x = -20;

            scene.add(mesh);


        });


        plane = new Physijs.BoxMesh(new THREE.BoxGeometry(700, 1, 700), new THREE.MeshBasicMaterial({
            color: 0x884432
        }), 0);
        plane.rotation.x = Math.PI;
        plane.position.set(0, -2, 0);
        scene.add(plane);

        lights = new THREE.PointLight(0xFFFFFF, 1);
        lights.position.set(0, 17, 0);
        scene.add(lights);


        requestAnimationFrame(render);

    };


    render = function() {
        // FPC.update(clock.getDelta());
        if (controlsEnabled) {

            var time = performance.now();
            var delta = (time - prevTime) / 1000;

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

                canJump = true;

            }

            prevTime = time;

        }



        scene.simulate();

        renderer.render(scene, camera);
        requestAnimationFrame(render);

    };

    init();




});
