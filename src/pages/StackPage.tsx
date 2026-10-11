import { useEffect, useRef } from 'react'
import { projects, stack } from '../data/projects'
import Icon from '../components/Icon'

const projectTitle = (id: string) =>
  projects.find((project) => project.id === id)?.title ?? id

/** 기술 스택 상세 페이지입니다. 첫 화면에는 기술 이름만 있습니다. */
export default function StackPage() {
  const title = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    title.current?.focus({ preventScroll: true })
  }, [])
  return (
    <main id="main" className="page project-page">
      <div className="container">
        <nav className="project-breadcrumb" aria-label="현재 위치">
          <a href="#stack">
            <span aria-hidden="true">←</span> 홈
          </a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">기술 스택</span>
        </nav>
        <header className="notes-page-header">
          <span className="eyebrow">TOOLS, IN CONTEXT</span>
          <h1 ref={title} tabIndex={-1}>
            기술 스택
          </h1>
          <p className="section-lead">
            이름만 나열하지 않고 어디에 썼는지 함께 적었습니다.
          </p>
          <p className="stack-legend">
            <span className="stack-chip is-primary">주력</span>
            <span className="stack-chip">프로젝트에서 사용</span>
          </p>
        </header>
        <div className="stack-grid stack-page-grid">
          {stack.map((item, index) => (
            <article className="card stack-card" key={item.category}>
              <div className="stack-card-top">
                <h2>{item.category}</h2>
                <span className="mono">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <ul className="stack-chips" aria-label={`${item.category} 기술`}>
                {item.primary.map((name) => (
                  <li className="stack-chip is-primary" key={name}>
                    {name}
                  </li>
                ))}
                {item.used.map((name) => (
                  <li className="stack-chip" key={name}>
                    {name}
                  </li>
                ))}
              </ul>
              <ul className="stack-uses">
                {item.uses.map((use) => (
                  <li key={use.text}>
                    <span>{use.text}</span>
                    <a className="mono" href={`#/projects/${use.projectId}`}>
                      {projectTitle(use.projectId)}
                      <Icon name="arrow" size={12} />
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
