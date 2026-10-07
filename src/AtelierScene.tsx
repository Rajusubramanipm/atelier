import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { Group, MathUtils } from 'three'

export type SceneKind = 'hero' | 'craft' | 'collection' | 'journey' | 'custom'
type Props = { kind: SceneKind; tone: string; exploded: boolean; pointer: { x: number; y: number }; progress: number; reduced: boolean }
function Sculpture({ kind, tone, exploded, pointer, progress, reduced }: Props) {
  const root = useRef<Group>(null)
  const layers = useRef<Group>(null)
  useFrame((_, delta) => {
    if (!root.current || !layers.current) return
    const speed = reduced ? 1 : 1 - Math.exp(-delta * 5)
    root.current.rotation.x = MathUtils.lerp(root.current.rotation.x, .45 + pointer.y * .18 + progress * .3, speed)
    root.current.rotation.y = MathUtils.lerp(root.current.rotation.y, -.35 + pointer.x * .45 + progress * .6, speed)
    root.current.rotation.z = -.38
    layers.current.children.forEach((child, i) => {
      child.position.z = MathUtils.lerp(child.position.z, (i - 3) * (exploded ? .27 : .075), speed)
    })
  })
  const isCraft = kind === 'craft'
  return <group ref={root} rotation={[.45,-.35,-.38]} scale={kind==='collection'?[.85,1,.85]:kind==='custom'?[.9,.9,.9]:[1,1,1]}>
    <group ref={layers}>
      {Array.from({length:7},(_,i)=><mesh key={i} position={[0,0,(i-3)*.075]}>
        <torusGeometry args={[1.18 + Math.sin(i/6*Math.PI)*.07, i===0||i===6?.043:.032, 12, 128]}/>
        <meshStandardMaterial color={tone} metalness={.94} roughness={.24} wireframe={isCraft && exploded}/>
      </mesh>)}
    </group>
    {Array.from({length:32},(_,i)=>{
      const a=i/32*Math.PI*2
      return <group key={i} position={[Math.cos(a)*1.23,Math.sin(a)*1.23,0]} rotation={[0,0,a]}>
        <mesh><sphereGeometry args={[.061,10,8]}/><meshStandardMaterial color={tone} metalness={1} roughness={.22}/></mesh>
        <mesh position={[0,0,.285]}><octahedronGeometry args={[.046,0]}/><meshStandardMaterial color="#fff4d8" metalness={.7} roughness={.13}/></mesh>
      </group>
    })}
  </group>
}
export default function AtelierScene(props: Props) {
  return <Canvas dpr={[1,1.5]} camera={{position:[0,0,4.7],fov:42}} gl={{alpha:true,antialias:true,powerPreference:'low-power'}} frameloop={props.reduced?'demand':'always'}>
    <ambientLight intensity={.45}/><directionalLight position={[3,4,5]} intensity={3}/>
    <Environment resolution={128} frames={1}>
      <Lightformer intensity={5} position={[0,4,3]} scale={[8,2,1]}/>
      <Lightformer intensity={3} position={[-4,0,2]} rotation={[0,Math.PI/3,0]} scale={[2,6,1]}/>
      <Lightformer intensity={2} position={[3,-2,2]} scale={[2,4,1]} color="#efd9b0"/>
    </Environment>
    <Sculpture {...props}/>
  </Canvas>
}
