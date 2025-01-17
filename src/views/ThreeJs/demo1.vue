<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

var scene = null;
var camera = null;
var renderer = null;
var material = null;
var cube = null;


function init() {
  renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('mainCanvas')
  });
  scene = new THREE.Scene();
  
  camera = new THREE.OrthographicCamera(-5, 5, 3.75, -3.75, 0.1, 100);
  camera.position.set(5, 15, 25);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  scene.add(camera);
  
  var light = new THREE.DirectionalLight();
  light.position.set(3, 2, 5);
  scene.add(light);
  
  // shader material
  const vertexShader = `
    varying vec2 vUv;
    void main()
    {    
        // passing texture to fragment shader
        vUv = uv;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`
    const fragmentShader = `
      varying vec2 vUv;
      void main() {
          gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
      }
    `
  material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
  });
  
  cube = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), material);
  cube.position.x = 2;
  scene.add(cube);
  
  draw();
}

function draw() {
  cube.rotation.y += 0.01;
  if (cube.rotation.y > Math.PI * 2) {
      cube.rotation.y -= Math.PI * 2;
  }

  renderer.render(scene, camera);
  
  requestAnimationFrame(draw);
}

onMounted(() => {
  init()
})
</script>

<template>
  <canvas id="mainCanvas" width="400px" height="300px" ></canvas>
</template>

<style scoped>
</style>
