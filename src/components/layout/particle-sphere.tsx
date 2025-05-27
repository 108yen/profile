"use client"

import { CanvasHTMLAttributes, useEffect, useRef } from "react"
import {
  BufferGeometry,
  Float32BufferAttribute,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from "three"

interface ParticleSphereProps extends CanvasHTMLAttributes<HTMLCanvasElement> {
  height?: number
  numParticles?: number
  width?: number
}

export function ParticleSphere({
  height = 70,
  numParticles = 2000,
  width = 70,
  ...props
}: ParticleSphereProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const cloudRef = useRef<Points>(null)
  const mouseRef = useRef({ isHovering: false, x: 0, y: 0 })

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const scene = new Scene()
    const camera = new PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 80
    const renderer = new WebGLRenderer({
      alpha: true, // 透明度を有効にする
      antialias: true,
      canvas,
    })
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0) // 透明な背景に設定

    scene.add(camera)

    // マウス追跡イベントリスナーを追加
    function handleMouseMove(event: MouseEvent) {
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      // マウス座標をThree.jsの座標系に変換
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      // スクリーン座標をワールド座標に変換（z=0平面での投影）
      mouseRef.current.x *=
        camera.position.z *
        Math.tan((camera.fov * Math.PI) / 360) *
        (rect.width / rect.height)
      mouseRef.current.y *=
        camera.position.z * Math.tan((camera.fov * Math.PI) / 360)
    }

    function handleMouseEnter() {
      mouseRef.current.isHovering = true
    }

    function handleMouseLeave() {
      mouseRef.current.isHovering = false
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseenter", handleMouseEnter)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    let velocities: number[] = []
    let positions: number[] = []
    let geometry: BufferGeometry | null = null
    let currentRotation = 0 // 現在の回転角度を追跡

    function getGeometryPosition() {
      positions = []
      velocities = []

      for (let i = 0; i < numParticles; i++) {
        // 円形配置アルゴリズム（極座標使用）
        const r = Math.sqrt(Math.random()) * 30 // 円の半径内にランダム配置
        const theta = Math.random() * 2 * Math.PI
        const x = r * Math.cos(theta)
        const y = r * Math.sin(theta)
        const z = 0 // 2次元なのでz座標は0
        positions.push(x, y, z)
        // ランダムな速度ベクトル（2次元のみ、z成分は0）
        const speed = 0.1 * Math.random()
        const thetaV = Math.random() * 2 * Math.PI
        velocities.push(
          speed * Math.cos(thetaV),
          speed * Math.sin(thetaV),
          0, // z方向の速度は0
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

        // 回転を更新
        currentRotation += 0.001
        cloudRef.current.rotation.z = currentRotation

        for (let i = 0; i < pos.count; i++) {
          let x = pos.getX(i)
          let y = pos.getY(i)

          // パーティクルの座標を回転座標系に変換（マウス座標と比較するため）
          const cos = Math.cos(currentRotation)
          const sin = Math.sin(currentRotation)
          const rotatedX = x * cos - y * sin
          const rotatedY = x * sin + y * cos

          // マウスホバー時の反発力を適用（回転を考慮）
          if (mouseRef.current.isHovering) {
            const dx = rotatedX - mouseRef.current.x
            const dy = rotatedY - mouseRef.current.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const repelRadius = 15 // 反発する範囲

            if (distance < repelRadius && distance > 0) {
              const repelForce = ((repelRadius - distance) / repelRadius) * 0.3 // 反発力の強さ
              const normalizedDx = dx / distance
              const normalizedDy = dy / distance

              // 反発力を回転座標系から元の座標系に戻す
              const forceX = normalizedDx * repelForce
              const forceY = normalizedDy * repelForce
              const rotatedForceX = forceX * cos + forceY * sin
              const rotatedForceY = -forceX * sin + forceY * cos

              // 反発力を速度に加算
              velocities[3 * i] += rotatedForceX
              velocities[3 * i + 1] += rotatedForceY

              // 速度に上限を設定
              const maxSpeed = 2
              const currentSpeed = Math.sqrt(
                velocities[3 * i] ** 2 + velocities[3 * i + 1] ** 2,
              )
              if (currentSpeed > maxSpeed) {
                velocities[3 * i] =
                  (velocities[3 * i] / currentSpeed) * maxSpeed
                velocities[3 * i + 1] =
                  (velocities[3 * i + 1] / currentSpeed) * maxSpeed
              }
            }
          }

          // 位置を更新
          x = x + velocities[3 * i]
          y = y + velocities[3 * i + 1]

          // ホバー時は軽い減衰のみ（完全に停止しない）
          velocities[3 * i] *= 0.99
          velocities[3 * i + 1] *= 0.99

          // 最小速度を維持して動き続ける
          const currentSpeed = Math.sqrt(
            velocities[3 * i] ** 2 + velocities[3 * i + 1] ** 2,
          )
          const minSpeed = 0.05
          if (currentSpeed < minSpeed && currentSpeed > 0) {
            const speedMultiplier = minSpeed / currentSpeed
            velocities[3 * i] *= speedMultiplier
            velocities[3 * i + 1] *= speedMultiplier
          }

          const r = Math.sqrt(x * x + y * y) // 2次元での距離計算
          // 円の外に出たら反射（速度ベクトルを反転）
          if (r > 30) {
            // 円周上に戻す
            x = (x * 30) / r
            y = (y * 30) / r
            // 速度ベクトルを反転（x, yのみ）
            velocities[3 * i] *= -1
            velocities[3 * i + 1] *= -1
          }
          pos.setX(i, x)
          pos.setY(i, y)
          pos.setZ(i, 0)
        }

        pos.needsUpdate = true
      }

      renderer.render(scene, camera)
    }

    getGeometryPosition()
    requestAnimationFrame(render)
    render()

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseenter", handleMouseEnter)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [height, numParticles, width])

  return <canvas ref={ref} {...props} />
}
