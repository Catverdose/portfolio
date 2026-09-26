import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

const HeroScene = lazy(() => import('./HeroScene'))

class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function HeroVisual() {
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(true)
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!container.current) return
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    )
    observer.observe(container.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 900px)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      if (!desktop.matches || reduced.matches) {
        setEnabled(false)
        return
      }
      try {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl2')
        setEnabled(Boolean(gl))
        gl?.getExtension('WEBGL_lose_context')?.loseContext()
      } catch {
        setEnabled(false)
      }
    }
    const delay = window.setTimeout(update, 700)
    desktop.addEventListener('change', update)
    reduced.addEventListener('change', update)
    return () => {
      clearTimeout(delay)
      desktop.removeEventListener('change', update)
      reduced.removeEventListener('change', update)
    }
  }, [])

  return (
    <div
      ref={container}
      className="hero-visual"
      aria-label="문서, 색인, 벡터 DB, LLM으로 연결되는 백엔드 네트워크"
      role="img"
    >
      <div className="mesh-gradient" />
      <div className="visual-caption mono">
        <span>DESIGNED AROUND BOUNDARIES</span>
        <span>FIG. 01</span>
      </div>
      <div className="scene" aria-hidden="true">
        <svg className="static-network" viewBox="0 0 480 340">
          <g fill="none" stroke="#c5c5c5" strokeWidth="1">
            <path d="m30 185 210-110 210 110-210 110Z" strokeDasharray="3 5" />
            <path d="m240 80 0 215M30 185h420" strokeDasharray="3 5" />
          </g>
          <g fill="#fff" stroke="#aaa">
            <path d="m70 159 35-20 35 20v38l-35 20-35-20Zm0 0 35 20 35-20m-35 20v38" />
            <path d="m338 159 35-20 35 20v38l-35 20-35-20Zm0 0 35 20 35-20m-35 20v38" />
            <path d="m205 75 35-20 35 20v38l-35 20-35-20Zm0 0 35 20 35-20m-35 20v38" />
            <path d="m205 253 35-20 35 20v38l-35 20-35-20Zm0 0 35 20 35-20m-35 20v38" />
          </g>
          <g fill="#171717" stroke="#777">
            <path d="m193 155 47-27 47 27v52l-47 27-47-27Zm0 0 47 27 47-27m-47 27v52" />
          </g>
        </svg>
        {enabled && visible && (
          <div className="webgl-scene">
            <SceneBoundary>
              <Suspense fallback={null}>
                <HeroScene />
              </Suspense>
            </SceneBoundary>
          </div>
        )}
      </div>
      <div className="network-label label-document">
        <span className="node-index">01</span> Document
      </div>
      <div className="network-label label-gateway">
        <span className="node-index">02</span> Gateway
      </div>
      <div className="network-label label-database">
        <span className="node-index">03</span> Vector DB
      </div>
      <div className="network-label label-llm">
        <span className="node-index">04</span> LLM
      </div>
      <div className="visual-bottom mono">
        <span>CONSISTENCY AT EVERY STEP</span>
        <span>↗</span>
      </div>
    </div>
  )
}
