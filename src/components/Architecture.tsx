import Icon from './Icon'

export default function Architecture() {
  return (
    <div className="architecture">
      <div className="architecture-header mono">
        <span>REQUEST → RESPONSE</span>
        <Icon name="branch" size={16} />
      </div>
      <div className="architecture-flow">
        <div className="architecture-node">
          <Icon name="code" />
          <strong>Browser</strong>
          <span>Frontend</span>
        </div>
        <span className="flow-line" aria-hidden="true" />
        <div className="architecture-node">
          <Icon name="layers" />
          <strong>
            nginx <span className="node-plus">+</span> Go Gateway
          </strong>
          <span>TLS · Traffic · Stream</span>
        </div>
        <span className="flow-line" aria-hidden="true" />
        <div className="architecture-node architecture-core">
          <Icon name="terminal" />
          <strong>Spring Boot</strong>
          <span>Auth · Indexing · Chat</span>
        </div>
        <div className="flow-fork" aria-hidden="true" />
        <div className="architecture-branches">
          <div className="architecture-node">
            <Icon name="database" />
            <strong>PostgreSQL</strong>
            <span>pgvector · Knowledge</span>
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
