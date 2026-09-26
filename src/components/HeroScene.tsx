import { Canvas, useFrame } from '@react-three/fiber'
import { Edges, Line } from '@react-three/drei'
import { useRef } from 'react'
import type { Group } from 'three'

const nodes: [number, number, number][] = [
  [-2.1, 0, 0],
  [0, 0, 0],
  [2.1, 0, 0],
  [0, 0, -2.2],
  [0, 0, 2.2],
]

function Network() {
  const group = useRef<Group>(null)
  useFrame(({ pointer }) => {
    if (!group.current) return
    group.current.rotation.y +=
      (pointer.x * 0.09 - group.current.rotation.y) * 0.025
    group.current.rotation.x +=
      (pointer.y * 0.035 - group.current.rotation.x) * 0.025
  })
  return (
    <group ref={group}>
      {nodes.map((position, index) => (
        <group key={index} position={position}>
          <mesh>
            <boxGeometry
              args={[
                index === 1 ? 1.15 : 0.85,
                index === 1 ? 1.05 : 0.6,
                index === 1 ? 1.15 : 0.85,
              ]}
            />
            <meshStandardMaterial
              color={index === 1 ? '#171717' : '#fff'}
              roughness={0.4}
              metalness={0.08}
            />
            <Edges color={index === 1 ? '#888' : '#b6b6b6'} />
          </mesh>
          <mesh position={[0, 0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.1, 0.13, 32]} />
            <meshBasicMaterial color={index === 1 ? '#0070f3' : '#777'} />
          </mesh>
        </group>
      ))}
      {nodes
        .filter((_, i) => i !== 1)
        .map((position, i) => (
          <Line
            key={i}
            points={[[0, -0.15, 0], position]}
            color="#929292"
            lineWidth={1}
            dashed
            dashSize={0.1}
            gapSize={0.09}
          />
        ))}
      <gridHelper
        args={[10, 20, '#e1e1e1', '#eaeaea']}
        position={[0, -0.56, 0]}
      />
    </group>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [6.4, 5.6, 7.2], fov: 34 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={1.8} />
      <directionalLight position={[5, 8, 3]} intensity={3} />
      <Network />
    </Canvas>
  )
}
