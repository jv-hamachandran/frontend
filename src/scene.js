/* =========================================================================
   Finhashy AI - subtle light hero scene
   ========================================================================= */
import * as THREE from 'three';

export function initScene(container) {
  if (!container || typeof window === 'undefined') return null;

  try {
    const test = document.createElement('canvas');
    if (!(test.getContext('webgl') || test.getContext('experimental-webgl'))) return null;
  } catch (error) {
    return null;
  }

  let width = container.clientWidth || window.innerWidth;
  let height = container.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
  camera.position.z = 5.2;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.setClearColor(0xffffff, 0);
  container.appendChild(renderer.domElement);

  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.25, 2),
    new THREE.MeshBasicMaterial({
      color: 0x0071e3,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    })
  );
  shell.position.y = -0.05;
  scene.add(shell);

  const inner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.42, 1),
    new THREE.MeshBasicMaterial({
      color: 0x2f7d62,
      wireframe: true,
      transparent: true,
      opacity: 0.055,
    })
  );
  inner.rotation.z = 0.24;
  scene.add(inner);

  let targetX = 0;
  let targetY = 0;
  let scrollProgress = 0;

  window.addEventListener('mousemove', (event) => {
    targetX = event.clientX / window.innerWidth - 0.5;
    targetY = event.clientY / window.innerHeight - 0.5;
  }, { passive: true });

  function onResize() {
    width = container.clientWidth || window.innerWidth;
    height = container.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onResize, { passive: true });

  let running = true;
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) loop();
  });

  function loop() {
    if (!running) return;

    shell.rotation.y -= 0.001 + targetX * 0.006;
    shell.rotation.x += (targetY * 0.16 - shell.rotation.x) * 0.04;
    inner.rotation.y += 0.0018;
    inner.rotation.x -= 0.0008;

    camera.position.z = 5.2 + scrollProgress * 1.4;
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  loop();

  return {
    setScroll(progress) {
      scrollProgress = Math.max(0, Math.min(1, progress));
    },
    dispose() {
      renderer.dispose();
      shell.geometry.dispose();
      shell.material.dispose();
      inner.geometry.dispose();
      inner.material.dispose();
    },
  };
}
