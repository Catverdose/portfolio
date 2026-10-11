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
import ProjectsPage from './pages/ProjectsPage'
import ExperimentsPage from './pages/ExperimentsPage'
import NotesPage from './pages/NotesPage'
import StackPage from './pages/StackPage'
import './pages/project-page.css'

const ProjectPage = lazy(() => import('./pages/ProjectPage'))
const isProjectRoute = (hash: string) => hash.startsWith('#/')

// 상단 메뉴가 여는 상세 페이지. 첫 화면에는 각 페이지의 요약만 있습니다.
const sectionPages = {
  '#/projects': { label: 'Projects', title: '프로젝트' },
  '#/experiments': { label: 'Experiments', title: '실험' },
  '#/troubleshooting': { label: 'Troubleshooting', title: '문제 해결과 협업' },
  '#/stack': { label: 'Stack', title: '기술 스택' },
} as const
type SectionHash = keyof typeof sectionPages
const sectionHashes = Object.keys(sectionPages) as SectionHash[]

export default function App() {
  const [hash, setHash] = useState(window.location.hash)
  const [menuOpen, setMenuOpen] = useState(false)
  const previousHash = useRef(hash)
  const fromProject = useRef(false)
  const homeSnapshot = useRef({ hash: '', scroll: 0, selector: '' })
  const id = /^#\/projects\/([a-z0-9-]+)$/.exec(hash)?.[1]
  const project = projects.find((item) => item.id === id)
  const detail = isProjectRoute(hash)
  const section = sectionHashes.find((item) => item === hash) ?? null
  // A project page keeps its parent menu item marked.
  const activeSection: SectionHash | null =
    section ??
    (project
      ? project.tier === 'experiment'
        ? '#/experiments'
        : '#/projects'
      : null)

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
      : section
        ? `${sectionPages[section].title} · Catverdose`
        : detail
          ? '페이지를 찾을 수 없습니다 · Catverdose'
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
  }, [hash, detail, section, project])

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
              <Icon name="code" size={16} />
            </span>
            catverdose<span className="wordmark-dot">.</span>
          </a>
          <span className="nav-divider" aria-hidden="true">
            /
          </span>
          <span className="nav-descriptor">Portfolio</span>
          <nav
            id="main-navigation"
            aria-label="주 메뉴"
            className={menuOpen ? 'main-nav is-open' : 'main-nav'}
          >
            {sectionHashes.map((href) => (
              <a
                key={href}
                href={href}
                aria-current={activeSection === href ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {sectionPages[href].label}
              </a>
            ))}
            <a href="#about" onClick={() => setMenuOpen(false)}>
              About
            </a>
          </nav>
          <a
            href={profile.github}
            className="nav-github"
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="github" size={16} />
            <span>GitHub</span>
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

      {section === '#/projects' ? (
        <ProjectsPage onOpen={openProject} />
      ) : section === '#/experiments' ? (
        <ExperimentsPage onOpen={openProject} />
      ) : section === '#/troubleshooting' ? (
        <NotesPage />
      ) : section === '#/stack' ? (
        <StackPage />
      ) : detail ? (
        project ? (
          <LoadBoundary key={project.id} label="프로젝트 페이지">
            <Suspense
              fallback={
                <main id="main" className="page load-state" role="status">
                  프로젝트를 불러오는 중입니다…
                </main>
              }
            >
              <ProjectPage key={project.id} project={project} />
            </Suspense>
          </LoadBoundary>
        ) : (
          <main id="main" className="page route-not-found">
            <div className="container">
              <span className="eyebrow">PAGE NOT FOUND</span>
              <h1>페이지를 찾을 수 없습니다.</h1>
              <p>프로젝트 목록에서 다시 선택해 주세요.</p>
              <a className="button button-primary" href="#/projects">
                프로젝트 목록으로
              </a>
            </div>
          </main>
        )
      ) : (
        <HomePage onOpen={openProject} />
      )}
    </>
  )
}
