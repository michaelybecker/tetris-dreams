//to do
// dont forget musak


'use strict';
$(function() {




            // physica
            Physijs.scripts.worker = "./js/physijs_worker.js";
            Physijs.scripts.ammo = "./ammo.js";

            var init, render, renderer, scene, camera, box;
            var lights, lights2, lights3, lights4;
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
            var crashToll = 0;
            var crashedArr = [];
            var freezeArray = [];
            var manager = new THREE.LoadingManager();
            var timelyMake;
            var isPaused = false;
            var isDead = false;
            var isIntro = true;




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
                    element.exitPointerLock = element.exitPointerLock ||
                        element.mozExitPointerLock ||
                        element.webkitExitPointerLock;

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


                manager.onProgress = function(item, loaded, total) {
                    console.log(item, loaded, total);
                };

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


                bgAud = new Audio('http://michaelhazani.com/projects/tetris-horror/audio/theme.ogg');
                bgAud.addEventListener('ended', function() {
                    this.currentTime = 0;
                    this.play();
                    this.volume = 1;
                }, false);
                bgAud.volume = 1;
                bgAud2 = new Audio('../audio/shepard.ogg');
                bgAud2.addEventListener('ended', function() {
                    this.currentTime = 0;
                    this.play();
                    this.volume = 0.0;
                }, false);
                bgAud2.volume = 0.0;
                bgAud2.currentTime = 30;


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

                // Death Mask
                var blackScreen = document.createElement("div");
                blackScreen.class = "blackScreen";
                blackScreen.style.position = "absolute";
                blackScreen.zIndex = 134;
                blackScreen.style.top = 0 + "px";
                blackScreen.style.left = 0 + "px";
                blackScreen.style.backgroundColor = "black";
                blackScreen.style.width = window.innerWidth + "px";
                blackScreen.style.height = window.innerHeight + "px";
                blackScreen.style.margin = 0;
                blackScreen.style.color = "white";
                blackScreen.style.opacity = 0;
                blackScreen.style.textAlign = "center";
                var deathText = document.createElement("div");

                deathText.innerHTML = "<p class='p1d' style='opacity:0'>You almost made it.</p><p class='p2d' style='opacity:0'>Just one more level.</p><br><br><p class='p3d' style='opacity:0'>Try again?</p><p class='p4d' style='opacity:0'>I bet you'll beat it this time.</p><p class='p5d' style='opacity:0'>What's the harm?</p>" +
                    "<div class='p5d' id='links' style='opacity: 0; width: 100%; position: absolute; float: right; bottom: 35px; line-height: 1em; font-size:0.7em; font-family:helvetica; color: #ccc'>&#169 2016 Michael Hazani <br> <a href='http://michaelhazani.com' alt='Michael Hazani's website' target='_blank' style='text-decoration:none; color:#ccc;'>website</a> | <a href='https://github.com/MichaelHazani/tetris-horror' alt='Hazani's Github' target='_blank' style='text-decoration:none; color:#ccc;'>GitHub</a></div>";
                deathText.style.fontSize = "1em";
                deathText.style.textAlign = "center";

                deathText.style.lineHeight = "4rem";
                deathText.style.marginTop = "2%";
                deathText.style.marginLeft = "20px";
                deathText.style.position = "absolute";
                deathText.style.top = "0px";
                // introText.style.padding = "40px";
                // introText.style. =
                deathText.style.backgroundColor = "black";
                deathText.style.color = "white";
                deathText.style.width = window.innerWidth + "px";
                deathText.style.height = window.innerHeight + "px";
                // introText. =
                blackScreen.appendChild(deathText);


                // Intro
                var introScreen = document.createElement("div");
                introScreen.class = "introScreen";
                introScreen.style.position = "absolute";
                introScreen.zIndex = 134;
                introScreen.style.top = "0px";
                introScreen.style.left = "0px";
                introScreen.style.backgroundColor = "black";
                introScreen.style.width = window.innerWidth + "px";
                introScreen.style.height = window.innerHeight + "px";
                introScreen.style.margin = 0;
                introScreen.style.color = "white";

                var introText = document.createElement("div");

                introText.innerHTML = "<div><p class='1p' style='opacity: 0'>\"...But nowadays, the populace at large isn't aware of our discoveries since " +
                    "we first encountered the Tetris Effect - <br>chronic, virtually irreversible phenomena such as neural hijacking, pattern-oriented compulsive obsessions or post" +
                    "-Pavlovian conditioning...</p><br><p class='2p' style='opacity: 0'>No one wants to be told about thousands of cases, women and men " +
                    "around the world <br> who spend their lives confined to padded cells, doomed to play a neverending game in their heads ad infinitum, <br> sans loved ones, " +
                    "sans thought, sans sleep...\" </p></div><br><br>" +
                    "<span id='credits' class='3p' style='float:right; font-style: italic; margin-right:40px; opacity: 0'>A.L.Pajitnov, PhD, \"The Viral And The Virtual: Towards A New Pathology\"</span>";
                introText.style.fontSize = "1.1em";
                introText.style.textAlign = "left";

                introText.style.lineHeight = "4rem";
                introText.style.marginTop = "2%";
                introText.style.marginLeft = "20px";
                introText.style.position = "absolute";
                introText.style.top = "0px";
                // introText.style.padding = "40px";
                // introText.style. =
                introText.style.backgroundColor = "black";
                introText.style.color = "white";

                introText.style.width = window.innerWidth + "px";
                introText.style.height = window.innerHeight + "px";
                // introText. =
                introScreen.appendChild(introText);
                element.appendChild(introScreen);
                // $(introText).hide();


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

                        case 80:
                            isPaused = !isPaused;


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

                        var randomSignX = (Math.round(Math.random()) * 2 - 1);
                        var randomSignY = (Math.round(Math.random()) * 2 - 1);
                        var x = randomSignX * Math.floor((Math.random() * multiplier) + 1);
                        var y = randomSignY * Math.floor((Math.random() * multiplier) + 1);
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
                            // console.log(mesh.position.x + " " + mesh.position.z);
                            scene.add(mesh);


                        });
                    }, 2000);
                }

                function b2() {
                    setTimeout(function() {

                        var randomSignX = (Math.round(Math.random()) * 2 - 1);
                        var randomSignY = (Math.round(Math.random()) * 2 - 1);
                        var x = randomSignX * Math.floor((Math.random() * multiplier) + 1);
                        var y = randomSignY * Math.floor((Math.random() * multiplier) + 1);
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
                            // console.log(mesh.position.x + " " + mesh.position.z);
                            audioLoader.load(notesArr[Math.floor((Math.random() * 7))]);
                            scene.add(mesh);


                        });
                    }, 2000);

                }

                function b3() {
                    setTimeout(function() {

                        var randomSignX = (Math.round(Math.random()) * 2 - 1);
                        var randomSignY = (Math.round(Math.random()) * 2 - 1);
                        var x = randomSignX * Math.floor((Math.random() * multiplier) + 1);
                        var y = randomSignY * Math.floor((Math.random() * multiplier) + 1);
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
                            // console.log(mesh.position.x + " " + mesh.position.z);
                            audioLoader.load(notesArr[Math.floor((Math.random() * 7))]);
                            scene.add(mesh);


                        });
                    }, 2000);

                }


                function b4() {
                    setTimeout(function() {

                        var randomSignX = (Math.round(Math.random()) * 2 - 1);
                        var randomSignY = (Math.round(Math.random()) * 2 - 1);
                        var x = randomSignX * Math.floor((Math.random() * multiplier) + 1);
                        var y = randomSignY * Math.floor((Math.random() * multiplier) + 1);
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
                            // console.log(mesh.position.x + " " + mesh.position.z);
                            audioLoader.load(notesArr[Math.floor((Math.random() * 7))]);
                            scene.add(mesh);


                        });
                    }, 2000);

                }


                function b5() {
                    setTimeout(function() {

                        var randomSignX = (Math.round(Math.random()) * 2 - 1);
                        var randomSignY = (Math.round(Math.random()) * 2 - 1);
                        var x = randomSignX * Math.floor((Math.random() * multiplier) + 1);
                        var y = randomSignY * Math.floor((Math.random() * multiplier) + 1);
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
                            // console.log(mesh.position.x + " " + mesh.position.z);
                            mesh.rotation.x = x;
                            mesh.rotation.y = y;
                            mesh.rotation.z = x;
                            mesh.name = "brick";

                            audioLoader.load(notesArr[Math.floor((Math.random() * 7))]);
                            scene.add(mesh);


                        });
                    }, 2000);

                }

                timelyMake = setInterval(function() {

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

                    if (!isPaused && !isDead && !isIntro) {
                        var brickNum = Math.round(Math.random() * 5) + 1;
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
                    }
                }, dropInterval);




                //checkerboard plane

                // var loader = new THREE.TextureLoader();

                var die = function(level) {

                    isDead = true;
                    document.exitPointerLock();
                    $(bgAud2).animate({ volume: 0 }, 2000);
                    bgAud.currentTime = 0;
                    bgAud.volume = 1;
                    bgAud.play();
                    element.appendChild(blackScreen);

                    $(blackScreen).animate({ opacity: 1 }, 2000);
                    $('.p1d').animate({ opacity: 1 }, 10000);
                    $('.p2d').animate({ opacity: 1 }, 20000);
                    $('.p3d').animate({ opacity: 1 }, 30000);
                    $('.p4d').animate({ opacity: 1 }, 50000);
                    $('.p5d').animate({ opacity: 1 }, 60000);

                    setTimeout(function() {
                            window.addEventListener("mousedown", function() {
                                location.reload();
                            });
                        }, 10000);

                            // console.log("you died");

                            // switch (level) {
                            //     case 1:
                            //         for (var i = 0; i < skyBox1.material.materials.length; i++) {
                            //             TweenLite.to(skyBox1.material.materials[i], 5, { opacity: 0, onComplete: death2 });
                            //         }
                            //         break;
                            //     case 2:
                            //         for (var i = 0; i < skyBox3.material.materials.length; i++) {
                            //             TweenLite.to(skyBox3.material.materials[i], 5, { opacity: 0, onComplete: death2 });
                            //         }
                            //                             break;
                            //     case 3:
                            //         for (var i = 0; i < skyBox2.material.materials.length; i++) {
                            //             TweenLite.to(skyBox2.material.materials[i], 5, { opacity: 0, onComplete: death2 });
                            //         }

                            //     case 4:
                            //         for (var i = 0; i < skyBox4.material.materials.length; i++) {
                            //             TweenLite.to(skyBox4.material.materials[i], 5, { opacity: 0, onComplete: death2 });
                            //         }

                            //         break;
                            //     default:
                            //         break;


                        }


                        var original = 0xa45757; plane = new Physijs.CylinderMesh(new THREE.CylinderGeometry(500, 500, 5, 34), new THREE.MeshPhongMaterial({ color: original }), 0);

                        plane.rotation.x = Math.PI; plane.position.set(0, 0, 0); plane.name = "plane"; plane.addEventListener('collision', function(other_object) {


                            if (!other_object.dead) {
                                other_object.dead = true;
                                crashedArr.push(other_object);
                                crashToll++

                            }

                            if (crashToll > 11 - level * 2) {
                                // console.log("death");
                                die(level);
                                // $(document).fadeOut();
                            }

                        }); scene.add(plane);

                        lights = new THREE.PointLight(0xffffff, .5); lights.position.set(150, 200, 150); scene.add(lights);

                        lights2 = new THREE.PointLight(0xffffff, .5); lights2.position.set(150, 200, -150); scene.add(lights2);

                        lights3 = new THREE.PointLight(0xffffff, .5); lights3.position.set(-150, 200, 150); scene.add(lights3);

                        lights4 = new THREE.PointLight(0xffffff, .5); lights4.position.set(-150, 200, -150); scene.add(lights4);

                        // var light2 = new THREE.AmbientLight(0xFFdddd, 0.2);
                        // scene.add(light2);

                        requestAnimationFrame(render);


                        // -----SKYBOXES----

                        //skybox1
                        var skyGeometry = new THREE.BoxGeometry(700, 700, 700);
                        var skyArray = [];
                        var loader = new THREE.TextureLoader(); skyArray.push(new THREE.MeshBasicMaterial({
                            map: loader.load("../images/sides1.jpg"),
                            side: THREE.DoubleSide,
                            transparent: true,
                            needsUpdate: true
                                // color: 0xff00ff
                        }));
                        var loader = new THREE.TextureLoader(); skyArray.push(new THREE.MeshBasicMaterial({
                            map: loader.load("../images/sides1.jpg"),
                            side: THREE.DoubleSide,
                            transparent: true,
                            needsUpdate: true
                                // opacity:0.1
                                // color: 0xff00ff
                        }));
                        var loader = new THREE.TextureLoader(); skyArray.push(new THREE.MeshBasicMaterial({
                            map: loader.load("../images/top1.jpg"),
                            side: THREE.DoubleSide,
                            transparent: true,
                            needsUpdate: true

                            // color: 0xff00ff
                        }));
                        var loader = new THREE.TextureLoader(); skyArray.push(new THREE.MeshBasicMaterial({
                            map: loader.load("../images/bottom1.jpg"),
                            side: THREE.DoubleSide,
                            transparent: true,
                            needsUpdate: true
                                // color: 0xff00ff
                        }));
                        var loader = new THREE.TextureLoader(); skyArray.push(new THREE.MeshBasicMaterial({
                            map: loader.load("../images/sides1.jpg"),
                            side: THREE.DoubleSide,
                            transparent: true,
                            needsUpdate: true
                                // color: 0xff00ff
                        }));
                        var loader = new THREE.TextureLoader(); skyArray.push(new THREE.MeshBasicMaterial({
                            map: loader.load("../images/sides1.jpg"),
                            side: THREE.DoubleSide,
                            transparent: true,
                            needsUpdate: true
                                // color: 0xff00ff
                        }));


                        var skyMaterial = new THREE.MeshFaceMaterial(skyArray);
                        // SkyMaterial.transparent = true;
                        // console.log(skyMaterial);
                        var skyBox1 = new THREE.Mesh(skyGeometry, skyMaterial); skyBox1.position.y = 250; scene.add(skyBox1);


                        //skybox2
                        var skyGeometry2 = new THREE.BoxGeometry(740, 740, 740);
                        var skyArray2 = [];
                        var loader = new THREE.TextureLoader(); skyArray2.push(new THREE.MeshBasicMaterial({
                            map: loader.load("../images/sides2.jpg"),
                            side: THREE.BackSide,
                            transparent: true,
                            opacity: 0
                        }));
                        var loader = new THREE.TextureLoader(); skyArray2.push(new THREE.MeshBasicMaterial({
                            map: loader.load("../images/sides2.jpg"),
                            side: THREE.BackSide,
                            transparent: true,
                            opacity: 0
                        }));
                        var loader = new THREE.TextureLoader(); skyArray2.push(new THREE.MeshBasicMaterial({
                            map: loader.load("../images/top2.jpg"),
                            side: THREE.BackSide,
                            transparent: true,
                            opacity: 0
                        }));
                        var loader = new THREE.TextureLoader(); skyArray2.push(new THREE.MeshBasicMaterial({
                            map: loader.load("../images/bottom2.jpg"),
                            side: THREE.BackSide,
                            transparent: true,
                            opacity: 0
                        }));
                        var loader = new THREE.TextureLoader(); skyArray2.push(new THREE.MeshBasicMaterial({
                            map: loader.load("../images/sides2.jpg"),
                            side: THREE.BackSide,
                            transparent: true,
                            opacity: 0
                        }));
                        var loader = new THREE.TextureLoader(); skyArray2.push(new THREE.MeshBasicMaterial({
                            map: loader.load("../images/sides2.jpg"),
                            side: THREE.BackSide,
                            transparent: true,
                            opacity: 0
                        }));


                        var skyMaterial2 = new THREE.MeshFaceMaterial(skyArray2);
                        var skyBox2 = new THREE.Mesh(skyGeometry2, skyMaterial2); skyBox2.position.y = 245; scene.add(skyBox2);


                        //skybox3
                        var skyGeometry3 = new THREE.BoxGeometry(720, 720, 720);
                        var skyArray3 = [];
                        var loader = new THREE.TextureLoader(); skyArray3.push(new THREE.MeshBasicMaterial({
                            map: loader.load("../images/sides3.jpg"),
                            side: THREE.BackSide,
                            transparent: true,
                            opacity: 0
                        }));
                        var loader = new THREE.TextureLoader(); skyArray3.push(new THREE.MeshBasicMaterial({
                            map: loader.load("../images/sides3.jpg"),
                            side: THREE.BackSide,
                            transparent: true,
                            opacity: 0
                        }));
                        var loader = new THREE.TextureLoader(); skyArray3.push(new THREE.MeshBasicMaterial({
                            map: loader.load("../images/top3.jpg"),
                            side: THREE.BackSide,
                            transparent: true,
                            opacity: 0
                        }));
                        var loader = new THREE.TextureLoader(); skyArray3.push(new THREE.MeshBasicMaterial({
                            map: loader.load("../images/bottom3.jpg"),
                            side: THREE.BackSide,
                            transparent: true,
                            opacity: 0
                        }));
                        var loader = new THREE.TextureLoader(); skyArray3.push(new THREE.MeshBasicMaterial({
                            map: loader.load("../images/sides3.jpg"),
                            side: THREE.BackSide,
                            transparent: true,
                            opacity: 0
                        }));
                        var loader = new THREE.TextureLoader(); skyArray3.push(new THREE.MeshBasicMaterial({
                            map: loader.load("../images/sides3.jpg"),
                            side: THREE.BackSide,
                            transparent: true,
                            opacity: 0
                        }));


                        var skyMaterial3 = new THREE.MeshFaceMaterial(skyArray3);
                        var skyBox3 = new THREE.Mesh(skyGeometry3, skyMaterial3); skyBox3.position.y = 245; scene.add(skyBox3);

                        //skybox4
                        var skyGeometry4 = new THREE.BoxGeometry(760, 760, 760);
                        var skyArray4 = [];
                        var loader = new THREE.TextureLoader(); skyArray4.push(new THREE.MeshBasicMaterial({
                            map: loader.load("../images/sides4.jpg"),
                            side: THREE.BackSide,
                            transparent: true,
                            opacity: 0
                        }));
                        var loader = new THREE.TextureLoader(); skyArray4.push(new THREE.MeshBasicMaterial({
                            map: loader.load("../images/sides4.jpg"),
                            side: THREE.BackSide,
                            transparent: true,
                            opacity: 0
                        }));
                        var loader = new THREE.TextureLoader(); skyArray4.push(new THREE.MeshBasicMaterial({
                            map: loader.load("../images/top4.jpg"),
                            side: THREE.BackSide,
                            transparent: true,
                            opacity: 0
                        }));
                        var loader = new THREE.TextureLoader(); skyArray4.push(new THREE.MeshBasicMaterial({
                            map: loader.load("../images/bottom4.jpg"),
                            side: THREE.BackSide,
                            transparent: true,
                            opacity: 0
                        }));
                        var loader = new THREE.TextureLoader(); skyArray4.push(new THREE.MeshBasicMaterial({
                            map: loader.load("../images/sides4.jpg"),
                            side: THREE.BackSide,
                            transparent: true,
                            opacity: 0
                        }));
                        var loader = new THREE.TextureLoader(); skyArray4.push(new THREE.MeshBasicMaterial({
                            map: loader.load("../images/sides4.jpg"),
                            side: THREE.BackSide,
                            transparent: true,
                            opacity: 0
                        }));


                        var skyMaterial4 = new THREE.MeshFaceMaterial(skyArray4);
                        var skyBox4 = new THREE.Mesh(skyGeometry4, skyMaterial4); skyBox4.position.y = 245; scene.add(skyBox4);

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
                            aperture: 0.02,
                            maxblur: 1.02,
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


                        composer.addPass(new THREE.RenderPass(scene, camera)); composer.addPass(bokehPass);



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
                                    dropInterval -= level * 600;
                                    multiplier += level * 45;
                                    gravity -= 40;
                                    scene.setGravity(new THREE.Vector3(0, gravity, 0));
                                    // console.log("next up! Level " + level + ", dropInterval: " + dropInterval, "dropRadius: " + multiplier + ", gravity: " + gravity);
                                    crashToll = 0;
                                    // console.log(crashedArr);
                                    for (var i = 0; i < crashedArr.length; i++) {
                                        // console.log(crashedArr[i]);
                                        scene.remove(crashedArr[i]);

                                        // scene.remove(crashedArr[i]);
                                    }
                                    switch (level) {
                                        case 1:
                                            for (var i = 0; i < skyBox1.material.materials.length; i++) {
                                                TweenLite.to(skyBox1.material.materials[i], 5, { opacity: 0, onComplete: fadeBox });
                                            }

                                            function fadeBox() {

                                                // console.log(level);


                                                scene.remove(skyBox1);
                                                plane.material.color = new THREE.Color(0xff00ff);
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

                                                // console.log(level);


                                                scene.remove(skyBox3);
                                                plane.material.color = new THREE.Color(0x84003f);
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

                                                // console.log(level);
                                                scene.remove(skyBox2);
                                                plane.material.color = new THREE.Color(0x455666);
                                                for (var i = 0; i < skyBox4.material.materials.length; i++) {
                                                    TweenLite.to(skyBox4.material.materials[i], 3, { opacity: 1 });
                                                }
                                            }

                                            break;
                                        default:
                                            break;
                                    }
                                    level++;
                                    // displayLevel(level);
                                }






                            }

                            // console.log(controls.getObject().position);
                        }, false);



                        // displayLevel(level);


                        //start intro screen!
                        $('.1p').animate({ opacity: 1 }, 10000); $('.2p').animate({ opacity: 1 }, 30000); $('.3p').animate({ opacity: 1 }, 60000); bgAud.play();


                        $(introScreen).click(function() {

                            $(bgAud).animate({ volume: 0 }, 1000);
                            setTimeout(function() {
                                bgAud.stop();
                            }, 1500);
                            $(bgAud2).animate({ volume: 0.5 }, 6000);
                            $(introScreen).fadeOut(2000);
                            setTimeout(function() {
                                element.removeChild(introScreen);
                            }, 2000);

                            isIntro = !isIntro;
                        });



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
                                i.setLinearVelocity(new THREE.Vector3(0, 1.5, 0));
                                i.setAngularVelocity(new THREE.Vector3(0, 0.2, 0));
                            });
                        }

                        requestAnimationFrame(render);

                        if (!isPaused) {

                            if (!havePointerLock) {
                                document.requestPointerLock();
                            }

                            bgAud2.play();
                            scene.simulate();
                            composer.render();
                            // renderer.render(scene, camera);
                        } else {
                            bgAud2.pause();
                            document.exitPointerLock();
                        }


                    };

                    init();



                });
