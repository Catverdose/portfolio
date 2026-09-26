import { useEffect, useState } from 'react'
import { profile, projects, stack } from './data/projects'
import type { Project } from './data/projects'
import Icon from './components/Icon'
import type { IconName } from './components/Icon'
import HeroVisual from './components/HeroVisual'
import Architecture from './components/Architecture'
import ProjectDialog from './components/ProjectDialog'

const focusAreas: { title: string; description: string; icon: IconName }[] = [
  {
    title: 'Data Consistency',
    description: '트랜잭션 경계 · DB 제약 · 동시성 제어',
    icon: 'database',
  },
  {
    title: 'Failure Handling',
    description: '비동기 처리 · 장애 복구 · SSE',
    icon: 'activity',
  },
  {
    title: 'Verification',
    description: '재현 가능한 테스트 · 측정 · 벤치마크',
    icon: 'shield',
  },
  {
    title: 'Backend Infrastructure',
    description: 'Docker · CI/CD · 관측 가능성',
    icon: 'layers',
  },
]

function ProjectCard({
  project,
  onOpen,
}: {
  project: Project
  onOpen: (project: Project) => void
}) {
  return (
    <article className={`project-card project-${project.id}`}>
      <div className="project-card-top">
        <span className="project-number mono">/{project.number}</span>
        <span className="badge">{project.typeLabel}</span>
      </div>
      <h3>
        <button className="title-button" onClick={() => onOpen(project)}>
          {project.title}
          <Icon name="arrow" size={23} />
        </button>
      </h3>
      <p className="project-description">{project.description}</p>
      <p className="project-role">{project.role}</p>
      {project.id === 'concurrency' ? (
        <div className="mini-experiment">
          <div className="mini-experiment-header mono">
            <span>STRATEGY</span>
            <span>FAILURE MODE</span>
          </div>
          {[
            ['DIRECT', 'Lost update'],
            ['REDIS_DECR / LUA', '정상 회원 탈락'],
            ['REDIS_WATCH', 'Connection exhaustion'],
          ].map(([name, result]) => (
            <div key={name}>
              <span className="mono">{name}</span>
              <span>{result}</span>
            </div>
          ))}
        </div>
      ) : project.id === 'vector-db-benchmark' ? (
        <div className="card-benchmark">
          <div>
            <strong>5</strong>
            <span>Databases</span>
          </div>
          <div>
            <strong>14</strong>
            <span>Configurations</span>
          </div>
          <div>
            <strong>620</strong>
            <span>Measurements</span>
          </div>
          <p className="mono">SAME INPUT → SAME GROUND TRUTH</p>
        </div>
      ) : (
        <ul className="project-highlights">
          {project.highlights.map((item) => (
            <li key={item}>
              <Icon name="check" size={16} />
              {item}
            </li>
          ))}
        </ul>
      )}
      <div className="tags">
        {project.technologies.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </div>
      <div className="project-card-bottom">
        <a
          className="text-link"
          href={project.github}
          target="_blank"
          rel="noreferrer"
          aria-label={`${project.title} GitHub`}
        >
          <Icon name="github" size={16} />
          GitHub
          <Icon name="external" size={13} />
        </a>
        <button
          className="text-link detail-link"
          onClick={() => onOpen(project)}
          aria-label={`${project.title} 상세 보기`}
        >
          상세 보기
          <Icon name="arrow" size={16} />
        </button>
      </div>
    </article>
  )
}

export default function App() {
  const [selected, setSelected] = useState<Project | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const featured = projects[0]
  useEffect(() => {
    if (!menuOpen) return
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        document.getElementById('menu-toggle')?.focus()
      }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [menuOpen])

  return (
    <>
      <a className="skip-link" href="#main">
        본문 바로가기
      </a>
      <header className="site-header">
        <div className="nav-container">
          <a href="#" className="wordmark" aria-label="Catverdose 홈">
            <span className="brand-symbol">
              <Icon name="code" size={19} />
            </span>
            catverdose<span className="wordmark-dot">.</span>
          </a>
          <span className="nav-divider" aria-hidden="true">
            /
          </span>
          <span className="nav-descriptor mono">PORTFOLIO</span>
          <nav
            id="main-navigation"
            aria-label="주 메뉴"
            className={menuOpen ? 'main-nav is-open' : 'main-nav'}
          >
            <a href="#about" onClick={() => setMenuOpen(false)}>
              About
            </a>
            <a href="#projects" onClick={() => setMenuOpen(false)}>
              Projects
            </a>
            <a href="#stack" onClick={() => setMenuOpen(false)}>
              Stack
            </a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>
              Contact
            </a>
          </nav>
          <a
            href={profile.github}
            className="nav-github"
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="github" size={17} />
            <span>GitHub</span>
            <Icon name="external" size={13} />
          </a>
          <button
            id="menu-toggle"
            className="icon-button menu-toggle"
            aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </header>

      <main id="main" className="page-frame">
        <section className="hero section-inset" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="hero-eyebrow mono">
              <span className="small-cross" aria-hidden="true">
                +
              </span>{' '}
              BACKEND DEVELOPER
            </div>
            <h1 id="hero-title">
              동작을 넘어,
              <br />
              <span>신뢰할 수 있도록.</span>
            </h1>
            <p>
              동시 수정, 비동기 처리, 실시간 스트리밍.
              <br className="desktop-break" /> 데이터와 시스템 상태가 어긋나는
              경계를 파고듭니다.
              <br className="desktop-break" /> 재현 가능한 테스트와 측정으로
              정합성을 확인합니다.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">
                프로젝트 보기
                <Icon name="arrow" size={17} />
              </a>
              <a
                className="button button-secondary"
                href={profile.pdf}
                download="Catverdose-Backend-Portfolio.pdf"
              >
                <Icon name="download" size={17} />
                포트폴리오 PDF
              </a>
            </div>
            <a
              className="hero-github text-link"
              href={profile.github}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="github" size={15} />
              github.com/Catverdose
              <Icon name="external" size={13} />
            </a>
          </div>
          <HeroVisual />
          <div className="hero-footnote mono">
            <span>JAVA · SPRING BOOT · BACKEND ENGINEERING</span>
            <a href="#projects">
              EXPLORE THE WORK <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section
          id="about"
          className="focus-section"
          aria-label="개발자로서 집중하는 네 가지 영역"
        >
          {focusAreas.map((area, index) => (
            <div className="focus-item" key={area.title}>
              <div className="focus-top">
                <Icon name={area.icon} size={20} />
                <span className="mono">0{index + 1}</span>
              </div>
              <h2>{area.title}</h2>
              <p>{area.description}</p>
            </div>
          ))}
        </section>

        <section
          id="projects"
          className="projects-section section-inset"
          aria-labelledby="projects-title"
        >
          <div className="section-heading">
            <div>
              <div className="eyebrow">SELECTED WORK / 01—06</div>
              <h2 id="projects-title">문제에서 시작한 프로젝트.</h2>
              <p>무엇을 만들었는지, 왜 그렇게 설계했는지, 어떻게 확인했는지.</p>
            </div>
            <span className="section-side-note mono">
              6 PROJECTS
              <br />
              PROBLEM → DECISION → PROOF
            </span>
          </div>
          <article className="featured-project">
            <div className="featured-topbar">
              <span className="mono">
                <span className="featured-star" aria-hidden="true">
                  ✳
                </span>{' '}
                01 / FEATURED PROJECT
              </span>
              <span className="badge">개인 프로젝트</span>
            </div>
            <div className="featured-body">
              <div className="featured-copy">
                <span className="eyebrow">KNOWLEDGE, WITH EVIDENCE.</span>
                <h3>{featured.title}</h3>
                <p className="featured-description">
                  내 개발 기록을 근거로.
                  <br />
                  답변보다 먼저, 정합성부터.
                </p>
                <p className="featured-summary">
                  문서 색인부터 LLM 응답까지, 비동기 처리의 실패와 사용자 데이터
                  격리를 설계한 RAG 지식 어시스턴트입니다.
                </p>
                <div className="tags">
                  {featured.technologies.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
                <p className="featured-role">{featured.role}</p>
                <div className="featured-actions">
                  <button
                    className="button button-primary"
                    onClick={() => setSelected(featured)}
                    aria-label="Engineering Memory 상세 보기"
                  >
                    문제 해결 과정 보기
                    <Icon name="arrow" size={16} />
                  </button>
                  {featured.live ? (
                    <a
                      className="text-link"
                      href={featured.live}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Live demo
                      <Icon name="external" size={14} />
                    </a>
                  ) : (
                    <span className="demo-pending">데모 준비 중</span>
                  )}
                  <a
                    className="text-link"
                    href={featured.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Engineering Memory GitHub"
                  >
                    <Icon name="github" size={17} />
                    GitHub
                  </a>
                </div>
              </div>
              <Architecture />
            </div>
            <div className="featured-principles">
              <div>
                <Icon name="shield" size={17} />
                <span>
                  <strong>Stale write 차단</strong>
                  <span>version · status · attempt 검증</span>
                </span>
              </div>
              <div>
                <Icon name="activity" size={17} />
                <span>
                  <strong>실패 상태 복구</strong>
                  <span>GENERATING → FAILED</span>
                </span>
              </div>
              <div>
                <Icon name="database" size={17} />
                <span>
                  <strong>DB 수준 데이터 격리</strong>
                  <span>owner 기반 복합 FK</span>
                </span>
              </div>
            </div>
          </article>
          <div className="project-grid">
            {projects.slice(1).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={setSelected}
              />
            ))}
          </div>
        </section>

        <section
          id="stack"
          className="stack-section section-inset"
          aria-labelledby="stack-title"
        >
          <div className="section-heading">
            <div>
              <div className="eyebrow">TOOLS, IN CONTEXT</div>
              <h2 id="stack-title">기술은 문제를 푸는 수단.</h2>
              <p>이름을 나열하기보다, 어떤 책임을 맡겼는지 설명합니다.</p>
            </div>
            <Icon name="terminal" size={34} />
          </div>
          <div className="stack-list">
            {stack.map((item, index) => (
              <div className="stack-row" key={item.category}>
                <span className="stack-index mono">0{index + 1}</span>
                <h3>{item.category}</h3>
                <div>
                  <p>{item.technologies}</p>
                  <span>{item.context}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="contact"
          className="contact-section section-inset"
          aria-labelledby="contact-title"
        >
          <span className="eyebrow">LET’S BUILD RELIABLE SYSTEMS.</span>
          <h2 id="contact-title">
            더 자세한 이야기는
            <br />
            코드에 남겨두었습니다.
          </h2>
          <p>설계의 이유와 검증의 흔적을 저장소에서 확인해 보세요.</p>
          <div className="contact-actions">
            <a
              className="button button-primary"
              href={profile.github}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="github" size={18} />
              GitHub에서 만나기
              <Icon name="external" size={15} />
            </a>
            <a
              className="button button-secondary"
              href={profile.pdf}
              download="Catverdose-Backend-Portfolio.pdf"
            >
              <Icon name="download" size={18} />
              PDF 다운로드
            </a>
          </div>
          <span className="contact-signature mono">
            CATVERDOSE / BACKEND DEVELOPER
          </span>
        </section>
        <footer className="site-footer section-inset">
          <a className="footer-brand" href="#">
            catverdose.
          </a>
          <p>문제를 기록하고, 가설을 세우고, 검증합니다.</p>
          <a className="text-link" href="#">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </footer>
      </main>
      <ProjectDialog project={selected} onClose={() => setSelected(null)} />
    </>
  )
}
