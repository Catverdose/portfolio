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
import SelectedWork, { MoreWork } from '../components/SelectedWork'
import { Collaboration, Troubleshooting } from '../components/Notes'

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
            동시 수정, 비동기 처리, 모델 서빙처럼 데이터와 시스템 상태가
            어긋나기 쉬운 경계를 다룹니다. 결과가 맞아 보여도 한 번 더 의심하고,
            재현 가능한 테스트와 측정으로 확인합니다.
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

      <Troubleshooting />

      <Collaboration />

      <MoreWork onOpen={onOpen} />

      <section id="stack" className="section" aria-labelledby="stack-title">
        <div className="container">
          <header className="section-heading">
            <p className="eyebrow">TOOLS, IN CONTEXT</p>
            <h2 id="stack-title">기술은 문제를 푸는 수단.</h2>
            <p className="section-lead">
              이름만 나열하지 않고 어디에 썼는지 함께 적었습니다.
            </p>
            <p className="stack-legend">
              <span className="stack-chip is-primary">주력</span>
              <span className="stack-chip">프로젝트에서 사용</span>
            </p>
          </header>
          <div className="stack-grid">
            {stack.map((item, index) => (
              <article className="card stack-card" key={item.category}>
                <div className="stack-card-top">
                  <h3>{item.category}</h3>
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
      </section>

      <section id="about" className="section" aria-labelledby="about-title">
        <div className="container">
          <header className="section-heading">
            <p className="eyebrow">ABOUT / FOCUS</p>
            <h2 id="about-title">개발자로서 집중하는 네 가지.</h2>
            <p className="section-lead">
              Java · Spring Boot 백엔드 개발자입니다. 데이터 흐름을 이해하고,
              안정적인 서비스 개발과 문제 해결에 관심이 있습니다.
            </p>
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
