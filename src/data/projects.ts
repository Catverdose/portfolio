export type ProjectKind = 'PERSONAL' | 'TEAM' | 'EXPERIMENT'

export interface EvidenceLink {
  label: string
  href: string
  detail?: string
}

export interface CaseStudy {
  title: string
  problem: string
  decision: string
  verification: string
  tradeoff?: string
  evidence?: EvidenceLink[]
}

export interface Project {
  id: string
  number: string
  title: string
  kind: ProjectKind
  tier: 'featured' | 'experiment' | 'supporting'
  typeLabel: string
  description: string
  role: string
  /** Team projects only: size of my share, verifiable on GitHub */
  contribution?: string[]
  technologies: string[]
  highlights: string[]
  github: string
  live?: string
  overview: string
  cases: CaseStudy[]
  limitations: string
  evidence?: EvidenceLink
  proofs?: EvidenceLink[]
  relatedProjectIds?: string[]
}

export const profile = {
  name: 'Catverdose',
  github: 'https://github.com/Catverdose',
  email: 'eongpup@gmail.com',
  live: 'https://memory.catverdose.xyz',
  // 2026-09-26 확인: ENOTFOUND. 도메인 연결을 확인한 뒤 true로 변경합니다.
  liveAvailable: false,
}

export const projects: Project[] = [
  {
    id: 'engineering-memory',
    number: '01',
    title: 'Engineering Memory',
    kind: 'PERSONAL',
    tier: 'featured',
    typeLabel: '개인 프로젝트',
    description: '답변보다 먼저, 색인 상태와 사용자 데이터의 경계를 설계하다',
    role: '설계 · 구현 · 인프라 · 문서 전체',
    technologies: ['Spring Boot', 'Go', 'PostgreSQL', 'pgvector', 'Ollama'],
    highlights: [
      '비동기 색인의 stale write 차단',
      '사용자 격리를 검색 조건과 DB 제약으로 검증',
    ],
    github: 'https://github.com/Catverdose/engineering-memory',
    live: profile.liveAvailable ? profile.live : undefined,
    overview:
      '프로젝트 문서, 장애 기록, 기술 결정과 학습 노트를 저장하고 그 기록을 근거로 답합니다. 연결과 트래픽 제어는 nginx·Go Gateway가, 데이터 정합성과 도메인 규칙은 Spring Boot·PostgreSQL이 책임집니다. GCP L4 Spot 환경에 Docker와 NVIDIA runtime을 구성해 배포하고 색인·검색을 E2E로 검증했습니다.',
    cases: [
      {
        title: '늦게 끝난 색인이 최신 문서를 덮어쓰지 않도록',
        problem:
          '등록 API가 202 Accepted를 반환한 뒤 비동기 색인이 진행됩니다. 이 사이 문서가 수정되면 이전 작업의 embedding이 새 문서를 덮어쓸 수 있습니다.',
        decision:
          '저장 직전에 version·status·attempt UUID를 확인합니다. 일치하지 않으면 결과를 버리고 재색인을 예약합니다. 기존 chunk 삭제, 새 chunk 삽입, READY 전환은 한 트랜잭션으로 처리합니다.',
        verification:
          '같은 문서의 연속 요청을 합치고 최신 세대를 다시 처리하는지, 동시 처리 한도를 넘은 문서가 유실되지 않는지, 기동 시 PENDING 작업을 복구하는지 테스트합니다.',
        tradeoff:
          '오래된 계산 결과를 버리는 비용을 감수하고 저장 시점의 정합성을 우선했습니다. 실패한 색인은 자동 무한 재시도 대신 수동 재색인으로 복구합니다.',
        evidence: [
          {
            label: '색인 저장 경계 구현',
            href: 'https://github.com/Catverdose/engineering-memory/blob/main/backend/src/main/java/com/engineeringmemory/knowledge/service/DocumentIndexWriter.java',
            detail: 'version · PENDING 상태 · attempt UUID 확인 후 chunk 교체',
          },
          {
            label: '색인 큐·복구 테스트',
            href: 'https://github.com/Catverdose/engineering-memory/blob/main/backend/src/test/java/com/engineeringmemory/knowledge/service/DocumentIndexingServiceTest.java',
            detail: '동시 처리 한도, 동일 문서 coalescing, 기동 복구',
          },
        ],
      },
      {
        title: '답변 생성 도중 서버가 멈춰도 상태는 남도록',
        problem:
          'LLM 생성은 오래 걸릴 수 있습니다. 서버가 재기동되면 사용자가 끝나지 않는 답변을 보게 될 수 있습니다.',
        decision:
          'beginTurn에서 사용자 메시지와 GENERATING 답변을 먼저 저장합니다. completeTurn에서 답변과 근거를 확정하고, 기동 시 남은 GENERATING은 FAILED로 복구합니다.',
        verification:
          '유사도 0.45 이상인 근거가 없으면 NO_CONTEXT를 저장하고 LLM 호출을 생략합니다. 근거 없는 답변과 불필요한 GPU 사용을 함께 제한합니다.',
        tradeoff:
          '중단된 생성을 자동으로 이어 붙이지 않고 FAILED로 명시합니다. 근거가 부족한 질문에는 답변 생성을 생략하며, 검색 품질 개선은 다음 검증 과제입니다.',
        evidence: [
          {
            label: '대화 상태·장애 복구 설계',
            href: 'https://github.com/Catverdose/engineering-memory/blob/main/docs/architecture.md',
          },
        ],
      },
      {
        title: '사용자 데이터 격리를 DB까지 이어가기',
        problem:
          '하나의 DB를 공유하는 환경에서는 조회 조건의 실수 하나가 다른 사용자의 기록 노출로 이어질 수 있습니다.',
        decision:
          'owner ID는 인증 principal에서만 가져옵니다. 모든 조회에 owner 조건을 적용하고 (id, owner_id) 복합 FK로 교차 사용자 참조를 DB에서 거부합니다.',
        verification:
          '다른 사용자의 문서가 더 높은 유사도를 가져도 검색에 섞이지 않는지 테스트합니다. owner 필터가 LIMIT 전에 적용되는지, 다른 소유자의 chunk 수정과 교차 사용자 참조가 거부되는지도 확인합니다.',
        evidence: [
          {
            label: '사용자 경계 통합 테스트',
            href: 'https://github.com/Catverdose/engineering-memory/blob/main/backend/src/test/java/com/engineeringmemory/knowledge/repository/DocumentChunkVectorRepositoryIsolationTest.java',
            detail: '검색·수정·참조 경계와 owner 필터 적용 순서',
          },
        ],
      },
      {
        title: '모델 서버 한 대를 대화와 색인이 나눠 쓸 때',
        problem:
          '답변 생성과 문서 임베딩이 GPU 한 대의 Ollama를 함께 씁니다. 색인이 몰리면 대화가 늦어지고, 대화가 끊이지 않으면 색인이 끝없이 밀릴 수 있습니다. 요청이 한꺼번에 들어오면 모델 앞에 대기열이 쌓입니다.',
        decision:
          '대화는 동시 50건까지만 받고, 넘으면 기다리게 하지 않고 즉시 MODEL_BUSY로 거절합니다. 색인은 대화가 있으면 배치마다 최대 30초까지 양보한 뒤 진행합니다. IP별 요청 제한을 gateway와 backend에 따로 두고, 바깥 계층(nginx > gateway > backend > Ollama)일수록 timeout을 길게 잡아 안쪽이 먼저 끝나게 했습니다.',
        verification:
          '대화 중에는 색인이 비켜서고 마지막 대화가 끝나면 다시 도는지, 대화가 끊이지 않아도 색인이 굶지 않는지 테스트합니다. 설정 테스트로 운영 프로필이 요청 제한을 느슨하게 덮지 않는지, 프록시 헤더를 Docker 프로필에서만 신뢰하는지(IP 위조 방지), 스트림 timeout이 모델 timeout보다 긴지 고정했습니다.',
        tradeoff:
          '대화 응답성을 위해 색인 완료가 늦어질 수 있습니다. 양보에 30초 상한을 둬 색인이 굶지 않게 했고, 한도를 넘는 대화는 대기열에 쌓는 대신 거절해 지연이 누적되지 않게 했습니다.',
        evidence: [
          {
            label: '대화 우선·색인 양보 테스트',
            href: 'https://github.com/Catverdose/engineering-memory/blob/main/backend/src/test/java/com/engineeringmemory/llm/workload/ModelWorkloadGateTest.java',
            detail: '즉시 거절 · 양보 후 재개 · 색인 기아 방지',
          },
          {
            label: '운영 설정 안전장치 테스트',
            href: 'https://github.com/Catverdose/engineering-memory/blob/main/backend/src/test/java/com/engineeringmemory/ConfigYamlTest.java',
            detail: '요청 제한 · 프록시 헤더 신뢰 범위 · timeout 순서',
          },
          {
            label: 'timeout 사슬과 요청 제한 설계',
            href: 'https://github.com/Catverdose/engineering-memory/blob/main/docs/architecture.md',
          },
        ],
      },
    ],
    limitations:
      'Phase 1의 상태 관리와 데이터 격리를 구현했습니다. 실패한 색인은 수동 재색인으로 복구하며 DB 마이그레이션 도구는 미도입 상태입니다. 실제 질의 기반 검색 품질 평가는 다음 단계입니다.',
    evidence: {
      label: '아키텍처 문서',
      href: 'https://github.com/Catverdose/engineering-memory/blob/main/docs/architecture.md',
    },
    proofs: [
      {
        label: '사용자 격리 테스트',
        href: 'https://github.com/Catverdose/engineering-memory/blob/main/backend/src/test/java/com/engineeringmemory/knowledge/repository/DocumentChunkVectorRepositoryIsolationTest.java',
        detail: '다른 사용자의 문서가 검색 결과에 섞이지 않는지 확인',
      },
      {
        label: '색인 큐·복구 테스트',
        href: 'https://github.com/Catverdose/engineering-memory/blob/main/backend/src/test/java/com/engineeringmemory/knowledge/service/DocumentIndexingServiceTest.java',
        detail: '연속 수정·동시 작업·재기동 상황 재현',
      },
      {
        label: '대화 우선·색인 양보 테스트',
        href: 'https://github.com/Catverdose/engineering-memory/blob/main/backend/src/test/java/com/engineeringmemory/llm/workload/ModelWorkloadGateTest.java',
        detail: 'GPU 한 대에서 대화 지연과 색인 기아를 함께 막기',
      },
    ],
    relatedProjectIds: ['vector-db-benchmark'],
  },
  {
    id: 'petcoupon',
    number: '02',
    title: 'PetCoupon',
    kind: 'TEAM',
    tier: 'featured',
    typeLabel: '팀 · 백엔드 6명',
    description: '선착순 발급을 뒷받침하는 관리자 경합 처리와 운영 모니터링',
    role: '이벤트·쿠폰 관리 · 관리자 API · 스케줄러 · 모니터링',
    contribution: ['Merged PR 24개', '테스트 파일 50여 개', '통합 시나리오 16개 담당'],
    technologies: ['Spring Boot', 'JPA', 'MySQL', 'Redis', 'SSE'],
    highlights: [
      '관리자 수정과 발급·스케줄러의 경합 제어',
      'SSE 모니터링 오류의 자기증폭 차단',
    ],
    github: 'https://github.com/PetCare-Platform/petcoupon-backend',
    overview:
      '대량 요청에서도 초과 발급 없이 사용자당 한 장을 발급하는 팀 프로젝트입니다. Redis·Kafka 발급 파이프라인은 팀원이 담당했고, 저는 이벤트·쿠폰 관리와 관리자 운영·모니터링을 맡았습니다. 팀 부하 테스트는 AWS EC2 3대, 20,000 VU, 쿠폰 재고 10,000개 조건에서 수행했습니다. 반복 실행 2~5회의 접수 처리량 평균은 1,030 TPS, 접수 응답 p95 평균은 16.31초로 지연 목표에 미달했습니다. 202 접수 이후 비동기로 발급을 확정하며, DB 확정 완료 시간의 회차 평균은 220.5초였습니다.',
    cases: [
      {
        title: '여러 갱신 경로가 같은 데이터를 만날 때',
        problem:
          '관리자 수정, 발급 처리, 상태 스케줄러가 같은 이벤트·쿠폰을 동시에 갱신합니다. 변경 유실과 락 순서 차이에 따른 교착 가능성이 있습니다.',
        decision:
          '관리자 수정 경로를 PESSIMISTIC_WRITE로 직렬화하고 락 획득 순서를 통일했습니다. 상태 전이는 현재 상태를 조건에 둔 UPDATE로 중복 적용을 막았습니다.',
        verification:
          '통합 테스트 시나리오 16개로 관리자 경합과 상태 전이 등을 확인했습니다. 팀 공동 부하 테스트에서는 초과·중복 발급 0건을 기록했지만 접수 응답 p95의 회차 평균 16.31초로 500ms 목표와 3초 허용선을 넘었습니다. 처리량·지연·발급 정합성은 팀 전체 결과입니다.',
        tradeoff:
          '충돌하는 수정은 대기시키고 락 획득 순서를 통일했습니다. 발급의 정합성을 지킨 결과와 목표에 미달한 응답 지연을 구분해 기록합니다.',
        evidence: [
          {
            label: '팀 성과·부하 테스트 조건',
            href: 'https://github.com/PetCare-Platform/petcoupon-backend/blob/main/README.md',
            detail: '측정 환경, 반복 실행별 처리량·지연, 목표 대비 결과',
          },
          {
            label: '담당 범위와 기여 내역',
            href: 'https://github.com/PetCare-Platform/petcoupon-backend/blob/main/docs/contributors.md',
          },
        ],
      },
      {
        title: '모니터링 장애가 비즈니스 요청을 막지 않도록',
        problem:
          'SSE 연결 종료 → 예외 로깅 → 로그 재전송 → 전송 실패가 반복되며 오류가 스스로 증폭됐습니다. 느린 구독자도 로그를 쓰는 요청에 영향을 줄 수 있었습니다.',
        decision:
          '전송 실패의 feedback loop를 끊고 구독자마다 bounded queue와 전송 작업을 분리했습니다. 로그 생산자는 대기하지 않는 offer로 넣고, 큐가 차면 오래된 이벤트를 버립니다.',
        verification:
          '느린 구독자가 다른 구독자를 지연시키지 않는지, 로깅 스레드가 차단되지 않는지, 큐가 찼을 때 최신 이벤트를 유지하는지 테스트합니다. 여러 생산자가 동시에 넣을 때 빈자리를 다른 스레드가 먼저 차지하면 삽입이 빠지는 경쟁을 테스트로 찾아, 매 poll 뒤 다시 시도하도록 고쳤습니다. 손실은 events-dropped 이벤트와 dropped 지표로 알립니다.',
        tradeoff:
          '모니터링 이벤트의 완전한 전달보다 비즈니스 요청의 가용성을 우선했습니다. 손실을 숨기지 않고 클라이언트와 지표에 드러냅니다.',
        evidence: [
          {
            label: 'SSE 장애 격리 테스트',
            href: 'https://github.com/PetCare-Platform/petcoupon-backend/blob/main/src/test/java/com/mycom/petcoupon/monitoring/service/MonitoringSseServiceTest.java',
            detail: '느린 구독자 격리 · 비차단 로그 생산 · overflow 손실 통지',
          },
          {
            label: 'SSE 전송·큐 구현',
            href: 'https://github.com/PetCare-Platform/petcoupon-backend/blob/main/src/main/java/com/mycom/petcoupon/monitoring/service/MonitoringSseService.java',
          },
        ],
      },
      {
        title: 'Redis와 DB가 서로 다른 재고를 말할 때',
        problem:
          '발급 재고는 Redis가 실시간으로 판정하고 MySQL은 비동기로 확정합니다. 관리자가 쿠폰을 만들거나 수량을 바꿀 때 두 저장소가 어긋나면 발급이 막히거나 화면의 수치가 틀어집니다. 목록에서 쿠폰마다 Redis를 읽으면 왕복이 늘고, 한 건의 오류가 목록 전체를 실패시킵니다.',
        decision:
          '쿠폰 생성과 총수량 수정 때 Redis 발급 재고를 함께 초기화하고, Redis 초기화가 실패하거나 값이 되읽히지 않으면 DB 변경을 롤백합니다. 목록은 DB에 확정된 재고와 그 기준 시각(stockUpdatedAt)을, 단건 조회는 Redis 실시간 재고를 씁니다.',
        verification:
          '생성·수정 뒤 Redis 재고가 새 수량과 같은지 통합 테스트로 확인합니다. 목록 조회는 Hibernate 통계로 쿠폰 수만큼 쿼리가 늘지 않는지 고정했습니다.',
        tradeoff:
          'Redis는 DB 트랜잭션에 참여하지 않아 두 저장소가 하나의 원자적 트랜잭션으로 묶이지는 않습니다. Redis 쪽 실패는 롤백으로 막고, 목록 수치가 확정 시점만큼 늦는 것은 기준 시각으로 드러냅니다.',
        evidence: [
          {
            label: 'Redis 재고 동기화 통합 테스트',
            href: 'https://github.com/PetCare-Platform/petcoupon-backend/blob/main/src/test/java/com/mycom/petcoupon/coupon/controller/AdminCouponRedisStockSyncIntegrationTest.java',
            detail: '쿠폰 생성·총수량 수정 뒤 Redis 발급 재고 일치',
          },
          {
            label: '목록 조회 쿼리 수 테스트',
            href: 'https://github.com/PetCare-Platform/petcoupon-backend/blob/main/src/test/java/com/mycom/petcoupon/coupon/repository/CouponRepositoryCouponPageTest.java',
            detail: '쿠폰마다 추가 쿼리가 나가지 않는지 Hibernate 통계로 확인',
          },
        ],
      },
      {
        title: '관리자 인증이 설정 실수로 열리지 않도록',
        problem:
          '관리자 API는 이벤트·쿠폰 수정과 운영 모니터링을 엽니다. 인증 코드가 비어 있거나 토큰 원문이 저장소에 남으면, 설정 실수나 저장소 노출이 곧 관리자 권한 노출로 이어집니다.',
        decision:
          '세션 토큰은 원문 대신 해시로 Redis에 저장하고 TTL을 적용합니다. 인증 코드는 상수 시간 비교로 확인하고, 빈 값으로 설정되면 세션 발급을 거절합니다. 모니터링 SSE로 나가는 로그에서는 관리자 키·쿠키 같은 인증 정보를 마스킹했습니다.',
        verification:
          '토큰이 해시로만 저장되는지, 폐기한 세션만 무효화되고 다른 세션은 유지되는지, 인증 코드가 비어 있으면 입력값과 무관하게 발급이 거절되는지 테스트합니다.',
        tradeoff:
          '인증 코드 하나로 세션을 발급하는 구조라 관리자 계정별 권한 구분은 없습니다. 환경변수가 없으면 개발용 기본 코드가 적용되므로 배포 전에 반드시 교체해야 합니다.',
        evidence: [
          {
            label: '관리자 세션 테스트',
            href: 'https://github.com/PetCare-Platform/petcoupon-backend/blob/main/src/test/java/com/mycom/petcoupon/global/auth/service/AdminSessionServiceImplTest.java',
            detail: '해시 저장 · TTL · 세션별 폐기',
          },
          {
            label: '인증 코드 누락 시 거절 테스트',
            href: 'https://github.com/PetCare-Platform/petcoupon-backend/blob/main/src/test/java/com/mycom/petcoupon/global/auth/service/AdminSessionAuthCodeMissingTest.java',
          },
        ],
      },
    ],
    limitations:
      '관리자 인증은 단일 인증 코드 기반이라 계정별 권한이 없습니다. 확정 처리량(Stream Consumer 단일 스레드)과 접수 응답 p95는 팀 차원에서 남은 과제입니다.',
    evidence: {
      label: '직접 기여한 PR',
      href: 'https://github.com/PetCare-Platform/petcoupon-backend/pulls?q=is%3Apr+is%3Amerged+author%3ACatverdose',
    },
    proofs: [
      {
        label: '느린 구독자 격리 테스트',
        href: 'https://github.com/PetCare-Platform/petcoupon-backend/blob/main/src/test/java/com/mycom/petcoupon/monitoring/service/MonitoringSseServiceTest.java',
        detail: '모니터링 장애가 비즈니스 요청에 번지지 않는지 확인',
      },
      {
        label: '본인 기여 범위',
        href: 'https://github.com/PetCare-Platform/petcoupon-backend/blob/main/docs/contributors.md',
        detail: '이벤트·쿠폰 관리, 관리자 운영, 모니터링',
      },
    ],
    relatedProjectIds: ['concurrency'],
  },
  {
    id: 'concurrency',
    number: '03',
    title: 'Coupon Concurrency',
    kind: 'EXPERIMENT',
    tier: 'experiment',
    typeLabel: '개인 실험 · 팀 실험 확장',
    description: '초과 발급이 없어도 깨지는 동시성 제어의 경계',
    role: '9개 전략 설계 · 구현 · 측정 · 분석',
    technologies: ['Java 21', 'MySQL', 'Redis', 'k6'],
    highlights: [
      'lost update·정상 회원 탈락·연결 고갈 재현',
      '응답·재고 원장·대상자 발급을 함께 검증',
    ],
    github: 'https://github.com/Catverdose/concurrency-strategies',
    overview:
      '같은 발급 흐름에서 재고 예약 전략만 바꿔 9개를 비교했습니다. 10,000명이 서로 다른 requestId로 세 번씩 요청하자 1인 1매는 모든 전략이 지켰지만, 대상자 전원 발급·응답 분류·재고 원장까지 통과한 전략은 단일 인스턴스의 JVM_LOCK뿐이었습니다. 팀 실험에서 맡았던 Direct·Pessimistic 비교를 개인적으로 확장한 실험입니다.',
    cases: [
      {
        title: '최종 재고가 맞아도 정상 회원은 탈락할 수 있다',
        problem:
          '동일 회원의 동시 요청이 사전 중복 조회를 함께 통과하면 Redis 재고를 각각 예약합니다. DB 유니크 충돌 후 보상되기 전까지 일시 품절이 발생합니다.',
        decision:
          '초과 발급 여부뿐 아니라 대상자 전원 발급, 응답 분류, 재고 원장의 세 기준을 분리해 검사했습니다.',
        verification:
          'VU 50에서 DECR는 9,999명, LUA는 9,998명에게 발급됐습니다. 최종 원장은 일치했지만 정상 회원의 탈락을 확인했습니다.',
        tradeoff:
          '관찰된 원인은 중복 확인보다 재고 예약이 먼저 일어나는 순서입니다. 중복 확인과 예약을 하나의 Lua 실행으로 묶은 변형은 아직 측정하지 않았고, 다음 검증 과제로 남겼습니다.',
        evidence: [
          {
            label: '중복 회원 정순 실험 보고서',
            href: 'https://github.com/Catverdose/concurrency-strategies/blob/main/k6/results/r0816dup1/duplicate-user-report.md',
            detail: '대상 회원 10,000명 · 각 3회 요청 · VU 50',
          },
        ],
      },
      {
        title: 'WATCH 재시도가 연결을 소진하는 구조',
        problem:
          '충돌 재시도마다 Redis 연결을 새로 만들고 닫으면서 TIME_WAIT가 약 14,900개까지 증가했습니다. 로컬 동적 포트 16,384개에 근접했습니다.',
        decision:
          '다른 전략의 실험을 오염시키지 않도록 WATCH만 단독 실행해 원인을 분리했습니다.',
        verification:
          'VU 10·50·100·200에서 재현했습니다. 정순 보고서의 VU 50 단독 실행에서는 30,000 요청 중 27,000건이 전송에 실패했습니다. 역순 재실행에서도 같은 실패 유형을 관찰했습니다.',
        tradeoff:
          '이 결과는 현재 연결 관리 구현과 로컬 실행 환경에 한정됩니다. Redis WATCH 자체의 한계로 일반화하지 않고 연결 재사용 개선 후 재측정이 필요합니다.',
        evidence: [
          {
            label: 'WATCH 연결 고갈 재현 결과',
            href: 'https://github.com/Catverdose/concurrency-strategies/blob/main/k6/results/r0816dup1/duplicate-user-report.md',
            detail: '전송 실패·TIME_WAIT 관찰값과 성능 비교 제외 이유',
          },
        ],
      },
    ],
    limitations:
      '로컬 단일 호스트의 1차 실험입니다. 조건별 1회와 역순 재실행 결과로 성능 순위를 확정하지 않았습니다. JVM_LOCK의 통과도 단일 인스턴스 조건에 한정됩니다.',
    proofs: [
      {
        label: '실험 보고서·원시 결과',
        href: 'https://github.com/Catverdose/concurrency-strategies/blob/main/k6/results/r0816dup1/duplicate-user-report.md',
        detail: '정순 실험의 응답 분포·재고 원장·발급 대상 검증',
      },
    ],
    relatedProjectIds: ['petcoupon'],
  },
  {
    id: 'vector-db-benchmark',
    number: '04',
    title: 'Vector DB Benchmark',
    kind: 'EXPERIMENT',
    tier: 'experiment',
    typeLabel: 'UBot · 단독 수행',
    description: '같은 검색 품질에서 비교하고, 운영 복잡도까지 따져 고르기',
    role: 'Benchmark harness 설계 · 구현 · 측정 · 분석',
    technologies: ['pgvector', 'Qdrant', 'Milvus', 'Weaviate', 'OpenSearch'],
    highlights: [
      '5개 DB · 14개 구성 · 620 measurements',
      'Recall을 먼저 확인하고 지연·처리량 비교',
    ],
    github: 'https://github.com/ureca-UBot/UBot-VertorDBTest',
    overview:
      'RAG 서비스의 Vector DB 후보를 비교하는 harness입니다. 합성 10k chunk, BGE-M3 dense 1024d, cosine Top-10, 동시성 10 조건에서 DB별 4 vCPU·8 GiB를 고정했습니다. 5개 DB·14개 구성의 검색 설정 124개를 독립 재구축 5회, 총 620회 측정했습니다. 성능은 Qdrant가 가장 좋았지만, 팀은 운영 복잡도를 줄이기 위해 이미 쓰고 있는 PostgreSQL의 pgvector를 선택했습니다.',
    cases: [
      {
        title: '가장 빠른 Qdrant 대신 pgvector를 고른 이유',
        problem:
          '같은 Recall에서 가장 빠른 DB는 Qdrant였습니다. 하지만 서비스는 이미 PostgreSQL을 쓰고 있어, 벡터 DB를 따로 두면 운영하고 데이터를 맞춰야 할 저장소가 하나 늘어납니다.',
        decision:
          '예상 규모(1천~1만 청크)에서 pgvector의 p95가 수십 ms 안에 머무는 것을 확인하고, 복잡성을 줄이기 위해 기존 PostgreSQL의 pgvector를 선택했습니다.',
        verification:
          'Recall 0.99 이상에서 Qdrant HNSW는 p95 4.1ms · 3,402 QPS, pgvector HNSW는 32.2ms · 1,601 QPS였습니다. Recall 0.95 이상에서는 3.9ms 대 7.3ms였습니다. 합성 1만 청크 · 동시성 10에서 5회 재구축한 중앙값입니다.',
        tradeoff:
          '같은 Recall에서 검색 지연은 Qdrant보다 2~8배 깁니다. 데이터가 커지거나 검색 지연이 응답 시간의 병목이 되면 다시 비교합니다.',
        evidence: [
          {
            label: '124개 설정 수치 부록',
            href: 'https://github.com/ureca-UBot/UBot-VertorDBTest/blob/dev/docs/07-results/assets/fairness-v2-20260912-1826/parameter-statistics.md',
            detail: 'DB·인덱스·검색 설정별 Recall · p95 · QPS',
          },
        ],
      },
      {
        title: '비교 전에 입력과 정답부터 고정',
        problem:
          '입력 데이터나 검색 품질이 다르면 latency 비교만으로는 서비스에 적합한 DB를 결정할 수 없습니다.',
        decision:
          '입력은 SHA-256으로 검증하고 Java exact cosine search를 Ground Truth로 사용했습니다. Calibration query와 evaluation query를 분리했습니다.',
        verification:
          'Recall@10, latency, QPS, CPU, RAM, index readiness를 함께 수집했습니다. 각 측정점에서 자원 샘플을 30개 이상 기록했습니다.',
        tradeoff:
          '같은 검색 품질 구간에서 지연과 처리량을 비교합니다. 합성 데이터에서 빠른 구성을 실제 서비스의 최종 선택으로 확정하지 않았습니다.',
        evidence: [
          {
            label: '공정 비교 조건과 산포도',
            href: 'https://github.com/ureca-UBot/UBot-VertorDBTest/blob/dev/docs/07-results/fairness-v2-results-20260913.md',
            detail: '124개 검색 설정 × 독립 재구축 5회',
          },
        ],
      },
      {
        title: '불리한 측정도 결과에서 지우지 않기',
        problem:
          '이상치와 warm-up 미달을 제거하면 실제 변동성이 가려지고 특정 구성이 과대평가될 수 있습니다.',
        decision:
          '원시 JSON·CSV와 워밍업 경고 170건을 보존했습니다. 보고서의 후보 해석에서는 합의되지 않은 Recall·p95·RAM 자동 탈락 기준을 적용하지 않았으며, 원시 판정과 코드 기본값은 보존했습니다.',
        verification:
          'Milvus DISKANN은 5회 관찰에서 Recall 변동이 있었고, 원인을 확인하기 전까지 경고와 함께 결과에 남겼습니다. 검색 실패·응답 계약 위반·자원 수집 누락은 0건이었습니다.',
        evidence: [
          {
            label: '변동성·warning·해석 제한',
            href: 'https://github.com/ureca-UBot/UBot-VertorDBTest/blob/dev/docs/07-results/fairness-v2-results-20260913.md',
          },
        ],
      },
    ],
    limitations:
      '합성 1만 청크 · Top-10 · 동시성 10 조건의 결과입니다. 실제 서비스 데이터와 1천 청크 규모는 측정하지 않았고, 실데이터에서 pgvector의 검색 품질을 확인하는 것이 다음 단계입니다.',
    proofs: [
      {
        label: '620회 측정 보고서',
        href: 'https://github.com/ureca-UBot/UBot-VertorDBTest/blob/dev/docs/07-results/fairness-v2-results-20260913.md',
        detail: '검색 품질·지연·처리량과 반복 측정의 변동성',
      },
    ],
    relatedProjectIds: ['ubot', 'engineering-memory'],
  },
  {
    id: 'ubot',
    number: '05',
    title: 'UBot Backend',
    kind: 'TEAM',
    tier: 'supporting',
    typeLabel: '팀 프로젝트',
    description: '통신사 고객 상담용 RAG 챗봇의 개발·테스트·배포 기반',
    role: '로컬·CI 환경 · 테스트 격리 · 배포 이미지 · API 문서',
    contribution: ['Merged PR 7개'],
    technologies: [
      'PostgreSQL',
      'PostGIS',
      'Flyway',
      'Testcontainers',
      'Docker',
    ],
    highlights: [
      '로컬·CI가 같은 PostgreSQL 이미지 사용',
      '실제 vector 검색과 공간 함수를 CI에서 검증',
      'Java 21 multi-stage 이미지 · 배포 Compose · Swagger',
    ],
    github: 'https://github.com/ureca-UBot/UBot-BE',
    overview:
      'FAQ 벡터 검색과 LLM 답변, PostGIS 매장 근접 검색을 제공하는 서비스입니다. 핵심 기능이 PostgreSQL 확장에 의존하므로 팀 누구나 같은 환경에서 실행하고 검증하는 기반을 구성했습니다. 배포용 Docker 이미지와 Compose, Swagger API 문서까지 같은 구성으로 이어지게 맞췄습니다.',
    cases: [
      {
        title: '내 컴퓨터와 CI에서 같은 기능을 검증하기',
        problem:
          'pgvector와 PostGIS를 다른 DB로 대체하면 실제 확장 함수의 동작과 환경 차이를 검증할 수 없습니다.',
        decision:
          '로컬 Compose와 CI가 같은 PostgreSQL Dockerfile을 사용합니다. Extension 생성은 Flyway로 통일하고 Testcontainers로 독립 DB를 생성합니다.',
        verification:
          'CI에서 실제 vector 저장·검색과 PostGIS spatial function을 실행합니다. Java 21 multi-stage 이미지로 빌드 도구와 실행 환경도 분리했습니다.',
        tradeoff:
          'DB 확장은 실제 이미지로 검증하고 임베딩 모델은 결정적인 테스트 대역을 사용합니다. 이 테스트의 범위는 DB 통합이며 모델의 검색 품질은 별도 실험으로 다룹니다.',
        evidence: [
          {
            label: '독립 DB·임베딩 테스트 설정',
            href: 'https://github.com/ureca-UBot/UBot-BE/blob/develop/src/test/java/com/ubot/PgvectorTestConfiguration.java',
          },
          {
            label: '테스트·빌드 CI',
            href: 'https://github.com/ureca-UBot/UBot-BE/blob/develop/.github/workflows/ci.yml',
          },
        ],
      },
    ],
    limitations:
      '이 프로젝트에서 제 기여는 팀 개발·테스트 실행 기반입니다. RAG와 상담 기능 전체를 개인 성과로 주장하지 않습니다.',
    proofs: [
      {
        label: '로컬과 CI의 DB 환경 통일',
        href: 'https://github.com/ureca-UBot/UBot-BE/blob/develop/src/test/java/com/ubot/PgvectorTestConfiguration.java',
        detail: '공유 Dockerfile · 테스트별 독립 컨테이너',
      },
      {
        label: '직접 기여한 PR',
        href: 'https://github.com/ureca-UBot/UBot-BE/pulls?q=is%3Apr+is%3Amerged+author%3ACatverdose',
        detail: '개발·테스트 환경과 배포 이미지 변경 내역',
      },
    ],
    relatedProjectIds: ['vector-db-benchmark'],
  },
  {
    id: 'planly',
    number: '06',
    title: 'Planly',
    kind: 'PERSONAL',
    tier: 'supporting',
    typeLabel: '3인 팀 → 개인 확장',
    description: 'Todo와 공유 Calendar를 연결한 일정 관리 서비스',
    role: '팀 프로젝트 인수 · 구조 재편 · 기능 확장',
    technologies: ['Spring Boot', 'JWT', 'MySQL', 'React'],
    highlights: [
      'Todo–Schedule 연동과 리소스 소유권 검증',
      '검색·필터·페이지네이션·하위 Todo 계층',
    ],
    github: 'https://github.com/Catverdose/planly-web',
    overview:
      '3인 팀 미니 프로젝트를 개인 저장소로 이어받아 재구성했습니다. 단일 Spring Boot 프로젝트를 backend/frontend로 분리하고 React SPA를 구성했습니다.',
    cases: [
      {
        title: '기본 CRUD에서 권한과 관계를 가진 서비스로',
        problem:
          '공유 일정과 개인 Todo가 연결되면서 인증 여부만으로는 각 리소스에 대한 접근 권한을 판단할 수 없었습니다.',
        decision:
          'JWT 인증에 리소스 소유권 검증을 추가했습니다. Todo–Schedule 연동, 이메일 기반 멤버 관리, 하위 Todo와 Eisenhower Matrix 분류로 확장했습니다.',
        verification:
          '기존 팀 범위인 기본 CRUD·완료 처리·JWT 인증과, 개인 확장 범위인 구조 분리·소유권·검색·분류·일정 연동을 구분해 저장소에 정리했습니다.',
        evidence: [
          {
            label: 'Todo–Schedule 연동 구현',
            href: 'https://github.com/Catverdose/planly-web/blob/main/backend/src/main/java/com/example/demo/todo/service/TodoScheduleLinkService.java',
            detail: '사용자 범위 조회와 트랜잭션, 중복 연결 충돌 처리',
          },
          {
            label: '기존 팀 범위와 개인 확장',
            href: 'https://github.com/Catverdose/planly-web/blob/main/README.md',
          },
        ],
      },
    ],
    limitations:
      '기존 팀 프로젝트와 개인 확장 범위를 구분해 기재했습니다. 현재는 구현과 범위 설명을 근거로 제시하며, 일정 연동·권한 경계를 다루는 회귀 테스트는 보강할 과제입니다.',
    proofs: [
      {
        label: '개인 확장 범위 확인',
        href: 'https://github.com/Catverdose/planly-web/blob/main/README.md',
        detail: '기존 팀 기능과 이후 구조·기능 확장 구분',
      },
    ],
    relatedProjectIds: ['petcoupon'],
  },
]

export const concurrencyRun = {
  label: 'r0816dup1 · 중복 회원 정순 실험',
  conditions:
    '회원 10,000명 × 서로 다른 requestId로 3회 요청 · 재고 10,000개 · VU 50 · 단일 애플리케이션 인스턴스',
  source:
    'https://github.com/Catverdose/concurrency-strategies/blob/main/k6/results/r0816dup1/duplicate-user-report.md',
  note: '2026-08-16 정순 보고서 기준입니다. WATCH 행은 보고서에 통합된 r0816dup2w 단독 재실행 결과입니다. 조건별 1회 관찰이며, 로컬 단일 호스트 결과를 일반적인 전략 순위로 해석하지 않습니다.',
}

export const concurrencyResults = [
  ['JVM_LOCK', '10,000', '일치', '일치', '통과'],
  ['PESSIMISTIC', '10,000', '중복 2건 → SOLD_OUT', '일치', '실패'],
  ['CONDITIONAL', '10,000', '중복 2건 → SOLD_OUT', '일치', '실패'],
  ['DIRECT', '10,000', '일치', '차감 2,508 / 발급 10,000', '실패'],
  ['REDIS_DECR', '9,999', '일시 SOLD_OUT 13건', '일치', '실패'],
  ['REDIS_LUA', '9,998', '일시 SOLD_OUT 13건', '일치', '실패'],
  ['REDIS_LOCK', '10,000', '품절 9 / 내부 오류 312건', '일치', '실패'],
  ['OPTIMISTIC', '9,999', '내부 오류 14건', '일치', '실패'],
  ['REDIS_WATCH', '945', '전송 실패 27,000건', '일치', '실패'],
]

// primary: 주력 (GitHub 프로필 README와 같은 기준), used: 프로젝트에서 사용한 경험
export const stack: {
  category: string
  primary: string[]
  used: string[]
  context: string
}[] = [
  {
    category: 'Backend',
    primary: ['Java 21', 'Spring Boot', 'JPA'],
    used: ['Go', 'SSE'],
    context: '트랜잭션 경계와 도메인 규칙, 연결·트래픽 제어',
  },
  {
    category: 'Database',
    primary: ['PostgreSQL', 'MySQL'],
    used: ['Redis', 'pgvector', 'PostGIS', 'Flyway'],
    context: 'DB 제약과 동시성 제어, 벡터·공간 검색',
  },
  {
    category: 'Infrastructure',
    primary: [],
    used: ['Docker', 'Testcontainers', 'GitHub Actions', 'Nginx', 'GCP'],
    context: '로컬·CI 환경 일치, 컨테이너 배포와 GPU runtime',
  },
  {
    category: 'AI / RAG',
    primary: [],
    used: ['Ollama', 'bge-m3', 'EXAONE', 'Vector Search'],
    context: '문서 색인, 근거 검색과 답변 생성의 상태 관리',
  },
  {
    category: 'Verification',
    primary: [],
    used: ['JUnit', 'k6', 'Integration Test', 'Benchmark Harness'],
    context: '경합 재현, 회귀 검증과 공정한 비교 실험',
  },
]
