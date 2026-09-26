import { Component } from 'react'
import type { ReactNode } from 'react'

export default class LoadBoundary extends Component<
  { children: ReactNode; label: string },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="load-state load-error" role="alert">
        <strong>{this.props.label} 로딩에 실패했습니다.</strong>
        <p>연결을 확인한 뒤 다시 시도해 주세요.</p>
        <button
          className="button button-secondary"
          onClick={() => window.location.reload()}
        >
          다시 불러오기
        </button>
        <a className="text-link" href="#project-map">
          프로젝트 맵으로
        </a>
      </div>
    )
  }
}
