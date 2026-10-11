import Icon from './Icon'

/** Engineering Memory: 요청이 지나는 계층. Caddy는 배포 환경에서만 앞에 두었습니다. */
export default function Architecture() {
  return (
    <div
      className="architecture"
      aria-label="브라우저 요청이 nginx와 Go Gateway를 거쳐 Spring Boot, PostgreSQL과 Ollama로 가는 구조"
    >
      <div className="architecture-header mono">
        <span>REQUEST → RESPONSE</span>
        <Icon name="branch" size={16} />
      </div>
      <div className="architecture-flow">
        <div className="architecture-node">
          <Icon name="code" />
          <strong>Browser</strong>
          <span>바닐라 JS · SSE · WebSocket</span>
        </div>
        <span className="flow-line" aria-hidden="true" />
        <div className="architecture-node is-optional">
          <Icon name="shield" />
          <strong>Caddy</strong>
          <span>HTTPS · 배포 환경에서만</span>
        </div>
        <span className="flow-line" aria-hidden="true" />
        <div className="architecture-node">
          <Icon name="layers" />
          <strong>
            nginx <span className="node-plus">+</span> Go Gateway
          </strong>
          <span>스트리밍 전달 · 요청 제한</span>
        </div>
        <span className="flow-line" aria-hidden="true" />
        <div className="architecture-node architecture-core">
          <Icon name="terminal" />
          <strong>Spring Boot</strong>
          <span>인증 · 색인 · 대화</span>
        </div>
        <div className="flow-fork" aria-hidden="true" />
        <div className="architecture-branches">
          <div className="architecture-node">
            <Icon name="database" />
            <strong>PostgreSQL</strong>
            <span>pgvector · 사용자 격리</span>
          </div>
          <div className="architecture-node">
            <Icon name="layers" />
            <strong>Ollama</strong>
            <span>bge-m3 · EXAONE</span>
          </div>
        </div>
      </div>
      <div className="architecture-footer mono">
        ONE REQUEST. CLEAR RESPONSIBILITIES.
      </div>
    </div>
  )
}
