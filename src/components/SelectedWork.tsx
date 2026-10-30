import { projects } from '../data/projects'
import type { Project } from '../data/projects'
import Contribution from './Contribution'
import Icon from './Icon'
import './selected-work.css'

// 첫 화면에는 요약만 둡니다. 구조도, 측정표, 근거 링크는 프로젝트 페이지에 있습니다.
// Only the featured cases get the filled button so the primary action
// on the page stays distinct.
export function ProjectActions({
  project,
  onOpen,
  primary = false,
  label = '자세히 보기',
}: {
  project: Project
  onOpen: (project: Project) => void
  primary?: boolean
  label?: string
}) {
  return (
    <div className="work-actions">
      <button
        className={`button button-sm ${primary ? 'button-primary' : 'button-secondary'}`}
        onClick={() => onOpen(project)}
        aria-label={`${project.title} 상세 보기`}
      >
        {label} <Icon name="arrow" size={15} />
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

export const featuredCopy: Record<
  string,
  { tagline: [string, string]; summary: string; points: [string, string][] }
> = {
  ubot: {
    tagline: ['모델이 느려도 질문은 실패하지 않고,', '서버가 멈춰도 작업은 남도록.'],
    summary:
      '통신 상담 RAG 챗봇에서 AWS 인프라 설계와 배포, 답변 생성의 비동기 처리와 장애 복구, 운영 지표와 알림을 맡았습니다. 채팅 앞단의 금지어 필터와 비회원 횟수 제한, 모델 서버 전환 구조도 만들었습니다. 회원 인증과 FAQ 관리, 매장 지도는 팀원이 담당했습니다.',
    points: [
      ['FE·BE·State·GPU 접근 경계', '보안 그룹 · 내부 NLB · Spot ASG · Terraform'],
      ['장애 4종을 주입해도 유실 0건', '로컬 각 1회 · heartbeat · 펜싱 · 커밋 뒤 ACK'],
      ['AWS 6,000건 재시험', '시스템 오류 4건 · DB 대조 불일치 0'],
    ],
  },
  petcoupon: {
    tagline: ['발급이 진행되는 동안에도,', '관리와 모니터링은 안전하게.'],
    summary:
      '이벤트·쿠폰 관리, 관리자 운영과 SSE 모니터링을 담당했습니다. 여러 갱신 경로의 경합을 제어하고, 모니터링 장애가 서비스 요청에 전파되지 않도록 구성했습니다.',
    points: [
      ['모니터링 오류의 자기증폭 차단', '큐 50 · 오래된 로그 버리기'],
      ['관리자 수정과 발급의 경합 제어', '락 순서 · 조건부 UPDATE'],
      ['스케줄러는 전용 실행기로', '발급 설정을 건드리지 않음'],
    ],
  },
  'engineering-memory': {
    tagline: ['개발 기록을 근거로 답하고,', '실패한 작업의 상태까지 관리합니다.'],
    summary:
      '문서 색인부터 LLM 응답까지 직접 설계했습니다. 오래된 작업의 덮어쓰기, 장애 후 미완료 대화, 사용자 간 데이터 혼입을 각각의 경계에서 다룹니다.',
    points: [
      ['Stale write 차단', 'version · status · attempt'],
      ['실패 상태 복구', 'GENERATING → FAILED'],
      ['사용자 데이터 격리', 'owner 조건 + 복합 FK'],
    ],
  },
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
        <p className="featured-role">
          <strong>담당</strong> {project.role}
        </p>
        <Contribution project={project} />
        <ProjectActions project={project} onOpen={onOpen} primary />
      </div>
      <ul className="featured-points">
        {copy.points.map(([title, subtitle]) => (
          <li key={title}>
            <Icon name="check" size={17} />
            <span>
              <strong>{title}</strong>
              <span>{subtitle}</span>
            </span>
          </li>
        ))}
      </ul>
    </article>
  )
}

const experimentCopy: Record<
  string,
  { question: string; finding: string; conditions: string }
> = {
  concurrency: {
    question: '초과 발급이 없으면, 성공일까요?',
    finding:
      '전략 9개 중 판정 기준 6개를 모두 통과한 것은 하나였습니다. 최종 재고가 맞아도 정상 회원이 탈락했습니다.',
    conditions: '로컬 단일 호스트 · 조건별 1회',
  },
  'vector-db-benchmark': {
    question: '검색 품질이 달라도, 속도를 비교할 수 있을까요?',
    finding:
      'Recall이 비슷한 설정끼리 비교했습니다. 성능은 Qdrant, 팀의 선택은 pgvector였고, 이후 서비스 검색을 HNSW로 옮겼습니다.',
    conditions: '5개 DB · 124개 설정 · 620회 측정 · 합성 1만 청크',
  },
  'llm-serving': {
    question: '어떤 엔진과 GPU면 초당 8건을 넘길까요?',
    finding:
      'L4의 vLLM과 SGLang만 기준선을 넘었고, 공식 가중치로 넘은 모델은 Qwen3-4B뿐이었습니다. 임베딩 서빙도 vLLM의 처리량이 높았습니다.',
    conditions: '엔진 4종 · 세 환경 · 반복 검증 전 탐색 결과',
  },
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
      <p className="work-description">{copy.finding}</p>
      <p className="experiment-conditions mono">{copy.conditions}</p>
      <ProjectActions project={project} onOpen={onOpen} />
    </article>
  )
}

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
              구조도와 근거, 기획부터 마무리까지의 과정은 상세 페이지에 있습니다.
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
          <a className="button button-secondary notes-more" href="#/projects">
            프로젝트 전체 보기
            <Icon name="arrow" size={16} />
          </a>
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
              측정 조건과 결과표, 남은 한계는 상세 페이지에 있습니다.
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
          <a
            className="button button-secondary notes-more"
            href="#/experiments"
          >
            결과표와 조건 보기
            <Icon name="arrow" size={16} />
          </a>
        </div>
      </section>
    </>
  )
}
