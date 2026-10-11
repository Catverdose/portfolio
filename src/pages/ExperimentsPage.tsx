import { useEffect, useRef } from 'react'
import {
  concurrencyResults,
  concurrencyRun,
  projects,
  servingResults,
  servingRun,
} from '../data/projects'
import type { Project } from '../data/projects'
import EvidenceLinks from '../components/EvidenceLinks'
import Icon from '../components/Icon'
import { ProjectActions } from '../components/SelectedWork'
import './work-pages.css'

const experimentCopy: Record<string, { question: string; body: string }> = {
  concurrency: {
    question: '초과 발급이 없으면, 성공일까요?',
    body: '재고 예약 전략 9개에 동일한 요청을 보냈습니다. 중복 발급뿐 아니라 대상자 전원 발급, 응답 분류, 재고 원장을 따로 확인했습니다.',
  },
  'vector-db-benchmark': {
    question: '검색 품질이 달라도, 속도를 비교할 수 있을까요?',
    body: '입력·자원·정답 기준을 고정했습니다. 실제 Recall이 비슷한 설정끼리 지연 시간과 처리량을 비교합니다.',
  },
  'llm-serving': {
    question: '어떤 엔진과 GPU면 초당 8건을 넘길까요?',
    body: '통신사 공개 수치를 역산해 기준선을 잡고, 엔진 4종을 하나씩 켜고 끄며 세 환경에서 측정했습니다.',
  },
}

function ConcurrencyPreview() {
  const rows = concurrencyResults.filter((row) =>
    ['JVM_LOCK', 'DIRECT', 'REDIS_DECR', 'REDIS_LUA', 'REDIS_WATCH'].includes(
      row[0],
    ),
  )
  return (
    <div className="experiment-preview">
      <div
        className="table-scroll"
        tabIndex={0}
        role="region"
        aria-label="동시성 실험 발급 대상자 요약표"
      >
        <table className="preview-table">
          <caption>
            <span className="mono">RUN r0816dup1 · VU 50 · 정순 실행</span>
            회원 10,000명 × 3회 요청 · 재고 10,000개 · 로컬 단일 호스트 · 9개
            전략 중 5개
          </caption>
          <thead>
            <tr>
              <th scope="col">전략</th>
              <th scope="col">발급 대상자</th>
              <th scope="col">판정</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]}>
                <th scope="row">{row[0]}</th>
                <td>{row[1]}</td>
                <td>
                  <span
                    className={row[4] === '통과' ? 'result-pass' : 'result-fail'}
                  >
                    {row[4]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="experiment-insight">
        <Icon name="terminal" size={18} />
        <div>
          <strong>발급 인원과 재고 원장은 별개입니다.</strong>
          <p>
            DIRECT는 발급 대상자가 10,000명이어도 재고 차감이 유실됐습니다.
            DECR·LUA는 최종 원장이 맞아도 일부 정상 회원이 쿠폰을 받지
            못했습니다.
          </p>
        </div>
      </div>
      <details className="experiment-notes">
        <summary>실험 조건과 한계 2가지</summary>
        <p className="experiment-caveat">
          JVM_LOCK의 통과는 단일 인스턴스 조건입니다. 조건별 1회 실행과 역순
          재실행으로 성능 순위를 확정하지 않았습니다.
        </p>
        <p className="experiment-caveat">{concurrencyRun.note}</p>
      </details>
    </div>
  )
}

function BenchmarkPreview() {
  return (
    <div className="experiment-preview">
      <div className="card-benchmark">
        <div>
          <strong>5</strong>
          <span>Databases</span>
        </div>
        <div>
          <strong>124</strong>
          <span>Settings</span>
        </div>
        <div>
          <strong>620</strong>
          <span>Measurements</span>
        </div>
        <p className="mono">SAME INPUT → SAME GROUND TRUTH</p>
      </div>
      <ol className="benchmark-method">
        <li>
          <span>01</span>
          <div>
            <strong>입력과 정답 고정</strong>
            <p>합성 청크 10,000개 · exact cosine 기준</p>
          </div>
        </li>
        <li>
          <span>02</span>
          <div>
            <strong>같은 구성으로 5회 재구축</strong>
            <p>배포 예산 4 vCPU · 8 GiB, 경고도 보존</p>
          </div>
        </li>
        <li>
          <span>03</span>
          <div>
            <strong>비슷한 Recall에서 비교</strong>
            <p>지연·처리량과 반복 변동을 함께 해석</p>
          </div>
        </li>
      </ol>
      <div className="experiment-insight">
        <Icon name="database" size={18} />
        <div>
          <strong>성능은 Qdrant, 선택은 pgvector.</strong>
          <p>
            Recall 0.99 이상에서 Qdrant가 p95 4.1ms로 가장 빨랐고 pgvector는
            32.2ms였습니다. 예상 규모에서는 이 차이보다 벡터 DB를 하나 더
            운영하는 부담이 크다고 보고, 팀은 이미 쓰는 PostgreSQL의 pgvector를
            선택했습니다.
          </p>
        </div>
      </div>
      <p className="experiment-caveat">
        상세 페이지에서 124개 설정의 산포도를 직접 탐색할 수 있습니다.
      </p>
    </div>
  )
}

function ServingPreview() {
  const rows = servingResults.slice(0, 3)
  return (
    <div className="experiment-preview">
      <div
        className="table-scroll"
        tabIndex={0}
        role="region"
        aria-label="LLM 서빙 실험 환경별 요약표"
      >
        <table className="preview-table">
          <caption>
            <span className="mono">HTTP 완료 RPS · 기준선 8</span>
            {servingRun.conditions}
          </caption>
          <thead>
            <tr>
              <th scope="col">환경</th>
              <th scope="col">vLLM</th>
              <th scope="col">SGLang</th>
              <th scope="col">판정</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]}>
                <th scope="row">{row[0]}</th>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>
                  <span
                    className={row[3] === '통과' ? 'result-pass' : 'result-fail'}
                  >
                    {row[3]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="experiment-insight">
        <Icon name="layers" size={18} />
        <div>
          <strong>앞 엔진의 흔적부터 지웠습니다.</strong>
          <p>
            엔진을 내려도 GPU 메모리가 한동안 남는 것을 보고, 메모리가 비었는지
            확인한 뒤 다음 측정을 시작하게 했습니다. 내부 상한을 128까지 넓히면
            처리량은 오히려 낮아졌습니다.
          </p>
        </div>
      </div>
      <p className="experiment-caveat">{servingRun.note}</p>
    </div>
  )
}

/** 상단 메뉴 Experiments가 여는 페이지입니다. 첫 화면에는 실험마다 결과 한 줄만 있습니다. */
export default function ExperimentsPage({
  onOpen,
}: {
  onOpen: (project: Project) => void
}) {
  const title = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    title.current?.focus({ preventScroll: true })
  }, [])
  const experiments = projects.filter((project) => project.tier === 'experiment')
  return (
    <main id="main" className="page project-page">
      <div className="container">
        <nav className="project-breadcrumb" aria-label="현재 위치">
          <a href="#experiments">
            <span aria-hidden="true">←</span> 홈
          </a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">실험</span>
        </nav>
        <header className="work-page-header">
          <span className="eyebrow">ENGINEERING NOTES</span>
          <h1 ref={title} tabIndex={-1}>
            실험
          </h1>
          <p className="section-lead">
            서비스에서 만난 질문을 조건을 고정한 실험으로 이어갔습니다. 조건과
            남은 한계를 결과와 함께 적었습니다.
          </p>
        </header>
        <div className="experiments-grid experiments-page-grid">
          {experiments.map((project) => {
            const copy = experimentCopy[project.id]
            return (
              <article
                className="card experiment-card"
                id={`project-${project.id}`}
                key={project.id}
              >
                <div className="project-card-top">
                  <span className="project-number mono">/{project.number}</span>
                  <span className="badge">{project.typeLabel}</span>
                </div>
                <h2>{project.title}</h2>
                <p className="experiment-question">{copy.question}</p>
                <p className="work-description">{copy.body}</p>
                {project.id === 'concurrency' ? (
                  <ConcurrencyPreview />
                ) : project.id === 'vector-db-benchmark' ? (
                  <BenchmarkPreview />
                ) : (
                  <ServingPreview />
                )}
                <div className="experiment-bottom">
                  <EvidenceLinks links={project.proofs?.slice(0, 1)} compact />
                  <ProjectActions
                    project={project}
                    onOpen={onOpen}
                    label="전체 결과와 한계"
                  />
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </main>
  )
}
