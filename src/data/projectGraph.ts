import { projects } from './projects'

export interface GraphPoint {
  x: number
  y: number
}
// Fits the map viewport unscaled from the 1100px graph breakpoint up,
// so node text renders at its CSS size.
export const graphSize = { width: 1080, height: 650 }
export const graphCenter: GraphPoint = { x: 50, y: 53 }

const positions: Record<string, GraphPoint> = {
  'engineering-memory': { x: 25, y: 22 },
  petcoupon: { x: 75, y: 22 },
  'vector-db-benchmark': { x: 16, y: 58 },
  concurrency: { x: 84, y: 58 },
  ubot: { x: 30, y: 87 },
  planly: { x: 70, y: 87 },
}
const questions: Record<string, string> = {
  'engineering-memory': '늦게 끝난 색인이 도착한다면?',
  petcoupon: '구독자 한 명이 느려진다면?',
  concurrency: '마지막 쿠폰에 요청이 몰린다면?',
  'vector-db-benchmark': '검색 품질을 더 높이면 얼마나 느려질까?',
  ubot: '개발과 테스트 환경이 다르다면?',
  planly: '내 Todo에 다른 사람이 접근한다면?',
}
export const graphNodes = projects.map((project) => ({
  ...positions[project.id],
  id: project.id,
  question: questions[project.id],
  project,
}))

export interface GraphEdge {
  id: string
  source: string
  target: string
  start: GraphPoint
  end: GraphPoint
  control: GraphPoint
  related: boolean
  label?: string
  labelPosition?: GraphPoint
}

function createEdge(
  source: string,
  target: string,
  label?: string,
  control?: GraphPoint,
): GraphEdge {
  const start = source === 'catverdose' ? graphCenter : positions[source]
  const end = positions[target]
  const midpoint = control ?? {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  }
  return {
    id: `${source}:${target}`,
    source,
    target,
    start,
    end,
    control: midpoint,
    related: Boolean(label),
    label,
    labelPosition: label
      ? {
          x: start.x * 0.25 + midpoint.x * 0.5 + end.x * 0.25,
          y: start.y * 0.25 + midpoint.y * 0.5 + end.y * 0.25,
        }
      : undefined,
  }
}

// These connections describe related work, not runtime dependencies.
export const graphEdges = [
  ...graphNodes.map((node) => createEdge('catverdose', node.id)),
  createEdge('engineering-memory', 'vector-db-benchmark', '검색 품질 · 성능', {
    x: 14,
    y: 36,
  }),
  createEdge('petcoupon', 'concurrency', '서비스 → 개인 검증', {
    x: 86,
    y: 36,
  }),
  createEdge('vector-db-benchmark', 'ubot', '기술 선정 근거', { x: 19, y: 76 }),
]
export function isConnected(edge: GraphEdge, activeId: string | null) {
  return edge.source === activeId || edge.target === activeId
}
