//to do
// dont forget musak


'use strict';
$(function() {




    // physica
    Physijs.scripts.worker = "./js/physijs_worker.js";
    Physijs.scripts.ammo = "./ammo.js";

    var init, render, renderer, scene, camera, box;
    var lights;
    var brick1, brick1loader, brick2, brick2loader, brick3, brick3loader, brick4, brick4loader, brick5, brick5loader;
    var sphere, plane;
    var particleGroup, emitter;
    var clock;
    var FPC, controls;
    var composer, bokeh;
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    var width = window.innerWidth,
        height = window.innerHeight;

    var hits = 0;
    var level = 1;
    // ef pee es
    var controlsEnabled = false;
    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;
    var canJump = false;
    var prevTime = performance.now();
    var velocity = new THREE.Vector3();
    var listener = new THREE.AudioListener();
    var n1, n2, n3, n4, n5, n6, n7, n8;
    var bgAud, bgAud2;
    var gravity = -20;
    var multiplier = 100;
    var fadeTime = 8;
    var randomSign = (Math.round(Math.random()) * 2 - 1);
    var crashToll = 0;
    var crashedArr = [];
    var freezeArray = [];




    var times = 0;
    var maxTimes = 500;
    var dropInterval = 3000;

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



    //audio

    var notesArr = [
        "../audio/1.ogg",
        "../audio/2.ogg",
        "../audio/3.ogg",
        "../audio/4.ogg",
        "../audio/5.ogg",
        "../audio/6.ogg",
        "../audio/7.ogg",
        "../audio/8.ogg",
    ]

    init = function() {



        clock = new THREE.Clock();
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000);
        document.body.appendChild(renderer.domElement);

        scene = new Physijs.Scene;
        scene.setGravity(new THREE.Vector3(0, gravity, 0));


        bgAud = new Audio('../audio/bg.ogg');
        bgAud.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
            this.volume = 0.3;
        }, false);
        bgAud.play();
        bgAud2 = new Audio('../audio/shepard.ogg');
        bgAud2.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
            this.volume = 0.05;
        }, false);
        bgAud2.currentTime = 70;
        bgAud2.play();

        camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);

        camera.position.set(0, 0, 10);

        scene.add(camera);



        //add audiolistener
        camera.add(listener);

        //fog
        var fog = new THREE.Fog(0xffffff, 1, 1000);

        // scene.add(fog);
        

        controls = new THREE.PointerLockControls(camera);
        scene.add(controls.getObject());


        // crosshair
        var chair = document.createElement("img");
        chair.src = "../images/crosshair.png";
        chair.class = "chair";
        chair.style.position = "absolute";
        document.body.appendChild(chair);

        chair.style.top = window.innerHeight / 2 + "px";
        chair.style.left = window.innerWidth / 2 + "px";

        // hit counter

        var hitCounter = document.createElement("div");
        hitCounter.class = "hitcounter";
        hitCounter.style.position = "absolute";
        hitCounter.style.top = window.innerHeight - 50 + "px";
        hitCounter.style.left = window.innerWidth / 2 + "px";
        hitCounter.style.color = "#fff";
        hitCounter.style.fontFamily = "Raleway";
        hitCounter.style.fontWeight = "100";
        hitCounter.style.fontSize = "2rem";
        document.body.appendChild(hitCounter);
        $(hitCounter).text(hits);
        hitCounter.style.display = "none";


        // level counter
        var levelCounter = document.createElement("div");
        levelCounter.class = "levelcounter";
        levelCounter.style.position = "absolute";
        levelCounter.style.top = window.innerHeight / 2 + "px";
        levelCounter.style.left = window.innerWidth / 2 + "px";
        levelCounter.style.color = "#fff";
        levelCounter.style.width = window.innerWidth / 3 + "px";
        levelCounter.style.height = window.innerHeight / 3 + "px";
        levelCounter.style.marginLeft = (-1 * window.innerWidth / 6) + "px";
        levelCounter.style.marginTop = (-1 * window.innerHeight / 1.4) + "px";

        levelCounter.style.fontFamily = "Raleway";
        levelCounter.style.fontWeight = "100";
        levelCounter.style.fontSize = "40rem";
        levelCounter.style.textAlign = "center";
        levelCounter.style.color = "#333";
        document.body.appendChild(levelCounter);
        $(levelCounter).text(level);
        $(levelCounter).hide();

        function displayLevel(level) {
            // $(levelCounter).style.display = "inline";
            $(levelCounter).text(level);

            $(levelCounter).fadeIn(3000);
            $(levelCounter).fadeOut(1500);
            // $(levelCounter).style.display = "none";
        }


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
            chair.style.top = window.innerHeight / 2 + "px";
            chair.style.left = window.innerWidth / 2 + "px";
            hitCounter.style.top = window.innerHeight - 50 + "px";
            hitCounter.style.left = window.innerWidth / 2 + "px";
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



                var x = randomSign * Math.floor((Math.random() * multiplier) + 1);
                var y = randomSign * Math.floor((Math.random() * multiplier) + 1);
                var audioLoader = new THREE.Audio(listener);
                audioLoader.setRefDistance(30);
                audioLoader.autoplay = true;
                brick5loader.load("./JSON/R-shape.json", function(geometry) {

                    var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshPhongMaterial({
                        color: 0x009900,
                        wireframe: false
                    }));
                    mesh.scale.set(2, 2, 2);
                    mesh.position.y = 100;
                    mesh.position.x = x;
                    mesh.position.z = y;

                    mesh.rotation.x = x;
                    mesh.rotation.y = y;
                    mesh.rotation.z = x;
                    mesh.add(audioLoader);
                    audioLoader.load(notesArr[Math.floor((Math.random() * 7))]);
                    mesh.name = "brick";
                    scene.add(mesh);


                });
            }, 2000);
        }

        function b2() {
            setTimeout(function() {

                var x = randomSign * Math.floor((Math.random() * multiplier) + 1);
                var y = randomSign * Math.floor((Math.random() * multiplier) + 1);
                var audioLoader = new THREE.Audio(listener);
                audioLoader.setRefDistance(30);
                audioLoader.autoplay = true;
                brick5loader.load("./JSON/cube.json", function(geometry) {

                    var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshPhongMaterial({
                        color: 0x000080,
                        wireframe: false
                    }));
                    mesh.scale.set(2, 2, 2);
                    mesh.position.y = 100;
                    mesh.position.x = x;
                    mesh.position.z = y;

                    mesh.rotation.x = x;
                    mesh.rotation.y = y;
                    mesh.rotation.z = x;
                    mesh.name = "brick";

                    audioLoader.load(notesArr[Math.floor((Math.random() * 7))]);
                    scene.add(mesh);


                });
            }, 2000);

        }

        function b3() {
            setTimeout(function() {

                var x = randomSign * Math.floor((Math.random() * multiplier) + 1);
                var y = randomSign * Math.floor((Math.random() * multiplier) + 1);
                var audioLoader = new THREE.Audio(listener);
                audioLoader.setRefDistance(30);
                audioLoader.autoplay = true;
                brick5loader.load("./JSON/squiggly.json", function(geometry) {

                    var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshPhongMaterial({
                        color: 0x008080,
                        wireframe: false
                    }));
                    mesh.scale.set(2, 2, 2);
                    mesh.position.y = 100;
                    mesh.position.x = x;
                    mesh.position.z = y;

                    mesh.rotation.x = x;
                    mesh.rotation.y = y;
                    mesh.rotation.z = x;
                    mesh.name = "brick";

                    audioLoader.load(notesArr[Math.floor((Math.random() * 7))]);
                    scene.add(mesh);


                });
            }, 2000);

        }


        function b4() {
            setTimeout(function() {

                var x = randomSign * Math.floor((Math.random() * multiplier) + 1);
                var y = randomSign * Math.floor((Math.random() * multiplier) + 1);
                var audioLoader = new THREE.Audio(listener);
                audioLoader.setRefDistance(30);
                audioLoader.autoplay = true;
                brick5loader.load("./JSON/pedestal.json", function(geometry) {

                    var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshPhongMaterial({
                        color: 0xD2691E,
                        wireframe: false
                    }));
                    mesh.scale.set(2, 2, 2);
                    mesh.position.y = 100;
                    mesh.position.x = x;
                    mesh.position.z = y;

                    mesh.rotation.x = x;
                    mesh.rotation.y = y;
                    mesh.rotation.z = x;
                    mesh.name = "brick";

                    audioLoader.load(notesArr[Math.floor((Math.random() * 7))]);
                    scene.add(mesh);


                });
            }, 2000);

        }


        function b5() {
            setTimeout(function() {

                var x = randomSign * Math.floor((Math.random() * multiplier) + 1);
                var y = randomSign * Math.floor((Math.random() * multiplier) + 1);
                var audioLoader = new THREE.Audio(listener);
                audioLoader.setRefDistance(30);
                audioLoader.autoplay = true;
                brick5loader.load("./JSON/longline.json", function(geometry) {

                    var mesh = new Physijs.BoxMesh(geometry, new THREE.MeshPhongMaterial({
                        color: 0x800000,
                        wireframe: false
                    }));
                    mesh.scale.set(2, 2, 2);
                    mesh.position.y = 100;
                    mesh.position.x = x;
                    mesh.position.z = y;

                    mesh.rotation.x = x;
                    mesh.rotation.y = y;
                    mesh.rotation.z = x;
                    mesh.name = "brick";

                    audioLoader.load(notesArr[Math.floor((Math.random() * 7))]);
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

        // var loader = new THREE.TextureLoader();

        // var planeText = loader.load("../images/checkers.gif");
        // planeText.wrapS = THREE.RepeatWrapping;
        // planeText.wrapt = THREE.RepeatWrapping;
        // planeText.repeat.set(0.01, 0.01);
        var original = 0x111111;
        plane = new Physijs.CylinderMesh(new THREE.CylinderGeometry(500, 500, 5, 34), new THREE.MeshLambertMaterial({ color: original }), 0);

        plane.rotation.x = Math.PI;
        plane.position.set(0, 0, 0);
        plane.name = "plane";
        plane.addEventListener('collision', function(other_object) {


            if (!other_object.dead) {
                other_object.dead = true;
                crashedArr.push(other_object);
                crashToll++

            }

            if (crashToll > 10) {
                console.log("death");
                // $(document).fadeOut();
            }

        });
        scene.add(plane);

        lights = new THREE.PointLight(0xffffff, 1);
        lights.position.set(0, 200, 0);
        scene.add(lights);

        // var light2 = new THREE.AmbientLight(0xFFdddd, 0.2);
        // scene.add(light2);

        requestAnimationFrame(render);


        // -----SKYBOXES----

        //skybox1
        var skyGeometry = new THREE.BoxGeometry(700, 700, 700);
        var skyArray = [];
        var loader = new THREE.TextureLoader();
        skyArray.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/sides1.jpg"),
            side: THREE.DoubleSide,
            transparent: true,
            needsUpdate: true
                // color: 0xff00ff
        }));
        var loader = new THREE.TextureLoader();
        skyArray.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/sides1.jpg"),
            side: THREE.DoubleSide,
            transparent: true,
            needsUpdate: true
                // opacity:0.1
                // color: 0xff00ff
        }));
        var loader = new THREE.TextureLoader();
        skyArray.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/top1.jpg"),
            side: THREE.DoubleSide,
            transparent: true,
            needsUpdate: true

            // color: 0xff00ff
        }));
        var loader = new THREE.TextureLoader();
        skyArray.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/bottom1.jpg"),
            side: THREE.DoubleSide,
            transparent: true,
            needsUpdate: true
                // color: 0xff00ff
        }));
        var loader = new THREE.TextureLoader();
        skyArray.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/sides1.jpg"),
            side: THREE.DoubleSide,
            transparent: true,
            needsUpdate: true
                // color: 0xff00ff
        }));
        var loader = new THREE.TextureLoader();
        skyArray.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/sides1.jpg"),
            side: THREE.DoubleSide,
            transparent: true,
            needsUpdate: true
                // color: 0xff00ff
        }));


        var skyMaterial = new THREE.MeshFaceMaterial(skyArray);
        // SkyMaterial.transparent = true;
        // console.log(skyMaterial);
        var skyBox1 = new THREE.Mesh(skyGeometry, skyMaterial);
        skyBox1.position.y = 250;
        scene.add(skyBox1);


        //skybox2
        var skyGeometry2 = new THREE.BoxGeometry(740, 740, 740);
        var skyArray2 = [];
        var loader = new THREE.TextureLoader();
        skyArray2.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/sides2.jpg"),
            side: THREE.BackSide,
            transparent: true,
            opacity: 0
        }));
        var loader = new THREE.TextureLoader();
        skyArray2.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/sides2.jpg"),
            side: THREE.BackSide,
            transparent: true,
            opacity: 0
        }));
        var loader = new THREE.TextureLoader();
        skyArray2.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/top2.jpg"),
            side: THREE.BackSide,
            transparent: true,
            opacity: 0
        }));
        var loader = new THREE.TextureLoader();
        skyArray2.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/bottom2.jpg"),
            side: THREE.BackSide,
            transparent: true,
            opacity: 0
        }));
        var loader = new THREE.TextureLoader();
        skyArray2.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/sides2.jpg"),
            side: THREE.BackSide,
            transparent: true,
            opacity: 0
        }));
        var loader = new THREE.TextureLoader();
        skyArray2.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/sides2.jpg"),
            side: THREE.BackSide,
            transparent: true,
            opacity: 0
        }));


        var skyMaterial2 = new THREE.MeshFaceMaterial(skyArray2);
        var skyBox2 = new THREE.Mesh(skyGeometry2, skyMaterial2);
        skyBox2.position.y = 245;
        scene.add(skyBox2);


        //skybox3
        var skyGeometry3 = new THREE.BoxGeometry(720, 720, 720);
        var skyArray3 = [];
        var loader = new THREE.TextureLoader();
        skyArray3.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/sides3.jpg"),
            side: THREE.BackSide,
            transparent: true,
            opacity: 0
        }));
        var loader = new THREE.TextureLoader();
        skyArray3.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/sides3.jpg"),
            side: THREE.BackSide,
            transparent: true,
            opacity: 0
        }));
        var loader = new THREE.TextureLoader();
        skyArray3.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/top3.jpg"),
            side: THREE.BackSide,
            transparent: true,
            opacity: 0
        }));
        var loader = new THREE.TextureLoader();
        skyArray3.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/bottom3.jpg"),
            side: THREE.BackSide,
            transparent: true,
            opacity: 0
        }));
        var loader = new THREE.TextureLoader();
        skyArray3.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/sides3.jpg"),
            side: THREE.BackSide,
            transparent: true,
            opacity: 0
        }));
        var loader = new THREE.TextureLoader();
        skyArray3.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/sides3.jpg"),
            side: THREE.BackSide,
            transparent: true,
            opacity: 0
        }));


        var skyMaterial3 = new THREE.MeshFaceMaterial(skyArray3);
        var skyBox3 = new THREE.Mesh(skyGeometry3, skyMaterial3);
        skyBox3.position.y = 245;
        scene.add(skyBox3);

        //skybox4
        var skyGeometry4 = new THREE.BoxGeometry(760, 760, 760);
        var skyArray4 = [];
        var loader = new THREE.TextureLoader();
        skyArray4.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/sides4.jpg"),
            side: THREE.BackSide,
            transparent: true,
            opacity: 0
        }));
        var loader = new THREE.TextureLoader();
        skyArray4.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/sides4.jpg"),
            side: THREE.BackSide,
            transparent: true,
            opacity: 0
        }));
        var loader = new THREE.TextureLoader();
        skyArray4.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/top4.jpg"),
            side: THREE.BackSide,
            transparent: true,
            opacity: 0
        }));
        var loader = new THREE.TextureLoader();
        skyArray4.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/bottom4.jpg"),
            side: THREE.BackSide,
            transparent: true,
            opacity: 0
        }));
        var loader = new THREE.TextureLoader();
        skyArray4.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/sides4.jpg"),
            side: THREE.BackSide,
            transparent: true,
            opacity: 0
        }));
        var loader = new THREE.TextureLoader();
        skyArray4.push(new THREE.MeshBasicMaterial({
            map: loader.load("../images/sides4.jpg"),
            side: THREE.BackSide,
            transparent: true,
            opacity: 0
        }));


        var skyMaterial4 = new THREE.MeshFaceMaterial(skyArray4);
        var skyBox4 = new THREE.Mesh(skyGeometry4, skyMaterial4);
        skyBox4.position.y = 245;
        scene.add(skyBox4);

        // particle party
        // Create particle group and emitter
        function initParticles() {
            var loader = new THREE.TextureLoader();
            particleGroup = new SPE.Group({
                texture: {
                    value: loader.load('../images/star1.png')
                },
                fog: false,
                maxParticleCount: 30000
            });

            emitter = new SPE.Emitter({
                type: SPE.distributions.SPHERE,
                maxAge: 4,
                position: {
                    value: new THREE.Vector3(0, 100, 0),
                    spread: new THREE.Vector3(1000, 30, 1000)
                },
                opacity: [0.9],
                size: { value: [0, 1, 0] },
                // wiggle: {spread:20},
                // rotation: {axis:new THREE.Vector3(1, 0, 0)},
                particleCount: 30000,
                isStatic: false
            });

            particleGroup.addEmitter(emitter);
            scene.add(particleGroup.mesh);
        }

        initParticles();

        //postprocessing

        var bokehPass = new THREE.BokehPass(scene, camera, {
            focus: 1,
            aperture: 0.06,
            maxblur: 1.05,
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



        camera.lookAt(new THREE.Vector3(0, 20, -100));


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

                if (intersects[i].object.name != "plane" && intersects[i].object.type != "Points" && !intersects[i].object.dead) {
                    // intersects[i].object.material.color.set(0x00ff00);

                    intersects[i].object.material.wireframe = true;
                    // intersects[i].object.material.transparent = true;
                    intersects[i].object.dead = true;

                    freezeArray.push(intersects[i].object);


                    hits++;
                    $(hitCounter).text(hits);
                }

                //victoree
                if (hits >= level * 10) {
                    dropInterval -= level * 400;
                    multiplier += level * 30;
                    gravity -= 30;
                    scene.setGravity(new THREE.Vector3(0, gravity, 0));
                    console.log("next up! Level " + level + ", dropInterval: " + dropInterval, "dropRadius: " + multiplier + ", gravity: " + gravity);
                    crashToll = 0;
                    console.log(crashedArr);
                    for (var i = 0; i < crashedArr.length; i++) {
                        console.log(crashedArr[i]);
                        scene.remove(crashedArr[i]);

                        // scene.remove(crashedArr[i]);
                    }
                    switch (level) {
                        case 1:
                            for (var i = 0; i < skyBox1.material.materials.length; i++) {
                                TweenLite.to(skyBox1.material.materials[i], 5, { opacity: 0, onComplete: fadeBox });
                            }

                            function fadeBox() {

                                console.log(level);


                                scene.remove(skyBox1);
                                for (var i = 0; i < skyBox3.material.materials.length; i++) {
                                    TweenLite.to(skyBox3.material.materials[i], 3, { opacity: 1 });
                                }
                            }
                            break;
                        case 2:
                            for (var i = 0; i < skyBox3.material.materials.length; i++) {
                                TweenLite.to(skyBox3.material.materials[i], 5, { opacity: 0, onComplete: fadeBox2 });
                            }

                            function fadeBox2() {

                                console.log(level);


                                scene.remove(skyBox3);
                                for (var i = 0; i < skyBox2.material.materials.length; i++) {
                                    TweenLite.to(skyBox2.material.materials[i], 3, { opacity: 1 });
                                }
                            }

                            break;
                        case 3:
                            for (var i = 0; i < skyBox2.material.materials.length; i++) {
                                TweenLite.to(skyBox2.material.materials[i], 5, { opacity: 0, onComplete: fadeBox3 });
                            }

                            function fadeBox3() {

                                console.log(level);


                                scene.remove(skyBox2);
                                for (var i = 0; i < skyBox4.material.materials.length; i++) {
                                    TweenLite.to(skyBox4.material.materials[i], 3, { opacity: 1 });
                                }
                            }

                            break;
                        default:
                            break;
                    }
                    level++;
                    displayLevel(level);
                }






            }

            // console.log(controls.getObject().position);
        }, false);



        displayLevel(level);


        //end init
    };


    // bad, nasty error bandaid

    window.onerror = function() {
        return true;
    };

    render = function() {
        // FPC.update(clock.getDelta());

        particleGroup.tick(clock.getDelta());

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
            freezeArray.forEach(function(i) {

                i.__dirtyPosition = true;
                i.__dirtyRotation = true;
                i.setLinearVelocity(new THREE.Vector3(0, 0, 0));
                i.setAngularVelocity(new THREE.Vector3(0, 0, 0));

                i.material.opacity = 0.5;
            });
        }

        requestAnimationFrame(render);
        scene.simulate();
        // composer.render();
        renderer.render(scene, camera);

    };

    init();



});
