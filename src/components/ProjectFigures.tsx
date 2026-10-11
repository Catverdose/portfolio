import Icon from './Icon'

/** 프로젝트 목록과 상세 페이지에 두는 구조도와 팀 측정 결과입니다. */

/** UBot: 질문 하나가 모델 서버에 닿기까지. 2026-10 기준 구조입니다. */
export function ChatPipeline() {
  return (
    <div
      className="architecture"
      aria-label="질문이 Nginx와 채팅 서비스의 사전 검사를 거쳐 검색과 모델 서버로 가는 구조"
    >
      <div className="architecture-header mono">
        <span>ONE QUESTION, GUARDED</span>
        <Icon name="branch" size={16} />
      </div>
      <div className="architecture-flow">
        <div className="architecture-node">
          <Icon name="code" />
          <strong>질문</strong>
          <span>회원 JWT · 게스트 세션</span>
        </div>
        <span className="flow-line" aria-hidden="true" />
        <div className="architecture-node">
          <Icon name="layers" />
          <strong>Nginx</strong>
          <span>리버스 프록시 · 게스트 속도 제한</span>
        </div>
        <span className="flow-line" aria-hidden="true" />
        <div className="architecture-node architecture-core architecture-stack">
          <Icon name="terminal" />
          <strong>Spring Boot · 채팅</strong>
          <dl>
            <dt>모델을 부르기 전에</dt>
            <dd>
              금지어 검사 <em>차단 400</em>
            </dd>
            <dd>
              게스트 횟수 확인 <em>초과 429</em>
            </dd>
            <dt>통과하면</dt>
            <dd>FAQ 검색 · 답변 생성</dd>
          </dl>
        </div>
        <div className="flow-fork" aria-hidden="true" />
        <div className="architecture-branches">
          <div className="architecture-node">
            <Icon name="database" />
            <strong>pgvector</strong>
            <span>FAQ 검색 · 모델별 Profile</span>
          </div>
          <div className="architecture-node">
            <Icon name="layers" />
            <strong>Ollama | vLLM</strong>
            <span>임베딩 · LLM · AI_MODE</span>
          </div>
        </div>
      </div>
      <span className="diagram-note">
        배포 · GitHub Actions 수동 CD → EC2 Docker Compose
      </span>
      <div className="architecture-footer mono">FILTER FIRST. MODEL LAST.</div>
    </div>
  )
}

/** PetCoupon: 로그가 게이트와 구독자별 큐를 거쳐 관리자 화면으로 가는 구조입니다. */
export function MonitoringFlow() {
  return (
    <div
      className="monitoring-flow"
      aria-label="서버 로그가 게이트를 지나 구독자별 큐로 나뉘어 전송되는 구조"
    >
      <div className="architecture-header mono">
        <span>ISOLATING SLOW SUBSCRIBERS</span>
        <Icon name="branch" size={16} />
      </div>
      <div className="monitoring-origin">
        <Icon name="activity" />
        <strong>서버 로그</strong>
        <span>Logback appender · 인증 정보 마스킹</span>
      </div>
      <span className="flow-line" aria-hidden="true" />
      <div className="architecture-node">
        <Icon name="shield" />
        <strong>게이트</strong>
        <span>WARN · ERROR만 통과 · 자기 로그 제외</span>
      </div>
      <div className="monitoring-split" aria-hidden="true" />
      <div className="monitoring-lanes">
        <div>
          <span className="mono">구독자 A · 큐 50</span>
          <div className="queue-cells" aria-hidden="true">
            <i />
            <i />
            <i />
            <i className="is-empty" />
          </div>
          <strong>정상 수신</strong>
          <p>자신의 큐에서 따로 전송</p>
        </div>
        <div>
          <span className="mono">구독자 B · 느림</span>
          <div className="queue-cells is-full" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </div>
          <strong>가득 찬 큐</strong>
          <p>오래된 로그를 버리고 개수만 통지</p>
        </div>
      </div>
      <div className="monitoring-tradeoff">
        <Icon name="shield" size={16} />
        <p>
          모니터링 로그의 손실은 허용하고,
          <br />
          서비스 요청과 다른 구독자를 보호합니다.
        </p>
      </div>
      <span className="diagram-note">
        구현 구조 요약 · 실시간 모니터링 화면이 아닙니다.
      </span>
    </div>
  )
}

export function TeamMeasurement() {
  return (
    <div className="team-measurement">
      <div className="measurement-heading">
        <span className="eyebrow">TEAM LOAD TEST</span>
        <span>팀 전체 발급 파이프라인의 측정 결과</span>
      </div>
      <div className="measurement-values">
        <div>
          <strong>
            1,030 <small>TPS</small>
          </strong>
          <span>평균 접수 처리량</span>
        </div>
        <div>
          <strong>
            0 <small>건</small>
          </strong>
          <span>초과·중복 발급</span>
          <em className="metric-status is-met">정합성 목표 충족</em>
        </div>
        <div>
          <strong>
            16.31 <small>초</small>
          </strong>
          <span>접수 응답 p95 평균</span>
          <em className="metric-status is-missed">목표 0.5초 · 미달</em>
        </div>
        <div>
          <strong>
            220.5 <small>초</small>
          </strong>
          <span>DB 확정 완료까지 · 회차 평균</span>
        </div>
      </div>
      <p>
        AWS EC2 3대 · 20,000 VU · 재고 10,000개 · 시간·처리량은 2~5회 실행의
        평균. 접수 API는 202 응답 후 비동기로 발급을 확정하며, 접수 p95 목표
        500ms와 허용선 3초를 넘었습니다. Redis·Kafka 발급 파이프라인은 팀원이
        담당했습니다.
      </p>
    </div>
  )
}
