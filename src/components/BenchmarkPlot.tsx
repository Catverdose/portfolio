import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import {
  benchmarkDatabases,
  benchmarkPoints,
  benchmarkReport,
  benchmarkSource,
} from '../data/vectorBenchmark'
import type { BenchmarkDatabase } from '../data/vectorBenchmark'
import './benchmark-plot.css'

const chartHeight = 258
const top = 28
const bottom = 210
const left = 42
const dbLabel = (id: BenchmarkDatabase) =>
  benchmarkDatabases.find((database) => database.id === id)!.label
// Most settings sit above 0.95 Recall, where the full axis crowds them together.
const recallRanges = {
  all: { min: 0.3, ticks: [0.4, 0.6, 0.8, 1], narrowTicks: [0.4, 0.7, 1] },
  high: {
    min: 0.95,
    ticks: [0.95, 0.96, 0.97, 0.98, 0.99, 1],
    narrowTicks: [0.95, 0.975, 1],
  },
}
const tickLabel = (tick: number) => (tick === 1 ? '1.0' : String(tick))

export default function BenchmarkPlot() {
  const uid = useId()
  const frameRef = useRef<HTMLDivElement>(null)
  const pointRefs = useRef<(SVGCircleElement | null)[]>([])
  const [width, setWidth] = useState(480)
  const [metric, setMetric] = useState<'p95' | 'qps'>('p95')
  const [database, setDatabase] = useState<BenchmarkDatabase | 'all'>('all')
  const [range, setRange] = useState<keyof typeof recallRanges>('all')
  const [selectedId, setSelectedId] = useState(0)
  const recallMin = recallRanges[range].min
  const visiblePoints = benchmarkPoints.filter(
    (point) => database === 'all' || point.database === database,
  )
  const plottedPoints = visiblePoints.filter(
    (point) => point.recall >= recallMin,
  )
  const selected =
    visiblePoints.find((point) => point.id === selectedId) ??
    plottedPoints[0] ??
    visiblePoints[0]
  const selectedPlotted = selected.recall >= recallMin
  // Roving tabindex target; the selection may be off-axis while zoomed.
  const focusId = selectedPlotted ? selected.id : plottedPoints[0]?.id
  const color = (id: BenchmarkDatabase) =>
    benchmarkDatabases.find((item) => item.id === id)!.color
  const x = (recall: number) =>
    left + ((recall - recallMin) / (1 - recallMin)) * (width - left - 20)
  const y = (value: number) =>
    bottom -
    (metric === 'p95'
      ? (Math.log10(value) - Math.log10(3)) / (2 - Math.log10(3))
      : value / 4000) *
      (bottom - top)
  const yTicks =
    metric === 'p95' ? [3, 10, 30, 100] : [0, 1000, 2000, 3000, 4000]
  const xTicks =
    width < 350 ? recallRanges[range].narrowTicks : recallRanges[range].ticks

  function changeRange(next: keyof typeof recallRanges) {
    setRange(next)
    const nextMin = recallRanges[next].min
    if (selected.recall < nextMin) {
      const first = visiblePoints.find((point) => point.recall >= nextMin)
      if (first) setSelectedId(first.id)
    }
  }

  useEffect(() => {
    if (!frameRef.current) return
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.max(220, entry.contentRect.width)),
    )
    observer.observe(frameRef.current)
    return () => observer.disconnect()
  }, [])

  function movePoint(
    event: KeyboardEvent<SVGCircleElement>,
    currentId: number,
  ) {
    const index = plottedPoints.findIndex((point) => point.id === currentId)
    let nextIndex = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
      nextIndex = (index + 1) % plottedPoints.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
      nextIndex = (index - 1 + plottedPoints.length) % plottedPoints.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = plottedPoints.length - 1
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setSelectedId(currentId)
      return
    } else return
    event.preventDefault()
    const next = plottedPoints[nextIndex]
    setSelectedId(next.id)
    pointRefs.current[next.id]?.focus()
  }

  return (
    <div className="benchmark-plot">
      <div className="benchmark-toolbar">
        <p className="benchmark-count">
          <strong>{plottedPoints.length}</strong> / 124개 설정
          {plottedPoints.length < visiblePoints.length && (
            <span>
              {' '}
              · Recall {recallMin} 미만{' '}
              {visiblePoints.length - plottedPoints.length}개 제외
            </span>
          )}
        </p>
        <div className="benchmark-controls">
          <div
            className="benchmark-metric"
            role="group"
            aria-label="Recall 범위"
          >
            <button
              type="button"
              aria-pressed={range === 'all'}
              onClick={() => changeRange('all')}
            >
              전체 범위
            </button>
            <button
              type="button"
              aria-pressed={range === 'high'}
              onClick={() => changeRange('high')}
            >
              0.95–1.0 확대
            </button>
          </div>
          <div
            className="benchmark-metric"
            role="group"
            aria-label="산포도 세로축"
          >
            <button
              type="button"
              aria-pressed={metric === 'p95'}
              onClick={() => setMetric('p95')}
            >
              p95 지연
            </button>
            <button
              type="button"
              aria-pressed={metric === 'qps'}
              onClick={() => setMetric('qps')}
            >
              QPS
            </button>
          </div>
        </div>
      </div>
      <div
        className="benchmark-legend"
        role="group"
        aria-label="데이터베이스 필터"
      >
        <button
          type="button"
          aria-pressed={database === 'all'}
          onClick={() => setDatabase('all')}
        >
          전체
        </button>
        {benchmarkDatabases.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={database === item.id}
            onClick={() => setDatabase(item.id)}
            style={{ '--db-color': item.color } as CSSProperties}
          >
            <span className="benchmark-swatch" aria-hidden="true" />
            {item.label}
          </button>
        ))}
      </div>
      <div className="benchmark-chart-frame" ref={frameRef}>
        <svg
          className="benchmark-chart"
          viewBox={`0 0 ${width} ${chartHeight}`}
          role="group"
          aria-labelledby={`${uid}-title`}
          aria-describedby={`${uid}-description`}
        >
          <title id={`${uid}-title`}>
            혼합 Recall@10과 {metric === 'p95' ? 'p95 지연' : 'QPS'} 산포도
          </title>
          <desc id={`${uid}-description`}>
            같은 설정을 5회 재구축한 요약점입니다. 점을 선택하거나 방향키로
            이동하세요. 아래 설정 선택 메뉴로도 모든 점을 확인할 수 있습니다.
          </desc>
          <g className="benchmark-grid" aria-hidden="true">
            {yTicks.map((tick) => (
              <g key={tick}>
                <line x1={left} x2={width - 20} y1={y(tick)} y2={y(tick)} />
                <text x={left - 9} y={y(tick) + 3} textAnchor="end">
                  {tick.toLocaleString('en-US')}
                </text>
              </g>
            ))}
            {xTicks.map((tick) => (
              <g key={tick}>
                <line x1={x(tick)} x2={x(tick)} y1={top} y2={bottom} />
                <text x={x(tick)} y={bottom + 17} textAnchor="middle">
                  {tickLabel(tick)}
                </text>
              </g>
            ))}
            <text x={left} y={13} className="benchmark-axis-title">
              {metric === 'p95'
                ? '혼합 p95 (ms) · 로그 축'
                : '혼합 QPS · 동시성 10'}
            </text>
            <text
              x={(left + width - 20) / 2}
              y={250}
              textAnchor="middle"
              className="benchmark-axis-title"
            >
              혼합 Recall@10 {range === 'high' ? '· 0.95–1.0 확대 ' : ''}→
            </text>
          </g>
          {selectedPlotted && (
            <g className="benchmark-range" aria-hidden="true">
              <line
                x1={x(Math.max(selected.recallMin, recallMin))}
                x2={x(selected.recallMax)}
                y1={y(selected[metric])}
                y2={y(selected[metric])}
              />
              {[selected.recallMin, selected.recallMax]
                .filter((value) => value >= recallMin)
                .map((value, index) => (
                  <line
                    key={index}
                    x1={x(value)}
                    x2={x(value)}
                    y1={y(selected[metric]) - 4}
                    y2={y(selected[metric]) + 4}
                  />
                ))}
            </g>
          )}
          {plottedPoints.map((point) => (
            <circle
              key={point.id}
              ref={(element) => {
                pointRefs.current[point.id] = element
              }}
              role="button"
              tabIndex={focusId === point.id ? 0 : -1}
              aria-pressed={selected.id === point.id}
              aria-label={`${dbLabel(point.database)}, ${point.configuration}, ${point.parameter}, Recall ${point.recall.toFixed(6)}, p95 ${point.p95}밀리초, QPS ${point.qps}`}
              cx={x(point.recall)}
              cy={y(point[metric])}
              r={selected.id === point.id ? 5.5 : 3.5}
              fill={color(point.database)}
              className={`benchmark-point${selected.id === point.id ? ' is-selected' : ''}`}
              onClick={() => setSelectedId(point.id)}
              onFocus={() => setSelectedId(point.id)}
              onKeyDown={(event) => movePoint(event, point.id)}
            >
              <title>{`${dbLabel(point.database)} · ${point.configuration} · ${point.parameter}\nRecall ${point.recall.toFixed(6)} / p95 ${point.p95} ms / QPS ${point.qps}`}</title>
            </circle>
          ))}
        </svg>
      </div>
      <div className="benchmark-selection">
        <label htmlFor={`${uid}-setting`}>설정 선택</label>
        <select
          id={`${uid}-setting`}
          value={selected.id}
          onChange={(event) => setSelectedId(Number(event.target.value))}
        >
          {visiblePoints.map((point) => (
            <option key={point.id} value={point.id}>
              {dbLabel(point.database)} · {point.configuration} ·{' '}
              {point.parameter}
            </option>
          ))}
        </select>
      </div>
      <div className="benchmark-detail" aria-live="polite" aria-atomic="true">
        <div className="benchmark-values">
          <span>
            Recall <strong>{selected.recall.toFixed(6)}</strong>
          </span>
          <span>
            p95{' '}
            <strong>
              {selected.p95.toFixed(3)} <small>ms</small>
            </strong>
          </span>
          <span>
            QPS{' '}
            <strong>
              {selected.qps.toLocaleString('en-US', {
                minimumFractionDigits: 1,
              })}
            </strong>
          </span>
        </div>
        <p>
          5회 Recall 범위 {selected.recallMin.toFixed(6)}–
          {selected.recallMax.toFixed(6)}
        </p>
        <p>
          워밍업 경고 {selected.warmupWarnings}/5 · Recall 변동 관측{' '}
          {selected.recallWarnings}/5
        </p>
      </div>
      <p className="benchmark-caption">
        점 하나는 같은 설정의 5회 요약입니다. Recall은 평균, p95·QPS는
        중앙값이며 실제 한 회차를 뜻하지 않습니다. 선택점의 가로선은 Recall
        최솟값–최댓값입니다.
      </p>
      <p className="benchmark-caption">
        합성 청크 10,000개 · 동시성 10 · 배포 예산 4 vCPU / 8 GiB. 경고를 포함한
        620개 측정이며 제품 선정 결론이 아닙니다.
      </p>
      <div className="benchmark-sources">
        <a href={benchmarkReport} target="_blank" rel="noreferrer">
          측정 조건과 한계 ↗
        </a>
        <a href={benchmarkSource} target="_blank" rel="noreferrer">
          124개 설정 원본 ↗
        </a>
        <span>2026.09.13</span>
      </div>
    </div>
  )
}
