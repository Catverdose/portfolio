import { collaboration, projects, troubleshooting } from '../data/projects'
import Icon from './Icon'

const projectTitle = (id: string) =>
  projects.find((project) => project.id === id)?.title ?? id

export function Troubleshooting() {
  return (
    <section
      id="troubleshooting"
      className="section"
      aria-labelledby="troubleshooting-title"
    >
      <div className="container">
        <header className="section-heading">
          <p className="eyebrow">TROUBLESHOOTING</p>
          <h2 id="troubleshooting-title">막혔던 곳과 빠져나온 순서.</h2>
          <p className="section-lead">
            증상에서 원인, 해결, 확인까지 한 줄씩 적었습니다. 확정하지 못한
            원인은 그대로 표시했습니다.
          </p>
        </header>
        <div className="trouble-grid">
          {troubleshooting.map((item) => (
            <article className="card trouble-card" key={item.title}>
              <p className="eyebrow">{item.label}</p>
              <h3>{item.title}</h3>
              <dl>
                <div>
                  <dt>증상</dt>
                  <dd>{item.symptom}</dd>
                </div>
                <div>
                  <dt>원인</dt>
                  <dd>{item.cause}</dd>
                </div>
                <div>
                  <dt>해결</dt>
                  <dd>{item.fix}</dd>
                </div>
                <div>
                  <dt>확인</dt>
                  <dd>{item.check}</dd>
                </div>
              </dl>
              <a className="text-link" href={`#/projects/${item.projectId}`}>
                {projectTitle(item.projectId)}에서 자세히
                <Icon name="arrow" size={14} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Collaboration() {
  return (
    <section
      id="collaboration"
      className="section"
      aria-labelledby="collaboration-title"
    >
      <div className="container">
        <header className="section-heading">
          <p className="eyebrow">WORKING WITH A TEAM</p>
          <h2 id="collaboration-title">팀이 같은 기준으로 일하도록.</h2>
          <p className="section-lead">
            직책은 없었지만 환경, 리뷰, 문서처럼 팀이 함께 쓰는 바닥을 맞추는
            일을 맡았습니다.
          </p>
        </header>
        <div className="collab-grid">
          {collaboration.map((item) => (
            <article className="card collab-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <span className="mono">{item.meta}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
