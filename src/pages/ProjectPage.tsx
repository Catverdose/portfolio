import { useEffect, useRef } from 'react'
import type { Project } from '../data/projects'
import {
  concurrencyResults,
  concurrencyRun,
  projects,
  servingResults,
  servingRun,
} from '../data/projects'
import Icon from '../components/Icon'
import EvidenceLinks from '../components/EvidenceLinks'
import ProjectPlayground from '../components/ProjectPlayground'
import ProjectDesign, { hasProjectDesign } from '../components/ProjectDesign'
import Contribution from '../components/Contribution'

const hasPlayground = (id: string) =>
  id === 'petcoupon' || id === 'vector-db-benchmark'

function ResultTable({
  title,
  conditions,
  caption,
  note,
  headers,
  rows,
  label,
}: {
  title: string
  conditions: string
  caption: string
  note: string
  headers: string[]
  rows: string[][]
  label: string
}) {
  return (
    <section className="experiment-results">
      <h3>{title}</h3>
      <p>{conditions}</p>
      <div className="table-scroll" tabIndex={0} role="region" aria-label={label}>
        <table>
          <caption>{caption}</caption>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header} scope="col">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, index) =>
                  index === 0 ? (
                    <th key={index} scope="row">
                      {cell}
                    </th>
                  ) : index === row.length - 1 ? (
                    <td key={index}>
                      <span
                        className={cell === '통과' ? 'result-pass' : 'result-fail'}
                      >
                        {cell}
                      </span>
                    </td>
                  ) : (
                    <td key={index}>{cell}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="experiment-caveat">{note}</p>
    </section>
  )
}

export default function ProjectPage({ project }: { project: Project }) {
  const title = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    title.current?.focus({ preventScroll: true })
  }, [project.id])
  return (
    <main id="main" className="page project-page">
      <div className="container">
        <nav className="project-breadcrumb" aria-label="현재 위치">
          <a href="#project-map">
            <span aria-hidden="true">←</span> 프로젝트 맵
          </a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{project.title}</span>
        </nav>
        <header className="project-page-header">
          <div>
            <div className="project-page-eyebrow">
              <span className="eyebrow">PROJECT / {project.number}</span>
              <span className="badge">{project.typeLabel}</span>
              <span className="eyebrow">{project.period}</span>
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
          <aside className="card project-page-role">
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

        <p className="project-overview">{project.overview}</p>

        {(hasPlayground(project.id) || hasProjectDesign(project.id)) && (
          <div className="project-lab-section">
            {hasProjectDesign(project.id) ? (
              <ProjectDesign project={project} />
            ) : (
              <ProjectPlayground projectId={project.id} />
            )}
          </div>
        )}
      </div>

      <section className="project-story" aria-labelledby="story-title">
        <div className="container">
          <header className="section-heading">
            <p className="eyebrow">PLAN → BUILD → RESULT</p>
            <h2 id="story-title">기획에서 마무리까지.</h2>
            <p className="section-lead">
              맡은 기능마다 풀려던 문제, 실제로 만든 것, 결과와 남은 한계를
              순서대로 적었습니다.
            </p>
          </header>

          {project.id === 'concurrency' && (
            <ResultTable
              title="실제 실험 보고서"
              conditions={concurrencyRun.conditions}
              caption={concurrencyRun.label}
              note={concurrencyRun.note}
              headers={['전략', '발급 대상자 수', '응답 분류', '재고 원장', '판정']}
              rows={concurrencyResults}
              label="실제 동시성 전략 비교표, 가로 스크롤 가능"
            />
          )}
          {project.id === 'llm-serving' && (
            <ResultTable
              title="환경별 측정 결과"
              conditions={servingRun.conditions}
              caption={servingRun.label}
              note={servingRun.note}
              headers={['환경', 'vLLM', 'SGLang', '기준선 8']}
              rows={servingResults}
              label="LLM 서빙 엔진 환경별 결과표, 가로 스크롤 가능"
            />
          )}

          <div className="features">
            {project.features.map((feature, index) => (
              <article className="feature" key={feature.title}>
                <header>
                  <span className="eyebrow">
                    FEATURE {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3>{feature.title}</h3>
                </header>
                <dl className="feature-steps">
                  <div>
                    <dt>
                      <span className="mono">01</span>기획
                    </dt>
                    <dd>{feature.plan}</dd>
                  </div>
                  <div>
                    <dt>
                      <span className="mono">02</span>개발
                    </dt>
                    <dd>{feature.build}</dd>
                  </div>
                  <div>
                    <dt>
                      <span className="mono">03</span>마무리
                    </dt>
                    <dd>
                      {feature.outcome}
                      {feature.limit && (
                        <span className="feature-limit">
                          <strong>남은 한계</strong>
                          {feature.limit}
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
                <EvidenceLinks links={feature.evidence} />
              </article>
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
        </div>
      </section>
    </main>
  )
}
