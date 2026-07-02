/* =========================================================================
   Finhashy AI — full-page WebGL backdrop (Three.js)

   A fixed, page-wide 3D "credit network": layered particle fields connected
   by lines, in the brand green. The camera flies forward through the field
   as you scroll, the scene rotates slowly, and it drifts with the mouse.

   Degrades gracefully: if THREE is unavailable, WebGL is unsupported, the
   user prefers reduced motion, or the viewport is very small, it does nothing
   and the CSS gradient background remains.
   ========================================================================= */
(function () {
  'use strict';

  var container = document.getElementById('bg-canvas');
  if (!container) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;
  if (typeof THREE === 'undefined') return;                 // CDN failed / offline
  if (window.innerWidth < 640) return;                      // skip on small screens (perf)

  try {
    var testCanvas = document.createElement('canvas');
    if (!(testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))) return;
  } catch (e) { return; }

  var W = window.innerWidth, H = window.innerHeight;

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xf4f7f5, 0.0016);

  var camera = new THREE.PerspectiveCamera(62, W / H, 1, 2000);
  camera.position.set(0, 0, 420);

  var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  var world = new THREE.Group();
  scene.add(world);

  // soft circular sprite for points
  function makeDot(r, g, b) {
    var c = document.createElement('canvas');
    c.width = c.height = 64;
    var ctx = c.getContext('2d');
    var grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',1)');
    grad.addColorStop(0.5, 'rgba(' + r + ',' + g + ',' + b + ',0.65)');
    grad.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(32, 32, 32, 0, Math.PI * 2); ctx.fill();
    var tex = new THREE.Texture(c); tex.needsUpdate = true; return tex;
  }
  var dotTex = makeDot(53, 163, 122);

  // ---- Build a layer of nodes + near-neighbour links ----
  function buildLayer(count, spread, depth, size, linkDist, lineOpacity) {
    var group = new THREE.Group();
    var nodes = [];
    var positions = new Float32Array(count * 3);
    for (var i = 0; i < count; i++) {
      var x = (Math.random() - 0.5) * spread;
      var y = (Math.random() - 0.5) * spread * 0.7;
      var z = (Math.random() - 0.5) * depth;
      nodes.push(new THREE.Vector3(x, y, z));
      positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z;
    }
    var pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    var pMat = new THREE.PointsMaterial({ size: size, map: dotTex, transparent: true, depthWrite: false });
    group.add(new THREE.Points(pGeo, pMat));

    var lp = [];
    for (var a = 0; a < count; a++) {
      for (var b = a + 1; b < count; b++) {
        if (nodes[a].distanceTo(nodes[b]) < linkDist) {
          lp.push(nodes[a].x, nodes[a].y, nodes[a].z, nodes[b].x, nodes[b].y, nodes[b].z);
        }
      }
    }
    var lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3));
    var lMat = new THREE.LineBasicMaterial({ color: 0x2e7d64, transparent: true, opacity: lineOpacity });
    group.add(new THREE.LineSegments(lGeo, lMat));
    return group;
  }

  // two depth layers for parallax richness
  var layerFront = buildLayer(70, 520, 360, 11, 95, 0.26);
  var layerBack = buildLayer(90, 900, 700, 7, 90, 0.14);
  layerBack.position.z = -350;
  world.add(layerBack);
  world.add(layerFront);

  // ---- Interaction state ----
  var targetX = 0, targetY = 0;
  window.addEventListener('mousemove', function (e) {
    targetX = (e.clientX / window.innerWidth - 0.5);
    targetY = (e.clientY / window.innerHeight - 0.5);
  }, { passive: true });

  var scrollProgress = 0; // 0..1 down the page
  function updateScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = max > 0 ? (window.pageYOffset || 0) / max : 0;
  }
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  function onResize() {
    W = window.innerWidth; H = window.innerHeight;
    camera.aspect = W / H; camera.updateProjectionMatrix();
    renderer.setSize(W, H);
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

    // fly forward through the field as we scroll
    camera.position.z = 420 - scrollProgress * 620;

    // slow ambient rotation
    world.rotation.y += 0.0011;
    layerBack.rotation.y -= 0.0006;

    // mouse drift (eased)
    world.rotation.x += (targetY * 0.28 - world.rotation.x) * 0.04;
    camera.position.x += (targetX * 60 - camera.position.x) * 0.04;
    camera.lookAt(0, 0, camera.position.z - 400);

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
})();
