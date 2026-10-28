import { collaboration, projects, troubleshooting } from '../data/projects'
import Icon from './Icon'

type Trouble = (typeof troubleshooting)[number]

const projectTitle = (id: string) =>
  projects.find((project) => project.id === id)?.title ?? id

const featured = troubleshooting.filter((item) => item.featured)
const others = troubleshooting.filter((item) => !item.featured)

// 접힌 목록은 프로젝트별로 묶습니다. 데이터 순서를 그대로 따릅니다.
const otherGroups = others.reduce<[string, Trouble[]][]>((groups, item) => {
  const group = groups.find(([id]) => id === item.projectId)
  if (group) group[1].push(item)
  else groups.push([item.projectId, [item]])
  return groups
}, [])

function TroubleSteps({ item }: { item: Trouble }) {
  return (
    <dl className="trouble-steps">
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
  )
}

function TroubleLinks({ item }: { item: Trouble }) {
  return (
    <div className="trouble-links">
      {item.evidence?.map((link) => (
        <a
          key={link.href}
          className="text-link"
          href={link.href}
          target="_blank"
          rel="noreferrer"
        >
          {link.label}
          <Icon name="external" size={13} />
        </a>
      ))}
      <a className="text-link" href={`#/projects/${item.projectId}`}>
        {projectTitle(item.projectId)}에서 자세히
        <Icon name="arrow" size={14} />
      </a>
    </div>
  )
}

/** 첫 화면용 요약. 증상부터 확인까지의 과정은 #/troubleshooting 페이지에 있습니다. */
export function NotesTeaser() {
  return (
    <section
      id="troubleshooting"
      className="section"
      aria-labelledby="notes-title"
    >
      <div className="container">
        <header className="section-heading">
          <p className="eyebrow">TROUBLESHOOTING · TEAMWORK</p>
          <h2 id="notes-title">막혔던 곳과 팀에서 맡은 일.</h2>
        </header>
        <div className="notes-teaser">
          <div className="card">
            <p className="eyebrow">문제 해결</p>
            <ul className="notes-list">
              {featured.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.summary}</span>
                </li>
              ))}
            </ul>
            {others.length > 0 && (
              <p className="notes-count">
                그 밖에 {others.length}건은 상세 페이지에 접어 두었습니다.
              </p>
            )}
          </div>
          <div className="card">
            <p className="eyebrow">협업</p>
            <ul className="notes-list">
              {collaboration.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.summary}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <a className="button button-secondary notes-more" href="#/troubleshooting">
          증상부터 확인까지 보기
          <Icon name="arrow" size={16} />
        </a>
      </div>
    </section>
  )
}

export function Troubleshooting() {
  return (
    <section className="section" aria-labelledby="troubleshooting-title">
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
          {featured.map((item) => (
            <article className="card trouble-card" key={item.title}>
              <p className="eyebrow">{item.label}</p>
              <h3>{item.title}</h3>
              <TroubleSteps item={item} />
              <TroubleLinks item={item} />
            </article>
          ))}
        </div>

        {others.length > 0 && (
          <section className="trouble-more" aria-labelledby="trouble-more-title">
            <header>
              <h3 id="trouble-more-title">그 밖에 고친 문제 {others.length}건</h3>
              <p>제목을 누르면 증상부터 확인까지 펼쳐집니다.</p>
            </header>
            {otherGroups.map(([projectId, items]) => (
              <div className="trouble-group" key={projectId}>
                <p className="eyebrow">
                  {projectTitle(projectId)} · {items.length}건
                </p>
                <div className="trouble-list">
                  {items.map((item) => (
                    <details className="trouble-item" key={item.title}>
                      <summary>
                        <span>
                          <span className="trouble-item-label">{item.label}</span>
                          <strong>{item.title}</strong>
                          <span className="trouble-item-summary">
                            {item.summary}
                          </span>
                        </span>
                      </summary>
                      <div className="trouble-item-body">
                        <TroubleSteps item={item} />
                        <TroubleLinks item={item} />
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </section>
  )
}

export function Collaboration() {
  return (
    <section className="section" aria-labelledby="collaboration-title">
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
