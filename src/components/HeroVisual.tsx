import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import {
  graphCenter,
  graphEdges,
  graphNodes,
  graphSize,
  isConnected,
} from '../data/projectGraph'
import type { Project } from '../data/projects'
import Icon from './Icon'
import './project-graph.css'

const categoryNames = {
  featured: '대표 프로젝트',
  experiment: '검증 실험',
  supporting: '협업 · 확장',
}

export default function HeroVisual({
  onSelectProject,
}: {
  onSelectProject?: (project: Project) => void
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [size, setSize] = useState({
    width: graphSize.width,
    height: graphSize.height,
  })
  const viewport = useRef<HTMLDivElement>(null)
  const activeId = hoveredId ?? focusedId
  const scale = Math.min(
    size.width / graphSize.width,
    size.height / graphSize.height,
    1,
  )

  useEffect(() => {
    if (!viewport.current) return
    const observer = new ResizeObserver(([entry]) =>
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      }),
    )
    observer.observe(viewport.current)
    return () => observer.disconnect()
  }, [])

  function openProject(event: MouseEvent<HTMLAnchorElement>, project: Project) {
    if (
      onSelectProject &&
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      event.preventDefault()
      onSelectProject(project)
    }
  }

  return (
    <section
      id="project-map"
      className="project-map"
      aria-labelledby="project-map-title"
    >
      <div className="project-map-heading">
        <div>
          <span className="map-eyebrow mono">CONNECTED WORK / 06 PROJECTS</span>
          <h2 id="project-map-title">문제에서 프로젝트로.</h2>
          <p id="graph-instructions">
            프로젝트를 선택해 설계와 검증 근거를 확인하세요.
          </p>
        </div>
      </div>
      <div
        ref={viewport}
        className="map-viewport"
        role="region"
        aria-label="Catverdose와 6개 프로젝트의 연결 지도"
        aria-describedby="graph-instructions"
      >
        <div
          className="map-world"
          style={{
            width: graphSize.width,
            height: graphSize.height,
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}
        >
          <svg
            className="map-connections"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {graphEdges.map((edge) => (
              <path
                key={edge.id}
                d={`M ${edge.start.x} ${edge.start.y} Q ${edge.control.x} ${edge.control.y} ${edge.end.x} ${edge.end.y}`}
                className={`map-edge${edge.related ? ' is-related' : ''}${isConnected(edge, activeId) ? ' is-active' : activeId ? ' is-muted' : ''}`}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
          {graphEdges
            .filter((edge) => edge.labelPosition)
            .map((edge) => (
              <span
                key={edge.id}
                className={`map-connection-label${isConnected(edge, activeId) ? ' is-active' : activeId ? ' is-muted' : ''}`}
                style={{
                  left: `${edge.labelPosition!.x}%`,
                  top: `${edge.labelPosition!.y}%`,
                }}
              >
                {edge.label}
              </span>
            ))}
          <div
            className="map-hub"
            style={{ left: `${graphCenter.x}%`, top: `${graphCenter.y}%` }}
          >
            <span className="map-hub-mark" aria-hidden="true">
              <Icon name="code" size={20} />
            </span>
            <strong>
              Catverdose<span>.</span>
            </strong>
            <span className="mono">BACKEND DEVELOPER</span>
          </div>
          {graphNodes.map((node) => {
            const connected =
              activeId === node.id ||
              graphEdges.some(
                (edge) =>
                  edge.related &&
                  isConnected(edge, activeId) &&
                  isConnected(edge, node.id),
              )
            return (
              <a
                key={node.id}
                href={`#/projects/${node.id}`}
                className={`map-node map-node-${node.project.tier}${activeId === node.id ? ' is-active' : activeId && !connected ? ' is-muted' : ''}`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onClick={(event) => openProject(event, node.project)}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setFocusedId(node.id)}
                onBlur={() => setFocusedId(null)}
                aria-label={`${node.project.title} 프로젝트 페이지 — ${node.question}`}
              >
                <span className="map-node-category">
                  <span>{categoryNames[node.project.tier]}</span>
                  <span className="mono">{node.project.number}</span>
                </span>
                <strong>{node.project.title}</strong>
                <span className="map-node-question">{node.question}</span>
                <span className="map-node-arrow" aria-hidden="true">
                  <Icon name="arrow" size={16} />
                </span>
                <span className="map-node-port" aria-hidden="true" />
              </a>
            )
          })}
          <span className="map-coordinate mono" aria-hidden="true">
            CATVERDOSE / ENGINEERING MAP
          </span>
        </div>
      </div>
      <nav className="map-mobile-links" aria-label="프로젝트 바로 가기">
        {graphNodes.map((node) => (
          <a
            key={node.id}
            href={`#/projects/${node.id}`}
            className={`map-link-${node.project.tier}`}
            onClick={(event) => openProject(event, node.project)}
            aria-label={`${node.project.title} 프로젝트 페이지 — ${node.question}`}
          >
            <span className="map-node-category">
              <span>{categoryNames[node.project.tier]}</span>
              <span className="mono">{node.project.number}</span>
            </span>
            <strong>{node.project.title}</strong>
            <span className="map-link-question">{node.question}</span>
            <Icon name="arrow" size={16} />
          </a>
        ))}
      </nav>
      <div className="map-footer">
        <span>서비스의 문제를 실험으로 검증하고, 다음 설계에 반영했습니다.</span>
        <span className="map-legend">
          <i aria-hidden="true" />
          점선은 연관된 문제와 기술
        </span>
      </div>
    </section>
  )
}
