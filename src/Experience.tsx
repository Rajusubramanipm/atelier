import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'
import type { SceneKind } from './AtelierScene'
const Scene = lazy(()=>import('./AtelierScene'))
const sceneImages: Record<SceneKind,string> = {
  hero: '/images/intro_gold_craft.jpg',
  craft: '/images/intro_gold_craft.jpg',
  collection: '/images/pure_gold_pendant.jpg',
  journey: '/images/pure_gold_haaram.jpg',
  custom: '/images/pure_gold_ring.jpg'
}
const sceneImage=(id:string,width:number)=>id.startsWith('/')?id:`https://images.unsplash.com/${id}?auto=format&fit=crop&fm=webp&w=${width}&q=78`
function useMobileExperience(){
  const [mobile,setMobile]=useState(()=>typeof matchMedia==='function'&&matchMedia('(max-width: 800px), (pointer: coarse)').matches)
  useEffect(()=>{
    const query=matchMedia('(max-width: 800px), (pointer: coarse)')
    const update=()=>setMobile(query.matches)
    query.addEventListener('change',update)
    return()=>query.removeEventListener('change',update)
  },[])
  return mobile
}
class SceneBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false}
  static getDerivedStateFromError(){return {failed:true}}
  render(){return this.state.failed?<div className="scene-fallback">A study in precious form</div>:this.props.children}
}
export function SceneStage({kind='collection',label='A study in form',interactive=true}:{kind?:SceneKind;label?:string;interactive?:boolean}) {
  const ref=useRef<HTMLDivElement>(null)
  const [visible,setVisible]=useState(false)
  const [progress,setProgress]=useState(0)
  const [tone,setTone]=useState(kind==='custom'?'#e0a894':'#dfba53')
  const [exploded,setExploded]=useState(kind==='journey')
  // Enable 3D rendering on mobile by default so users see the glorious rotating gold sculpture
  const [mobile3d,setMobile3d]=useState(true)
  const mobile=useMobileExperience()
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
  const render3d=visible&&(!mobile||mobile3d)&&!reduced
  const imageId=sceneImages[kind]
  return <div ref={ref} className={`scene-stage scene-${kind} ${mobile&&!mobile3d?'scene-poster-mode':''}`}>
    <div className="scene-halo"/>
    {mobile&&!mobile3d&&<img className="scene-poster" src={sceneImage(imageId,720)} srcSet={`${sceneImage(imageId,480)} 480w, ${sceneImage(imageId,720)} 720w, ${sceneImage(imageId,960)} 960w`} sizes="100vw" alt="" loading={kind==='hero'?'eager':'lazy'} fetchPriority={kind==='hero'?'high':'auto'} decoding="async"/>}
    <div className="scene-render" aria-hidden="true"><SceneBoundary><Suspense fallback={<div className="scene-fallback">Preparing the 3D study…</div>}>{render3d&&<Scene kind={kind} tone={tone} exploded={exploded} progress={progress} reduced={reduced} mobile={mobile}/>}</Suspense></SceneBoundary></div>
    <span className="scene-label">{label} <span> / Digital material study</span></span>
    {interactive&&<div className="scene-controls"><div className="swatches" aria-label="Preview gold finish">{[['#dfba53','24K Pure Imperial Gold'],['#f5d372','22K Radiance Gold'],['#c9933b','22K Antique Temple Gold'],['#e0a894','22K Warm Rose Gold']].map(([color,name])=><button type="button" key={color} style={{background:color}} aria-label={name} aria-pressed={tone===color} onClick={()=>setTone(color)}/>)}</div><button className="study-toggle" aria-pressed={exploded} onClick={()=>setExploded(!exploded)}>{exploded?'Assembled form':'Explore the layers'} <span>{exploded?'−':'+'}</span></button></div>}
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
