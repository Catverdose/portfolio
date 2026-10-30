import { Fragment, useEffect, useRef } from 'react'
import type { ComponentType, ReactNode } from 'react'
import type { Feature, Project } from '../data/projects'
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
import Architecture from '../components/Architecture'
import {
  AwsTopology,
  ChatPipeline,
  MonitoringFlow,
  TeamMeasurement,
} from '../components/ProjectFigures'

const hasPlayground = (id: string) =>
  id === 'petcoupon' || id === 'vector-db-benchmark'

// 요약 옆에 두는 구조도
const figures: Record<string, ComponentType> = {
  ubot: ChatPipeline,
  petcoupon: MonitoringFlow,
  'engineering-memory': Architecture,
}
// 설계 그림이 설명하는 기능(features 배열의 순서). 그 기능을 펼치면 함께 보입니다.
const designFeature: Record<string, number> = {
  ubot: 13,
  'engineering-memory': 0,
}

const pad = (value: number) => String(value).padStart(2, '0')

// 묶음 이름은 그 묶음의 첫 기능 앞에만 보여 줍니다.
const startsGroup = (features: Feature[], index: number) =>
  Boolean(features[index].group) &&
  features[index].group !== features[index - 1]?.group

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

// 이 페이지 안에서 기능 카드로 내려가는 목차
function FeatureIndex({ project }: { project: Project }) {
  const label = project.tier === 'experiment' ? '확인한 것' : '맡은 일'
  return (
    <nav className="feature-index" aria-label="이 페이지의 내용">
      <p className="eyebrow">
        {label} {project.features.length}가지
      </p>
      <ol>
        {project.features.map((feature, index) => (
          <li key={feature.title}>
            {startsGroup(project.features, index) && (
              <span className="feature-index-group">{feature.group}</span>
            )}
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById(`feature-${index + 1}`)
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            >
              <span className="mono">{pad(index + 1)}</span>
              <span>{feature.title}</span>
              <Icon name="arrow" size={14} />
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}

// 요약(기획 한 줄, 개발 항목, 마무리 한 줄)을 먼저 보여 주고 전체 과정은 펼쳐서 봅니다.
function FeatureCard({
  feature,
  index,
  design,
}: {
  feature: Feature
  index: number
  design?: ReactNode
}) {
  const brief = feature.brief
  return (
    <article className="feature" id={`feature-${index + 1}`}>
      <header>
        <span className="eyebrow">FEATURE {pad(index + 1)}</span>
        <h3>{feature.title}</h3>
      </header>
      <dl className="feature-steps">
        <div>
          <dt>
            <span className="mono">01</span>기획
          </dt>
          <dd>{brief ? brief.plan : feature.plan}</dd>
        </div>
        <div>
          <dt>
            <span className="mono">02</span>개발
          </dt>
          <dd>
            {brief ? (
              <ul className="feature-points">
                {brief.build.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              feature.build
            )}
          </dd>
        </div>
        <div>
          <dt>
            <span className="mono">03</span>마무리
          </dt>
          <dd>
            {brief ? brief.outcome : feature.outcome}
            {!brief && feature.limit && (
              <span className="feature-limit">
                <strong>남은 한계</strong>
                {feature.limit}
              </span>
            )}
          </dd>
        </div>
      </dl>
      {brief && (
        <details className="feature-more">
          <summary>과정과 남은 한계 자세히</summary>
          <div className="feature-full">
            <p>
              <strong>기획</strong>
              {feature.plan}
            </p>
            <p>
              <strong>개발</strong>
              {feature.build}
            </p>
            <p>
              <strong>마무리</strong>
              {feature.outcome}
            </p>
            {feature.limit && (
              <p className="feature-limit">
                <strong>남은 한계</strong>
                {feature.limit}
              </p>
            )}
            {design}
          </div>
        </details>
      )}
      <EvidenceLinks links={feature.evidence} compact />
    </article>
  )
}

export default function ProjectPage({ project }: { project: Project }) {
  const title = useRef<HTMLHeadingElement>(null)
  const parent =
    project.tier === 'experiment'
      ? { href: '#/experiments', label: '실험' }
      : { href: '#/projects', label: '프로젝트' }
  const Figure = figures[project.id]
  const designIndex = designFeature[project.id]
  // 설계 그림을 기능 안에서 보여 주는 프로젝트는 위쪽에 따로 두지 않습니다.
  const showLab =
    hasPlayground(project.id) ||
    (hasProjectDesign(project.id) && designIndex === undefined)
  // PetCoupon의 체험 화면은 첫 기능을 보여 주는 것이라 기능 목록 뒤에 둡니다.
  const labAfterStory = project.id === 'petcoupon'
  const lab = showLab ? (
    <div className="project-lab-section">
      {hasPlayground(project.id) ? (
        <ProjectPlayground projectId={project.id} />
      ) : (
        <ProjectDesign project={project} />
      )}
    </div>
  ) : null
  useEffect(() => {
    title.current?.focus({ preventScroll: true })
  }, [project.id])
  return (
    <main id="main" className="page project-page">
      <div className="container">
        <nav className="project-breadcrumb" aria-label="현재 위치">
          <a href={parent.href}>
            <span aria-hidden="true">←</span> {parent.label}
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

        <div className={Figure ? 'project-intro has-figure' : 'project-intro'}>
          <div className="project-intro-copy">
            <p className="project-overview">{project.overview}</p>
            {Figure && <FeatureIndex project={project} />}
          </div>
          {Figure ? (
            <div className="project-figure">
              <Figure />
            </div>
          ) : (
            <FeatureIndex project={project} />
          )}
        </div>

        {project.id === 'petcoupon' && (
          <div className="project-figure is-wide">
            <TeamMeasurement />
          </div>
        )}

        {project.id === 'ubot' && (
          <div className="project-figure is-wide">
            <AwsTopology />
          </div>
        )}

        {!labAfterStory && lab}
      </div>

      <section className="project-story" aria-labelledby="story-title">
        <div className="container">
          <header className="section-heading">
            <p className="eyebrow">PLAN → BUILD → RESULT</p>
            <h2 id="story-title">기획에서 마무리까지.</h2>
            <p className="section-lead">
              요약을 먼저 적었습니다. 과정과 남은 한계는 펼쳐서 볼 수 있습니다.
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
              <Fragment key={feature.title}>
                {startsGroup(project.features, index) && (
                  <p className="eyebrow feature-group">{feature.group}</p>
                )}
                <FeatureCard
                  feature={feature}
                  index={index}
                  design={
                    index === designIndex ? (
                      <ProjectDesign project={project} />
                    ) : undefined
                  }
                />
              </Fragment>
            ))}
          </div>

          {labAfterStory && lab}

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
            <a className="text-link" href={parent.href}>
              ← {parent.label} 목록으로
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
