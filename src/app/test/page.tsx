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
  const cloudRef = useRef<Points>(null)

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
    let velocities: number[] = []
    let positions: number[] = []
    let geometry: BufferGeometry | null = null

    function getGeometryPosition() {
      const numPoints = 5000
      positions = []
      velocities = []
      for (let i = 0; i < numPoints; i++) {
        // Fibonacci sphere algorithm
        const phi = Math.acos(1 - (2 * (i + 0.5)) / numPoints)
        const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)
        const r = 30
        const x = r * Math.sin(phi) * Math.cos(theta)
        const y = r * Math.sin(phi) * Math.sin(theta)
        const z = r * Math.cos(phi)
        positions.push(x, y, z)
        // ランダムな速度ベクトル（小さい値）
        const speed = 0.1 * Math.random()
        const thetaV = Math.random() * 2 * Math.PI
        const phiV = Math.acos(2 * Math.random() - 1)
        velocities.push(
          speed * Math.sin(phiV) * Math.cos(thetaV),
          speed * Math.sin(phiV) * Math.sin(thetaV),
          speed * Math.cos(phiV),
        )
      }
      geometry = new BufferGeometry()
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

    function render() {
      requestAnimationFrame(render)

      if (cloudRef.current && geometry) {
        const pos = geometry.getAttribute("position") as Float32BufferAttribute
        for (let i = 0; i < pos.count; i++) {
          // 位置を更新
          let x = pos.getX(i) + velocities[3 * i]
          let y = pos.getY(i) + velocities[3 * i + 1]
          let z = pos.getZ(i) + velocities[3 * i + 2]
          const r = Math.sqrt(x * x + y * y + z * z)
          // 球の外に出たら反射（速度ベクトルを反転）
          if (r > 30) {
            // 球面上に戻す
            x = (x * 30) / r
            y = (y * 30) / r
            z = (z * 30) / r
            // 速度ベクトルを反転
            velocities[3 * i] *= -1
            velocities[3 * i + 1] *= -1
            velocities[3 * i + 2] *= -1
          }
          pos.setX(i, x)
          pos.setY(i, y)
          pos.setZ(i, z)
        }
        pos.needsUpdate = true
        cloudRef.current.rotation.y += 0.001
      }

      renderer.render(scene, camera)
    }

    getGeometryPosition()
    requestAnimationFrame(render)
    render()
  }, [])

  return <canvas ref={ref} />
}
