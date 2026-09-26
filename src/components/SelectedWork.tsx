import { concurrencyResults, concurrencyRun, projects } from '../data/projects'
import type { Project } from '../data/projects'
import Architecture from './Architecture'
import EvidenceLinks from './EvidenceLinks'
import Icon from './Icon'
import './selected-work.css'

function ProjectActions({
  project,
  onOpen,
}: {
  project: Project
  onOpen: (project: Project) => void
}) {
  return (
    <div className="work-actions">
      <button
        className="button button-primary"
        onClick={() => onOpen(project)}
        aria-label={`${project.title} 상세 보기`}
      >
        문제 해결 과정 <Icon name="arrow" size={16} />
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

function FeaturedProject({
  project,
  onOpen,
}: {
  project: Project
  onOpen: (project: Project) => void
}) {
  const memory = project.id === 'engineering-memory'
  return (
    <article className="featured-project" id={`project-${project.id}`}>
      <div className="featured-topbar">
        <span className="mono">
          {project.number} /{' '}
          {memory ? 'PERSONAL ENGINEERING' : 'TEAM CONTRIBUTION'}
        </span>
        <span className="badge">{project.typeLabel}</span>
      </div>
      <div className="featured-body">
        <div className="featured-copy">
          <span className="eyebrow">
            {memory
              ? 'STATE, OWNERSHIP, RECOVERY.'
              : 'CONCURRENCY, WITH OPERATIONS.'}
          </span>
          <h3>{project.title}</h3>
          <p className="featured-description">
            {memory ? (
              <>
                개발 기록을 근거로 답하고,
                <br />
                실패한 작업의 상태까지 관리합니다.
              </>
            ) : (
              <>
                발급이 진행되는 동안에도,
                <br />
                관리와 모니터링은 안전하게.
              </>
            )}
          </p>
          <p className="featured-summary">
            {memory
              ? '문서 색인부터 LLM 응답까지 직접 설계했습니다. 오래된 작업의 덮어쓰기, 장애 후 미완료 대화, 사용자 간 데이터 혼입을 각각의 경계에서 다룹니다.'
              : '이벤트·쿠폰 관리, 관리자 운영과 SSE 모니터링을 담당했습니다. 여러 갱신 경로의 경합을 제어하고, 모니터링 장애가 서비스 요청에 전파되지 않도록 구성했습니다.'}
          </p>
          <div className="tags">
            {project.technologies.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
          <p className="featured-role">
            <strong>담당</strong> {project.role}
          </p>
          <ProjectActions project={project} onOpen={onOpen} />
        </div>
        {memory ? <Architecture /> : <MonitoringFlow />}
      </div>
      {memory ? (
        <div className="featured-principles">
          {[
            ['Stale write 차단', 'version · status · attempt'],
            ['실패 상태 복구', 'GENERATING → FAILED'],
            ['사용자 데이터 격리', 'owner 조건 + 복합 FK'],
          ].map(([title, subtitle]) => (
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
            </div>
            <div>
              <strong>
                16.31 <small>초</small>
              </strong>
              <span>접수 응답 p95 평균 · 목표 미달</span>
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
            500ms와 허용선 3초를 넘었습니다. Redis·Kafka 발급 파이프라인은
            팀원이 담당했습니다.
          </p>
        </div>
      )}
      <div className="featured-evidence">
        <span className="eyebrow">FOLLOW THE EVIDENCE</span>
        <EvidenceLinks links={project.proofs?.slice(0, 3)} />
      </div>
    </article>
  )
}

function ExperimentCard({
  project,
  onOpen,
}: {
  project: Project
  onOpen: (project: Project) => void
}) {
  const concurrency = project.id === 'concurrency'
  const rows = concurrencyResults.filter((row) =>
    ['JVM_LOCK', 'DIRECT', 'REDIS_DECR', 'REDIS_LUA', 'REDIS_WATCH'].includes(
      row[0],
    ),
  )
  return (
    <article className="experiment-card" id={`project-${project.id}`}>
      <div className="project-card-top">
        <span className="project-number mono">/{project.number}</span>
        <span className="badge">{project.typeLabel}</span>
      </div>
      <h3>{project.title}</h3>
      <p className="experiment-question">
        {concurrency
          ? '초과 발급이 없으면, 성공일까요?'
          : '검색 품질이 달라도, 속도를 비교할 수 있을까요?'}
      </p>
      <p className="work-description">
        {concurrency
          ? '재고 예약 전략 9개에 동일한 요청을 보냈습니다. 중복 발급뿐 아니라 대상자 전원 발급, 응답 분류, 재고 원장을 따로 확인했습니다.'
          : '입력·자원·정답 기준을 고정했습니다. 실제 Recall이 비슷한 설정끼리 지연 시간과 처리량을 비교합니다.'}
      </p>
      {concurrency ? (
        <div className="concurrency-preview">
          <div className="experiment-conditions">
            <span className="mono">RUN r0816dup1 · VU 50</span>
            <p>
              회원 10,000명 × 3회 요청
              <br />
              재고 10,000개 · 로컬 단일 호스트
            </p>
          </div>
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label="동시성 실험 발급 대상자 요약표"
          >
            <table>
              <caption>9개 전략 중 5개 요약 · 정순 실행</caption>
              <thead>
                <tr>
                  <th scope="col">전략</th>
                  <th scope="col">발급 대상자</th>
                  <th scope="col">종합 판정</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row[0]}>
                    <th scope="row">{row[0]}</th>
                    <td>{row[1]}</td>
                    <td>
                      <span
                        className={
                          row[4] === '통과' ? 'result-pass' : 'result-fail'
                        }
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
          <p className="experiment-caveat">
            JVM_LOCK의 통과는 단일 인스턴스 조건입니다. 조건별 1회 실행과 역순
            재실행으로 성능 순위를 확정하지 않았습니다.
          </p>
          <p className="experiment-caveat">{concurrencyRun.note}</p>
        </div>
      ) : (
        <div className="benchmark-preview">
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
          <p className="experiment-caveat">
            프로젝트 페이지에서 124개 설정의 산포도를 직접 탐색할 수 있습니다.
            합성 데이터의 탐색 결과이며 제품 선정 결론은 아닙니다.
          </p>
        </div>
      )}
      <div className="experiment-bottom">
        <EvidenceLinks links={project.proofs?.slice(0, 1)} compact />
        <ProjectActions project={project} onOpen={onOpen} />
      </div>
    </article>
  )
}

export default function SelectedWork({
  onOpen,
}: {
  onOpen: (project: Project) => void
}) {
  return (
    <>
      <section
        id="projects"
        className="projects-section section-inset"
        aria-labelledby="projects-title"
      >
        <div className="section-heading">
          <div>
            <div className="eyebrow">SELECTED WORK / 01—02</div>
            <h2 id="projects-title">구현의 깊이를 보여주는 두 가지 사례.</h2>
            <p>
              개인 프로젝트의 설계 책임과 팀 프로젝트의 기여 범위를
              구분했습니다.
            </p>
          </div>
          <span className="section-side-note mono">
            OWNERSHIP
            <br />
            PROBLEM → DECISION → PROOF
          </span>
        </div>
        <div className="featured-projects">
          {projects
            .filter((project) => project.tier === 'featured')
            .map((project) => (
              <FeaturedProject
                key={project.id}
                project={project}
                onOpen={onOpen}
              />
            ))}
        </div>
      </section>
      <section
        id="experiments"
        className="experiments-section section-inset"
        aria-labelledby="experiments-title"
      >
        <div className="section-heading">
          <div>
            <div className="eyebrow">ENGINEERING NOTES / 03—04</div>
            <h2 id="experiments-title">비교하고, 한계까지 기록합니다.</h2>
            <p>서비스에서 만난 질문을 재현 가능한 실험으로 이어갑니다.</p>
          </div>
          <span className="section-side-note mono">
            REPRODUCIBLE
            <br />
            CONDITIONS INCLUDED
          </span>
        </div>
        <div className="experiments-grid">
          {projects
            .filter((project) => project.tier === 'experiment')
            .map((project) => (
              <ExperimentCard
                key={project.id}
                project={project}
                onOpen={onOpen}
              />
            ))}
        </div>
      </section>
      <section
        id="more-work"
        className="supporting-section section-inset"
        aria-labelledby="supporting-title"
      >
        <div className="section-heading">
          <div>
            <div className="eyebrow">MORE WORK / 05—06</div>
            <h2 id="supporting-title">함께 개발하고, 기존 코드를 확장하며.</h2>
            <p>
              팀의 실행 환경을 맞추고, 서비스의 다음 기능을 이어 만들었습니다.
            </p>
          </div>
        </div>
        <div className="supporting-grid">
          {projects
            .filter((project) => project.tier === 'supporting')
            .map((project) => (
              <article
                className="supporting-project"
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
                <EvidenceLinks links={project.proofs?.slice(0, 2)} compact />
                <ProjectActions project={project} onOpen={onOpen} />
              </article>
            ))}
        </div>
        <details className="learning-archive">
          <summary>
            <span>
              <strong>학습 기록과 기타 실험</strong>
              <span>JDBC · Servlet · Prompt experiments</span>
            </span>
            <span aria-hidden="true">+</span>
          </summary>
          <div className="archive-grid">
            {[
              [
                'pos',
                'JDBC · 트랜잭션 학습',
                '도서 재고 차감과 결제 처리를 하나의 트랜잭션으로 구성했습니다.',
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
            ].map(([name, label, description]) => (
              <a
                key={name}
                href={`https://github.com/Catverdose/${name}`}
                target="_blank"
                rel="noreferrer"
              >
                <span className="eyebrow">{label}</span>
                <strong>
                  {name}
                  <Icon name="external" size={13} />
                </strong>
                <p>{description}</p>
              </a>
            ))}
          </div>
        </details>
      </section>
    </>
  )
}
