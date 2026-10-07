import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'
import type { SceneKind } from './AtelierScene'
const Scene = lazy(()=>import('./AtelierScene'))
class SceneBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false}
  static getDerivedStateFromError(){return {failed:true}}
  render(){return this.state.failed?<div className="scene-fallback">A study in precious form</div>:this.props.children}
}
export function SceneStage({kind='collection',label='A study in form',interactive=true}:{kind?:SceneKind;label?:string;interactive?:boolean}) {
  const ref=useRef<HTMLDivElement>(null)
  const [visible,setVisible]=useState(false)
  const [pointer,setPointer]=useState({x:0,y:0})
  const [progress,setProgress]=useState(0)
  const [tone,setTone]=useState(kind==='custom'?'#d4a18b':'#d9b56d')
  const [exploded,setExploded]=useState(kind==='journey')
  const reduced=!!useReducedMotion()
  useEffect(()=>{
    const observer=new IntersectionObserver(([e])=>setVisible(e.isIntersecting),{rootMargin:'80px'})
    if(ref.current)observer.observe(ref.current)
    return ()=>observer.disconnect()
  },[])
  useEffect(()=>{
    if(!visible||reduced)return
    let frame=0
    const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{if(ref.current){const r=ref.current.getBoundingClientRect();setProgress(Math.max(-1,Math.min(1,(innerHeight/2-r.top-r.height/2)/innerHeight)))}})}
    addEventListener('scroll',update,{passive:true});update()
    return ()=>{removeEventListener('scroll',update);cancelAnimationFrame(frame)}
  },[visible,reduced])
  return <div ref={ref} className={`scene-stage scene-${kind}`} onPointerMove={e=>{if(reduced||e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();setPointer({x:(e.clientX-r.left)/r.width*2-1,y:(e.clientY-r.top)/r.height*2-1})}} onPointerLeave={()=>setPointer({x:0,y:0})}>
    <div className="scene-halo"/>
    <div className="scene-render" aria-hidden="true"><SceneBoundary><Suspense fallback={<div className="scene-fallback">Loading the study…</div>}>{visible&&<Scene kind={kind} tone={tone} exploded={exploded} pointer={pointer} progress={progress} reduced={reduced}/>}</Suspense></SceneBoundary></div>
    <span className="scene-label">{label} <span> / Digital material study</span></span>
    {interactive&&<div className="scene-controls"><div className="swatches" aria-label="Preview metal finish">{[['#d9b56d','Yellow gold'],['#d5d7dc','White gold'],['#d4a18b','Rose gold']].map(([color,name])=><button type="button" key={color} style={{background:color}} aria-label={name} aria-pressed={tone===color} onClick={()=>setTone(color)}/>)}</div><button className="study-toggle" aria-pressed={exploded} onClick={()=>setExploded(!exploded)}>{exploded?'Assembled form':'Explore the layers'} <span>{exploded?'−':'+'}</span></button></div>}
  </div>
}
export function ExperienceMotion(){
  const reduced=useReducedMotion()
  useEffect(()=>{
    if(reduced)return
    const elements=document.querySelectorAll('.intro>div,.capability,.type,.jewellery-title,.category-list>a,.portfolio-top,.journey>div,.journey>p,.custom-content,.contact>div,.enquiry-form')
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');observer.unobserve(e.target)}}),{threshold:.08})
    elements.forEach(el=>{el.classList.add('reveal-ready');observer.observe(el)})
    return ()=>{observer.disconnect();elements.forEach(el=>el.classList.remove('reveal-ready'))}
  },[reduced])
  return null
}
