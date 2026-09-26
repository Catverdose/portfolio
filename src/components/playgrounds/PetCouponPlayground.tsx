import { useState } from 'react'
import PlaygroundShell from './PlaygroundShell'

type StreamState = {
  sequence: number
  paused: boolean
  queue: number[]
  receivedB: number
  dropped: number
  status: string
}
const queueCapacity = 3
const batchSize = 5
const initialState: StreamState = {
  sequence: 0,
  paused: false,
  queue: [],
  receivedB: 0,
  dropped: 0,
  status:
    '두 구독자가 정상 수신 중입니다. B의 수신을 멈춘 뒤 로그를 보내면 큐 포화를 확인할 수 있습니다.',
}

export default function PetCouponPlayground() {
  const [state, setState] = useState<StreamState>(initialState)

  function send() {
    setState((previous) => {
      const events = Array.from(
        { length: batchSize },
        (_, index) => previous.sequence + index + 1,
      )
      const next = previous.sequence + batchSize
      const waiting = [...previous.queue, ...events]
      const dropped = previous.paused
        ? Math.max(0, waiting.length - queueCapacity)
        : 0
      const queue = previous.paused ? waiting.slice(-queueCapacity) : []
      return {
        ...previous,
        sequence: next,
        queue,
        receivedB: previous.receivedB + (previous.paused ? 0 : batchSize),
        dropped: previous.dropped + dropped,
        status: previous.paused
          ? `로그 #${events[0]}–#${next}: A는 ${batchSize}개 모두 전달했습니다. B는 최신 ${queue.length}개만 보관하고, 이번 전송에서 오래된 ${dropped}개를 버렸습니다.`
          : `로그 #${events[0]}–#${next}: A와 B에 각각 ${batchSize}개 모두 전달했습니다.`,
      }
    })
  }

  function togglePaused() {
    setState((previous) => ({
      ...previous,
      paused: !previous.paused,
      receivedB:
        previous.receivedB + (previous.paused ? previous.queue.length : 0),
      queue: previous.paused ? [] : previous.queue,
      status: previous.paused
        ? `B 수신 재개 · 보관된 ${previous.queue.length}개를 순서대로 전달했습니다. 이미 버린 로그는 복구하지 않습니다.`
        : 'B 수신 일시정지 · B의 전송만 지연되며 A와 로그 생성은 계속 진행합니다.',
    }))
  }

  return (
    <PlaygroundShell
      title="느린 구독자 하나가 전체 로그를 막지 않도록"
      description="B의 수신을 멈춘 뒤 로그 5개를 보내세요. B의 큐가 차도 A는 모두 수신하며, B는 오래된 이벤트를 버리는 비용을 확인할 수 있습니다."
      onReset={() => setState(initialState)}
      resetDisabled={state.sequence === 0 && !state.paused}
      footnote="화면의 수치는 큐 용량 3으로 단순화한 모델의 이벤트 수입니다. 실제 처리량·지연 측정값이 아닙니다. 구현은 구독자별 bounded queue와 전송 작업을 두고, 포화 시 오래된 이벤트를 버립니다."
      controls={
        <>
          <button
            type="button"
            className="pg-button"
            aria-pressed={state.paused}
            onClick={togglePaused}
          >
            {state.paused ? 'B 수신 재개' : 'B 수신 일시정지'}
          </button>
          <button type="button" className="pg-button primary" onClick={send}>
            로그 5개 보내기
          </button>
        </>
      }
    >
      <div className="pg-producer">
        <div>
          <span className="pg-label">APPLICATION LOG</span>
          <p className="pg-detail">
            로그 생성 → 각 구독자 큐에 non-blocking offer
          </p>
        </div>
        <strong>
          {state.sequence === 0 ? '전송 대기' : `LATEST #${state.sequence}`}
        </strong>
      </div>
      <div className="pg-grid">
        <div className="pg-card is-success">
          <span className="pg-label">SUBSCRIBER A</span>
          <h3>
            정상 수신 <span className="pg-pill success">연결 유지</span>
          </h3>
          <div className="pg-queue" aria-label="A의 큐: 비어 있음">
            {[0, 1, 2].map((slot) => (
              <span className="pg-queue-slot" key={slot}>
                비어 있음
              </span>
            ))}
          </div>
          <p className="pg-detail">
            들어온 이벤트를 즉시 소비합니다. B의 처리 상태를 기다리지 않습니다.
          </p>
          <dl className="pg-stats">
            <div className="pg-stat">
              <dt>전달</dt>
              <dd>{state.sequence}</dd>
            </div>
            <div className="pg-stat">
              <dt>대기</dt>
              <dd>0</dd>
            </div>
            <div className="pg-stat">
              <dt>유실</dt>
              <dd>0</dd>
            </div>
          </dl>
        </div>
        <div
          className={`pg-card ${state.paused ? 'is-warning' : 'is-success'}`}
        >
          <span className="pg-label">SUBSCRIBER B</span>
          <h3>
            {state.paused ? '느린 수신' : '정상 수신'}{' '}
            <span className={`pg-pill ${state.paused ? 'warning' : 'success'}`}>
              {state.paused ? '소비 일시정지' : '연결 유지'}
            </span>
          </h3>
          <div
            className="pg-queue"
            aria-label={`B의 큐: ${state.queue.length}개 대기`}
          >
            {[0, 1, 2].map((slot) => (
              <span
                className={`pg-queue-slot ${state.queue[slot] ? 'is-filled' : ''}`}
                key={slot}
              >
                {state.queue[slot] ? `#${state.queue[slot]}` : '비어 있음'}
              </span>
            ))}
          </div>
          <p className="pg-detail">
            {state.paused
              ? '큐가 차면 가장 오래된 이벤트를 버리고 최신 이벤트를 남깁니다.'
              : '수신을 멈추면 이 구독자의 큐에만 이벤트가 쌓입니다.'}
          </p>
          <dl className="pg-stats">
            <div className="pg-stat">
              <dt>전달</dt>
              <dd>{state.receivedB}</dd>
            </div>
            <div className="pg-stat">
              <dt>대기</dt>
              <dd>{state.queue.length}</dd>
            </div>
            <div className="pg-stat">
              <dt>유실</dt>
              <dd>{state.dropped}</dd>
            </div>
          </dl>
        </div>
      </div>
      <p className="pg-note" role="status" aria-live="polite" aria-atomic="true">
        {state.status}
      </p>
    </PlaygroundShell>
  )
}
