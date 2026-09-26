import { useId, type ReactNode } from 'react'
import './playground.css'

type PlaygroundShellProps = {
  eyebrow?: string
  title: string
  description: string
  children: ReactNode
  controls?: ReactNode
  onReset?: () => void
  resetDisabled?: boolean
  footnote?: string
  disclaimer?: string
}

export default function PlaygroundShell({
  eyebrow = 'SYSTEM PLAYGROUND',
  title,
  description,
  children,
  controls,
  onReset,
  resetDisabled = false,
  footnote,
  disclaimer = '구현 원리를 설명하는 시뮬레이션 · 실제 서비스 실행이나 부하 측정이 아닙니다.',
}: PlaygroundShellProps) {
  const titleId = useId()

  return (
    <section className="playground" aria-labelledby={titleId}>
      <div className="pg-topline">
        <span>
          <i aria-hidden="true" />
          {eyebrow}
        </span>
        <span>INTERACTIVE</span>
      </div>
      <header className="pg-heading">
        <h2 id={titleId}>{title}</h2>
        <p>{description}</p>
        <span className="pg-disclaimer">{disclaimer}</span>
      </header>
      {(controls || onReset) && (
        <div className="pg-toolbar">
          <div className="pg-controls">{controls}</div>
          {onReset && (
            <button
              type="button"
              className="pg-button pg-reset"
              onClick={onReset}
              disabled={resetDisabled}
            >
              초기화
            </button>
          )}
        </div>
      )}
      <div className="pg-scene">{children}</div>
      {footnote && <p className="pg-footnote">{footnote}</p>}
    </section>
  )
}
