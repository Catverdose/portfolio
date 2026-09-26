import {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { profile, projects } from './data/projects'
import type { Project } from './data/projects'
import Icon from './components/Icon'
import LoadBoundary from './components/LoadBoundary'
import HomePage from './pages/HomePage'
import './pages/project-page.css'

const ProjectPage = lazy(() => import('./pages/ProjectPage'))
const isProjectRoute = (hash: string) => hash.startsWith('#/')

export default function App() {
  const [hash, setHash] = useState(window.location.hash)
  const [menuOpen, setMenuOpen] = useState(false)
  const previousHash = useRef(hash)
  const fromProject = useRef(false)
  const homeSnapshot = useRef({ hash: '', scroll: 0, selector: '' })
  const id = /^#\/projects\/([a-z0-9-]+)$/.exec(hash)?.[1]
  const project = projects.find((item) => item.id === id)
  const detail = isProjectRoute(hash)

  useEffect(() => {
    const navigate = () => {
      const nextHash = window.location.hash
      fromProject.current = isProjectRoute(previousHash.current)
      if (!fromProject.current && isProjectRoute(nextHash)) {
        const element = document.activeElement
        const label = element?.getAttribute('aria-label')
        const href = element?.getAttribute('href')
        homeSnapshot.current = {
          hash: previousHash.current,
          scroll: window.scrollY,
          selector: label
            ? `[aria-label="${CSS.escape(label)}"]`
            : href
              ? `a[href="${CSS.escape(href)}"]`
              : '',
        }
      }
      previousHash.current = nextHash
      setMenuOpen(false)
      setHash(nextHash)
    }
    window.addEventListener('hashchange', navigate)
    return () => window.removeEventListener('hashchange', navigate)
  }, [])

  useLayoutEffect(() => {
    document.title = project
      ? `${project.title} · Catverdose`
      : detail
        ? '프로젝트를 찾을 수 없습니다 · Catverdose'
        : 'Catverdose · Backend Developer'
    const frame = requestAnimationFrame(() => {
      if (detail) {
        window.scrollTo({ top: 0, behavior: 'instant' })
      } else if (fromProject.current && hash === homeSnapshot.current.hash) {
        window.scrollTo({
          top: homeSnapshot.current.scroll,
          behavior: 'instant',
        })
        if (homeSnapshot.current.selector) {
          const elements = document.querySelectorAll<HTMLElement>(
            homeSnapshot.current.selector,
          )
          Array.from(elements)
            .find((element) => element.getClientRects().length)
            ?.focus({ preventScroll: true })
        }
      } else if (hash) {
        document
          .getElementById(hash.slice(1))
          ?.scrollIntoView({ behavior: 'instant' })
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [hash, detail, project])

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

  const openProject = (selected: Project) => {
    window.location.hash = `/projects/${selected.id}`
  }
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault()
          const main = document.getElementById('main')
          main?.setAttribute('tabindex', '-1')
          main?.focus({ preventScroll: true })
          main?.scrollIntoView({ behavior: 'instant' })
        }}
      >
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
            <a href="#experiments" onClick={() => setMenuOpen(false)}>
              Experiments
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

      {detail ? (
        project ? (
          <LoadBoundary key={project.id} label="프로젝트 페이지">
            <Suspense
              fallback={
                <main id="main" className="page-frame load-state" role="status">
                  프로젝트를 불러오는 중입니다…
                </main>
              }
            >
              <ProjectPage key={project.id} project={project} />
            </Suspense>
          </LoadBoundary>
        ) : (
          <main id="main" className="page-frame route-not-found">
            <span className="eyebrow">PROJECT NOT FOUND</span>
            <h1>프로젝트를 찾을 수 없습니다.</h1>
            <p>프로젝트 맵에서 다시 선택해 주세요.</p>
            <a className="button button-primary" href="#project-map">
              프로젝트 맵으로
            </a>
          </main>
        )
      ) : (
        <HomePage onOpen={openProject} />
      )}
    </>
  )
}
