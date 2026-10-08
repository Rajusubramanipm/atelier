import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Group, MathUtils } from 'three'

export type SceneKind = 'hero' | 'craft' | 'collection' | 'journey' | 'custom'
type Props = { kind: SceneKind; tone: string; exploded: boolean; progress: number; reduced: boolean; mobile: boolean }

function Sculpture({ kind, tone, exploded, progress, reduced, mobile }: Props) {
  const root = useRef<Group>(null)
  const layers = useRef<Group>(null)

  useFrame((state, delta) => {
    if (!root.current || !layers.current) return
    const speed = reduced ? 1 : 1 - Math.exp(-delta * 5)
    const t = state.clock.getElapsedTime()

    // Smooth interactive tilt + gentle golden wave breathing
    const waveX = Math.sin(t * 0.8) * 0.04
    const waveY = Math.cos(t * 0.7) * 0.05

    root.current.rotation.x = MathUtils.lerp(root.current.rotation.x, 0.45 + state.pointer.y * 0.18 + progress * 0.3 + waveX, speed)
    root.current.rotation.y = MathUtils.lerp(root.current.rotation.y, -0.35 + state.pointer.x * 0.45 + progress * 0.6 + waveY, speed)
    root.current.rotation.z = -0.38 + Math.sin(t * 0.5) * 0.02

    layers.current.children.forEach((child, i) => {
      // Wave pulse through concentric gold rings
      const waveOffset = Math.sin(t * 1.8 + i * 0.5) * 0.015
      const targetZ = (i - 3) * (exploded ? 0.28 : 0.075) + waveOffset
      child.position.z = MathUtils.lerp(child.position.z, targetZ, speed)
    })
  })

  const isCraft = kind === 'craft'
  const segments = mobile ? 64 : 112
  const accents = mobile ? 20 : 32
  // Ensure glowing gold hue default
  const goldTone = tone || '#DFBA53'

  return (
    <group ref={root} rotation={[0.45, -0.35, -0.38]} scale={kind === 'collection' ? [0.88, 1.02, 0.88] : kind === 'custom' ? [0.92, 0.92, 0.92] : [1, 1, 1]}>
      <group ref={layers}>
        {Array.from({length: 7}, (_, i) => (
          <mesh key={i} position={[0, 0, (i - 3) * 0.075]}>
            <torusGeometry args={[1.18 + Math.sin((i / 6) * Math.PI) * 0.07, i === 0 || i === 6 ? 0.045 : 0.034, mobile ? 8 : 12, segments]} />
            <meshStandardMaterial
              color={goldTone}
              metalness={0.97}
              roughness={0.18}
              wireframe={isCraft && exploded}
            />
          </mesh>
        ))}
      </group>

      {Array.from({length: accents}, (_, i) => {
        const a = (i / accents) * Math.PI * 2
        return (
          <group key={i} position={[Math.cos(a) * 1.23, Math.sin(a) * 1.23, 0]} rotation={[0, 0, a]}>
            <mesh>
              <sphereGeometry args={[0.062, 10, 8]} />
              <meshStandardMaterial color={goldTone} metalness={0.98} roughness={0.16} />
            </mesh>
            <mesh position={[0, 0, 0.285]}>
              <octahedronGeometry args={[0.048, 0]} />
              <meshStandardMaterial color={goldTone} metalness={0.95} roughness={0.15} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

export default function AtelierScene(props: Props) {
  return (
    <Canvas
      dpr={props.mobile ? [1, 1.15] : [1, 1.5]}
      camera={{position: [0, 0, 4.7], fov: 42}}
      gl={{alpha: true, antialias: !props.mobile, powerPreference: 'low-power'}}
      frameloop={props.reduced ? 'demand' : 'always'}
    >
      <ambientLight intensity={0.7} color="#fff6e0" />
      <directionalLight position={[3, 4, 5]} intensity={3.8} color="#fff2cc" />
      <pointLight position={[-3, -1, 3]} intensity={2.4} color="#ffd878" />
      <pointLight position={[2, -3, -2]} intensity={1.8} color="#b37814" />
      <Sculpture {...props} />
    </Canvas>
  )
}
