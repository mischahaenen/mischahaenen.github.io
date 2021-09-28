import './style.css';
import * as THREE from 'Three';
import { OrbitControls } from 'THREE/examples/jsm/controls/OrbitControls';

/* With THREE you need always THREE things: 
1. Scene === Container that holds all Objects, cameras and lights.
2. Camera: To light the scene and look at the objects (https://threejs.org/docs/index.html#api/en/cameras/Camera)
3. Renderer: Render out the actual graphics -> magic happens
*/

const scene = new THREE.Scene();
// PerspectiveCamera takes FieldOfView -> 75, AspectRatio -> User Browser window, View Frustum -> what want we to show.
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Moves camera away from middle point along the z axes
camera.position.setZ(30);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#background'),
});
renderer.setPixelRatio(window.devicePixelRatio);
// Make full-screen canvas.
renderer.setSize(window.innerWidth, window.innerHeight);

/*
Add objects to the scene:
1. Geometry: The X,Y,Z points that make out a shape. (https://THREEjs.org/docs/index.html#api/en/core/BufferGeometry)
2. Material: The wrapping paper for an object (gives color or texture) (https://THREEjs.org/docs/index.html#api/en/materials/Material)
3. Mesh: Geometry + Material
*/
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0x456f8f });
const torus = new THREE.Mesh(geometry, material);

// Adding torus to the Scene
scene.add(torus);

// Adding light to the Scene (0x means hexadezimal literal)
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

//Helpers
// Shows pointlight
const pointLightHelper = new THREE.PointLightHelper(pointLight);
// Shows line on screen
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(pointLightHelper, gridHelper);

// controls
const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 5, 5);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(500));

  star.position.set(x, y, z);
  scene.add(star);
}
Array(1000).fill().forEach(addStar);

// Adding Background to Scene
const spaceTexture = new THREE.TextureLoader().load('./images/space.jpg');
scene.background = spaceTexture;

// Adding textures from 2d images
const avatarImage = new THREE.TextureLoader().load('./images/Mischa2_2.jpg');
const avatar = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5),
  new THREE.MeshBasicMaterial({ map: avatarImage })
);
scene.add(avatar);

// Adding another space planet
const planetImage = new THREE.TextureLoader().load('./images/planet.jpg');
const normalMap = new THREE.TextureLoader().load('./images/normal-map.png');
const planet = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.MeshStandardMaterial({ map: planetImage, normalMap })
);
planet.position.set(-10, 0, 20);
scene.add(planet);
// Add orbit to planet
const orbit = new THREE.Mesh(
  new THREE.RingGeometry(7, 8, 100),
  new THREE.MeshBasicMaterial({ color: 0xe0b94e, side: THREE.DoubleSide })
);
orbit.position.set(-10, 0, 20);
scene.add(orbit);
function moveCamera() {
  const top = document.body.getBoundingClientRect().top;
  orbit.rotation.x += 0.2;
  orbit.rotation.y += 0.2;
  orbit.rotation.z += 0.2;
  planet.rotation.x += 0.05;
  planet.rotation.y += 0.05;
  planet.rotation.z += 0.05;

  avatar.rotation.x += 0.05;
  avatar.rotation.y += 0.05;

  camera.position.z = top * -0.01;
  camera.position.x = top * -0.0002;
  camera.position.y = top * -0.0002;
}
document.body.onscroll = moveCamera;

// Recursive function to update ui
function animate() {
  requestAnimationFrame(animate);
  // Gets to move objects inside scene
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.005;
  // reflect updates of orbit in ui
  controls.update();
  // render === DRAW
  renderer.render(scene, camera);
}

animate();
