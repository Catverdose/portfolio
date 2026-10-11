import {
  focusAreas,
  heroProofs,
  profile,
  projects,
  stack,
} from '../data/projects'
import type { Project } from '../data/projects'
import Icon from '../components/Icon'
import HeroVisual from '../components/HeroVisual'
import SelectedWork from '../components/SelectedWork'
import { NotesTeaser } from '../components/Notes'

const projectTitle = (id: string) =>
  projects.find((project) => project.id === id)?.title ?? id

export default function HomePage({
  onOpen,
}: {
  onOpen: (project: Project) => void
}) {
  return (
    <main id="main" className="page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero-inner">
          <p className="eyebrow">BACKEND DEVELOPER · JAVA · SPRING BOOT</p>
          <h1 id="hero-title">
            동작을 넘어,
            <br />
            <span>신뢰할 수 있도록.</span>
          </h1>
          <p className="hero-lead">
            데이터와 시스템 상태가 어긋나기 쉬운 경계를 다루고, 테스트와
            측정으로 확인합니다.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#projects">
              프로젝트 보기
              <Icon name="arrow" size={16} />
            </a>
            <a
              className="button button-secondary"
              href={profile.github}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="github" size={16} />
              GitHub
            </a>
          </div>
        </div>
        <div className="container">
          <ul className="proof-grid" aria-label="측정으로 남긴 기록">
            {heroProofs.map((proof) => (
              <li key={proof.projectId}>
                <a className="card proof-card" href={`#/projects/${proof.projectId}`}>
                  <strong>
                    {proof.value}
                    <small>{proof.unit}</small>
                  </strong>
                  <span>{proof.label}</span>
                  <span className="proof-project mono">
                    {projectTitle(proof.projectId)}
                    <Icon name="arrow" size={13} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <HeroVisual onSelectProject={onOpen} />

      <SelectedWork onOpen={onOpen} />

      <NotesTeaser />

      <section id="stack" className="section" aria-labelledby="stack-title">
        <div className="container">
          <header className="section-heading">
            <p className="eyebrow">TOOLS</p>
            <h2 id="stack-title">기술은 문제를 푸는 수단.</h2>
            <p className="stack-legend">
              <span className="stack-chip is-primary">주력</span>
              <span className="stack-chip">프로젝트에서 사용</span>
            </p>
          </header>
          <dl className="card stack-summary">
            {stack.map((item) => (
              <div key={item.category}>
                <dt>{item.category}</dt>
                <dd>
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
                </dd>
              </div>
            ))}
          </dl>
          <a className="button button-secondary notes-more" href="#/stack">
            어디에 썼는지 보기
            <Icon name="arrow" size={16} />
          </a>
        </div>
      </section>

      <section id="about" className="section" aria-labelledby="about-title">
        <div className="container">
          <header className="section-heading">
            <p className="eyebrow">ABOUT / FOCUS</p>
            <h2 id="about-title">개발자로서 집중하는 네 가지.</h2>
          </header>
          <div className="focus-grid">
            {focusAreas.map((area, index) => (
              <div className="card focus-item" key={area.title}>
                <div className="focus-top">
                  <Icon name={area.icon} size={20} />
                  <span className="mono">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
                <p className="focus-projects">
                  <span>근거</span>
                  {area.projectIds.map((id) => (
                    <a key={id} href={`#/projects/${id}`}>
                      {projectTitle(id)}
                    </a>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="section cta-band"
        aria-labelledby="contact-title"
      >
        <div className="container">
          <p className="eyebrow">LET’S BUILD RELIABLE SYSTEMS</p>
          <h2 id="contact-title">
            더 자세한 이야기는
            <br />
            코드에 남겨두었습니다.
          </h2>
          <p className="section-lead">
            설계의 이유와 검증의 흔적을 저장소에서 확인해 보세요.
          </p>
          <div className="cta-actions">
            <a
              className="button button-primary"
              href={profile.github}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="github" size={16} />
              GitHub에서 보기
            </a>
            <a
              className="button button-secondary"
              href={`mailto:${profile.email}`}
            >
              {profile.email}
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <a className="footer-brand" href="#">
            catverdose.
          </a>
          <p>문제를 기록하고, 가설을 세우고, 검증합니다.</p>
          <a className="text-link" href="#">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </footer>
    </main>
  )
}
