import { useEffect, useRef } from 'react'
import { projects } from '../data/projects'
import type { Project } from '../data/projects'
import Architecture from '../components/Architecture'
import Contribution from '../components/Contribution'
import EvidenceLinks from '../components/EvidenceLinks'
import Icon from '../components/Icon'
import {
  ChatPipeline,
  MonitoringFlow,
  TeamMeasurement,
} from '../components/ProjectFigures'
import { featuredCopy, ProjectActions } from '../components/SelectedWork'
import './work-pages.css'

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
]

function ProjectPanel({
  project,
  onOpen,
}: {
  project: Project
  onOpen: (project: Project) => void
}) {
  const copy = featuredCopy[project.id]
  return (
    <article className="project-panel" id={`project-${project.id}`}>
      <div className="panel-body">
        <div className="featured-copy">
          <div className="featured-meta">
            <span className="mono">
              {project.number} / {project.kind === 'TEAM' ? 'TEAM' : 'PERSONAL'}
            </span>
            <span className="badge">{project.typeLabel}</span>
            <span className="mono featured-period">{project.period}</span>
          </div>
          <h2>{project.title}</h2>
          <p className="featured-description">
            {copy.tagline[0]}
            <br />
            {copy.tagline[1]}
          </p>
          <p className="panel-summary">{copy.summary}</p>
          <div className="tags">
            {project.technologies.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
          <p className="featured-role">
            <strong>담당</strong> {project.role}
          </p>
          <Contribution project={project} />
          <ProjectActions
            project={project}
            onOpen={onOpen}
            label="기획부터 마무리까지"
            primary
          />
        </div>
        {project.id === 'ubot' ? (
          <ChatPipeline />
        ) : project.id === 'petcoupon' ? (
          <MonitoringFlow />
        ) : (
          <Architecture />
        )}
      </div>
      <div className="panel-principles">
        {copy.points.map(([title, subtitle]) => (
          <div key={title}>
            <Icon name="check" size={17} />
            <span>
              <strong>{title}</strong>
              <span>{subtitle}</span>
            </span>
          </div>
        ))}
      </div>
      {project.id === 'petcoupon' && <TeamMeasurement />}
      <div className="panel-evidence">
        <span className="eyebrow">FOLLOW THE EVIDENCE</span>
        <EvidenceLinks links={project.proofs?.slice(0, 3)} />
      </div>
    </article>
  )
}

/** 상단 메뉴 Projects가 여는 페이지입니다. 첫 화면에는 프로젝트마다 요약 한 줄만 있습니다. */
export default function ProjectsPage({
  onOpen,
}: {
  onOpen: (project: Project) => void
}) {
  const title = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    title.current?.focus({ preventScroll: true })
  }, [])
  const featured = projects.filter((project) => project.tier === 'featured')
  const supporting = projects.filter((project) => project.tier === 'supporting')
  return (
    <main id="main" className="page project-page">
      <div className="container">
        <nav className="project-breadcrumb" aria-label="현재 위치">
          <a href="#projects">
            <span aria-hidden="true">←</span> 홈
          </a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">프로젝트</span>
        </nav>
        <header className="work-page-header">
          <span className="eyebrow">SELECTED WORK</span>
          <h1 ref={title} tabIndex={-1}>
            프로젝트
          </h1>
          <p className="section-lead">
            팀 프로젝트에서는 제가 맡은 기능과 팀의 결과를 나눠 적었습니다. 각
            프로젝트 페이지는 기획, 개발, 마무리 순서로 읽을 수 있습니다.
          </p>
        </header>
        <div className="project-panels">
          {featured.map((project) => (
            <ProjectPanel key={project.id} project={project} onOpen={onOpen} />
          ))}
        </div>

        <section className="work-page-section" aria-labelledby="supporting-title">
          <header className="section-heading">
            <p className="eyebrow">MORE WORK</p>
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
        </section>
      </div>
    </main>
  )
}
