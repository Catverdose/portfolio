import { useEffect, useRef } from 'react'
import { Collaboration, Troubleshooting } from '../components/Notes'

/** 문제 해결과 협업의 상세 페이지입니다. 첫 화면에는 한 줄 요약만 있습니다. */
export default function NotesPage() {
  const title = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    title.current?.focus({ preventScroll: true })
  }, [])
  return (
    <main id="main" className="page project-page">
      <div className="container">
        <nav className="project-breadcrumb" aria-label="현재 위치">
          <a href="#troubleshooting">
            <span aria-hidden="true">←</span> 홈
          </a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">문제 해결과 협업</span>
        </nav>
        <header className="notes-page-header">
          <span className="eyebrow">NOTES</span>
          <h1 ref={title} tabIndex={-1}>
            문제 해결과 협업
          </h1>
        </header>
      </div>
      <Troubleshooting />
      <Collaboration />
    </main>
  )
}
