import { lazy, Suspense } from 'react'
import LoadBoundary from './LoadBoundary'

// Declaring loaders does not start a request. Only the selected component mounts.
const playgrounds = {
  petcoupon: lazy(() => import('./playgrounds/PetCouponPlayground')),
  'vector-db-benchmark': lazy(
    () => import('./playgrounds/VectorBenchmarkPlayground'),
  ),
}

export default function ProjectPlayground({
  projectId,
}: {
  projectId: string
}) {
  const Playground = playgrounds[projectId as keyof typeof playgrounds]
  if (!Playground) return null
  return (
    <div className="project-playground" id="system-playground">
      <LoadBoundary key={projectId} label="분석 자료">
        <Suspense
          fallback={
            <div className="load-state" role="status">
              분석 자료를 불러오는 중입니다…
            </div>
          }
        >
          <Playground />
        </Suspense>
      </LoadBoundary>
    </div>
  )
}
