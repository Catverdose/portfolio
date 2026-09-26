import { useEffect, useRef } from 'react'
import type { Project } from '../data/projects'
import { concurrencyResults, concurrencyRun, projects } from '../data/projects'
import Icon from '../components/Icon'
import EvidenceLinks from '../components/EvidenceLinks'
import ProjectPlayground from '../components/ProjectPlayground'
import ProjectDesign, { hasProjectDesign } from '../components/ProjectDesign'
import Contribution from '../components/Contribution'

export default function ProjectPage({ project }: { project: Project }) {
  const title = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    title.current?.focus({ preventScroll: true })
  }, [project.id])
  return (
    <main id="main" className="page-frame project-page">
      <nav className="project-breadcrumb section-inset" aria-label="현재 위치">
        <a href="#project-map">
          <span aria-hidden="true">←</span> 프로젝트 맵
        </a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{project.title}</span>
      </nav>
      <header className="project-page-header section-inset">
        <div>
          <div className="project-page-eyebrow">
            <span className="eyebrow">PROJECT / {project.number}</span>
            <span className="badge">{project.typeLabel}</span>
          </div>
          <h1 ref={title} tabIndex={-1}>
            {project.title}
          </h1>
          <p className="project-page-description">{project.description}</p>
          <div className="tags">
            {project.technologies.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        </div>
        <aside className="project-page-role">
          <span className="eyebrow">MY CONTRIBUTION</span>
          <p>{project.role}</p>
          <Contribution project={project} />
          <a
            className="text-link"
            href={project.github}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="github" size={16} /> 저장소{' '}
            <Icon name="external" size={13} />
          </a>
        </aside>
      </header>

      <p className="project-overview section-inset">{project.overview}</p>

      {(project.id === 'petcoupon' ||
        project.id === 'vector-db-benchmark' ||
        hasProjectDesign(project.id)) && (
        <div className="project-lab-section section-inset">
          {hasProjectDesign(project.id) ? (
            <ProjectDesign project={project} />
          ) : (
            <ProjectPlayground projectId={project.id} />
          )}
        </div>
      )}

      <section
        className="project-story section-inset"
        aria-labelledby="story-title"
      >
        <div className="project-story-heading">
          <span className="eyebrow">BEHIND THE SYSTEM</span>
          <h2 id="story-title">문제에서 검증까지.</h2>
        </div>
        {project.id === 'concurrency' && (
          <section className="experiment-results">
            <h3>실제 실험 보고서</h3>
            <p>{concurrencyRun.conditions}</p>
            <div
              className="table-scroll"
              tabIndex={0}
              role="region"
              aria-label="실제 동시성 전략 비교표, 가로 스크롤 가능"
            >
              <table>
                <caption>{concurrencyRun.label}</caption>
                <thead>
                  <tr>
                    {[
                      '전략',
                      '발급 대상자 수',
                      '응답 분류',
                      '재고 원장',
                      '판정',
                    ].map((label) => (
                      <th key={label} scope="col">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {concurrencyResults.map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell, index) =>
                        index === 0 ? (
                          <th key={index} scope="row">
                            {cell}
                          </th>
                        ) : (
                          <td key={index}>{cell}</td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="experiment-caveat">{concurrencyRun.note}</p>
          </section>
        )}
        <div className="case-studies">
          {project.cases.map((item, index) => (
            <section className="case-study" key={item.title}>
              <span className="eyebrow">
                CASE {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{item.title}</h3>
              <dl>
                <div>
                  <dt>문제</dt>
                  <dd>{item.problem}</dd>
                </div>
                <div>
                  <dt>설계 판단</dt>
                  <dd>{item.decision}</dd>
                </div>
                <div>
                  <dt>검증·결과</dt>
                  <dd>{item.verification}</dd>
                </div>
                {item.tradeoff && (
                  <div>
                    <dt>선택의 비용</dt>
                    <dd>{item.tradeoff}</dd>
                  </div>
                )}
              </dl>
              <EvidenceLinks links={item.evidence} />
            </section>
          ))}
        </div>
        <aside className="limitations">
          <h3>조건과 남은 과제</h3>
          <p>{project.limitations}</p>
        </aside>
        <section className="dialog-evidence" aria-label="프로젝트 근거 자료">
          <h3>코드와 기록으로 확인하기</h3>
          <EvidenceLinks links={project.proofs} />
        </section>
        {project.relatedProjectIds?.length ? (
          <section className="page-related-projects" aria-label="연관 프로젝트">
            <h3>이 질문을 이어간 프로젝트</h3>
            <div>
              {project.relatedProjectIds.map((id) => {
                const related = projects.find(
                  (candidate) => candidate.id === id,
                )
                return related ? (
                  <a key={id} href={`#/projects/${id}`}>
                    <span>
                      <strong>{related.title}</strong>
                      <span>{related.description}</span>
                    </span>
                    <Icon name="arrow" size={18} />
                  </a>
                ) : null
              })}
            </div>
          </section>
        ) : null}
        <div className="project-page-footer">
          <a className="text-link" href="#project-map">
            ← 프로젝트 맵으로
          </a>
          {project.live && (
            <a
              className="text-link"
              href={project.live}
              target="_blank"
              rel="noreferrer"
            >
              Live demo <Icon name="external" size={14} />
            </a>
          )}
          <span className="mono">CATVERDOSE / {project.number}</span>
        </div>
      </section>
    </main>
  )
}
