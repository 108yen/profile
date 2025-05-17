"use client"
import { CanvasHTMLAttributes, useEffect, useRef, useState } from "react"
import {
  Clock,
  LinearFilter,
  MathUtils,
  Matrix3,
  Matrix4,
  Mesh,
  NearestFilter,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three"

import { BLACKHOLE } from "@/constant"
import raytracer from "@/shader/raytracer.glsl"
import vertex from "@/shader/vertex.vert"
import { LoadingEvents } from "@/utils/loadingEvents"

class Observer {
  isMobile = false

  constructor(isMobile: boolean) {
    this.isMobile = isMobile

    const camera_pos = this.isMobile
      ? BLACKHOLE.CAMERA_POS.MOBILE
      : BLACKHOLE.CAMERA_POS.BASE
    this.camera_matrix.set(
      camera_pos[0],
      camera_pos[1],
      camera_pos[2],
      camera_pos[3],
      camera_pos[4],
      camera_pos[5],
      camera_pos[6],
      camera_pos[7],
      camera_pos[8],
    )
  }

  distance = this.isMobile ? BLACKHOLE.DISTANCE.MOBILE : BLACKHOLE.DISTANCE.BASE
  alpha = MathUtils.degToRad(BLACKHOLE.ORBITAL_INCLINATION)

  v = 1.0 / Math.sqrt(2.0 * (this.distance - 1.0))
  ang_vel = this.v / this.distance

  camera_matrix = new Matrix3()

  orbit_coords = new Matrix4().makeRotationY(this.alpha)

  orientation = new Matrix3()
  position = new Vector3(0, 0, 0)

  time = 0
  velocity = new Vector3(0, 0, 0)

  private linearPart(
    orbital_x: Vector3,
    orbital_y: Vector3,
    orbital_z: Vector3,
  ) {
    return new Matrix3(
      orbital_x.x,
      orbital_y.x,
      orbital_z.x,
      orbital_x.y,
      orbital_y.y,
      orbital_z.y,
      orbital_x.z,
      orbital_y.z,
      orbital_z.z,
    )
  }

  private orbitalFrame() {
    const orbital_y = new Vector3()
      .subVectors(
        this.velocity.clone().normalize().multiplyScalar(4.0),
        this.position,
      )
      .normalize()
    const orbital_z = new Vector3()
      .crossVectors(this.position, orbital_y)
      .normalize()
    const orbital_x = new Vector3().crossVectors(orbital_y, orbital_z)
    const orbital = this.linearPart(orbital_x, orbital_y, orbital_z)

    this.orientation = orbital.multiply(this.camera_matrix)
  }

  move(dtProp: number) {
    const dt = dtProp * BLACKHOLE.TIME_SCALE

    const angle = this.time * this.ang_vel

    const s = Math.sin(angle)
    const c = Math.cos(angle)
    const z = this.isMobile ? BLACKHOLE.Z.MOBILE : BLACKHOLE.Z.BASE

    const distance = this.isMobile
      ? BLACKHOLE.DISTANCE.MOBILE
      : BLACKHOLE.DISTANCE.BASE

    this.position.set(c * distance, s * distance, z)
    this.velocity.set(-s * this.v, c * this.v, BLACKHOLE.ROTATE)

    this.position.applyMatrix4(this.orbit_coords)
    this.velocity.applyMatrix4(this.orbit_coords)

    this.orbitalFrame()

    this.time += dt
  }
}

interface BlackholeProps extends CanvasHTMLAttributes<HTMLCanvasElement> {}

export function Blackhole(props: BlackholeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [width, setWidth] = useState(0)

  const isMobile = width < 768

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const observer = new Observer(isMobile)

    const scene = new Scene()
    const renderer = new WebGLRenderer({ canvas })
    const geometry = new PlaneGeometry(2, 2)
    const camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      80000,
    )
    const clock = new Clock()
    const textureLoader = new TextureLoader()

    const uniforms = {
      accretion_disk_texture: { type: "t", value: null as null | Texture },
      cam_pos: { type: "v3", value: new Vector3() },
      cam_x: { type: "v3", value: new Vector3() },
      cam_y: { type: "v3", value: new Vector3() },
      cam_z: { type: "v3", value: new Vector3() },
      galaxy_texture: { type: "t", value: null as null | Texture },
      resolution: { type: "v2", value: new Vector2() },
      spectrum_texture: { type: "t", value: null as null | Texture },
      star_texture: { type: "t", value: null as null | Texture },
    }

    const material = new ShaderMaterial({
      fragmentShader: raytracer,
      uniforms,
      vertexShader: vertex,
    })

    const mesh = new Mesh(geometry, material)
    scene.add(mesh)

    function loadTexture(
      symbol: keyof typeof uniforms,
      filename: string,
      interpolation: typeof LinearFilter | typeof NearestFilter,
    ) {
      textureLoader.load(filename, (data: Texture) => {
        const texture = data
        texture.magFilter = interpolation
        texture.minFilter = interpolation

        uniforms[symbol].value = texture
      })
    }

    function updateUniforms() {
      uniforms.resolution.value.x = renderer.domElement.width
      uniforms.resolution.value.y = renderer.domElement.height

      uniforms.cam_pos.value = observer.position

      const e = observer.orientation.elements

      uniforms.cam_x.value.set(e[0], e[1], e[2])
      uniforms.cam_y.value.set(e[3], e[4], e[5])
      uniforms.cam_z.value.set(e[6], e[7], e[8])

      function setVec(target: "cam_pos", value: Vector3) {
        uniforms[target].value.set(value.x, value.y, value.z)
      }

      setVec("cam_pos", observer.position)
    }

    function onWindowResize() {
      setWidth(window.innerWidth)

      renderer.setSize(window.innerWidth, window.innerHeight, false)

      updateUniforms()
    }

    function animate() {
      requestAnimationFrame(animate)

      observer.move(clock.getDelta())
      updateUniforms()

      renderer.render(scene, camera)
    }

    loadTexture("spectrum_texture", "img/spectra.png", LinearFilter)
    loadTexture("star_texture", "img/stars.png", LinearFilter)
    loadTexture(
      "accretion_disk_texture",
      "img/accretion-disk_oil-2.png",
      LinearFilter,
    )

    window.addEventListener("resize", onWindowResize, false)

    LoadingEvents.emit("blackholeReady")

    onWindowResize()
    updateUniforms()
    animate()

    return () => {
      window.removeEventListener("resize", onWindowResize)
    }
  }, [isMobile])

  return <canvas ref={canvasRef} {...props} />
}
