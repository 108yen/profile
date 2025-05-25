"use client"

import { useEffect, useRef } from "react"
import {
  BufferGeometry,
  Float32BufferAttribute,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from "three"

export default function Page() {
  const ref = useRef<HTMLCanvasElement>(null)
  const cloudRef = useRef<null | Points>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const scene = new Scene()
    const camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    )
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 300

    const renderer = new WebGLRenderer({ canvas })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000)

    scene.add(camera)
    // createSprites()
    getGeometryPosition()

    requestAnimationFrame(render)
    render()

    function getGeometryPosition() {
      const numPoints = 2000
      const positions = []
      for (let i = 0; i < numPoints; i++) {
        // Fibonacci sphere algorithm
        const phi = Math.acos(1 - (2 * (i + 0.5)) / numPoints)
        const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)
        const r = 30
        const x = r * Math.sin(phi) * Math.cos(theta)
        const y = r * Math.sin(phi) * Math.sin(theta)
        const z = r * Math.cos(phi)
        positions.push(x, y, z)
      }
      const geometry = new BufferGeometry()
      geometry.setAttribute(
        "position",
        new Float32BufferAttribute(positions, 3),
      )
      const material = new PointsMaterial({
        color: 0xffffff,
        size: 1,
        vertexColors: false,
      })
      const cloud = new Points(geometry, material)
      scene.add(cloud)
      cloudRef.current = cloud
    }

    // function createSprites() {
    //   const geom = new BufferGeometry()
    //   const positions = []
    //   const colors = []

    //   for (let x = -5; x < 5; x++) {
    //     for (let y = -5; y < 5; y++) {
    //       const color = new Color(Math.random() * 0x00ffff)

    //       positions.push(x * 10, y * 10, 0)
    //       colors.push(color.r, color.g, color.b)
    //     }
    //   }

    //   geom.setAttribute("position", new Float32BufferAttribute(positions, 3))
    //   geom.setAttribute("color", new Float32BufferAttribute(colors, 3))

    //   const material = new PointsMaterial({
    //     color: 0xffffff,
    //     size: 1,
    //     vertexColors: true,
    //   })

    //   const cloud = new Points(geom, material)
    //   scene.add(cloud)

    // }

    function render() {
      requestAnimationFrame(render)
      if (cloudRef.current) {
        cloudRef.current.rotation.y += 0.001
      }
      renderer.render(scene, camera)
    }
  }, [])

  return <canvas ref={ref} />
}
