/* =========================================================================
   Finhashy AI — hero WebGL animation (Three.js)
   A slowly rotating particle "credit network": nodes connected by lines,
   in the brand green, with subtle mouse parallax.

   Degrades gracefully: if THREE is unavailable, WebGL is unsupported,
   the user prefers reduced motion, or the viewport is very small, it does
   nothing and the CSS gradient background remains.
   ========================================================================= */
(function () {
  'use strict';

  var container = document.getElementById('hero-canvas');
  if (!container) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;
  if (typeof THREE === 'undefined') return;               // CDN failed / offline
  if (window.innerWidth < 640) return;                    // skip on small screens (perf)

  // WebGL support check
  try {
    var testCanvas = document.createElement('canvas');
    if (!(testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))) return;
  } catch (e) { return; }

  var width = container.clientWidth || window.innerWidth;
  var height = container.clientHeight || 600;

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
  camera.position.z = 340;

  var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0); // transparent
  container.appendChild(renderer.domElement);

  var group = new THREE.Group();
  scene.add(group);

  // ---- Nodes ----
  var NODE_COUNT = 90;
  var SPREAD = 260;
  var nodes = [];
  var positions = new Float32Array(NODE_COUNT * 3);

  for (var i = 0; i < NODE_COUNT; i++) {
    var x = (Math.random() - 0.5) * SPREAD;
    var y = (Math.random() - 0.5) * SPREAD * 0.75;
    var z = (Math.random() - 0.5) * SPREAD;
    nodes.push(new THREE.Vector3(x, y, z));
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  // soft circular sprite for the points
  function makeDot() {
    var c = document.createElement('canvas');
    c.width = c.height = 64;
    var ctx = c.getContext('2d');
    var grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(53,163,122,1)');
    grad.addColorStop(0.5, 'rgba(46,125,100,0.75)');
    grad.addColorStop(1, 'rgba(46,125,100,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
    var tex = new THREE.Texture(c);
    tex.needsUpdate = true;
    return tex;
  }

  var pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  var pointsMat = new THREE.PointsMaterial({
    size: 9,
    map: makeDot(),
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending
  });
  group.add(new THREE.Points(pointsGeo, pointsMat));

  // ---- Connections (static lines between nearby nodes) ----
  var LINK_DIST = 78;
  var linePositions = [];
  for (var a = 0; a < NODE_COUNT; a++) {
    for (var b = a + 1; b < NODE_COUNT; b++) {
      if (nodes[a].distanceTo(nodes[b]) < LINK_DIST) {
        linePositions.push(nodes[a].x, nodes[a].y, nodes[a].z);
        linePositions.push(nodes[b].x, nodes[b].y, nodes[b].z);
      }
    }
  }
  var lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  var lineMat = new THREE.LineBasicMaterial({
    color: 0x2e7d64,
    transparent: true,
    opacity: 0.28
  });
  group.add(new THREE.LineSegments(lineGeo, lineMat));

  // ---- Mouse parallax ----
  var targetX = 0, targetY = 0;
  window.addEventListener('mousemove', function (e) {
    targetX = (e.clientX / window.innerWidth - 0.5);
    targetY = (e.clientY / window.innerHeight - 0.5);
  }, { passive: true });

  // ---- Resize ----
  function onResize() {
    width = container.clientWidth || window.innerWidth;
    height = container.clientHeight || 600;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onResize, { passive: true });

  // ---- Animate ----
  var running = true;
  document.addEventListener('visibilitychange', function () {
    running = !document.hidden;
    if (running) tick();
  });

  function tick() {
    if (!running) return;
    group.rotation.y += 0.0016;
    group.rotation.x += (targetY * 0.35 - group.rotation.x) * 0.04;
    group.rotation.y += (targetX * 0.15) * 0.008;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
})();
