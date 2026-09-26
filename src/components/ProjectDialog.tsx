import { useEffect, useRef } from 'react'
import type { Project } from '../data/projects'
import { concurrencyResults } from '../data/projects'
import Icon from './Icon'
import Architecture from './Architecture'

export default function ProjectDialog({
  project,
  onClose,
}: {
  project: Project | null
  onClose: () => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const content = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = dialog.current
    if (!element || !project) return
    element.showModal()
    if (content.current) content.current.scrollTop = 0
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      element.close()
      document.body.style.overflow = previous
    }
  }, [project])

  return (
    <dialog
      ref={dialog}
      className="project-dialog"
      aria-labelledby="dialog-title"
      onCancel={onClose}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return
        const focusable = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'a[href], button, [tabindex="0"]',
          ),
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {project && (
        <>
          <div className="dialog-topbar">
            <span className="mono">PROJECT {project.number} / CASE STUDY</span>
            <button
              className="icon-button"
              aria-label="상세 보기 닫기"
              onClick={onClose}
              autoFocus
            >
              <Icon name="close" size={21} />
            </button>
          </div>
          <div className="dialog-content" ref={content}>
            <span className="badge">{project.typeLabel}</span>
            <h2 id="dialog-title">{project.title}</h2>
            <p className="dialog-description">{project.description}</p>
            <p className="dialog-role">
              <strong>담당 범위</strong>
              {project.role}
            </p>
            <div className="tags">
              {project.technologies.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
            <p className="dialog-overview">{project.overview}</p>
            {project.id === 'engineering-memory' && <Architecture />}
            {project.id === 'concurrency' && (
              <section className="experiment-results">
                <h3>세 가지 기준으로 본 실험 결과</h3>
                <p>재고 10,000 · 회원 10,000명 · 30,000 요청 · VU 50</p>
                <div
                  className="table-scroll"
                  tabIndex={0}
                  role="region"
                  aria-label="동시성 전략 비교표, 가로 스크롤 가능"
                >
                  <table>
                    <caption>단일 호스트 1차 실행 결과 · 제출 PDF 기준</caption>
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
              </section>
            )}
            {project.id === 'vector-db-benchmark' && (
              <div className="benchmark-metrics">
                {[
                  ['5', 'Databases'],
                  ['14', 'Configurations'],
                  ['620', 'Measurements'],
                ].map(([value, label]) => (
                  <div key={label}>
                    <strong>{value}</strong>
                    <span className="mono">{label}</span>
                  </div>
                ))}
              </div>
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
                  </dl>
                </section>
              ))}
            </div>
            <aside className="limitations">
              <h3>조건과 남은 과제</h3>
              <p>{project.limitations}</p>
            </aside>
            <div className="dialog-links">
              <a
                className="button button-primary"
                href={project.github}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="github" /> Source code{' '}
                <Icon name="external" size={15} />
              </a>
              {project.live && (
                <a
                  className="button button-secondary"
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live demo <Icon name="external" size={15} />
                </a>
              )}
              {project.evidence && (
                <a
                  className="text-link"
                  href={project.evidence.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.evidence.label}
                  <Icon name="external" size={15} />
                </a>
              )}
            </div>
          </div>
        </>
      )}
    </dialog>
  )
}
