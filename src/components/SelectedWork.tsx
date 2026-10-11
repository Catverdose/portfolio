import {
  concurrencyResults,
  concurrencyRun,
  projects,
  servingResults,
  servingRun,
} from '../data/projects'
import type { Project } from '../data/projects'
import Architecture from './Architecture'
import Contribution from './Contribution'
import EvidenceLinks from './EvidenceLinks'
import Icon from './Icon'
import './selected-work.css'

// Only the featured cases get the filled button so the primary action
// on the page stays distinct.
function ProjectActions({
  project,
  onOpen,
  primary = false,
}: {
  project: Project
  onOpen: (project: Project) => void
  primary?: boolean
}) {
  return (
    <div className="work-actions">
      <button
        className={`button button-sm ${primary ? 'button-primary' : 'button-secondary'}`}
        onClick={() => onOpen(project)}
        aria-label={`${project.title} 상세 보기`}
      >
        기획부터 마무리까지 <Icon name="arrow" size={15} />
      </button>
      <a
        className="text-link"
        href={project.github}
        target="_blank"
        rel="noreferrer"
        aria-label={`${project.title} GitHub`}
      >
        <Icon name="github" size={16} /> GitHub{' '}
        <Icon name="external" size={13} />
      </a>
      {project.live && (
        <a
          className="text-link"
          href={project.live}
          target="_blank"
          rel="noreferrer"
        >
          Live demo <Icon name="external" size={13} />
        </a>
      )}
    </div>
  )
}

function ChatPipeline() {
  return (
    <div
      className="architecture"
      aria-label="질문이 금지어 필터와 횟수 제한을 거쳐 검색과 모델 서버로 가는 구조"
    >
      <div className="architecture-header mono">
        <span>ONE QUESTION, GUARDED</span>
        <Icon name="branch" size={16} />
      </div>
      <div className="architecture-flow">
        <div className="architecture-node">
          <Icon name="code" />
          <strong>질문</strong>
          <span>회원 JWT · 게스트 세션</span>
        </div>
        <span className="flow-line" aria-hidden="true" />
        <div className="architecture-node">
          <Icon name="shield" />
          <strong>금지어 필터 · 횟수 제한</strong>
          <span>모델을 부르기 전에 차단</span>
        </div>
        <span className="flow-line" aria-hidden="true" />
        <div className="architecture-node architecture-core">
          <Icon name="terminal" />
          <strong>Spring Boot</strong>
          <span>검증 · 실행 · 답변 처리</span>
        </div>
        <div className="flow-fork" aria-hidden="true" />
        <div className="architecture-branches">
          <div className="architecture-node">
            <Icon name="database" />
            <strong>pgvector</strong>
            <span>FAQ 검색 · Profile</span>
          </div>
          <div className="architecture-node">
            <Icon name="layers" />
            <strong>Ollama | vLLM</strong>
            <span>AI_MODE로 선택</span>
          </div>
        </div>
      </div>
      <div className="architecture-footer mono">FILTER FIRST. MODEL LAST.</div>
    </div>
  )
}

function MonitoringFlow() {
  return (
    <div
      className="monitoring-flow"
      aria-label="SSE 구독자별 큐로 느린 클라이언트를 격리하는 구조"
    >
      <div className="architecture-header mono">
        <span>ISOLATING SLOW SUBSCRIBERS</span>
        <Icon name="branch" size={16} />
      </div>
      <div className="monitoring-origin">
        <Icon name="activity" />
        <strong>비즈니스 요청 · 로그</strong>
        <span>전송 완료를 기다리지 않고 큐에 전달</span>
      </div>
      <div className="monitoring-split" aria-hidden="true" />
      <div className="monitoring-lanes">
        <div>
          <span className="mono">SUBSCRIBER A</span>
          <div className="queue-cells" aria-hidden="true">
            <i />
            <i />
            <i />
            <i className="is-empty" />
          </div>
          <strong>정상 수신</strong>
          <p>자신의 큐에서 독립적으로 전송</p>
        </div>
        <div>
          <span className="mono">SUBSCRIBER B · SLOW</span>
          <div className="queue-cells is-full" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </div>
          <strong>가득 찬 큐</strong>
          <p>오래된 이벤트를 버리고 손실 기록</p>
        </div>
      </div>
      <div className="monitoring-tradeoff">
        <Icon name="shield" size={16} />
        <p>
          모니터링 이벤트의 손실을 허용하고,
          <br />
          비즈니스 요청과 다른 구독자를 보호합니다.
        </p>
      </div>
      <span className="diagram-note">
        구현 구조 요약 · 실시간 모니터링 화면이 아닙니다.
      </span>
    </div>
  )
}

const featuredCopy: Record<
  string,
  {
    eyebrow: string
    tagline: [string, string]
    summary: string
    principles?: [string, string][]
  }
> = {
  ubot: {
    eyebrow: 'FILTER, SWITCH, SHIP.',
    tagline: ['모델을 부르기 전에 거르고,', '모델 서버는 바꿔 끼울 수 있게.'],
    summary:
      '통신 상담 RAG 챗봇에서 채팅 앞단의 금지어 필터와 비회원 횟수 제한, LLM과 임베딩 서버 전환 구조, EC2 배포를 맡았습니다. 회원 인증과 FAQ 관리, 매장 지도는 팀원이 담당했습니다.',
    principles: [
      ['LLM 호출 전에 차단', '금지어 캐시 · 커밋 뒤 갱신'],
      ['동시 요청에도 횟수 상한', '대화 행 잠금 뒤 계산'],
      ['모델 서버 전환', 'AI_MODE · 공통 계약 테스트'],
    ],
  },
  petcoupon: {
    eyebrow: 'CONCURRENCY, WITH OPERATIONS.',
    tagline: ['발급이 진행되는 동안에도,', '관리와 모니터링은 안전하게.'],
    summary:
      '이벤트·쿠폰 관리, 관리자 운영과 SSE 모니터링을 담당했습니다. 여러 갱신 경로의 경합을 제어하고, 모니터링 장애가 서비스 요청에 전파되지 않도록 구성했습니다.',
  },
  'engineering-memory': {
    eyebrow: 'STATE, OWNERSHIP, RECOVERY.',
    tagline: ['개발 기록을 근거로 답하고,', '실패한 작업의 상태까지 관리합니다.'],
    summary:
      '문서 색인부터 LLM 응답까지 직접 설계했습니다. 오래된 작업의 덮어쓰기, 장애 후 미완료 대화, 사용자 간 데이터 혼입을 각각의 경계에서 다룹니다.',
    principles: [
      ['Stale write 차단', 'version · status · attempt'],
      ['실패 상태 복구', 'GENERATING → FAILED'],
      ['사용자 데이터 격리', 'owner 조건 + 복합 FK'],
    ],
  },
}

function TeamMeasurement() {
  return (
    <div className="team-measurement">
      <div className="measurement-heading">
        <span className="eyebrow">TEAM LOAD TEST</span>
        <span>팀 전체 발급 파이프라인의 측정 결과</span>
      </div>
      <div className="measurement-values">
        <div>
          <strong>
            1,030 <small>TPS</small>
          </strong>
          <span>평균 접수 처리량</span>
        </div>
        <div>
          <strong>
            0 <small>건</small>
          </strong>
          <span>초과·중복 발급</span>
          <em className="metric-status is-met">정합성 목표 충족</em>
        </div>
        <div>
          <strong>
            16.31 <small>초</small>
          </strong>
          <span>접수 응답 p95 평균</span>
          <em className="metric-status is-missed">목표 0.5초 · 미달</em>
        </div>
        <div>
          <strong>
            220.5 <small>초</small>
          </strong>
          <span>DB 확정 완료까지 · 회차 평균</span>
        </div>
      </div>
      <p>
        AWS EC2 3대 · 20,000 VU · 재고 10,000개 · 시간·처리량은 2~5회 실행의
        평균. 접수 API는 202 응답 후 비동기로 발급을 확정하며, 접수 p95 목표
        500ms와 허용선 3초를 넘었습니다. Redis·Kafka 발급 파이프라인은 팀원이
        담당했습니다.
      </p>
    </div>
  )
}

function FeaturedProject({
  project,
  onOpen,
}: {
  project: Project
  onOpen: (project: Project) => void
}) {
  const copy = featuredCopy[project.id]
  return (
    <article className="featured-project" id={`project-${project.id}`}>
      <div className="featured-body">
        <div className="featured-copy">
          <div className="featured-meta">
            <span className="mono">
              {project.number} / {project.kind === 'TEAM' ? 'TEAM' : 'PERSONAL'}
            </span>
            <span className="badge">{project.typeLabel}</span>
            <span className="mono featured-period">{project.period}</span>
          </div>
          <h3>{project.title}</h3>
          <p className="featured-description">
            {copy.tagline[0]}
            <br />
            {copy.tagline[1]}
          </p>
          <p className="featured-summary">{copy.summary}</p>
          <div className="tags">
            {project.technologies.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
          <p className="featured-role">
            <strong>담당</strong> {project.role}
          </p>
          <Contribution project={project} />
          <ProjectActions project={project} onOpen={onOpen} primary />
        </div>
        {project.id === 'ubot' ? (
          <ChatPipeline />
        ) : project.id === 'petcoupon' ? (
          <MonitoringFlow />
        ) : (
          <Architecture />
        )}
      </div>
      {copy.principles ? (
        <div className="featured-principles">
          {copy.principles.map(([title, subtitle]) => (
            <div key={title}>
              <Icon name="check" size={17} />
              <span>
                <strong>{title}</strong>
                <span>{subtitle}</span>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <TeamMeasurement />
      )}
      <div className="featured-evidence">
        <span className="eyebrow">FOLLOW THE EVIDENCE</span>
        <EvidenceLinks links={project.proofs?.slice(0, 3)} />
      </div>
    </article>
  )
}

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
            운영하는 부담이 크다고 보고, 이미 쓰는 PostgreSQL의 pgvector를
            선택했습니다.
          </p>
        </div>
      </div>
      <p className="experiment-caveat">
        프로젝트 페이지에서 124개 설정의 산포도를 직접 탐색할 수 있습니다.
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

function ExperimentCard({
  project,
  onOpen,
}: {
  project: Project
  onOpen: (project: Project) => void
}) {
  const copy = experimentCopy[project.id]
  return (
    <article className="card experiment-card" id={`project-${project.id}`}>
      <div className="project-card-top">
        <span className="project-number mono">/{project.number}</span>
        <span className="badge">{project.typeLabel}</span>
      </div>
      <h3>{project.title}</h3>
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
        <ProjectActions project={project} onOpen={onOpen} />
      </div>
    </article>
  )
}

const archive = [
  [
    'pos',
    'JDBC · 트랜잭션 학습',
    '재고 차감, 포인트 갱신, 주문 저장을 하나의 트랜잭션으로 묶은 팀 미니 프로젝트입니다.',
  ],
  [
    'memo-servlet-jsp',
    'Servlet · JSP 기초',
    '메모 목록 조회 구현을 중심으로 웹 요청과 DB 접근 흐름을 학습했습니다.',
  ],
  [
    'anti-sycophancy-prompt',
    'Prompt experiment',
    '모델 응답의 동조 성향을 줄이기 위한 프롬프트를 탐색합니다.',
  ],
  [
    'Causal-Loom',
    'Prompt experiment',
    '서사 구성을 위한 모듈형 프롬프트 실험입니다.',
  ],
]

export default function SelectedWork({
  onOpen,
}: {
  onOpen: (project: Project) => void
}) {
  const featured = projects.filter((project) => project.tier === 'featured')
  const experiments = projects.filter((project) => project.tier === 'experiment')
  const range = (list: Project[]) =>
    `${list[0].number}—${list[list.length - 1].number}`
  return (
    <>
      <section id="projects" className="section" aria-labelledby="projects-title">
        <div className="container">
          <header className="section-heading">
            <p className="eyebrow">SELECTED WORK / {range(featured)}</p>
            <h2 id="projects-title">맡은 범위를 구분해 적은 세 프로젝트.</h2>
            <p className="section-lead">
              팀 프로젝트에서는 제가 맡은 기능과 팀의 결과를 나눠 적었습니다.
              각 프로젝트 페이지는 기획, 개발, 마무리 순서로 읽을 수 있습니다.
            </p>
          </header>
          <div className="featured-projects">
            {featured.map((project) => (
              <FeaturedProject
                key={project.id}
                project={project}
                onOpen={onOpen}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id="experiments"
        className="section"
        aria-labelledby="experiments-title"
      >
        <div className="container">
          <header className="section-heading">
            <p className="eyebrow">ENGINEERING NOTES / {range(experiments)}</p>
            <h2 id="experiments-title">비교하고, 한계까지 기록합니다.</h2>
            <p className="section-lead">
              서비스에서 만난 질문을 조건을 고정한 실험으로 이어갔습니다. 조건과
              남은 한계를 결과와 함께 적었습니다.
            </p>
          </header>
          <div className="experiments-grid">
            {experiments.map((project) => (
              <ExperimentCard
                key={project.id}
                project={project}
                onOpen={onOpen}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export function MoreWork({ onOpen }: { onOpen: (project: Project) => void }) {
  const supporting = projects.filter((project) => project.tier === 'supporting')
  return (
      <section
        id="more-work"
        className="section"
        aria-labelledby="supporting-title"
      >
        <div className="container">
          <header className="section-heading">
            <p className="eyebrow">MORE WORK / {supporting[0].number}</p>
            <h2 id="supporting-title">먼저 만들어 본 것들.</h2>
          </header>
          <div className="supporting-grid">
            {supporting.map((project) => (
              <article
                className="card supporting-project"
                id={`project-${project.id}`}
                key={project.id}
              >
                <div className="project-card-top">
                  <span className="project-number mono">/{project.number}</span>
                  <span className="badge">{project.typeLabel}</span>
                </div>
                <h3>{project.title}</h3>
                <p className="work-description">{project.description}</p>
                <p className="project-role">{project.role}</p>
                <ul className="project-highlights">
                  {project.highlights.map((item) => (
                    <li key={item}>
                      <Icon name="check" size={16} />
                      {item}
                    </li>
                  ))}
                </ul>
                <ProjectActions project={project} onOpen={onOpen} />
              </article>
            ))}
            <div className="card archive-card">
              <p className="eyebrow">LEARNING ARCHIVE</p>
              <h3>학습 기록과 기타 실험</h3>
              <ul className="archive-list">
                {archive.map(([name, label, description]) => (
                  <li key={name}>
                    <a
                      href={`https://github.com/Catverdose/${name}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>
                        <strong>{name}</strong>
                        <span className="mono">{label}</span>
                      </span>
                      <p>{description}</p>
                      <Icon name="external" size={13} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
  )
}
