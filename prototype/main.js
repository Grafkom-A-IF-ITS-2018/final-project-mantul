// import '*' as THREE from '../node_modules/three'
var cube, outer
var scene, camera, renderer

const TABLE_SIZE = { w: 120, h: 8, d: 60 }
const TABLE_LEG_POS = { x: 50, y: -15, z: 20 }

function init() {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

    renderer = new THREE.WebGLRenderer()
    renderer.setClearColor(0xFFFFFF)
    renderer.setSize(window.innerWidth, window.innerHeight)

    var cubeGeometry = new THREE.BoxGeometry(TABLE_SIZE.w, TABLE_SIZE.h, TABLE_SIZE.d)
    var texture = new THREE.TextureLoader().load('assets/tennis_court_grass.jpg')
    var textureFace = new THREE.MeshLambertMaterial({})
    textureFace.map = texture
    console.log('textureface', textureFace)
    var materials = [
        new THREE.MeshLambertMaterial({ color: 0x005A00 }),
        new THREE.MeshLambertMaterial({ color: 0x005A00 }),
        textureFace,
        new THREE.MeshLambertMaterial({ color: 0x005A00 }),
        new THREE.MeshLambertMaterial({ color: 0x005A00 }),
        new THREE.MeshLambertMaterial({ color: 0x005A00 }),
    ]
    cube = new THREE.Mesh(cubeGeometry, materials)
    cube.position.set(0, 0, 0)
    cube.castShadow = true
    console.log(cube)
    scene.add(cube)

    tableLeg1 = new THREE.Mesh(new THREE.BoxGeometry(8, 30, 8), new THREE.MeshLambertMaterial({ color: 0x542a07 }))
    tableLeg1.castShadow = true
    tableLeg1.position.set(-50, -15, 20)
    scene.add(tableLeg1)

    tableLeg2 = new THREE.Mesh(new THREE.BoxGeometry(8, 30, 8), new THREE.MeshLambertMaterial({ color: 0x542a07 }))
    tableLeg2.castShadow = true
    tableLeg2.position.set(50, -15, 20)
    scene.add(tableLeg2)

    tableLeg3 = new THREE.Mesh(new THREE.BoxGeometry(8, 30, 8), new THREE.MeshLambertMaterial({ color: 0x542a07 }))
    tableLeg3.castShadow = true
    tableLeg3.position.set(50, -15, -20)
    scene.add(tableLeg3)

    tableLeg4 = new THREE.Mesh(new THREE.BoxGeometry(8, 30, 8), new THREE.MeshLambertMaterial({ color: 0x542a07 }))
    tableLeg4.castShadow = true
    tableLeg4.position.set(-50, -15, -20)
    scene.add(tableLeg4)

    createBorder()

    var light = new THREE.AmbientLight(0xffffff, 0.2)
    scene.add(light)

    var dirLight = new THREE.DirectionalLight(0xffffff, 1.0)
    dirLight.color.setHSL(0.1, 1, 0.95)
    dirLight.position.set(-1, 1.75, 1)
    dirLight.position.multiplyScalar(30)
    scene.add(dirLight)

    var dirLight2 = new THREE.DirectionalLight(0xffffff, 1.0)
    dirLight2.color.setHSL(0.1, 1, 0.95)
    dirLight2.position.set(1, -1.75, 1)
    dirLight2.position.multiplyScalar(30)
    scene.add(dirLight2)

    camera.position.x = 0
    camera.position.y = 60
    camera.position.z = 100
    camera.lookAt(scene.position)

    document.getElementById('WebGL-output').appendChild(renderer.domElement)

    render()
}
function render() {
    requestAnimationFrame(render)
    // rotateField()
    renderer.render(scene, camera)
}

function createBorder() {
    var smaller = new THREE.Mesh(new THREE.BoxGeometry(120, 12, 60), new THREE.MeshLambertMaterial({ color: 0x542a07 }))
    var bigger = new THREE.Mesh(new THREE.BoxGeometry(125, 12, 65), new THREE.MeshLambertMaterial({ color: 0x542a07 }))

    var biggerBSP = new ThreeBSP(bigger)
    var cubeBSP = new ThreeBSP(smaller)
    var resultBSP = biggerBSP.subtract(cubeBSP)
    outer = resultBSP.toMesh()
    outer.position.set(0, 2, 0)
    outer.material = new THREE.MeshLambertMaterial({ color: 0x005A00 })
    outer.geometry.computeFaceNormals()
    outer.geometry.computeVertexNormals()
    scene.add(outer)
    console.log(outer)
}

function rotateField() {
    if (!cube) {
        return;
    }
    var SPEED = 0.004
    cube.rotation.x -= SPEED * 2;
    // cube.rotation.y -= SPEED;
    // cube.rotation.z -= SPEED * 3;
}
window.onload = init