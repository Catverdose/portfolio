import { projects } from './projects'

export interface GraphPoint {
  x: number
  y: number
}
// Fits the map viewport unscaled from the 1100px graph breakpoint up,
// so node text renders at its CSS size.
export const graphSize = { width: 1080, height: 650 }
export const graphCenter: GraphPoint = { x: 50, y: 53 }

// Top row: featured work. Sides: experiments that grew out of it. Bottom: the rest.
const positions: Record<string, GraphPoint> = {
  ubot: { x: 20, y: 20 },
  'engineering-memory': { x: 50, y: 16 },
  petcoupon: { x: 80, y: 20 },
  'vector-db-benchmark': { x: 14, y: 58 },
  concurrency: { x: 86, y: 58 },
  'llm-serving': { x: 33, y: 88 },
  planly: { x: 67, y: 88 },
}
export const graphNodes = projects.map((project) => ({
  ...positions[project.id],
  id: project.id,
  question: project.question,
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
  createEdge('ubot', 'vector-db-benchmark', '벡터 DB 선정 근거', {
    x: 8,
    y: 38,
  }),
  createEdge('ubot', 'llm-serving', '서빙 엔진 검증', { x: 37, y: 54 }),
  createEdge('petcoupon', 'concurrency', '서비스 → 개인 검증', {
    x: 92,
    y: 38,
  }),
]
export function isConnected(edge: GraphEdge, activeId: string | null) {
  return edge.source === activeId || edge.target === activeId
}
